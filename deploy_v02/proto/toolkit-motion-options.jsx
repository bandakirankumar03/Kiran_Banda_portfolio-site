const TOOLKIT_MOTION_CHOICES=[
 {name:'Ripple field',note:'A gentle wave passes through the logos. Nearby tools respond together to the cursor.'},
 {name:'Orbital studio',note:'Tools orbit an Unreal Engine centre, while each logo stays upright.'},
 {name:'Living rails',note:'Two continuous streams move in opposite directions, with a separate stream for AI.'},
 {name:'Soft dock',note:'A compact arrangement that lifts and expands around the cursor.'},
 {name:'Flow canvas',note:'A quiet network of tools, connected by travelling traces of light.'},
];

function MotionTool({tool,index=0,toggle,paused,ghost=false}){
 const content=<><img src={'media/tools/'+tool.file} alt="" aria-hidden="true" width="44" height="44" loading="eager"/><span className="tm-tool-name">{tool.name}</span></>;
 if(ghost)return <span className={'tm-tool'+(tool.wide?' tm-wide':'')} style={{'--tool-i':index}}>{content}</span>;
 return <button type="button" className={'tm-tool'+(tool.wide?' tm-wide':'')} style={{'--tool-i':index}} onClick={toggle} aria-label={tool.name} aria-pressed={paused}>{content}</button>;
}

function MotionToolPanel({tools,design,paused,toggle,ai=false}){
 const root=React.useRef(null);
 React.useEffect(()=>{
  const el=root.current;if(!el||![1,4].includes(design))return;
  const fine=matchMedia('(hover:hover) and (pointer:fine)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let frame=0,pointer=null;
  const update=()=>{frame=0;const nodes=[...el.querySelectorAll('.tm-tool')];
   const values=nodes.map(node=>{if(!pointer)return 0;const r=node.getBoundingClientRect();return Math.max(0,1-Math.hypot(pointer.x-r.left-r.width/2,(pointer.y-r.top-r.height/2)*.7)/120)});
   nodes.forEach((node,i)=>node.style.setProperty('--near',values[i].toFixed(3)));
  };
  const tick=()=>{if(!frame)frame=requestAnimationFrame(update)};
  const move=e=>{if(e.pointerType==='mouse'&&fine.matches&&!reduced.matches){pointer={x:e.clientX,y:e.clientY};tick()}};
  const leave=()=>{pointer=null;tick()};
  el.addEventListener('pointermove',move,{passive:true});el.addEventListener('pointerleave',leave);
  return()=>{cancelAnimationFrame(frame);el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave)};
 },[design]);
 const mark=(tool,i,ghost=false)=><MotionTool key={tool.name+(ghost?'-copy':'')} tool={tool} index={i} toggle={toggle} paused={paused} ghost={ghost}/>;
 if(design===2&&!ai){const centre=tools[0],orbit=tools.slice(1);return <div className="tm-panel tm-orbit" ref={root} aria-label="Main creative applications">
   <div className="tm-orbit-line" aria-hidden="true"/><div className="tm-orbit-centre">{mark(centre,0)}</div>
   <div className="tm-orbit-track">{orbit.map((tool,i)=><div className="tm-orbit-position" key={tool.name} style={{left:(50+43*Math.cos(i/orbit.length*Math.PI*2))+'%',top:(50+43*Math.sin(i/orbit.length*Math.PI*2))+'%'}}><div className="tm-counter-orbit">{mark(tool,i+1)}</div></div>)}</div>
 </div>}
 if(design===3){const rows=ai?[tools]:[tools.slice(0,8),tools.slice(8)];return <div className={'tm-panel tm-rails'+(ai?' tm-ai-rails':'')} ref={root} aria-label={ai?'AI tools':'Main creative applications'}>{rows.map((row,n)=><div className={'tm-rail tm-rail-'+n} key={n}><div className="tm-rail-track"><div className="tm-rail-set">{row.map((tool,i)=>mark(tool,i))}</div><div className="tm-rail-set" aria-hidden="true" inert="">{row.map((tool,i)=>mark(tool,i,true))}</div></div></div>)}</div>}
 if(design===4){const rows=ai?[tools]:[tools.slice(0,8),tools.slice(8)];return <div className="tm-panel tm-docks" ref={root} aria-label={ai?'AI tools':'Main creative applications'}>{rows.map((row,n)=><div className="tm-dock" key={n}>{row.map((tool,i)=>mark(tool,i))}</div>)}</div>}
 if(design===5){const rows=ai?[tools]:[tools.slice(0,5),tools.slice(5,10),tools.slice(10)];return <div className="tm-panel tm-flow" ref={root} aria-label={ai?'AI tools':'Main creative applications'}>{rows.map((row,n)=><div className="tm-flow-row" key={n}>
   <svg className="tm-flow-wire" viewBox="0 0 500 80" preserveAspectRatio="none" aria-hidden="true"><path className="tm-wire-base" d="M50 40 C100 8 100 72 150 40 S200 8 250 40 S300 72 350 40 S400 8 450 40"/><path className="tm-wire-light" style={{animationDelay:(n*-.9)+'s'}} d="M50 40 C100 8 100 72 150 40 S200 8 250 40 S300 72 350 40 S400 8 450 40"/></svg>
   {row.map((tool,i)=>mark(tool,i+n*5))}
 </div>)}</div>}
 return <div className={'tm-panel tm-ripple'+(ai?' tm-ai-ripple':'')} ref={root} aria-label={ai?'AI tools':'Main creative applications'}>{tools.map((tool,i)=>mark(tool,i))}</div>;
}

