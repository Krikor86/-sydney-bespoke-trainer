import { readFile, writeFile } from 'node:fs/promises';

const indexFile = new URL('../index.html', import.meta.url);
let html = await readFile(indexFile, 'utf8');

const replacements = [
  [
    '<h2>Straightforward <span class="o">pricing.</span></h2>',
    '<h2>Simple <span class="o">pricing.</span></h2>'
  ],
  [
    '<div class="pricing-cta"><a class="btn orange" href="#contact">Book your complimentary consultation</a></div>',
    '<div class="pricing-cta"><a class="btn orange" href="#contact">Talk to Greg</a></div>'
  ],
  [
    '<div><h2>Who I <span class="o">coach.</span></h2><p>Whether your priority is a busy schedule, your physique or staying strong as you age, the standard of coaching is the same: thoughtful programming and good technique.</p></div>',
    '<div><h2>Who I <span class="o">coach.</span></h2><p>I coach people at different stages of life. What matters is that you want your training to be thought through and your time in the gym to count.</p></div>'
  ],
  [
    '<span class="mono">01 · Busy lives</span>\n          <h3>Training that fits real life.</h3>\n          <p>For professionals, business owners and parents who want to improve their health, strength and body composition without wasting time in the gym.</p>\n          <span class="go">Personal training in Sydney CBD</span>',
    '<span class="mono">01 · Sydney CBD coaching</span>\n          <h3>For people who want to train properly.</h3>\n          <p>One-to-one coaching for busy professionals, business owners and anyone serious about building muscle, improving their physique and getting more from their time in the gym.</p>\n          <span class="go">Explore Sydney CBD coaching</span>'
  ],
  [
    '<span class="mono">02 · Strength, muscle &amp; longevity</span>\n          <h3>For people who care how they train.</h3>\n          <p>For anyone serious about building muscle or improving their physique, and retirees who want to maintain strength, muscle and bone density into their 70s, 80s and beyond.</p>\n          <span class="go">Personal training over 40</span>',
    '<span class="mono">02 · Strength after 40</span>\n          <h3>Stay strong for the decades ahead.</h3>\n          <p>For adults over 40 and retirees who want to build or maintain muscle, strength and bone density, move well and keep training with confidence.</p>\n          <span class="go">Strength &amp; longevity after 40</span>'
  ]
];

for (const [from, to] of replacements) {
  if (html.includes(from)) html = html.replace(from, to);
}

const mobileFix = `
<style data-mobile-copy-fit="pricing-audiences">
  @media (max-width: 600px) {
    #pricing .sec-head h2 {
      font-size: clamp(38px, 12.5vw, 50px) !important;
      line-height: .94 !important;
      overflow-wrap: normal !important;
      word-break: normal !important;
    }

    #process .start-step .btn,
    #pricing .pricing-cta .btn {
      width: auto !important;
      min-width: 0 !important;
      max-width: 210px !important;
      min-height: 44px !important;
      padding: 10px 18px !important;
      font-size: 10px !important;
      line-height: 1.2 !important;
      white-space: nowrap !important;
    }

    #process .start-step .btn {
      margin-top: 18px;
    }

    #pricing .pricing-cta {
      justify-content: flex-start !important;
    }
  }
</style>`;

if (!html.includes('data-mobile-copy-fit="pricing-audiences"')) {
  html = html.replace('</head>', `${mobileFix}\n</head>`);
}

await writeFile(indexFile, html, 'utf8');
