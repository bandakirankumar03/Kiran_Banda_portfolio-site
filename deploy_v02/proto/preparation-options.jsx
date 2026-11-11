const PREP_STUDIES=[
 {name:'Floating atelier',label:'Atelier',note:'Six loose photographs. A little depth, space and movement; each print lifts into focus.'},
 {name:'The focus table',label:'Focus table',note:'One generous photograph, with a floating row of smaller moments. Hover a moment to bring it forward.'},
 {name:'Expanding windows',label:'Windows',note:'A quiet row of photographs that opens around the moment you are looking at.'},
 {name:'The curved gallery',label:'Curved gallery',note:'An unhurried loop through the preparation, with neighbouring photographs turning into view.'},
 {name:'Passing moments',label:'Passing moments',note:'Two offset streams of photographs, gently passing one another. A living view of the preparation.'},
 {name:'The print stack',label:'Print stack',note:'A handful of photographs, slowly dealt from the back to the front. Small moments, one at a time.'}
];
const PREP_FILES=['workshop-team','sand-bags','reuse-wardrobe','rocks-in-workshop','reuse-store','making-rocks'];

function PrepStudyPhoto({file,base,onInspect,duplicate=false}){
 const [width,height]=RANA_FILM_PHOTO_SIZES[file]||[1900,1425];
 return <button type="button" className="prep-photo" data-photo-frame="" data-image-navigation="" tabIndex={duplicate?-1:0} aria-label={RANA_BTS_PHOTOS[file]} onClick={()=>onInspect({image:base+file+'.webp',alt:RANA_BTS_PHOTOS[file]})}>
  <img src={base+file+'.webp'} alt={RANA_BTS_PHOTOS[file]} width={width} height={height} loading="eager" decoding="async" draggable={false}/>
 </button>;
}

function usePrepPlayback(root,advance,enabled,pace=3600){
 const advanceRef=React.useRef(advance);advanceRef.current=advance;
 React.useEffect(()=>{
  const el=root.current,reduced=matchMedia('(prefers-reduced-motion:reduce)');let visible=false;
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;el.dataset.running=String(visible&&!document.hidden)},{threshold:.15});observer.observe(el);
  const sync=()=>{el.dataset.running=String(visible&&!document.hidden)};document.addEventListener('visibilitychange',sync);
  const timer=setInterval(()=>{
   if(enabled&&visible&&!document.hidden&&!reduced.matches&&el.dataset.held!=='true'&&!document.querySelector('dialog[open]'))advanceRef.current();
  },pace);
  return()=>{clearInterval(timer);observer.disconnect();document.removeEventListener('visibilitychange',sync)};
 },[enabled,pace]);
}

