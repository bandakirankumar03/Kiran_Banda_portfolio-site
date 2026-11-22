const TOOL_LOGOS=[{"name": "Unreal Engine 5", "file": "unrealengine.svg", "wide": false}, {"name": "Maya", "file": "maya.svg", "wide": false}, {"name": "Blender", "file": "blender.svg", "wide": false}, {"name": "SpeedTree", "file": "speedtree.gif", "wide": true}, {"name": "Gaea", "file": "gaea.png", "wide": false}, {"name": "RealityCapture", "file": "realitycapture.svg", "wide": false}, {"name": "Houdini", "file": "houdini.svg", "wide": false}, {"name": "EmberGen", "file": "embergen.svg", "wide": false}, {"name": "Substance Painter", "file": "substance.svg", "wide": false}, {"name": "Photoshop", "file": "photoshop.svg", "wide": false}, {"name": "Lightroom CC", "file": "lightroom-cc.svg", "wide": false}, {"name": "After Effects", "file": "aftereffects.svg", "wide": false}, {"name": "Premiere Pro", "file": "premierepro.svg", "wide": false}, {"name": "DaVinci Resolve", "file": "davinci.png", "wide": false}, {"name": "Nuke", "file": "nuke.svg", "wide": true}];
const AI_TOOL_LOGOS=[{"name": "Claude", "file": "claude.svg", "wide": false}, {"name": "ChatGPT", "file": "chatgpt.svg", "wide": false}, {"name": "Weavy AI", "file": "weavy.svg", "wide": false}, {"name": "Meshy AI", "file": "meshy.png", "wide": false}, {"name": "ComfyUI", "file": "comfyui.svg", "wide": false}, {"name": "ElevenLabs · Music", "file": "elevenlabs.svg", "wide": false}];
function HeadlineMotion({routeKey}){
 React.useLayoutEffect(()=>{
  const page=document.querySelector('.site-page');if(!page)return;
  const selectors='h1,h2,[data-main-headline],.home-intro-title,.about-title';
  const nodes=[...page.querySelectorAll(selectors)];nodes.forEach(el=>el.classList.add('headline-reactive'));
  const mq=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');let active=null,raf=0,pending;
  const reset=()=>{if(active){active.style.setProperty('--headline-x','0px');active.style.setProperty('--headline-y','0px');active=null}};
  const write=()=>{raf=0;if(!pending)return;const {el,x,y}=pending;el.style.setProperty('--headline-x',x+'px');el.style.setProperty('--headline-y',y+'px')};
  const move=e=>{if(mq.matches||!fine.matches){leave();return}const el=e.target.closest?.('.headline-reactive');if(!el||!page.contains(el)){leave();return}if(active!==el){reset();active=el}const r=el.getBoundingClientRect();pending={el,x:Math.max(-7,Math.min(7,((e.clientX-r.left)/r.width-.5)*14)),y:Math.max(-4,Math.min(4,((e.clientY-r.top)/r.height-.5)*8))};if(!raf)raf=requestAnimationFrame(write)};
  const leave=()=>{cancelAnimationFrame(raf);raf=0;pending=null;reset()};
  page.addEventListener('pointermove',move,{passive:true});page.addEventListener('pointerleave',leave);window.addEventListener('blur',leave);mq.addEventListener('change',leave);
  return()=>{leave();page.removeEventListener('pointermove',move);page.removeEventListener('pointerleave',leave);window.removeEventListener('blur',leave);mq.removeEventListener('change',leave);nodes.forEach(el=>el.classList.remove('headline-reactive'))};
 },[routeKey]);return null;
}

const FLOAT_MOTION_GROUPS={
 cards:'.work-index-row,.ongoing-card,.study-card,.experience-card,[data-card],.radar-item,.ru-tech-card,.rn-inspiration-grid figure,.nyc-character-grid figure,.ms-valley-panels figure,.case-footer-item',
 frames:'.scene-surface,.favourite-photo,.hobby-expand-frame,.film-print,[data-photo-frame],.discovery-media,.ws-focus-stage,.about-split-lenses .lens-surface,.ru-cinema-main,.ru-cinema-previews button,.pg-photo,.rn-team-figure,.qf-pocket,.qf-glances,.qf-ribbon,.qf-ticket',
 actions:'.pc-action,.focus-explore,.project-watch-link,.qf-watch,.qf-explore,.qf-return',
 text:'h3,h4,p,.work-filter,.quiet-practice li,.portrait-side-note,.learning-hover',
 blocked:'.site-nav,.chapter-guide,.pc-image,.home-reel,.portrait-studies,.orbital-toolkit,.quiet-focus-list,dialog,[role="dialog"],.rana-production-map,.rp-wipe,.ru-reveal-frame,.nyc-comparison,.xr-comparison-frame,.rn-stage-worlds,.rn-prep-gallery,.rn-film-ribbons,.seek-video,.tap-vimeo,.rn-bts-film,.shared-films,.rn-film-collection,.qf-player,.software-marks,.tool-logo'
};

