// proto/data.jsx — shared data + scene palette.

const SCENES = {
  dusk:   'radial-gradient(120% 80% at 30% 110%, #e2874a 0%, #b04a3c 22%, #4a2548 55%, #0d1530 85%)',
  forest: 'radial-gradient(140% 90% at 70% 30%, #e4d896 0%, #6a8a4c 28%, #1f3a2a 60%, #050d09 92%)',
  rain:   'linear-gradient(180deg, #0c1720 0%, #1a2a3a 40%, #2d3f4c 70%, #3a4a52 100%)',
  neon:   'radial-gradient(100% 70% at 20% 100%, #ff5a8a 0%, #7a2a8c 35%, #2a1a5c 65%, #06061a 95%)',
  canyon: 'linear-gradient(170deg, #f5c67a 0%, #d47a3a 30%, #7a2f2a 60%, #2a1414 100%)',
  studio: 'radial-gradient(90% 60% at 50% 30%, #dcd2c2 0%, #9a8a72 40%, #3a332a 80%, #15110c 100%)',
  ice:    'linear-gradient(200deg, #c5dfea 0%, #6f96b5 30%, #1e3548 65%, #050b12 100%)',
  ember:  'radial-gradient(120% 80% at 50% 120%, #ffb04a 0%, #c24025 30%, #2a0c10 70%, #060205 100%)',
};

// ── HOW TO ADD YOUR REAL MEDIA ─────────────────────────────────────────
// On each project below you can add ANY of these fields. Anything missing
// just falls back to the gradient placeholder, so you can fill in slowly.
//
//   heroVimeo:    'https://vimeo.com/123456789'   ← full Vimeo URL OR just the ID
//   heroVideo:    'media/projects/my-project/hero.mp4'
//   hero:         'media/projects/my-project/hero.jpg'     (also used as Vimeo poster)
//   finalVimeo:   'https://vimeo.com/987654321'
//   finalVideo:   'media/projects/my-project/final.mp4'
//   finalImage:   'media/projects/my-project/final.jpg'
//
//   breakdown: [
//     { tone: 'studio', label: '01 · blockout', meta: 'greybox',
//       image: 'media/projects/my-project/breakdown-01.jpg' },     ← still image
//     { tone: 'ember',  label: '02 · lookdev',  meta: 'PBR',
//       vimeo: 'https://vimeo.com/111222333' },                    ← Vimeo clip
//     { tone: 'canyon', label: '03 · onset',    meta: 'live',
//       video: 'media/projects/my-project/onset.mp4' },            ← local mp4
//   ]
//
// Priority: vimeo > video > image > gradient. Drop the URL in and reload.
// ───────────────────────────────────────────────────────────────────────

