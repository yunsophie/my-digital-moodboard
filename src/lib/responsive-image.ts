/** One generated asset family; URL imports let Vite apply the hosting base path. */
export type ResponsiveImageAsset = {
  id: string;
  src: string;
  srcSet: string;
  width: number;
  height: number;
  candidates: readonly { src: string; width: number; height: number; bytes: number }[];
};

// These slots match the board's padding, gaps, and 2/3/5 column breakpoints.
// Keep them aligned with the grid CSS when changing the layout.
export const GRID_IMAGE_SIZES =
  "(min-width: 1024px) calc((100vw - 72px) / 5), " +
  "(min-width: 768px) calc((100vw - 48px) / 3), " +
  "(min-width: 640px) calc((100vw - 36px) / 2), calc((100vw - 24px) / 2)";

// The timeline has a 32px mobile indent and a 320px cap. Back panels add 34px
// of padding/border inside whichever slot contains their front image.
export const TIMELINE_IMAGE_SIZES = "(min-width: 368px) 320px, calc(100vw - 48px)";
export const GRID_POSTER_SIZES =
  "(min-width: 1024px) calc((100vw - 72px) / 5 - 34px), " +
  "(min-width: 768px) calc((100vw - 48px) / 3 - 34px), " +
  "(min-width: 640px) calc((100vw - 36px) / 2 - 34px), " +
  "calc((100vw - 24px) / 2 - 34px)";
export const TIMELINE_POSTER_SIZES = "(min-width: 368px) 286px, calc(100vw - 82px)";
