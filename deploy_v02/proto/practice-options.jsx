const PRACTICE_STUDIES=[
 {name:'Editorial Spread',note:'Open typography, generous imagery-free space, and soft reveals across the page.'},
 {name:'Focus Folio',note:'A compact index with one focused detail. Move between schools and studios.'},
 {name:'Floating Planes',note:'Lightly tilted surfaces settle into place with the scroll and respond to the cursor.'},
 {name:'Compact Editions',note:'Clear, compact rows. Supporting details unfold gently on hover, focus or tap.'},
 {name:'Expanding Lenses',note:'Quiet panels expand around the selected school or studio, keeping the others nearby.'}
];
const PRACTICE_EDU=ABOUT_LENS_EDUCATION;
const PRACTICE_EXP=ABOUT_LENS_EXPERIENCE;

function PracticeStudyCard({item,education=false,index=0,selected=false,select,activate,mode}){
 const common=<><div className="po-meta"><span>{item.date}</span>{education&&<span>{item.level}</span>}</div><h3>{education?item.label:item.title}</h3>{education?<h4>{item.title}</h4>:<h4>{item.where}</h4>}<div className="po-detail">{education&&<p className="po-place">{item.where}</p>}<p>{item.note}</p></div></>;
 const props={className:'po-card'+(selected?' is-selected':''),'data-po-reveal':true,style:{'--po-i':index},onPointerEnter:e=>{if(activate&&e.pointerType==='mouse')activate()},onFocus:()=>activate?.()};
 if(mode===5)return <button type="button" {...props} onClick={select} aria-pressed={selected}>{common}</button>;
 if(mode===4)return <article {...props}><button className="po-row-trigger" type="button" aria-expanded={selected} onClick={select}><span>{item.date}</span><span><strong>{education?item.title:item.title}</strong><small>{education?item.label+' · '+item.level:item.where}</small></span></button><div className="po-row-detail"><div><p>{education?item.where+' — ':''}{item.note}</p></div></div></article>;
 return <article {...props}>{common}</article>;
}

function PracticeFolio({items,education=false}){
 const [active,setActive]=React.useState(0),item=items[active];
 return <div className="po-folio" data-po-reveal><nav aria-label={education?'Education details':'Experience details'}>{items.map((it,i)=><button key={it.label} aria-pressed={i===active} onPointerEnter={e=>{if(e.pointerType==='mouse')setActive(i)}} onFocus={()=>setActive(i)} onClick={()=>setActive(i)}><span>{it.date}</span><strong>{it.label}</strong></button>)}</nav><article className="po-folio-detail" key={active}><span>{item.level||item.date}</span><h3>{item.title}</h3><h4>{item.where}</h4><p>{item.note}</p></article></div>;
}

function PracticeOptionsPage(){
 const [design,setDesign]=React.useState(()=>Math.max(1,Math.min(5,Number(new URLSearchParams(location.search).get('design'))||1))),[edu,setEdu]=React.useState(0),[exp,setExp]=React.useState(0);
 const root=React.useRef(null);
 React.useLayoutEffect(()=>{
  const page=root.current,reduced=matchMedia('(prefers-reduced-motion:reduce)');let frame=0;
  const update=()=>{frame=0;page.querySelectorAll('[data-po-reveal]').forEach(el=>{const r=el.getBoundingClientRect(),t=reduced.matches?1:Math.max(0,Math.min(1,(innerHeight*.98-r.top)/(innerHeight*.28)));el.style.setProperty('--po-entry',1-t*t*(3-2*t))})};
  const tick=()=>{if(!frame)frame=requestAnimationFrame(update)};window.addEventListener('scroll',tick,{passive:true});window.addEventListener('resize',tick);reduced.addEventListener('change',tick);update();return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',tick);window.removeEventListener('resize',tick);reduced.removeEventListener('change',tick)};
 },[design]);
 const choose=n=>{setDesign(n);setEdu(0);setExp(0);const u=new URL(location.href);u.searchParams.set('design',n);history.replaceState(null,'',u)};
 const move=e=>{if(!matchMedia('(hover:hover) and (prefers-reduced-motion:no-preference)').matches)return;const card=e.target.closest('.po-card,.po-folio-detail');if(!card)return;const r=card.getBoundingClientRect();card.style.setProperty('--po-x',((e.clientX-r.left)/r.width-.5)*5+'px');card.style.setProperty('--po-y',((e.clientY-r.top)/r.height-.5)*4+'px')};
 const leave=e=>{const card=e.target.closest('.po-card,.po-folio-detail');if(card&&!card.contains(e.relatedTarget)){card.style.setProperty('--po-x','0px');card.style.setProperty('--po-y','0px')}};
 const group=(items,education)=>design===2?<PracticeFolio items={items} education={education}/>:<div className={'po-cards'+(education?' po-education':' po-experience')}>{items.map((item,i)=><PracticeStudyCard key={item.label} item={item} education={education} index={i} mode={design} selected={(education?edu:exp)===i} activate={()=>education?setEdu(i):setExp(i)} select={()=>education?setEdu(v=>design===4&&v===i?-1:i):setExp(v=>design===4&&v===i?-1:i)}/>)}</div>;
 return <div ref={root} className="tm-lab practice-options" data-practice-design={design} onPointerMove={move} onPointerOut={leave}>
  <div className="tm-options-head"><span>Education & experience studies</span><a href="index.html#/about">Back to About ↗</a></div>
  <nav className="tm-choices" aria-label="Education and experience variations">{PRACTICE_STUDIES.map((item,i)=><button key={item.name} onClick={()=>choose(i+1)} aria-pressed={design===i+1}><span>{String(i+1).padStart(2,'0')}</span>{item.name}</button>)}</nav>
  <p className="tm-description">{PRACTICE_STUDIES[design-1].note}</p>
  <main key={design} className="po-main"><section><h1 data-po-reveal>A foundation in <em>making.</em></h1>{group(PRACTICE_EDU,true)}</section><section><h2 data-po-reveal>From the frame<br/>to the <em>film set.</em></h2>{group(PRACTICE_EXP,false)}</section></main>
 </div>;
}