// 2 VP + 4 environment + 1 photogrammetry + 1 VFX reel = 8 entries
const PROJECTS = [
  // ── Virtual Production (2) ─────────────────────────────────
  {
    slug: 'xr01-chinese-temple', n: '01', title: 'XR01 — Chinese Temple', role: 'Env. Artist & Brain Operator',
    kind: 'Virtual Production', kindShort: 'VP', year: '2025', tone: 'ember',
    tags: ['UE5', 'nDisplay', 'LED Volume', 'On-set'],
    tagline: 'A Chinese temple environment built and operated for an XR-stage short film.',
    blurb: 'Built a Chinese temple environment for an XR stage short film, then ran the brain on shoot day — managing nDisplay, LED budgets, frame rate, on-set lighting, and real-time optimization while the camera rolled.',
    client: 'SCAD · XR Stage', duration: '6 weeks', plates: 8, assets: 64,
    breakdown: [
      { tone: 'studio', label: '01 · blockout',  meta: 'greybox / scale' },
      { tone: 'ember',  label: '02 · materials', meta: 'PBR / weathering' },
      { tone: 'canyon', label: '03 · lookdev',   meta: 'lumen · dressed' },
      { tone: 'dusk',   label: '04 · on-set',    meta: 'nDisplay · live' },
    ],
    problem: 'The LED volume has a strict GPU budget and the director wanted a hand-held camera moving through carved interiors at 24fps without a single dropped frame.',
    approach: 'Modular kit with shared masters, instanced everything, and a culling pass tuned per camera angle. On the day I ran the brain — adjusting frustums, exposure, and frame pacing live between takes.',
  },
  {
    slug: 'xr02-1920s-nyc', n: '02', title: 'XR02 — 1920s NYC Industrial', role: 'Env. Artist & Brain Operator',
    kind: 'Virtual Production', kindShort: 'VP', year: '2025', tone: 'rain',
    tags: ['UE5', 'In-Camera VFX', 'AI Workflow', 'Retopo'],
    tagline: 'A 1920s New York industrial set, matched plate-perfect to a physical build.',
    blurb: 'Worked on a 1920s NYC industrial XR project with the production team — matching the digital extension to a physical set on stage, while testing AI-assisted asset workflows with retopology and texture baking to hit the schedule.',
    client: 'SCAD · ICVFX', duration: '7 weeks', plates: 10, assets: 88,
    breakdown: [
      { tone: 'studio', label: '01 · plate match', meta: 'physical set' },
      { tone: 'rain',   label: '02 · AI assets',   meta: 'concept → block' },
      { tone: 'ember',  label: '03 · retopo',      meta: 'clean topology' },
      { tone: 'rain',   label: '04 · final',       meta: 'in-camera vfx' },
    ],
    problem: 'Tight prep window. We needed dozens of period-correct hero props and a full street extension to match a built set, and traditional asset pipelines would have eaten the schedule.',
    approach: 'Used AI tools for concept and rough blockout, then ran every asset through proper retopology and PBR texture baking. The AI did the sketch; the pipeline did the production-ready build.',
  },

  // ── Unreal Environment Projects (4) ────────────────────────
  {
    slug: 'hollow-forest', n: '03', title: 'The Hollow Forest', role: 'Solo · Personal',
    kind: 'Environment', kindShort: 'ENV', year: '2025', tone: 'forest',
    tags: ['UE5', 'Lumen', 'SpeedTree', 'Megascans'],
    tagline: 'An overgrown shrine in a dying wood at the hour before rain.',
    blurb: 'A personal cinematic — overgrown shrine in a dying wood, captured at the hour before rain. A study in decay, mushrooms, and volumetric light.',
    client: 'Self', duration: '4 weeks', plates: 6, assets: 42,
    breakdown: [
      { tone: 'forest', label: '01 · scatter',   meta: 'PCG · density' },
      { tone: 'studio', label: '02 · hero tree', meta: 'sculpt / retopo' },
      { tone: 'ember',  label: '03 · lookdev',   meta: 'moss shader' },
      { tone: 'forest', label: '04 · lighting',  meta: 'volumetric' },
    ],
    problem: 'I wanted the forest to feel like it had been quiet for a thousand years. Most stock forests feel brand new.',
    approach: 'Built a weathering layer that runs on every asset via world-position noise — moss, rot, dust, chips. One seed feeds the whole forest.',
  },
  {
    slug: 'the-cave', n: '04', title: 'The Cave', role: 'Solo · Personal',
    kind: 'Environment', kindShort: 'ENV', year: '2025', tone: 'canyon',
    tags: ['UE5', 'Nanite', 'Lumen', 'Megascans'],
    tagline: 'A collapsed limestone cavern lit by a single shaft of daylight.',
    blurb: 'A deep-cave study — water-carved limestone, bioluminescent moss, and one shaft of light finding its way to the floor. Built to test Nanite tessellation on hero rock.',
    client: 'Self', duration: '3 weeks', plates: 5, assets: 28,
    breakdown: [
      { tone: 'canyon', label: '01 · blockout',  meta: 'cave geo' },
      { tone: 'studio', label: '02 · sculpt',    meta: 'nanite rock' },
      { tone: 'forest', label: '03 · lookdev',   meta: 'moss / damp' },
      { tone: 'dusk',   label: '04 · lighting',  meta: 'god rays' },
    ],
    problem: 'Hero rock at this scale usually reads as either too clean or too noisy once the camera gets close.',
    approach: 'Used Nanite tessellation to push real displacement into the rock instead of faking it with normal maps, then let one shaft of volumetric light carry the whole mood.',
  },
  {
    slug: 'rainy-forest', n: '05', title: 'Rainy Forest', role: 'Solo · Personal',
    kind: 'Environment', kindShort: 'ENV', year: '2025', tone: 'forest',
    tags: ['UE5', 'Niagara', 'SpeedTree', 'Lumen'],
    tagline: 'A dense forest canopy under steady rainfall, camera pushing low.',
    blurb: 'A wet-weather forest study — heavy canopy, low camera, and rain finding its way through the leaves. A companion piece to the drier forest work, built for a denser, greener mood.',
    client: 'Self', duration: '3 weeks', plates: 6, assets: 34,
    breakdown: [
      { tone: 'forest', label: '01 · scatter',   meta: 'canopy density' },
      { tone: 'rain',   label: '02 · rainfall',  meta: 'niagara fx' },
      { tone: 'forest', label: '03 · lookdev',   meta: 'wet foliage' },
      { tone: 'dusk',   label: '04 · final',     meta: 'lumen mood' },
    ],
    problem: 'Rain through dense foliage either looks like a flat overlay or costs too much to simulate per-leaf.',
    approach: 'Layered a cheap screen-space rain pass with a handful of Niagara drip emitters on hero branches only, so the eye reads full coverage for a fraction of the cost.',
  },

  // ── Photogrammetry assets (1) ──────────────────────────────
  {
    slug: 'photogrammetry-archive', n: '06', title: 'Photogrammetry Archive', role: 'Photogrammetry',
    kind: 'Photogrammetry', kindShort: 'SCAN', year: '2024', tone: 'canyon',
    tags: ['Reality Capture', 'A7R IV', 'Pipeline', 'PBR'],
    tagline: 'On-site captures of carved stone, bark, and weathered surfaces.',
    blurb: 'A growing archive of on-site photogrammetry — temple pillars, granite steps, bark, weathered surfaces. Captured, processed in Reality Capture, retopologised, and baked down to clean 8K PBR sets ready for Unreal.',
    client: 'Self + open archive', duration: 'ongoing', plates: 60, assets: 60,
    breakdown: [
      { tone: 'dusk',   label: '01 · capture',   meta: 'on-site grids' },
      { tone: 'studio', label: '02 · alignment', meta: 'RC solve' },
      { tone: 'canyon', label: '03 · retopo',    meta: 'ZB + Maya' },
      { tone: 'ember',  label: '04 · bakedown',  meta: '8K PBR' },
    ],
    problem: 'Field captures rarely come out production-ready. Bad light, awkward access, vendors sleeping against the pillars.',
    approach: 'Disciplined capture grids, cross-polarized when possible, and a retopo macro in ZBrush that turns 14M-poly raw meshes into hero assets overnight.',
  },

  // ── VFX Demo Reel (1) ──────────────────────────────────────
  {
    slug: 'vfx-compositing-works', n: '07', title: 'VFX Compositing Works', role: 'Unreal · Compositing',
    kind: 'VFX Reel', kindShort: 'REEL', year: '2024', tone: 'dusk',
    tags: ['Maya', 'Nuke', 'Lighting', 'Compositing'],
    heroVimeo: 'https://vimeo.com/1195867612',
    tagline: 'Selected compositing shots from internships and personal pieces.',
    blurb: 'A short reel of selected compositing shots from my VFX internships and personal work — production-ready lighting setups from Booth Bandhuk (Green Gold Animation), prep & face-track work in Nuke from Studio Raaga, and a handful of personal lighting studies.',
    client: 'Various', duration: '90 seconds', plates: 18, assets: 18,
    breakdown: [
      { tone: 'studio', label: '01 · lighting rigs', meta: 'maya / arnold' },
      { tone: 'ember',  label: '02 · AOV passes',    meta: 'comp-ready' },
      { tone: 'rain',   label: '03 · prep / track',  meta: 'nuke' },
      { tone: 'dusk',   label: '04 · final',         meta: 'reel cut' },
    ],
    problem: 'Production lighting and on-set compositing are two very different muscles. The reel needed to show both without feeling stitched together.',
    approach: 'Cut to a single tempo, colour-graded across all shots in DaVinci Resolve, and let the breakdowns do the talking instead of voiceover.',
  },
];

