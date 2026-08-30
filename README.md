# Tomme Denney — portfolio

Astro + Tailwind, deployed to Cloudflare Pages by direct upload. Same shape as
`RecollectionSite`, and for the same reason: a static site served from the edge,
deployed from this machine, with no third party in the publish path.

**It was previously a single 3,254-line `index.html` on GitHub Pages.** The
design is unchanged — the port was verified by pixel-diffing both versions at
matched scroll offsets, and the sections that hold still are identical to the
pixel. What changed is the structure around it.

## Live addresses

| | |
|---|---|
| Site | **https://tommedenney.pages.dev** (Cloudflare Pages, project `tommedenney`) |
| Assets | `https://pub-79a19cf8cac944149fa1ef5d044ae792.r2.dev` (R2 `tommedenney-portfolio`) |
| Intended domain | `tommedenney.com` — still pointing at GitHub Pages, see below |

## Deploying

```bash
npm run build          # also fails if anything is too big for Pages
npm run deploy         # build + wrangler pages deploy
```

**Retry a failed deploy; do not investigate it first.** Wrangler on this machine
drops connections partway through an upload (`EPIPE`) while plain HTTP of the
same size succeeds, so a deploy often takes two or three attempts. Pages
deduplicates by content hash, so each run resumes where the last stopped — the
first deploy went 0 → 10 → 89 → 99 files across four attempts.

## The 25 MB rule

Cloudflare Pages refuses any single file over 25 MB, and it does not refuse it
loudly: the deploy reports success and that one asset 404s. Twenty-three files
here are larger — four project videos and the nineteen `.ply` scans, 1.34 GB.

- They live in **`assets-r2/`**, which mirrors the site's paths and sits outside
  `public/`. Astro copies `public/` into `dist` verbatim, so leaving them there
  put 1.3 GB into every build for files the site never requests from itself.
- `src/lib/assets.ts` reads that directory to build the offload list, and
  `scripts/push-assets.mjs` reads the same tree to upload it. **The directory is
  the list** — moving a file in or out of R2 is a file move and nothing else.
- `astro.config.mjs` fails the build if anything in `dist` is over the limit, so
  a new large file is caught here rather than by a visitor.

```bash
npm run assets:push              # upload what is missing
node scripts/push-assets.mjs --dry-run
```

Uploads use the S3 API in 5 MiB parts, each retried separately, and resume from
the parts already stored. This is not the same flakiness as the Pages deploy but
it has the same cause, and a single 63 MB PUT has no way to recover from one
dropped connection.

## What is not done

- **`assets-r2/` has not been uploaded.** The R2 S3 token in `.env` was carried
  over from the Recollection project and is scoped to that bucket — it returns
  403 here. A token with Object Read & Write on `tommedenney-portfolio` is
  needed; then `npm run assets:push` finishes it. Until then the four project
  hero videos fall back to their cover images, which the viewer already does on
  video error, and the `.ply` scans are unreferenced anyway.
- **`tommedenney.com` still resolves to GitHub Pages** (`185.199.108–111.153`).
  The nameservers are already Cloudflare's, so this is a record change in the
  dashboard, not a migration. The local wrangler token can read DNS but not
  write it.
- **The r2.dev address is a staging one** and is rate-limited by Cloudflare. Put
  the bucket behind a custom domain and set `PUBLIC_ASSET_BASE`; nothing else
  needs to change.

## Layout

```
src/
  data/projects.ts       18 projects, external links, embeds — one source of truth
  data/photography.ts    gallery counts, row heights, the 3D section's switch
  lib/assets.ts          which paths are served from R2
  layouts/Base.astro     head, fonts, the inline head script
  components/            Nav, Ticker, HomeView, PhotoView, ProjectView, Overlays
  pages/index.astro      composes the above and injects SITE_DATA
  scripts/site.js        all browser behaviour, lifted from the original
  scripts/viewer3d.js    three.js viewers, loaded on demand
  styles/global.css      the original stylesheet, unchanged
public/                  everything Pages can serve (220 MB)
assets-r2/               everything it cannot (1.34 GB)
```

### Two things that look wrong and are not

- **`src/scripts/site.js` is injected as a classic inline script, not bundled.**
  The markup drives it through inline `onclick` handlers, which resolve against
  global scope. Bundling it as a module would put every one of those functions
  somewhere the handlers cannot see them.
- **`SITE_DATA` is serialised into the page** rather than fetched. It is a few
  kilobytes and the script needs it before first paint.

## Fixed in the port

- The **Other Realm** embed pointed at `projects/otherrealm/index.html`, which
  has never existed in this repo and 404s on the live site. The Twine export is
  `otherrealm.html`. Pages serves it via a 308 to the extensionless URL, which
  the iframe follows.
- The project page declared **`id="pv-dl-btn"` twice**; only the first was ever
  reachable by `getElementById`.
- The featured section carried a **stray closing `</section>`**.
