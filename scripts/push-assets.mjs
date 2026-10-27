#!/usr/bin/env node
/**
 * Pushes the files Cloudflare Pages cannot host into R2.
 *
 * Pages rejects any single file over 25 MB. This portfolio has 23 that are
 * larger — four project videos and the nineteen .ply scans — so they live in
 * `assets-r2/` and are served from the bucket instead.
 *
 *   node scripts/push-assets.mjs            # upload what is missing
 *   node scripts/push-assets.mjs --dry-run  # show what it would do
 *   node scripts/push-assets.mjs --force    # re-upload even if present
 *
 * `assets-r2/` mirrors the site's paths, so an object's key is its site path
 * without the leading slash and its URL is exactly ASSET_BASE + path. That
 * directory *is* the offload list — src/lib/assets.ts reads the same tree —
 * so the two cannot drift.
 *
 * Uploads go through the S3 API in 5 MiB parts, each retried on its own, and
 * not through `wrangler r2 object put`. Wrangler fails on this machine with
 * EPIPE for anything past a few megabytes while plain HTTP of the same size
 * succeeds, and a single 63 MB PUT has no way to recover from one dropped
 * connection. Small parts turn a flaky link from a hard failure into a retry.
 *
 * Safe to re-run: an object already present at the right size is skipped, an
 * interrupted multipart upload is resumed from the parts already stored, and
 * every write is verified by reading the object back. A call that returns
 * without error is not evidence the object exists.
 */

import { existsSync, readFileSync, statSync, createReadStream, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    S3Client,
    HeadObjectCommand,
    PutObjectCommand,
    CreateMultipartUploadCommand,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    AbortMultipartUploadCommand,
    ListMultipartUploadsCommand,
    ListPartsCommand,
} from '@aws-sdk/client-s3';

const BUCKET = 'tommedenney-portfolio';

/** R2's multipart minimum is 5 MiB for every part but the last. */
const PART_SIZE = 5 * 1024 * 1024;

/** Per-part attempts before the file is given up on. */
const MAX_PART_ATTEMPTS = 6;

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const force = args.has('--force');

// fileURLToPath, not .pathname — a URL percent-encodes the path, so the space
// in "Mac SDD" would arrive as %20 and every fs call would miss.
const root = fileURLToPath(new URL('..', import.meta.url));
const offloadDir = join(root, 'assets-r2');

/* ── credentials ─────────────────────────────────────────────────────────── */

function loadEnv() {
    const path = join(root, '.env');
    if (!existsSync(path)) return {};
    const values = {};
    for (const line of readFileSync(path, 'utf8').split('\n')) {
        // Anchored per line, and [ \t] rather than \s, because \s matches a
        // newline and would let an empty value swallow the following line.
        const m = /^[ \t]*([A-Z0-9_]+)[ \t]*=[ \t]*(.*)$/.exec(line);
        if (m) values[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
    return values;
}

const env = { ...loadEnv(), ...process.env };
const accountId = env.R2_ACCOUNT_ID;
const accessKeyId = env.R2_ACCESS_KEY_ID;
const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
const endpoint = env.R2_ENDPOINT || (accountId && `https://${accountId}.r2.cloudflarestorage.com`);

if (!dryRun && (!endpoint || !accessKeyId || !secretAccessKey)) {
    console.error(`
error: R2 credentials are not set.

Copy .env.example to .env and fill in R2_ACCOUNT_ID, R2_ACCESS_KEY_ID and
R2_SECRET_ACCESS_KEY. Create them in the Cloudflare dashboard under
R2 > API > Manage API tokens, with Object Read & Write on the
'${BUCKET}' bucket. The secret is shown once.
`.trim());
    process.exit(1);
}

const client = dryRun ? null : new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
});

/* ── what needs uploading ────────────────────────────────────────────────── */

const CONTENT_TYPES = {
    '.mp4': 'video/mp4',
    '.ply': 'application/octet-stream',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.pdf': 'application/pdf',
};

function contentTypeFor(name) {
    const dot = name.lastIndexOf('.');
    return (dot >= 0 && CONTENT_TYPES[name.slice(dot).toLowerCase()]) || 'application/octet-stream';
}

function* walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) yield* walk(path);
        else if (entry.isFile() && entry.name !== '.DS_Store') yield path;
    }
}

if (!existsSync(offloadDir)) {
    console.error(`error: no assets-r2/ directory at ${offloadDir}`);
    process.exit(1);
}

// Everything in assets-r2/ is offloaded, whatever its size — the directory is
// the list.
const files = [...walk(offloadDir)]
    .map((path) => ({
        path,
        // POSIX separators: the key is a URL path, not a filesystem path.
        key: relative(offloadDir, path).split(sep).join('/'),
        size: statSync(path).size,
    }))
    .sort((a, b) => b.size - a.size);

const mb = (n) => (n / 1048576).toFixed(1).padStart(6) + ' MB';
const total = files.reduce((s, f) => s + f.size, 0);

console.error(`\n${files.length} file(s) in assets-r2/, ${(total / 1073741824).toFixed(2)} GB total`);
console.error(`target: r2://${BUCKET}\n`);

if (dryRun) {
    for (const f of files) console.error(`  would upload  ${mb(f.size)}  ${f.key}`);
    console.error('\nDry run — nothing was uploaded.');
    process.exit(0);
}

