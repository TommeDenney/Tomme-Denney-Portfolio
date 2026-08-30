#!/usr/bin/env node
/**
 * Points tommedenney.com at the Cloudflare Pages project.
 *
 *   node scripts/point-dns.mjs --dry-run
 *   node scripts/point-dns.mjs
 *
 * The zone has lived on Cloudflare throughout; only the records pointed at
 * GitHub Pages. So this deletes the four GitHub A records on the apex and the
 * www CNAME to tommedenney.github.io, and replaces both with a proxied CNAME
 * to the Pages project.
 *
 * A CNAME at the apex is legal here because Cloudflare flattens it. That is
 * also why the record must stay **proxied** — an unproxied apex CNAME is not
 * something the DNS spec allows Cloudflare to serve.
 *
 * Wrangler's own login cannot do this: it can read zones but not write DNS.
 * This needs a token with Zone > DNS > Edit, read from CLOUDFLARE_API_TOKEN
 * (env or .env).
 *
 * Re-running is safe. A record already pointing at the target is left alone,
 * so the script converges rather than churning the zone.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ZONE_NAME = 'tommedenney.com';
const TARGET = 'tommedenney.pages.dev';
const NAMES = [ZONE_NAME, `www.${ZONE_NAME}`];

/** GitHub Pages' anycast addresses — what we are replacing. */
const GITHUB_IPS = new Set(['185.199.108.153', '185.199.109.153', '185.199.110.153', '185.199.111.153']);

const dryRun = process.argv.includes('--dry-run');
const root = fileURLToPath(new URL('..', import.meta.url));

function loadEnv() {
    const path = join(root, '.env');
    if (!existsSync(path)) return {};
    const values = {};
    for (const line of readFileSync(path, 'utf8').split('\n')) {
        const m = /^[ \t]*([A-Z0-9_]+)[ \t]*=[ \t]*(.*)$/.exec(line);
        if (m) values[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
    return values;
}

const env = { ...loadEnv(), ...process.env };
const token = env.CLOUDFLARE_API_TOKEN;

if (!token) {
    console.error(`
error: CLOUDFLARE_API_TOKEN is not set.

Create one at Cloudflare > My Profile > API Tokens > Create Token (Custom)
with Zone > DNS > Edit on ${ZONE_NAME}, then add it to .env:

  CLOUDFLARE_API_TOKEN=...
`.trim());
    process.exit(1);
}

const api = async (path, init = {}) => {
    const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...(init.headers || {}),
        },
    });
    const body = await res.json();
    if (!body.success) {
        throw new Error(`${init.method || 'GET'} ${path}: ${JSON.stringify(body.errors)}`);
    }
    return body.result;
};

const zones = await api(`/zones?name=${ZONE_NAME}`);
if (!zones.length) throw new Error(`zone ${ZONE_NAME} not found on this account`);
const zoneId = zones[0].id;
console.error(`zone ${ZONE_NAME} (${zoneId.slice(0, 8)}…)\n`);

const records = await api(`/zones/${zoneId}/dns_records?per_page=200`);

for (const name of NAMES) {
    const mine = records.filter((r) => r.name === name && ['A', 'AAAA', 'CNAME'].includes(r.type));

    const already = mine.find((r) => r.type === 'CNAME' && r.content === TARGET);
    if (already && mine.length === 1) {
        console.error(`  ${name}\n    already CNAME -> ${TARGET}${already.proxied ? ' (proxied)' : ' — NOT proxied, fixing'}`);
        if (already.proxied) continue;
    }

    for (const r of mine) {
        if (already && r.id === already.id) continue;
        const why = r.type === 'A' && GITHUB_IPS.has(r.content) ? 'GitHub Pages'
            : r.content.endsWith('github.io') ? 'GitHub Pages'
            : 'conflicting';
        console.error(`  ${name}\n    delete ${r.type} -> ${r.content}  (${why})`);
        if (!dryRun) await api(`/zones/${zoneId}/dns_records/${r.id}`, { method: 'DELETE' });
    }

    if (already) {
        console.error(`    set proxied on existing CNAME`);
        if (!dryRun) {
            await api(`/zones/${zoneId}/dns_records/${already.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ proxied: true }),
            });
        }
        continue;
    }

    console.error(`    create CNAME -> ${TARGET} (proxied)`);
    if (!dryRun) {
        await api(`/zones/${zoneId}/dns_records`, {
            method: 'POST',
            body: JSON.stringify({ type: 'CNAME', name, content: TARGET, proxied: true, ttl: 1 }),
        });
    }
}

console.error(dryRun
    ? '\nDry run — nothing was changed.'
    : '\nDone. Certificates take a few minutes; the Pages custom domain goes pending -> active.');
