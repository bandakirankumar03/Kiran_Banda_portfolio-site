const ATELIER_STUDIES=[
 {name:'Original air',note:'The original loose composition, with generous photographs and a gentle hover lift.'},
 {name:'Diagonal flow',note:'An ascending arrangement with more breathing room between each moment.'},
 {name:'Crescent',note:'A larger central photograph, surrounded by a soft arc of smaller prints.'},
 {name:'Two clusters',note:'Two little collections of moments, balanced across an open space.'},
 {name:'Living collage',note:'The same photographs slowly settle into new positions, then drift back again.'}
];
// [left, top, width, angle, layer] as percentages of the gallery.
const ATELIER_POSES=[
 [[3,9,41,-3,3],[45,1,15,4,2],[78,7,17,5,2],[2,62,26,3,1],[31,65,28,-4,1],[65,49,34,2,3]],
 [[1,24,37,-4,3],[43,10,16,3,2],[78,1,18,5,2],[3,70,23,3,1],[34,64,28,-3,2],[66,49,33,-2,3]],
 [[29,20,42,-1,5],[12,4,17,-7,2],[74,3,17,8,2],[0,43,29,-9,3],[16,61,30,-5,2],[65,58,33,7,3]],
 [[0,6,42,-4,3],[35,45,16,7,4],[81,3,17,5,2],[7,62,27,3,2],[53,2,27,-4,1],[57,46,42,2,3]]
];
const ATELIER_MOBILE_POSES=[
 [[1,5,58,-3,3],[72,1,27,4,2],[70,36,29,5,2],[3,43,49,3,1],[0,75,46,-4,1],[52,72,48,2,3]],
 [[0,25,59,-5,3],[36,0,27,2,2],[72,8,27,5,2],[0,63,42,2,1],[49,75,48,-4,2],[45,45,54,3,3]],
 [[9,32,81,-2,5],[1,0,27,-7,2],[72,2,27,8,2],[0,78,44,-7,3],[30,3,39,-4,2],[54,77,45,7,3]],
 [[0,5,65,-4,3],[66,21,30,7,4],[2,57,27,-5,2],[5,36,44,3,2],[53,0,43,4,1],[35,69,64,2,3]]
];

function AtelierVariantGallery({variant,base,onInspect}){
 const root=React.useRef(null),[shifted,setShifted]=React.useState(false);
 usePrepPlayback(root,()=>setShifted(v=>!v),variant===5,6800);
 const pose=ATELIER_POSES[variant===5?(shifted?1:0):variant-1],mobile=ATELIER_MOBILE_POSES[variant===5?(shifted?1:0):variant-1];
 const reset=e=>{e.currentTarget.dataset.held='false';e.currentTarget.style.setProperty('--prep-x','0px');e.currentTarget.style.setProperty('--prep-y','0px')};
 return <div className={'prep-gallery atelier-gallery atelier-variant-'+variant} ref={root} data-held="false" data-image-navigation="" onPointerEnter={e=>{if(e.pointerType==='mouse')e.currentTarget.dataset.held='true'}} onPointerLeave={reset} onPointerMove={e=>{if(e.pointerType!=='mouse')return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--prep-x',((e.clientX-r.left)/r.width-.5)*9+'px');e.currentTarget.style.setProperty('--prep-y',((e.clientY-r.top)/r.height-.5)*7+'px')}} onFocusCapture={e=>{if(e.target.matches(':focus-visible'))e.currentTarget.dataset.held='true'}} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))e.currentTarget.dataset.held='false'}}>
  {PREP_FILES.map((file,i)=>{const [x,y,w,r,z]=pose[i],[mx,my,mw,mr,mz]=mobile[i];return <div className={'atelier-print atelier-print-'+i} key={file} style={{'--ax':x+'%','--ay':y+'%','--aw':w+'%','--ar':r+'deg','--az':z,'--mx':mx+'%','--my':my+'%','--mw':mw+'%','--mr':mr+'deg','--mz':mz}}><div className="prep-drift"><PrepStudyPhoto file={file} base={base} onInspect={onInspect}/></div></div>})}
 </div>;
}

RanaPreparationPhotos=function RanaAtelierStudies({base,onInspect}){
 const [variant,setVariant]=React.useState(()=>Math.max(1,Math.min(5,Number(new URLSearchParams(location.search).get('variant'))||1))),root=React.useRef(null);
 React.useEffect(()=>{const timer=setTimeout(()=>root.current?.closest('section').scrollIntoView({block:'start',behavior:'instant'}),350);return()=>clearTimeout(timer)},[]);
 const choose=n=>{setVariant(n);const u=new URL(location.href);u.searchParams.set('variant',n);history.replaceState(null,'',u);requestAnimationFrame(()=>root.current?.closest('section').scrollIntoView({block:'start',behavior:'instant'}))};
 return <div ref={root} className="prep-options atelier-options"><div className="prep-options-bar"><div className="prep-options-top"><span>Floating atelier / five variations</span><a href="preparation-options.html?design=1#/case/ranasthala">All six concepts ↗</a></div><nav aria-label="Floating atelier variations">{ATELIER_STUDIES.map((study,i)=><button type="button" key={study.name} aria-pressed={variant===i+1} onClick={()=>choose(i+1)}><span>{String(i+1).padStart(2,'0')}</span>{study.name}</button>)}</nav><div className="prep-study-note"><strong>{ATELIER_STUDIES[variant-1].name}</strong><p>{ATELIER_STUDIES[variant-1].note}</p></div></div><div className="prep-options-stage" key={variant}><AtelierVariantGallery variant={variant} base={base} onInspect={onInspect}/></div></div>;
};
