/**
 * Everything the portfolio does in the browser.
 *
 * Lifted from the single-file index.html unchanged in behaviour. The content
 * it used to declare inline now arrives as SITE_DATA, injected by the page
 * from src/data/*.ts, so the markup Astro renders and the objects this script
 * reads cannot disagree.
 *
 * This runs as a classic inline script, not a module, and that is deliberate:
 * the markup drives it through inline onclick handlers, which resolve against
 * global scope. Bundling it would put every one of these functions in a module
 * scope where those handlers cannot see them.
 */

const PROJECTS = SITE_DATA.projects;
const PMAP = {};
PROJECTS.forEach(p => PMAP[p.id] = p);
const PROJECT_EXTERNAL_SITES = SITE_DATA.externalSites;

/** Resolve a site path to where it is really served — R2 for the big files. */
function assetUrl(path) {
    return SITE_DATA.offloaded.includes(path)
        ? SITE_DATA.assetBase + encodeURI(path).replace(/&/g, '%26')
        : path;
}


/* HERO SPRING — square 180×180 cards */
const HERO_IDS = SITE_DATA.heroIds;
const cdata = HERO_IDS.map((id, i) => ({ el: document.getElementById('hc' + i), id, ox: 0, oy: 0, vx: 0, vy: 0, rot: [-22, -7, 8, 21][i] }));
function layoutCards() {
    const cl = document.getElementById('clayer');
    const cw = cl.offsetWidth, totalW = 4 * 180 + 3 * 18;
    const sx = (cw - totalW) / 2, my = cl.offsetHeight / 2;
    cdata.forEach((c, i) => { const bx = sx + i * (180 + 18); c.el.style.left = bx + 'px'; c.el.style.top = (my - 90) + 'px'; c.baseX = bx + 90; c.baseY = my; });
}
layoutCards(); window.addEventListener('resize', layoutCards);
let pmx = window.innerWidth / 2, pmy = window.innerHeight / 2;
document.addEventListener('mousemove', e => {
    const dx = e.clientX - pmx, dy = e.clientY - pmy; pmx = e.clientX; pmy = e.clientY;
    const cl = document.getElementById('clayer');
    const r = cl.getBoundingClientRect();
    cdata.forEach(c => {
        const dist = Math.hypot(e.clientX - (r.left + c.baseX), e.clientY - (r.top + c.baseY));
        if (dist < 210) { const f = (1 - dist / 210) * .58; c.vx += dx * f; c.vy += dy * f; }
    });
});
(function spring() {
    cdata.forEach(c => {
        c.vx += (-c.ox) * .075; c.vy += (-c.oy) * .075; c.vx *= .86; c.vy *= .86; c.ox += c.vx; c.oy += c.vy;
        c.el.style.transform = `translate(${c.ox}px,${c.oy}px) rotate(${c.rot + c.ox * .015}deg)`;
    });
    requestAnimationFrame(spring);
})();

/* SCROLL FADE — wait until XR DEV section is mid-screen */
let fadeDist = 900;
function calcFadeDist() {
    const it = document.getElementById('info');
    if (it) fadeDist = Math.max(it.offsetTop - window.innerHeight * 0.5, 500);
}
calcFadeDist(); window.addEventListener('resize', calcFadeDist);
const hname = document.getElementById('hname'), hmeta = document.getElementById('hmeta');
window.addEventListener('scroll', () => {
    if (document.getElementById('project-view').style.display !== 'none') return;
    const p = Math.max(0, Math.min(1, window.scrollY / fadeDist));
    hname.style.opacity = Math.max(0, 1 - p * 1.4);
    hmeta.style.opacity = Math.max(0, 1 - p * 1.8);
    cdata.forEach(c => c.el.style.opacity = Math.max(0, 1 - p * 1.8));
    // update active nav link based on scroll position
    const mid = window.scrollY + 80;
    let active = 'hero';
    ['hero', 'info', 'sect-featured', 'sect-play', 'sect-thesis-research', 'sect-projects', 'sect-contact'].forEach(id => {
        const el = document.getElementById(id); if (el && el.offsetTop <= mid) active = id;
    });
    document.querySelectorAll('.navr a').forEach(a => {
        a.classList.toggle('on', a.getAttribute('href') === '#' + active);
    });
}, { passive: true });

