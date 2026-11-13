const RANA_TEAM_MEMBERS=[
 {id:1,x:18.1,y:39.1,back:false,name:'Krish Kasat',role:'Director of Photography'},
 {id:2,x:24.7,y:37.4,back:true,name:'Riley Waish',role:'1st Assistant Camera'},
 {id:3,x:28.5,y:44.7,back:false,name:'Falak Dalal',role:'Production Design'},
 {id:4,x:36.4,y:39.5,back:false,name:'Kiran Banda',role:'Director · VAD · Many Hats'},
 {id:5,x:43.8,y:39.3,back:true,name:'Aadi Karnavat',role:'Director of Photography'},
 {id:6,x:50.9,y:38.6,back:false,name:'Bhanu Singh',role:'Cast · Rudra'},
 {id:7,x:57.9,y:35.9,back:true,name:'Jonathan',role:'Assistant Director'},
 {id:8,x:61.6,y:44.1,back:false,name:'Sanskruthi',role:'Producer'},
 {id:9,x:68.5,y:45.3,back:false,name:'Priyanshi Jain',role:'Production Assistant'},
 {id:10,x:76.8,y:41.1,back:false,name:'Aashish',role:'VFX Supervisor'}
];
// Full visible figure bounds, separate from the hover targets.
const RANA_TEAM_FRAMES=[
 [11.3,33.4,12.1,47],[21.3,32.7,10,47.5],[21.4,39,14.5,44.5],
 [32.4,34.9,15.5,48.8],[40,35,8.8,45.4],[44.9,33.3,12.7,49],
 [53.5,30.7,10.1,49],[55.6,38.3,11.4,47.4],[64.7,39,10.6,44],
 [71.3,34.9,12.5,47.3]
];
const RANA_FILM_PREP=[
 'collaborative-planning','script-and-shot-lists','workshop-team','sand-bags','reuse-wardrobe','handmade-rock-props','making-rocks','arena-practical-model'
];
const RANA_PREP_CAPTIONS={'collaborative-planning':'Production meeting','script-and-shot-lists':'Script & schedule','workshop-team':'Teamwork in the workshop','sand-bags':'Sand logistics','reuse-wardrobe':'Costume sourcing','handmade-rock-props':'Handmade rock props','arena-practical-model':'Practical arena model','making-rocks':'Making rocks together'};
const RANA_PREP_AIR_POSES=[
 [1,0,49,-3,3],[64,1,24,4,2],[7,46,36,-3,3],[47,38,16,4,2],
 [80,43,17,5,2],[1,77,27,3,1],[66,70,32,2,3],[33,69,29,-2,2]
];
const RANA_PREP_AIR_MOBILE=[
 [2,0,96,-2,3],[55,28,43,4,2],[1,30,53,-3,3],[3,49,32,4,2],
 [62,52,35,5,2],[2,70,49,3,1],[16,84,67,2,3],[3,90,43,-2,2]
];
const RANA_FILM_SHOOT=[
 'desert-stage','live-operation','crew-planning','camera-take','slate-notes','costume-prep','rig-camera',
 'temple-haze','crane-wide','volume-light','blocking','crew-camera','stage-fix','screen-light',
 'lighting-setup','led-green-screen','camera-operation','volume-operator','light-check','crew-set',
 'set-dressing','props-prep','temple-stage','temple-wide','sand-stage','arena-slate','crew-wrap',
 'wrap-slate','wrap-keepsakes','shot-list'
];
const RANA_FILM_PHOTO_SIZES={
 'handmade-rock-props':[1024,576],'arena-practical-model':[768,600],
 'collaborative-planning':[1900,1425],'script-and-shot-lists':[1275,1700],
 'arena-slate':[1200,1600],'sand-bags':[1350,1800],'slate-notes':[1200,1600],'reuse-wardrobe':[1200,1600],
 'making-rocks':[2200,1650],'workshop-team':[1900,1425],'camera-take':[1900,1425],'temple-haze':[1900,1425],
 'rocks-in-workshop':[2200,1650],'reuse-store':[2200,1650],'wrap-slate':[2200,1650],
 'wrap-keepsakes':[2200,1650],'temple-wide':[1900,1069]
};

