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
    slug: 'xr01-chinese-temple', n: '01', title: 'The Gate Within', role: 'Environment Artist · Virtual Production',
    kind: 'Virtual Production', kindShort: 'VP', year: '2025', tone: 'ember',
    tags: ['UE5', 'Gaea', 'LED Volume', 'On-set'],
    hero: 'media/projects/xr01-chinese-temple/web/unreal-bd-3.webp',
    tagline: 'Unreal environment development and on-stage foliage optimization for a student virtual production film.',
    blurb: 'A SCAD student film. I developed the Unreal environment and adapted it for the XR stage, from terrain and scene composition to on-set foliage optimization.',
    client: 'SCAD · Student film', focus: 'Environment · XR adaptation',
    breakdown: [
      { tone: 'studio', label: '01 · terrain', meta: 'Gaea', image: 'media/projects/xr01-chinese-temple/web/gaea-wf.webp' },
      { tone: 'ember', label: '02 · layout', meta: 'Unreal', image: 'media/projects/xr01-chinese-temple/web/unreal-bd.webp' },
      { tone: 'canyon', label: '03 · environment', meta: 'foliage / lighting', image: 'media/projects/xr01-chinese-temple/web/unreal-bd-3.webp' },
      { tone: 'dusk', label: '04 · on-set', meta: 'XR stage', image: 'media/projects/xr01-chinese-temple/web/xr-screen-01.webp' },
    ],
    problem: 'Dense foliage and animated trees made the original scene too demanding for the virtual production stage.',
    approach: 'Rebuilt the foliage around the camera view: manually placed plants replaced the PCG layout, and lightweight tree cards with subtle motion replaced some of the heavier meshes.',
  },
  {
    slug: 'xr02-1920s-nyc', n: '02', title: 'The Parley', role: 'Environment Artist · Motion Capture',
    kind: 'Virtual Production', kindShort: 'VP', year: '2026', tone: 'rain',
    hero: 'media/projects/xr02-1920s-nyc/web/highresscreenshot00000.webp',
    tags: ['Unreal Engine', 'Blender', 'AI Workflow', 'Sony mocopi'],
    tagline: 'An environment inspired by 1890s industrial New York, built for a student virtual production film.',
    blurb: 'My second virtual production film: a setting inspired by 1890s industrial New York for a confrontation between two rival gangs. I developed the Unreal environment and operated Sony mocopi capture sessions using XYN, while our team explored AI-assisted assets and practical set integration.',
    client: 'SCAD · Student film', focus: 'Environment · Motion capture',
    breakdown: [
      { tone: 'rain', label: '01 · environment', meta: 'Unreal Engine', image: 'media/projects/xr02-1920s-nyc/web/highresscreenshot00000.webp' },
      { tone: 'studio', label: '02 · façade', meta: 'image-based geometry', image: 'media/projects/xr02-1920s-nyc/web/screenshot-2026-10-06-115029.webp' },
      { tone: 'studio', label: '03 · capture', meta: 'Sony mocopi · XYN', image: 'media/projects/xr02-1920s-nyc/web/mocopi-session.webp' },
      { tone: 'rain', label: '04 · stage', meta: 'virtual production', image: 'media/projects/xr02-1920s-nyc/web/photo-feb-17-2026-2-41-15-pm.webp' },
    ],
    problem: 'Translate an industrial street concept into a practical XR environment while testing AI-assisted assets, captured motion, and on-stage effects.',
    approach: 'Build shallow façade geometry from generated images, assemble and light the environment in Unreal, capture motion with Sony mocopi and XYN, and simplify the scene around the needs of the shoot.'
  },

  // ── Unreal Environment Projects (4) ────────────────────────


  {
    slug: 'rainy-forest', n: '05', title: 'Monsoon Station', role: 'Solo · Environment Artist',
    kind: 'Environment', kindShort: 'ENV', year: '2025', tone: 'forest',
    hero: 'media/projects/monsoon-station/web/highresscreenshot00008.webp',
    tags: ['Unreal Engine', 'Gaea', 'PCG', 'Splines'],
    tagline: 'A mountain railway imagined in a dream, built in Unreal.',
    blurb: 'A personal environment exploring terrain creation, procedural placement and spline-controlled railway workflows.',
    client: 'Personal project', duration: '2 years',
    breakdown: [],
    problem: 'Developing a mountain railway while retaining control over the route and environment.',
    approach: 'Gaea terrain, PCG and spline workflows, with scene assembly and lighting in Unreal.',

  },

  {slug:'ranasthala', title:'Ranasthala', role:'Director · Environment Artist · Unreal Engine & Virtual Production Operator', kind:'Virtual Production', kindShort:'VP', tone:'canyon', tags:['Unreal Engine'], hero:'media/projects/Ranasthala/web/highresscreenshot00058.webp', client:'Master’s final project', tagline:'An arena built from my photogrammetry captures across India. A virtual production film.', blurb:'My master’s final VFX project: a virtual production environment built from architectural scans captured in Hampi and Rajasthan. Assets complete; filming is underway.', breakdown:[]},
  // ── Photogrammetry assets (1) ──────────────────────────────
  {
    slug: 'photogrammetry-archive', n: '06', title: 'Photogrammetry Archive', role: 'Photogrammetry · 3D Capture',
    kind: 'Photogrammetry', kindShort: 'SCAN', tone: 'studio',
    hero: 'media/projects/photogrammetry-archive/web/sundial-studio.webp',
    tags: ['Photogrammetry', 'Polycam', '3D Capture'],
    tagline: 'Captured objects, studio presentations, and interactive 3D studies.',
    blurb: 'A collection of photogrammetry object studies and interactive captures, including a sundial and a dog sculpture.',
    client: 'Personal collection', duration: 'Ongoing', breakdown: [],

  },

  {slug:'unreal-environment-studies',title:'Unreal Environment Studies',role:'Environment Artist',kind:'Environment',kindShort:'ENV',tone:'forest',tags:['Unreal Engine','Cinematics','Materials'],hero:'media/projects/Golden_Rain/web/view-1.jpg',tagline:'Golden Rain & Hidden Realm — studies in atmosphere, materials, and cinematic cameras.',blurb:'Two environments exploring how lighting, materials, and camera movement shape a scene in Unreal Engine.',breakdown:[]},
  // ── VFX Demo Reel (1) ──────────────────────────────────────
  {slug:'vfx-compositing-works', title:'VFX Compositing Demo Reel', role:'VFX Compositor', kind:'VFX Reel', kindShort:'REEL', tone:'dusk', tags:['VFX','Compositing'],
    hero:'https://i.vimeocdn.com/video/2213338051-a8295a7e0a7fa1ba75fb7b2a7d02dafb353a488261673f106269e9404349fc15-d_295x166?region=us',
    tagline:'Selected compositing work from my undergraduate years.',
    blurb:'Before moving into Unreal Engine, I developed my foundation in VFX compositing during my undergraduate studies. This reel brings together selected work from that period.', breakdown:[]},
];