/* CURSOR */
const cur = document.getElementById('cur'), ring = document.getElementById('ring');
let mx = 0, my = 0, rx = 0, ry = 0;
const xHist = []; let shakeTimer = null;
document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY; cur.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    xHist.push({ x: e.clientX, t: Date.now() }); if (xHist.length > 30) xHist.shift();
    if (xHist.length >= 12) {
        const rec = xHist.slice(-12);
        if (rec[11].t - rec[0].t < 600) {
            let rev = 0; for (let i = 1; i < rec.length - 1; i++) { const d1 = rec[i].x - rec[i - 1].x, d2 = rec[i + 1].x - rec[i].x; if (d1 * d2 < 0 && (Math.abs(d1) > 6 || Math.abs(d2) > 6)) rev++; }
            if (rev >= 4) { document.body.classList.add('shake'); clearTimeout(shakeTimer); shakeTimer = setTimeout(() => document.body.classList.remove('shake'), 600); }
        }
    }
});
(function rl() { rx += (mx - rx) * .11; ry += (my - ry) * .11; ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)'; requestAnimationFrame(rl) })();
function updateHoverListeners() {
    document.querySelectorAll('a,button,.fc,.wc,.sw,#pbtn,.hcard,.pv-more-card,.flabel,.pwcard,.photo-feat-card,.photo-grid-item,.viewer-item,.viewer-expand,.mode-opt').forEach(el => {
        el.onmouseenter = () => document.body.classList.add('hov');
        el.onmouseleave = () => document.body.classList.remove('hov');
    });
}
updateHoverListeners();

/* FEATURED */
const fcards = Array.from(document.querySelectorAll('.fc'));
const FEAT_LABELS = SITE_DATA.featuredIds.map(id => PMAP[id].name);
let fi = 0, autoT;
function renderFeat() {
    const n = fcards.length;
    fcards.forEach((c, i) => { const r = ((i - fi) % n + n) % n; c.className = 'fc'; c.classList.add(r === 0 ? 'center' : r === 1 ? 'right' : r === n - 1 ? 'left' : 'out-r'); });
    document.getElementById('flbl').textContent = FEAT_LABELS[fi];
}
renderFeat();
function nextFeat() { fi = (fi + 1) % fcards.length; renderFeat(); }
function resetAuto() { clearInterval(autoT); autoT = setInterval(nextFeat, 3000); }
resetAuto();
fcards.forEach(c => {
    c.addEventListener('click', () => {
        if (c.classList.contains('center')) { openProject(c.dataset.id); return; }
        fi = c.classList.contains('right') ? (fi + 1) % fcards.length : (fi - 1 + fcards.length) % fcards.length;
        renderFeat(); resetAuto();
    });
});
function openProjectFromFeat() { openProject(fcards[fi].dataset.id); }
document.addEventListener('keydown', e => {
    if (document.getElementById('project-view').style.display !== 'none') return;
    if (e.key === 'ArrowRight') { fi = (fi + 1) % fcards.length; renderFeat(); resetAuto(); }
    if (e.key === 'ArrowLeft') { fi = (fi - 1 + fcards.length) % fcards.length; renderFeat(); resetAuto(); }
});

/* GRID — the cards are server-rendered from the same data; this wires them up. */
document.querySelectorAll('#wgrid .wc').forEach(card => {
    card.addEventListener('click', () => openProject(card.dataset.id));
});
const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { const i = Array.from(document.querySelectorAll('.wc')).indexOf(e.target); setTimeout(() => e.target.classList.add('in'), i * 60); }
}), { threshold: .1 });
document.querySelectorAll('.wc').forEach(c => obs.observe(c));

