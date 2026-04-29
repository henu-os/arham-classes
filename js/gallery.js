/**
 * gallery.js — Arham Coaching Classes
 * Gallery lightbox initialization
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initGalleryLightbox();
});

function initGalleryLightbox() {
  if (typeof lightbox !== 'undefined') {
    lightbox.option({
      resizeDuration: 250,
      wrapAround: true,
      fadeDuration: 300,
      imageFadeDuration: 300,
      albumLabel: 'Image %1 of %2',
    });
  }
}