// ongoing / current work
const ONGOING = [
  { title: 'XR03 · in-progress', pct: 48, eta: 'Q3 2026', note: 'A new XR-stage environment in early lookdev. Modular kit, period-accurate, currently arguing with reflection captures.' },
  { title: 'Photogrammetry · 2026 captures', pct: 30, eta: 'rolling', note: 'New scan trips planned. Aiming for ten production-ready hero assets by summer.' },
  { title: 'Lighting · personal study', pct: 70, eta: 'next month', note: 'A short cinematic focused entirely on golden-hour interiors. Volumetrics, dust motes, the works.' },
];

// interests: tech + events the artist follows
// `link` is a placeholder — swap in the real URL later.
const INTERESTS = [
  { kind: 'Tech', title: 'UE 5.5+ · Nanite tessellation', note: 'Displacement without the geometry bill. Changes how I think about hero props entirely.', link: 'https://www.unrealengine.com/en-US/unreal-engine-5' },
  { kind: 'Tech', title: 'Gaussian splatting for VP', note: 'Field scans in 20 minutes, not 20 hours. Watching the tooling closely.', link: 'https://en.wikipedia.org/wiki/Gaussian_splatting' },
  { kind: 'Tech', title: 'AI-assisted blockouts', note: 'Useful when paired with proper retopo. Dangerous on its own. Learning where the line is.', link: 'https://www.unrealengine.com/en-US/ai' },
  { kind: 'Event', title: 'SCAD AnimationFest', note: 'On campus. The reel screenings every year are unmatched.', link: 'https://www.scad.edu' },
  { kind: 'Event', title: 'FMX 2026 · Stuttgart', note: 'On the wishlist. Hoping to catch the ICVFX panels.', link: 'https://www.fmx.de' },
  { kind: 'Reading', title: '"The Poetics of Space" · Bachelard', note: 'Re-reading. Everything I know about atmosphere comes from this book.', link: 'https://en.wikipedia.org/wiki/The_Poetics_of_Space' },
];

