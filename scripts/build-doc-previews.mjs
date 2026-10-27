#!/usr/bin/env node
/**
 * First-page previews for the PDFs in the Documents section.
 *
 *   npm run docs
 *   npm run docs -- --force
 *
 * The documents used to be a list of links, which is the one place on this
 * site where the work was described rather than shown: a reader had no idea
 * whether "Hero's journey map" was a diagram or four pages of prose until they
 * opened it. Every other index here is a card with a picture on it, and these
 * are now too.
 *
 * Rendering is macOS QuickLook — `qlmanage -t` — rather than a dependency,
 * because it is already on the machine, it uses the same engine Preview does,
 * and it hands back a clean page with no border or drop shadow. The PNG it
 * produces is then squeezed to an 800px JPEG, which is what a 240px card
 * actually needs.
 *
 * Previews land in a `docs/` folder beside the PDF so they cannot be mistaken
 * for a project's numbered gallery stills, and the page emits a card image
 * only where the file exists — an unrendered PDF still gets a card, it just
 * gets the PDF badge instead of a picture.
 */

import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const force = process.argv.includes('--force');
const WIDTH = 800;

/** Every PDF under public/projects, at any depth. */
function pdfs(dir, out = []) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) {
            // A previously rendered preview is not a document.
            if (entry.name !== 'docs') pdfs(path, out);
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) {
            out.push(path);
        }
    }
    return out;
}

const tmp = join(root, 'node_modules', '.doc-previews');
let made = 0;
let skipped = 0;
let failed = 0;

for (const pdf of pdfs(join(root, 'public', 'projects'))) {
    const stem = pdf.slice(pdf.lastIndexOf('/') + 1).replace(/\.pdf$/i, '');
    const out = join(dirname(pdf), 'docs', `${stem}.jpg`);

    if (!force && existsSync(out) && statSync(out).mtimeMs >= statSync(pdf).mtimeMs) {
        skipped++;
        continue;
    }

    rmSync(tmp, { recursive: true, force: true });
    mkdirSync(tmp, { recursive: true });

    try {
        // -s is the long edge. Render larger than needed and let the JPEG
        // downscale do the antialiasing; QuickLook's own scaler is coarse.
        execFileSync('qlmanage', ['-t', '-s', String(WIDTH * 2), '-o', tmp, pdf], {
            stdio: 'ignore',
        });
        const png = readdirSync(tmp).find((f) => f.endsWith('.png'));
        if (!png) throw new Error('QuickLook produced nothing');

        mkdirSync(dirname(out), { recursive: true });
        execFileSync('ffmpeg', [
            '-v', 'error', '-y', '-i', join(tmp, png),
            // A slide is 16:9 and a report is letter, and they share a row of
            // cards. Width is fixed and the card crops the height, so both
            // read as "the top of a page".
            '-vf', `scale=${WIDTH}:-2:flags=lanczos`,
            '-q:v', '4', out,
        ], { stdio: 'ignore' });

        console.log(`  ✓  ${relative(root, out)}`);
        made++;
    } catch (err) {
        console.error(`  !  ${relative(root, pdf)}: ${err.message.split('\n')[0]}`);
        failed++;
    }
}

rmSync(tmp, { recursive: true, force: true });
console.log(`doc previews: ${made} rendered, ${skipped} up to date${failed ? `, ${failed} failed` : ''}`);
