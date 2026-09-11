import { readFile, writeFile } from 'node:fs/promises';

const indexFile = new URL('../index.html', import.meta.url);
let html = await readFile(indexFile, 'utf8');

html = html.replace(
  '<span class="o">Train with purpose.</span>\n        <span class="ghost">Make every set count.</span>',
  '<span class="o hero-positioning">A nuanced<br class="hero-mobile-break"> approach.</span>\n        <span class="ghost hero-specialties">Strength. Hypertrophy. Technique.</span>'
);

const marker = 'data-hero-positioning="nuanced-v3"';
if (!html.includes(marker)) {
  const styles = `
<style ${marker}>
  /* Keep the positioning statement dominant, specialties secondary, and Greg line supportive. */
  .hero-mobile-break {
    display: none;
  }

  .hero-sub {
    font-size: clamp(14px, 1.55vw, 20px);
    line-height: 1.25;
    letter-spacing: .01em;
    margin-top: 16px;
  }

  @media (max-width: 600px) {
    .hero {
      padding-top: 30px;
    }

    .hero h1 .hero-positioning {
      font-size: clamp(34px, 10.2vw, 42px);
      line-height: .9;
      letter-spacing: -.05em;
      white-space: normal;
      max-width: 100%;
    }

    .hero-mobile-break {
      display: block;
    }

    .hero h1 .hero-specialties {
      margin-top: 8px;
      font-size: clamp(13px, 3.55vw, 16px);
      line-height: 1.02;
      letter-spacing: -.025em;
      white-space: normal;
      max-width: 100%;
      -webkit-text-stroke-width: 1.25px;
    }

    .hero-sub {
      margin-top: 13px;
      font-size: clamp(10px, 2.85vw, 13px);
      line-height: 1.25;
      letter-spacing: .035em;
      white-space: normal;
      max-width: 100%;
    }
  }
</style>`;
  html = html.replace('</head>', `${styles}\n</head>`);
}

await writeFile(indexFile, html, 'utf8');
