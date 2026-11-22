const RANA_QUICK_PHASES=[['Capture','quick-capture.webp'],['Reconstruct','quick-reconstruct.webp'],['Unreal','quick-unreal.webp'],['On stage','quick-stage.webp'],['Trailer','quick-trailer.webp']];

function QuickPreviewPlayer({base,start=0,autoStart=false,onTime}){
 const holder=React.useRef(null);
 React.useEffect(()=>{
  const video=holder.current?.querySelector('video');if(!video)return;
  const ready=()=>{if(start>0)video.currentTime=Math.min(start+.01,video.duration||20);if(autoStart)video.play().catch(()=>{})};
  if(video.readyState>=1)ready();else video.addEventListener('loadedmetadata',ready,{once:true});
  return()=>video.removeEventListener('loadedmetadata',ready);
 },[start,autoStart]);
 return <div ref={holder} className="qf-player" data-image-navigation=""><TapVideo seekable title="Ranasthala quick breakdown" src={base+'films/field-to-frame-20s.mp4'} poster={base+'films/field-to-frame-poster.webp'} onTimeUpdate={e=>onTime?.(e.currentTarget.currentTime)}/></div>;
}

function QuickPreviewModal({base,onClose}){
 const dialog=React.useRef(null);
 React.useEffect(()=>{const el=dialog.current,overflow=document.body.style.overflow,trigger=document.activeElement;el.showModal();document.body.style.overflow='hidden';return()=>{el.close();document.body.style.overflow=overflow;trigger?.focus?.({preventScroll:true})}},[]);
 return <dialog ref={dialog} className="qf-dialog" aria-label="Field to frame quick preview" onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}><div><QuickPreviewPlayer base={base} autoStart/><button type="button" className="qf-return" onClick={onClose}>Return to project</button></div></dialog>;
}

function RanaQuickPreview({base='media/projects/Ranasthala/web/',variant=1,onExplore}){
 const [open,setOpen]=React.useState(false),[modal,setModal]=React.useState(false),[piece,setPiece]=React.useState(0),[time,setTime]=React.useState(0);
 const explore=()=>{if(onExplore){onExplore();return}document.getElementById('ranasthala-story')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'})};
 const playIcon=<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="m7 4 8 6-8 6Z" fill="none" stroke="currentColor" strokeWidth="1.3"/></svg>;
 const title=<div className="qf-title"><span>20s / visual breakdown</span><h3>Field to <em>frame.</em></h3></div>;
 return <section className={'rana-quick-preview qf-version-'+variant} aria-label="Field to frame quick preview">
  {+variant===1&&<><div className="qf-pocket"><button className="qf-pocket-image" type="button" aria-label="Watch 20-second breakdown" onClick={()=>setOpen(true)}><img src={base+'films/field-to-frame-poster.webp'} alt="Ranasthala arena in Unreal" loading="lazy"/>{playIcon}</button>{title}<button type="button" className="qf-watch" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>{open?'Close preview':'Watch 20s'}</button></div>{open&&<div className="qf-expanded"><QuickPreviewPlayer base={base} autoStart/></div>}</>}
  {+variant===2&&<><div className="qf-strip-heading">{title}{open&&<button type="button" className="qf-watch" onClick={()=>setOpen(false)}>Close preview</button>}</div><div className="qf-glances" role="group" aria-label="Quick breakdown chapters">{RANA_QUICK_PHASES.map(([label,file],i)=><button key={label} type="button" aria-label={'Preview '+label} aria-pressed={open&&Math.min(4,Math.floor(time/4))===i} onClick={()=>{setPiece(i);setOpen(true)}}><img src={base+'films/'+file} alt="" loading="lazy"/><span>{label}</span></button>)}</div>{open&&<div className="qf-expanded"><QuickPreviewPlayer base={base} start={piece*4} autoStart onTime={setTime}/></div>}</>}
  {+variant===3&&<>{!open?<button type="button" className="qf-ribbon" aria-label="Watch 20-second breakdown" onClick={()=>setOpen(true)}><img src={base+'films/field-to-frame-poster.webp'} alt="" loading="lazy"/>{title}<span className="qf-round-play">{playIcon}</span></button>:<><div className="qf-strip-heading">{title}<button type="button" className="qf-watch" onClick={()=>setOpen(false)}>Close preview</button></div><div className="qf-expanded"><QuickPreviewPlayer base={base} autoStart/></div></>}</>}
  {+variant===4&&<div className="qf-quiet">{title}<QuickPreviewPlayer base={base}/></div>}
  {+variant===5&&<button type="button" className="qf-ticket" aria-label="Open 20-second breakdown" onClick={()=>setModal(true)}>{title}<span className="qf-ticket-action"><span className="qf-clock">20<span>s</span></span><span>Watch the short version</span>{playIcon}</span></button>}
  <button type="button" className="qf-explore" onClick={explore}>Explore the whole project below.</button>
  {modal&&<QuickPreviewModal base={base} onClose={()=>setModal(false)}/>}
 </section>;
}
