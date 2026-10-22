import { readFile, writeFile } from 'node:fs/promises';

// Improve the established Sydney CBD page rather than publish duplicate
// suburb landing pages. In-person training is at 35 Clarence Street only.
const pageURL = new URL('../personal-trainer-sydney-cbd/index.html', import.meta.url);
const homeURL = new URL('../index.html', import.meta.url);
const pageTitle = 'Personal Trainer Wynyard & Sydney CBD | Bespoke Trainer Sydney';
const pageDescription = 'One-to-one personal training near Wynyard Station, convenient for Barangaroo and The Rocks. Train with Greg Kafalian at 35 Clarence Street, Sydney CBD.';
const localQuestion = 'Can I train with Greg if I work in Barangaroo or The Rocks?';
const localAnswer = 'Yes. I coach clients from Barangaroo and The Rocks one-to-one inside Snap Fitness at 35 Clarence Street, near Wynyard Station. This is a commercial gym, with every booked session coached directly by me.';

function mustReplace(html, from, to, label) {
  if (html.includes(to)) return html;
  if (!html.includes(from)) throw new Error('Missing local SEO target: ' + label);
  return html.replace(from, to);
}

let page = await readFile(pageURL, 'utf8');
page = page.replace(/<title>[^<]*<\/title>/, '<title>' + pageTitle + '</title>');
page = page.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + pageDescription + '">');
page = page.replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + pageTitle + '">');
page = page.replace(/<meta name="twitter:title" content="[^"]*">/, '<meta name="twitter:title" content="' + pageTitle + '">');
page = page.replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + pageDescription + '">');
page = page.replace(/<meta name="twitter:description" content="[^"]*">/, '<meta name="twitter:description" content="' + pageDescription + '">');

const originalLocation = '<div class="rows"><div class="row"><div class="row-num">35</div><div><h3>Central for Wynyard and the CBD</h3><p>Train in person at 35 Clarence Street, a short walk from Wynyard and within easy reach of Barangaroo, Martin Place and Circular Quay. Appointments from 7am to 3pm make it practical to train before work, at lunchtime or during the afternoon.</p></div></div></div>';

const improvedLocation = [
  '<div class="rows" aria-label="Wynyard, Barangaroo and The Rocks coaching location">',
  '  <div class="row"><div class="row-num">35</div><div><h3>Train with me at Snap Fitness, 35 Clarence Street</h3><p>My one-to-one sessions are held inside Snap Fitness, a commercial gym in Sydney CBD near Wynyard Station. I coach each session myself and build your program around your movement, goals and progress.</p></div></div>',
  '  <div class="row"><div class="row-num">01</div><div><h3>Personal trainer near Wynyard Station</h3><p>If you live or work around Wynyard, my Clarence Street location makes it practical to fit a 45-minute, one-to-one training session around your working day. Weekday appointments start from 7am, subject to availability.</p></div></div>',
  '  <div class="row"><div class="row-num">02</div><div><h3>Personal training for Barangaroo professionals</h3><p>Working in Barangaroo or near King Street Wharf? Train with me at 35 Clarence Street in the neighbouring CBD, with strength, muscle-building and body-composition programming tailored to your starting point.</p></div></div>',
  '  <div class="row"><div class="row-num">03</div><div><h3>One-to-one coaching near The Rocks</h3><p>Clients coming from The Rocks and the northern CBD can train at my Wynyard-area location. You work directly with me throughout your program rather than being handed over to a different trainer each session.</p></div></div>',
  '</div>'
].join('\n');
page = mustReplace(page, originalLocation, improvedLocation, 'location section');

const existingFAQ = '<details><summary>Where do personal training sessions take place?</summary>';
const addedFAQ = '<details><summary>' + localQuestion + '</summary><p>' + localAnswer + '</p></details>\n        ';
if (!page.includes('<summary>' + localQuestion + '</summary>')) {
  page = mustReplace(page, existingFAQ, addedFAQ + existingFAQ, 'local-area FAQ');
}

let updatedSchema = false;
page = page.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (whole, source) => {
  const data = JSON.parse(source);
  const nodes = Array.isArray(data['@graph']) ? data['@graph'] : [data];
  for (const node of nodes) {
    const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
    if (types.includes('WebPage')) {
      node.name = pageTitle;
      node.description = pageDescription;
      updatedSchema = true;
    }
    if (types.includes('Service')) {
      node.areaServed = ['Sydney CBD', 'Wynyard', 'Barangaroo', 'The Rocks'].map(name => ({'@type':'Place',name}));
      updatedSchema = true;
    }
    if (types.includes('FAQPage')) {
      node.mainEntity ??= [];
      if (!node.mainEntity.some(item => item.name === localQuestion)) {
        node.mainEntity.push({'@type':'Question', name:localQuestion, acceptedAnswer: {'@type':'Answer', text:localAnswer}});
      }
      updatedSchema = true;
    }
  }
  return '<script type="application/ld+json">\n' + JSON.stringify(data,null,2) + '\n</script>';
});
if(!updatedSchema) throw new Error('No valid local SEO schema detected');
await writeFile(pageURL, page, 'utf8');

let home = await readFile(homeURL,'utf8');
const generic = 'One-to-one coaching for busy professionals, business owners and anyone serious about building muscle, improving their physique and getting more from their time in the gym.';
const local = 'One-to-one personal training near Wynyard for people working around Barangaroo, The Rocks and Sydney CBD. Strength, muscle and body-composition coaching built around how you move and progress.';
home = mustReplace(home, generic, local, 'homepage location audience card');
await writeFile(homeURL, home, 'utf8');

console.log('Wynyard, Barangaroo and The Rocks local intent upgraded on existing Sydney CBD coaching page.');
