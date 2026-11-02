const PORTRAIT_STUDIES=[
 ['Type & portrait','Closest to the reference: your portrait layered over a large name.'],
 ['Architectural arch','A soft architectural silhouette, with the portrait stepping beyond it.'],
 ['Editorial split','A quieter composition with the story and portrait side by side.'],
 ['The vertical poster','A tall, graphic composition inspired by a film one-sheet.'],
 ['Quiet studio','A minimal studio portrait with open space and a restrained sage backdrop.']
];
function PortraitPreviewPage(){return <div className="about-portrait-selected portrait-refined" data-backdrop="1"><PortraitStudies/><AboutPractice portraitMotion/><HobbiesSection/><PhotoCollection/><FilmPreview/><Footer/></div>}
function PortraitStudies(){
 const design=0;
 const [open,setOpen]=React.useState(false);const stage=React.useRef(null);
 React.useLayoutEffect(()=>{const el=stage.current;if(!el)return;const reduced=matchMedia('(prefers-reduced-motion:reduce)');let raf=0;const update=()=>{raf=0;const r=el.getBoundingClientRect();const p=reduced.matches?0:Math.max(0,Math.min(1,-r.top/(r.height*.9)));el.style.setProperty('--portrait-scroll',p);};const tick=()=>{if(!raf)raf=requestAnimationFrame(update)};window.addEventListener('scroll',tick,{passive:true});update();return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',tick)}},[design]);
 const move=e=>{if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--px',((e.clientX-r.left)/r.width-.5)*14+'px');e.currentTarget.style.setProperty('--py',((e.clientY-r.top)/r.height-.5)*10+'px')};
 return <section className="portrait-studies" data-portrait-study={design}>

 <div ref={stage} className="portrait-scene" key={design} onPointerMove={move} onPointerLeave={e=>{e.currentTarget.style.setProperty('--px','0px');e.currentTarget.style.setProperty('--py','0px')}}>
  <div className="portrait-backplate" aria-hidden="true"/><div className="portrait-backtype" aria-hidden="true">{design===4?'KIRAN':design===3?'BANDA':'KIRAN'}</div>
  <div className="portrait-scene-copy"><p className="portrait-greeting">Hi, I’m</p><h1>Kiran <em>Banda.</em></h1><PortraitRoles/></div>
  <button type="button" className="portrait-person" onClick={()=>setOpen(true)} aria-label="Open original portrait of Kiran Banda"><img src="media/pages/about/portrait-cutout-preview.png" alt="Kiran Banda in a black blazer, arms folded" width="1088" height="1440"/></button>
  <div className="portrait-side-note"><span>Light. Atmosphere. Story.</span><p>Real places.<br/><em>Imagined worlds.</em></p><a href="#/work">Explore my work ↗</a></div>
 </div>

 {open&&<PolaroidLightbox photos={[{image:'media/pages/about/portrait.jpg',cap:'Kiran Banda'}]} idx={0} close={()=>setOpen(false)}/>}
 </section>
}

function PortraitRoles(){
 const [index,setIndex]=React.useState(0);const [reduced,setReduced]=React.useState(()=>matchMedia('(prefers-reduced-motion:reduce)').matches);
 React.useEffect(()=>{const mq=matchMedia('(prefers-reduced-motion:reduce)');const changed=()=>setReduced(mq.matches);mq.addEventListener('change',changed);return()=>mq.removeEventListener('change',changed)},[]);
 React.useEffect(()=>{if(reduced)return;const timer=setInterval(()=>{if(!document.hidden)setIndex(v=>(v+1)%ROLES.length)},3400);return()=>clearInterval(timer)},[reduced]);
 return <div className="portrait-roles" aria-label={'My creative practice: '+ROLES.join(', ')}>{reduced?<p className="portrait-roles-static">{ROLES.join(' · ')}</p>:<span className="portrait-role-word" key={index} aria-hidden="true">{ROLES[index]}</span>}</div>
}