/* HERO VIDEO SOUND + CLICK TO PAUSE */
const pvHero = document.getElementById('pv-hero');
pvHero.addEventListener('click', function (e) {
    if (e.target.closest('#pv-sound-btn') || e.target.closest('.pv-hero-info') || e.target.closest('.pv-hero-controls')) return;
    const v = document.getElementById('pv-hero-vid');
    if (v.style.display === 'none') return;
    if (v.paused) { v.play(); pvHero.classList.remove('paused'); document.getElementById('pv-pause-hint').textContent = '⏸'; }
    else { v.pause(); pvHero.classList.add('paused'); document.getElementById('pv-pause-hint').textContent = '▶'; }
});
function toggleHeroSound(e) {
    e.stopPropagation();
    const v = document.getElementById('pv-hero-vid');
    v.muted = !v.muted;
    document.getElementById('pv-sound-btn').textContent = v.muted ? '🔇 Sound Off' : '🔊 Sound On';
}
/* PROJECT PAGE */
function openProject(id) {
    const p = PMAP[id]; if (!p) return;
    window.scrollTo(0, 0);
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('project-view').style.display = 'block';
    document.getElementById('main-nav').style.display = 'none';
    document.getElementById('back-btn').style.display = 'flex';
    clearInterval(autoT);

    const seeRealityEmbed = document.getElementById('see-reality-embed');
    const seeRealityIframe = document.getElementById('see-reality-iframe');
    const normalProjectSections = [
        document.getElementById('pv-hero'),
        document.querySelector('.pv-body'),
        document.querySelector('.pv-more')
    ];

    if (id === 'seereality') {
        normalProjectSections.forEach(el => { if (el) el.style.display = 'none'; });
        seeRealityEmbed.style.display = 'block';
        seeRealityIframe.src = 'https://www.seereality.world/';
        document.getElementById('pv-paper-iframe').src = '';
        document.getElementById('pv-presentation-iframe').src = '';
        document.getElementById('pv-documents').style.display = 'none';
        return;
    }

    seeRealityEmbed.style.display = 'none';
    seeRealityIframe.src = '';
    normalProjectSections.forEach(el => { if (el) el.style.display = ''; });

    document.getElementById('pv-hero-bg').style.background = p.bg;
    document.getElementById('pv-cat').textContent = p.cat;
    document.getElementById('pv-title').textContent = p.name;
    document.getElementById('pv-tags').innerHTML = p.tags.map(t => `<span class="pv-tag">${t}</span>`).join('');
    document.getElementById('pv-caption').textContent = p.caption || '';
    document.getElementById('pv-desc').textContent = p.desc;
    // Optional thesis paper and presentation embeds
    const documentsSection = document.getElementById('pv-documents');
    const paperSection = document.getElementById('pv-paper');
    const paperIframe = document.getElementById('pv-paper-iframe');
    const paperOpen = document.getElementById('pv-paper-open');
    const presentationSection = document.getElementById('pv-presentation');
    const presentationIframe = document.getElementById('pv-presentation-iframe');
    const presentationOpen = document.getElementById('pv-presentation-open');

    paperSection.style.display = p.paper ? 'block' : 'none';
    presentationSection.style.display = p.presentation ? 'block' : 'none';
    documentsSection.style.display = (p.paper || p.presentation) ? 'block' : 'none';

    paperIframe.src = p.paper ? p.paper + '#view=FitH' : '';
    paperOpen.href = p.paper || '#';
    presentationIframe.src = p.presentation ? p.presentation + '#view=FitH&page=1' : '';
    presentationOpen.href = p.presentation || '#';
    // External project button
    const extWrap = document.getElementById('pv-ext-wrap');
    const extData = PROJECT_EXTERNAL_SITES[id];
    if (extData) {
        extWrap.innerHTML = `<a class="pv-ext-btn" href="${extData.url}" target="_blank" rel="noopener">${extData.label}</a>`;
    } else {
        extWrap.innerHTML = '';
    }
    // Download / external button
    const dlBtn = document.getElementById('pv-dl-btn');
    if (p.dl) {
        dlBtn.href = p.dl;
        document.getElementById('pv-dl-label').textContent = p.dlLabel || 'Download';
        dlBtn.style.display = 'inline-flex';
    } else {
        dlBtn.style.display = 'none';
    }
    pvHero.classList.remove('paused');

    // Hero media
    const folder = p.cover.substring(0, p.cover.lastIndexOf('/') + 1);
    const videoSrc = assetUrl(folder + '0.mp4');
    const img = document.getElementById('pv-hero-img'), vid = document.getElementById('pv-hero-vid');
    img.style.display = 'none'; vid.style.display = 'none'; vid.src = ''; vid.muted = true;
    document.getElementById('pv-hero-controls').style.display = 'none';
    document.getElementById('pv-sound-btn').textContent = '🔊 Sound On';

    const testVid = document.createElement('video');
    testVid.src = videoSrc;
    testVid.oncanplaythrough = () => {
        vid.src = videoSrc;
        vid.muted = false; // sound ON by default
        vid.style.display = 'block';
        document.getElementById('pv-hero-controls').style.display = 'flex';
    };
    testVid.onerror = () => { img.src = p.cover; };
    testVid.load();
    setTimeout(() => { if (vid.style.display === 'none' && img.style.display === 'none') img.src = p.cover; }, 1200);

    // Scroll: mute+pause when user reaches description
    const pvBody = document.querySelector('.pv-body');
    const scrollHandler = () => {
        if (!pvBody || vid.style.display === 'none') return;
        const bodyTop = pvBody.getBoundingClientRect().top;
        if (bodyTop < window.innerHeight * 0.6) {
            if (!vid.paused) { vid.pause(); pvHero.classList.add('paused'); document.getElementById('pv-pause-hint').textContent = '▶'; }
            if (!vid.muted) { vid.muted = true; document.getElementById('pv-sound-btn').textContent = '🔇 Sound Off'; }
        }
    };
    // Remove old scroll handler and attach new one
    window._pvScrollHandler && window.removeEventListener('scroll', window._pvScrollHandler);
    window._pvScrollHandler = scrollHandler;
    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Embedded game
    const embed = SITE_DATA.embeds[id];
    const gameWrap = document.getElementById('pv-game-wrap');
    const itchBtn = document.getElementById('pv-itch-btn');
    if (embed) {
        gameWrap.style.display = 'block';
        document.getElementById('pv-game-iframe').src = embed.src;
        if (embed.itchio) { itchBtn.href = embed.itchio; itchBtn.style.display = 'inline-flex'; }
        else itchBtn.style.display = 'none';
    } else {
        gameWrap.style.display = 'none';
        document.getElementById('pv-game-iframe').src = '';
    }

    // Gallery — horizontal, all images 0–12 (png then jpg fallback), plus video
    const gal = document.getElementById('pv-gallery');
    gal.innerHTML = '';

    // Video item
    const vidContainer = document.createElement('div');
    vidContainer.className = 'pv-gallery-item'; vidContainer.style.display = 'none';
    gal.appendChild(vidContainer);
    const vt = document.createElement('video');
    vt.oncanplaythrough = function () {
        if (vidContainer._done) return; vidContainer._done = true;
        const v2 = document.createElement('video'); v2.src = videoSrc; v2.controls = true;
        v2.style.cssText = 'height:100%;width:auto;max-width:500px;display:block;border-radius:14px;';
        vidContainer.appendChild(v2); vidContainer.style.display = '';
    };
    vt.onerror = () => vidContainer.remove();
    vt.src = videoSrc; vt.load();

    // Image items in order (projects can disable still-image galleries)
    if (p.galleryImages !== false) for (let n = 0; n <= 12; n++) {
        const cont = document.createElement('div'); cont.className = 'pv-gallery-item'; cont.style.display = 'none';
        gal.appendChild(cont);
        (function (container, num) {
            const pngSrc = folder + num + '.png';
            const jpgSrc = folder + num + '.jpg';
            function makeImg(src, fallback) {
                const i = document.createElement('img'); i.alt = p.name;
                i.style.cssText = 'height:100%;width:auto;max-width:420px;display:block;border-radius:14px;object-fit:cover;';
                i.onload = function () {
                    i.onclick = () => openLightbox(i.src);
                    container.appendChild(i); container.style.display = '';
                };
                i.onerror = fallback || function () { container.remove(); };
                i.src = src;
            }
            makeImg(pngSrc, () => makeImg(jpgSrc, () => container.remove()));
        })(cont, n);
    }

    // More strip
    const track = document.getElementById('pv-more-track'); track.innerHTML = '';
    PROJECTS.filter(q => q.id !== id).forEach(q => {
        const mc = document.createElement('div'); mc.className = 'pv-more-card';
        mc.innerHTML = `<div class="pv-more-card-bg" style="background:${q.bg}"></div><div class="pv-more-card-ico">${q.ico}</div><img class="pv-more-card-img" src="${q.cover}" onload="this.classList.add('ok')" onerror="imgFallback(this)"><div class="pv-more-card-lbl">${q.name}</div>`;
        mc.addEventListener('click', () => openProject(q.id));
        track.appendChild(mc);
    });
    updateHoverListeners();
}

