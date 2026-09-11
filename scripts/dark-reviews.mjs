import { readFile, writeFile } from 'node:fs/promises';

const indexFile = new URL('../index.html', import.meta.url);
const marker = 'data-dark-reviews="v1"';
let html = await readFile(indexFile, 'utf8');

if (!html.includes(marker)) {
  const styles = `
<style ${marker}>
  /* Reviews as a third dark visual anchor between Results and Process. */
  #reviews,
  #reviews .wrap,
  #reviews .ledger,
  #reviews .q,
  #reviews .ledger-foot {
    background: var(--ink) !important;
    color: var(--white) !important;
  }

  #reviews .sec-head,
  #reviews .ledger,
  #reviews .q,
  #reviews .ledger-foot {
    border-color: rgba(248,245,239,.20) !important;
  }

  #reviews .sec-head .mono,
  #reviews .q p,
  #reviews .who span {
    color: rgba(248,245,239,.68) !important;
  }

  #reviews h2,
  #reviews .who b {
    color: var(--white) !important;
  }

  #reviews .o,
  #reviews .stars {
    color: var(--orange) !important;
  }

  #reviews .btn.ghost {
    color: var(--white) !important;
    border-color: rgba(248,245,239,.35) !important;
    background: transparent !important;
  }

  #reviews .btn.ghost:hover {
    border-color: var(--orange) !important;
    background: rgba(255,90,31,.08) !important;
  }
</style>`;

  if (!html.includes('</head>')) throw new Error('Could not find </head> in index.html');
  html = html.replace('</head>', `${styles}\n</head>`);
  await writeFile(indexFile, html, 'utf8');
}
