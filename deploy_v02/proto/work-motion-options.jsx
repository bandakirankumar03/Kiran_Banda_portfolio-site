const WORK_MOTION_STUDIES=[
 ['Floating glass','A softly lit bar glides between generously spaced titles.'],
 ['Soft lens','The active title comes into focus as its neighbors soften.'],
 ['Gallery lift','The chosen project lifts forward with a little depth.'],
 ['Slide & settle','Titles and images sweep into place, then settle gently.'],
 ['Cinematic focus','A wider, bolder title and a quiet aperture reveal.']
];
function WorkMotionOptionsPage(){
 const [motion,setMotion]=React.useState(()=>Math.max(1,Math.min(5,Number(new URLSearchParams(location.search).get('motion'))||1)));
 const choose=n=>{setMotion(n);history.replaceState(null,'','?motion='+n+'#/work')};
 return <div className="work-page work-selected work-motion-options">
  <section className="motion-chooser" aria-label="Gallery animation previews"><div className="motion-chooser-heading"><span>Five motion studies</span><span>Local preview</span></div>
   <nav aria-label="Animation variations">{WORK_MOTION_STUDIES.map(([title],i)=><button key={title} type="button" aria-pressed={motion===i+1} onClick={()=>choose(i+1)}><small>{String(i+1).padStart(2,'0')}</small>{title}</button>)}</nav>
  </section>
  <header className="ws-header"><h1>The <em>shot list.</em></h1><p className="motion-description" key={motion}>{WORK_MOTION_STUDIES[motion-1][1]}</p></header>
  <main className="ws-content"><WorkFocusGallery list={PROJECTS} motion={String(motion)} initialIndex={2}/></main><Footer/>
 </div>
}