function goHome() {
    const vid = document.getElementById('pv-hero-vid'); vid.pause(); vid.src = '';
    document.getElementById('pv-game-iframe').src = '';
    document.getElementById('see-reality-iframe').src = '';
    document.getElementById('see-reality-embed').style.display = 'none';
    document.getElementById('pv-hero').style.display = '';
    document.querySelector('.pv-body').style.display = '';
    document.querySelector('.pv-more').style.display = '';
    document.getElementById('home-view').style.display = 'block';
    document.getElementById('project-view').style.display = 'none';
    document.getElementById('main-nav').style.display = 'flex';
    document.getElementById('back-btn').style.display = 'none';
    resetAuto(); window.scrollTo(0, 0);
    // Re-layout hero cards after returning — fixes left-drift glitch
    requestAnimationFrame(() => { layoutCards(); });
}

function openLightbox(src) { document.getElementById('lb-img').src = src; document.getElementById('lightbox').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeLightbox() { document.getElementById('lightbox').classList.remove('open'); document.body.style.overflow = ''; }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* Per-mode palette tracking */
const modeThemes = { dev: '', photo: 'sage' }; // defaults: Warm for dev, Sage for photo
let userPickedTheme = { dev: false, photo: false };

function setTheme(t, el) {
    document.body.dataset.theme = t;
    document.querySelectorAll('.sw').forEach(s => s.classList.remove('on'));
    if (el) el.classList.add('on');
    document.getElementById('sw').classList.remove('open');
    // Track that the user manually picked a palette for this mode
    modeThemes[currentMode] = t;
    userPickedTheme[currentMode] = true;
}
function applyThemeForMode(mode) {
    const t = modeThemes[mode];
    document.body.dataset.theme = t;
    // Update swatch highlight
    const swatches = document.querySelectorAll('.sw');
    swatches.forEach(s => s.classList.remove('on'));
    const themeNames = { '': 'Warm', 'white': 'White', 'sage': 'Sage', 'dark': 'Dark', 'night': 'Night' };
    const targetName = themeNames[t] || 'Warm';
    swatches.forEach(s => { if (s.querySelector('span').textContent === targetName) s.classList.add('on'); });
}
function togglePal() { document.getElementById('sw').classList.toggle('open'); }
document.addEventListener('click', e => { if (!document.getElementById('pal').contains(e.target)) document.getElementById('sw').classList.remove('open'); });

/* ============================
   PHOTOGRAPHY PORTFOLIO MODE
   ============================ */

let currentMode = 'dev'; // 'dev' or 'photo'

/*
  PHOTO CONFIG
  ────────────
  Folder structure:
    photography/Featured/0.webp, 1.webp, 2.webp ...
    photography/All Works/0.webp, 1.webp, 2.webp ...
    photography/3D & Spatial/model.ply, scan.obj, scene.fbx

  Just set the counts below to match how many .jpg files are in each folder.
  Files MUST be numbered starting from 0.
*/

const FEATURED_PHOTO_COUNT = SITE_DATA.featuredPhotoCount;
const ALL_WORKS_PHOTO_COUNT = SITE_DATA.allWorksPhotoCount;

// The .ply scans are too large for Pages and are served from R2.
const MODELS_3D = SITE_DATA.models3d.map(m => ({ ...m, file: assetUrl(m.file) }));
window.MODELS_3D = MODELS_3D;

const BASE_ROW_H = SITE_DATA.baseRowH, EXPAND_ROW_H = SITE_DATA.expandRowH;

/* ── Render Featured Strip (auto-scrolling) ── */
function renderFeatured() {
    const track = document.getElementById('photo-feat-track');
    track.innerHTML = '';
    const inner = document.createElement('div');
    inner.className = 'photo-feat-inner';

    function makeCard(i) {
        const card = document.createElement('div');
        card.className = 'photo-feat-card';
        const img = document.createElement('img');
        img.src = '/photography/Featured/' + i + '.webp';
        img.alt = 'Featured photo ' + i;
        img.decoding = 'async';
        img.onerror = function () { card.remove(); };
        card.appendChild(img);
        card.addEventListener('click', function () { openLightbox(img.src); });
        return card;
    }

    // First set
    for (let i = 0; i < FEATURED_PHOTO_COUNT; i++) inner.appendChild(makeCard(i));
    // Duplicate set for seamless loop
    for (let i = 0; i < FEATURED_PHOTO_COUNT; i++) inner.appendChild(makeCard(i));

    track.appendChild(inner);

    // Adjust scroll speed based on content width (slower for fewer items)
    requestAnimationFrame(() => {
        const totalW = inner.scrollWidth / 2;
        const dur = Math.max(totalW / 20, 40); // ~20px/sec, minimum 40s
        inner.style.setProperty('--feat-dur', dur + 's');
    });
}

/* ── Render All Works Justified Grid ── */
let photoGridObserver = null;
function renderAllWorks() {
    const grid = document.getElementById('photo-grid');
    grid.innerHTML = '';
    if (photoGridObserver) photoGridObserver.disconnect();

    // IntersectionObserver for fade-in reveal
    photoGridObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                photoGridObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '50px' });

    for (let i = 0; i < ALL_WORKS_PHOTO_COUNT; i++) {
        const item = document.createElement('div');
        item.className = 'photo-grid-item';
        item.style.flexGrow = '1';
        item.style.flexShrink = '1';
        item.style.flexBasis = '180px';
        const img = document.createElement('img');
        img.alt = 'Photo ' + i;
        img.decoding = 'async';
        img.src = '/photography/All%20Works/' + i + '.webp';
        img.onload = function () {
            const ratio = this.naturalWidth / this.naturalHeight;
            item._ratio = ratio;
            item.style.flexBasis = (BASE_ROW_H * ratio) + 'px';
            item.style.flexGrow = ratio;
        };
        img.onerror = function () { item.remove(); };
        item.addEventListener('click', function () {
            flipExpandPhoto(item, grid);
        });
        item.appendChild(img);
        grid.appendChild(item);
        // Observe for scroll-triggered fade-in
        photoGridObserver.observe(item);
    }
}

