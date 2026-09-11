import { readFile, writeFile } from 'node:fs/promises';

async function refine(path, replacements) {
  const file = new URL(`../${path}`, import.meta.url);
  let html = await readFile(file, 'utf8');
  for (const [from, to] of replacements) {
    if (html.includes(from)) html = html.replace(from, to);
  }
  await writeFile(file, html, 'utf8');
}

await refine('personal-trainer-sydney-cbd/index.html', [
  [
    '<meta name="description" content="One-to-one personal training in Sydney CBD with Greg Kafalian. Evidence-based strength, muscle, fat-loss and body-composition coaching at 35 Clarence Street.">',
    '<meta name="description" content="One-to-one personal training in Sydney CBD with Greg Kafalian. Thoughtful strength, muscle and body-composition coaching designed around your goals and schedule.">'
  ],
  [
    '<meta property="og:description" content="Bespoke one-to-one coaching built around your goals, training experience and schedule.">',
    '<meta property="og:description" content="Train directly with Greg Kafalian in Sydney CBD. Thoughtful programming, detailed technique coaching and 18+ years of hands-on experience.">'
  ],
  [
    '<meta name="twitter:description" content="Evidence-based one-to-one personal training in Sydney CBD with Greg Kafalian.">',
    '<meta name="twitter:description" content="One-to-one personal training in Sydney CBD with Greg Kafalian for strength, muscle, physique and body composition.">'
  ],
  [
    '"description": "One-to-one personal training in Sydney CBD with Greg Kafalian. Evidence-based strength, muscle, fat-loss and body-composition coaching at 35 Clarence Street."',
    '"description": "One-to-one personal training in Sydney CBD with Greg Kafalian. Thoughtful strength, muscle and body-composition coaching designed around your goals and schedule."'
  ],
  ['<a class="book" href="/#contact">Book Your Consult</a>', '<a class="book" href="/#contact">Talk To Greg</a>'],
  ['<div class="eyebrow">Sydney CBD · One-to-One Coaching</div>', '<div class="eyebrow">Sydney CBD · Coached Directly By Greg</div>'],
  [
    '<p>Work directly with Greg Kafalian through evidence-based coaching designed around your body, goals, training history and weekly schedule.</p>',
    '<p>If you want your training to be thought through rather than improvised, I’ll coach you one-to-one, choose the exercises carefully and adjust the program as I see how you respond.</p>'
  ],
  [
    '<span>Bespoke Programming</span><span>Strength &amp; Hypertrophy</span><span>Body Recomposition</span><span>Technique Optimisation</span><span>Nutrition Guidance</span>\n      <span>Bespoke Programming</span><span>Strength &amp; Hypertrophy</span><span>Body Recomposition</span><span>Technique Optimisation</span><span>Nutrition Guidance</span>',
    '<span>One-to-One With Greg</span><span>Strength &amp; Muscle</span><span>Physique</span><span>Technique</span><span>Body Composition</span>\n      <span>One-to-One With Greg</span><span>Strength &amp; Muscle</span><span>Physique</span><span>Technique</span><span>Body Composition</span>'
  ],
  [
    '<div><div class="eyebrow">Built Around You</div><h2>Clear Coaching.<br>No Guesswork.</h2></div>',
    '<div><div class="eyebrow">Busy Schedules · Serious Training</div><h2>Make Your Gym<br>Time Count.</h2></div>'
  ],
  [
    '<p class="section-copy">Your plan begins with your starting point—not a generic template. Training is continually adjusted as your strength, technique, recovery and goals evolve.</p>',
    '<p class="section-copy">Some clients are fitting training around work and family. Others are serious about building muscle or improving their physique. Either way, I want every exercise to have a reason for being there.</p>'
  ],
  [
    '<article class="row"><div class="row-num">01</div><div><h3>Focused One-to-One Training</h3><p>Greg coaches every booked session directly, giving you individual guidance, precise feedback and a productive structure for each appointment.</p></div></article>',
    '<article class="row"><div class="row-num">01</div><div><h3>Your Time Matters</h3><p>I keep sessions focused. Exercise selection, loading and progression are chosen to give you a strong return for the time you put into training.</p></div></article>'
  ],
  [
    '<article class="row"><div class="row-num">02</div><div><h3>Strength and Muscle Development</h3><p>Progressive resistance training is programmed around your experience, movement and goals so you can build measurable strength and muscle.</p></div></article>',
    '<article class="row"><div class="row-num">02</div><div><h3>Build Muscle And Strength</h3><p>Your program is built around your experience, movement and goals, whether you are starting out or want a more considered approach to physique and hypertrophy training.</p></div></article>'
  ],
  [
    '<article class="row"><div class="row-num">03</div><div><h3>Fat Loss and Body Recomposition</h3><p>Resistance training, sensible nutrition guidance and sustainable progression work together to support long-term body-composition results.</p></div></article>',
    '<article class="row"><div class="row-num">03</div><div><h3>Technique I Actually Watch</h3><p>I pay close attention to setup, range, execution and how your reps change under load. Those details help guide exercise selection and progression.</p></div></article>'
  ],
  [
    '<div><div class="eyebrow">The Bespoke Difference</div><h2>Programmed For<br>Your Real Life.</h2></div>',
    '<div><div class="eyebrow">What You Get</div><h2>Coaching, Not Just<br>A Session.</h2></div>'
  ],
  [
    '<p class="section-copy">The coaching fits the person. Exercise selection, training volume and progression reflect your experience, availability, recovery and priorities.</p>',
    '<p class="section-copy">When you train with Sydney Bespoke Trainer, you work directly with me. I design the program, coach the session and make the changes myself.</p>'
  ],
  [
    '<div><h3>Every program includes</h3><ul class="facts"><li>Movement and technique assessment</li><li>Evidence-based periodised programming</li><li>Ongoing program optimisation</li><li>Practical nutrition and macro guidance</li></ul></div>',
    '<div><h3>Your coaching includes</h3><ul class="facts"><li>One-to-one coaching with me</li><li>A program designed and adjusted by me</li><li>Detailed form and technique feedback</li><li>Practical nutrition and macro guidance</li></ul></div>'
  ],
  [
    '<div><h3>18+ years of coaching experience</h3><p>Greg combines practical experience with a strong focus on exercise technique and structured programming. You receive direct coaching throughout—not a plan handed off to another trainer.</p></div>',
    '<div><h3>18+ years, still hands-on</h3><p>I have spent more than 18 years coaching people with very different goals. Research guides the plan, but the person in front of me tells me how it should evolve.</p></div>'
  ],
  [
    '<p class="section-copy">One-to-one appointments are available from 7am to 3pm, including quieter off-peak times.</p>',
    '<p class="section-copy">One-to-one appointments are available from 7am to 3pm at 35 Clarence Street, close to Wynyard. The setting is a commercial gym; the coaching is entirely one-to-one.</p>'
  ],
  [
    '<section class="cta">\n      <h2>Start With A Clear Plan.</h2>\n      <p>Discuss your goals, training history and schedule with Greg. There is no lock-in contract or obligation.</p>\n      <a class="book" href="/#contact">Book a Complimentary Consultation</a>\n    </section>',
    '<section class="cta">\n      <h2>Start With A Conversation.</h2>\n      <p>Tell me what you want to improve, what you have tried before and how training needs to fit around your week. I’ll tell you how I would approach it.</p>\n      <a class="book" href="/#contact">Talk To Greg</a>\n    </section>'
  ]
]);