// SKILLS — extracted from resume, organized for the dynamic cursor section
const SKILLS = [
  { group: 'Tools',      items: ['Unreal Engine 5', 'Maya', 'Blender', 'SpeedTree', 'Gaea', 'RealityCapture', 'Houdini', 'EmberGen', 'Substance Painter', 'Photoshop', 'After Effects', 'Premiere Pro', 'DaVinci Resolve', 'Nuke'] },
  { group: 'Core',       items: ['Environment Art', 'Unreal Environment Design', 'Modular Asset Creation', 'Photogrammetry', 'Level Dressing', 'Real-Time Lighting (Lumen)', 'Cinematic Composition', 'Mocap', 'Virtual Production', 'XR Stage Fundamentals'] },
  { group: 'Technical',  items: ['PBR Texturing', 'Material Creation', 'Scene Optimization', 'Performance Testing', 'Procedural Set Dressing', 'nDisplay', 'Brain Operation'] },
  { group: 'Workflows',  items: ['AI Concept Art', 'AI Model Generation', 'AI-Assisted Animations', 'Retopology', 'Texture Baking', 'AOV Passes', 'Face Tracking'] },
];

// hobbies — each has a stack of photo placeholders that reveal on hover
const HOBBIES = [
  { emoji: '📷', title: 'Photography',  note: 'Chasing light wherever it lives. Walls, water, weather — anything that holds a shadow.',
    stack: ['canyon', 'dusk', 'studio', 'forest'] },
  { emoji: '🥾', title: 'Trekking',     note: 'Long walks with a heavier bag than I should be carrying. Mountains for reference. Mostly.',
    stack: ['forest', 'ice', 'canyon', 'dusk'] },
  { emoji: '✈️', title: 'Travelling',   note: 'Trains, buses, the occasional flight. New air, new ground, new things to scan.',
    stack: ['dusk', 'rain', 'canyon', 'neon'] },
  { emoji: '🍳', title: 'Cooking',      note: 'Loud kitchens, too much garlic, and an ongoing argument with biryani.',
    stack: ['ember', 'studio', 'canyon', 'dusk'] },
  { emoji: '📚', title: 'Reading books',note: 'Mostly Bachelard, Tanizaki, and design books with no plot. Underlined to death.',
    stack: ['studio', 'dusk', 'ember', 'rain'] },
  { emoji: '🧪', title: 'Trying new stuff', note: 'Synths, ceramics, fermentation, ham radio — anything I have no business knowing yet.',
    stack: ['neon', 'ice', 'ember', 'studio'] },
];