/*
  FLIP Animation for photo expand/collapse
  Captures all item positions before layout change,
  applies the change instantly, then animates every
  item from its old position to its new one.
*/
function flipExpandPhoto(clickedItem, grid) {
    const items = Array.from(grid.querySelectorAll('.photo-grid-item'));

    // FIRST: snapshot every item's rect
    const firstRects = new Map();
    items.forEach(el => firstRects.set(el, el.getBoundingClientRect()));

    // Apply layout change instantly
    const wasExpanded = clickedItem.classList.contains('expanded');
    const prev = grid.querySelector('.photo-grid-item.expanded');
    if (prev && prev !== clickedItem) {
        prev.classList.remove('expanded');
        prev.style.height = BASE_ROW_H + 'px';
        if (prev._ratio) prev.style.flexBasis = (BASE_ROW_H * prev._ratio) + 'px';
    }
    clickedItem.classList.toggle('expanded', !wasExpanded);
    if (!wasExpanded) {
        clickedItem.style.height = EXPAND_ROW_H + 'px';
        if (clickedItem._ratio) clickedItem.style.flexBasis = (EXPAND_ROW_H * clickedItem._ratio) + 'px';
    } else {
        clickedItem.style.height = BASE_ROW_H + 'px';
        if (clickedItem._ratio) clickedItem.style.flexBasis = (BASE_ROW_H * clickedItem._ratio) + 'px';
    }

    // Force the browser to compute the new layout
    void grid.offsetHeight;

    // LAST + INVERT + PLAY
    const animOpts = { duration: 420, easing: 'cubic-bezier(.22,.61,.36,1)' };

    items.forEach(el => {
        const f = firstRects.get(el);
        if (!f) return;
        const l = el.getBoundingClientRect();

        const dx = f.left - l.left;
        const dy = f.top - l.top;
        const dw = f.width / (l.width || 1);
        const dh = f.height / (l.height || 1);

        const moved = Math.abs(dx) > 1 || Math.abs(dy) > 1;
        const sized = Math.abs(dw - 1) > 0.02 || Math.abs(dh - 1) > 0.02;

        if (!moved && !sized) return;

        if (sized) {
            // Item changed size (the one expanding or collapsing)
            el.style.transformOrigin = '0 0';
            const anim = el.animate([
                { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + dw + ',' + dh + ')' },
                { transform: 'translate(0,0) scale(1,1)' }
            ], animOpts);
            anim.onfinish = () => { el.style.transformOrigin = ''; };
        } else {
            // Item only moved position (surrounding items reflowing)
            el.animate([
                { transform: 'translate(' + dx + 'px,' + dy + 'px)' },
                { transform: 'translate(0,0)' }
            ], animOpts);
        }
    });
}

