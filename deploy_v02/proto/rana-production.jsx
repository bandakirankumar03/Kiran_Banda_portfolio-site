const RANA_BTS_PHOTOS={
 'collaborative-planning':'Working together on the Ranasthala story and environment',
 'script-and-shot-lists':'The Ranasthala script, shot lists and production planning notes',
 'desert-stage':'Crew filming on the practical sand set with the desert environment behind them',
 'sand-stage':'The practical sand pit and handmade rocks on the XR stage',
 'rocks-on-set':'Handmade rocks dressed with sand and practical vegetation',
 'making-rocks':'The production design team crafting rocks in the workshop',
 'rocks-in-workshop':'Practical rocks before painting and dressing',
 'sand-bags':'Bags of sand ready to be moved to the stage',
 'reuse-store':'Reused materials and props in storage',
 'reuse-wardrobe':'Costumes and materials available for reuse',
 'stage-frame':'Building the wooden frame for the practical set',
 'set-dressing':'Dressing the sand and practical rocks between takes',
 'props-prep':'Preparing practical props for the shoot',
 'costume-prep':'A costume adjustment before filming',
 'crew-planning':'The crew planning a shot together',
 'shot-list':'Working through the shot list on set',
 'slate-notes':'Production notes and slate beside the live set',
 'live-operation':'Kiran operating the Unreal environment at the virtual production workstation',
 'volume-operator':'Operating the live LED stage from the workstation',
 'stage-fix':'Making an adjustment to the set before the next take',
 'blocking':'Working through a shot with the crew and performer',
 'light-check':'Checking a physical lighting fixture',
 'lighting-setup':'Crew adjusting physical lighting in front of the LED wall',
 'volume-light':'Camera and performer surrounded by light from the virtual environment',
 'screen-light':'Lighting and camera working together on the volume',
 'led-green-screen':'The LED wall set to green with tracking markers for a VFX shot',
 'temple-stage':'The temple environment with camera and practical set in front',
 'temple-wide':'The temple environment filling the LED volume',
 'temple-haze':'Atmosphere and performance on the temple set',
 'camera-take':'A performer framed by the cinema camera in the arena environment',
 'crane-wide':'The camera crane working across the practical set',
 'rig-camera':'The camera team preparing a handheld rig',
 'camera-operation':'Working at the cinema camera on the XR stage',
 'crew-camera':'The camera team collaborating on the next setup',
 'crew-set':'Dressing the practical set together',
 'crew-wrap':'Crew together at the end of a setup',
 'arena-slate':'The Ranasthala slate against the arena environment',
 'wrap-slate':'Kiran with the slate after the three-day shoot',
 'wrap-keepsakes':'Ranasthala keepsakes made for the team',
 'workshop-team':'The production design team building practical rocks together'
};

