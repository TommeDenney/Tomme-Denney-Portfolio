#!/usr/bin/env node
/**
 * Makes web-sized copies of the photography.
 *
 *   npm run photos
 *
 * The originals are 2400px webp files of up to 5.8 MB, 138 MB across both
 * folders. The grid shows them in rows 220px tall, so every visitor was
 * downloading roughly six megabytes to fill a 300x220 slot, thirty-seven
 * times over. That is the whole reason the gallery felt slow — the layout
 * script was fast, the payload was not.
 *
 * Two widths are emitted so the grid can pick with srcset, and the larger one
 * is what the lightbox opens: at 1600px on a screen it is indistinguishable
 * from the original and roughly forty times smaller. The originals stay on
 * disk as the archive and are simply never requested by the page.
 *
 * Dimensions are written to photo-manifest.json so the pages can set width and
 * height and the correct flex ratio at build time. v1 waited for img.onload to
 * read naturalWidth before it could size anything, which meant the justified
 * grid could not be laid out until the images had already decoded.
 */

import { readdirSync, mkdirSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcRoot = join(root, 'public', 'photography');
const outRoot = join(srcRoot, '_derived');
const FOLDERS = ['Featured', 'All Works'];
const WIDTHS = [800, 1600];

const force = process.argv.includes('--force');
const manifest = {};
let made = 0;
let skipped = 0;

for (const folder of FOLDERS) {
    const dir = join(srcRoot, folder);
    if (!existsSync(dir)) continue;

    const files = readdirSync(dir)
        .filter((f) => f.endsWith('.webp'))
        .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

    for (const file of files) {
        const srcPath = join(dir, file);
        const stem = file.replace(/\.webp$/, '');
        const meta = await sharp(srcPath).metadata();

        manifest[`${folder}/${stem}`] = { w: meta.width, h: meta.height };

        for (const width of WIDTHS) {
            const outDir = join(outRoot, folder);
            mkdirSync(outDir, { recursive: true });
            const outPath = join(outDir, `${stem}-${width}.webp`);

            // Never upscale: a source narrower than the target would only get
            // bigger on disk for no visible gain.
            if (meta.width <= width && width !== WIDTHS[WIDTHS.length - 1]) continue;

            if (!force && existsSync(outPath) && statSync(outPath).mtimeMs >= statSync(srcPath).mtimeMs) {
                skipped++;
                continue;
            }

            await sharp(srcPath)
                .resize({ width: Math.min(width, meta.width), withoutEnlargement: true })
                .webp({ quality: 74, effort: 5 })
                .toFile(outPath);
            made++;
        }
    }
}

writeFileSync(
    join(root, 'src', 'data', 'photo-manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
);

const bytes = (dir) =>
    existsSync(dir)
        ? readdirSync(dir, { recursive: true })
              .map((f) => join(dir, String(f)))
              .filter((f) => statSync(f).isFile())
              .reduce((n, f) => n + statSync(f).size, 0)
        : 0;

console.log(`derivatives: ${made} written, ${skipped} up to date`);
console.log(`originals   ${(bytes(join(srcRoot, 'Featured')) + bytes(join(srcRoot, 'All Works')) / 1) / 1048576 | 0} MB`);
console.log(`derived     ${bytes(outRoot) / 1048576 | 0} MB`);
console.log(`manifest    ${Object.keys(manifest).length} images`);