function AmbientFloat({routeKey}){
 React.useEffect(()=>{
  const page=document.querySelector('.site-page');if(!page)return;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
  const selector=FLOAT_MOTION_GROUPS.cards+','+FLOAT_MOTION_GROUPS.frames;
  const items=new Map(),visible=new Set();
  const sync=()=>items.forEach((animation,el)=>{if(visible.has(el)&&!el.matches(':hover,:focus-within')&&!document.hidden&&!document.fullscreenElement&&!document.querySelector('dialog[open]')&&!reduced.matches&&fine.matches)animation.play();else animation.pause()});
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target)});sync()});
  const register=()=>{
   items.forEach((animation,el)=>{if(!el.isConnected){animation.cancel();observer.unobserve(el);visible.delete(el);items.delete(el)}});
   page.querySelectorAll(selector).forEach(el=>{
    if(items.has(el)||el.closest(FLOAT_MOTION_GROUPS.blocked)||el.parentElement?.closest(selector))return;
    el.classList.add('ambient-float');
    const i=items.size,isLens=el.matches('.about-split-lenses .lens-surface'),animation=el.animate([{'--ambient-y':'1.75px'},{'--ambient-y':'-1.75px'},{'--ambient-y':'1.75px'}],{duration:(isLens?9400:7200)+(i%5)*450,delay:-(i%7)*830,iterations:Infinity,easing:'ease-in-out'});
    animation.pause();items.set(el,animation);observer.observe(el);
   });
  };
  register();const mutations=new MutationObserver(()=>{register();sync()});mutations.observe(page,{childList:true,subtree:true});
  page.addEventListener('pointerover',sync,{passive:true});page.addEventListener('pointerout',sync,{passive:true});page.addEventListener('focusin',sync);page.addEventListener('focusout',sync);
  document.addEventListener('visibilitychange',sync);document.addEventListener('fullscreenchange',sync);reduced.addEventListener('change',sync);fine.addEventListener('change',sync);
  return()=>{observer.disconnect();mutations.disconnect();page.removeEventListener('pointerover',sync);page.removeEventListener('pointerout',sync);page.removeEventListener('focusin',sync);page.removeEventListener('focusout',sync);document.removeEventListener('visibilitychange',sync);document.removeEventListener('fullscreenchange',sync);reduced.removeEventListener('change',sync);fine.removeEventListener('change',sync);items.forEach((animation,el)=>{animation.cancel();el.classList.remove('ambient-float')})};
 },[routeKey]);return null;
}

