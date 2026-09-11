import { readFile, writeFile } from 'node:fs/promises';

const indexFile = new URL('../index.html', import.meta.url);
let html = await readFile(indexFile, 'utf8');

html = html.replace(
  '<span class="o">Train with purpose.</span>\n        <span class="ghost">Make every set count.</span>',
  '<span class="o hero-positioning">A nuanced approach.</span>\n        <span class="ghost hero-specialties">Strength. Hypertrophy. Technique.</span>'
);

const marker = 'data-hero-positioning="nuanced-v2"';
if (!html.includes(marker)) {
  const styles = `
<style ${marker}>
  /* Keep the positioning statement dominant, specialties secondary, and Greg line supportive. */
  .hero-sub {
    font-size: clamp(14px, 1.55vw, 20px);
    line-height: 1.25;
    letter-spacing: .01em;
    margin-top: 16px;
  }

  @media (max-width: 600px) {
    .hero h1 .hero-positioning {
      font-size: clamp(34px, 9vw, 43px);
      line-height: .92;
      letter-spacing: -.045em;
      white-space: nowrap;
    }

    .hero h1 .hero-specialties {
      font-size: clamp(14px, 3.8vw, 18px);
      line-height: 1;
      letter-spacing: -.03em;
      white-space: nowrap;
    }

    .hero-sub {
      margin-top: 14px;
      font-size: clamp(12px, 3.2vw, 15px);
      line-height: 1.3;
      letter-spacing: .025em;
      white-space: nowrap;
    }
  }
</style>`;
  html = html.replace('</head>', `${styles}\n</head>`);
}

await writeFile(indexFile, html, 'utf8');
