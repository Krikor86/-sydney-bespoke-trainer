import { readFile, writeFile } from 'node:fs/promises';

// Runs last in the Netlify build, after the existing design/copy refinements.
// Changes are deliberately narrow: no pricing cards, layout, navigation,
// consultation processing, or unrelated SEO pages are altered.

const homeURL = new URL('../index.html', import.meta.url);
const cbdURL = new URL('../personal-trainer-sydney-cbd/index.html', import.meta.url);

const maleQuestion = 'Are you a male personal trainer in Sydney CBD?';
const maleAnswer = 'Yes. I am Greg Kafalian, a male personal trainer with 19 years of coaching experience. I train men and women one-to-one at 35 Clarence Street, a short walk from Wynyard Station.';
const beginnerQuestion = 'Do you coach women and people new to strength training?';
const beginnerAnswer = 'Yes. I coach women and men, from beginners to experienced lifters. I assess your movement and technique, then build and adjust your training around your goals and experience.';

function requiredReplace(html, from, to, label) {
  if (!html.includes(from)) {
    if (html.includes(to)) return html;
    throw new Error('AI discovery build target missing: ' + label);
  }
  return html.replace(from, to);
}

function updateStructuredData(html, page) {
  let sawFAQ = false;
  let sawBusiness = false;
  const updated = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (whole, jsonText) => {
    const data = JSON.parse(jsonText);
    const nodes = Array.isArray(data['@graph']) ? data['@graph'] : [data];
    let changed = false;

    for (const node of nodes) {
      const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
      if (types.includes('FAQPage')) {
        sawFAQ = true;
        const pairs = page === 'home'
          ? [[maleQuestion, maleAnswer]]
          : [[maleQuestion, maleAnswer], [beginnerQuestion, beginnerAnswer]];
        node.mainEntity = Array.isArray(node.mainEntity) ? node.mainEntity : [];
        for (const [question, answer] of pairs) {
          if (!node.mainEntity.some(q => q.name === question)) {
            node.mainEntity.push({
              '@type': 'Question',
              name: question,
              acceptedAnswer: { '@type': 'Answer', text: answer }
            });
            changed = true;
          }
        }
      }
      if (types.some(t => ['LocalBusiness', 'HealthAndBeautyBusiness', 'ProfessionalService'].includes(t))) {
        sawBusiness = true;
        if (node.name !== 'Sydney Bespoke Trainer') {
          node.name = 'Sydney Bespoke Trainer';
          changed = true;
        }
        if (node.alternateName !== 'Bespoke Trainer Sydney') {
          node.alternateName = 'Bespoke Trainer Sydney';
          changed = true;
        }
        if (page === 'home' && node.priceRange !== '$120-$130 per session') {
          node.priceRange = '$120-$130 per session';
          changed = true;
        }
      }
      if (page === 'cbd' && types.includes('WebPage')) {
        const title = 'Personal Trainer Sydney CBD | Greg Kafalian';
        const description = 'Looking for a male personal trainer in Sydney CBD? Train one-to-one with Greg Kafalian near Wynyard for strength, muscle and body composition.';
        if (node.name !== title) { node.name = title; changed = true; }
        if (node.description !== description) { node.description = description; changed = true; }
      }
    }
    return changed ? '<script type="application/ld+json">\n' + JSON.stringify(data, null, 2) + '\n</script>' : whole;
  });
  if (!sawFAQ || !sawBusiness) {
    throw new Error('Expected FAQPage and business structured data on ' + page);
  }
  return updated;
}

function updateExperienceYears(html) {
  // Source copy passes through several older build refinements. Normalise the
  // published wording at the end so every page consistently says 19 years.
  // This updates experience claims only and never touches session pricing.
  return html
    .replace(/\b(?:more than|over)\s+18\+?\s+years\b/gi, '19 years')
    .replace(/\b18\+?\s+years\b/g, '19 years')
    .replace('<div class="big">18<s>+</s></div><span class="mono">Years Experience</span>', '<div class="big">19</div><span class="mono">Years Experience</span>');
}

let home = await readFile(homeURL, 'utf8');
home = home.replace(
  '<meta property="og:site_name" content="Bespoke Trainer Sydney">',
  '<meta property="og:site_name" content="Sydney Bespoke Trainer">'
);

