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
 *
 * A portrait source gets a different treatment. Buddy Run's only footage is a
 * 588x1280 phone capture, and object-fit: cover in a 16:9 card would crop that
 * to a horizontal sliver of the middle of the screen. So it is composited: an
 * enlarged, blurred copy of itself fills the frame and the sharp phone sits
 * centred on top, which fills the card, keeps the screen legible, and lets the
 * app's heart-rate zone colours carry the background.
 */

import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'previews');
const SECONDS = 15;
const WIDTH = 960;

/**
 * Sources that are not projects/<id>/0.mp4. Keyed by the preview filename,
 * which is the project's folder name.
 */
const EXTRA = {
    buddyrun: {
        src: 'public/case-studies/buddy-run/app-demo.mp4',
        portrait: true,
        // The recording opens on the demographic intake form and an on-screen
        // keyboard. Seek past it to the live run screens, which are the part
        // worth showing, and past the notification that lands around 0:95.
        start: 55,
    },
};

const force = process.argv.includes('--force');
mkdirSync(outDir, { recursive: true });

/** Every project folder holding a 0.mp4, in public/ or in assets-r2/. */
function sources() {
    const found = new Map();
    for (const [name, cfg] of Object.entries(EXTRA)) {
        const file = join(root, cfg.src);
        if (existsSync(file)) found.set(name, file);
    }
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

    const portrait = EXTRA[name]?.portrait;
    const H = Math.round((WIDTH * 9) / 16);

    // Blurred self as the backdrop, sharp source centred over it.
    const composite =
        `[0:v]fps=24,scale=${WIDTH}:-2,crop=${WIDTH}:${H},gblur=sigma=26,eq=brightness=-0.08[bg];` +
        `[0:v]fps=24,scale=-2:${H - 36}[fg];` +
        `[bg][fg]overlay=(W-w)/2:(H-h)/2`;

    // -an: a card that plays on load must never make noise.
    const start = EXTRA[name]?.start;

    execFileSync('ffmpeg', [
        '-v', 'error', '-y',
        ...(start ? ['-ss', String(start)] : []),
        '-i', src,
        '-t', String(SECONDS),
        ...(portrait
            ? ['-filter_complex', composite]
            : ['-vf', `fps=24,scale=${WIDTH}:-2`]),
        '-c:v', 'libx264', '-crf', '31', '-preset', 'veryfast',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
        mp4,
    ]);
    execFileSync('ffmpeg', [
        '-v', 'error', '-y', '-ss', String(start ? start + 4 : 1), '-i', src,
        '-frames:v', '1',
        ...(portrait ? ['-filter_complex', composite] : ['-vf', `scale=${WIDTH}:-2`]),
        '-q:v', '5', jpg,
    ]);
    made++;
    after += statSync(mp4).size;
}

const mb = (n) => (n / 1048576).toFixed(1);
console.log(`previews: ${made} written, ${skipped} up to date`);
console.log(`sources  ${mb(before)} MB  ->  previews ${mb(after)} MB`);
