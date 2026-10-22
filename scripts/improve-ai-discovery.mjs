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

// Final presentation and naming pass. Runs after all historical build scripts,
// including the AI discovery changes above. Do not alter displayed prices.
const primaryBrand = 'Bespoke Trainer Sydney';
const legacyBrand = 'Sydney Bespoke Trainer';

function standardiseBrandAndSchema(html) {
  // The older public name remains as an alias in JSON-LD, not in visible copy.
  html = html.replaceAll(legacyBrand, primaryBrand);
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (whole, jsonText) => {
    const data = JSON.parse(jsonText);
    const nodes = Array.isArray(data['@graph']) ? data['@graph'] : [data];
    let changed = false;
    for (const node of nodes) {
      const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
      if (types.some(t => ['LocalBusiness', 'HealthAndBeautyBusiness', 'ProfessionalService'].includes(t))) {
        if (node.name !== primaryBrand) { node.name = primaryBrand; changed = true; }
        if (node.alternateName !== legacyBrand) { node.alternateName = legacyBrand; changed = true; }
      }
    }
    return changed ? '<script type="application/ld+json">\n' + JSON.stringify(data, null, 2) + '\n</script>' : whole;
  });
}

const compactPricingStyle = String.raw`
<style data-pricing-clarity="v2">
  /* Put the orange best-value highlight on 20 sessions, not 10. */
  #pricing .tier:nth-child(2) {
    background-color: #111111 !important;
    box-shadow: none !important;
  }
  #pricing .tier:nth-child(3) {
    background-color: #1a1a1a !important;
    box-shadow: inset 0 3px 0 var(--orange) !important;
  }
  #pricing .tier.pick .mono { color: var(--orange) !important; }
  #pricing .tier .amt { font-size: clamp(50px, 5.9vw, 84px); }
  @media (max-width: 600px) {
    #pricing .sec-head h2 {
      font-size: clamp(34px, 9vw, 40px) !important;
      line-height: .98 !important;
    }
    #pricing .sec-head p { font-size: 14px; line-height: 1.5; }
    #pricing .pricing-belief blockquote { font-size: clamp(18px, 4.7vw, 20px) !important; line-height: 1.42; }
    #pricing .tier { padding: 23px 18px !important; }
    #pricing .tier .amt {
      font-size: clamp(42px, 11.2vw, 48px) !important;
      line-height: 1 !important;
      margin: 13px 0 8px;
    }
    #pricing .tier .amt small { font-size: 12px !important; }
    #pricing .tier .mono { font-size: 11px !important; }
    #pricing .tier p { font-size: 13px !important; }
    .doors .door h3 { font-size: clamp(28px, 8vw, 36px) !important; line-height: 1.02; }
    .doors .door p { font-size: 15px; line-height: 1.5; }
  }
</style>`;

async function finishPage(path, options = {}) {
  const url = new URL('../' + path, import.meta.url);
  let html = await readFile(url, 'utf8');
  html = standardiseBrandAndSchema(html);

  if (options.pricing) {
    html = requiredReplace(
      html,
      '<div class="tier pick"><span class="mono">10 session pack · Most popular</span>',
      '<div class="tier"><span class="mono">10 session pack</span>',
      'Remove unverified most-popular badge from 10-pack'
    );
    html = requiredReplace(
      html,
      '<div class="tier"><span class="mono">20 session pack</span>',
      '<div class="tier pick"><span class="mono">20 session pack · Best value</span>',
      'Highlight 20-pack as best per-session value'
    );
    if (!html.includes('data-pricing-clarity="v2"')) {
      html = requiredReplace(html, '</head>', compactPricingStyle + '\n</head>', 'pricing style insertion');
    }
  }

  if (options.supportingPage) {
    html = requiredReplace(
      html, '/assets/seo-pages.v1.css', '/assets/seo-pages.v2.css',
      path + ' shared theme stylesheet'
    );
    html = html.replace(
      'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;900&family=JetBrains+Mono:wght@400;500&display=swap'
    );
    if (options.additionalFooterLink) {
      // Link directly to online coaching from both local-service pages.
      html = requiredReplace(
        html,
        '<nav><a href="/">Home</a>',
        '<nav><a href="/online-coaching/">Online Coaching</a><a href="/">Home</a>',
        path + ' footer navigation'
      );
    }
  }

  if (options.onlineNav) {
    html = requiredReplace(html, '<body>\n  <header>', '<body>\n  <header class="site-nav">', 'online header class');
    html = requiredReplace(
      html,
      '<nav>\n      <a href="#included">',
      '<nav class="nav-links" aria-label="Online coaching sections">\n      <a href="#included">',
      'online navigation class'
    );
    html = requiredReplace(html, '<a class="book" href="/#contact">Enquire Now</a>', '<a class="book" href="/#contact">Talk To Greg</a>', 'online primary CTA');
    if (!html.includes('class="mobile-tabs"')) {
      html = requiredReplace(
        html,
        '  </header>\n\n  <main>',
        '  </header>\n  <nav class="mobile-tabs" aria-label="Online coaching page sections"><a href="#included">Included</a><a href="#process">Process</a><a href="#faq">FAQ</a></nav>\n\n  <main>',
        'online mobile navigation'
      );
    }
  }

  await writeFile(url, html, 'utf8');
}

await finishPage('index.html', { pricing: true });
await finishPage('personal-trainer-sydney-cbd/index.html', { supportingPage: true, additionalFooterLink: true });
await finishPage('personal-training-over-40-sydney/index.html', { supportingPage: true, additionalFooterLink: true });
await finishPage('online-coaching/index.html', { supportingPage: true, onlineNav: true });
await finishPage('404.html');
await finishPage('thank-you/index.html');
await finishPage('success/index.html');

console.log('Unified Bespoke Trainer Sydney branding and page design; compact pricing now highlights 20 sessions without changing rates.');
