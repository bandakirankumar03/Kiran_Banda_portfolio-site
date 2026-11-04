const PORTRAIT_STUDIES=[
 ['Type & portrait','Closest to the reference: your portrait layered over a large name.'],
 ['Architectural arch','A soft architectural silhouette, with the portrait stepping beyond it.'],
 ['Editorial split','A quieter composition with the story and portrait side by side.'],
 ['The vertical poster','A tall, graphic composition inspired by a film one-sheet.'],
 ['Quiet studio','A minimal studio portrait with open space and a restrained sage backdrop.']
];
function PortraitPreviewPage({aiPreview=false}={}){return <div className="about-portrait-selected portrait-refined" data-backdrop="1"><PortraitStudies/><AboutPractice portraitMotion aiPreview={aiPreview}/><HobbiesSection/><PhotoCollection/><FilmPreview/><Footer/></div>}
function PortraitStudies(){
 const design=0;
 const [open,setOpen]=React.useState(false),[ready,setReady]=React.useState(false);
 const stage=React.useRef(null),portrait=React.useRef(null);
 React.useEffect(()=>{
   const image=portrait.current;let cancelled=false;
   const reveal=()=>{const decoded=image.decode?image.decode():Promise.resolve();decoded.catch(()=>{}).then(()=>{if(!cancelled)setReady(true)})};
   if(image.complete&&image.naturalWidth)reveal();else image.addEventListener('load',reveal,{once:true});
   return()=>{cancelled=true;image.removeEventListener('load',reveal)};
 },[]);
 React.useLayoutEffect(()=>{
   const el=stage.current;if(!el)return;
   const reduced=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
   let raf=0,pointer=null;const previous={};
   const write=(name,value)=>{if(previous[name]!==value){el.style.setProperty(name,value);previous[name]=value}};
   const update=()=>{
     raf=0;const r=el.getBoundingClientRect();
     const scroll=reduced.matches?0:Math.max(0,Math.min(1,-r.top/(r.height*.9)));
     const canMove=pointer&&fine.matches&&!reduced.matches&&r.bottom>0&&r.top<innerHeight;
     write('--portrait-scroll',scroll.toFixed(4));
     write('--px',(canMove?Math.max(-6,Math.min(6,((pointer.x-r.left)/r.width-.5)*12)):0).toFixed(2)+'px');
     write('--py',(canMove?Math.max(-4,Math.min(4,((pointer.y-r.top)/r.height-.5)*8)):0).toFixed(2)+'px');
   };
   const tick=()=>{if(!raf)raf=requestAnimationFrame(update)};
   const move=e=>{if(e.pointerType==='mouse'&&fine.matches&&!reduced.matches){pointer={x:e.clientX,y:e.clientY};tick()}};
   const leave=()=>{pointer=null;tick()};
   el.addEventListener('pointermove',move,{passive:true});el.addEventListener('pointerleave',leave);
   window.addEventListener('scroll',tick,{passive:true});window.addEventListener('resize',tick);window.addEventListener('blur',leave);
   reduced.addEventListener('change',leave);fine.addEventListener('change',leave);update();
   return()=>{cancelAnimationFrame(raf);el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);window.removeEventListener('scroll',tick);window.removeEventListener('resize',tick);window.removeEventListener('blur',leave);reduced.removeEventListener('change',leave);fine.removeEventListener('change',leave)};
 },[]);
 return <section className="portrait-studies" data-portrait-study={design}>

 <div ref={stage} className="portrait-scene" key={design} data-portrait-ready={ready}>
  <div className="portrait-backplate" aria-hidden="true"/><div className="portrait-backtype" aria-hidden="true">{design===4?'KIRAN':design===3?'BANDA':'KIRAN'}</div>
  <div className="portrait-scene-copy"><p className="portrait-greeting">Hi, I’m</p><h1>Kiran <em>Banda.</em></h1><PortraitRoles/></div>
  <button type="button" className="portrait-person" onClick={()=>setOpen(true)} aria-label="Open original portrait of Kiran Banda"><img ref={portrait} src="media/pages/about/portrait-cutout.webp" srcSet="media/pages/about/portrait-cutout-mobile.webp 600w, media/pages/about/portrait-cutout.webp 1090w" sizes="(max-width:760px) 90vw, (max-width:1600px) 47vw, 752px" alt="Kiran Banda in a black blazer, arms folded" width="1090" height="1443" decoding="async" fetchpriority="high" loading="eager"/></button>
  <div className="portrait-side-note"><span>Light. Atmosphere. Story.</span><p>Real places.<br/><em>Imagined worlds.</em></p><a href="#/work">Explore my work ↗</a></div>
 </div>

 {open&&<PolaroidLightbox photos={[{image:'media/pages/about/portrait.jpg',cap:'Kiran Banda'}]} idx={0} close={()=>setOpen(false)}/>}
 </section>
}

function PortraitRoles(){
 const [index,setIndex]=React.useState(0);const [reduced,setReduced]=React.useState(()=>matchMedia('(prefers-reduced-motion:reduce)').matches);
 React.useEffect(()=>{const mq=matchMedia('(prefers-reduced-motion:reduce)');const changed=()=>setReduced(mq.matches);mq.addEventListener('change',changed);return()=>mq.removeEventListener('change',changed)},[]);
 React.useEffect(()=>{if(reduced)return;const timer=setInterval(()=>{if(!document.hidden)setIndex(v=>(v+1)%ROLES.length)},3400);return()=>clearInterval(timer)},[reduced]);
 return <div className="portrait-roles" aria-label={'My creative practice: '+ROLES.join(', ')}>{reduced?<p className="portrait-roles-static">{ROLES.join(' · ')}</p>:ROLES.map((role,i)=><span className={'portrait-role-word'+(i===index?' is-current':'')} key={role} aria-hidden="true">{role}</span>)}</div>
}