// ongoing / current work
const ONGOING = [
  { title: 'Ranasthala', pct: 60, status: 'Filming', note: 'Assets complete. Filming is now underway on the virtual production stage for my master’s final VFX project.' },
  { title: 'Photogrammetry assets', pct: 30, status: 'Processing', note: 'Capture is complete. The scans are now being processed into usable 3D assets.' },
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
  { group: 'Workflows',  items: ['AI Workflows · Across Production', 'Retopology', 'Texture Baking', 'AOV Passes', 'Face Tracking'] },
];

// hobbies — each has a stack of photo placeholders that reveal on hover
const HOBBIES = [
  { emoji: '📷', title: 'Photography',  note: 'Chasing light wherever it lives. Walls, water, weather — anything that holds a shadow.',
    stack: [{"image": "media/pages/about/selected/img_7757.webp", "aspect": "2268 / 4032", "cap": "Camera under the night sky"}, {"image": "media/pages/about/selected/dscf0601.webp", "aspect": "4160 / 6240", "cap": "Light through stained glass"}, {"image": "media/pages/about/selected/dscf9769.webp", "aspect": "4160 / 6240", "cap": "Stepwell geometry"}] },
  { emoji: '🥾', title: 'Trekking',     note: 'Long walks with a heavier bag than I should be carrying. Mountains for reference. Mostly.',
    stack: [{"image": "media/pages/about/selected/img_7341.webp", "aspect": "3213 / 5712", "cap": "On the waterfall trail"}, {"image": "media/pages/about/selected/img_2510.webp", "aspect": "4284 / 5712", "cap": "A pause in the mountains"}, {"image": "media/pages/about/selected/img_2606.webp", "aspect": "4032 / 2268", "cap": "Layered mountain ridges"}] },
  { emoji: '✈️', title: 'Travelling',   note: 'Trains, buses, the occasional flight. New air, new ground, new things to scan.',
    stack: [{"image": "media/pages/about/selected/img_1853.webp", "aspect": "3024 / 4032", "cap": "Exploring a new city"}, {"image": "media/pages/about/selected/img_8067.webp", "aspect": "4284 / 5712", "cap": "Inside the palace courtyard"}, {"image": "media/pages/about/selected/img_6960.webp", "aspect": "3024 / 4032", "cap": "A town in the hills"}] },
  { emoji: '🍳', title: 'Cooking',      note: 'Loud kitchens, too much garlic, and an ongoing argument with biryani.',
    stack: [{"image": "media/pages/about/selected/img_0172.webp", "aspect": "4284 / 5712", "cap": "From the kitchen"}, {"image": "media/pages/about/selected/img_5940.webp", "aspect": "4284 / 5712", "cap": "A bowl of curry"}, {"image": "media/pages/about/selected/img_5833.webp", "aspect": "4284 / 5712", "cap": "Breakfast at home"}] },
  { emoji: '📚', title: 'Reading books',note: 'Mostly Bachelard, Tanizaki, and design books with no plot. Underlined to death.',
    stack: [{"image": "media/pages/about/selected/img_9996.webp", "aspect": "4284 / 5712", "cap": "A book and a coffee"}] },
  { emoji: '🧪', title: 'Trying new stuff', note: 'Synths, ceramics, fermentation, ham radio — anything I have no business knowing yet.',
    stack: [{"image": "media/pages/about/selected/img_5503.webp", "aspect": "4284 / 5712", "cap": "Colour on the pavement"}, {"image": "media/pages/about/selected/img_9617.webp", "aspect": "4284 / 5712", "cap": "Picking up the guitar"}, {"image": "media/pages/about/selected/img_7561.webp", "aspect": "4284 / 5712", "cap": "A different kind of practice"}] },
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
  { yr: '2025 — now',  role: 'Env. Artist & Brain Operator', org: 'SCAD · XR Stage Productions', note: 'Built environments and ran the brain on two XR-stage shorts (XR01 Chinese Temple, The Parley). nDisplay, LED budgets, on-set live ops.' },
  { yr: 'Mar — May 2024', role: 'VFX Compositor (Intern)', org: 'Studio Raaga · Remote', note: 'Prep and face-tracking for a short film in Nuke. Clean mattes, organized node graphs, and a lot of node-graph etiquette I still use.' },
  { yr: 'Jan — Mar 2024', role: 'VFX Lighting Artist (Intern)', org: 'Green Gold Animation · Hyderabad', note: 'Lighting on the animated TV series Booth Bandhuk. Production-ready rigs, mood/depth/consistency, AOV pass management for compositing.' },
];