function RanaBTSFilm({base,film}){
 const title=film?.title||'Ranasthala behind the scenes film';
 const video=React.useRef(null),frame=React.useRef(null),manual=React.useRef(false),inView=React.useRef(false);
 const [playing,setPlaying]=React.useState(false),[sound,setSound]=React.useState(false),[progress,setProgress]=React.useState(0);
 React.useEffect(()=>{
  const v=video.current,reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const update=()=>{if(inView.current&&!document.hidden&&!manual.current&&!reduced.matches)v.play().catch(()=>{});else v.pause()};
  const observer=new IntersectionObserver(([entry])=>{inView.current=entry.isIntersecting;update()},{threshold:.25});
  observer.observe(v);document.addEventListener('visibilitychange',update);reduced.addEventListener('change',update);
  return()=>{v.pause();observer.disconnect();document.removeEventListener('visibilitychange',update);reduced.removeEventListener('change',update)};
 },[]);
 const toggle=()=>{const v=video.current;manual.current=!v.paused;if(v.paused)v.play().catch(()=>{});else v.pause()};
 const toggleSound=()=>{const v=video.current;v.muted=sound;setSound(!sound);if(v.paused){manual.current=false;v.play().catch(()=>{})}};
 const fullscreen=()=>{if(document.fullscreenElement)document.exitFullscreen?.();else frame.current.requestFullscreen?.().catch(()=>{})};
 return <div className="rn-bts-film" ref={frame} role="group" aria-label={title}>
  <video ref={video} src={film?.src||base+'on-set-polished-wrap.mp4'} poster={film?.poster||base+'on-set-beatcut-poster.webp'} muted={!sound} playsInline preload="metadata" controls={false} role="button" tabIndex={0} aria-label={(playing?'Pause':'Play')+' '+title} aria-pressed={playing} onClick={toggle} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}}} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>{manual.current=true;setPlaying(false)}} onTimeUpdate={e=>{const v=e.currentTarget;setProgress(v.duration?v.currentTime/v.duration:0)}}/>
  <div className="rn-bts-film-controls">
   <button type="button" onClick={toggleSound} aria-label={(sound?'Mute ':'Enable ')+title+' soundtrack'} aria-pressed={sound}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M4 9h4l5-4H4z"/><path d="M13 5v14l-5-4"/>{sound?<><path d="M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14"/></>:<path d="m17 9 5 6m0-6-5 6"/>}</svg><span>Sound</span>
   </button>
   <button type="button" onClick={fullscreen} aria-label={'Expand '+title+' to full screen'}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4"/></svg></button>
  </div>
  <progress className="rn-bts-film-progress" max="1" value={progress} aria-label={title+' playback progress'}/>
 </div>;
}

function RanaPhotoLoop({base,photos,className='',pace=3400,delay=0}){
 const root=React.useRef(null),visible=React.useRef(false),held=React.useRef(false);
 const [active,setActive]=React.useState(0);
 React.useEffect(()=>{
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const observer=new IntersectionObserver(([entry])=>{visible.current=entry.isIntersecting},{threshold:.15});
  observer.observe(root.current);
  let timer;
  const step=()=>{if(visible.current&&!held.current&&!document.hidden&&!reduced.matches&&!document.querySelector('dialog[open]'))setActive(i=>(i+1)%photos.length);timer=setTimeout(step,pace)};
  timer=setTimeout(step,pace+delay);
  return()=>{observer.disconnect();clearTimeout(timer)};
 },[photos.length,pace,delay]);
 return <div ref={root} className={'rn-photo-loop '+className} data-photo-frame="" data-active-photo={photos[active]} onPointerEnter={()=>{held.current=true}} onPointerLeave={()=>{held.current=false}} onFocusCapture={()=>{held.current=true}} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))held.current=false}}>
  {photos.map((file,i)=><div key={file} className={'rn-photo-slide'+(active===i?' is-active':'')} aria-hidden={active!==i} inert={active!==i?'':undefined}><img src={base+file+'.webp'} alt={RANA_BTS_PHOTOS[file]} loading="lazy" decoding="async" role={active===i?'button':undefined} aria-hidden={active!==i} tabIndex={active===i?0:-1} draggable={false}/></div>)}
 </div>;
}