function RanaStageWorlds({base}){
 const [active,setActive]=React.useState(0);
 const scenes=[
  {name:'Empty stage',src:base+'vp-stage-calibration-level.webp',alt:'The empty XR stage displaying its calibration grid, without cast or crew'},
  {name:'Arena',src:base+'vp-stage-environment-level.webp',alt:'The original Ranasthala arena photograph from the matched empty-stage and environment pair'},
  {name:'Hallway',src:base+'bts/temple-wide.webp',alt:'The second, shadowed hallway environment on the LED stage, without cast or crew'}
 ];
 const change=d=>setActive(i=>(i+d+scenes.length)%scenes.length);
 return <div className="rn-stage-worlds" data-image-navigation="">
  <button type="button" className="rn-stage-world-button" data-photo-frame="" onClick={()=>change(1)} aria-label={'Show '+scenes[(active+1)%scenes.length].name.toLowerCase()+' on the XR stage'} onKeyDown={e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();change(e.key==='ArrowRight'?1:-1)}}}>
   {scenes.map((scene,i)=><img key={scene.name} src={scene.src} alt={scene.alt} aria-hidden={active!==i} className={active===i?'is-current':''} loading={i===0?'eager':'lazy'}/>)}
  </button>
  <div className="rn-stage-world-labels" role="group" aria-label="XR stage environments">{scenes.map((scene,i)=><button key={scene.name} type="button" aria-pressed={active===i} onClick={()=>setActive(i)}>{scene.name}</button>)}</div>
 </div>;
}

function RanaFilmStrip({base,files,reverse=false,onInspect,paused=false,duration=78}){
 const root=React.useRef(null),[running,setRunning]=React.useState(false);
 const pace=value=>root.current?.querySelector('.rn-celluloid-track')?.getAnimations().forEach(animation=>animation.updatePlaybackRate(value));
 React.useEffect(()=>{
  let visible=false;
  const sync=()=>setRunning(visible&&!document.hidden);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()},{rootMargin:'100px'});
  observer.observe(root.current);document.addEventListener('visibilitychange',sync);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync)};
 },[]);
 return <div ref={root} className={'rn-celluloid-viewport'+(reverse?' is-reversed':'')} data-running={running&&!paused} data-image-navigation="" onPointerEnter={e=>{if(e.pointerType==='mouse')pace(.45)}} onPointerLeave={()=>pace(1)} style={{'--film-duration':duration+'s'}}><div className="rn-celluloid-track">
  {[0,1].map(copy=><div className="rn-celluloid-copy" key={copy} aria-hidden={copy===1}>{files.map(file=>{
   const [width,height]=RANA_FILM_PHOTO_SIZES[file]||[1900,1267];
   return <button type="button" className="rn-celluloid-frame" key={file} style={{'--frame-ratio':width/height}} data-photo-frame="" tabIndex={copy===1?-1:0} aria-label={RANA_BTS_PHOTOS[file]} onClick={()=>onInspect({image:base+file+'.webp',alt:RANA_BTS_PHOTOS[file]})}><img src={base+file+'.webp'} alt={RANA_BTS_PHOTOS[file]} width={width} height={height} loading="lazy" decoding="async" draggable={false}/></button>;
  })}</div>)}
 </div></div>;
}

function RanaShootReel({base,photos,onInspect,paused=false}){
 return <div className="rn-film-ribbons rn-film-ribbons-shoot rn-film-ribbons-pair">
  <RanaFilmStrip base={base} files={photos.filter((_,i)=>i%2===0)} onInspect={onInspect} paused={paused} duration={66}/>
  <RanaFilmStrip base={base} files={photos.filter((_,i)=>i%2===1)} onInspect={onInspect} paused={paused} duration={72} reverse/>
 </div>;
}

