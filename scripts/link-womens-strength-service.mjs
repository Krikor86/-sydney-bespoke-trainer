import { readFile, writeFile } from 'node:fs/promises';

// Run after the legacy homepage/page builders. Keep the existing three
// homepage service cards and the 20-session pricing emphasis unchanged.
const target = '/womens-strength-training-sydney/';
const root = new URL('../', import.meta.url);

async function edit(relative, change) {
  const url = new URL(relative, root);
  const original = await readFile(url, 'utf8');
  const updated = change(original);
  if (updated === original) throw new Error('Women’s service link unchanged: ' + relative);
  await writeFile(url, updated, 'utf8');
}

await edit('index.html', html => {
  const css = `
<style id="womens-strength-home-link">
.womens-service { display:flex; align-items:center; justify-content:space-between; gap:22px; padding:clamp(24px,3.5vw,40px); background:var(--ink); color:var(--white); border-top:3px solid var(--orange); text-decoration:none; }
.womens-service:hover, .womens-service:focus-visible { background:#252525; }
.womens-service .mono { color:var(--orange); font-size:12px; }
.womens-service h3 { margin:9px 0; font-size:clamp(24px,3vw,38px); line-height:1; letter-spacing:-.035em; font-weight:900; text-transform:uppercase; }
.womens-service p { max-width:680px; color:rgba(255,255,255,.72); font-size:15px; line-height:1.65; }
.womens-service .action { display:block; font-size:12px; font-weight:700; white-space:nowrap; text-transform:uppercase; }
.womens-service .action::after { content:" →"; color:var(--orange); }
@media(max-width:760px) { .womens-service { align-items:flex-start; flex-direction:column; } .womens-service .action { white-space:normal; } }
</style>`;
  if (!html.includes('id="womens-strength-home-link"')) {
    if (!html.includes('</head>')) throw new Error('Homepage closing head missing');
    html = html.replace('</head>', css + '\n</head>');
  }
  const banner = [
    '      <a class="womens-service" href="' + target + '">',
    '        <div><span class="mono">04 · Women’s Strength Coaching</span>',
    '          <h3>Stronger Women. Stronger For Life.</h3>',
    '          <p>One-to-one strength training to build muscle, develop stronger glutes and legs, and support long-term bone health. Coached personally by Greg near Wynyard.</p></div>',
    '        <span class="action">Explore Women’s Strength Training</span>',
    '      </a>'
  ].join('\n');
  if (!html.includes('class="womens-service"')) {
    const anchor = '      </div>\n    </div>\n  </section>\n\n  <section class="section" id="faq">';
    if (!html.includes(anchor)) throw new Error('Homepage service section anchor changed');
    html = html.replace(anchor,'      </div>\n' + banner + '\n    </div>\n  </section>\n\n  <section class="section" id="faq">');
  }
  if (!html.includes('<a href="' + target + '">Women’s Strength</a>')) {
    const footerAnchor='<a href="/personal-training-over-40-sydney/">Over 40</a>';
    if (!html.includes(footerAnchor)) throw new Error('Home footer link insertion point missing');
    html = html.replace(footerAnchor, footerAnchor+'\n      <a href="' + target + '">Women’s Strength</a>');
  }
  return html;
});

for (const page of ['personal-training-over-40-sydney/index.html','personal-trainer-sydney-cbd/index.html','online-coaching/index.html']) {
  await edit(page, html => {
    if (html.includes('<a href="' + target + '">Women’s Strength</a>')) return html;
    const start = html.indexOf('<footer>');
    if (start < 0) throw new Error('Footer missing: '+page);
    const nav = html.indexOf('<nav>',start);
    if (nav < 0) throw new Error('Footer nav missing: '+page);
    const insert = '<a href="' + target + '">Women’s Strength</a>';
    return html.slice(0,nav+5)+insert+html.slice(nav+5);
  });
}

console.log('Women’s strength training now discoverable from homepage and all existing service pages.');
