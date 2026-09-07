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

export type ProjectMedia = {
    /** Looping hero video, already resolved through R2 where applicable. */
    video: string | null;
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

    return { video, poster, gallery };
}
