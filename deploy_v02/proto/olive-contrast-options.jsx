const STYLE_NAME_LAYOUTS=[
 ['Lower left','Your original serif name sits below the large background lettering.'],
 ['Lower right','The original name treatment moves to the opposite side of your portrait.'],
 ['Below portrait','Both names share a center line, with your full name beneath the image.'],
 ['Inset left','A deeper inset and an offset portrait give the introduction its own space.'],
 ['Upper left','Your introduction sits high; the large background name moves down.'],
 ['Right column','Your full name has a separate column beside the portrait.']
];
const PORTFOLIO_PALETTES=[
 {
  "name": "Olive & Citron",
  "bg": "#151810",
  "ink": "#F1EDE2",
  "accent": "#D8ED57",
  "note": "Sharp, graphic, contemporary",
  "contrast": "15.34",
  "accentContrast": 13.82
 },
 {
  "name": "Olive & Amber",
  "bg": "#151810",
  "ink": "#F1EDE2",
  "accent": "#F0B35A",
  "note": "Warm, confident, cinematic",
  "contrast": "15.34",
  "accentContrast": 9.66
 },
 {
  "name": "Olive & Glacier",
  "bg": "#151810",
  "ink": "#F1EDE2",
  "accent": "#82DAD5",
  "note": "Cool contrast against warm olive",
  "contrast": "15.34",
  "accentContrast": 11.06
 },
 {
  "name": "Olive & Electric Blue",
  "bg": "#151810",
  "ink": "#F1EDE2",
  "accent": "#6BA9FF",
  "note": "Crisp, bold, studio-like",
  "contrast": "15.34",
  "accentContrast": 7.47
 },
 {
  "name": "Olive & Antique Gold",
  "bg": "#151810",
  "ink": "#F1EDE2",
  "accent": "#D9C275",
  "note": "Elegant, restrained, architectural",
  "contrast": "15.34",
  "accentContrast": 10.19
 },
 {
  "name": "Olive & Copper",
  "bg": "#151810",
  "ink": "#F1EDE2",
  "accent": "#E7A078",
  "note": "Earthy warmth with stronger presence",
  "contrast": "15.34",
  "accentContrast": 8.29
 }
];

function StyleNamePreview(){
 const params=new URLSearchParams(location.search);
 const [layout,setLayout]=React.useState(()=>Math.max(0,Math.min(5,(Number(params.get('layout'))||1)-1)));
 const [palette,setPalette]=React.useState(()=>Math.max(0,Math.min(5,(Number(params.get('palette'))||1)-1)));
 const [open,setOpen]=React.useState(false);const stage=React.useRef(null);
 React.useLayoutEffect(()=>{
  const p=PORTFOLIO_PALETTES[palette],root=document.documentElement;
  const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)).join(',');
  const vars={'--bg':p.bg,'--ink':p.ink,'--accent':p.accent,'--lab-ink':p.ink,'--lab-primary':p.accent,'--lab-accent':p.accent,'--lab-cover-primary':p.accent,'--champagne':p.accent,'--accent-rgb':rgb(p.accent),'--dim':`rgba(${rgb(p.ink)},.76)`,'--dimmer':`rgba(${rgb(p.ink)},.6)`,'--lab-muted':`rgba(${rgb(p.ink)},.76)`,'--hair':`rgba(${rgb(p.ink)},.2)`,'--online':p.accent,'--online-glow':`rgba(${rgb(p.accent)},.45)`};
  Object.entries(vars).forEach(([k,v])=>root.style.setProperty(k,v,'important'));root.dataset.paletteStudy=palette;
 },[palette]);
 React.useLayoutEffect(()=>{const el=stage.current;if(!el)return;let raf=0;const update=()=>{raf=0;if(!el.isConnected)return;const r=el.getBoundingClientRect();el.style.setProperty('--portrait-scroll',matchMedia('(prefers-reduced-motion:reduce)').matches?0:Math.max(0,Math.min(1,-r.top/(r.height*.9))));};const tick=()=>{if(!raf)raf=requestAnimationFrame(update)};window.addEventListener('scroll',tick,{passive:true});update();return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',tick)}},[]);
 const move=e=>{if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--px',((e.clientX-r.left)/r.width-.5)*14+'px');e.currentTarget.style.setProperty('--py',((e.clientY-r.top)/r.height-.5)*10+'px')};
 const choose=(l,p)=>{setLayout(l);setPalette(p);history.replaceState(null,'',`?layout=${l+1}&palette=${p+1}#/about`)};
 const chosen=PORTFOLIO_PALETTES[palette];
 return <div className="about-portrait-selected style-name-preview" data-study-layout={layout}>
  <div className="style-study-controls">
   <div className="study-control-heading"><span>Olive, with contrast. Six palettes.</span><span>Local preview</span></div>
   <nav className="palette-options" aria-label="Three-color palettes">{PORTFOLIO_PALETTES.map((p,i)=><button type="button" key={p.name} aria-pressed={palette===i} onClick={()=>choose(layout,i)}><span className="palette-swatches" aria-hidden="true">{[p.bg,p.ink,p.accent].map(c=><i key={c} style={{background:c}}/>)}</span><strong>{String(i+1).padStart(2,'0')} · {p.name}</strong><small>{p.note}</small></button>)}</nav>
   <div className="palette-details"><span>Background <b>{chosen.bg}</b></span><span>Text <b>{chosen.ink}</b></span><span>Accent <b>{chosen.accent}</b></span><span>Text contrast {chosen.contrast}:1</span></div>
   <div className="study-control-heading name-placement-label"><span>Your original serif name. Six placements.</span></div>
   <nav className="placement-options" aria-label="Serif name placements">{STYLE_NAME_LAYOUTS.map((item,i)=><button key={item[0]} type="button" aria-pressed={layout===i} onClick={()=>choose(i,palette)}><span>{String(i+1).padStart(2,'0')}</span>{item[0]}</button>)}</nav>
   <p className="placement-note">{STYLE_NAME_LAYOUTS[layout][1]}</p>
  </div>
  <section className="portrait-studies" data-portrait-study="0"><div ref={stage} className="portrait-scene" onPointerMove={move} onPointerLeave={e=>{e.currentTarget.style.setProperty('--px','0px');e.currentTarget.style.setProperty('--py','0px')}}>
   <div className="portrait-backplate" aria-hidden="true"/><div className="portrait-backtype" aria-hidden="true">KIRAN</div>
   <div className="serif-name"><span className="serif-greeting">Hi, I’m</span><h1>Kiran <em>Banda.</em></h1></div>
   <div className="serif-role"><PortraitRoles/></div>
   <button type="button" className="portrait-person" onClick={()=>setOpen(true)} aria-label="Open original portrait of Kiran Banda"><img src="media/pages/about/portrait-cutout-preview.png" alt="Kiran Banda in a black blazer, arms folded" width="1088" height="1440"/></button>
   <div className="portrait-side-note"><span>Light. Atmosphere. Story.</span><p>Real places.<br/>Imagined worlds.</p><a href="#/work">Explore my work ↗</a></div>
  </div></section>
  <AboutPractice portraitMotion/><HobbiesSection/><PhotoCollection/><FilmPreview/><Footer/>
  {open&&<PolaroidLightbox photos={[{image:'media/pages/about/portrait.jpg',cap:'Kiran Banda'}]} idx={0} close={()=>setOpen(false)}/>}
 </div>
}
