const RANA_PIPELINE_NODES=[
 {id:'scan',number:'01',name:'Scan & process',detail:'Capture · reconstruct · texture',image:'capture-field.jpg',note:'Real locations become textured assets.'},
 {id:'unreal',number:'02',name:'Unreal / PCG',detail:'Assets · PCG · lighting',image:'unreal-new/view-00095.webp',note:'PCG, materials and light turn the captures into an environment.'},
 {id:'pre',number:'03A',name:'Pre-production',detail:'Asset prep · set planning',image:'bts/collaborative-planning.webp',note:'Assets, practical props and the set are prepared for the shoot.'},
 {id:'shoot',number:'03B',name:'Production',detail:'On-stage shoot',image:'vp-stage-environment-level.webp',note:'The virtual environment meets the camera, cast and crew.'},
 {id:'post',number:'04',name:'Post-production',detail:'CGI + AI VFX · editing · sound · AI music',image:'post/3g-final.webp',note:'CGI and AI VFX, the edit, sound design and AI music complete the pipeline.'}
];

function RanaProductionMap({variant=4,layout=0}){
 const [hovered,setHovered]=React.useState(null),[tapped,setTapped]=React.useState(null),[running,setRunning]=React.useState(false),[reduced,setReduced]=React.useState(()=>matchMedia('(prefers-reduced-motion:reduce)').matches);
 const [geometry,setGeometry]=React.useState({width:1,height:1,paths:[]});
 const root=React.useRef(null),cards=React.useRef({}),measureFrame=React.useRef(0),lightFrame=React.useRef(0),measureLayout=React.useRef(()=>{});
 const active=hovered||tapped,current=RANA_PIPELINE_NODES.find(node=>node.id===active);
 React.useLayoutEffect(()=>{
  const graph=root.current;let disposed=false;
  const measure=(animate=false)=>{
   measureFrame.current=0;if(disposed)return;
   const box=graph.getBoundingClientRect(),compact=matchMedia('(max-width:850px)').matches;
   const port=(id,side)=>{const r=cards.current[id].getBoundingClientRect();return {x:(side==='left'?r.left:side==='right'?r.right:r.left+r.width/2)-box.left,y:(side==='top'?r.top:side==='bottom'?r.bottom:r.top+r.height/2)-box.top}};
   let pairs=compact?[['scan','right','unreal','left'],['unreal','bottom','pre','top'],['pre','right','shoot','left'],['shoot','bottom','post','top']]:[['scan','right','unreal','left'],['unreal','right','pre','left'],['pre','bottom','shoot','top'],['shoot','right','post','left']];
   if(layout){pairs=[['scan','unreal'],['unreal','pre'],['pre','shoot'],['shoot','post']].map(([from,to])=>{const a=cards.current[from].getBoundingClientRect(),b=cards.current[to].getBoundingClientRect(),dx=b.left+b.width/2-a.left-a.width/2,dy=b.top+b.height/2-a.top-a.height/2,overlap=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);const horizontal=(!compact&&+layout===4&&from==='unreal')||overlap>Math.min(a.height,b.height)*.35;return horizontal?[from,dx>=0?'right':'left',to,dx>=0?'left':'right']:[from,dy>=0?'bottom':'top',to,dy>=0?'top':'bottom']})}
   const round=n=>Math.round(n*100)/100;
   const paths=pairs.map(([from,side,to,end])=>{const a=port(from,side),b=port(to,end);const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;const points=[a.x,a.y,...(['top','bottom'].includes(side)?[a.x,my,b.x,my]:[mx,a.y,mx,b.y]),b.x,b.y].map(round);return {from,to,a:{x:round(a.x),y:round(a.y)},b:{x:round(b.x),y:round(b.y)},d:`M${points[0]} ${points[1]} C${points[2]} ${points[3]} ${points[4]} ${points[5]} ${points[6]} ${points[7]}`}});
   const next={width:round(box.width),height:round(box.height),paths};
   if(animate){const svg=graph.querySelector('.rpm-wires');if(!svg)return;svg.setAttribute('viewBox',`0 0 ${next.width} ${next.height}`);svg.querySelectorAll('[data-connection]').forEach((group,i)=>{const path=paths[i];if(!path)return;group.querySelectorAll('path').forEach(el=>el.setAttribute('d',path.d));group.querySelectorAll('circle').forEach((el,j)=>{el.setAttribute('cx',j?path.b.x:path.a.x);el.setAttribute('cy',j?path.b.y:path.a.y)})});}
   else setGeometry(old=>JSON.stringify(old)===JSON.stringify(next)?old:next);
  };
  measureLayout.current=measure;
  const schedule=()=>{if(!measureFrame.current)measureFrame.current=requestAnimationFrame(()=>measure())};
  const observer=new ResizeObserver(schedule);observer.observe(graph);Object.values(cards.current).forEach(card=>observer.observe(card));
  window.addEventListener('resize',schedule);document.fonts?.ready.then(()=>{if(!disposed)schedule()});measure();
  return()=>{disposed=true;observer.disconnect();window.removeEventListener('resize',schedule);cancelAnimationFrame(measureFrame.current);cancelAnimationFrame(lightFrame.current)};
 },[layout]);
 React.useEffect(()=>{let frame=0,start=performance.now(),last=0;const tick=now=>{if(now-last>=30){measureLayout.current(true);last=now}if(now-start<450)frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame)},[active,reduced]);
 React.useEffect(()=>{const dismiss=e=>{if(!e.target.closest('.rpm-node'))setTapped(null)};document.addEventListener('pointerdown',dismiss);return()=>document.removeEventListener('pointerdown',dismiss)},[]);
 React.useEffect(()=>{
  let visible=false;const media=matchMedia('(prefers-reduced-motion:reduce)');
  const update=()=>{setRunning(visible&&!document.hidden);setReduced(media.matches)};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update()},{threshold:.1});observer.observe(root.current);
  document.addEventListener('visibilitychange',update);media.addEventListener('change',update);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',update);media.removeEventListener('change',update)};
 },[]);
 const light=e=>{
  if(e.pointerType!=='mouse'||reduced)return;
  const card=e.currentTarget,box=card.getBoundingClientRect(),x=(e.clientX-box.left)/box.width*100,y=(e.clientY-box.top)/box.height*100;
  cancelAnimationFrame(lightFrame.current);lightFrame.current=requestAnimationFrame(()=>{card.style.setProperty('--rpm-x',x+'%');card.style.setProperty('--rpm-y',y+'%')});
 };
 const key=(e,index)=>{
  let next;if(['ArrowRight','ArrowDown'].includes(e.key))next=(index+1)%5;else if(['ArrowLeft','ArrowUp'].includes(e.key))next=(index+4)%5;else if(e.key==='Home')next=0;else if(e.key==='End')next=4;else return;
  e.preventDefault();cards.current[RANA_PIPELINE_NODES[next].id]?.focus();
 };
 const jump=id=>{
  const selector={scan:'.rn-capture',unreal:'.ru-claude',pre:'#rn-preparation-title',shoot:'.rn-volume-opening',post:'#post-production'}[id];
  const anchor=document.querySelector(selector),target=anchor?.closest('section')||anchor;if(!target)return;
  let top=0;for(let el=target;el;el=el.offsetParent)top+=el.offsetTop;
  const nav=document.querySelector('.site-nav'),inset=Math.max(0,nav?.getBoundingClientRect().bottom||0)+24;
  const heading=target.querySelector('h2')||target;heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});
  window.scrollTo({top:Math.max(0,top-inset),behavior:reduced?'instant':'smooth'});
 };
 const card=(node,index)=><button key={node.id} ref={el=>cards.current[node.id]=el} type="button" className={'rpm-node rpm-'+node.id} data-node={node.id} data-reveal={hovered===node.id||tapped===node.id} aria-label={'Go to '+node.name+' section'} aria-pressed={active===node.id} onPointerEnter={e=>{if(e.pointerType==='mouse')setHovered(node.id)}} onPointerLeave={()=>{setHovered(null);if(matchMedia('(hover:hover)').matches)setTapped(null)}} onPointerMove={light} onFocus={()=>setHovered(node.id)} onBlur={()=>{setHovered(null);setTapped(null)}} onClick={()=>jump(node.id)} onKeyDown={e=>key(e,index)}>
  <span className="rpm-node-copy"><strong>{node.name}</strong>{node.id==='post'?<span className="rpm-post-tools">{['CGI + AI VFX','Editing','Sound','AI music'].map(tool=><span key={tool}>{tool}</span>)}</span>:<span className="rpm-detail">{node.detail}</span>}</span>
  <img className="rpm-photo" src={'media/projects/Ranasthala/web/'+node.image} alt="" aria-hidden="true" loading="lazy" width="64" height="40"/>
 </button>;
 return <section className="rana-production-map" data-motion={variant} data-layout={layout||undefined} aria-labelledby="rpm-title">
  <div className="rpm-heading"><div><span className="rpm-eyebrow">Ranasthala</span><h2 id="rpm-title">Production<br/><em>pipeline.</em></h2></div></div>
  <div className="rpm-graph" ref={root} role="group" aria-label="Ranasthala production pipeline" data-active={active} data-running={running&&!reduced}>
   <svg className="rpm-wires" viewBox={`0 0 ${geometry.width} ${geometry.height}`} preserveAspectRatio="none" aria-hidden="true">{geometry.paths.map((path,index)=>{const hot=path.from===active||path.to===active;return <g key={index} data-connection={path.from+'-'+path.to} className={hot?'is-hot':''}><path className="rpm-wire" d={path.d}/><path className="rpm-wire-live" d={path.d}/><circle className="rpm-port" cx={path.a.x} cy={path.a.y} r="3"/><circle className="rpm-port" cx={path.b.x} cy={path.b.y} r="3"/></g>})}</svg>
   {card(RANA_PIPELINE_NODES[0],0)}{card(RANA_PIPELINE_NODES[1],1)}
   <div className={'rpm-vp-group'+(['pre','shoot'].includes(active)?' is-active':'')}><span className="rpm-vp-label">Virtual production</span><div className="rpm-vp-nodes">{card(RANA_PIPELINE_NODES[2],2)}{card(RANA_PIPELINE_NODES[3],3)}</div></div>
   {card(RANA_PIPELINE_NODES[4],4)}
  </div>
  <div className={'rpm-readout'+(!current?' is-idle':'')} aria-live="polite"><span>{current?current.name:'\u00a0'}</span><p>{current?.note||'\u00a0'}</p></div>
 </section>;
}
