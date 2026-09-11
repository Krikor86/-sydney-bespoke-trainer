import { readFile, writeFile } from 'node:fs/promises';

const indexFile = new URL('../index.html', import.meta.url);
let html = await readFile(indexFile, 'utf8');

html = html.replace(
  '<span class="o">Train with purpose.</span>\n        <span class="ghost">Make every set count.</span>',
  '<span class="o hero-positioning">One-to-one coaching</span>\n        <span class="hero-focus">For strength, muscle</span>\n        <span class="hero-focus">&amp; body composition.</span>'
);

html = html.replace(
  '<span class="hero-sub">One-to-one with Greg Kafalian.</span>',
  '<span class="hero-sub">Thoughtfully programmed and coached directly by Greg Kafalian.</span>'
);

const marker = 'data-hero-positioning="clear-v1"';
if (!html.includes(marker)) {
  const styles = `
<style ${marker}>
  /* Clear service-first hero: what Greg does first, brand philosophy underneath. */
  .hero h1 {
    font-size: clamp(42px, 6.8vw, 96px);
    line-height: .91;
    letter-spacing: -.045em;
  }

  .hero h1 .hero-positioning {
    color: var(--orange);
  }

  .hero h1 .hero-focus {
    display: block;
    color: var(--ink);
    font-size: .80em;
    line-height: .98;
    letter-spacing: -.035em;
    -webkit-text-stroke: 0;
  }

  .hero-sub {
    display: block;
    max-width: 760px;
    margin-top: 18px;
    color: var(--ink-2);
    font-size: clamp(13px, 1.35vw, 18px);
    line-height: 1.35;
    letter-spacing: .015em;
    text-transform: uppercase;
  }

  @media (max-width: 600px) {
    .hero {
      padding-top: 30px;
    }

    .hero h1 {
      font-size: clamp(28px, 7.4vw, 31px);
      line-height: .94;
      letter-spacing: -.04em;
    }

    .hero h1 .hero-positioning,
    .hero h1 .hero-focus {
      max-width: 100%;
      white-space: nowrap;
    }

    .hero h1 .hero-focus {
      margin-top: 4px;
      font-size: .90em;
      line-height: 1;
      letter-spacing: -.025em;
    }

    .hero-sub {
      max-width: 32ch;
      margin-top: 14px;
      font-size: clamp(10px, 2.75vw, 12px);
      line-height: 1.35;
      letter-spacing: .025em;
      white-space: normal;
    }
  }
</style>`;
  html = html.replace('</head>', `${styles}\n</head>`);
}

await writeFile(indexFile, html, 'utf8');