/* ── Render 3D Viewers ── */
function render3DSection() {
    const container = document.getElementById('photo-3d-grid');
    container.innerHTML = '';
    if (MODELS_3D.length === 0) {
        document.getElementById('sect-photo-3d').style.display = 'none';
        return;
    }
    document.getElementById('sect-photo-3d').style.display = '';
    MODELS_3D.forEach((m, idx) => {
        const item = document.createElement('div');
        item.className = 'viewer-item';
        item.id = 'viewer-' + idx;
        item.dataset.modelIdx = idx;
        // Loading text
        const loading = document.createElement('div');
        loading.className = 'viewer-loading';
        loading.textContent = 'Scroll to load';
        item.appendChild(loading);
        // Label
        const lbl = document.createElement('div');
        lbl.className = 'viewer-label';
        const ext = m.file.split('.').pop().toUpperCase();
        lbl.innerHTML = m.name + '<div class="viewer-label-sub">' + ext + ' Model</div>';
        item.appendChild(lbl);
        // Expand button
        const expBtn = document.createElement('button');
        expBtn.className = 'viewer-expand';
        expBtn.innerHTML = '⛶';
        expBtn.title = 'Toggle fullwidth';
        expBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            item.classList.toggle('expanded');
            if (window._viewerResize) window._viewerResize(idx);
        });
        item.appendChild(expBtn);
        container.appendChild(item);
    });
    // Lazy load: only init viewers when scrolled into view
    if (window.initLazyViewers) window.initLazyViewers();
}

