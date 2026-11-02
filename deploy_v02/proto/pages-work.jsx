// Selected Work layout: direct project links with gesture-driven previews.
const FOCUS_PROJECT_SUMMARIES={
 'xr01-chinese-temple':['A world built for the camera.','Unreal environment development and foliage optimization for a virtual production film.'],
 'xr02-1920s-nyc':['Back to industrial New York.','An 1890s-inspired environment, brought to the virtual production stage.'],
 'rainy-forest':['A railway from a dream.','Mountain light, forest, and a winding railway, brought together in Unreal.'],
 'ranasthala':['Real stone. An imagined arena.','Photogrammetry captured across India becomes the world of my virtual production film.'],
 'photogrammetry-archive':['The details worth capturing.','Real objects, captured in 3D and explored through studio presentations and interactive studies.'],
 'unreal-environment-studies':['Two worlds. A search for atmosphere.','Golden Rain and Hidden Realm explore lighting, materials, and cinematic cameras.'],
 'vfx-compositing-works':['Where the layers come together.','Selected compositing work from my undergraduate years.']
};
function WorkPage(){
 return <div className="work-page work-selected"><header className="ws-header"><h1>The <em>shot list.</em></h1></header><main className="ws-content"><WorkFocusGallery list={PROJECTS}/></main><Footer/></div>
}
function WorkFocusGallery({list,motion='2',initialIndex=0}){
 const first=Math.min(initialIndex,list.length-1);
 const [index,setIndex]=React.useState(first),[dragging,setDragging]=React.useState(false);
 const indexRef=React.useRef(first),gesture=React.useRef(null),rail=React.useRef(null),gallery=React.useRef(null),indicator=React.useRef(null),suppressClick=React.useRef(0);
 const p=list[index]||list[0];
 const summary=FOCUS_PROJECT_SUMMARIES[p.slug];
 const select=React.useCallback(i=>{const next=Math.max(0,Math.min(list.length-1,i));if(gallery.current)gallery.current.dataset.direction=next>=indexRef.current?'next':'previous';indexRef.current=next;setIndex(next)},[list.length]);
 React.useLayoutEffect(()=>{
  const el=rail.current,bar=indicator.current;
  const place=()=>{const active=el?.querySelector('[data-active="true"]');if(!active||!bar)return;
   bar.style.setProperty('--bar-x',active.offsetLeft+'px');bar.style.setProperty('--bar-y',active.offsetTop+'px');bar.style.width=active.offsetWidth+'px';bar.style.height=active.offsetHeight+'px';
   if(el.scrollWidth>el.clientWidth+2){const box=el.getBoundingClientRect(),r=active.getBoundingClientRect();if(r.left<box.left||r.right>box.right)el.scrollTo({left:active.offsetLeft-(el.clientWidth-active.offsetWidth)/2,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}
  };
  place();const observer=new ResizeObserver(place);observer.observe(el);return()=>observer.disconnect();
 },[index]);
 React.useEffect(()=>{
  const el=gallery.current;let total=0,last=0,cooldown=0;
  const wheel=e=>{if(e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)||list.length<2)return;const amount=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?el.clientHeight:1),dir=Math.sign(amount);if(!dir)return;
   if((dir<0&&indexRef.current===0)||(dir>0&&indexRef.current===list.length-1))return;
   e.preventDefault();const now=performance.now();if(now-last>180)total=0;last=now;total+=amount;
   if(now<cooldown||Math.abs(total)<38)return;select(indexRef.current+Math.sign(total));total=0;cooldown=now+380;
  };
  el.addEventListener('wheel',wheel,{passive:false});return()=>el.removeEventListener('wheel',wheel);
 },[list.length,select]);

 const start=e=>{if(!e.isPrimary||(e.pointerType==='mouse'&&e.button!==0))return;gesture.current={id:e.pointerId,x:e.clientX,y:e.clientY,index:indexRef.current,moved:false,captured:false};};
 const move=e=>{const g=gesture.current;if(!g||g.id!==e.pointerId)return;const dx=e.clientX-g.x,dy=e.clientY-g.y;if(Math.hypot(dx,dy)>8)g.moved=true;
  if(!g.captured&&Math.abs(dy)>8&&Math.abs(dy)>Math.abs(dx)*1.1){g.captured=true;e.currentTarget.setPointerCapture(e.pointerId);setDragging(true)}
  if(g.captured){e.preventDefault();gallery.current.style.setProperty('--drag-pull',Math.max(-9,Math.min(9,(dy%80)*.12))+'px');select(g.index+Math.round(dy/80));}
 };
 const finish=e=>{const g=gesture.current;if(!g)return;if(g.moved)suppressClick.current=performance.now()+450;gesture.current=null;setDragging(false);gallery.current.style.setProperty('--drag-pull','0px');if(e.currentTarget.hasPointerCapture(g.id))e.currentTarget.releasePointerCapture(g.id);};
 const keys=e=>{if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();const at=e.key==='Home'?0:e.key==='End'?list.length-1:Math.max(0,Math.min(list.length-1,indexRef.current+(e.key==='ArrowDown'?1:-1)));select(at);rail.current.querySelectorAll('[data-focus-index]')[at]?.focus({preventScroll:true});};
 const drift=e=>{if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;const el=e.currentTarget,r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty('--focus-x',x*12+'px');el.style.setProperty('--focus-y',y*8-2+'px');el.style.setProperty('--focus-ry',x*1.2+'deg');el.style.setProperty('--focus-rx',-y*.9+'deg');};
 const resetBar=()=>{gallery.current?.style.setProperty('--bar-hover-x','0px');gallery.current?.style.setProperty('--bar-hover-y','0px');};
 const floatBar=e=>{if(gesture.current||e.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const active=e.target.closest('.ws-focus-link[data-active="true"]');if(!active){resetBar();return}const r=active.getBoundingClientRect();
  gallery.current.style.setProperty('--bar-hover-x',((e.clientX-r.left)/r.width-.5)*6+'px');gallery.current.style.setProperty('--bar-hover-y',((e.clientY-r.top)/r.height-.5)*4-2+'px');
 };
 const settle=e=>['--focus-x','--focus-y','--focus-rx','--focus-ry'].forEach(k=>e.currentTarget.style.setProperty(k,k.includes('rx')||k.includes('ry')?'0deg':'0px'));
 return <div className="ws-focus focus-gallery" ref={gallery} data-motion={motion} data-dragging={dragging}>
  <style>{FOCUS_GALLERY_CSS}</style>
  <div className="ws-focus-list" ref={rail} role="group" aria-label="Projects" onPointerDown={start} onPointerMove={e=>{move(e);floatBar(e)}} onPointerLeave={resetBar} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish} onKeyDown={keys} onClickCapture={e=>{if(performance.now()<suppressClick.current){e.preventDefault();e.stopPropagation()}}}>
   <div className="focus-selection-bar" ref={indicator} aria-hidden="true"/>
   {list.map((item,i)=>{const distance=Math.abs(i-index);return <a className="ws-focus-link" key={item.slug} href={'#/case/'+item.slug} data-focus-index={i} data-active={index===i} data-distance={distance} style={{'--name-opacity':[1,.52,.26,.1,.045,.025,.015][Math.min(distance,6)],'--name-scale':1-Math.min(distance,4)*.012,'--name-depth':Math.min(distance,4)*-3+'px'}} aria-current={index===i?'true':undefined} aria-label={item.title} draggable="false"><span>{item.title}</span><small>{item.kind}</small></a>})}
  </div>
  <article className="ws-focus-stage" aria-label={p.title+' preview'} onPointerMove={drift} onPointerLeave={settle}>
   <div className="focus-images">{list.map((item,i)=><div key={item.slug} className={'focus-layer'+(i===index?' is-active':'')} aria-hidden={i!==index} style={{'--layer-offset':i<index?'-24px':'24px'}}>{item.heroVideo&&i===index?<TapVideo src={item.heroVideo} poster={item.hero} title={item.title+' preview'}/>:<img src={item.hero} alt={item.title+' — '+item.kind} loading={i<2?'eager':'lazy'} draggable="false"/>}</div>)}</div>
   <div className="focus-shade"/>
   <div className="ws-focus-copy" key={p.slug}><p>{summary?<><em>{summary[0]}</em><span>{summary[1]}</span></>:p.tagline}</p><a className="focus-explore" href={'#/case/'+p.slug} aria-label={'Explore '+p.title}><span>Explore the project</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></a></div>
  </article>
 </div>
}
const FOCUS_GALLERY_CSS=`
.work-selected{max-width:1680px;margin:auto}.work-selected .ws-header{padding:clamp(28px,4vw,48px) var(--pad) 38px;display:flex;flex-wrap:wrap;align-items:end;justify-content:space-between;gap:30px}.work-selected .ws-header h1{font:400 clamp(64px,8vw,124px)/.98 var(--serif);letter-spacing:-.055em;margin:0}.work-selected .ws-header h1 em{font-weight:400;color:var(--accent)}.work-selected .ws-content{padding:8px var(--pad) 75px;min-height:580px}
.focus-gallery{--focus-ease:cubic-bezier(.16,1,.3,1);display:grid;grid-template-columns:minmax(250px,.8fr) minmax(0,2fr);gap:36px;align-items:start}
.focus-gallery .ws-focus-list{display:grid;align-content:start;gap:2px;user-select:none;-webkit-user-select:none;touch-action:pan-x}
.focus-gallery .ws-focus-link{display:block;position:relative;text-decoration:none;text-align:left;color:var(--ink);background:none;border:0;padding:16px 18px 16px 0;opacity:var(--name-opacity);transform:translateX(var(--name-depth)) scale(var(--name-scale));transform-origin:left center;transition:opacity .85s ease,transform 1s var(--focus-ease);-webkit-user-drag:none}
.focus-gallery .ws-focus-link>span{display:block;color:var(--ink);font:400 clamp(22px,2vw,31px)/1.1 var(--serif);letter-spacing:-.6px;transition:color .35s}.focus-gallery .ws-focus-link small{display:block;font:9px/1.6 var(--mono);color:var(--dim);margin-top:7px}
.focus-gallery .ws-focus-link[data-active=true]>span{font-weight:500;color:var(--accent);text-shadow:0 0 26px color-mix(in srgb,var(--accent) 15%,transparent)}.focus-gallery .ws-focus-link:focus-visible{opacity:1}
.focus-gallery .ws-focus-stage{--focus-x:0px;--focus-y:0px;--focus-rx:0deg;--focus-ry:0deg;position:sticky;top:30px;min-width:0;height:clamp(460px,43vw,635px);border:1px solid color-mix(in srgb,var(--ink) 13%,transparent);border-radius:10px;overflow:hidden;background:var(--bg);animation:none;isolation:isolate;box-shadow:inset 0 1px 0 #ffffff1a,0 28px 55px -38px #000b;translate:var(--focus-x) var(--focus-y);transform:perspective(1100px) rotateX(var(--focus-rx)) rotateY(var(--focus-ry));transition:translate .7s var(--focus-ease),transform .8s var(--focus-ease),box-shadow .6s}
.focus-gallery .ws-focus-stage:after{display:none}.focus-gallery .ws-focus-stage:hover{box-shadow:inset 0 1px 0 #ffffff24,0 36px 65px -36px #000c}
.focus-gallery .focus-images,.focus-gallery .focus-layer{position:absolute;inset:0}.focus-gallery .focus-layer{opacity:0;transform:translateY(var(--layer-offset)) scale(1.055);transition:opacity .65s ease,transform .9s var(--focus-ease);pointer-events:none;z-index:0}.focus-gallery .focus-layer.is-active{opacity:1;transform:translateY(0) scale(1.025);pointer-events:auto;z-index:1}
.focus-gallery .focus-layer img,.focus-gallery .focus-layer video{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 50%;filter:saturate(.95)}.focus-gallery .focus-shade{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 32%,#000b 100%)}
.focus-gallery .ws-focus-copy{position:absolute;z-index:3;bottom:0;left:0;right:0;padding:clamp(25px,3vw,40px);display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:25px;color:#F4F0E5;pointer-events:none;animation:focusCaptionArrive .7s var(--focus-ease) both}.focus-gallery .ws-focus-copy p{margin:0;max-width:44ch}.focus-gallery .ws-focus-copy p em{display:block;font:400 italic clamp(23px,2.2vw,32px)/1.2 var(--serif);letter-spacing:-.55px;color:var(--accent);text-wrap:balance;margin-bottom:11px}.focus-gallery .ws-focus-copy p>span{display:block;font:13px/1.75 'Manrope',Arial,sans-serif;color:#F4F0E5dd;max-width:46ch}.focus-gallery .focus-explore{pointer-events:auto;display:flex;align-items:center;gap:20px;white-space:nowrap;padding:14px 17px;border:1px solid #ffffff35;border-radius:30px;background:linear-gradient(120deg,#ffffff10,#ffffff03);backdrop-filter:blur(12px);box-shadow:inset 0 1px 0 #ffffff12;font:10px/1.4 var(--mono);color:var(--ink);transition:translate .55s var(--focus-ease),border-color .4s,background .4s,box-shadow .4s}.focus-gallery .focus-explore svg{width:17px;height:17px;transition:translate .55s var(--focus-ease);color:var(--accent)}.focus-gallery .focus-explore:hover{translate:0 -3px;border-color:color-mix(in srgb,var(--accent) 65%,transparent);background:color-mix(in srgb,var(--accent) 9%,transparent);box-shadow:inset 0 1px 0 #ffffff18,0 8px 24px #0003}.focus-gallery .focus-explore:hover svg{translate:2px -2px}
@media(max-width:1150px){.focus-gallery .ws-focus-copy{grid-template-columns:1fr;gap:20px}.focus-gallery .focus-explore{justify-self:start}.focus-gallery .ws-focus-copy p>span{max-width:48ch}}

.focus-gallery a:focus-visible{outline:2px solid var(--accent);outline-offset:4px}
@keyframes focusCaptionArrive{from{opacity:0;translate:0 9px}to{opacity:1;translate:0 0}}
@media(min-width:1600px){.focus-gallery{gap:48px}.focus-gallery .ws-focus-link{padding-top:19px;padding-bottom:19px}}
@media(max-width:1150px){.work-selected .ws-header{display:block}.focus-gallery{grid-template-columns:280px minmax(0,1fr);gap:25px}.focus-gallery .ws-focus-stage{height:560px}}
@media(max-width:800px){.work-selected .ws-header{padding-top:28px;padding-bottom:28px}.work-selected .ws-header h1{font-size:clamp(56px,11vw,86px)}.work-selected .ws-content{padding-bottom:55px}.focus-gallery{display:flex;flex-direction:column;gap:20px}.focus-gallery .ws-focus-list{display:flex;overflow-x:auto;gap:4px;scrollbar-width:none;padding-bottom:9px;width:100%}.focus-gallery .ws-focus-list::-webkit-scrollbar{display:none}.focus-gallery .ws-focus-link{flex:0 0 205px;min-height:86px;padding:14px 16px 14px 12px}.focus-gallery .ws-focus-link>span{font-size:24px}.focus-gallery .ws-focus-stage{position:relative;top:auto;width:100%;height:480px;flex:none}}
@media(max-width:520px){.focus-gallery .ws-focus-link{flex-basis:178px;min-height:80px}.focus-gallery .ws-focus-link>span{font-size:21px}.focus-gallery .ws-focus-link small{font-size:8px}.focus-gallery .ws-focus-stage{height:410px}.focus-gallery .ws-focus-copy{padding:24px}.focus-gallery .ws-focus-copy p em{font-size:24px}.focus-gallery .ws-focus-copy p>span{font-size:12px}}
@media(hover:none),(pointer:coarse){.focus-gallery .ws-focus-stage,.focus-gallery .ws-focus-link:hover{translate:0 0;transform:none}}

/* A single floating surface follows the active project, rather than separate row boxes. */
.focus-gallery .ws-focus-list{position:relative;gap:7px;isolation:isolate;translate:0 var(--drag-pull,0px);transition:translate .65s var(--focus-ease)}
.focus-gallery .ws-focus-link{min-height:80px;padding:16px 20px;display:flex;flex-direction:column;justify-content:center;z-index:1;transform:translateX(0) scale(var(--name-scale));transform-origin:24px center}
.focus-gallery .ws-focus-link>span{font-size:clamp(23px,1.8vw,29px);line-height:1.16}
.focus-gallery .ws-focus-link[data-active=true]{transform:translateX(5px) scale(1.025)}
.focus-gallery .focus-selection-bar{position:absolute;left:0;top:0;z-index:0;pointer-events:none;border:1px solid color-mix(in srgb,var(--accent) 19%,transparent);border-radius:15px;background:linear-gradient(115deg,color-mix(in srgb,var(--accent) 10%,transparent),color-mix(in srgb,var(--ink) 3%,transparent) 65%,transparent);box-shadow:inset 0 1px 0 #ffffff13,0 14px 28px -24px #000,0 0 24px -16px var(--accent);backdrop-filter:blur(12px);transform:translate(var(--bar-x,0px),var(--bar-y,0px));translate:var(--bar-hover-x,0px) var(--bar-hover-y,0px);transition:translate .65s var(--focus-ease),transform .85s var(--focus-ease),height .7s var(--focus-ease),width .7s var(--focus-ease)}
.focus-gallery .focus-selection-bar:before{content:'';position:absolute;width:2px;top:24%;bottom:24%;left:0;border-radius:2px;background:var(--accent);box-shadow:0 0 13px color-mix(in srgb,var(--accent) 35%,transparent)}
@media(max-width:800px){.focus-gallery .ws-focus-list{gap:10px;min-height:108px}.focus-gallery .ws-focus-link{flex:0 0 205px;min-height:96px;padding:16px 20px}.focus-gallery .ws-focus-link>span{font-size:23px}}
@media(max-width:520px){.focus-gallery .ws-focus-link{flex-basis:190px}.focus-gallery .ws-focus-link>span{font-size:21px}}

/* 2. Soft lens: focus replaces a hard disappearance. */
.focus-gallery[data-motion="2"] .ws-focus-link{opacity:calc(var(--name-opacity) * .8 + .14);filter:blur(calc((1 - var(--name-opacity)) * 1.4px));transform:scale(calc(.94 + var(--name-opacity) * .06));transition:opacity 1s ease,filter 1s ease,transform 1s var(--focus-ease)}.focus-gallery[data-motion="2"] .ws-focus-link[data-active=true]{opacity:1;filter:none;transform:translateX(10px) scale(1.07)}.focus-gallery[data-motion="2"] .focus-selection-bar{border-color:#ffffff10;background:linear-gradient(90deg,color-mix(in srgb,var(--accent) 8%,transparent),transparent);box-shadow:0 0 45px -28px var(--accent);border-radius:25px}.focus-gallery[data-motion="2"] .focus-layer{transform:scale(1.13);filter:blur(4px);transition:opacity .85s,filter 1.1s,transform 1.4s var(--focus-ease)}.focus-gallery[data-motion="2"] .focus-layer.is-active{transform:scale(1.025);filter:none}

.focus-gallery .ws-focus-link[data-active=true]{translate:var(--bar-hover-x,0px) var(--bar-hover-y,0px);transition:opacity 1s ease,filter 1s ease,transform 1s var(--focus-ease),translate .65s var(--focus-ease)}
@media(max-width:800px){.focus-gallery[data-motion="2"] .ws-focus-link[data-active=true]{transform:scale(1.025)}.focus-gallery .ws-focus-link{transform-origin:center}}
@media(hover:none),(pointer:coarse),(prefers-reduced-motion:reduce){.focus-gallery .focus-selection-bar,.focus-gallery .ws-focus-link[data-active=true]{translate:0 0}}
@media(prefers-reduced-motion:reduce){.focus-gallery[data-motion="2"] .focus-layer{filter:none;transform:none}}

@media(prefers-reduced-motion:reduce){.focus-gallery *{animation:none!important;transition:none!important}.focus-gallery .ws-focus-stage,.focus-gallery .ws-focus-list{translate:0 0;transform:none}.focus-gallery .focus-layer,.focus-gallery .focus-layer.is-active{transform:none}.focus-gallery .ws-focus-link:hover{translate:0 0}}
`;
Object.assign(window,{WorkPage,WorkFocusGallery});
