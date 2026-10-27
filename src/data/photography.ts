/**
 * The photography side of the site.
 *
 * Both galleries are numbered-from-zero folders rather than a hand-kept list,
 * so adding a shot means dropping in the next number and bumping the count.
 * Images that 404 remove their own tile at runtime, which is what makes an
 * off-by-one here cosmetic rather than a broken grid.
 */

/** photography/Featured/0.webp … 6.webp */
export const FEATURED_PHOTO_COUNT = 7;

/** photography/All Works/0.webp … 29.webp */
export const ALL_WORKS_PHOTO_COUNT = 30;

/** Justified-grid row heights, in px. */
export const BASE_ROW_H = 220;
export const EXPAND_ROW_H = 500;

export type Model3D = { name: string; file: string };

/** photography/3D & Spatial/0.ply … 18.ply */
export const MODELS_3D_COUNT = 19;

export const MODELS_3D: Model3D[] = Array.from(
    { length: MODELS_3D_COUNT },
    (_, i) => ({ name: `3D Scan ${i}`, file: `/photography/3D & Spatial/${i}.ply` }),
);

/**
 * The 3D section is built but not switched on — the original renders a
 * "Coming Soon" heading and leaves render3DSection() commented out. Flipping
 * this to true is the whole switch; the viewer and the models are in place.
 */
export const SHOW_3D_SECTION = false;