await refine('personal-training-over-40-sydney/index.html', [
  [
    '<meta name="description" content="One-to-one personal training for adults over 40 in Sydney. Build strength, muscle and confidence with evidence-based coaching tailored to your body and lifestyle.">',
    '<meta name="description" content="One-to-one personal training for adults over 40 in Sydney. Build or maintain strength, muscle and bone density with coaching tailored to your body and recovery.">'
  ],
  [
    '<meta property="og:description" content="Evidence-based coaching to build strength, muscle and long-term capability after 40.">',
    '<meta property="og:description" content="One-to-one coaching for adults over 40 and retirees who want to stay strong, maintain muscle and train well for the decades ahead.">'
  ],
  [
    '<meta name="twitter:description" content="Evidence-based strength and body-composition coaching for adults over 40 in Sydney.">',
    '<meta name="twitter:description" content="One-to-one strength, muscle and longevity coaching for adults over 40 in Sydney.">'
  ],
  [
    '"description": "One-to-one personal training for adults over 40 in Sydney. Build strength, muscle and confidence with evidence-based coaching tailored to your body and lifestyle."',
    '"description": "One-to-one personal training for adults over 40 in Sydney. Build or maintain strength, muscle and bone density with coaching tailored to your body and recovery."'
  ],
  [
    '"serviceType": "One-to-one strength and body-composition coaching for adults over 40"',
    '"serviceType": "One-to-one strength, muscle and longevity coaching for adults over 40 and retirees"'
  ],
  ['<a class="book" href="/#contact">Book Your Consult</a>', '<a class="book" href="/#contact">Talk To Greg</a>'],
  ['<div class="eyebrow">Sydney · Personal Training Over 40</div>', '<div class="eyebrow">Sydney · Strength &amp; Longevity After 40</div>'],
  ['<h1>Build Strength.<br>Train For Life.</h1>', '<h1>Stay Strong.<br>Keep Moving.</h1>'],
  [
    '<p>One-to-one coaching for adults over 40 who want to build muscle, improve body composition and keep progressing with a plan designed around their body and lifestyle.</p>',
    '<p>For adults over 40 and retirees who want to build or maintain muscle, strength and bone density — and keep doing the things they enjoy for decades to come.</p>'
  ],
  [
    '<span>Strength</span><span>Muscle</span><span>Body Composition</span><span>Technique</span><span>Long-Term Health</span>\n      <span>Strength</span><span>Muscle</span><span>Body Composition</span><span>Technique</span><span>Long-Term Health</span>',
    '<span>Strength</span><span>Muscle</span><span>Bone Density</span><span>Technique</span><span>Long-Term Capability</span>\n      <span>Strength</span><span>Muscle</span><span>Bone Density</span><span>Technique</span><span>Long-Term Capability</span>'
  ],
  [
    '<div><div class="eyebrow">Training That Evolves</div><h2>Over 40 Doesn\'t Mean<br>Lower Expectations.</h2></div>',
    '<div><div class="eyebrow">Strength That Carries Forward</div><h2>Train For The<br>Decades Ahead.</h2></div>'
  ],
  [
    '<p class="section-copy">The goal is productive training—not random workouts. Exercise selection, progression and recovery are considered together so your program remains challenging and realistic.</p>',
    '<p class="section-copy">The aim is not to train like you did at 25. It is to train well now — with enough challenge to build or maintain muscle and strength, while respecting recovery, joints and the life you have outside the gym.</p>'
  ],
  [
    '<article class="row"><div class="row-num">01</div><div><h3>Build Strength and Muscle</h3><p>Progressive resistance training is designed around your current ability, goals and training history, with clear markers of progress.</p></div></article>',
    '<article class="row"><div class="row-num">01</div><div><h3>Keep Muscle And Strength</h3><p>Resistance training is progressed from your current level so you can build strength where possible and hold onto the muscle that matters as you age.</p></div></article>'
  ],
  [
    '<article class="row"><div class="row-num">02</div><div><h3>Improve Body Composition</h3><p>Structured training and practical nutrition guidance support sustainable muscle gain, fat loss and long-term results.</p></div></article>',
    '<article class="row"><div class="row-num">02</div><div><h3>Support Bone Density</h3><p>Progressive loading is an important part of maintaining a strong, capable body. Your program is built to make that loading appropriate and repeatable.</p></div></article>'
  ],
  [
    '<article class="row"><div class="row-num">03</div><div><h3>Train With Confidence</h3><p>Precise guidance on exercise selection, setup and technique helps you understand what you are doing and why.</p></div></article>',
    '<article class="row"><div class="row-num">03</div><div><h3>Train With Good Technique</h3><p>I pay close attention to setup, range, control and how you respond to load so you can train hard without being careless.</p></div></article>'
  ],
  [
    '<div><div class="eyebrow">Individual, Not Generic</div><h2>Programmed For<br>Your Body.</h2></div>',
    '<div><div class="eyebrow">Your Body · Your Program</div><h2>No Generic<br>“Over 40” Workout.</h2></div>'
  ],
  [
    '<p class="section-copy">Your training reflects your schedule, capabilities and priorities. Volume, loading and exercise selection are reviewed as you progress.</p>',
    '<p class="section-copy">Age matters, but it is not the whole story. Your training history, injuries, recovery, goals and current ability matter more when I decide what you should actually do.</p>'
  ],
  [
    '<div><h3>Your coaching includes</h3><ul class="facts"><li>Movement and technique assessment</li><li>Evidence-based strength programming</li><li>Recovery-aware progression</li><li>Nutrition and macro guidance</li></ul></div>',
    '<div><h3>Your coaching includes</h3><ul class="facts"><li>One-to-one coaching with me</li><li>A program built around your current ability</li><li>Detailed technique and loading guidance</li><li>Practical nutrition and macro guidance</li></ul></div>'
  ],
  [
    '<div><h3>Direct coaching with Greg</h3><p>You work one-to-one with Greg in every booked session. More than 18 years of practical coaching experience informs a methodical approach to strength, muscle and body composition.</p></div>',
    '<div><h3>Direct coaching with me</h3><p>You work with me in every booked session. I have spent more than 18 years coaching strength and muscle, and I make the programming changes myself as I see how you respond.</p></div>'
  ],
  [
    '<div><div class="eyebrow">A Realistic Structure</div><h2>Strong Training.<br>Built Around Life.</h2></div>',
    '<div><div class="eyebrow">Real Life Matters</div><h2>Strong Enough<br>For Life.</h2></div>'
  ],
  [
    '<p class="section-copy">Work, family, recovery and previous injuries all affect training. The right program accounts for those realities while keeping meaningful progress as the objective.</p>',
    '<p class="section-copy">For some people the goal is a better physique. For others it is staying strong enough to travel, play with grandchildren, carry things, move confidently and keep their independence. Both are valid reasons to train.</p>'
  ],
  [
    '<section class="cta">\n      <h2>Start With A Clear Plan.</h2>\n      <p>Discuss your goals, training history and schedule with Greg. There is no lock-in contract or obligation.</p>\n      <a class="book" href="/#contact">Book a Complimentary Consultation</a>\n    </section>',
    '<section class="cta">\n      <h2>Start With A Conversation.</h2>\n      <p>Tell me what you want to stay capable of, what has changed with your training and whether there are any injuries or limitations I should know about.</p>\n      <a class="book" href="/#contact">Talk To Greg</a>\n    </section>'
  ]
]);
