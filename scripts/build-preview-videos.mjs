#!/usr/bin/env node
/**
 * Small looping previews for the cards on / and /work.
 *
 *   npm run previews
 *
 * The project videos are full captures — the Inhabiting Memory one is 65 MB —
 * and the homepage was autoplaying three of them at once, 90 MB before a
 * visitor had scrolled anywhere. A card is a few hundred pixels wide and
 * fifteen seconds is plenty to read, so each source becomes a short, quiet,
 * 960px loop of roughly a megabyte and change. The full videos stay exactly
 * where they are and are still what a case study page plays.
 *
 * Sources are read from public/ or assets-r2/, whichever holds them.
 */

import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'previews');
const SECONDS = 15;
const WIDTH = 960;

const force = process.argv.includes('--force');
mkdirSync(outDir, { recursive: true });

/** Every project folder holding a 0.mp4, in public/ or in assets-r2/. */
function sources() {
    const found = new Map();
    for (const base of ['public/projects', 'assets-r2/projects']) {
        const dir = join(root, base);
        if (!existsSync(dir)) continue;
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
            if (!entry.isDirectory()) continue;
            const file = join(dir, entry.name, '0.mp4');
            if (existsSync(file) && !found.has(entry.name)) found.set(entry.name, file);
        }
    }
    return found;
}

let made = 0;
let skipped = 0;
let before = 0;
let after = 0;

for (const [name, src] of sources()) {
    const mp4 = join(outDir, `${name}.mp4`);
    const jpg = join(outDir, `${name}.jpg`);
    before += statSync(src).size;

    if (!force && existsSync(mp4) && statSync(mp4).mtimeMs >= statSync(src).mtimeMs) {
        skipped++;
        after += statSync(mp4).size;
        continue;
    }

    // -an: a card that plays on load must never make noise.
    execFileSync('ffmpeg', [
        '-v', 'error', '-y', '-i', src,
        '-t', String(SECONDS),
        '-vf', `fps=24,scale=${WIDTH}:-2`,
        '-c:v', 'libx264', '-crf', '31', '-preset', 'veryfast',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
        mp4,
    ]);
    execFileSync('ffmpeg', [
        '-v', 'error', '-y', '-ss', '1', '-i', src,
        '-frames:v', '1', '-vf', `scale=${WIDTH}:-2`, '-q:v', '5', jpg,
    ]);
    made++;
    after += statSync(mp4).size;
}

const mb = (n) => (n / 1048576).toFixed(1);
console.log(`previews: ${made} written, ${skipped} up to date`);
console.log(`sources  ${mb(before)} MB  ->  previews ${mb(after)} MB`);