// Verified Credly badges supplied by Kiran.
const CERTIFICATES = [
  {
    "id": "8bdf1d6e-5ed6-41b0-b622-cb45b188b7c8",
    "title": "SCADamp: GET READY Badge"
  },
  {
    "id": "e0cf4c1d-b6a6-47b9-95d3-ec2e700c3564",
    "title": "SCADamp: STAND OUT Badge"
  },
  {
    "id": "84ba3738-b948-4df1-afdf-edba779079d3",
    "title": "SCADamp: STEP UP Badge"
  },
  {
    "id": "30bdbe4d-2f0e-410b-911d-1ae0590b33b1",
    "title": "SCADextra Master Class - Elevate Your Creative Horizons"
  },
  {
    "id": "b686b303-5eaf-42ab-a230-918f13e499ec",
    "title": "SCADamp: Essentials Certificate of Completion"
  },
  {
    "id": "651931ec-f9bb-401a-afa2-3377af66e033",
    "title": "SCADamp: DELIVER Badge"
  },
  {
    "id": "d5d50c87-30ae-4269-90bb-98b5dae992d7",
    "title": "SCADamp: BREAK THROUGH Badge"
  },
  {
    "id": "b9f3734e-9c2e-4789-b462-1540b1b0e747",
    "title": "SCADamp: Advanced Certificate of Completion"
  }
];

