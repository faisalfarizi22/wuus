export type GalleryAnchor = { category: string; left: number };

export function clampGalleryScroll(value: number, maximum: number) {
  return Math.min(Math.max(0, maximum), Math.max(0, value));
}

export function galleryWheelPixels(delta: number, mode: number, viewport: number) {
  return delta * (mode === 1 ? 24 : mode === 2 ? viewport : 1);
}

export function galleryLean(velocity: number, reducedMotion = false) {
  return reducedMotion || velocity === 0 ? 0 : Math.max(-9, Math.min(9, -velocity * 2.1));
}

export function galleryCategoryAt(anchors: GalleryAnchor[], scroll: number, viewport: number, maximum: number) {
  if (!anchors.length) return "";
  if (maximum > 0 && scroll >= maximum - 2) return anchors[anchors.length - 1].category;
  const readingPosition = scroll + Math.min(160, viewport * .18);
  return [...anchors].reverse().find(anchor => anchor.left <= readingPosition)?.category ?? anchors[0].category;
}
