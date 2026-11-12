const RANA_RENDERED_ASSETS=[
 ['TT_BasePiller.webp','Pillar base','Columns'],['TT_Column_A.webp','Column A','Columns'],['TT_Column_B.webp','Column B','Columns'],['TT_Column_C.webp','Column C','Columns'],
 ['TT_BlockRelief.webp','Relief block A','Reliefs & walls'],['TT_ReliefBlock_B.webp','Relief block B','Reliefs & walls'],['TT_WallRelief.webp','Wall relief','Reliefs & walls'],['TT_BorderWall_A.webp','Border wall A','Reliefs & walls'],['TT_BorderWall_B.webp','Border wall B','Reliefs & walls'],['TT_BorderWall_C.webp','Border wall C','Reliefs & walls'],
 ['TT_Elephant_L.webp','Elephant / left','Sculptures'],['TT_Elephant_R.webp','Elephant / right','Sculptures'],['TT_Ganesh.webp','Ganesh','Sculptures'],['TT_Vishnu.webp','Vishnu','Sculptures'],['TT_Ruins_A.webp','Ruins A','Ruins'],['TT_Ruins_B.webp','Ruins B','Ruins'],['TT_Ruins_C.webp','Ruins C','Ruins']
];
function RanaAssetLoop({items,label,onInspect,paused,delay=0}){
 const root='media/projects/Ranasthala/web/assets-gallery/';
 const [active,setActive]=React.useState(0),[held,setHeld]=React.useState(false),frame=React.useRef(null);
 React.useEffect(()=>{
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');let visible=false;
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting},{threshold:.2});observer.observe(frame.current);
  const timer=setInterval(()=>{if(visible&&!document.hidden&&!reduced.matches&&!paused&&!held)setActive(n=>(n+1)%items.length)},2700+delay);
  return()=>{observer.disconnect();clearInterval(timer)};
 },[paused,held,items.length]);
 return <figure className="rag-loop" ref={frame}><button type="button" aria-label={'Expand '+items[active][1]} onClick={()=>onInspect(items[active])} onPointerEnter={()=>setHeld(true)} onPointerLeave={()=>setHeld(false)} onFocus={()=>setHeld(true)} onBlur={()=>setHeld(false)}>{items.map(([file,name],i)=><img key={file} src={root+file} alt={name} aria-hidden={i!==active} className={i===active?'rag-active':''} loading="lazy"/>)}</button><figcaption><span>{label}</span><span>{items[active][1]}</span></figcaption></figure>;
}
function RanaAssetCollection(){
 const root='media/projects/Ranasthala/web/assets-gallery/';
 const [selected,setSelected]=React.useState(null),[playing,setPlaying]=React.useState(false),[manual,setManual]=React.useState(null),video=React.useRef(null);
 const first=[RANA_RENDERED_ASSETS[0],RANA_RENDERED_ASSETS[4],RANA_RENDERED_ASSETS[2]],second=[RANA_RENDERED_ASSETS[12],RANA_RENDERED_ASSETS[10],RANA_RENDERED_ASSETS[6]];
 React.useEffect(()=>{
  const v=video.current,reduced=matchMedia('(prefers-reduced-motion:reduce)');let visible=false;
  const update=()=>{if(visible&&!document.hidden&&!selected&&(manual===true||(manual===null&&!reduced.matches)))v.play().catch(()=>{});else v.pause()};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update()},{threshold:.2});observer.observe(v);
  document.addEventListener('visibilitychange',update);reduced.addEventListener('change',update);v.addEventListener('canplay',update);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',update);reduced.removeEventListener('change',update);v.removeEventListener('canplay',update);v.pause()};
 },[manual,selected]);
 const inspect=item=>setSelected({image:root+item[0],alt:item[1]+' · photogrammetry render'});
 return <div className="rn-asset-collection rag" id="photogrammetry-collection"><style>{RANA_ASSET_STYLE}</style>
  <div className="rag-heading"><h2>Captured.<br/><em>Reconstructed.</em></h2></div>
  <div className="rag-composition">
  <div className="rag-hero"><figure><div className="rag-video"><video ref={video} src={root+'column-a-360.mp4'} poster={root+'column-a-poster.webp'} muted loop playsInline preload="metadata" role="button" tabIndex={0} aria-label={(playing?'Pause':'Play')+' Column A 360-degree turntable'} aria-pressed={playing} onClick={()=>setManual(!playing)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setManual(!playing)}}} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}/><span aria-hidden="true">360° ↻</span></div><figcaption>Column A / 360° film</figcaption></figure></div>
  <div className="rag-loops"><RanaAssetLoop items={first} label="Forms" onInspect={inspect} paused={!!selected}/><RanaAssetLoop items={second} label="Details" onInspect={inspect} paused={!!selected} delay={650}/></div>
  </div>
  {selected&&<ProjectImageViewer media={selected} onClose={()=>setSelected(null)}/>}
 </div>;
}
const RANA_ASSET_STYLE=`
.rn-reconstruction-studies .rn-process-layout{display:block}.rn-reconstruction-studies .rn-scan-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}.rag{max-width:1080px;margin:40px auto 55px;min-width:0}.rag *{box-sizing:border-box}.rag-heading{margin-bottom:24px}.rag-heading>span{display:block;font:9px/1.5 var(--mono);letter-spacing:1.8px;color:var(--accent);margin-bottom:12px}.rag h2{font:400 clamp(34px,4vw,52px)/1.07 var(--serif);letter-spacing:-1px;margin:0}.rag em{color:var(--accent);font-weight:400}.rag figure{margin:0;min-width:0}.rag-hero{display:grid;grid-template-columns:1fr 1.25fr;gap:20px;align-items:end}.rag button{display:block;width:100%;padding:0;border:0;background:#aaa69b;cursor:zoom-in!important;color:var(--ink)}.rag-still,.rag-video{aspect-ratio:16/9;overflow:hidden;position:relative}.rag .rag-still img,.rag-video video,.rag-loop img{display:block;width:100%;height:100%;object-fit:contain;transform:none!important;translate:none!important;rotate:none!important;scale:1!important;filter:none!important}.rag-video video{cursor:pointer}.rag-video>span{position:absolute;bottom:10px;right:10px;background:#090d0bcb;padding:7px 9px;font:10px var(--mono);color:var(--ink);pointer-events:none}.rag figcaption{display:flex;justify-content:space-between;gap:15px;margin-top:9px;font:10px/1.5 var(--mono);color:var(--dim)}.rag-loops{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:25px}.rag-loop button{position:relative;aspect-ratio:16/9;overflow:hidden}.rag-loop img{position:absolute;inset:0;opacity:0;visibility:hidden;transition:opacity .8s ease,visibility .8s;pointer-events:none}.rag-loop img.rag-active{opacity:1;visibility:visible}.rag-loop figcaption>span:first-child{color:var(--accent)}.rag button:focus-visible,.rag video:focus-visible{outline:2px solid var(--accent);outline-offset:4px}
@media(max-width:760px){.rag{margin:30px 0 40px}.rag h2{font-size:36px}.rag-hero{grid-template-columns:1fr;gap:18px}.rag-loops{gap:12px;margin-top:20px}.rag figcaption{font-size:9px;gap:7px}.rag-loop figcaption{flex-direction:column;gap:3px}.rn-reconstruction-studies .rn-scan-pair{gap:14px}}
.rag{max-width:none;width:100%;margin:55px 0 80px}.rag-heading{padding-left:3%;margin-bottom:30px}.rag h2{font-size:clamp(38px,4.2vw,64px)}.rag h2 em{display:inline-block;margin-left:clamp(24px,5vw,80px)}.rag-composition{margin:0}.rag-hero{display:block}.rag-loops{display:grid;grid-template-columns:1.15fr .85fr;gap:clamp(18px,3vw,45px);margin-top:28px;align-items:start}.rag-loops .rag-loop:last-child{margin-top:45px}.rag-loop figcaption{flex-direction:row}
@media(max-width:760px){.rag{margin:40px 0 55px}.rag-heading{padding-left:0}.rag h2{font-size:38px}.rag h2 em{margin-left:24px}.rag-loops{grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}.rag-loops .rag-loop:last-child{margin-top:25px}.rag-loop figcaption{flex-direction:column;gap:3px}}@media(prefers-reduced-motion:reduce){.rag *{animation:none!important;transition:none!important}}
`;