/* ── upload ──────────────────────────────────────────────────────────────── */

let uploaded = 0, skipped = 0;
const failed = [];

for (const file of files) {
    if (!force) {
        const head = await headObject(file.key);
        if (head && head.ContentLength === file.size) {
            console.error(`  skip          ${mb(file.size)}  ${file.key}`);
            skipped++;
            continue;
        }
    }

    process.stderr.write(`  upload        ${mb(file.size)}  ${file.key} `);
    try {
        if (file.size > PART_SIZE) await putMultipart(file);
        else await putSingle(file);

        const check = await headObject(file.key);
        if (!check) throw new Error('not present after upload');
        if (check.ContentLength !== file.size) {
            throw new Error(`size mismatch: ${check.ContentLength} != ${file.size}`);
        }
        process.stderr.write(' ok\n');
        uploaded++;
    } catch (err) {
        process.stderr.write(' FAILED\n');
        console.error(`      ${err.message}`);
        failed.push(file.key);
    }
}

console.error(`\nUploaded ${uploaded}, skipped ${skipped}, failed ${failed.length}.`);
if (failed.length) {
    console.error('\nFailed:');
    for (const key of failed) console.error(`  ${key}`);
    console.error('\nRe-run the same command — finished objects are skipped and');
    console.error('an interrupted file resumes from the parts already stored.');
    process.exit(1);
}

/* ── helpers ─────────────────────────────────────────────────────────────── */

async function headObject(key) {
    try {
        return await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    } catch (err) {
        if (err?.$metadata?.httpStatusCode === 404 || err?.name === 'NotFound') return null;
        throw err;
    }
}

async function putSingle(file) {
    let lastErr;
    for (let attempt = 1; attempt <= MAX_PART_ATTEMPTS; attempt++) {
        try {
            await client.send(new PutObjectCommand({
                Bucket: BUCKET,
                Key: file.key,
                Body: readFileSync(file.path),
                ContentType: contentTypeFor(file.key),
            }));
            return;
        } catch (err) {
            lastErr = err;
            process.stderr.write('r');
            await sleep(500 * attempt);
        }
    }
    throw lastErr;
}

/** Reuse an interrupted upload for this key, so a re-run resumes it. */
async function findExistingUpload(key) {
    try {
        const res = await client.send(new ListMultipartUploadsCommand({ Bucket: BUCKET, Prefix: key }));
        return res.Uploads?.find((u) => u.Key === key)?.UploadId ?? null;
    } catch {
        return null;
    }
}

async function putMultipart(file) {
    let uploadId = await findExistingUpload(file.key);
    let done = new Map();

    if (uploadId) {
        try {
            const res = await client.send(new ListPartsCommand({
                Bucket: BUCKET, Key: file.key, UploadId: uploadId,
            }));
            for (const p of res.Parts ?? []) done.set(p.PartNumber, { ETag: p.ETag, Size: p.Size });
        } catch {
            uploadId = null;
        }
    }

    if (!uploadId) {
        const created = await client.send(new CreateMultipartUploadCommand({
            Bucket: BUCKET,
            Key: file.key,
            ContentType: contentTypeFor(file.key),
        }));
        uploadId = created.UploadId;
        done = new Map();
    }

    try {
        const parts = [];
        let partNumber = 1;

        for (let offset = 0; offset < file.size; offset += PART_SIZE) {
            const end = Math.min(offset + PART_SIZE, file.size) - 1;
            const expected = end - offset + 1;
            const already = done.get(partNumber);

            if (already && already.Size === expected) {
                parts.push({ ETag: already.ETag, PartNumber: partNumber });
                process.stderr.write('.');
                partNumber++;
                continue;
            }

            const chunk = await readRange(file.path, offset, end);
            let lastErr;
            let stored = null;

            for (let attempt = 1; attempt <= MAX_PART_ATTEMPTS && !stored; attempt++) {
                try {
                    const result = await client.send(new UploadPartCommand({
                        Bucket: BUCKET,
                        Key: file.key,
                        UploadId: uploadId,
                        PartNumber: partNumber,
                        Body: chunk,
                    }));
                    stored = { ETag: result.ETag, PartNumber: partNumber };
                } catch (err) {
                    lastErr = err;
                    process.stderr.write('r');
                    await sleep(500 * attempt);
                }
            }

            if (!stored) throw lastErr ?? new Error(`part ${partNumber} failed`);
            parts.push(stored);
            process.stderr.write('.');
            partNumber++;
        }

        await client.send(new CompleteMultipartUploadCommand({
            Bucket: BUCKET,
            Key: file.key,
            UploadId: uploadId,
            MultipartUpload: { Parts: parts },
        }));
    } catch (err) {
        // Leave the upload open so the next run can resume from its parts;
        // only abort when it cannot be resumed.
        if (err?.$metadata?.httpStatusCode === 403) {
            await client.send(new AbortMultipartUploadCommand({
                Bucket: BUCKET, Key: file.key, UploadId: uploadId,
            })).catch(() => {});
        }
        throw err;
    }
}

function readRange(path, start, end) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        createReadStream(path, { start, end })
            .on('data', (c) => chunks.push(c))
            .on('end', () => resolve(Buffer.concat(chunks)))
            .on('error', reject);
    });
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
