import test from 'node:test';
import assert from 'node:assert/strict';
import { clampGalleryScroll, galleryCategoryAt, galleryLean, galleryWheelPixels } from '../lib/kinetic-gallery.ts';

test('rail targets stay inside actual content, including a non-overflowing layout', () => {
  assert.equal(clampGalleryScroll(-500, 1000), 0);
  assert.equal(clampGalleryScroll(1800, 1000), 1000);
  assert.equal(clampGalleryScroll(500, -10), 0);
});
test('wheel lines and pages use the rail viewport, not the global window', () => {
  assert.equal(galleryWheelPixels(3, 0, 400), 3);
  assert.equal(galleryWheelPixels(-3, 1, 400), -72);
  assert.equal(galleryWheelPixels(1, 2, 400), 400);
});
test('lean follows direction and speed but never exceeds nine degrees or reduced-motion preference', () => {
  assert.equal(galleryLean(0), 0);
  assert.ok(Math.abs(galleryLean(2)) > Math.abs(galleryLean(1)));
  assert.equal(galleryLean(50), -9);
  assert.equal(galleryLean(-50), 9);
  assert.equal(galleryLean(50, true), 0);
});
test('visible category follows grouped anchors and handles the final category at the rail boundary', () => {
  const anchors = [{ category: 'Kuliner', left: 40 }, { category: 'Jasa', left: 840 }, { category: 'Produk', left: 3100 }, { category: 'Pendidikan', left: 5400 }];
  assert.equal(galleryCategoryAt(anchors, 0, 1200, 5500), 'Kuliner');
  assert.equal(galleryCategoryAt(anchors, 800, 1200, 5500), 'Jasa');
  assert.equal(galleryCategoryAt(anchors, 3300, 1200, 5500), 'Produk');
  assert.equal(galleryCategoryAt(anchors, 5499, 1200, 5500), 'Pendidikan');
  assert.equal(galleryCategoryAt([], 0, 1000, 0), '');
});
