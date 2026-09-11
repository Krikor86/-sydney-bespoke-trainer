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
</style>`;

  if (!html.includes('</head>')) {
    throw new Error('Could not find </head> in index.html');
  }

  html = html.replace('</head>', `${darkAnchorStyles}\n</head>`);
  await writeFile(indexFile, html, 'utf8');
}
