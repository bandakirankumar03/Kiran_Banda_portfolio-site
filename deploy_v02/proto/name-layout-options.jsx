const NAME_LAYOUTS=[
 ['Signature below','The large name stays behind your portrait; your full name sits beneath it.'],
 ['Quiet introduction','A smaller full name reads like a signature, with the large KIRAN as the visual headline.'],
 ['Vertical signature','Your full name sits along the edge, separate from the name behind your portrait.'],
 ['Soft outline','A faint outlined KIRAN sits lower behind the portrait, away from your introduction.']
];
function NameLayoutPreview(){
 const [layout,setLayout]=React.useState(()=>Math.max(0,Math.min(3,(Number(new URLSearchParams(location.search).get('layout'))||1)-1)));
 const [open,setOpen]=React.useState(false);const stage=React.useRef(null);
 React.useLayoutEffect(()=>{const el=stage.current;if(!el)return;let raf=0;const update=()=>{raf=0;if(!el.isConnected)return;const r=el.getBoundingClientRect();el.style.setProperty('--portrait-scroll',matchMedia('(prefers-reduced-motion:reduce)').matches?0:Math.max(0,Math.min(1,-r.top/(r.height*.9))));};const tick=()=>{if(!raf)raf=requestAnimationFrame(update)};window.addEventListener('scroll',tick,{passive:true});update();return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',tick)}},[layout]);
 const move=e=>{if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--px',((e.clientX-r.left)/r.width-.5)*14+'px');e.currentTarget.style.setProperty('--py',((e.clientY-r.top)/r.height-.5)*10+'px')};
 const choose=i=>{setLayout(i);history.replaceState(null,'','?layout='+(i+1)+'#/about')};
 return <div className="about-portrait-selected name-layout-preview" data-name-layout={layout}>
  <div className="name-layout-options"><nav aria-label="Portrait name arrangements">{NAME_LAYOUTS.map((item,i)=><button key={item[0]} type="button" aria-pressed={layout===i} onClick={()=>choose(i)}><span>{String(i+1).padStart(2,'0')}</span>{item[0]}</button>)}</nav><p>{NAME_LAYOUTS[layout][1]}</p></div>
  <section className="portrait-studies" data-portrait-study="0"><div ref={stage} className="portrait-scene" key={layout} onPointerMove={move} onPointerLeave={e=>{e.currentTarget.style.setProperty('--px','0px');e.currentTarget.style.setProperty('--py','0px')}}>
   <div className="portrait-backplate" aria-hidden="true"/><div className="portrait-backtype" aria-hidden="true">KIRAN</div>
   <div className="name-id"><span className="name-greeting">Hi, I’m</span><h1>Kiran <em>Banda.</em></h1></div>
   <div className="name-role"><PortraitRoles/></div>
   <button type="button" className="portrait-person" onClick={()=>setOpen(true)} aria-label="Open original portrait of Kiran Banda"><img src="media/pages/about/portrait-cutout-preview.png" alt="Kiran Banda in a black blazer, arms folded" width="1088" height="1440"/></button>
   <div className="portrait-side-note"><span>Light. Atmosphere. Story.</span><p>Real places.<br/>Imagined worlds.</p><a href="#/work">Explore my work ↗</a></div>
  </div></section>
  <AboutPractice portraitMotion/><HobbiesSection/><PhotoCollection/><FilmPreview/><Footer/>
  {open&&<PolaroidLightbox photos={[{image:'media/pages/about/portrait.jpg',cap:'Kiran Banda'}]} idx={0} close={()=>setOpen(false)}/>}
 </div>
}
