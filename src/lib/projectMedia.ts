/**
 * What media a project actually has, resolved at build time.
 *
 * The overlay on / discovers this in the browser: it constructs
 * /projects/<id>/0.mp4, 1.png, 2.png … and hangs an onerror handler off each
 * one to find out which exist. That works, but it means every project page
 * would fire a dozen requests that are expected to 404, and a real page needs
 * its <img> and <video> tags to be right in the HTML — a crawler and a Slack
 * unfurl never run the fallback handlers.
 *
 * So the same convention is read off disk instead, once, during the build:
 *
 *   0.mp4          hero video, in public/ or assets-r2/ (see ./assets)
 *   0.png|jpg      poster for that video, and the video-less fallback
 *   1..12.png|jpg  gallery stills, in order, stopping at the first gap
 *
 * An absent file resolves to null and the markup for it is never emitted,
 * which is why the page has no broken references while its slots sit empty.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assetUrl, OFFLOADED_ASSETS } from './assets';

/**
 * public/ resolved defensively.
 *
 * `new URL('../../public', import.meta.url)` is only correct while this module
 * ends up two directories deep in the build output, and it does not: Astro
 * bundles it into a chunk whose nesting varies, so the guess silently resolved
 * to a directory that did not exist. Every existsSync then returned false, the
 * R2-hosted videos still worked (they are matched by path, not by disk), and
 * fourteen of eighteen project pages quietly lost their hero. Checking the
 * candidates and keeping the one that is really there removes the guesswork.
 */
const publicDir = ((): string => {
    const candidates = [
        join(process.cwd(), 'public'),
        fileURLToPath(new URL('../../public', import.meta.url)),
    ];
    return candidates.find((dir) => existsSync(dir)) ?? candidates[0];
})();

const offloaded = new Set(OFFLOADED_ASSETS);

/** Extensions the site's images are stored as, in the order head.js tries them. */
const IMG_EXTS = ['.png', '.jpg', '.jpeg'] as const;

/** True if a site-root-absolute path exists in public/ or is served from R2. */
export function hasAsset(path: string): boolean {
    return offloaded.has(path) || existsSync(publicDir + path);
}

const has = hasAsset;

/** First extension of `<dir>/<stem>` that is actually on disk, else null. */
function firstImage(dir: string, stem: string | number): string | null {
    for (const ext of IMG_EXTS) {
        const path = `${dir}${stem}${ext}`;
        if (has(path)) return path;
    }
    return null;
}

/**
 * The WebVTT track that belongs to a video, if one has been written.
 *
 * Captions are a sibling of the video with the same stem — 0.mp4 and
 * 0.en.vtt — and they are always in public/ even when the video itself is
 * served from R2, because a few kilobytes of text does not belong in a bucket
 * and a same-origin track avoids the CORS rules that apply to <track>.
 *
 * Returning null for a video nobody has transcribed yet is the point: an empty
 * caption track is worse than no CC button, because it advertises captions and
 * then shows nothing. See scripts/build-captions.mjs.
 */
export function captionTrack(videoPath: string): string | null {
    const vtt = videoPath.replace(/\.mp4$/, '.en.vtt');
    return hasAsset(vtt) ? vtt : null;
}

/**
 * The rendered first page of a PDF, if one has been built.
 *
 * Lives in a `docs/` folder beside the document — see
 * scripts/build-doc-previews.mjs — where it cannot be confused with a
 * project's numbered gallery stills. Null means the card falls back to its
 * badge, which is a legible state rather than a broken image.
 */
export function docPreview(file: string): string | null {
    const cut = file.lastIndexOf('/');
    const dir = file.slice(0, cut + 1);
    const stem = file.slice(cut + 1).replace(/\.pdf$/i, '');
    const jpg = `${dir}docs/${stem}.jpg`;
    return hasAsset(jpg) ? jpg : null;
}

export type ProjectMedia = {
    /** Looping hero video, already resolved through R2 where applicable. */
    video: string | null;
    /** Caption track for that hero, or null if it has not been transcribed. */
    captions: string | null;
    /**
     * A short, quiet, 960px loop for cards — see
     * scripts/build-preview-videos.mjs. The full videos run to 65 MB, and the
     * homepage plays three at once, so a card must never load one.
     */
    preview: string | null;
    /** Poster for the hero video; also the still fallback when there is none. */
    poster: string | null;
    /** Gallery stills in order, 1..12, excluding the cover. */
    gallery: string[];
};

/**
 * `cover` is the card image and the only path the data file commits to, so the
 * folder is derived from it rather than from the id — the two agree today, and
 * this way they cannot disagree tomorrow.
 */
export function projectMedia(cover: string, includeGallery = true): ProjectMedia {
    const dir = cover.slice(0, cover.lastIndexOf('/') + 1);

    const videoPath = `${dir}0.mp4`;
    const video = has(videoPath) ? assetUrl(videoPath) : null;
    const captions = video ? captionTrack(videoPath) : null;

    // Folder name doubles as the preview's filename.
    const slug = dir.replace(/^\/projects\//, '').replace(/\/$/, '');
    const previewPath = `/previews/${slug}.mp4`;
    const preview = has(previewPath) ? assetUrl(previewPath) : null;
    const poster = firstImage(dir, 0) ?? (has(cover) ? cover : null);

    const gallery: string[] = [];
    if (includeGallery) {
        for (let n = 1; n <= 12; n++) {
            const found = firstImage(dir, n);
            // Stop at the first gap: the folders are numbered contiguously, and
            // continuing past one would pick up strays out of order.
            if (!found) break;
            if (found !== cover) gallery.push(found);
        }
    }

    return { video, captions, preview, poster, gallery };
}
