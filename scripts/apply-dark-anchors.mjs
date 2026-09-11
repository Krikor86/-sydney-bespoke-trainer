import { readFile, writeFile } from 'node:fs/promises';

const indexFile = new URL('../index.html', import.meta.url);
const marker = 'data-theme-anchor="dark-method-pricing"';
let html = await readFile(indexFile, 'utf8');

if (!html.includes(marker)) {
  const darkAnchorStyles = `
<style ${marker}>
  /* Dark visual anchors: Method + Pricing. Keep all other sections unchanged. */
  #method,
  #method .wrap,
  #method .grid,
  #method .cell,
  #pricing,
  #pricing .wrap,
  #pricing .pricing-belief,
  #pricing .tiers,
  #pricing .tier,
  #pricing .inc,
  #pricing .pricing-cta {
    background-color: var(--ink) !important;
    color: var(--white);
  }

  #method .sec-head,
  #method .grid,
  #method .cell,
  #pricing .sec-head,
  #pricing .pricing-belief,
  #pricing .tiers,
  #pricing .tier,
  #pricing .inc {
    border-color: rgba(248,245,239,.20) !important;
  }

  #method .sec-head .mono,
  #method .sec-head p,
  #method .cell p,
  #pricing .sec-head .mono,
  #pricing .sec-head p,
  #pricing .tier .mono,
  #pricing .tier p,
  #pricing .inc .mono,
  #pricing .inc li,
  #pricing .inc p {
    color: rgba(248,245,239,.68) !important;
  }

  #method h2,
  #method h3,
  #pricing h2,
  #pricing .amt,
  #pricing blockquote {
    color: var(--white);
  }

  #method .o,
  #method .cell .mono,
  #pricing .o,
  #pricing .pricing-belief .mono,
  #pricing .tier p b,
  #pricing .inc li::before {
    color: var(--orange) !important;
  }

  #pricing .tier:nth-child(1),
  #pricing .tier:nth-child(3) {
    background-color: #111111 !important;
  }

  #pricing .tier:nth-child(2) {
    background-color: #1a1a1a !important;
    box-shadow: inset 0 3px 0 var(--orange);
  }

  /* Remove the duplicate hero consultation CTA. */
  .index .cta-cell {
    display: none !important;
  }

  /* Prevent document-level horizontal drift on mobile without disabling the results carousel. */
  html,
  body {
    width: 100% !important;
    max-width: 100vw !important;
    overflow-x: hidden !important;
  }

  body,
  main,
  header,
  footer,
  section,
  .wrap,
  .hero-grid,
  .figures,
  .grid,
  .about,
  .ledger,
  .steps,
  .tiers,
  .tier,
  .inc,
  .doors,
  .door,
  .faq,
  .contact-grid {
    min-width: 0;
    max-width: 100%;
  }

  main,
  header,
  footer,
  section,
  .wrap {
    overflow-x: clip;
  }

  #results .wrap {
    overflow-x: visible;
  }

  #results {
    overflow-x: clip;
  }

  .shots {
    max-width: 100%;
    overscroll-behavior-x: contain;
  }

  #pricing .amt,
  #pricing .amt small,
  #pricing .inc,
  #pricing .inc li,
  #pricing .pricing-cta,
  .door h3,
  .sec-head h2 {
    max-width: 100%;
  }

  @media (max-width: 960px) {
    /* Show the complete About portrait instead of forcing a 4:3 crop through the arms. */
    #about .about-photo img {
      width: 100% !important;
      height: auto !important;
      aspect-ratio: auto !important;
      object-fit: contain !important;
      object-position: center center !important;
    }
  }

  @media (max-width: 600px) {
    /* Keep the pricing CTA compact and clearly secondary to the enquiry form. */
    #pricing .pricing-cta {
      justify-content: flex-start;
      padding-top: 22px;
    }

    #pricing .pricing-cta .btn {
      width: auto;
      min-width: 0;
      max-width: min(100%, 310px);
      min-height: 46px;
      padding: 11px 18px;
      font-size: 9.5px;
      line-height: 1.25;
      white-space: normal;
      text-align: left;
    }

    #pricing .tier,
    #pricing .pricing-belief,
    #pricing .inc,
    #pricing .pricing-cta,
    .doors,
    .door,
    .sec-head {
      min-width: 0 !important;
      max-width: 100% !important;
    }

    #pricing .amt {
      white-space: normal;
    }
  }
</style>`;

  if (!html.includes('</head>')) {
    throw new Error('Could not find </head> in index.html');
  }

  html = html.replace('</head>', `${darkAnchorStyles}\n</head>`);
  await writeFile(indexFile, html, 'utf8');
}

const overflowMarker = 'data-mobile-overflow-lock="v3"';
if (!html.includes(overflowMarker)) {
  const overflowLock = `
<style ${overflowMarker}>
  html,
  body {
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: clip !important;
    overscroll-behavior-x: none;
  }

  body {
    position: relative;
  }

  @media (max-width: 600px) {
    header,
    main,
    footer,
    section,
    .wrap,
    .nav,
    .hero,
    .hero-grid,
    .figures,
    .grid,
    .about,
    .ledger,
    .steps,
    .tiers,
    .tier,
    .inc,
    .doors,
    .door,
    .faq,
    .contact,
    .contact-grid,
    .contact-actions,
    .form {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
    }

    header,
    main,
    footer,
    section,
    .wrap,
    .nav,
    .hero,
    #method,
    #about,
    #results,
    #process,
    #pricing,
    #faq,
    #contact,
    .contact,
    .contact-grid,
    .form {
      overflow-x: clip !important;
    }

    .contact-actions > *,
    .form > *,
    .field,
    input,
    select,
    textarea,
    button,
    a {
      min-width: 0;
      max-width: 100%;
    }

    /* Preserve the intended horizontal swipe only inside Results. */
    #results .shots {
      width: 100% !important;
      max-width: 100% !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      overscroll-behavior-x: contain;
      -webkit-overflow-scrolling: touch;
    }
  }
</style>
<script ${overflowMarker}>
  (() => {
    const keepPageCentered = () => {
      if (window.scrollX !== 0) window.scrollTo(0, window.scrollY);
    };
    window.addEventListener('scroll', keepPageCentered, { passive: true });
    window.addEventListener('resize', keepPageCentered, { passive: true });
    window.addEventListener('pageshow', keepPageCentered, { passive: true });
    document.addEventListener('touchend', keepPageCentered, { passive: true });
  })();
</script>`;

  if (!html.includes('</head>')) {
    throw new Error('Could not find </head> in index.html for overflow lock');
  }

  html = html.replace('</head>', `${overflowLock}\n</head>`);
  await writeFile(indexFile, html, 'utf8');
}
