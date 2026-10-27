/**
 * The palettes.
 *
 * One of these is going to be chosen and the rest deleted, so they are data
 * rather than five hand-written blocks of CSS: Base.astro emits the custom
 * properties from this file, and the picker in the corner reads the same array
 * for its names and swatches. Nothing can drift out of step, and removing an
 * option is removing one object.
 *
 * Every palette carries the same eight colours, and only those eight. The
 * muted text, the hairlines and the sweep gradients are all derived from them
 * in global.css, which is why a palette is this short and why none of them can
 * half-apply.
 *
 *   ink      the dark base. Scrims and lightbox backdrops use it in both
 *            modes — a photograph wants a dark surround even on a light page.
 *   paper    the light base.
 *   bg       the page. `ink` in dark mode, `paper` in light.
 *   surface  a quiet panel on the page: card wells, letterboxing, the demo.
 *   text     body colour. Held at 13:1 or better against bg in every palette.
 *   accent   rules, underlines, the sweep, display-size numerals. Never body
 *            text in the dark palettes where it is a warm mid-tone, which is
 *            the rule the original palette was built around.
 *   deep     the footer and the badges, a surface in its own right.
 *   onDeep   text on `deep`.
 *   onAccent text on `accent`, for the one place it is a fill: ::selection.
 *
 * `amb` is the four background blobs plus their opacity — see Ambient.astro.
 * They are two or three steps off `bg` on purpose: the brightest one in the
 * default palette is about nine percent lighter than the page it sits on,
 * which leaves body text above 9:1 even where two overlap.
 */

export type PaletteMode = {
    ink: string;
    paper: string;
    bg: string;
    surface: string;
    text: string;
    accent: string;
    deep: string;
    onDeep: string;
    onAccent: string;
    amb: [string, string, string, string];
    ambAlpha: string;
};

export type Palette = {
    id: string;
    name: string;
    /** One line, shown in the picker, on what the palette is doing. */
    note: string;
    dark: PaletteMode;
    light: PaletteMode;
};