// inline gallery stills (for About page photo collection)
// To add your real photos: drop files into `media/pages/about/gallery/`, then add an `image:` path.
// Example:
//   { tone: 'forest', cap: 'forest run', tag: 'walk',
//     image: 'media/pages/about/gallery/01.jpg' },
// If `image` is missing, the gradient placeholder shows instead.
const GALLERY = [
  {
    "image": "media/pages/about/selected/dscf0601.webp",
    "aspect": "4160 / 6240",
    "cap": "Stained light"
  },
  {
    "image": "media/pages/about/selected/dscf9769.webp",
    "aspect": "4160 / 6240",
    "cap": "Stepwell geometry"
  },
  {
    "image": "media/pages/about/selected/img_2606.webp",
    "aspect": "4032 / 2268",
    "cap": "Layered mountains"
  },
  {
    "image": "media/pages/about/selected/img_8884.webp",
    "aspect": "4536 / 8064",
    "cap": "Waterfall in the mist"
  },
  {
    "image": "media/pages/about/selected/img_9009.webp",
    "aspect": "3024 / 4032",
    "cap": "Forest stream"
  }
];

// ── Case-study extras ─────────────────────────────────────
// stage   · where the project stands
// layout  · process-book arrangement (stagger | filmstrip | mosaic | column | sheet)
// process · photo sequence. Drop real files in media/process/ and add `image:`.
//           `cap` is placeholder caption copy — rewrite per photo.
// video   · final piece. Set `vimeo` (URL or id) or `src` (local mp4).
// closing · the last line on the page.
function xrMedia(name, alt, caption, width = 2400, height = 1350, portrait = false) {
  return { image: `media/projects/xr01-chinese-temple/web/${name}.webp`, alt, caption, width, height, portrait };
}

