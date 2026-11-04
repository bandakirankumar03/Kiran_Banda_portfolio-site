const LENS_STUDIES=[
 {name:'Open Lenses',note:'The spacious original, refined. Individual panels widen with an unhurried, soft reveal.'},
 {name:'Panoramic Strip',note:'One continuous frame. The selected panel opens across the strip while the others stay close.'},
 {name:'Layered Depth',note:'Overlapping surfaces. The selected lens lifts forward while its neighbours settle behind it.'},
 {name:'Vertical Aperture',note:'A quieter vertical version. Each row opens downward without losing the surrounding context.'},
 {name:'Split Focus',note:'A wider editorial lens. The title and its details reveal in opposite directions inside the selected panel.'}
];

function LensOptionsPage(){
 const [version,setVersion]=React.useState(()=>Math.max(1,Math.min(5,Number(new URLSearchParams(location.search).get('lens'))||1))),root=React.useRef(null);
 React.useLayoutEffect(()=>{
  const page=root.current,reduced=matchMedia('(prefers-reduced-motion:reduce)');let frame=0;
  const update=()=>{frame=0;page.querySelectorAll('[data-lens-reveal]').forEach(el=>{const r=el.getBoundingClientRect(),t=reduced.matches?1:Math.max(0,Math.min(1,(innerHeight*.97-r.top)/(innerHeight*.29)));el.style.setProperty('--lens-arrival',1-t*t*(3-2*t))})};
  const tick=()=>{if(!frame)frame=requestAnimationFrame(update)};window.addEventListener('scroll',tick,{passive:true});window.addEventListener('resize',tick);reduced.addEventListener('change',tick);update();return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',tick);window.removeEventListener('resize',tick);reduced.removeEventListener('change',tick)};
 },[version]);
 const choose=n=>{setVersion(n);const u=new URL(location.href);u.searchParams.set('lens',n);history.replaceState(null,'',u)};
 return <div ref={root} className="tm-lab lens-options" data-lens-version={version}>
  <div className="tm-options-head"><span>Expanding Lenses · five studies</span><a href="practice-options.html?design=5#/about">Previous options ↗</a></div>
  <nav className="tm-choices" aria-label="Expanding lens variations">{LENS_STUDIES.map((item,i)=><button key={item.name} onClick={()=>choose(i+1)} aria-pressed={version===i+1}><span>{String(i+1).padStart(2,'0')}</span>{item.name}</button>)}</nav>
  <p className="tm-description">{LENS_STUDIES[version-1].note}</p>
  <main key={version} className="lens-main-page"><section><h1 data-lens-reveal>A foundation in <em>making.</em></h1><ExpandingLensGroup items={PRACTICE_EDU} education version={version}/></section><section><h2 data-lens-reveal>From the frame<br/>to the <em>film set.</em></h2><ExpandingLensGroup items={PRACTICE_EXP} version={version}/></section></main>
 </div>;
}