/* ── Master render ── */
function renderPhotoSections() {
    renderFeatured();
    // render3DSection(); // commented out until 3D viewers are ready
    renderAllWorks();
    updateHoverListeners();
}

/* MODE SWITCHING */
function switchMode(mode) {
    if (mode === currentMode) return;
    currentMode = mode;
    window.scrollTo(0, 0);
    const homeView = document.getElementById('home-view');
    const photoView = document.getElementById('photo-view');
    const projectView = document.getElementById('project-view');
    const mainNav = document.getElementById('main-nav');
    const backBtn = document.getElementById('back-btn');
    const vid = document.getElementById('pv-hero-vid'); vid.pause(); vid.src = '';
    document.getElementById('pv-game-iframe').src = '';
    projectView.style.display = 'none';
    mainNav.style.display = 'flex';
    backBtn.style.display = 'none';
    document.getElementById('mode-dev').classList.toggle('active', mode === 'dev');
    document.getElementById('mode-photo').classList.toggle('active', mode === 'photo');
    if (mode === 'dev') {
        homeView.style.display = 'block';
        photoView.style.display = 'none';
        updateDevNav();
        applyThemeForMode('dev');
        resetAuto();
        requestAnimationFrame(() => layoutCards());
    } else {
        homeView.style.display = 'none';
        photoView.style.display = 'block';
        updatePhotoNav();
        applyThemeForMode('photo');
        clearInterval(autoT);
        renderPhotoSections();
    }
    updateHoverListeners();
}

