import { readFile, writeFile } from 'node:fs/promises';

const indexFile = new URL('../index.html', import.meta.url);
let html = await readFile(indexFile, 'utf8');

const replacements = [
  [
    '<p class="lede">One-to-one coaching for strength, muscle and body composition — with every session designed to make your time in the gym count.</p>',
    '<p class="lede">One-to-one coaching for strength, hypertrophy and body composition — with programming adjusted around how you move, perform and respond to training.</p>'
  ],
  [
    '<div class="cell"><span class="mono">1.1</span><h3>You train with me</h3><p>Sydney Bespoke Trainer is my business. Every session is coached by me, and I make the programming decisions myself.</p></div>',
    '<div class="cell"><span class="mono">1.1</span><h3>You train with me</h3><p>Sydney Bespoke Trainer is my business. I design your program, coach every session and make the adjustments myself.</p></div>'
  ],
  [
    '<div class="cell"><span class="mono">1.3</span><h3>Evidence, then judgement</h3><p>Research guides the plan. Your reps, recovery and response tell me when to push, adjust or leave something alone.</p></div>',
    '<div class="cell"><span class="mono">1.3</span><h3>Evidence, then judgement</h3><p>Research guides the plan, but good coaching is more nuanced than following a template. Your reps, technique, recovery and response tell me when to push, adjust or leave something alone.</p></div>'
  ],
  [
    '<p>I started training in my teens and quickly developed a love for bodybuilding and the process of changing my own physique. That interest became a career, and I have now spent more than 18 years coaching people with very different goals and levels of experience.</p>',
    '<p>I started training in my teens and bodybuilding quickly became a major part of my life. Learning how to build muscle and change my own physique sparked the interest that became my career, and I have now spent more than 18 years coaching people with very different goals and levels of experience.</p>'
  ],
  [
    '<p>Hypertrophy and strength have always been a major focus. Evidence guides how I program, but experience has taught me to watch the person in front of me — how you perform your reps, how you recover and how you respond over time. That tells me when to add weight, change an exercise, adjust volume or simply keep something that is working.</p>',
    '<p>Hypertrophy has been at the centre of how I have trained and coached for almost two decades. Evidence guides how I program, but experience has taught me to watch the person in front of me — how you perform your reps, how your technique changes under load, how you recover and how you respond over time. That tells me when to add weight, change an exercise, adjust volume or simply keep something that is working.</p>'
  ],
  [
    '<p>I run Sydney Bespoke Trainer independently. When you hire me, you work with me — I design your program, coach your sessions and make the adjustments. My business is built around the quality of the coaching itself, and I take pride in making sure your form and technique are on point.</p>',
    '<p>I run Sydney Bespoke Trainer independently. When you hire me, you work with me — I design your program, coach your sessions and make the adjustments. There is no hand-off; I am responsible for the program and the coaching from start to finish, and I take pride in making sure your form and technique are on point.</p>'
  ]
];

let changed = 0;
for (const [from, to] of replacements) {
  if (html.includes(from)) {
    html = html.replace(from, to);
    changed += 1;
  } else if (!html.includes(to)) {
    console.warn(`Brand-story refinement target not found: ${from.slice(0, 90)}...`);
  }
}

if (changed > 0) {
  await writeFile(indexFile, html, 'utf8');
  console.log(`Applied ${changed} brand-story refinements.`);
} else {
  console.log('Brand-story refinements already applied.');
}
