#!/usr/bin/env node
/**
 * WebVTT caption tracks for every video on the site.
 *
 *   WHISPER_PY=/path/to/python npm run captions
 *   WHISPER_PY=... npm run captions -- --force
 *
 * HTML5 video has no auto-caption feature. Chrome's Live Caption and macOS's
 * equivalent are viewer-side OS settings a site cannot switch on, so the only
 * way a visitor gets captions here is a .vtt file shipped next to the video.
 * This writes them.
 *
 * Transcription is local and needs a Python with faster-whisper:
 *
 *   python3 -m venv ~/.whisper && ~/.whisper/bin/pip install faster-whisper
 *   WHISPER_PY=~/.whisper/bin/python npm run captions
 *
 * Two rules that matter more than the transcription itself:
 *
 * 1. A track is only written where there is real speech. Whisper hallucinates
 *    confidently over music — a game trailer scored with a synth loop comes
 *    back as invented dialogue — so a result that looks like music is dropped
 *    rather than published. The filters are below and they are deliberately
 *    strict: a video with no captions is fine, a video with fabricated ones is
 *    a lie in an accessibility feature.
 * 2. The output is labelled English (auto) in the player. These are machine
 *    transcripts of real named people — a town select board member, a studio
 *    CEO, a news reporter — and the label is what tells a viewer not to quote
 *    them from it.
 *
 * Captions always land in public/, even for videos served from R2: a few
 * kilobytes of text does not belong in a bucket, and a same-origin track
 * sidesteps the CORS rules <track> is subject to.
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const force = process.argv.includes('--force');
const python = process.env.WHISPER_PY;
const MODEL = process.env.WHISPER_MODEL || 'small.en';

/** Every video the site renders, wherever it is stored. */
function videos() {
    const found = [];
    const dirs = [
        'public/projects',
        'assets-r2/projects',
        'public/case-studies',
        'public/projects/seereality/clips',
    ];
    for (const base of dirs) {
        const dir = join(root, base);
        if (!existsSync(dir)) continue;
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
            if (entry.isFile() && entry.name.endsWith('.mp4')) {
                found.push(join(dir, entry.name));
                continue;
            }
            if (!entry.isDirectory()) continue;
            const sub = join(dir, entry.name);
            for (const file of readdirSync(sub)) {
                if (file.endsWith('.mp4')) found.push(join(sub, file));
            }
        }
    }
    // A clip can be reached through two of those roots; keep one of each.
    return [...new Set(found)].sort();
}

/** Where the track for a video goes: the same path, under public/. */
function vttFor(file) {
    const rel = relative(root, file).replace(/^assets-r2\//, 'public/');
    return join(root, rel.replace(/\.mp4$/, '.en.vtt'));
}

function hasAudio(file) {
    try {
        const out = execFileSync('ffprobe', [
            '-v', 'error', '-select_streams', 'a',
            '-show_entries', 'stream=codec_name', '-of', 'csv=p=0', file,
        ]).toString().trim();
        return out.length > 0;
    } catch {
        return false;
    }
}

const PY = `
import json, sys
from faster_whisper import WhisperModel
model = WhisperModel(sys.argv[1], device="cpu", compute_type="int8")
segments, info = model.transcribe(
    sys.argv[2],
    beam_size=5,
    # Voice activity detection first: without it, whisper is handed several
    # minutes of music and starts inventing sentences to fill it.
    vad_filter=True,
    vad_parameters={"min_silence_duration_ms": 700},
    condition_on_previous_text=False,
)
out = []
for s in segments:
    out.append({
        "start": s.start, "end": s.end, "text": s.text.strip(),
        "no_speech": s.no_speech_prob, "logprob": s.avg_logprob,
    })
print(json.dumps({"segments": out}))
`;

function stamp(t) {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = Math.floor(t % 60);
    const ms = Math.round((t - Math.floor(t)) * 1000);
    const p = (n, w = 2) => String(n).padStart(w, '0');
    return `${p(h)}:${p(m)}:${p(s)}.${p(ms, 3)}`;
}

/**
 * Is this a transcript, or is it whisper talking over a music bed?
 *
 * The three signals that actually separate the two in this repo's footage:
 * how much of the audio came back as speech at all, how confident the model
 * was, and whether the same line repeats — a loop of "Thank you." or the name
 * of a stock-music channel is the classic hallucination over a trailer.
 */
function looksLikeSpeech(segments) {
    const usable = segments.filter((s) => s.no_speech < 0.6 && s.logprob > -1.0);
    if (usable.length < 4) return { ok: false, why: 'fewer than four confident segments' };

    const words = usable.reduce((n, s) => n + s.text.split(/\s+/).filter(Boolean).length, 0);
    if (words < 40) return { ok: false, why: `only ${words} words` };

    const unique = new Set(usable.map((s) => s.text.toLowerCase().replace(/[^a-z ]/g, '')));
    if (unique.size < usable.length / 2) {
        return { ok: false, why: 'half the lines repeat, which is how it sounds over music' };
    }
    return { ok: true, segments: usable, words };
}

function toVtt(segments) {
    const cues = segments.map(
        (s, i) => `${i + 1}\n${stamp(s.start)} --> ${stamp(s.end)}\n${s.text}`,
    );
    return `WEBVTT\n\n${cues.join('\n\n')}\n`;
}

const files = videos().filter(hasAudio);
console.log(`captions: ${files.length} video(s) with an audio track`);

if (!python) {
    console.log(
        '\nNo WHISPER_PY set, so nothing was transcribed. The player already\n' +
        'emits a <track> for any .en.vtt that exists, so dropping files in by\n' +
        'hand works too. To generate them:\n\n' +
        '  python3 -m venv ~/.whisper\n' +
        '  ~/.whisper/bin/pip install faster-whisper\n' +
        '  WHISPER_PY=~/.whisper/bin/python npm run captions\n',
    );
    process.exit(0);
}

let written = 0;
let skipped = 0;
let quiet = 0;

for (const file of files) {
    const out = vttFor(file);
    const name = relative(root, file);

    if (!force && existsSync(out)) {
        skipped++;
        continue;
    }

    let parsed;
    try {
        const raw = execFileSync(python, ['-c', PY, MODEL, file], {
            maxBuffer: 64 * 1024 * 1024,
            stdio: ['ignore', 'pipe', 'inherit'],
        }).toString();
        parsed = JSON.parse(raw);
    } catch (err) {
        console.error(`  !  ${name}: ${err.message.split('\n')[0]}`);
        continue;
    }

    const verdict = looksLikeSpeech(parsed.segments);
    if (!verdict.ok) {
        console.log(`  ·  ${name}: no captions — ${verdict.why}`);
        quiet++;
        continue;
    }

    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, toVtt(verdict.segments));
    console.log(`  ✓  ${relative(root, out)}  (${verdict.words} words)`);
    written++;
}

console.log(
    `captions: ${written} written, ${quiet} judged music or silence, ${skipped} already present`,
);
