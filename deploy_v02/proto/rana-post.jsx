const RANA_POST_ROOT='media/projects/Ranasthala/web/post/';
function RanaWipe({before,after,beforeLabel='Original plate',afterLabel='VFX composite',label,video=false,reframed=false}){
 const [position,setPosition]=React.useState(reframed?100:50);
 const frame=React.useRef(null),a=React.useRef(null),b=React.useRef(null);
 React.useEffect(()=>{
  if(!video)return;
  const first=a.current,second=b.current,videos=[first,second];
  let visible=false,disposed=false;
  videos.forEach(v=>{v.defaultMuted=true;v.muted=true;v.playsInline=true;v.loop=true;v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');});
  const update=()=>{
   if(disposed)return;
   videos.forEach(v=>{
    if(!visible||document.hidden){v.pause();return;}
    v.muted=true;v.preload='auto';
    if(v.paused)v.play().catch(()=>{});
   });
  };
  const sync=()=>{
   if(!visible||document.hidden||first.paused||second.paused||first.seeking||second.seeking)return;
   const duration=Math.min(first.duration,second.duration);
   if(Number.isFinite(duration)&&duration>.25&&(first.currentTime>=duration-.08||second.currentTime>=duration-.08)){first.currentTime=0;second.currentTime=0;}
   else if(Math.abs(first.currentTime-second.currentTime)>.2)second.currentTime=first.currentTime;
  };
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update()},{threshold:.05});observer.observe(frame.current);
  const readyEvents=['loadedmetadata','loadeddata','canplay','ended'];
  videos.forEach(v=>readyEvents.forEach(name=>v.addEventListener(name,update)));
  // Retry within a user gesture when mobile autoplay was initially denied.
  const gestures=['pointerdown','touchstart','keydown'];
  gestures.forEach(name=>document.addEventListener(name,update,{passive:true}));
  document.addEventListener('visibilitychange',update);window.addEventListener('pageshow',update);
  const timer=setInterval(sync,200);
  return()=>{disposed=true;clearInterval(timer);observer.disconnect();videos.forEach(v=>{readyEvents.forEach(name=>v.removeEventListener(name,update));v.pause()});gestures.forEach(name=>document.removeEventListener(name,update));document.removeEventListener('visibilitychange',update);window.removeEventListener('pageshow',update)};
 },[video,before,after]);

 const media=(src,ref,description)=>video?<video ref={ref} src={RANA_POST_ROOT+src+'.mp4'} poster={RANA_POST_ROOT+src+'.webp'} muted autoPlay loop playsInline preload="metadata" controls={false} disablePictureInPicture aria-label={description}/>:<img src={RANA_POST_ROOT+src+'.webp'} alt={description} loading="lazy" draggable={false}/>;
 return <div className={'rp-comparison'+(reframed?' rp-reframed':'')} ref={frame}>
  <div className="rp-wipe" data-image-navigation="" style={{'--wipe':position+'%'}} onPointerEnter={e=>{if(reframed&&e.pointerType==='mouse'&&matchMedia('(hover:hover)').matches)setPosition(0)}} onPointerLeave={e=>{if(reframed&&e.pointerType==='mouse')setPosition(100)}} onPointerMove={e=>{if(!reframed&&e.pointerType==='mouse'&&!e.buttons&&!matchMedia('(prefers-reduced-motion:reduce)').matches){const r=e.currentTarget.getBoundingClientRect();setPosition(Math.round(Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100))))}}}>
   {media(after,b,afterLabel+' · '+label)}
   <div className="rp-before" style={reframed?{opacity:position===100?0:1}:{clipPath:`inset(0 ${100-position}% 0 0)`}}>{media(before,a,beforeLabel+' · '+label)}</div>
   <span className="rp-wipe-label rp-label-left">{reframed&&position===100?afterLabel:beforeLabel}</span><span className="rp-wipe-label rp-label-right">{reframed?'Hover / tap':afterLabel}</span>
   {reframed?<button className="rp-swap" type="button" aria-label={'Toggle '+label+' plate and composite'} aria-pressed={position===100} onClick={()=>setPosition(position===100?0:100)}/>:<><div className="rp-divider" aria-hidden="true"><span>‹ ›</span></div><ComparisonWipeControl value={position} onChange={setPosition} aria-label={label+' comparison wipe'} aria-valuetext={position+'% '+beforeLabel+', '+(100-position)+'% '+afterLabel}/></>}
  </div>
  <div className="rp-media-foot"><span>{reframed?'Hover / tap':'Drag to reveal'} <span aria-hidden="true">↔</span></span>{!video&&<span>Plate / result</span>}</div>
 </div>;
}
function RanaVFXExample({items,kind,onInspect}){
 const [index,setIndex]=React.useState(0),[wire,setWire]=React.useState(false),item=items[index];
 const root=React.useRef(null),release=React.useRef(0);
 const [visible,setVisible]=React.useState(false),[hover,setHover]=React.useState(false),[focus,setFocus]=React.useState(false),[held,setHeld]=React.useState(false),[reduced,setReduced]=React.useState(()=>matchMedia('(prefers-reduced-motion:reduce)').matches);
 React.useEffect(()=>{const el=root.current,motion=matchMedia('(prefers-reduced-motion:reduce)');let inView=false;const update=()=>{setVisible(inView&&!document.hidden);setReduced(motion.matches)};const observer=new IntersectionObserver(([e])=>{inView=e.isIntersecting;update()},{threshold:.2});observer.observe(el);document.addEventListener('visibilitychange',update);motion.addEventListener('change',update);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',update);motion.removeEventListener('change',update);clearTimeout(release.current)}},[]);
 React.useEffect(()=>{const end=e=>{clearTimeout(release.current);release.current=setTimeout(()=>setHeld(false),e.pointerType==='touch'?5000:0)};window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);return()=>{window.removeEventListener('pointerup',end);window.removeEventListener('pointercancel',end)}},[]);
 const paused=hover||focus||held;
 React.useEffect(()=>{if(kind!=='AI'||items.length<2||!visible||paused||reduced)return;const timer=setTimeout(()=>{setIndex(i=>(i+1)%items.length);setWire(false)},2500);return()=>clearTimeout(timer)},[index,items.length,kind,visible,paused,reduced]);
 const change=d=>{setIndex(i=>(i+d+items.length)%items.length);setWire(false)};
 return <div className="rpd-card" ref={root} data-example={index} data-auto-paused={paused} onPointerEnter={e=>{if(e.pointerType==='mouse')setHover(true)}} onPointerLeave={()=>setHover(false)} onPointerDown={()=>{clearTimeout(release.current);setHeld(true)}} onFocusCapture={()=>setFocus(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocus(false)}}><header><h4>{item.title}</h4>{item.video&&<span>VIDEO</span>}</header><RanaWipe key={kind+index+wire} before={wire?item.wire:item.before} after={item.after} beforeLabel={wire?'Wireframe':item.beforeLabel||(kind==='CGI'?'Original plate':'Source')} afterLabel={kind==='CGI'?'CGI composite':'AI-assisted result'} label={kind+' VFX '+item.title} video={!!item.video} reframed={!!item.reframed}/><div className="rpd-card-foot"><span>{kind==='CGI'?'Compositing':'AI-assisted generation'}</span><div>{item.wire&&<button type="button" className="rpd-wire" aria-pressed={wire} onClick={()=>setWire(!wire)}>{wire?'Plate':'Wireframe'}</button>}{!item.video&&<button type="button" aria-label={'Expand '+item.title+' result'} onClick={()=>onInspect({image:RANA_POST_ROOT+item.after+'.webp',alt:item.title+' · result'})}>↗</button>}{items.length>1&&<><button type="button" aria-label={'Previous '+kind+' '+items[0].title+' example'} onClick={()=>change(-1)}>←</button><button type="button" aria-label={'Next '+kind+' '+items[0].title+' example'} onClick={()=>change(1)}>→</button></>}</div></div></div>;
}
function RanaPostProduction({onInspect}){
 const cgi=[{title:'Pillar replacement',before:'3i-plate',after:'3i-final',wire:'3i-wireframe'},{title:'Ruins Composition',before:'3g-plate-updated',after:'3g-final'}];
 const ai=[
  [{title:'Drone flight',before:'drone-input',beforeLabel:'Unreal input',after:'drone-ai',video:true},{title:'Green screen → arena',before:'greenscreen-source',after:'greenscreen-result'},{title:'Character integration',before:'courtyard-source',after:'courtyard-result'}],
  [{title:'Sandstorm',before:'storm-input',after:'storm-ai',video:true},{title:'Desert atmosphere',before:'desert-source',after:'desert-result'}]
 ];
 return <div className="rn-post rpd rpd-expanded" id="post-production"><style>{RANA_POST_STYLE}</style><div className="rpd-heading"><h2>From take<br/><em>to final frame.</em></h2><p className="rpd-intro">Testing traditional VFX and AI hybrid VFX.</p></div>
  <section className="rpd-category" aria-label="CGI VFX"><header><h3>CGI VFX.</h3></header><div className="rpd-four-grid">{cgi.map(item=><RanaVFXExample key={item.title} items={[item]} kind="CGI" onInspect={onInspect}/>)}</div><p className="rpd-tradeoff">Slower to build. More control over the final quality.</p></section>
  <section className="rpd-category rpd-ai" aria-label="AI VFX"><header><h3>AI VFX.</h3><span>Generated video + added elements</span></header><div className="rpd-four-grid">{ai.map(items=><RanaVFXExample key={items[0].title} items={items} kind="AI" onInspect={onInspect}/>)}</div><p className="rpd-tradeoff">Faster to explore. Less predictable, with limited control.</p></section>
 </div>;
}
const RANA_POST_STYLE=`
.rpd .rpd-category>header h3{color:var(--accent);font:400 clamp(31px,3.2vw,42px)/1.1 var(--serif)}
.rpd .rpd-intro{font:12px/1.6 var(--mono);color:var(--dim);margin:16px 0 0}.rpd .rpd-tradeoff{font:italic 400 clamp(19px,1.7vw,25px)/1.5 var(--serif);color:var(--accent);margin:23px 0 0;padding:2px 0 2px 16px;border-left:2px solid var(--accent);max-width:100%}
.rpd{max-width:1080px;margin:45px auto 55px;min-width:0}.rpd *{box-sizing:border-box}.rpd-heading{margin-bottom:25px}.rpd-heading>span{display:block;font:9px/1.5 var(--mono);letter-spacing:1.8px;color:var(--accent);margin-bottom:12px}.rpd h2{font:400 clamp(34px,4vw,52px)/1.07 var(--serif);letter-spacing:-1px;margin:0}.rpd em{color:var(--accent);font-weight:400}.rpd-pair{display:grid;grid-template-columns:1fr 1fr;gap:24px}.rn-production-chapter .rpd-panel{margin:0!important;min-width:0}.rpd-panel header{margin-bottom:15px;display:flex;flex-direction:column;gap:7px}.rpd h3{font:400 clamp(23px,2.5vw,31px)/1.1 var(--serif);letter-spacing:-.5px;margin:0}.rpd-ai h3{color:var(--accent)}.rpd-panel header>span{font:9px/1.5 var(--mono);color:var(--dim)}.rpd button{background:none;color:var(--ink);cursor:pointer}.rpd .rp-wipe{position:relative;aspect-ratio:16/9;overflow:hidden;background:#050706;border:1px solid var(--hair);isolation:isolate}.rpd .rp-wipe img,.rpd .rp-wipe video{position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:contain;max-width:none;transform:none!important;translate:none!important;rotate:none!important;scale:1!important;filter:none!important;transition:none!important;animation:none!important;pointer-events:none}.rpd .rp-before{position:absolute;inset:0;z-index:1}.rpd .rp-reframed .rp-before{transition:opacity .45s ease}.rpd .rp-wipe-label{position:absolute;top:9px;z-index:2;padding:5px 7px;background:#050706c9;color:#f4f0e5;font:8px/1.4 var(--mono);pointer-events:none;max-width:43%;backdrop-filter:blur(7px)}.rpd .rp-label-left{left:9px}.rpd .rp-label-right{right:9px}.rpd .rp-divider{position:absolute;z-index:3;top:0;bottom:0;left:var(--wipe);width:1px;background:var(--accent);pointer-events:none}.rpd .rp-divider>span{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:32px;height:32px;border:1px solid var(--accent);background:#090d0be6;border-radius:50%;display:grid;place-items:center;font:16px Arial;color:var(--accent)}.rpd .rp-wipe>input,.rpd .rp-wipe>.rp-swap{position:absolute;inset:0;width:100%;height:100%;margin:0;padding:0;border:0;z-index:4;touch-action:pan-y}.rpd .rp-wipe>input{opacity:0;cursor:ew-resize!important}.rpd .rp-wipe>.rp-swap{background:transparent;cursor:pointer}.rpd .rp-wipe:focus-within{outline:2px solid var(--accent);outline-offset:4px}.rpd .rp-media-foot{display:flex;align-items:center;justify-content:space-between;height:29px;font:9px/1.4 var(--mono);color:var(--dim)}.rpd .rp-media-foot>span:last-child{display:none}.rpd .rp-play{width:25px;height:25px;padding:5px;border:1px solid var(--hair);border-radius:50%}.rpd .rp-play svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.5}.rpd-navigation{display:flex;justify-content:space-between;align-items:center;gap:10px;font:10px/1.5 var(--mono)}.rpd-navigation>span{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.rpd-navigation b{font-weight:400;color:var(--accent);margin-right:12px}.rpd-navigation>div{display:flex;align-items:center;gap:6px;flex-shrink:0}.rpd-navigation button{width:29px;height:29px;padding:0;border:1px solid var(--hair);border-radius:50%;font:15px Arial}.rpd-navigation .rpd-wire{width:auto;font:9px var(--mono);padding:0 6px;border:0;border-radius:0;color:var(--accent)}.rpd button:focus-visible{outline:2px solid var(--accent);outline-offset:4px}.xr-image-dialog .xr-image-canvas{cursor:zoom-out!important}.xr-image-dialog .xr-image-canvas:focus{outline:0}.xr-image-dialog .xr-image-canvas:focus-visible{outline:1px solid var(--accent);outline-offset:-8px}
@media(max-width:760px){.rpd{margin:35px 0 45px}.rpd h2{font-size:36px}.rpd-pair{grid-template-columns:1fr;gap:29px}.rpd h3{font-size:27px}.rpd-panel header{margin-bottom:12px}.rpd-navigation{font-size:9px}}
.rpd.rpd-expanded{width:100%;max-width:none;margin:60px 0 75px}.rpd-expanded h2{font-size:clamp(38px,4.2vw,64px)}.rn-production-chapter .rpd-category{margin:35px 0 0!important;min-width:0}.rpd-category>header{display:flex;align-items:baseline;justify-content:space-between;gap:20px;margin-bottom:22px}.rpd-category>header>span{font:10px var(--mono);color:var(--dim)}.rpd-four-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px}.rpd-card{min-width:0}.rpd-card>header{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:13px}.rpd-card h4{font:400 23px/1.2 var(--serif);margin:0}.rpd-card>header>span{font:9px var(--mono);letter-spacing:1px;color:var(--accent)}.rpd-card-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;font:10px/1.5 var(--mono);color:var(--dim)}.rpd-card-foot>div{display:flex;align-items:center;gap:7px}.rpd-card-foot button{width:30px;height:30px;border:1px solid var(--hair);border-radius:50%;padding:0;font:16px Arial}.rpd-card-foot .rpd-wire{width:auto;border:0;border-radius:0;color:var(--accent);font:10px var(--mono);padding:0 8px}
@media(max-width:760px){.rpd.rpd-expanded{margin:40px 0 55px}.rpd-expanded h2{font-size:38px}.rpd-four-grid{grid-template-columns:1fr;gap:29px}.rpd-category>header{align-items:start;flex-direction:column;gap:8px}.rpd-category>header>span{font-size:9px}.rpd-card h4{font-size:25px}.rpd-card-foot{font-size:9px}.rpd-card-foot .rpd-wire{font-size:9px}}
@media(prefers-reduced-motion:reduce){.rpd *{transition:none!important;animation:none!important}}
`;