function RanaPreparationPhotos({base,onInspect}){
 const root=React.useRef(null);
 React.useEffect(()=>{
  const el=root.current;let visible=false;
  const sync=()=>{el.dataset.running=String(visible&&!document.hidden)};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()},{threshold:.1});observer.observe(el);
  document.addEventListener('visibilitychange',sync);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync)};
 },[]);
 return <Reveal className="rn-prep-gallery-wrap"><div ref={root} className="rn-prep-gallery" data-image-navigation="" onPointerMove={e=>{if(e.pointerType!=='mouse')return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--prep-x',((e.clientX-r.left)/r.width-.5)*9+'px');e.currentTarget.style.setProperty('--prep-y',((e.clientY-r.top)/r.height-.5)*7+'px')}} onPointerLeave={e=>{e.currentTarget.style.setProperty('--prep-x','0px');e.currentTarget.style.setProperty('--prep-y','0px')}}>
  {RANA_FILM_PREP.map((file,i)=>{
   const source=base+file+(file==='arena-practical-model'?'.svg':'.webp');
   const [width,height]=RANA_FILM_PHOTO_SIZES[file]||[1900,1425], [x,y,w,r,z]=RANA_PREP_AIR_POSES[i],[mx,my,mw,mr,mz]=RANA_PREP_AIR_MOBILE[i];
   return <figure className="rn-prep-photo" key={file} style={{'--ax':x+'%','--ay':y+'%','--aw':w+'%','--ar':r+'deg','--az':z,'--mx':mx+'%','--my':my+'%','--mw':mw+'%','--mr':mr+'deg','--mz':mz}}><div className="rn-prep-drift"><button type="button" data-photo-frame="" data-image-navigation="" aria-label={RANA_BTS_PHOTOS[file]} onClick={()=>onInspect({image:source,alt:RANA_BTS_PHOTOS[file]})}><img src={source} alt={RANA_BTS_PHOTOS[file]} width={width} height={height} loading="lazy" decoding="async" draggable={false}/><span className="rn-prep-caption">{RANA_PREP_CAPTIONS[file]}</span></button></div></figure>;
  })}
 </div></Reveal>;
}

function RanaTeamPortrait({base}){
 const [active,setActive]=React.useState(null),person=RANA_TEAM_MEMBERS.find(member=>member.id===active);
 const label=member=>member.name||'Team member '+member.id;
 const frame=RANA_TEAM_FRAMES[(active||1)-1];
 return <figure className="rn-team-figure">
  <div className="rn-team-photo" data-photo-frame="" data-image-navigation="" onPointerLeave={e=>{if(e.pointerType==='mouse')setActive(null)}} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setActive(null)}} onKeyDown={e=>{if(e.key==='Escape')setActive(null)}}>
   <img className="rn-team-base-image" src={base+'team.webp'} alt="The Ranasthala cast and crew together on the XR stage" width="2200" height="1650" loading="lazy"/>
   {RANA_TEAM_MEMBERS.map(member=><button type="button" key={member.id} className={'rn-team-person'+(active===member.id?' is-selected':'')} style={{left:(member.x-4.5)+'%',top:(member.y-5)+'%',width:'9%',height:member.back?'24%':'44%',zIndex:member.back?2:3}} aria-label={label(member)+(member.role?', '+member.role:'')} aria-expanded={active===member.id} aria-describedby={active===member.id?'rn-team-tooltip':undefined} onPointerEnter={e=>{if(e.pointerType==='mouse')setActive(member.id)}} onFocus={()=>setActive(member.id)} onClick={()=>setActive(member.id)}/>)}
   <div className="rn-team-focus" aria-hidden="true" style={{left:frame[0]+'%',top:frame[1]+'%',width:frame[2]+'%',height:frame[3]+'%',opacity:person?1:0}}/>
   {person&&<div key={person.id} id="rn-team-tooltip" role="tooltip" className="rn-team-tooltip" style={{left:Math.max(22,Math.min(78,person.x))+'%',top:(frame[1]-6)+'%'}}><div><strong>{label(person)}</strong><small>{person.role}</small></div></div>}
  </div>
 </figure>;
}

function RanaSetPlan({onInspect}){
 const [focus,setFocus]=React.useState('all'),[markup,setMarkup]=React.useState('');
 React.useEffect(()=>{const controller=new AbortController();fetch('assets/ranasthala-set-plan.svg',{signal:controller.signal}).then(response=>{if(!response.ok)throw new Error('Plan unavailable');return response.text()}).then(svg=>setMarkup(svg.replace(/<style>[\s\S]*?<\/style>/g,'').replaceAll('id="grid"','id="rn-plan-grid"').replaceAll('url(#grid)','url(#rn-plan-grid)').replaceAll('id="title"','id="rn-plan-title"').replaceAll('id="desc"','id="rn-plan-desc"').replaceAll('aria-labelledby="title desc"','aria-labelledby="rn-plan-title rn-plan-desc"'))).catch(()=>{});return()=>controller.abort()},[]);
 const notes={all:'One plan. A shared stage.',stage:'The LED wall and active stage.',camera:'Camera, equipment and viewing direction.',set:'Sand, rocks and the practical border.'};
 return <figure className="rn-set-layer" id="rn-set-plan" data-focus={focus}>
  <div className="rn-set-layer-tabs" role="group" aria-label="Set plan layers">{[['all','Full plan'],['stage','Stage'],['camera','Camera'],['set','Practical set']].map(([key,label])=><button type="button" key={key} aria-pressed={focus===key} disabled={!markup} onClick={()=>setFocus(key)}>{label}</button>)}</div>
  <button className="rn-set-layer-canvas" type="button" aria-label="Expand Ranasthala production floor plan" onClick={()=>onInspect({image:'assets/ranasthala-set-plan.svg',alt:'Ranasthala production floor plan showing the camera, LED wall and practical sand set'})}>{markup?<div dangerouslySetInnerHTML={{__html:markup}}/>:<img src="assets/ranasthala-set-plan.svg" width="900" height="590" alt="Ranasthala production floor plan"/>}</button>
  <figcaption className="rn-set-layer-note" aria-live="polite">{notes[focus]}</figcaption>
 </figure>;
}

