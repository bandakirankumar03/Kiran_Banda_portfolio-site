const BTS_LAYOUT_STUDIES=[
 {name:'Orbital gallery',short:'Orbit',note:'Photographs travel around an open centre, passing from the background into the foreground.'},
 {name:'Crossing ribbons',short:'Ribbons',note:'Two generous ribbons move in opposite directions. A continuous view of the whole shoot.'},
 {name:'Shuffling prints',short:'Prints',note:'A loose collection of photographs, gently dealt into a new arrangement.'},
 {name:'Depth carousel',short:'Depth',note:'One image moves into focus while the neighbouring photographs turn softly away.'},
 {name:'Living mosaic',short:'Mosaic',note:'A changing wall of photographs with different sizes, rhythms and small floating movements.'},
 {name:'Twin reels',short:'Reels',note:'Two vertical reels travel past a quiet centre. The shoot keeps unfolding on both sides.'}
];
const BTS_LAYOUT_PHOTOS=[
 'desert-stage','making-rocks','live-operation','crew-planning','camera-take','stage-frame',
 'temple-haze','costume-prep','rig-camera','set-dressing','crane-wide','sand-bags',
 'volume-light','blocking','props-prep','temple-stage','shot-list','crew-camera',
 'rocks-in-workshop','stage-fix','screen-light','slate-notes','lighting-setup','led-green-screen',
 'sand-stage','reuse-store','camera-operation','arena-slate','crew-set','volume-operator',
 'temple-wide','light-check'
];

function BTSStudyPhoto({file,base,onInspect,style={},className='',eager=false,duplicate=false}){
 const [width,height]=({'arena-slate':[1200,1600],'sand-bags':[1350,1800],'slate-notes':[1200,1600],'making-rocks':[2200,1650],'camera-take':[1900,1425],'temple-haze':[1900,1425],'rocks-in-workshop':[2200,1650],'reuse-store':[2200,1650],'temple-wide':[1900,1069]})[file]||[1900,1267];
 return <button className={'btso-photo '+className} type="button" data-photo-frame="" style={style} tabIndex={duplicate?-1:0} aria-label={RANA_BTS_PHOTOS[file]} onClick={()=>onInspect({image:base+file+'.webp',alt:RANA_BTS_PHOTOS[file]})}>
  <img key={file} src={base+file+'.webp'} alt={RANA_BTS_PHOTOS[file]} width={width} height={height} loading={eager?'eager':'lazy'} decoding="async" draggable={false}/>
 </button>;
}

// Continuous motion stays local to the gallery, and sleeps off screen or in a lightbox.
function BTSOrbit({base,onInspect}){
 const [photoStep,setPhotoStep]=React.useState(0);
 const root=React.useRef(null),held=React.useRef(false),shift=React.useRef(0),drag=React.useRef(null),suppress=React.useRef(false);
 React.useEffect(()=>{
  const el=root.current,items=[...el.querySelectorAll('.btso-orbit-card')],reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let frame=0,last=0,phase=0,visible=false,photoTime=0;
  const draw=()=>{
   const w=el.clientWidth,h=el.clientHeight,small=w<650;
   items.forEach((item,i)=>{
    const angle=i/items.length*Math.PI*2+phase+shift.current,depth=(Math.sin(angle)+1)/2;
    const x=Math.cos(angle)*w*(small?.38:.36),y=Math.sin(angle)*h*.32;
    item.style.transform=`translate(-50%,-50%) translate3d(${x}px,${y}px,0) scale(${.62+depth*.42}) rotate(${Math.cos(angle)*3}deg)`;
    item.style.zIndex=String(Math.round(depth*20));item.style.opacity=String(.36+depth*.64);
   });
  };
  const animate=now=>{frame=0;const elapsed=last?Math.min(70,now-last):0;last=now;if(!held.current&&!document.querySelector('dialog[open]')&&!document.hidden){phase+=elapsed/45000*Math.PI*2;photoTime+=elapsed;if(photoTime>2400){photoTime-=2400;setPhotoStep(i=>i+1)}}draw();if(visible&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(animate)};
  const sync=()=>{cancelAnimationFrame(frame);last=0;draw();if(visible&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(animate)};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()},{threshold:.1});observer.observe(el);
  const resize=new ResizeObserver(draw);resize.observe(el);
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);draw();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync)};
 },[]);
 return <div className="btso-orbit btso-gallery" ref={root} data-image-navigation="" onPointerOver={e=>{if(e.target.closest('button'))held.current=true}} onPointerOut={e=>{if(!e.relatedTarget?.closest?.('button'))held.current=false}} onFocusCapture={()=>{held.current=true}} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))held.current=false}} onPointerDown={e=>{drag.current={x:e.clientX,offset:shift.current};suppress.current=false}} onPointerMove={e=>{if(drag.current&&e.buttons){const d=e.clientX-drag.current.x;if(Math.abs(d)>8){suppress.current=true;shift.current=drag.current.offset+d/250}}}} onPointerUp={()=>{drag.current=null}} onPointerCancel={()=>{drag.current=null}} onClickCapture={e=>{if(suppress.current){e.preventDefault();e.stopPropagation();suppress.current=false}}}>
  <div className="btso-orbit-core"><span>Writer. Director. Producer.</span><p>Whatever<br/>the day <em>needed.</em></p></div>
  {Array.from({length:10},(_,i)=>{const turns=Math.max(0,Math.floor((photoStep+9-i)/10)),file=BTS_LAYOUT_PHOTOS[(i+turns*10)%BTS_LAYOUT_PHOTOS.length];return <div className="btso-orbit-card" key={i}><BTSStudyPhoto file={file} base={base} onInspect={onInspect} eager/></div>})}
 </div>;
}

