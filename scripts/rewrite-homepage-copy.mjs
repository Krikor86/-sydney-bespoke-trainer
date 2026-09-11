import { readFile, writeFile } from 'node:fs/promises';

const indexFile = new URL('../index.html', import.meta.url);
let html = await readFile(indexFile, 'utf8');

const replacements = [
  [
    '<meta name="description" content="Evidence-based personal training in Sydney CBD with Greg Kafalian. Build muscle, lose body fat and get stronger with one-on-one coaching. Complimentary consultation.">',
    '<meta name="description" content="One-to-one personal training in Sydney CBD with Greg Kafalian. 18+ years coaching strength, muscle, technique and body composition. Complimentary consultation.">'
  ],
  [
    '<meta property="og:description" content="Evidence-based, one-on-one personal training in Sydney CBD. Programs built around your body, goals and schedule. Complimentary consultation.">',
    '<meta property="og:description" content="One-to-one personal training in Sydney CBD with Greg Kafalian. Thoughtful programming, detailed technique coaching and 18+ years of experience.">'
  ],
  [
    '<meta name="twitter:description" content="Evidence-based one-on-one personal training in Sydney CBD with Greg Kafalian.">',
    '<meta name="twitter:description" content="One-to-one personal training in Sydney CBD with Greg Kafalian. 18+ years coaching strength, muscle and technique.">'
  ],
  ['<a class="btn" href="#contact">Book Your Consult</a>', '<a class="btn" href="#contact">Talk to Greg</a>'],
  [
    '<span class="o">Optimised Training.</span>\n        <span class="ghost">Built on evidence.</span>',
    '<span class="o">Train with purpose.</span>\n        <span class="ghost">Make every set count.</span>'
  ],
  ['<span class="hero-sub">Backed by experience.</span>', '<span class="hero-sub">One-to-one with Greg Kafalian.</span>'],
  [
    '<p class="lede">Strength, muscle and body composition, coached one-to-one in the heart of Sydney CBD.</p>',
    '<p class="lede">One-to-one coaching for strength, muscle and body composition — with every session designed to make your time in the gym count.</p>'
  ],
  [
    '<span class="ticker-item">Bespoke Programming</span><span class="ticker-item">Strength &amp; Hypertrophy</span><span class="ticker-item">Fat Loss &amp; Body Recomposition</span><span class="ticker-item">Technique Optimisation</span><span class="ticker-item">Nutrition Guidance</span>\n      <span class="ticker-item">Bespoke Programming</span><span class="ticker-item">Strength &amp; Hypertrophy</span><span class="ticker-item">Fat Loss &amp; Body Recomposition</span><span class="ticker-item">Technique Optimisation</span><span class="ticker-item">Nutrition Guidance</span>',
    '<span class="ticker-item">One-to-one with Greg</span><span class="ticker-item">Thoughtful exercise selection</span><span class="ticker-item">Strength &amp; hypertrophy</span><span class="ticker-item">Technique coaching</span><span class="ticker-item">Ongoing program adjustments</span>\n      <span class="ticker-item">One-to-one with Greg</span><span class="ticker-item">Thoughtful exercise selection</span><span class="ticker-item">Strength &amp; hypertrophy</span><span class="ticker-item">Technique coaching</span><span class="ticker-item">Ongoing program adjustments</span>'
  ],
  [
    '<div><h2>Precision.<br><span class="o">Not guesswork.</span></h2><p>Every program is built from scratch around your body, your schedule and your goals. This is what separates bespoke coaching from a generic gym plan.</p></div>',
    '<div><h2>Your time matters.<br><span class="o">Make it count.</span></h2><p>I know training takes time out of a busy day, so I want every session to be worth it. Exercise selection, technique, loading and progression are all chosen with a reason.</p></div>'
  ],
  [
    '<div class="cell"><span class="mono">1.1</span><h3>One-on-one coaching</h3><p>Train directly with Greg in every session, with focused guidance and feedback throughout.</p></div>',
    '<div class="cell"><span class="mono">1.1</span><h3>You train with me</h3><p>Sydney Bespoke Trainer is my business. Every session is coached by me, and I make the programming decisions myself.</p></div>'
  ],
  [
    '<div class="cell"><span class="mono">1.2</span><h3>Built around you</h3><p>Designed around your body, goals, experience and schedule — not a generic template.</p></div>',
    '<div class="cell"><span class="mono">1.2</span><h3>Exercises earn their place</h3><p>I choose movements for the return they give you — not to fill time or make a session look complicated.</p></div>'
  ],
  [
    '<div class="cell"><span class="mono">1.3</span><h3>Evidence-based programming</h3><p>Structured, periodised programming guided by current evidence and proven training principles.</p></div>',
    '<div class="cell"><span class="mono">1.3</span><h3>Evidence, then judgement</h3><p>Research guides the plan. Your reps, recovery and response tell me when to push, adjust or leave something alone.</p></div>'
  ],
  [
    '<div class="cell"><span class="mono">1.4</span><h3>Movement &amp; technique</h3><p>Your movement, form and technique are assessed to guide exercise selection and progression.</p></div>',
    '<div class="cell"><span class="mono">1.4</span><h3>Technique matters</h3><p>I watch how you move and how your form changes under load. Small technical changes can make a big difference.</p></div>'
  ],
  [
    '<div class="cell"><span class="mono">1.5</span><h3>Nutrition &amp; macro guidance</h3><p>Practical nutrition and macro recommendations aligned with your goals and lifestyle.</p></div>',
    '<div class="cell"><span class="mono">1.5</span><h3>Progress without rushing</h3><p>We add load, reps or volume when you are ready. Progression is earned, not forced.</p></div>'
  ],
  [
    '<div class="cell"><span class="mono">1.6</span><h3>Program optimisation</h3><p>Your program evolves with your progress, recovery and changing goals.</p></div>',
    '<div class="cell"><span class="mono">1.6</span><h3>Nutrition kept practical</h3><p>Macro and nutrition guidance supports the training without turning your life into a meal plan.</p></div>'
  ],
  ['<div><h2>18+ years.<br><span class="o">One craft.</span></h2></div>', '<div><h2>18+ years.<br><span class="o">Still hands-on.</span></h2></div>'],
  [
    '<p>With more than 18 years of coaching experience, I\'ve worked with a diverse range of clients — from those balancing work and family to people pursuing significant improvements in strength, muscle and performance. My approach combines evidence-based, periodised training with a strong focus on technique and ongoing program optimisation to deliver measurable, lasting results.</p>\n          <p>As a father of two, I understand what it takes to balance family, career and personal health. That\'s why my coaching is designed to be highly effective while integrating seamlessly into your life — no wasted time, no guesswork, just training that works for you.</p>',
    '<p>I started training in my teens and quickly developed a love for bodybuilding and the process of changing my own physique. That interest became a career, and I have now spent more than 18 years coaching people with very different goals and levels of experience.</p>\n          <p>Hypertrophy and strength have always been a major focus. Evidence guides how I program, but experience has taught me to watch the person in front of me — how you perform your reps, how you recover and how you respond over time. That tells me when to add weight, change an exercise, adjust volume or simply keep something that is working.</p>\n          <p>I am also a father of two, so I understand that training has to fit around real work and family commitments. I want the time you spend in the gym to count.</p>\n          <p>I run Sydney Bespoke Trainer independently. When you hire me, you work with me — I design your program, coach your sessions and make the adjustments. My business is built around the quality of the coaching itself, and I take pride in making sure your form and technique are on point.</p>'
  ],
  ['<div class="credentials-head"><span class="mono" style="color:var(--orange)">Qualifications</span><h3>The credentials behind the coaching.</h3></div>', '<div class="credentials-head"><span class="mono" style="color:var(--orange)">Qualifications</span><h3>Qualifications I have added along the way.</h3></div>'],
  [
    '<div><h2>Results that <span class="o">speak.</span></h2><p>Real client transformations from focused one-to-one coaching.</p></div>',
    '<div><h2>Real clients.<br><span class="o">Real progress.</span></h2><p>Different starting points and different goals. These are people I have coached one-to-one.</p></div>'
  ],
  ['<div><h2>In their <span class="o">own words.</span></h2></div>', '<div><h2>What clients <span class="o">say.</span></h2></div>'],
  [
    '<div><h2>How it <span class="o">works.</span></h2><p>A structured, methodical approach from day one. Nothing is left to chance — every step is purposeful and designed around your long-term progress.</p></div>',
    '<div><h2>What happens<br><span class="o">when you start.</span></h2><p>We start by talking. Then I see how you move, build the program, coach it and adjust it as I learn how you respond.</p></div>'
  ],
  ['<div class="step"><div class="n">01</div><h3>Complimentary consultation</h3><p>We discuss your goals, training history, lifestyle, schedule and any injuries to understand exactly what you need.</p></div>', '<div class="step"><div class="n">01</div><h3>Talk first</h3><p>We go through your goals, training history, schedule, injuries and what you actually want from training.</p></div>'],
  ['<div class="step"><div class="n">02</div><h3>Movement &amp; technique assessment</h3><p>Your key movement patterns, form and technique are assessed to guide exercise selection and program design.</p></div>', '<div class="step"><div class="n">02</div><h3>See how you move</h3><p>I look at key movements and your technique so I can choose exercises that suit you.</p></div>'],
  ['<div class="step"><div class="n">03</div><h3>Bespoke program design</h3><p>Built around your assessment, goals, experience and schedule. Every exercise, set and rep range has a purpose.</p></div>', '<div class="step"><div class="n">03</div><h3>Build the program</h3><p>I select the exercises, sets, reps and progression around your goals, experience and available time.</p></div>'],
  ['<div class="step"><div class="n">04</div><h3>Track your progress</h3><p>Strength, performance and movement quality are tracked throughout, with progress measured against your goals.</p></div>', '<div class="step"><div class="n">04</div><h3>Coach the details</h3><p>We work on execution, effort and consistency. I want every rep to give us useful information.</p></div>'],
  ['<div class="step"><div class="n">05</div><h3>Review &amp; optimise</h3><p>Your program is regularly reviewed and adjusted to reflect your progress, recovery and evolving goals.</p></div>', '<div class="step"><div class="n">05</div><h3>Adjust as you respond</h3><p>I review what is happening in real time and change the plan when there is a good reason to.</p></div>'],
  ['<div class="step start-step"><div class="start-arrow" aria-hidden="true">→</div><div><h3>Start here</h3><p>Every client begins with a complimentary consultation. No obligation, no sales pitch.</p></div><a class="btn" href="#contact">Book a consultation</a></div>', '<div class="step start-step"><div class="start-arrow" aria-hidden="true">→</div><div><h3>Start with a conversation</h3><p>No obligation. We talk through what you want to achieve and whether I think I can help.</p></div><a class="btn" href="#contact">Talk to Greg</a></div>'],
  [
    '<div><h2>Transparent <span class="o">pricing.</span></h2><p>One-to-one coaching, technique feedback, bespoke programming and practical nutrition guidance are included at every level.</p></div>',
    '<div><h2>Straightforward <span class="o">pricing.</span></h2><p>You are paying for my time, programming and attention to detail — not access to a generic template.</p></div>'
  ],
  ['<div class="pricing-belief"><span class="mono">The value of bespoke</span><blockquote>“You’re not paying for a session. You’re investing in a program built exclusively around you — your body, your goals, your life.”</blockquote></div>', '<div class="pricing-belief"><span class="mono">What I want you to get</span><blockquote>“I want every session to be worth the time and money you put into it. That means thoughtful exercise selection, close coaching and changes when they are actually needed.”</blockquote></div>'],
  ['<span class="mono">Every session includes</span>', '<span class="mono">Included with your coaching</span>'],
  ['<ul style="margin-top:0"><li>One-on-one coaching with Greg</li><li>Precise form and technique feedback</li><li>Training from your bespoke program</li><li>Nutrition and macro guidance</li></ul>', '<ul style="margin-top:0"><li>One-on-one coaching with Greg</li><li>A program designed and adjusted by Greg</li><li>Detailed form and technique coaching</li><li>Practical nutrition and macro guidance</li></ul>'],
  [
    '<div><h2>Built for your <span class="o">stage of life.</span></h2></div>',
    '<div><h2>Who I <span class="o">coach.</span></h2><p>Whether your priority is a busy schedule, your physique or staying strong as you age, the standard of coaching is the same: thoughtful programming and good technique.</p></div>'
  ],
  ['<span class="mono">01 · Sydney CBD Coaching</span>\n          <h3>Focused coaching. Central Sydney.</h3>\n          <p>One-to-one appointments with Greg are available from 7am to 3pm, including quieter off-peak times.</p>', '<span class="mono">01 · Busy lives</span>\n          <h3>Training that fits real life.</h3>\n          <p>For professionals, business owners and parents who want to improve their health, strength and body composition without wasting time in the gym.</p>'],
  ['<span class="mono">02 · Personal Training Over 40</span>\n          <h3>Train for what comes next.</h3>\n          <p>Intelligent strength, body composition and longevity coaching for men and women over 40.</p>', '<span class="mono">02 · Strength, muscle &amp; longevity</span>\n          <h3>For people who care how they train.</h3>\n          <p>For anyone serious about building muscle or improving their physique, and retirees who want to maintain strength, muscle and bone density into their 70s, 80s and beyond.</p>'],
  ['<summary>I\'ve never trained with a coach before. Is this for me?</summary><p>Yes. Most clients start with little or no structured training history. The first step is a complimentary strength and body-composition planning consultation, and your program is built from your starting point — not a template.</p>', '<summary>Who is this coaching best suited to?</summary><p>It is a good fit if you want your training to be thought through rather than improvised — whether you are busy, focused on muscle and physique, or want to stay strong and capable as you age. You do not need to be experienced.</p>'],
  ['<summary>What happens after I enquire?</summary><p>I\'ll be in touch within 24 hours to arrange your complimentary strength and body-composition planning consultation. We\'ll discuss your goals, training history, injuries and schedule, then agree on the right next step. No obligation either way.</p>', '<summary>Will I always train with Greg?</summary><p>Yes. Sydney Bespoke Trainer is my independent business. I coach every session myself, design your program and make the adjustments as you progress.</p>'],
  ['<h2 style="margin-top:14px">Start with a<br><span class="o">clear plan.</span></h2>', '<h2 style="margin-top:14px">Start with a<br><span class="o">conversation.</span></h2>'],
  ['<p class="lede">No commitment. Discuss your goals, training history and schedule, then map out the right starting point with Greg.</p>', '<p class="lede">Tell me what you want to improve, what you have tried before and when you can train. I will explain how I would approach it and whether I think I am the right fit. No sales pitch.</p>'],
  ['<p class="form-foot">I\'ll be in touch within 24 hours.</p>', '<p class="form-foot">I will reply personally within 24 hours.</p>'],
  ['{"@type":"Question","name":"I\'ve never trained with a coach before. Is this for me?","acceptedAnswer":{"@type":"Answer","text":"Yes. Most clients start with little or no structured training history. The first step is a complimentary strength and body-composition planning consultation, and your program is built from your starting point — not a template."}}', '{"@type":"Question","name":"Who is this coaching best suited to?","acceptedAnswer":{"@type":"Answer","text":"It is a good fit if you want your training to be thought through rather than improvised — whether you are busy, focused on muscle and physique, or want to stay strong and capable as you age. You do not need to be experienced."}}'],
  ['{"@type":"Question","name":"What happens after I enquire?","acceptedAnswer":{"@type":"Answer","text":"I\'ll be in touch within 24 hours to arrange your complimentary strength and body-composition planning consultation. We\'ll discuss your goals, training history, injuries and schedule, then agree on the right next step. No obligation either way."}}', '{"@type":"Question","name":"Will I always train with Greg?","acceptedAnswer":{"@type":"Answer","text":"Yes. Sydney Bespoke Trainer is my independent business. I coach every session myself, design your program and make the adjustments as you progress."}}']
];

for (const [from, to] of replacements) {
  if (!html.includes(from)) {
    throw new Error(`Homepage copy rewrite could not find expected text: ${from.slice(0, 100)}`);
  }
  html = html.replace(from, to);
}

await writeFile(indexFile, html, 'utf8');
