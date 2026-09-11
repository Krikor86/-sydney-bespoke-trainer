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

  /* About: show the full coach photo and pair it with a physique image. */
  #about .about {
    display: grid;
    grid-template-columns: 1fr;
  }

  #about .about-photos {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-width: 0;
    border-bottom: 1px solid var(--line);
  }

  #about .about-photo {
    min-width: 0;
    overflow: hidden;
    border-right: 0;
    background: var(--paper-2);
  }

  #about .about-photo + .about-photo {
    border-left: 1px solid var(--line);
  }

  #about .about-photo img {
    display: block;
    width: 100%;
    height: auto !important;
    aspect-ratio: auto !important;
    object-fit: contain !important;
    object-position: center center !important;
  }

  #about .about-copy {
    width: min(920px, 100%);
    margin: 0 auto;
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

    #about .about-photos {
      grid-template-columns: 1fr;
    }

    #about .about-photo + .about-photo {
      border-left: 0;
      border-top: 1px solid var(--line);
    }

    #about .about-copy {
      width: 100%;
      margin: 0;
    }
  }
</style>`;

  const oldAboutPhoto = '<div class="about-photo"><img src="/assets/greg-kafalian-about.v1.webp" alt="Greg Kafalian, head coach at Sydney Bespoke Trainer" loading="lazy"></div>';
  const newAboutPhotos = `<div class="about-photos" data-about-gallery="coach-physique">
          <figure class="about-photo about-photo-main"><img src="/assets/greg-kafalian-about.v1.webp" alt="Greg Kafalian, head coach at Sydney Bespoke Trainer" loading="lazy"></figure>
          <figure class="about-photo about-photo-physique"><img src="/assets/greg-kafalian-physique.v1.webp" alt="Greg Kafalian demonstrating the physique behind his strength and hypertrophy coaching" loading="lazy"></figure>
        </div>`;

  if (!html.includes(oldAboutPhoto)) {
    throw new Error('Could not find the current About photo block in index.html');
  }

  html = html.replace(oldAboutPhoto, newAboutPhotos);

  if (!html.includes('</head>')) {
    throw new Error('Could not find </head> in index.html');
  }

  html = html.replace('</head>', `${darkAnchorStyles}\n</head>`);
  await writeFile(indexFile, html, 'utf8');
}