function RanaProductionChapter({base}){
 const bts=base+'bts/';
 return <div className="rn-production-chapter" id="on-set">
  <style>{RANA_PRODUCTION_STYLE}</style>
  <section className="rn-shoot-section" aria-labelledby="rn-shoot-title">
   <Reveal className="rn-bts-heading"><h2 id="rn-shoot-title">Three days.<br/><em>Two worlds.</em></h2><div><p>Two environments. One XR stage.<br/>A student film brought to life, together.</p><dl className="rn-shoot-facts"><div><dt>Shoot</dt><dd>3 days</dd></div><div><dt>Environments</dt><dd>2</dd></div><div><dt>Camera</dt><dd>24 FPS</dd></div></dl></div></Reveal>
   <div className="rn-world-pair rn-world-loops"><Reveal as="figure"><RanaPhotoLoop base={bts} photos={['desert-stage','camera-take','sand-stage','arena-slate']} pace={3300}/><figcaption>The desert, on stage.</figcaption></Reveal><Reveal as="figure"><RanaPhotoLoop base={bts} photos={['temple-stage','temple-haze','temple-wide','volume-light']} pace={3800} delay={850}/><figcaption>The architecture, in camera.</figcaption></Reveal></div>
  </section>
  <section className="rn-making-section" aria-labelledby="rn-making-title">
   <Reveal className="rn-bts-heading"><h2 id="rn-making-title">Many hats.<br/><em>One film.</em></h2><p>Writer. Director. Producer.<br/>Whatever the day needed.</p></Reveal>
   <div className="rn-story-scenes">
    <Reveal as="article" className="rn-story-scene rn-story-prep">
     <div className="rn-story-words"><h3>From script<br/><em>to sand.</em></h3><p>Shot lists, schedules and logistics. Then 500 lb of sand, handmade rocks and a lot of reused materials.</p></div>
     <div className="rn-story-photos"><RanaPhotoLoop base={bts} className="rn-story-main" photos={['making-rocks','stage-frame','crew-set','set-dressing']} pace={3400}/><RanaPhotoLoop base={bts} className="rn-story-inset" photos={['sand-bags','shot-list','rocks-in-workshop','reuse-store']} pace={3100} delay={1000}/></div>
    </Reveal>
    <Reveal as="article" className="rn-story-scene rn-story-fixes">
     <div className="rn-story-words"><h3>Big problems.<br/><em>Surprisingly small fixes.</em></h3><p>A slow load. A last-minute change. Find the fix, keep the day moving, get the next take.</p></div>
     <div className="rn-story-photos"><RanaPhotoLoop base={bts} className="rn-story-main" photos={['live-operation','stage-fix','crew-planning','blocking']} pace={3600}/><RanaPhotoLoop base={bts} className="rn-story-inset" photos={['costume-prep','props-prep','light-check','slate-notes']} pace={3200} delay={1100}/></div>
    </Reveal>
    <Reveal as="article" className="rn-story-scene rn-story-takes">
     <div className="rn-story-words"><h3>One more<br/><em>take.</em></h3><p>Camera, lighting and live stage operation. Unreal, Disguise and custom controls—learning with every setup.</p></div>
     <div className="rn-story-photos"><RanaPhotoLoop base={bts} className="rn-story-main" photos={['crane-wide','screen-light','crew-camera','led-green-screen']} pace={3500}/><RanaPhotoLoop base={bts} className="rn-story-inset" photos={['rig-camera','volume-operator','lighting-setup','camera-operation']} pace={3000} delay={700}/></div>
    </Reveal>
   </div>
  </section>
  <section className="rn-crew-section" aria-labelledby="rn-crew-title">
   <Reveal className="rn-bts-heading rn-team-heading"><h2 id="rn-crew-title">The people<br/><em>behind the frame.</em></h2><div><p>My first film set. A lot of different roles.<br/>An incredible amount learned.</p><p className="rn-crew-thanks">None of it happens alone.</p></div></Reveal>
   <Reveal as="figure" className="rn-crew-portrait"><img src={bts+'team.webp'} alt="The Ranasthala cast and crew together on the XR stage after filming" loading="lazy" width="2200" height="1650"/><figcaption>Three shooting days. Everyone brought something.</figcaption></Reveal>
   <Reveal className="rn-bts-heading rn-film-heading rn-film-ending"><h2>Behind<br/><em>the scenes.</em></h2></Reveal>
   <Reveal className="rn-bts-feature"><RanaBTSFilm base={bts}/></Reveal>
  </section>
 </div>;
}