function PrepStudyGallery({design,base,onInspect}){
 const [active,setActive]=React.useState(0),root=React.useRef(null),drag=React.useRef(null),suppress=React.useRef(false);
 const change=d=>setActive(i=>(i+d+PREP_FILES.length)%PREP_FILES.length);
 usePrepPlayback(root,()=>change(1),[2,3,4,6].includes(design));
 const hold=e=>{if(e.pointerType==='mouse')e.currentTarget.dataset.held='true'};
 const release=e=>{e.currentTarget.dataset.held='false';e.currentTarget.style.setProperty('--prep-x','0px');e.currentTarget.style.setProperty('--prep-y','0px')};
 const point=e=>{if(e.pointerType!=='mouse')return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--prep-x',((e.clientX-r.left)/r.width-.5)*8+'px');e.currentTarget.style.setProperty('--prep-y',((e.clientY-r.top)/r.height-.5)*7+'px')};
 const props={ref:root,className:'prep-gallery prep-design-'+design,'data-held':'false','data-image-navigation':'',onPointerEnter:hold,onPointerLeave:release,onPointerMove:point,onFocusCapture:e=>{if(e.target.matches(':focus-visible'))e.currentTarget.dataset.held='true'},onBlurCapture:e=>{if(!e.currentTarget.contains(e.relatedTarget))e.currentTarget.dataset.held='false'},onKeyDown:e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();change(e.key==='ArrowRight'?1:-1)}},onPointerDown:e=>{drag.current={x:e.clientX,y:e.clientY};suppress.current=false},onPointerUp:e=>{if(drag.current&&[4,6].includes(design)){const x=e.clientX-drag.current.x,y=e.clientY-drag.current.y;if(Math.abs(x)>45&&Math.abs(x)>Math.abs(y)){change(x<0?1:-1);suppress.current=true}}drag.current=null},onPointerCancel:()=>{drag.current=null},onClickCapture:e=>{if(suppress.current){e.preventDefault();e.stopPropagation();suppress.current=false}}};
 if(design===1)return <div {...props}>{PREP_FILES.map((file,i)=><div className={'prep-atelier-print print-'+i} key={file}><div className="prep-drift"><PrepStudyPhoto file={file} base={base} onInspect={onInspect}/></div></div>)}</div>;
 if(design===2)return <div {...props}><div className="prep-focus-stage">{PREP_FILES.map((file,i)=><div key={file} className={'prep-focus-image'+(active===i?' is-current':'')} aria-hidden={active!==i} inert={active===i?undefined:''}><PrepStudyPhoto file={file} base={base} onInspect={onInspect}/></div>)}</div><div className="prep-focus-moments" role="group" aria-label="Preparation photographs">{PREP_FILES.map((file,i)=><button type="button" key={file} className={active===i?'is-current':''} aria-label={'Feature '+RANA_BTS_PHOTOS[file]} aria-pressed={active===i} onPointerEnter={e=>{if(e.pointerType==='mouse')setActive(i)}} onFocus={()=>setActive(i)} onClick={()=>setActive(i)}><img src={base+file+'.webp'} alt="" draggable={false}/></button>)}</div></div>;
 if(design===3)return <div {...props}>{PREP_FILES.map((file,i)=><div key={file} className={'prep-window'+(active===i?' is-current':'')} onPointerEnter={e=>{if(e.pointerType==='mouse')setActive(i)}} onFocusCapture={()=>setActive(i)}><PrepStudyPhoto file={file} base={base} onInspect={onInspect}/></div>)}</div>;
 if(design===5)return <div {...props}>{[0,1].map(lane=><div className={'prep-stream stream-'+lane} key={lane}><div className="prep-stream-track">{[0,1].map(copy=><div className="prep-stream-copy" key={copy} aria-hidden={copy===1}>{PREP_FILES.filter((_,i)=>i%2===lane).map(file=><PrepStudyPhoto key={file} file={file} base={base} onInspect={onInspect} duplicate={copy===1}/>)}</div>)}</div></div>)}</div>;
 return <div {...props}>{PREP_FILES.map((file,i)=>{
  let rank=(i-active+PREP_FILES.length)%PREP_FILES.length;if(rank>3)rank-=PREP_FILES.length;
  const distance=Math.abs(rank),visible=distance<=2;
  const pose=design===4?`translate(-50%,-50%) translate3d(${rank*70}%,${distance*25}px,${distance*-90}px) rotateY(${-rank*12}deg) rotateZ(${rank*2}deg) scale(${1-distance*.1})`:`translate(-50%,-50%) translate(${rank*13}%,${distance*-17}px) rotate(${rank*6}deg) scale(${1-distance*.075})`;
  return <div key={file} className={'prep-moving-print'+(rank===0?' is-current':'')} style={{transform:pose,zIndex:10-distance,opacity:visible?(design===4?[1,.65,.25][distance]:[1,.8,.52][distance]):0,visibility:visible?'visible':'hidden',pointerEvents:visible?'auto':'none'}} aria-hidden={!visible} inert={visible?undefined:''}><PrepStudyPhoto file={file} base={base} onInspect={onInspect}/></div>;
 })}<div className="prep-step-controls"><button type="button" aria-label="Previous preparation photograph" onClick={()=>change(-1)}>←</button><button type="button" aria-label="Next preparation photograph" onClick={()=>change(1)}>→</button></div></div>;
}

// Preview-only replacement: stage, shoot reel, crew and closing film stay intact.
RanaPreparationPhotos=function RanaPreparationStudies({base,onInspect}){
 const [design,setDesign]=React.useState(()=>Math.max(1,Math.min(6,Number(new URLSearchParams(location.search).get('design'))||1))),root=React.useRef(null);
 React.useEffect(()=>{const timer=setTimeout(()=>root.current?.closest('section').scrollIntoView({block:'start',behavior:'instant'}),350);return()=>clearTimeout(timer)},[]);
 const choose=n=>{setDesign(n);const url=new URL(location.href);url.searchParams.set('design',n);history.replaceState(null,'',url);requestAnimationFrame(()=>root.current?.closest('section').scrollIntoView({block:'start',behavior:'instant'}))};
 return <div ref={root} className="prep-options">
  <div className="prep-options-bar"><div className="prep-options-top"><span>Preparation / six studies</span><a href="index.html#/case/ranasthala">Saved version ↗</a></div><nav aria-label="Preparation layout options">{PREP_STUDIES.map((study,i)=><button type="button" key={study.name} aria-pressed={design===i+1} onClick={()=>choose(i+1)}><span>{String(i+1).padStart(2,'0')}</span>{study.label}</button>)}</nav><div className="prep-study-note"><strong>{PREP_STUDIES[design-1].name}</strong><p>{PREP_STUDIES[design-1].note}</p></div></div>
  <div className="prep-options-stage" key={design}><PrepStudyGallery design={design} base={base} onInspect={onInspect}/></div>
 </div>;
};