const CASE_EXTRAS = {
  'xr01-chinese-temple': {
    software: ['Unreal Engine 5', 'Gaea', 'Fab assets'],
    stage: 'Completed · class film',
    spreads: [
      { id: 'build', title: 'Environment development for the XR stage', label: '01 / Build', layout: 'build', chapters: ['terrain', 'layout'], paragraphs: [
        'My first virtual production project combined environment art with the practical demands of an XR stage.',
        'I built the mountain backdrop in Gaea and assembled Fab assets in Unreal, composing the gate, temple, and path for camera. I also explored AI-assisted asset creation.'
      ] },
      { id: 'environment', title: 'From blockout to a living environment', label: '02 / Look development', layout: 'inspect', chapters: ['look', 'breakdown'], paragraphs: [
        'Layered foliage framed the temple; wind, lighting, and atmosphere brought the environment to life.',
        'Compare gray shading, mesh, and the final image to inspect the scene.'
      ] },
      { id: 'stage', title: 'Build for what the camera sees', label: '03 / On-stage problem solving', layout: 'stage', chapters: ['adaptation'], paragraphs: [
        'Dense, wind-animated foliage proved too demanding during stage testing. The environment needed a camera-focused optimization pass.',
        'I replaced PCG foliage with manual placement in camera-visible areas and substituted selected tree meshes with image cards retaining subtle motion—reducing complexity while preserving the composition.'
      ] },
      { id: 'production', title: 'A small crew. A first film.', label: '04 / Production & reflection', layout: 'crew', chapters: ['shoot', 'learning', 'crew'], paragraphs: [
        'On set, I learned how camera framing and practical lighting shape environment decisions, alongside call sheets and crew coordination.',
        'Our small crew completed the film using the adapted environment. I gained hands-on experience balancing visual quality, real-time constraints, and production needs.'
      ] }
    ],
    statement: 'Building a world. Learning a set.',
    processIntro: 'The Gate Within was my first virtual production class film and my first experience on a film set. I knew how I wanted the environment to feel. This project taught me what it takes for that environment to work with a camera, a physical set, and a crew.',
    video: { vimeo: 'https://vimeo.com/1230103396', aspectRatio: '100 / 41.89', label: 'The Gate Within · final film', cap: 'The finished class film, captured on the virtual production stage.' },
    chapters: [
      {
        id: 'terrain', short: 'Terrain', title: 'A mountain backdrop in Gaea', wide: true,
        paragraphs: [
          'I began with terrain generation in Gaea, developing a mountain backdrop to extend the environment beyond the immediate foreground.',
          'My responsibility was the complete environment assembly and its adaptation for virtual production. I combined the terrain with selected assets from Fab, and explored AI-assisted asset creation during the project. The build brought these different sources together into one scene.'
        ],
        media: [xrMedia('gaea-wf', 'A mountain terrain preview above a node graph in Gaea.', 'Gaea workflow: shaping the mountain backdrop before bringing it into the environment.')]
      },
      {
        id: 'layout', short: 'Scene layout', title: 'Finding the scene before filling it',
        paragraphs: [
          'In Unreal, the early layout established the relationship between the steps, gate, temple, and distant terrain. The blockout images show this structure before the dense foliage became part of the scene.',
          'Working with existing assets let me spend the short build window on assembling the environment, arranging the composition, and developing its overall appearance.'
        ],
        media: [
          xrMedia('unreal-wf', 'Two Unreal Editor viewports showing the temple layout and surrounding terrain.', 'Unreal workspace: the camera composition alongside the wider environment layout.', 2400, 742),
          xrMedia('unreal-bd', 'A pale blockout of temple steps, a gate, pagoda, and mountains.', 'Early scene structure: architecture, terrain, and a character scale reference before vegetation.')
        ]
      },
      {
        id: 'look', short: 'Environment', title: 'Giving the temple its atmosphere',
        paragraphs: [
          'Trees and plants became a major part of the environment. They framed the architecture and filled the space around the path. I also added wind to the trees so the scene would have movement.',
          'These environment images capture the visual goal. The density that helped the scene feel alive would later become the main challenge when we took it onto the virtual production stage.'
        ],
        media: [
          xrMedia('unreal-bd-3', 'A dark gate and stone steps framed by trees, with a red pagoda beyond.', 'Environment view: foliage frames the route toward the temple.'),
          xrMedia('unreal-bd-4', 'The temple composition with a greener, cooler atmosphere.', 'An alternate look at the environment and its lighting.')
        ],
        video: { vimeo: 'https://vimeo.com/1230103395', label: 'Unreal environment render', cap: 'The digital environment on its own, before the live-action film.' }
      },
      {
        id: 'breakdown', short: 'Technical views', title: 'Looking beneath the finished image',
        paragraphs: [
          'The Unreal breakdowns document more than the final appearance. They include diagnostic visualizations and neutral surface views that expose different aspects of the scene.',
          'Together, they make the amount of vegetation around the architecture easier to see. These are records of the environment build; they are not a measured before-and-after performance comparison.'
        ],
        media: [
          xrMedia('unreal-bd-5', 'A grid of Unreal render-buffer views surrounding the finished temple image.', 'Buffer-style overview: several surface and scene channels shown beside the finished image.'),
          xrMedia('unreal-bd-6', 'Colored geometry diagnostic views surrounding a lit environment render.', 'Geometry visualization montage: different diagnostic views of the same composition.'),
          xrMedia('unreal-bd-7', 'The temple environment with diagnostic overlays in the upper-left corner.', 'Scene inspection: diagnostic overlays alongside the lit environment.'),
          xrMedia('unreal-bd-8', 'The temple and foliage shown with neutral surface shading and warm light.', 'Neutral surface view: the forms and lighting read without the final material colors.'),
          xrMedia('unreal-bd-9', 'A second neutral-shaded view of the temple and surrounding trees.', 'A second neutral view of the architecture and vegetation.')
        ]
      },
      {
        id: 'adaptation', short: 'Stage adaptation', title: 'Rebuilding around what the camera could see',
        paragraphs: [
          'On the XR stage, the original foliage setup was too demanding. The scene contained a large number of trees and plants, and the added wind made that setup harder to run for virtual production.',
          'I removed the original foliage arrangement and rebuilt it on stage. Instead of relying on PCG, I manually placed plants where the camera would see them. For some trees, I replaced full meshes with lightweight plane cards carrying tree images and a small amount of motion.',
          'That change let us achieve the scene for the shoot. It was my first practical lesson in building for the actual camera view: keeping the visual contribution of the vegetation while simplifying what the stage had to render.'
        ],
        media: [
          xrMedia('xr-screen-03', 'A workstation monitor showing Unreal and virtual production diagnostic windows.', 'The stage workstation during setup. This photo documents the working environment, rather than a performance benchmark.'),
          xrMedia('xr-screen-02', 'Physical tree props and a platform in front of the temple displayed on the LED wall.', 'The environment on the LED wall, seen with the physical foreground set.')
        ]
      },
      {
        id: 'shoot', short: 'The shoot', title: 'The environment becomes a film set',
        paragraphs: [
          'Once the environment was on the wall, it became one part of a much larger process. Physical lighting, camera framing, performers, and the foreground set all had to work together.',
          'This was my first time on a film set. I learned about cameras, real lighting, call sheets, and the coordination behind a shoot by working alongside the crew. The photographs below show the environment in that shared production context.'
        ],
        media: [
          xrMedia('xr-screen-01', 'A cinema camera aimed toward a performer and the temple on the LED wall.', 'Camera, physical foreground, and digital backdrop in the same setup.'),
          xrMedia('xr-shoot-01', 'Two performers being staged in front of the virtual environment.', 'Preparing the performers in front of the XR backdrop.', 2400, 1800),
          xrMedia('xr-shoot-02', 'A camera operator, boom microphone, and performer on the lit stage.', 'The crew working with the camera, lighting, and sound around the scene.'),
          { video: 'media/projects/xr01-chinese-temple/web/on-set.mp4', poster: 'media/projects/xr01-chinese-temple/web/on-set-poster.webp', alt: 'Behind-the-scenes clip from the XR shoot', caption: 'A short behind-the-scenes clip from the shoot. Web preview without audio.' }
        ]
      },
      {
        id: 'learning', short: 'What I learned', title: 'My first experience inside the production',
        paragraphs: [
          'I arrived at this project as an environment artist, with no previous experience of a working film set. Adapting the scene on stage taught me to make technical decisions in the context of the shot and the needs of the crew.',
          'The biggest lesson was flexibility. The first build gave us the visual direction, but making the film required changes under real production conditions. I left with a better understanding of both virtual production and the filmmaking around it.'
        ],
        media: [
          xrMedia('xr-and-me-2', 'Kiran at the workstation beside the virtual production stage.', 'At the stage workstation during production.', 1800, 2400, true),
          xrMedia('xr-and-me', 'Kiran on the film set beside lighting and sound equipment.', 'A first film-set experience, beyond the Unreal viewport.', 1800, 2400, true)
        ]
      },
      {
        id: 'crew', short: 'The crew', title: 'A small crew, a finished film', wide: true,
        paragraphs: [
          'We were a small crew working within a short timeframe, and we brought the project through to a completed film. My contribution was the environment and its stage adaptation; the final piece came from everyone working together.',
          'The Gate Within developed my experience in environment assembly, foliage optimization, and adapting digital work to a live production setting.'
        ],
        media: [xrMedia('crew-pic', 'The cast and crew together in front of the temple on the LED wall.', 'The cast and crew of The Gate Within on the virtual production stage.')]
      }
    ],
    closing: 'Balancing environment design, real-time performance, and the requirements of the shot.',
  },
  'xr02-1920s-nyc': {
    software: ['Unreal Engine','Blender','Gemini','Claude','Sony mocopi','XYN'],
    stage: 'Student film · virtual production',
    layout: 'nyc',
    video: { vimeo: '1233905426', src: '', cap: 'The Parley · final film' },
    films: [
      {label:'Final film',vimeo:'1233905426',aspectRatio:'16 / 9',cap:'The Parley · final film'},
      {label:'Unreal render',src:'media/projects/xr02-1920s-nyc/web/parley-unreal-borderless.mp4',poster:'media/projects/xr02-1920s-nyc/web/parley-unreal-borderless.webp',cap:'The digital street / Unreal environment render'},
      {label:'Behind the scenes',src:'media/projects/xr02-1920s-nyc/web/xr02-bts-30s-mocopi-xyn.mp4',poster:'media/projects/xr02-1920s-nyc/web/xr02-bts-poster.jpg',cap:'Sony mocopi capture, crew, and the XR stage / 30 seconds'}
    ],
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