function FloatingSurfaces({routeKey}){
 React.useEffect(()=>{
  const page=document.querySelector('.site-page');if(!page)return;
  const fine=matchMedia('(hover:hover) and (pointer:fine)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const cards=FLOAT_MOTION_GROUPS.cards;
  const frames=FLOAT_MOTION_GROUPS.frames;
  const text=FLOAT_MOTION_GROUPS.text,actions=FLOAT_MOTION_GROUPS.actions;
  const selectors=cards+','+frames+','+actions+','+text+',img';
  const registered=new Set(),states=new Map();let active=new Set(),frame=0,last=0;
  const register=()=>page.querySelectorAll(selectors).forEach(el=>{
   if(registered.has(el)||el.closest(FLOAT_MOTION_GROUPS.blocked)||el.parentElement?.closest(cards+','+frames+','+actions))return;
   // Framed photographs move as a single object so their crop and paper edges stay intact.
   if(el.matches('img')&&el.closest(frames+',.portrait-person'))return;
   registered.add(el);el.classList.add('float-surface');
   if(el.matches(cards))el.classList.add('float-glass');
   if(el.matches(frames))el.classList.add('float-frame');
   if(el.matches(actions))el.classList.add('float-action');
  });register();
  const animate=now=>{
   const blend=1-Math.pow(.86,Math.min(3,(now-(last||now-16.67))/16.67));last=now;let moving=false;
   states.forEach((s,el)=>{
    if(!el.isConnected){states.delete(el);registered.delete(el);return;}
    s.x+=(s.tx-s.x)*blend;s.y+=(s.ty-s.y)*blend;s.t+=(s.tt-s.t)*blend;
    const settled=Math.abs(s.tx-s.x)+Math.abs(s.ty-s.y)+Math.abs(s.tt-s.t)<.015;
    if(settled){s.x=s.tx;s.y=s.ty;s.t=s.tt;}else moving=true;
    el.style.setProperty('--float-x',s.x.toFixed(3)+'px');el.style.setProperty('--float-y',s.y.toFixed(3)+'px');el.style.setProperty('--float-tilt',s.t.toFixed(3)+'deg');
    if(settled&&!active.has(el)){states.delete(el);['--float-x','--float-y','--float-tilt'].forEach(p=>el.style.removeProperty(p));}
   });frame=moving?requestAnimationFrame(animate):0;if(!moving)last=0;
  };
  const tick=()=>{if(!frame)frame=requestAnimationFrame(animate);};
  const release=()=>{active.forEach(el=>el.classList.remove('float-engaged'));active.clear();states.forEach(s=>{s.tx=0;s.ty=0;s.tt=0;});tick();};
  const move=e=>{
   if(!fine.matches||reduced.matches||e.buttons||e.target.closest('dialog,[role="dialog"]')){release();return;}
   const next=new Set();let el=e.target.closest('.float-surface')||e.target.closest('.lens-item')?.querySelector('.lens-surface.float-surface');
   while(el&&page.contains(el)){
    const r=el.getBoundingClientRect();const previous=states.get(el)||{x:0,y:0,t:0,tx:0,ty:0,tt:0};
    const nx=Math.max(-1,Math.min(1,(e.clientX-r.left-previous.x)/Math.max(1,r.width)*2-1));
    const ny=Math.max(-1,Math.min(1,(e.clientY-r.top-previous.y)/Math.max(1,r.height)*2-1));
    const isCard=el.matches(cards),isImage=el.matches(frames+',img'),isAction=el.matches(actions);const amount=isCard?4:isImage?2.5:isAction?2:el.matches('p')?1:2;
    previous.tx=nx*amount;previous.ty=ny*amount*.45-(isCard?4:isImage?2:isAction?2.5:0);previous.tt=isCard?nx*.35:isImage?nx*.2:0;
    states.set(el,previous);next.add(el);el.classList.add('float-engaged');el=el.parentElement?.closest('.float-surface');
   }
   active.forEach(el=>{if(!next.has(el)){el.classList.remove('float-engaged');const s=states.get(el);if(s){s.tx=0;s.ty=0;s.tt=0;}}});active=next;tick();
  };
  const reset=()=>{release();if(reduced.matches||!fine.matches){cancelAnimationFrame(frame);frame=0;last=0;states.forEach((s,el)=>['--float-x','--float-y','--float-tilt'].forEach(p=>el.style.removeProperty(p)));states.clear();}};
  const observer=new MutationObserver(records=>{if(records.some(r=>r.addedNodes.length||r.removedNodes.length)){registered.forEach(el=>{if(!el.isConnected){registered.delete(el);states.delete(el);active.delete(el)}});register();}});observer.observe(page,{childList:true,subtree:true});
  page.addEventListener('pointermove',move,{passive:true});page.addEventListener('pointerdown',reset,{passive:true});page.addEventListener('pointerleave',release);window.addEventListener('blur',release);window.addEventListener('scroll',release,{passive:true});fine.addEventListener('change',reset);reduced.addEventListener('change',reset);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();page.removeEventListener('pointermove',move);page.removeEventListener('pointerdown',reset);page.removeEventListener('pointerleave',release);window.removeEventListener('blur',release);window.removeEventListener('scroll',release);fine.removeEventListener('change',reset);reduced.removeEventListener('change',reset);registered.forEach(el=>{el.classList.remove('float-surface','float-glass','float-engaged','float-frame','float-action');['--float-x','--float-y','--float-tilt'].forEach(p=>el.style.removeProperty(p));});};
 },[routeKey]);return <AmbientFloat routeKey={routeKey}/>;
}