const faqHomeAnchor = '          <details><summary>How long are sessions and where do we train?</summary>';
if (!home.includes('<summary>' + maleQuestion + '</summary>')) {
  home = requiredReplace(
    home, faqHomeAnchor,
    '          <details><summary>' + maleQuestion + '</summary><p>' + maleAnswer + '</p></details>\n' + faqHomeAnchor,
    'homepage FAQ insertion'
  );
}

const sourceField = '        <div class="field full"><label for="discovery-source">How did you hear about me? (optional)</label><select id="discovery-source" name="discovery_source"><option value="">Select</option><option>ChatGPT / AI search</option><option>Google search</option><option>Google Maps</option><option>Referral / word of mouth</option><option>Instagram / social media</option><option>Other</option></select></div>';
if (!home.includes('name="discovery_source"')) {
  home = requiredReplace(
    home,
    '        <div class="field full"><label for="notes">Anything Greg should know?</label>',
    sourceField + '\n        <div class="field full"><label for="notes">Anything Greg should know?</label>',
    'consultation source attribution field'
  );
}
home = updateStructuredData(home, 'home');
home = updateExperienceYears(home);
await writeFile(homeURL, home, 'utf8');

let cbd = await readFile(cbdURL, 'utf8');
cbd = cbd.replace(
  '<title>Personal Trainer Sydney CBD | 1:1 Evidence-Based Coaching</title>',
  '<title>Personal Trainer Sydney CBD | Greg Kafalian</title>'
);
cbd = cbd.replace(
  /<meta name="description" content="[^"]*">/,
  '<meta name="description" content="Looking for a male personal trainer in Sydney CBD? Train one-to-one with Greg Kafalian near Wynyard for strength, muscle and body composition.">'
);
cbd = cbd.replace(
  '<meta property="og:site_name" content="Bespoke Trainer Sydney">',
  '<meta property="og:site_name" content="Sydney Bespoke Trainer">'
);
cbd = cbd.replace(
  '<meta property="og:title" content="Personal Trainer Sydney CBD | Bespoke Trainer Sydney">',
  '<meta property="og:title" content="Personal Trainer Sydney CBD | Greg Kafalian">'
);
cbd = cbd.replace(
  '<meta name="twitter:title" content="Personal Trainer Sydney CBD | Bespoke Trainer Sydney">',
  '<meta name="twitter:title" content="Personal Trainer Sydney CBD | Greg Kafalian">'
);

const previousHero = '<p>If you want your training to be thought through rather than improvised, I’ll coach you one-to-one, choose the exercises carefully and adjust the program as I see how you respond.</p>';
const newHero = '<p>Looking for a male personal trainer in Sydney CBD? I’m Greg Kafalian. I coach men and women one-to-one at 35 Clarence Street, near Wynyard, with 19 years of experience in strength, muscle development and body composition. Your program is built around how you move, perform and progress.</p>';
cbd = requiredReplace(cbd, previousHero, newHero, 'Sydney CBD hero introduction');

const faqCBDAnchor = '        <details><summary>Where is the personal training studio?</summary>';
if (!cbd.includes('<summary>' + maleQuestion + '</summary>')) {
  cbd = requiredReplace(
    cbd,
    faqCBDAnchor,
    '        <details><summary>' + maleQuestion + '</summary><p>' + maleAnswer + '</p></details>\n' +
    '        <details><summary>' + beginnerQuestion + '</summary><p>' + beginnerAnswer + '</p></details>\n' + faqCBDAnchor,
    'Sydney CBD FAQ insertion'
  );
}
cbd = updateStructuredData(cbd, 'cbd');
cbd = updateExperienceYears(cbd);
await writeFile(cbdURL, cbd, 'utf8');

// The 40+ page also includes Greg's experience in its service copy.
const over40URL = new URL('../personal-training-over-40-sydney/index.html', import.meta.url);
const over40 = await readFile(over40URL, 'utf8');
await writeFile(over40URL, updateExperienceYears(over40), 'utf8');

console.log('AI search discovery copy, structured data, enquiry attribution and 19 years of experience updated.');