export const PALETTES: Palette[] = [
    {
        id: 'nocturne',
        name: 'Nocturne',
        note: 'Near-black violet with a cold cyan. The most XR of the five.',
        dark: {
            ink: '#070a17', paper: '#eef1fb',
            bg: '#070a17', surface: '#151c36', text: '#eef1fb',
            accent: '#48d9ff', deep: '#221a42', onDeep: '#eef1fb', onAccent: '#050a14',
            amb: ['#101a3f', '#14275e', '#182a50', '#0b1130'], ambAlpha: '.55',
        },
        light: {
            ink: '#070a17', paper: '#eef1fb',
            bg: '#eef1fb', surface: '#dfe6f6', text: '#070a17',
            accent: '#0b6a8c', deep: '#221a42', onDeep: '#eef1fb', onAccent: '#eef1fb',
            amb: ['#dde5f8', '#d3def5', '#e2e9fa', '#cbd7f2'], ambAlpha: '.7',
        },
    },
    {
        id: 'ember',
        name: 'Ember',
        note: 'Charcoal and coral. Warm, close, high contrast.',
        dark: {
            ink: '#120c10', paper: '#f7e9dc',
            bg: '#120c10', surface: '#2b1a1e', text: '#f7e9dc',
            accent: '#ff6a45', deep: '#3a1c22', onDeep: '#f7e9dc', onAccent: '#1a0c08',
            amb: ['#2d1720', '#3d1d22', '#33202c', '#1d1014'], ambAlpha: '.6',
        },
        light: {
            ink: '#120c10', paper: '#f7e9dc',
            bg: '#faeee6', surface: '#f1ded1', text: '#120c10',
            accent: '#bf3a15', deep: '#3a1c22', onDeep: '#f7e9dc', onAccent: '#faeee6',
            amb: ['#f2ddd0', '#eed4c4', '#f5e4d9', '#e8cbb8'], ambAlpha: '.7',
        },
    },
    {
        id: 'charm',
        name: 'Vintage Charm',
        note: 'The archive. Ink, wheat and burnt orange.',
        dark: {
            ink: '#04151f', paper: '#efd6ac',
            bg: '#04151f', surface: '#183a37', text: '#efd6ac',
            accent: '#c44900', deep: '#432534', onDeep: '#efd6ac', onAccent: '#efd6ac',
            amb: ['#0e2b4a', '#12395c', '#163a4f', '#0a2138'], ambAlpha: '.55',
        },
        light: {
            ink: '#04151f', paper: '#efd6ac',
            bg: '#efd6ac', surface: '#e7cd9d', text: '#04151f',
            accent: '#a83d00', deep: '#432534', onDeep: '#efd6ac', onAccent: '#efd6ac',
            amb: ['#e3c895', '#dcbf88', '#e9d3a6', '#d8b97f'], ambAlpha: '.72',
        },
    },
    {
        id: 'viridian',
        name: 'Viridian',
        note: 'Deep forest with a mint edge. Quiet but not dim.',
        dark: {
            ink: '#04130f', paper: '#e8f4ec',
            bg: '#04130f', surface: '#10302a', text: '#e8f4ec',
            accent: '#6ef0a8', deep: '#152f3a', onDeep: '#e8f4ec', onAccent: '#04130f',
            amb: ['#0c2b2a', '#10403a', '#123a43', '#08201d'], ambAlpha: '.55',
        },
        light: {
            ink: '#04130f', paper: '#e8f4ec',
            bg: '#edf6f0', surface: '#dcece1', text: '#04130f',
            accent: '#0d6b45', deep: '#152f3a', onDeep: '#e8f4ec', onAccent: '#edf6f0',
            amb: ['#daece1', '#cfe5d7', '#e1f0e6', '#c6dfd0'], ambAlpha: '.7',
        },
    },
    {
        id: 'signal',
        name: 'Signal',
        note: 'True navy and a magenta that does not ask twice.',
        dark: {
            ink: '#060a16', paper: '#ecebf6',
            bg: '#060a16', surface: '#16203c', text: '#ecebf6',
            accent: '#ff4d9d', deep: '#2b1436', onDeep: '#ecebf6', onAccent: '#14060f',
            amb: ['#101c46', '#152456', '#241a4a', '#0a1028'], ambAlpha: '.58',
        },
        light: {
            ink: '#060a16', paper: '#ecebf6',
            bg: '#f2f1fa', surface: '#e4e2f2', text: '#060a16',
            accent: '#b4145f', deep: '#2b1436', onDeep: '#ecebf6', onAccent: '#f2f1fa',
            amb: ['#e3e1f5', '#d9d6f0', '#e8e5f8', '#cfcbea'], ambAlpha: '.7',
        },
    },
];

/* Nocturne leads, and leading the array is what makes it the default: the
   picker, the <html> attribute and the emitted CSS all read this. */
export const DEFAULT_PALETTE = PALETTES[0].id;

/** The custom properties for one mode, as CSS declarations. */
function declarations(m: PaletteMode): string {
    return [
        `--ink:${m.ink}`,
        `--paper:${m.paper}`,
        `--bg:${m.bg}`,
        `--surface:${m.surface}`,
        `--text:${m.text}`,
        `--accent:${m.accent}`,
        `--deep:${m.deep}`,
        `--on-deep:${m.onDeep}`,
        `--on-accent:${m.onAccent}`,
        ...m.amb.map((c, i) => `--amb-${i + 1}:${c}`),
        `--amb-alpha:${m.ambAlpha}`,
    ].join(';');
}

/**
 * The whole set as one stylesheet.
 *
 * Both selectors carry two attributes so they outrank anything in global.css
 * without !important, and so a palette's dark values can never leak into light
 * mode through source order — which is exactly what happens with
 * single-attribute selectors of equal specificity.
 */
export function paletteCss(): string {
    return PALETTES.map(
        (p) =>
            `html[data-palette='${p.id}'][data-theme='ink']{${declarations(p.dark)}}` +
            `html[data-palette='${p.id}'][data-theme='wheat']{${declarations(p.light)}}`,
    ).join('');
}