// favourite films rated
const MOVIES = [
  { title: 'Avatar',                  year: 2009, dir: 'Cameron',              vfx: 'Letteri', rating: 10, note: 'The first time I saw a world I wanted to live inside, not just watch.' },
  { title: 'The Chronicles of Narnia', year: 2005, dir: 'Adamson',              vfx: 'Fontaine', rating: 10, note: 'Childhood favourite. Still the reason I chase snow and old wood.' },
  { title: 'Spider-Man: No Way Home',  year: 2021, dir: 'Watts',                vfx: 'Sharp', rating: 9,  note: 'Three cities of set design in one movie. I took notes.' },
  { title: 'Baahubali: The Beginning', year: 2015, dir: 'Rajamouli',            vfx: 'Srinivas Mohan', rating: 10, note: 'Scale done right. Waterfalls, palaces, zero apology for spectacle.' },
  { title: 'Transformers',             year: 2007, dir: 'Bay',                 vfx: 'Farrar', rating: 8,  note: 'Metal, dust, and sunlight — my first lesson in hero-asset lighting.' },
  { title: 'Pacific Rim',              year: 2013, dir: 'del Toro',             vfx: 'Davidson', rating: 9,  note: 'Rain, neon, and giant silhouettes. My alley scenes owe this one a debt.' },
  { title: 'Godzilla',                 year: 2014, dir: 'Edwards',              vfx: 'Breslin', rating: 8,  note: 'Scale through restraint — half the monster is always off-frame.' },
  { title: 'Kung Fu Panda',            year: 2008, dir: 'Osborne & Stevenson',  vfx: 'Peters', rating: 8,  note: 'Proof that a warm, lived-in world can carry a whole film.' },
];

// EDUCATION — straight from resume
const EDUCATION = [
  { yr: '2025 — 2026', org: 'M.A. · Visual Effects',           where: 'Savannah College of Art and Design (SCAD) · Savannah, GA', note: 'Currently focused on virtual production and XR-stage workflows. Two XR-stage shorts shipped this year.' },
  { yr: '2020 — 2024', org: 'B.A. (Hons) · Multimedia',         where: 'International Academy of Computer Graphics · Hyderabad, India', note: 'Foundation across modeling, lighting, compositing, and motion. Where I figured out environments were the thing.' },
  { yr: 'before all this', org: 'Curious about VFX', where: 'YouTube + a birthday camera', note: 'Learning every trick online and immediately testing it on the camera my dad got me for my birthday. Mostly explosions in the backyard. He has not been credited.' },
];