function RanaFilmCollection({base}){
 const [active,setActive]=React.useState(0),tabs=React.useRef(null);
 const films=[{label:'Trailer',title:'Ranasthala trailer',src:base+'films/ranasthala-trailer-web.mp4',poster:base+'films/ranasthala-trailer-poster.webp'},{label:'Unreal showcase',title:'Ranasthala Unreal environment showcase',src:base+'films/unreal-desert-crown-32s.mp4',poster:base+'films/unreal-desert-crown-poster.webp'},{label:'Behind the scenes',title:'Ranasthala behind the scenes film',src:base+'bts/on-set-polished-wrap.mp4',poster:base+'bts/on-set-beatcut-poster.webp'},{label:'The film',title:'Ranasthala · Film coming soon',comingSoon:true}];
 const keys=e=>{let next;if(e.key==='ArrowRight')next=(active+1)%films.length;else if(e.key==='ArrowLeft')next=(active+films.length-1)%films.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=films.length-1;else return;e.preventDefault();setActive(next);tabs.current.querySelectorAll('button')[next].focus()};
 return <div className="rn-film-collection"><div ref={tabs} className="rn-film-tabs" role="tablist" aria-label="Ranasthala videos" onKeyDown={keys}>{films.map((film,i)=><button type="button" role="tab" id={'rn-film-tab-'+i} aria-controls={'rn-film-panel-'+i} aria-selected={active===i} tabIndex={active===i?0:-1} key={film.label} onClick={()=>setActive(i)}>{film.label}</button>)}</div><div role="tabpanel" id={'rn-film-panel-'+active} aria-labelledby={'rn-film-tab-'+active}><>{films[active].comingSoon?<div className="rn-film-coming" role="status"><span>Ranasthala / The film</span><h3>One final <em>note.</em></h3><p>Sound design in progress.</p><small>Film coming soon</small></div>:<RanaBTSFilm key={active} film={films[active]}/>}</></div></div>;
}

function RanaFilmstripChapter({base}){
 const bts=base+'bts/',[selected,setSelected]=React.useState(null);
 return <div className="rn-production-chapter rn-filmstrip-chapter" id="on-set"><style>{RANA_PRODUCTION_STYLE+RANA_FILMSTRIP_STYLE}</style>
  <section className="rn-volume-opening" aria-labelledby="rn-volume-opening-title">
   <Reveal className="rn-bts-heading"><h2 id="rn-volume-opening-title">One stage.<br/><em>Two worlds.</em></h2><dl className="rn-volume-facts"><div><dt>shooting<br/>days</dt><dd>3</dd></div><div><dt>environments</dt><dd>2</dd></div></dl></Reveal>
   <Reveal><RanaStageWorlds base={base}/></Reveal>
  </section>
  <section className="rn-preparation-story" aria-labelledby="rn-preparation-title">
   <Reveal className="rn-bts-heading rn-heading-only"><h2 id="rn-preparation-title">From script<br/><em>to set.</em></h2></Reveal>
   <RanaPreparationPhotos base={bts} onInspect={setSelected}/>
   <Reveal><RanaSetPlan onInspect={setSelected}/></Reveal>
   <Reveal className="rn-film-afterword"><p>A film takes a crew. <em>And a few extra hats.</em></p></Reveal>
  </section>
  <section className="rn-shoot-story" aria-labelledby="rn-shoot-story-title">
   <Reveal className="rn-bts-heading rn-heading-only"><h2 id="rn-shoot-story-title">Big problems.<br/><em>Surprisingly small fixes.</em></h2></Reveal>
   <Reveal><RanaShootReel base={bts} photos={RANA_FILM_SHOOT} onInspect={setSelected} paused={!!selected}/></Reveal>
   <Reveal className="rn-film-afterword"><p>One more role. One more solution. <em>One more take.</em></p></Reveal>
  </section>
  <RanaPostProduction onInspect={setSelected}/>
  <section className="rn-team-story" aria-labelledby="rn-team-story-title">
   <Reveal className="rn-bts-heading"><h2 id="rn-team-story-title">The people<br/><em>behind the frame.</em></h2><p className="rn-crew-thanks">None of it happens alone.</p></Reveal>
   <Reveal><RanaTeamPortrait base={bts}/></Reveal>
  </section>
  <section className="rn-film-closing" aria-labelledby="rn-film-closing-title"><Reveal className="rn-bts-heading"><h2 id="rn-film-closing-title">Watch <em>the films.</em></h2></Reveal><Reveal><RanaFilmCollection base={base}/></Reveal></section>
  {selected&&<ProjectImageViewer media={selected} onClose={()=>setSelected(null)}/>}
 </div>;
}