function ToolkitMotionOptionsPage(){
 const [design,setDesign]=React.useState(()=>Math.max(1,Math.min(5,Number(new URLSearchParams(location.search).get('design'))||1)));
 const [paused,setPaused]=React.useState(false),[visible,setVisible]=React.useState(true);
 React.useEffect(()=>{const change=()=>setVisible(!document.hidden);document.addEventListener('visibilitychange',change);return()=>document.removeEventListener('visibilitychange',change)},[]);
 const choose=n=>{setDesign(n);setPaused(false);const u=new URL(location.href);u.searchParams.set('design',n);history.replaceState(null,'',u)};
 const toggle=()=>setPaused(p=>!p);
 return <div className={'tm-lab'+(paused||!visible?' tm-paused':'')} data-motion-design={design}>
   <div className="tm-options-head"><span>Toolkit motion studies</span><a href="index.html#/about">Back to About ↗</a></div>
   <nav className="tm-choices" aria-label="Toolkit animation previews">{TOOLKIT_MOTION_CHOICES.map((choice,i)=><button key={choice.name} aria-pressed={design===i+1} onClick={()=>choose(i+1)}><span>{String(i+1).padStart(2,'0')}</span>{choice.name}</button>)}</nav>
   <p className="tm-description">{TOOLKIT_MOTION_CHOICES[design-1].note}</p>
   <section className="tm-concept" key={design} aria-labelledby="tm-heading">
     <h1 id="tm-heading">How I <em>build.</em></h1>
     <div className="tm-main-row"><div className="tm-focus"><small>MY FOCUS</small><ul><li>Environment art & scene building</li><li>Photogrammetry & materials</li><li>Real-time lighting</li><li>Virtual production & compositing</li></ul></div><div className="tm-main-tools"><small>TOOLS I USE</small><MotionToolPanel tools={TOOL_LOGOS} design={design} paused={paused} toggle={toggle}/></div></div>
     <div className="tm-ai-row"><div><h2 className="tm-ai-heading"><strong>AI-assisted</strong><em>workflow.</em></h2><p>AI helps me explore faster and make more room for the craft.</p></div><MotionToolPanel tools={AI_TOOL_LOGOS} design={design} paused={paused} toggle={toggle} ai/></div>
   </section>
 </div>;
}
