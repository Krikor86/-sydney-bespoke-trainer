import { readFile, writeFile } from 'node:fs/promises';

const indexFile = new URL('../index.html', import.meta.url);
let html = await readFile(indexFile, 'utf8');

html = html.replace(
  '<span class="o">Train with purpose.</span>\n        <span class="ghost">Make every set count.</span>',
  '<span class="o">A nuanced approach to training.</span>\n        <span class="ghost hero-specialties">Strength. Hypertrophy. Technique.</span>'
);

const marker = 'data-hero-positioning="nuanced-v1"';
if (!html.includes(marker)) {
  const styles = `
<style ${marker}>
  @media (max-width: 600px) {
    .hero h1 .hero-specialties {
      font-size: clamp(16px, 4.5vw, 21px);
      letter-spacing: -.035em;
      white-space: nowrap;
    }
  }
</style>`;
  html = html.replace('</head>', `${styles}\n</head>`);
}

await writeFile(indexFile, html, 'utf8');