const RANA_FILMSTRIP_STYLE=`
.rn-filmstrip-chapter .rn-set-layer{width:min(100%,800px);margin:32px auto 0!important;padding:18px;border:1px solid var(--hair);border-radius:8px;background:linear-gradient(145deg,#e2bc6206,transparent 70%)}.rn-set-layer-tabs{display:flex;justify-content:center;flex-wrap:wrap;gap:9px}.rn-set-layer-tabs button{background:none;border:0;border-bottom:1px solid transparent;padding:7px 11px;font:11px/1.7 'Manrope',Arial,sans-serif;color:var(--dim)}.rn-set-layer-tabs button[aria-pressed=true]{color:var(--accent);border-color:var(--accent)}.rn-set-layer-tabs button:disabled{opacity:.5}.rn-set-layer-canvas{display:block;width:100%;padding:0;border:0;background:transparent;text-align:inherit}.rn-set-layer-canvas>div{aspect-ratio:900/590}.rn-set-layer svg,.rn-set-layer-canvas>img{display:block;width:100%;height:auto}.rn-set-layer svg text{font-family:Arial,sans-serif;fill:#eeeade}.rn-set-layer svg .label{font-size:15px;letter-spacing:1px}.rn-set-layer svg .note{font-size:12px;fill:#a4a79c}.rn-set-layer svg .gold{fill:var(--accent)}.rn-set-layer svg .line{stroke:var(--accent);stroke-width:1.3;fill:none}.rn-set-layer svg .guide{stroke:var(--accent);stroke-width:1;stroke-dasharray:5 6;fill:none;opacity:.45}.rn-set-layer svg .caption{font-size:11px;letter-spacing:2px;fill:#a4a79c}.rn-set-layer [data-layer]{transition:opacity .35s}.rn-set-layer[data-focus=camera] [data-layer]:not([data-layer=camera]),.rn-set-layer[data-focus=stage] [data-layer]:not([data-layer=stage]),.rn-set-layer[data-focus=set] [data-layer]:not([data-layer=set]){opacity:.13}.rn-filmstrip-chapter .rn-set-layer-note{font:italic 400 19px/1.4 var(--serif);color:var(--accent);text-align:center;margin:3px 0 12px}.rn-set-layer button:focus-visible{outline:1px solid var(--accent);outline-offset:4px}
@media(max-width:760px){.rn-filmstrip-chapter .rn-set-layer{padding:7px}.rn-set-layer-tabs{gap:4px}.rn-set-layer-tabs button{padding:7px 8px;font-size:10px}.rn-filmstrip-chapter .rn-set-layer-note{font-size:16px}}
.rn-filmstrip-chapter .rn-set-plan{width:min(100%,1000px);margin:32px auto 0!important}.rn-set-plan button{display:block;width:100%;padding:0;border:1px solid var(--hair);border-radius:3px;overflow:hidden;background:#fff}.rn-set-plan img{display:block;width:100%;height:auto;object-fit:contain;transform:none!important;scale:1!important;filter:none!important}.rn-filmstrip-chapter .rn-set-plan figcaption{font:italic 400 clamp(18px,2vw,24px)/1.4 var(--serif);color:var(--accent);margin-top:12px;text-align:center}.rn-set-plan button:focus-visible{outline:2px solid var(--accent);outline-offset:5px}
.rn-prep-photo button{position:relative}.rn-prep-caption{position:absolute;left:8px;bottom:8px;max-width:calc(100% - 16px);padding:7px 9px;font:10px/1.4 var(--mono);color:var(--accent);background:#090d0bea;border:1px solid var(--hair);opacity:0;translate:0 4px;transition:opacity .2s,translate .2s;pointer-events:none;text-align:left}.rn-prep-photo:hover .rn-prep-caption,.rn-prep-photo:focus-within .rn-prep-caption{opacity:1;translate:0 0}
.rn-film-tabs{display:flex;gap:24px;flex-wrap:wrap;margin:0 0 22px}.rn-film-tabs button{padding:12px 0;background:none;border:0;border-bottom:1px solid transparent;color:var(--dim);font:12px var(--mono)}.rn-film-tabs button[aria-selected=true]{color:var(--accent);border-color:var(--accent)}
@media(hover:none){.rn-prep-caption{opacity:1;translate:0 0;font-size:9px;padding:5px 7px}}
.rn-filmstrip-chapter{scroll-margin-top:30px;border-top:0;padding-top:0}
.rn-filmstrip-chapter .rn-bts-heading{align-items:center}
.rn-filmstrip-chapter .rn-bts-heading.rn-heading-only{grid-template-columns:1fr}
.rn-volume-facts{display:flex;align-items:center;gap:clamp(30px,4vw,65px);margin:0;justify-self:start}
.rn-volume-facts>div{display:flex;align-items:center;gap:15px}
.rn-volume-facts dd{order:-1;font:400 clamp(76px,7.2vw,108px)/.9 var(--serif);letter-spacing:-5px;margin:0;color:var(--ink);transition:translate .7s cubic-bezier(.22,1,.36,1),rotate .7s}
.rn-volume-facts>div:nth-child(2) dd{color:var(--accent)}
.rn-volume-facts dt{font:400 16px/1.5 'Manrope',Arial,sans-serif;color:var(--ink);letter-spacing:0}
@media(hover:hover) and (pointer:fine){.rn-volume-facts>div:hover dd{translate:0 -5px;rotate:-3deg}.rn-volume-facts>div:nth-child(2):hover dd{rotate:3deg}}
.rn-filmstrip-chapter .rn-shoot-story .rn-bts-heading{grid-template-columns:1.25fr .85fr}
.rn-filmstrip-chapter .rn-shoot-story h2{font-size:clamp(37px,4.5vw,65px)}
.rn-stage-world-button{display:block;position:relative;width:100%;aspect-ratio:2/1;padding:0;border:0;border-radius:4px;overflow:hidden;background:#050805;cursor:none!important;isolation:isolate}
.rn-stage-world-button img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 55%;opacity:0;scale:1!important;transform:none!important;transition:opacity 1.1s ease!important;pointer-events:none}
.rn-stage-world-button img.is-current{opacity:1}
.rn-stage-world-button:focus-visible{outline:2px solid var(--accent);outline-offset:5px}
.rn-stage-world-labels{display:flex;align-items:center;justify-content:center;gap:clamp(20px,4vw,50px);margin-top:21px}
.rn-stage-world-labels button{padding:9px 3px;border:0;background:transparent;color:var(--dim);font:11px/1.5 var(--mono);transition:color .45s,translate .45s;cursor:none!important}
.rn-stage-world-labels button[aria-pressed=true]{color:var(--accent);translate:0 -2px}
.rn-stage-world-labels button:focus-visible{outline:1px solid var(--accent);outline-offset:3px}
.rn-prep-gallery{--prep-x:0px;--prep-y:0px;position:relative;isolation:isolate;min-width:0;height:clamp(760px,70vw,1050px);max-width:1190px;margin:0 auto;touch-action:pan-y}
.rn-prep-gallery .rn-prep-photo{position:absolute;left:var(--ax);top:var(--ay);width:var(--aw);rotate:var(--ar);z-index:var(--az);margin:0;translate:var(--prep-x) var(--prep-y);transition:translate .9s cubic-bezier(.22,1,.36,1),scale .75s cubic-bezier(.22,1,.36,1),opacity .7s}
.rn-prep-photo button{display:block;width:100%;height:auto;border:0;padding:0;border-radius:3px;background:transparent;cursor:none!important}
.rn-prep-photo img{display:block;width:100%;height:auto;object-fit:contain;pointer-events:none;user-select:none;scale:1!important;transform:none!important;filter:none!important;border-radius:2px;box-shadow:0 18px 30px -22px #0009}
.rn-prep-photo button:focus-visible{outline:2px solid var(--accent);outline-offset:5px}
.rn-prep-drift{animation:rn-prep-drift 7s ease-in-out infinite alternate;animation-play-state:paused}
.rn-prep-gallery[data-running=true] .rn-prep-drift{animation-play-state:running}
.rn-prep-photo:nth-child(2) .rn-prep-drift,.rn-prep-photo:nth-child(5) .rn-prep-drift{animation-delay:-3s;animation-duration:8s}
.rn-prep-photo:nth-child(3) .rn-prep-drift,.rn-prep-photo:nth-child(6) .rn-prep-drift{animation-delay:-5s;animation-duration:9s}
.rn-prep-gallery:has(:focus-visible) .rn-prep-drift,body:has(dialog[open]) .rn-prep-drift{animation-play-state:paused!important}
@media(hover:hover) and(pointer:fine){.rn-prep-gallery:hover .rn-prep-drift{animation-play-state:paused}.rn-prep-gallery:has(button:hover) .rn-prep-photo{opacity:.7}.rn-prep-gallery .rn-prep-photo:has(button:hover),.rn-prep-gallery .rn-prep-photo:focus-within{opacity:1;scale:1.07;translate:var(--prep-x) calc(var(--prep-y) - 9px);z-index:20}}
@keyframes rn-prep-drift{from{translate:0 -4px}to{translate:0 5px}}
@media(max-width:900px) and(min-width:601px){.rn-prep-gallery{height:760px}}
.rn-film-ribbons{display:grid;gap:24px;overflow:hidden;padding:26px 0;--film-height:clamp(175px,18vw,265px);--sprocket:color-mix(in srgb,var(--ink) 38%,transparent)}
.rn-film-ribbons-pair{--film-height:clamp(205px,20vw,280px);gap:48px;padding:30px 0}
.rn-celluloid-viewport{position:relative;overflow:hidden;width:108%;margin-left:-4%;transform:rotate(-2deg);isolation:isolate;mask-image:linear-gradient(90deg,transparent,#000 3%,#000 97%,transparent)}
.rn-celluloid-viewport:nth-child(2){transform:rotate(2deg)}
.rn-film-ribbons-shoot .rn-celluloid-viewport{transform:rotate(1.6deg)}
.rn-film-ribbons-shoot .rn-celluloid-viewport:nth-child(2){transform:rotate(-1.6deg)}
.rn-celluloid-track{display:flex;width:max-content;animation:rn-celluloid-pass var(--film-duration) linear infinite;animation-play-state:paused}
.rn-celluloid-viewport[data-running=true] .rn-celluloid-track{animation-play-state:running}
.rn-celluloid-viewport.is-reversed .rn-celluloid-track{animation-direction:reverse}
.rn-celluloid-viewport:has(:focus-visible) .rn-celluloid-track{animation-play-state:paused!important}
@media(hover:hover) and (pointer:fine){.rn-celluloid-viewport[data-running=true]:hover .rn-celluloid-track{animation-play-state:running}}
.rn-celluloid-copy{position:relative;display:flex;gap:10px;padding:20px 10px 20px 0;flex-shrink:0;background:#030604;border-top:1px solid #ffffff15;border-bottom:1px solid #ffffff15}
.rn-celluloid-copy:before,.rn-celluloid-copy:after{content:'';position:absolute;left:0;right:0;height:8px;z-index:2;pointer-events:none;background:var(--sprocket);mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='31' height='8'%3E%3Crect x='8' width='13' height='8' rx='1.8' fill='black'/%3E%3C/svg%3E");mask-repeat:repeat-x;mask-size:31px 8px}
.rn-celluloid-copy:before{top:5px}.rn-celluloid-copy:after{bottom:5px}
.rn-celluloid-frame{position:relative;display:block;height:var(--film-height);width:calc(var(--film-height)*var(--frame-ratio));padding:0;flex-shrink:0;background:transparent;border:0;border-radius:1px;cursor:none!important;isolation:isolate}
.rn-celluloid-frame img{display:block;width:100%;height:100%;object-fit:contain;pointer-events:none;user-select:none;transition:filter .5s!important}
.rn-celluloid-frame:hover img{filter:brightness(1.075)}
.rn-celluloid-frame:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@keyframes rn-celluloid-pass{to{transform:translateX(-50%)}}
.rn-filmstrip-chapter .rn-film-afterword p{font:400 italic 25px/1.4 var(--serif);color:var(--dim);margin:20px auto 0;text-align:center;max-width:none}
.rn-film-afterword em{color:var(--accent)}
.rn-team-figure{width:min(100%,1240px);margin:0 auto!important}
.rn-team-photo{position:relative;isolation:isolate;border-radius:3px;overflow:hidden}
.rn-team-photo .rn-team-base-image{width:100%;height:auto;display:block;scale:1!important;transform:none!important;pointer-events:none}
.rn-team-person{position:absolute;display:block;padding:0;border:0;border-radius:0;background:transparent!important;box-shadow:none!important;filter:none!important;cursor:none!important;outline:0!important}
.rn-team-focus{position:absolute;z-index:5;pointer-events:none;box-shadow:none;filter:none;background:linear-gradient(var(--accent),var(--accent)) top left/18px 2px no-repeat,linear-gradient(var(--accent),var(--accent)) top left/2px 18px no-repeat,linear-gradient(var(--accent),var(--accent)) top right/18px 2px no-repeat,linear-gradient(var(--accent),var(--accent)) top right/2px 18px no-repeat,linear-gradient(var(--accent),var(--accent)) bottom left/18px 2px no-repeat,linear-gradient(var(--accent),var(--accent)) bottom left/2px 18px no-repeat,linear-gradient(var(--accent),var(--accent)) bottom right/18px 2px no-repeat,linear-gradient(var(--accent),var(--accent)) bottom right/2px 18px no-repeat;transition:left .5s ease,top .5s ease,width .5s ease,height .5s ease,opacity .3s ease}
.rn-team-tooltip{position:absolute;z-index:12;transform:translate(-50%,-50%);display:flex;align-items:center;gap:12px;min-width:165px;max-width:260px;box-sizing:border-box;padding:12px 16px;border-radius:8px;border:1px solid color-mix(in srgb,var(--accent) 35%,transparent);background:#090d0bf0;backdrop-filter:blur(16px);pointer-events:none;animation:rn-team-label .3s ease both;box-shadow:0 10px 30px #0005}
.rn-team-tooltip strong{display:block;font:500 12px/1.5 'Manrope',Arial,sans-serif;color:var(--accent);white-space:nowrap}
.rn-team-tooltip small{display:block;font:9px/1.5 var(--mono);color:var(--dim);white-space:normal}
@keyframes rn-team-label{from{opacity:0;translate:0 5px}to{opacity:1;translate:0 0}}
.rn-filmstrip-chapter .rn-bts-heading .rn-crew-thanks{font:400 italic 25px/1.4 var(--serif);color:var(--accent);margin-top:18px}
.rn-film-coming{width:100%;min-width:0;aspect-ratio:16/9;min-height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;border:1px solid var(--hair);background:radial-gradient(ellipse at 50% 90%,#c69b4420,transparent 70%),#090b0a;padding:30px 18px}.rn-film-coming>span,.rn-film-coming small{font:10px/1.6 var(--mono);letter-spacing:1.5px;text-transform:uppercase;color:var(--accent)}.rn-film-coming h3{font:400 clamp(34px,6vw,76px)/1.1 var(--serif);margin:22px 0 12px}.rn-film-coming em{color:var(--accent)}.rn-film-coming p{font:14px/1.7 var(--mono);color:var(--dim);margin:0 0 24px}.rn-filmstrip-chapter .rn-film-closing{margin-bottom:0}
@media(max-width:760px){
 .rn-volume-facts{gap:32px;margin-top:5px}.rn-volume-facts>div{gap:12px}.rn-volume-facts dd{font-size:76px;letter-spacing:-3px}.rn-volume-facts dt{font-size:14px}
 .rn-filmstrip-chapter .rn-shoot-story .rn-bts-heading{grid-template-columns:1fr}
 .rn-filmstrip-chapter .rn-shoot-story h2{font-size:37px}
 .rn-stage-world-button{aspect-ratio:1.7}
 .rn-stage-world-labels{gap:25px;margin-top:14px}.rn-stage-world-labels button{font-size:10px;min-height:40px}
 .rn-film-ribbons{--film-height:175px;gap:17px;padding:17px 0}
 .rn-film-ribbons-pair{--film-height:195px;gap:22px;padding:22px 0}
 .rn-celluloid-copy{gap:8px;padding:17px 8px 17px 0}.rn-celluloid-copy:before{top:4px}.rn-celluloid-copy:after{bottom:4px}.rn-celluloid-copy:before,.rn-celluloid-copy:after{height:7px;mask-size:27px 7px}
 .rn-filmstrip-chapter .rn-film-afterword p{font-size:20px;margin-top:12px;max-width:29ch}
 .rn-team-tooltip{min-width:130px;padding:9px 11px;gap:8px}.rn-team-tooltip strong{font-size:10px}.rn-team-tooltip small{font-size:8px}
}
@media(max-width:600px){.rn-prep-gallery{height:auto;aspect-ratio:auto;width:100%;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-items:center;gap:22px 16px;padding:8px 4px}.rn-prep-gallery .rn-prep-photo{position:relative;left:auto;top:auto;width:100%;rotate:-1deg;z-index:auto}.rn-prep-gallery .rn-prep-photo:nth-child(even){rotate:1deg}.rn-prep-gallery .rn-prep-drift{animation:none!important}}
@media(prefers-reduced-motion:reduce){.rn-prep-photo,.rn-prep-drift{animation:none!important;transition:none!important;translate:0 0!important}}
@media(prefers-reduced-motion:reduce){.rn-celluloid-track{animation:none!important}.rn-celluloid-viewport{overflow-x:auto;scrollbar-width:thin}.rn-celluloid-copy:nth-child(2){display:none}.rn-stage-world-button img,.rn-team-person,.rn-team-focus,.rn-team-tooltip,.rn-volume-facts dd{transition:none!important;animation:none!important}.rn-volume-facts dd{translate:none!important;rotate:none!important}}
`;

// Selected local design; the six independent studies remain available on their preview page.
RanaProductionChapter=RanaFilmstripChapter;
