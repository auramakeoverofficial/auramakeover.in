/* Optional GA4 configuration. Leave empty until the site owner supplies their
   measurement ID. No analytics requests or event collection occur while empty.
   Configure any required consent controls before activating analytics. */
(() => {
  'use strict';
  const measurementId = '';
  if (!/^G-[A-Z0-9]+$/.test(measurementId)) return;

  window.dataLayer = window.dataLayer || [];
  const gtag = window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', measurementId);
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
  document.head.appendChild(script);

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    let name;
    if (href.startsWith('https://wa.me/')) name = 'whatsapp_click';
    else if (href.startsWith('tel:')) name = 'phone_click';
    else if (href.startsWith('mailto:')) name = 'email_click';
    else if (href.startsWith('https://maps.app.goo.gl/')) name = 'directions_click';
    if (!name) return;
    const placement = link.closest('.mobile-actions') ? 'mobile_bar'
      : link.closest('.hero') ? 'hero'
      : link.closest('header') ? 'header'
      : link.closest('footer') ? 'footer' : 'content';
    gtag('event', name, { page_path: window.location.pathname, cta_placement: placement,
      transport_type: 'beacon' });
  });
})();