// EXPERIENCE — straight from resume + current student VP roles
const EXPERIENCE = [
  { yr: '2025 — now',  role: 'Env. Artist & Brain Operator', org: 'SCAD · XR Stage Productions', note: 'Built environments and ran the brain on two XR-stage shorts (XR01 Chinese Temple, XR02 1920s NYC). nDisplay, LED budgets, on-set live ops.' },
  { yr: 'Mar — May 2024', role: 'VFX Compositor (Intern)', org: 'Studio Raaga · Remote', note: 'Prep and face-tracking for a short film in Nuke. Clean mattes, organized node graphs, and a lot of node-graph etiquette I still use.' },
  { yr: 'Jan — Mar 2024', role: 'VFX Lighting Artist (Intern)', org: 'Green Gold Animation · Hyderabad', note: 'Lighting on the animated TV series Booth Bandhuk. Production-ready rigs, mood/depth/consistency, AOV pass management for compositing.' },
];

// CERTIFICATES — kept generic since none on resume; replace as earned
const CERTIFICATES = [
  { yr: '2025', title: 'XR Stage · Brain Operation',     org: 'SCAD',                kind: 'Hands-on' },
  { yr: '2025', title: 'Unreal Engine 5 · Production',   org: 'Epic Online Learning',kind: 'Course' },
  { yr: '2024', title: 'Reality Capture · Workflows',    org: 'Capturing Reality',   kind: 'Self-taught' },
  { yr: '2024', title: 'AI-Assisted Asset Pipelines',    org: 'Independent study',   kind: 'Workflow' },
];

// inline gallery stills (for About page photo collection)
// To add your real photos: drop files into `media/pages/about/gallery/`, then add an `image:` path.
// Example:
//   { tone: 'forest', cap: 'forest run', tag: 'walk',
//     image: 'media/pages/about/gallery/01.jpg' },
// If `image` is missing, the gradient placeholder shows instead.
const GALLERY = [
  { tone: 'forest', cap: 'sanctuary / 02:41:13',  tag: 'UE5'     /*, image: 'media/pages/about/gallery/01.jpg' */ },
  { tone: 'rain',   cap: 'platform 3 · rain',     tag: 'plate'   /*, image: 'media/pages/about/gallery/02.jpg' */ },
  { tone: 'neon',   cap: 'alley · sign flicker',  tag: 'lookdev' /*, image: 'media/pages/about/gallery/03.jpg' */ },
  { tone: 'canyon', cap: 'stone 041 · scan',      tag: '8K'      /*, image: 'media/pages/about/gallery/04.jpg' */ },
  { tone: 'dusk',   cap: 'sunrise · reference',   tag: 'ref'     /*, image: 'media/pages/about/gallery/05.jpg' */ },
];

