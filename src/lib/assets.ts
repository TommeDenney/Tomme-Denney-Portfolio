/**
 * Where each asset actually comes from.
 *
 * Cloudflare Pages refuses any single file over 25 MB, and this portfolio has
 * 23 that are larger — four project videos and the nineteen Gaussian-splat
 * .ply scans. Those live in `assets-r2/`, which mirrors the site's paths and
 * is pushed to the R2 bucket `tommedenney-portfolio` by scripts/push-assets.mjs.
 *
 * `assets-r2/` deliberately sits outside `public/`. Astro copies public/ into
 * dist verbatim, so leaving them there put 1.3 GB into every build for files
 * the site never requests from itself — assetUrl points at the bucket in dev
 * and production alike.
 *
 * The offload list is read from that directory rather than written out here,
 * so moving a file in or out of R2 is a file move and nothing else.
 */

import { readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Override with PUBLIC_ASSET_BASE to move the bucket behind a custom domain
 * (e.g. https://assets.tommedenney.com) without touching another file. The
 * r2.dev default is rate-limited by Cloudflare and is a staging address, not
 * a production one.
 */
export const ASSET_BASE: string =
    import.meta.env.PUBLIC_ASSET_BASE ||
    'https://pub-79a19cf8cac944149fa1ef5d044ae792.r2.dev';

// fileURLToPath, not .pathname — a URL percent-encodes the path, so the space
// in "Mac SDD" would arrive as %20 and the directory scan would find nothing.
const offloadDir = fileURLToPath(new URL('../../assets-r2', import.meta.url));

function* walk(dir: string): Generator<string> {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) yield* walk(path);
        else if (entry.isFile() && entry.name !== '.DS_Store') yield path;
    }
}

/** Site-root-absolute paths served from R2 instead of Pages. */
export const OFFLOADED_ASSETS: string[] = (() => {
    try {
        // POSIX separators: these are URL paths, not filesystem paths.
        return [...walk(offloadDir)]
            .map((p) => '/' + relative(offloadDir, p).split(sep).join('/'))
            .sort();
    } catch {
        // No assets-r2 yet is a legitimate state — nothing is offloaded.
        return [];
    }
})();

const OFFLOADED = new Set(OFFLOADED_ASSETS);

/** Resolve a site-root-absolute path to the URL it is actually served from. */
export function assetUrl(path: string): string {
    if (!OFFLOADED.has(path)) return path;
    // encodeURI, not encodeURIComponent: the slashes are structure. The space
    // in "3D & Spatial" is not, and neither is the ampersand — left raw it
    // reads as a query separator and the request silently truncates.
    return ASSET_BASE + encodeURI(path).replace(/&/g, '%26');
}