function updateDevNav() {
    const nav = document.getElementById('main-nav');
    nav.innerHTML = `
<li><a href="#hero" class="on" onclick="smoothTo('hero')">Info</a></li>
<li><a href="#sect-featured" onclick="smoothTo('sect-featured')">Featured</a></li>
<li><a href="#sect-play" onclick="smoothTo('sect-play')">Play</a></li>
<li><a href="#sect-projects" onclick="smoothTo('sect-projects')">Projects</a></li>
<li><a href="#" onclick="switchMode('photo');return false;">Photography</a></li>
<li><a href="#sect-contact" onclick="smoothTo('sect-contact')">Contact</a></li>
      `;
    updateHoverListeners();
}

function updatePhotoNav() {
    const nav = document.getElementById('main-nav');
    nav.innerHTML = `
<li><a href="#photo-hero" class="on" onclick="smoothTo('photo-hero')">Info</a></li>
<li><a href="#sect-photo-featured" onclick="smoothTo('sect-photo-featured')">Featured</a></li>
<li><a href="#sect-photo-all" onclick="smoothTo('sect-photo-all')">All Works</a></li>
<li><a href="#sect-photo-3d" onclick="smoothTo('sect-photo-3d')">3D / Spatial</a></li>
<li><a href="#" onclick="switchMode('dev');return false;">XR / Dev</a></li>
<li><a href="#sect-photo-contact" onclick="smoothTo('sect-photo-contact')">Contact</a></li>
      `;
    updateHoverListeners();
}

/* Patch goHome to be mode-aware */
goHome = function () {
    const vid = document.getElementById('pv-hero-vid'); vid.pause(); vid.src = '';
    document.getElementById('pv-game-iframe').src = '';
    document.getElementById('project-view').style.display = 'none';
    document.getElementById('back-btn').style.display = 'none';
    document.getElementById('main-nav').style.display = 'flex';
    document.getElementById('mode-switch').style.opacity = '1';
    document.getElementById('mode-switch').style.pointerEvents = 'all';
    window.scrollTo(0, 0);
    if (currentMode === 'photo') {
        document.getElementById('home-view').style.display = 'none';
        document.getElementById('photo-view').style.display = 'block';
        updatePhotoNav();
        applyThemeForMode('photo');
        renderPhotoSections();
    } else {
        document.getElementById('home-view').style.display = 'block';
        document.getElementById('photo-view').style.display = 'none';
        updateDevNav();
        applyThemeForMode('dev');
        resetAuto();
        requestAnimationFrame(() => layoutCards());
    }
    updateHoverListeners();
};

/* Hide mode switch when in project detail */
const _origOpenProject = openProject;
openProject = function (id) {
    document.getElementById('mode-switch').style.opacity = '0';
    document.getElementById('mode-switch').style.pointerEvents = 'none';
    _origOpenProject(id);
};
