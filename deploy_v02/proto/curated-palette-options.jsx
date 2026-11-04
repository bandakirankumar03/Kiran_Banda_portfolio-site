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
  "name": "Forest Black & Gold",
  "bg": "#090D0B",
  "ink": "#F4F0E5",
  "accent": "#E2BC62",
  "note": "Black with a barely visible forest tint",
  "light": false,
  "contrast": "17.17",
  "accentContrast": 10.8
 },
 {
  "name": "Smoked Black & Pear",
  "bg": "#0D0B0F",
  "ink": "#F2EEE5",
  "accent": "#D5DF8B",
  "note": "Smoky black, soft ivory, restrained pear",
  "light": false,
  "contrast": "16.92",
  "accentContrast": 13.77
 },
 {
  "name": "Warm Black & Sand",
  "bg": "#100C0C",
  "ink": "#F1E9DC",
  "accent": "#DAB998",
  "note": "Warm black with a pale sandstone detail",
  "light": false,
  "contrast": "16.14",
  "accentContrast": 10.53
 },
 {
  "name": "Carbon Black & Coral",
  "bg": "#0C0C0B",
  "ink": "#F4F0E7",
  "accent": "#F49072",
  "note": "Neutral black with a warm coral highlight",
  "light": false,
  "contrast": "17.21",
  "accentContrast": 8.46
 },
 {
  "name": "Obsidian & Sage",
  "bg": "#080A09",
  "ink": "#F2EDE3",
  "accent": "#C2CCA7",
  "note": "Deep black, warm white, muted sage",
  "light": false,
  "contrast": "17.02",
  "accentContrast": 11.81
 },
 {
  "name": "Midnight Black & Ice",
  "bg": "#090C0F",
  "ink": "#EEECE5",
  "accent": "#A1D0DE",
  "note": "Near-black with a subtle cool undertone",
  "light": false,
  "contrast": "16.59",
  "accentContrast": 11.76
 }
];

function applyPortfolioPalette(palette){
  const p=PORTFOLIO_PALETTES[palette],root=document.documentElement;
  const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)).join(',');
  const vars={'--bg':p.bg,'--ink':p.ink,'--accent':p.accent,'--lab-ink':p.ink,'--lab-primary':p.accent,'--lab-accent':p.accent,'--lab-cover-primary':p.accent,'--champagne':p.accent,'--accent-rgb':rgb(p.accent),'--dim':`rgba(${rgb(p.ink)},.76)`,'--dimmer':`rgba(${rgb(p.ink)},.6)`,'--lab-muted':`rgba(${rgb(p.ink)},.76)`,'--hair':`rgba(${rgb(p.ink)},.2)`,'--online':p.accent,'--online-glow':`rgba(${rgb(p.accent)},.45)`};
  Object.entries(vars).forEach(([k,v])=>root.style.setProperty(k,v,'important'));root.dataset.paletteStudy=palette;root.dataset.paletteTone=p.light?'light':'dark';

}
function PaletteStudyTheme(){React.useLayoutEffect(()=>applyPortfolioPalette(0),[]);return null}

function StyleNamePreview(){
 const params=new URLSearchParams(location.search);
 const [backdrop,setBackdrop]=React.useState(()=>Math.max(0,Math.min(3,(Number(params.get('backdrop'))||2)-1)));
 const layout=0;
 const palette=0;
 const [open,setOpen]=React.useState(false);const stage=React.useRef(null);
 React.useLayoutEffect(()=>applyPortfolioPalette(palette),[palette]);
 React.useLayoutEffect(()=>{const el=stage.current;if(!el)return;let raf=0;const update=()=>{raf=0;if(!el.isConnected)return;const r=el.getBoundingClientRect();el.style.setProperty('--portrait-scroll',matchMedia('(prefers-reduced-motion:reduce)').matches?0:Math.max(0,Math.min(1,-r.top/(r.height*.9))));};const tick=()=>{if(!raf)raf=requestAnimationFrame(update)};window.addEventListener('scroll',tick,{passive:true});update();return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',tick)}},[]);
 const move=e=>{if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--px',((e.clientX-r.left)/r.width-.5)*14+'px');e.currentTarget.style.setProperty('--py',((e.clientY-r.top)/r.height-.5)*10+'px')};
 const chooseBackdrop=i=>{setBackdrop(i);history.replaceState(null,'',`?layout=1&palette=1&backdrop=${i+1}#/about`)};
 const chosen=PORTFOLIO_PALETTES[palette];
 return <div className="about-portrait-selected portrait-refined style-name-preview" data-study-layout={layout} data-backdrop={backdrop}>
  <div className="portrait-finish-controls">
   <div className="finish-selected"><span>Forest Black & Gold · Lower left</span><span>Portrait backdrop preview</span></div>
   <nav aria-label="Portrait backdrop options">{[
    ['Open portrait','No backdrop. Just your portrait and the softer name.'],
    ['Soft halo','A gentle gold haze with feathered edges.'],
    ['Light sweep','A soft diagonal wash of light, without a frame.'],
    ['Organic glow','A subtle curved silhouette that moves with the portrait.']
   ].map(([name,note],i)=><button key={name} type="button" aria-pressed={backdrop===i} onClick={()=>chooseBackdrop(i)}><strong>{name}</strong><small>{note}</small></button>)}</nav>
  </div>
  <section className="portrait-studies" data-portrait-study="0"><div ref={stage} className="portrait-scene" onPointerMove={move} onPointerLeave={e=>{e.currentTarget.style.setProperty('--px','0px');e.currentTarget.style.setProperty('--py','0px')}}>
   <div className="portrait-backplate" aria-hidden="true"/><div className="portrait-backtype" aria-hidden="true">KIRAN</div>
   <div className="serif-name"><span className="serif-greeting">Hi, I’m</span><h1>Kiran <em>Banda.</em></h1></div>
   <div className="serif-role"><PortraitRoles/></div>
   <button type="button" className="portrait-person" onClick={()=>setOpen(true)} aria-label="Open original portrait of Kiran Banda"><img src="media/pages/about/portrait-cutout-preview.png" alt="Kiran Banda in a black blazer, arms folded" width="1088" height="1440"/></button>
   <div className="portrait-side-note"><span>Light. Atmosphere. Story.</span><p>Real places.<br/><em>Imagined worlds.</em></p><a href="#/work">Explore my work ↗</a></div>
  </div></section>
  <AboutPractice portraitMotion/><HobbiesSection/><PhotoCollection/><FilmPreview/><Footer/>
  {open&&<PolaroidLightbox photos={[{image:'media/pages/about/portrait.jpg',cap:'Kiran Banda'}]} idx={0} close={()=>setOpen(false)}/>}
 </div>
}