// ── Case-study extras ─────────────────────────────────────
// stage   · where the project stands
// layout  · process-book arrangement (stagger | filmstrip | mosaic | column | sheet)
// process · photo sequence. Drop real files in media/process/ and add `image:`.
//           `cap` is placeholder caption copy — rewrite per photo.
// video   · final piece. Set `vimeo` (URL or id) or `src` (local mp4).
// closing · the last line on the page.
const CASE_EXTRAS = {
  'xr01-chinese-temple': {
    software: ['Unreal Engine 5','nDisplay','ZBrush','Substance 3D'],
    stage: 'Delivered · shot on stage',
    layout: 'stagger',
    video: { vimeo: '', src: '', cap: 'XR01 · final cut' },
    process: [
      { tone: 'studio', title: 'Reference', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'ember', title: 'Blockout', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'canyon', title: 'The temple kit', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'dusk', title: 'Materials', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'ember', title: 'Lighting', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'studio', title: 'Shoot day', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
    ],
    closing: 'The camera moved, the wall held, and for a second nobody could tell where the set ended.',
  },
  'xr02-1920s-nyc': {
    software: ['Unreal Engine 5','Maya','ZBrush','Substance 3D'],
    stage: 'Delivered · in-camera VFX',
    layout: 'filmstrip',
    video: { vimeo: '', src: '', cap: 'XR02 · final cut' },
    process: [
      { tone: 'studio', title: 'Measuring the set', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'rain', title: 'AI concepts', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'ember', title: 'Retopology', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'rain', title: 'Street extension', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'dusk', title: 'Final match', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
    ],
    closing: 'A machine can sketch a city in a minute. Making it stand up still takes a week and a hand.',
  },
  'hollow-forest': {
    software: ['Unreal Engine 5','SpeedTree','Megascans','Substance 3D'],
    stage: 'Personal · finished',
    layout: 'mosaic',
    video: { vimeo: '', src: '', cap: 'The Hollow Forest · cinematic' },
    process: [
      { tone: 'forest', title: 'Location reference', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'dusk', title: 'Canopy scatter', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'forest', title: 'Shrine blockout', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'canyon', title: 'Moss & decay', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'forest', title: 'Volumetrics', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
    ],
    closing: 'I kept adding rot until it felt alive. Decay, it turns out, is mostly detail.',
  },
  'the-cave': {
    software: ['Unreal Engine 5','ZBrush','Megascans','Substance 3D'],
    stage: 'Personal · finished',
    layout: 'column',
    video: { vimeo: '', src: '', cap: 'The Cave · cinematic' },
    process: [
      { tone: 'canyon', title: 'Cave blockout', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'dusk', title: 'Nanite tests', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'canyon', title: 'Bioluminescence', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'studio', title: 'One shaft of light', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
    ],
    closing: 'One light source. Everything else was just deciding what deserved to be seen.',
  },
  'rainy-forest': {
    software: ['Unreal Engine 5','Niagara','SpeedTree','Megascans'],
    stage: 'Personal · finished',
    layout: 'stagger',
    video: { vimeo: '', src: '', cap: 'Rainy Forest · cinematic' },
    process: [
      { tone: 'forest', title: 'Wet-weather reference', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'rain', title: 'Rain in Niagara', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'forest', title: 'Canopy density', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'rain', title: 'Surface wetness', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'dusk', title: 'Low camera', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'forest', title: 'Final grade', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
    ],
    closing: 'Rain is easy to add and hard to believe. The trick was in what it landed on.',
  },
  'photogrammetry-archive': {
    software: ['Reality Capture','ZBrush','Substance 3D','Marmoset'],
    stage: 'Ongoing · open archive',
    layout: 'sheet',
    video: { vimeo: '', src: '', cap: 'Archive · turntable reel' },
    process: [
      { tone: 'canyon', title: 'Capture grid', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'dusk', title: 'Alignment', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'studio', title: 'Dense mesh', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'canyon', title: 'Retopology', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'ember', title: '8K bake', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'studio', title: 'Engine-ready', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'dusk', title: 'Bark set', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'canyon', title: 'Temple pillar', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
    ],
    closing: 'Every scan is a small argument that this surface was worth keeping.',
  },
  'vfx-compositing-works': {
    software: ['Maya','Arnold','Nuke','After Effects'],
    stage: 'Reel · updated 2024',
    layout: 'column',
    video: { vimeo: '', src: '', cap: 'VFX reel · 90 seconds' },
    process: [
      { tone: 'studio', title: 'Lighting rigs', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'dusk', title: 'Face-track solve', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'rain', title: 'Cleanup & mattes', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
      { tone: 'ember', title: 'Final composite', cap: 'Placeholder — a paragraph of the story here. Keep it running: what stage the project was at, what you were solving, and what changed by the end of it.' },
    ],
    closing: 'Good comp work disappears. That is the whole job, and it took me a while to like it.',
  },
};

Object.assign(window, { SCENES, PROJECTS, CASE_EXTRAS, ONGOING, INTERESTS, SKILLS, HOBBIES, MOVIES, GALLERY, EDUCATION, EXPERIENCE, CERTIFICATES });