function BTSRibbon({files,base,onInspect,reverse=false,vertical=false}){
 return <div className={'btso-ribbon-window'+(vertical?' is-vertical':'')} data-image-navigation=""><div className={'btso-ribbon-track'+(reverse?' is-reversed':'')}>
  {[0,1].map(copy=><div className="btso-ribbon-copy" key={copy} aria-hidden={copy===1}>{files.map((file,i)=><BTSStudyPhoto key={file} file={file} base={base} onInspect={onInspect} eager={i<5} duplicate={copy===1}/>)}</div>)}
 </div></div>;
}

function BTSCrossingRibbons({base,onInspect}){
 return <div className="btso-crossing btso-gallery"><BTSRibbon files={BTS_LAYOUT_PHOTOS.filter((_,i)=>i%2===0)} base={base} onInspect={onInspect}/><BTSRibbon files={BTS_LAYOUT_PHOTOS.filter((_,i)=>i%2===1)} base={base} onInspect={onInspect} reverse/></div>;
}

function BTSDealtGallery({base,onInspect,depth=false}){
 const [active,setActive]=React.useState(0),root=React.useRef(null),held=React.useRef(false),drag=React.useRef(null),suppress=React.useRef(false);
 const photos=BTS_LAYOUT_PHOTOS;
 React.useEffect(()=>{
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');let visible=false;
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting},{threshold:.15});observer.observe(root.current);
  const timer=setInterval(()=>{if(visible&&!held.current&&!document.hidden&&!reduced.matches&&!document.querySelector('dialog[open]'))setActive(i=>(i+1)%photos.length)},depth?2700:2200);
  return()=>{clearInterval(timer);observer.disconnect()};
 },[depth]);
 const change=d=>setActive(i=>(i+d+photos.length)%photos.length);
 return <div className={'btso-dealt btso-gallery '+(depth?'btso-depth':'btso-prints')} ref={root} data-image-navigation="" onPointerOver={e=>{if(e.target.closest('button'))held.current=true}} onPointerOut={e=>{if(!e.relatedTarget?.closest?.('button'))held.current=false}} onFocusCapture={()=>{held.current=true}} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))held.current=false}} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();change(e.key==='ArrowRight'?1:-1)}}} onPointerDown={e=>{drag.current=e.clientX;suppress.current=false}} onPointerUp={e=>{if(drag.current!==null&&Math.abs(e.clientX-drag.current)>45){change(e.clientX<drag.current?1:-1);suppress.current=true}drag.current=null}} onPointerCancel={()=>{drag.current=null}} onClickCapture={e=>{if(suppress.current){e.preventDefault();e.stopPropagation();suppress.current=false}}}>
  {photos.map((file,i)=>{
   let rank=(i-active+photos.length)%photos.length;if(rank>photos.length/2)rank-=photos.length;
   const distance=Math.abs(rank),visible=distance<=2;
   let transform,z,opacity;
   if(depth){transform=`translate(-50%,-50%) translate3d(${rank*60}%,${distance*9}px,${-distance*160}px) rotateY(${-Math.sign(rank)*Math.min(distance,1)*25}deg) scale(${1-distance*.07})`;z=10-distance;opacity=distance===0?1:distance===1?.58:.16}
   else{const poses=[[-77,27,-13],[-39,-18,-7],[0,0,1],[40,-14,8],[78,25,13]],pose=poses[Math.max(0,Math.min(4,rank+2))];transform=`translate(-50%,-50%) translate(${pose[0]}%,${pose[1]}px) rotate(${pose[2]}deg) scale(${1-distance*.14})`;z=10-distance;opacity=distance===0?1:distance===1?.88:.55}
   return <div key={file} className={'btso-dealt-card'+(rank===0?' is-front':'')} style={{transform,zIndex:z,opacity:visible?opacity:0,visibility:visible?'visible':'hidden',pointerEvents:visible?'auto':'none'}} aria-hidden={!visible} inert={!visible?'':undefined}><BTSStudyPhoto file={file} base={base} onInspect={onInspect} eager={i<5}/></div>;
  })}
 </div>;
}

function BTSLivingMosaic({base}){
 const groups=Array.from({length:6},(_,i)=>BTS_LAYOUT_PHOTOS.filter((_,j)=>j%6===i));
 return <div className="btso-mosaic btso-gallery">{groups.map((photos,i)=><div className={'btso-mosaic-tile tile-'+i} key={i}><RanaPhotoLoop base={base} photos={photos} pace={2600+i*300} delay={i*390}/></div>)}</div>;
}

