// @ts-check
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { remarkStripNeedsInput } from './scripts/remark-strip-needs-input.mjs';

/** Cloudflare Pages' hard per-file ceiling. */
const PAGES_MAX_BYTES = 25 * 1024 * 1024;

/**
 * Fails the build if anything in the output is too big for Pages to serve.
 *
 * Pages does not reject an oversized file at upload — the deploy reports
 * success and that one asset 404s, which is a broken video nobody notices
 * until a visitor does. Large files belong in assets-r2/; see src/lib/assets.ts.
 */
function guardPagesFileLimit() {
    return {
        name: 'guard-pages-file-limit',
        hooks: {
            'astro:build:done': ({ dir, logger }) => {
                const root = fileURLToPath(dir);
                const offenders = [];

                (function walk(d) {
                    for (const entry of readdirSync(d, { withFileTypes: true })) {
                        const path = join(d, entry.name);
                        if (entry.isDirectory()) walk(path);
                        else if (entry.isFile()) {
                            const size = statSync(path).size;
                            if (size >= PAGES_MAX_BYTES) offenders.push({ path, size });
                        }
                    }
                })(root);

                if (offenders.length === 0) return;

                for (const o of offenders) {
                    logger.error(`${(o.size / 1048576).toFixed(1)} MB  ${o.path}`);
                }
                throw new Error(
                    `${offenders.length} file(s) exceed Cloudflare Pages' 25 MB limit. ` +
                    `Move them into assets-r2/ and run npm run assets:push.`,
                );
            },
        },
    };
}

/** Author notes that must never reach a visitor. */
const PLACEHOLDER_PATTERNS = [/NEEDS INPUT/i, /\bTK\b/, /\bLOREM IPSUM\b/i];

/**
 * Fails the build if a placeholder survived into the output.
 *
 * The case studies are drafted with inline `[NEEDS INPUT: …]` markers where a
 * fact is still missing. remarkStripNeedsInput removes them, but it is one
 * regex away from missing a shape nobody anticipated, and the failure mode is
 * a bracketed note to the author published on a page recruiters read. This is
 * the backstop: it looks at what was actually written to disk, so it cannot be
 * fooled by a plugin that silently did nothing.
 */
function guardPlaceholderText() {
    return {
        name: 'guard-placeholder-text',
        hooks: {
            'astro:build:done': ({ dir, logger }) => {
                const root = fileURLToPath(dir);
                const offenders = [];

                (function walk(d) {
                    for (const entry of readdirSync(d, { withFileTypes: true })) {
                        const path = join(d, entry.name);
                        if (entry.isDirectory()) walk(path);
                        else if (entry.isFile() && path.endsWith('.html')) {
                            const html = readFileSync(path, 'utf8');
                            for (const re of PLACEHOLDER_PATTERNS) {
                                const hit = html.match(re);
                                if (hit) offenders.push({ path, text: hit[0] });
                            }
                        }
                    }
                })(root);

                if (offenders.length === 0) return;

                for (const o of offenders) {
                    logger.error(`placeholder "${o.text}" in ${o.path}`);
                }
                throw new Error(
                    `${offenders.length} placeholder(s) reached the build output. ` +
                    `Answer the marker in case-studies/, or let ` +
                    `scripts/remark-strip-needs-input.mjs drop the block.`,
                );
            },
        },
    };
}


// Static output, same as the Recollection site: this is a portfolio, and
// Cloudflare Pages serves it from the edge. Nothing here needs a server
// runtime — the only moving parts are in the browser.
export default defineConfig({
    site: 'https://tommedenney.com',
    integrations: [guardPagesFileLimit(), guardPlaceholderText()],
    markdown: {
        remarkPlugins: [remarkStripNeedsInput],
    },
    vite: {
        plugins: [tailwindcss()],
    },
});
