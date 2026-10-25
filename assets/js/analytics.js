/* GA4 for auramakeover.in. Loaded with `defer` from every page in sitemap.xml.
   Tracks the four contact actions that matter: WhatsApp, phone, email and
   directions, each tagged with the placement the visitor clicked from. */
(() => {
  'use strict';
  const MEASUREMENT_ID = 'G-7VBTN74P18';
  if (!/^G-[A-Z0-9]+$/.test(MEASUREMENT_ID)) return;

  // Runs once per page load even if this file ends up included twice.
  if (window.__auraAnalytics) return;
  window.__auraAnalytics = true;

  window.dataLayer = window.dataLayer || [];
  const gtag = window.gtag || (window.gtag = function () { window.dataLayer.push(arguments); });

  // Install the Google tag only if no other tag on the page already has.
  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    gtag('js', new Date());
    gtag('config', MEASUREMENT_ID);
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(script);
  }

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
    gtag('event', name, { page_path: window.location.pathname, cta_placement: placement });
  });
})();
