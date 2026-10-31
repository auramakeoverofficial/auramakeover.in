/* Portfolio lightbox for .gallery images on the home and bridal pages.
   Progressive enhancement: the markup stays a plain grid of images, and the
   button affordances below are added at runtime, so nothing advertises a
   click target that would not work if this file fails to load. */
(() => {
  'use strict';

  const galleries = document.querySelectorAll('.gallery');
  if (!galleries.length) return;

  const items = [];
  galleries.forEach((gallery) => {
    gallery.querySelectorAll('img').forEach((img) => {
      img.dataset.auraIndex = items.length;
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'View larger: ' + (img.alt || 'portfolio image'));
      items.push(img);
    });
  });
  if (!items.length) return;

  // The thumbnails load a 480w candidate; the viewer wants the widest one.
  function bestSrc(img) {
    const set = img.getAttribute('srcset');
    if (!set) return img.currentSrc || img.src;
    let best = null, bestWidth = -1;
    set.split(',').forEach((candidate) => {
      const [url, descriptor] = candidate.trim().split(/\s+/);
      const width = descriptor && descriptor.endsWith('w') ? parseInt(descriptor, 10) : 0;
      if (url && width > bestWidth) { bestWidth = width; best = url; }
    });
    return best || img.currentSrc || img.src;
  }

  const overlay = document.createElement('div');
  overlay.className = 'aura-lightbox';
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Portfolio image viewer');
  overlay.innerHTML =
    '<button class="aura-lb-close" type="button" aria-label="Close image viewer">×</button>' +
    '<button class="aura-lb-nav aura-lb-prev" type="button" aria-label="Previous image">‹</button>' +
    '<figure class="aura-lb-figure">' +
      '<img class="aura-lb-img" alt="">' +
      '<figcaption class="aura-lb-caption"></figcaption>' +
    '</figure>' +
    '<button class="aura-lb-nav aura-lb-next" type="button" aria-label="Next image">›</button>';
  document.body.appendChild(overlay);

  const lightboxImage = overlay.querySelector('.aura-lb-img');
  const caption = overlay.querySelector('.aura-lb-caption');
  const closeButton = overlay.querySelector('.aura-lb-close');

  let index = 0;
  let lastFocused = null;

  function show(next) {
    index = (next + items.length) % items.length;
    const source = items[index];
    lightboxImage.src = bestSrc(source);
    lightboxImage.alt = source.alt || '';
    caption.textContent = source.alt || '';
  }

  function open(next) {
    lastFocused = document.activeElement;
    show(next);
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }

  function close() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  galleries.forEach((gallery) => {
    gallery.addEventListener('click', (event) => {
      const img = event.target.closest('img[data-aura-index]');
      if (img) open(Number(img.dataset.auraIndex));
    });
    gallery.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const img = event.target.closest('img[data-aura-index]');
      if (!img) return;
      event.preventDefault();
      open(Number(img.dataset.auraIndex));
    });
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay || event.target.closest('.aura-lb-close')) close();
    else if (event.target.closest('.aura-lb-prev')) show(index - 1);
    else if (event.target.closest('.aura-lb-next')) show(index + 1);
  });

  document.addEventListener('keydown', (event) => {
    if (overlay.hidden) return;
    if (event.key === 'Escape') { close(); return; }
    if (event.key === 'ArrowLeft') { show(index - 1); return; }
    if (event.key === 'ArrowRight') { show(index + 1); return; }
    if (event.key !== 'Tab') return;
    // Keep focus inside the dialog while it is open.
    const focusable = [...overlay.querySelectorAll('button')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
})();
