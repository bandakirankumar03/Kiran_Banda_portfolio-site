const STYLE_NAME_LAYOUTS=[
 ['Lower left','Your original serif name sits below the large background lettering.'],
 ['Lower right','The original name treatment moves to the opposite side of your portrait.'],
 ['Below portrait','Both names share a center line, with your full name beneath the image.'],
 ['Inset left','A deeper inset and an offset portrait give the introduction its own space.'],
 ['Upper left','Your introduction sits high; the large background name moves down.'],
 ['Right column','Your full name has a separate column beside the portrait.']
];
const PORTFOLIO_PALETTES=[
 {name:'Obsidian & Sage',bg:'#101512',ink:'#E9EEE7',accent:'#B8C9A0',note:'Closest to your current palette',contrast:'15.68'},
 {name:'Olive & Limestone',bg:'#151810',ink:'#F1EDE2',accent:'#C2C89B',note:'Warm, natural, restrained',contrast:'15.34'},
 {name:'Pine & Champagne',bg:'#0C1715',ink:'#F2EDE2',accent:'#D1BC91',note:'Deep green with a quiet golden accent',contrast:'15.65'},
 {name:'Basalt & Bronze',bg:'#151515',ink:'#F0ECE5',accent:'#D3AC86',note:'Neutral backdrop, warm architectural detail',contrast:'15.51'},
 {name:'Midnight & Mist',bg:'#10171D',ink:'#E8EDF0',accent:'#A5C5D0',note:'Cool and cinematic',contrast:'15.32'},
 {name:'Deep Teal & Sand',bg:'#0D1B1B',ink:'#EEEDE4',accent:'#9CC7BA',note:'Calm, soft, and atmospheric',contrast:'15.02'}
];
function StyleNamePreview(){
 const params=new URLSearchParams(location.search);
 const [layout,setLayout]=React.useState(()=>Math.max(0,Math.min(5,(Number(params.get('layout'))||1)-1)));
 const [palette,setPalette]=React.useState(()=>Math.max(0,Math.min(5,(Number(params.get('palette'))||2)-1)));
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
   <div className="study-control-heading"><span>Three colors. Six palettes.</span><span>Local preview</span></div>
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
