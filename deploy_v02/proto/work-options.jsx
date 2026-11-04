const WORK_STUDIES=[
 ['Focus gallery','01'],['Cinematic stack','02'],['Editorial grid','03'],
 ['Expanding panels','04'],['Depth reel','05'],['Floating gallery','06'],
 ['Scene curtains','07'],['Spotlight index','08']
];
const WORK_CATEGORIES=[['All',null],['Virtual production','Virtual Production'],['Environments','Environment'],['Photogrammetry','Photogrammetry'],['VFX','VFX Reel']];
const workHref=p=>'#/case/'+p.slug;
function WorkStudyVisual({p,eager=false,onMediaClick}){
 if(p.heroVideo)return <video src={p.heroVideo} poster={p.hero} autoPlay muted loop playsInline preload="metadata" aria-label={p.title+' preview'} onClick={e=>{e.preventDefault();e.stopPropagation();if(onMediaClick){onMediaClick();return}const v=e.currentTarget;if(v.paused)v.play().catch(()=>{});else v.pause()}}/>;
 return <img src={p.hero} alt={p.title+' — '+p.kind} loading={eager?'eager':'lazy'} draggable="false"/>;
}
function WorkStudyCard({p,index=0,className=''}){
 return <a className={'ws-project '+className} href={workHref(p)} data-ws-reveal style={{'--ws-order':index%3}}>
  <div className="ws-project-image"><WorkStudyVisual p={p} eager={index<2}/><span className="ws-project-arrow" aria-hidden="true">↗</span></div>
  <div className="ws-project-caption"><h2>{p.title}</h2><span>{p.kind}</span></div>
 </a>
}
function WorkExperimentsPage(){
 const [design,setDesign]=React.useState(()=>Math.max(0,Math.min(WORK_STUDIES.length-1,(Number(new URLSearchParams(location.search).get('design'))||1)-1)));
 const [filter,setFilter]=React.useState('All');const root=React.useRef(null);
 const category=WORK_CATEGORIES.find(c=>c[0]===filter)?.[1];
 const list=PROJECTS.filter(p=>!category||p.kind===category);
 const choose=i=>{setDesign(i);history.replaceState(null,'','?design='+(i+1)+'#/work')};
 React.useEffect(()=>{
  const el=root.current;if(!el)return;const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const cards=[...el.querySelectorAll('[data-ws-reveal]')];
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('ws-in-view');observer.unobserve(entry.target)}}),{threshold:.06});
  cards.forEach(card=>{if(reduced.matches)card.classList.add('ws-in-view');else observer.observe(card)});
  let frame=0;const update=()=>{frame=0;if(design!==1||reduced.matches)return;el.querySelectorAll('.ws-cinema .ws-project-image').forEach(image=>{const r=image.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)image.style.setProperty('--ws-pan',Math.max(-30,Math.min(30,(r.top+r.height/2-innerHeight/2)*-.055))+'px')})};
  const tick=()=>{if(!frame)frame=requestAnimationFrame(update)};window.addEventListener('scroll',tick,{passive:true});update();
  return()=>{observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',tick)};
 },[design,filter]);
 return <div className="work-studies" ref={root} data-work-study={design}>
  <div className="ws-chooser"><div className="ws-chooser-label"><span>Work page · Eight directions</span><span>Local preview</span></div>
   <nav aria-label="Work page designs">{WORK_STUDIES.map(([name,n],i)=><button key={name} type="button" aria-pressed={design===i} onClick={()=>choose(i)}><span>{n}</span>{name}</button>)}</nav>
  </div>
  <header className="ws-header"><h1>The <em>shot list.</em></h1><div className="ws-filters" role="group" aria-label="Project categories">{WORK_CATEGORIES.map(([name])=><button key={name} type="button" aria-pressed={filter===name} onClick={()=>setFilter(name)}>{name}</button>)}</div></header>
  <main key={design+'-'+filter} className="ws-content">
   {design===0&&<WorkFocusGallery list={list}/>}
   {design===1&&<div className="ws-cinema">{list.map((p,i)=><a key={p.slug} href={workHref(p)} className="ws-project ws-cinema-project" data-ws-reveal><div className="ws-project-image"><WorkStudyVisual p={p} eager={i===0}/></div><div className="ws-cinema-copy"><span>{p.kind}</span><h2>{p.title}</h2><span className="ws-cinema-arrow" aria-hidden="true">↗</span></div></a>)}</div>}
   {design===2&&<div className="ws-editorial">{list.map((p,i)=><WorkStudyCard key={p.slug} p={p} index={i}/>)}</div>}
   {design===3&&<WorkExpandingPanels list={list}/>}
   {design===4&&<WorkDepthReel list={list}/>}
   {design===5&&<div className="ws-atlas">{list.map((p,i)=><WorkStudyCard key={p.slug} p={p} index={i}/>)}</div>}
   {design===6&&<WorkSceneCurtains list={list}/>}
   {design===7&&<WorkSpotlightIndex list={list}/>}
  </main><Footer/>
 </div>
}
function WorkExpandingPanels({list}){
 const [selected,setSelected]=React.useState(list[0].slug);
 return <div className="ws-folds">{list.map(p=><article key={p.slug} className={'ws-fold'+(selected===p.slug?' is-open':'')} onPointerEnter={e=>{if(e.pointerType==='mouse')setSelected(p.slug)}} onFocusCapture={()=>setSelected(p.slug)}>
  <div className="ws-fold-image"><WorkStudyVisual p={p} eager/></div>
  <button type="button" className="ws-fold-label" aria-expanded={selected===p.slug} onClick={()=>setSelected(p.slug)}>{p.title}</button>
  {selected===p.slug&&<a className="ws-fold-open" href={workHref(p)} aria-label={'Explore '+p.title}><span>{p.kind}</span><strong>Explore project ↗</strong></a>}
 </article>)}</div>
}
function WorkDepthReel({list}){
 const [index,setIndex]=React.useState(0),[paused,setPaused]=React.useState(false),[visible,setVisible]=React.useState(false);
 const [reduced,setReduced]=React.useState(()=>matchMedia('(prefers-reduced-motion:reduce)').matches);
 const drag=React.useRef(null),suppress=React.useRef(0),stage=React.useRef(null);const count=list.length;
 React.useEffect(()=>{const mq=matchMedia('(prefers-reduced-motion:reduce)'),update=()=>setReduced(mq.matches);mq.addEventListener('change',update);const observer=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting),{threshold:.18});observer.observe(stage.current);return()=>{mq.removeEventListener('change',update);observer.disconnect()}},[]);
 React.useEffect(()=>{if(paused||reduced||!visible||count<2)return;const timer=setInterval(()=>{if(!document.hidden)setIndex(i=>(i+1)%count)},2400);return()=>clearInterval(timer)},[index,paused,reduced,visible,count]);
 React.useEffect(()=>{stage.current?.querySelectorAll('video').forEach(v=>{if(paused)v.pause();else v.play().catch(()=>{})})},[index,paused]);
 const change=d=>setIndex(i=>(i+d+count)%count),p=list[index];
 const gestureEnd=e=>{if(!drag.current)return;const dx=e.clientX-drag.current.x,dy=e.clientY-drag.current.y;drag.current=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.2){suppress.current=performance.now()+350;change(dx<0?1:-1)}};
 return <div className="ws-depth ws-depth-loop" role="region" aria-label="Project reel" data-loop-state={paused?'paused':reduced?'still':visible?'running':'idle'} tabIndex={0} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();change(e.key==='ArrowRight'?1:-1)}}}>
  <div className="ws-depth-stage" ref={stage} onPointerDown={e=>{drag.current={x:e.clientX,y:e.clientY}}} onPointerUp={gestureEnd} onPointerCancel={()=>{drag.current=null}} onClickCapture={e=>{if(performance.now()<suppress.current){e.preventDefault();e.stopPropagation()}}}>
   {list.map((item,i)=>{let slot=(i-index+count)%count;if(slot>count/2)slot-=count;const active=slot===0,show=Math.abs(slot)<=1;const select=()=>active?setPaused(v=>!v):setIndex(i);return <button key={item.slug} type="button" className="ws-deck-card" data-slot={Math.max(-3,Math.min(3,slot))} aria-hidden={!show} tabIndex={show?0:-1} aria-label={active?(paused?'Resume project loop':'Pause project loop'):'Preview '+item.title} aria-pressed={active?paused:undefined} onClick={select}><WorkStudyVisual p={show?item:{...item,heroVideo:null}} eager onMediaClick={select}/></button>})}
  </div>
  <div className="ws-depth-caption"><button type="button" aria-label="Previous project" disabled={count<2} onClick={()=>change(-1)}>←</button><div key={p.slug} className="ws-deck-title"><span>{p.kind}</span><h2><a href={workHref(p)}>{p.title} <small aria-hidden="true">↗</small></a></h2></div><button type="button" aria-label="Next project" disabled={count<2} onClick={()=>change(1)}>→</button></div>
  <div className="ws-depth-thumbs" role="group" aria-label="Choose a project">{list.map((item,i)=><button key={item.slug} type="button" aria-label={item.title} aria-pressed={index===i} onClick={()=>setIndex(i)}><img src={item.hero} alt="" loading="lazy"/></button>)}</div>
 </div>
}
function WorkSceneCurtains({list}){
 const [selected,setSelected]=React.useState(list[0].slug);
 return <div className="ws-curtains">{list.map(p=>{const open=selected===p.slug;return <article key={p.slug} className={'ws-curtain'+(open?' is-open':'')} data-ws-reveal>
  <div id={'curtain-'+p.slug} className="ws-curtain-image" aria-hidden={!open}><WorkStudyVisual p={open?p:{...p,heroVideo:null}} eager={open}/></div>
  <button type="button" className="ws-curtain-label" aria-expanded={open} aria-controls={'curtain-'+p.slug} onClick={()=>setSelected(p.slug)}><span>{p.title}</span><small>{p.kind}</small><i aria-hidden="true">↗</i></button>
  {open&&<div className="ws-curtain-detail"><p>{p.tagline}</p><a href={workHref(p)}>Explore project ↗</a></div>}
 </article>})}</div>
}
function WorkSpotlightIndex({list}){
 const [selected,setSelected]=React.useState(list[0].slug);const p=list.find(item=>item.slug===selected)||list[0];
 const drift=e=>{if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--spot-x',((e.clientX-r.left)/r.width-.5)*9+'px');e.currentTarget.style.setProperty('--spot-y',((e.clientY-r.top)/r.height-.5)*6+'px')};
 return <div className="ws-spotlight" onPointerMove={drift} onPointerLeave={e=>{e.currentTarget.style.setProperty('--spot-x','0px');e.currentTarget.style.setProperty('--spot-y','0px')}}>
  <div className="ws-spotlight-visuals">{list.map(item=><div key={item.slug} className={'ws-spotlight-world'+(p.slug===item.slug?' is-selected':'')} aria-hidden={p.slug!==item.slug}><WorkStudyVisual p={p.slug===item.slug?item:{...item,heroVideo:null}} eager/></div>)}</div>
  <div className="ws-spotlight-list" role="group" aria-label="Project spotlight">{list.map(item=><button key={item.slug} type="button" aria-pressed={p.slug===item.slug} onPointerEnter={e=>{if(e.pointerType==='mouse')setSelected(item.slug)}} onFocus={()=>setSelected(item.slug)} onClick={()=>setSelected(item.slug)}>{item.title}<span aria-hidden="true">↗</span></button>)}</div>
  <aside className="ws-spotlight-info" key={p.slug}><span>{p.kind}</span><h2>{p.title}</h2><p>{p.tagline}</p><div className="ws-spotlight-tags">{p.tags.slice(0,3).map(t=><span key={t}>{t}</span>)}</div><a href={workHref(p)}>Explore project ↗</a></aside>
 </div>
}