function BTSTwinReels({base,onInspect}){
 return <div className="btso-twin btso-gallery"><BTSRibbon files={BTS_LAYOUT_PHOTOS.filter((_,i)=>i%2===0)} base={base} onInspect={onInspect} vertical/><div className="btso-twin-copy"><span>Many hats. One film.</span><p>Big problems.<br/><em>Small fixes.</em></p><small>Whatever the day needed.</small></div><BTSRibbon files={BTS_LAYOUT_PHOTOS.filter((_,i)=>i%2===1)} base={base} onInspect={onInspect} vertical reverse/></div>;
}

const RanaProductionSavedLayout=RanaProductionChapter;
RanaProductionChapter=function RanaProductionLayoutStudies({base}){
 const [version,setVersion]=React.useState(()=>Math.max(1,Math.min(6,Number(new URLSearchParams(location.search).get('layout'))||1))),[selected,setSelected]=React.useState(null),root=React.useRef(null);
 const bts=base+'bts/';
 React.useEffect(()=>{const timer=setTimeout(()=>root.current?.scrollIntoView({block:'start',behavior:'instant'}),180);return()=>clearTimeout(timer)},[]);
 const choose=n=>{setVersion(n);const u=new URL(location.href);u.searchParams.set('layout',n);history.replaceState(null,'',u);requestAnimationFrame(()=>requestAnimationFrame(()=>{const el=root.current;if(!el)return;const gallery=el.querySelector('.btso-gallery-stage'),controls=el.querySelector('.btso-lab-controls');window.scrollTo({top:scrollY+gallery.getBoundingClientRect().top-controls.offsetHeight-28,behavior:'instant'})}))};
 const gallery=version===1?<BTSOrbit base={bts} onInspect={setSelected}/>:version===2?<BTSCrossingRibbons base={bts} onInspect={setSelected}/>:version===3?<BTSDealtGallery base={bts} onInspect={setSelected}/>:version===4?<BTSDealtGallery base={bts} onInspect={setSelected} depth/>:version===5?<BTSLivingMosaic base={bts}/>:<BTSTwinReels base={bts} onInspect={setSelected}/>;
 return <div className="rn-production-chapter btso-chapter" id="on-set" ref={root}>
  <style>{RANA_PRODUCTION_STYLE}</style>
  <div className="btso-lab-controls"><div className="btso-lab-top"><span>BTS / six layout studies</span><a href="index.html#/case/ranasthala">Saved layout ↗</a></div><nav aria-label="BTS layout options">{BTS_LAYOUT_STUDIES.map((study,i)=><button type="button" key={study.name} aria-pressed={version===i+1} onClick={()=>choose(i+1)}><span>{String(i+1).padStart(2,'0')}</span>{study.short}</button>)}</nav><div className="btso-study-description"><strong>{BTS_LAYOUT_STUDIES[version-1].name}</strong><p>{BTS_LAYOUT_STUDIES[version-1].note}</p></div></div>
  <section className="btso-photo-section" aria-labelledby="btso-main-title">
   <div className="rn-bts-heading btso-main-heading"><h2 id="btso-main-title">Many hats.<br/><em>One film.</em></h2><div><p>Writer. Director. Producer.<br/>Whatever the day needed.</p><dl className="rn-shoot-facts"><div><dt>Shoot</dt><dd>3 days</dd></div><div><dt>Environments</dt><dd>2</dd></div><div><dt>Camera</dt><dd>24 FPS</dd></div></dl></div></div>
   <div key={version} className={'btso-gallery-stage layout-'+version}>{gallery}</div>
   <div className="btso-story-notes"><div><h3>From script <em>to sand.</em></h3><p>Shot lists, schedules and logistics. 500 lb of sand, handmade rocks and reused materials.</p></div><div><h3>Big problems.<br/><em>Surprisingly small fixes.</em></h3><p>A slow load. A last-minute change. Find the fix, get the next take.</p></div><div><h3>One more <em>take.</em></h3><p>Camera, lighting and live stage operation. Unreal, Disguise and custom controls.</p></div></div>
  </section>
  <section className="btso-team-section" aria-labelledby="btso-team-title"><Reveal className="rn-bts-heading"><h2 id="btso-team-title">The people<br/><em>behind the frame.</em></h2><div><p>My first film set. A lot of different roles.<br/>An incredible amount learned.</p><p className="rn-crew-thanks">None of it happens alone.</p></div></Reveal><Reveal as="figure" className="rn-crew-portrait"><img src={bts+'team.webp'} alt="The Ranasthala cast and crew together on the XR stage after filming" width="2200" height="1650" loading="lazy"/><figcaption>Three shooting days. Everyone brought something.</figcaption></Reveal></section>
  <section className="btso-closing-film" aria-labelledby="btso-film-title"><Reveal className="rn-bts-heading"><h2 id="btso-film-title">Behind<br/><em>the scenes.</em></h2></Reveal><Reveal><RanaBTSFilm base={bts}/></Reveal></section>
  {selected&&<ProjectImageViewer media={selected} onClose={()=>setSelected(null)}/>}
 </div>;
};