const RANA_PRODUCTION_STYLE=`
.rn-production-chapter{margin-top:clamp(65px,8vw,130px);padding-top:clamp(40px,5vw,75px);border-top:1px solid var(--hair);--bts-ease:cubic-bezier(.22,.61,.36,1)}
.rn-production-chapter section{margin:0 0 clamp(70px,8vw,130px)}
.rn-production-chapter .rn-bts-heading{display:grid;grid-template-columns:1.1fr 1fr;align-items:center;gap:clamp(28px,6vw,85px);margin-bottom:36px}
.rn-production-chapter .rn-bts-heading h2{margin:0;font-size:clamp(38px,4.7vw,70px)}
.rn-production-chapter .rn-bts-heading h2 em{color:var(--accent)}
.rn-production-chapter .rn-bts-heading p{font:15px/1.85 'Manrope',Arial,sans-serif;max-width:46ch}
.rn-shoot-facts{display:flex;gap:clamp(24px,4vw,60px);margin:28px 0 0}
.rn-shoot-facts div{display:flex;flex-direction:column-reverse;gap:7px}
.rn-shoot-facts dt{font:9px/1.4 var(--mono);color:var(--dim);letter-spacing:.5px}
.rn-shoot-facts dd{margin:0;font:400 26px/1.2 var(--serif);color:var(--ink)}
.rn-bts-film{position:relative;aspect-ratio:16/9;background:#090d0b;isolation:isolate;overflow:hidden;border-radius:5px;box-shadow:0 25px 70px -45px #000,inset 0 1px #fff1}
.rn-bts-film video{display:block;width:100%;height:100%;object-fit:contain;cursor:none!important}
.rn-bts-film video:focus-visible{outline:2px solid var(--accent);outline-offset:-5px}
.rn-bts-film-controls{position:absolute;left:0;bottom:2px;right:0;display:flex;justify-content:space-between;align-items:center;padding:24px 18px 14px;background:linear-gradient(transparent,#0009);pointer-events:none}
.rn-bts-film-controls button{pointer-events:auto;display:flex;align-items:center;gap:10px;min-width:40px;min-height:40px;border:0;border-radius:6px;padding:8px;background:#090d0b88;color:#f4f0e5;backdrop-filter:blur(10px);font:10px/1.5 var(--mono);cursor:none!important;transition:color .35s,background .35s}
.rn-bts-film-controls button[aria-pressed=true]{color:var(--accent)}
.rn-bts-film-controls button:hover{background:#090d0be6}
.rn-bts-film-controls svg{width:19px;height:19px;flex-shrink:0}
.rn-bts-film-controls button:focus-visible{outline:1px solid var(--accent);outline-offset:3px}
.rn-bts-film-progress{appearance:none;-webkit-appearance:none;position:absolute;inset:auto 0 0;width:100%;height:2px;border:0;margin:0;background:#ffffff18;pointer-events:none}
.rn-bts-film-progress::-webkit-progress-bar{background:#ffffff18}
.rn-bts-film-progress::-webkit-progress-value{background:var(--accent)}
.rn-bts-film-progress::-moz-progress-bar{background:var(--accent)}
.rn-bts-film:fullscreen{width:100vw;height:100dvh;aspect-ratio:auto;border-radius:0;display:grid;place-items:center}
.rn-world-pair{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:27px}
.rn-production-chapter figure{margin:0;min-width:0}
.rn-production-chapter figure img{width:100%;height:auto;display:block;object-fit:contain;border-radius:3px}
.rn-production-chapter figcaption{font:10px/1.65 var(--mono);color:var(--dim);margin-top:11px}
.rn-photo-loop{position:relative;aspect-ratio:3/2;width:100%;min-width:0;isolation:isolate}
.rn-photo-slide{position:absolute;inset:0;opacity:0;visibility:hidden;pointer-events:none;transform:translate3d(15px,5px,0) rotate(.6deg);transition:opacity 1s ease,transform 1.65s var(--bts-ease),visibility 1s}
.rn-photo-slide:nth-child(even){transform:translate3d(-12px,-4px,0) rotate(-.5deg)}
.rn-photo-slide.is-active{opacity:1;visibility:visible;pointer-events:auto;transform:translate3d(0,0,0) rotate(0)}
.rn-photo-loop .rn-photo-slide img{width:100%;height:100%;object-fit:contain;display:block;border-radius:3px}
.rn-photo-slide img:focus-visible{outline:2px solid var(--accent);outline-offset:5px}
.rn-world-loops{align-items:start;gap:clamp(18px,4vw,55px);padding-bottom:15px}
.rn-world-loops figure:nth-child(2){margin-top:clamp(25px,4vw,60px)}
.rn-story-scenes{display:grid;gap:clamp(65px,8vw,115px);padding-top:28px}
.rn-story-scene{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.5fr);gap:clamp(30px,5vw,80px);align-items:center;min-width:0}
.rn-story-words{padding-bottom:25px}
.rn-production-chapter .rn-story-words h3{font:400 clamp(31px,3.5vw,50px)/1.07 var(--serif);letter-spacing:-1.1px;margin:0 0 22px}
.rn-story-words h3 em{color:var(--accent);font-weight:400}
.rn-production-chapter .rn-story-words p{font:13px/1.85 'Manrope',Arial,sans-serif;max-width:34ch;color:var(--dim)}
.rn-story-photos{position:relative;min-width:0;padding:0 0 5% 8%}
.rn-story-inset{width:36%;aspect-ratio:4/5;margin-top:-23%;margin-left:-8%;z-index:2;filter:drop-shadow(0 12px 12px #0007)}
.rn-story-inset .rn-photo-slide img{background:var(--bg);padding:5px;border-radius:1px}
.rn-story-fixes{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr)}
.rn-story-fixes .rn-story-words{grid-column:2;grid-row:1;padding-left:15px}
.rn-story-fixes .rn-story-photos{grid-column:1;grid-row:1;padding:0 10% 5% 0}
.rn-story-fixes .rn-story-inset{margin-left:78%;width:38%;margin-top:-25%}
.rn-production-chapter .rn-story-fixes h3{font-size:clamp(31px,3.3vw,46px)}
.rn-production-chapter .rn-film-heading{margin-bottom:30px}
.rn-production-chapter .rn-film-ending{margin-top:clamp(65px,8vw,115px)}
.rn-production-chapter .rn-team-heading{margin-top:clamp(65px,8vw,115px)}
.rn-production-chapter .rn-crew-thanks{font:400 italic 24px/1.4 var(--serif);color:var(--accent);margin-top:19px}
.rn-crew-portrait{width:min(100%,1080px);margin:0 auto!important}
.rn-crew-portrait img{aspect-ratio:auto}
.rn-crew-portrait figcaption{text-align:center;margin-top:16px}
@media(max-width:760px){.rn-production-chapter{margin-top:55px;padding-top:38px}.rn-production-chapter section{margin-bottom:64px}.rn-production-chapter .rn-bts-heading{grid-template-columns:1fr;gap:20px;margin-bottom:25px}.rn-production-chapter .rn-bts-heading h2{font-size:40px}.rn-production-chapter .rn-bts-heading p{font-size:13px}.rn-shoot-facts{gap:35px;margin-top:23px}.rn-shoot-facts dd{font-size:24px}.rn-shoot-facts dt{font-size:8px}.rn-bts-film{border-radius:2px}.rn-bts-film-controls{padding:12px 8px 7px}.rn-bts-film-controls button{font-size:9px;padding:7px;gap:6px;min-width:40px;min-height:40px}.rn-bts-film-controls svg{width:17px;height:17px}.rn-world-pair{gap:15px;margin-top:19px}.rn-production-chapter figcaption{font-size:9px;margin-top:8px}.rn-world-loops figure:nth-child(2){margin-top:30px}.rn-story-scenes{gap:48px;padding-top:15px}.rn-story-scene,.rn-story-fixes{grid-template-columns:1fr;gap:19px}.rn-story-words,.rn-story-fixes .rn-story-words{grid-column:auto;grid-row:auto;padding:0}.rn-story-fixes .rn-story-photos{grid-column:auto;grid-row:auto;padding:0 10% 2% 0}.rn-production-chapter .rn-story-words h3,.rn-production-chapter .rn-story-fixes h3{font-size:33px;margin-bottom:15px}.rn-production-chapter .rn-story-words p{font-size:12px;max-width:40ch}.rn-story-photos{padding-bottom:2%}.rn-story-inset{width:37%;margin-top:-25%}.rn-production-chapter .rn-crew-thanks{font-size:23px}.rn-production-chapter .rn-team-heading{margin-top:60px}}
@media(prefers-reduced-motion:reduce){.rn-production-chapter *{animation:none!important;transition:none!important}.rn-photo-slide{transform:none!important}}
`;
