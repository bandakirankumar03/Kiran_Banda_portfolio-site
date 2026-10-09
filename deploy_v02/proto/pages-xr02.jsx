// XR02 case study: concise production story, local media and shared image inspector.
function NYCCasePage({p,x,prev,next,go}) {
  const [selected,setSelected]=React.useState(null);
  const [reveal,setReveal]=React.useState(52);
  const base='media/projects/xr02-1920s-nyc/web/';
  const media=(file,alt)=>({image:base+file,alt});
  const photo=(file,alt,cls='')=><StoryImage media={media(file,alt)} className={cls} onInspect={setSelected}/>;
  const jump=()=>document.getElementById('nyc-film').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  const cast=['114801','114804','114807','114812'];
  return <article className="nyc-case">
    <style>{`
      .nyc-case { --nyc-muted:#b5b3ad; }
      .nyc-cover { height:80svh; min-height:590px; max-height:850px; position:relative; display:flex; align-items:flex-end; padding:110px var(--pad) 42px; isolation:isolate; }
      .nyc-cover>img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:-2; }
      .nyc-cover:after { content:''; position:absolute; inset:0; z-index:-1; background:linear-gradient(180deg,#080a1040,transparent 20%,#090b1088 55%,#0b0b0c 100%); }
      .nyc-cover-inner { max-width:1280px; margin:0 auto; width:100%; }
      .nyc-eyebrow { display:block; font:10px/1.5 var(--mono); color:var(--accent); letter-spacing:2px; text-transform:uppercase; }
      .nyc-cover h1 { font:400 clamp(58px,8vw,110px)/1.02 var(--serif); letter-spacing:-4px; margin:21px 0; max-width:10ch; }
      .nyc-case em { color:#C1663B; font-weight:400; }
      .nyc-cover-bottom { display:flex; justify-content:space-between; align-items:end; gap:24px; }
      .nyc-cover-bottom p { margin:0; max-width:43ch; font:15px/1.7 Arial,sans-serif; color:#d7d3cd; }
      .nyc-action { color:var(--accent); background:none; border:0; border-bottom:1px solid var(--hair); padding:13px 0; font:11px var(--mono); cursor:pointer; white-space:nowrap; }
      .nyc-main { max-width:1376px; padding:0 var(--pad) 70px; margin:auto; }
      .nyc-brief { display:grid; grid-template-columns:1.3fr 1fr 1fr; gap:28px; padding:28px 0 34px; border-bottom:1px solid var(--hair); margin-bottom:54px; }
      .nyc-brief dt { font:9px var(--mono); text-transform:uppercase; letter-spacing:1.5px; color:var(--accent); margin-bottom:10px; }
      .nyc-brief dd { margin:0; font:13px/1.75 Arial,sans-serif; color:var(--nyc-muted); }
      .nyc-flow { display:grid; grid-template-columns:repeat(12,minmax(0,1fr)); gap:34px 26px; align-items:center; }
      .nyc-flow>* { min-width:0; }
      .nyc-copy h2 { font:400 clamp(30px,3.6vw,48px)/1.17 var(--serif); letter-spacing:-1.4px; margin:14px 0 18px; }
      .nyc-copy p { color:var(--nyc-muted); font:15px/1.8 Arial,sans-serif; margin:0; max-width:49ch; }
      .nyc-caption { font:10px/1.6 var(--mono); color:var(--dim); margin:10px 0 0; }
      .nyc-intro { grid-column:1/6; }
      .nyc-aerial { grid-column:7/13; }
      .nyc-wide { grid-column:1/-1; }
      .nyc-comparison { position:relative; aspect-ratio:4048/1712; overflow:hidden; background:#151619; }
      .nyc-comparison img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
      .nyc-compare-label { position:absolute; top:16px; padding:6px 10px; background:#08090bd9; color:#eae5dd; font:10px var(--mono); }
      .nyc-compare-bar { position:absolute; inset:0 auto 0 0; border-right:1px solid #fff9; pointer-events:none; }
      .nyc-compare-bar span { position:absolute; top:50%; right:-21px; width:42px; height:42px; display:grid; place-items:center; background:#101216; border:1px solid #fff8; border-radius:50%; color:#fff; font:16px Arial; }
      .nyc-comparison input { position:absolute; inset:0; width:100%; height:100%; margin:0; opacity:0; cursor:ew-resize; touch-action:pan-y; }
      .nyc-comparison:focus-within { outline:2px solid var(--accent); outline-offset:4px; }
      .nyc-comparison-caption { display:flex; justify-content:space-between; align-items:baseline; gap:12px; }
      .nyc-comparison-caption button { font:10px var(--mono); }
      .nyc-facade { grid-column:1/5; }
      .nyc-facade .xr-photo { aspect-ratio:1/1; }
      .nyc-build { grid-column:6/13; }
      .nyc-steps { display:flex; gap:16px; padding:22px 0 0; margin:0; list-style:none; }
      .nyc-steps li { flex:1; border-top:1px solid var(--hair); padding-top:12px; font:12px/1.7 Arial,sans-serif; color:var(--nyc-muted); }
      .nyc-steps b { display:block; font:10px var(--mono); color:var(--accent); margin-bottom:8px; font-weight:400; }
      .nyc-assets { grid-column:6/13; display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:-15px; }
      .nyc-assets .xr-photo { aspect-ratio:3/1; }
      .nyc-cast-copy { grid-column:1/7; padding-top:24px; }
      .nyc-cast-note { grid-column:9/13; align-self:end; }
      .nyc-cast { grid-column:1/-1; display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:9px; }
      .nyc-cast .xr-photo { aspect-ratio:3/4; }
      .nyc-cast .xr-photo img { object-fit:cover; }
      .nyc-case .nyc-cast .nyc-reference img { object-fit:contain; background:#242522; }
      .nyc-cast .nyc-last img { object-position:left center; }
      .nyc-cast .nyc-caption { font-size:9px; }
      .nyc-capture { grid-column:1/7; }
      .nyc-capture .xr-photo { aspect-ratio:16/9; }
      .nyc-capture-copy { grid-column:8/13; }
      .nyc-stage-title { grid-column:2/10; padding-top:30px; }
      .nyc-stage { grid-column:1/9; }
      .nyc-stage .xr-photo { aspect-ratio:16/10; }
      .nyc-props { grid-column:9/13; display:grid; grid-template-columns:1fr 1fr; gap:10px; }
      .nyc-props .xr-photo { aspect-ratio:3/4; }
      .nyc-props p { grid-column:1/-1; }
      .nyc-decision { grid-column:2/6; }
      .nyc-diagnostic { grid-column:7/13; }
      .nyc-decision h3 { font:400 25px/1.3 var(--serif); margin:12px 0; }
      .nyc-result { grid-column:2/11; padding:14px 0 22px; }
      .nyc-result p { font:clamp(23px,2.7vw,35px)/1.5 var(--serif); color:var(--ink); max-width:44ch; }
      .nyc-bts { grid-column:1/-1; scroll-margin-top:100px; }
      .nyc-bts-heading { display:flex; justify-content:space-between; align-items:center; gap:20px; margin-bottom:20px; }
      .nyc-bts h2 { font:400 38px var(--serif); margin:0; }
      .nyc-bts video { display:block; width:100%; aspect-ratio:auto; background:transparent; max-height:none; cursor:auto; }
      .nyc-bts .nyc-caption { max-width:75ch; }
      .nyc-case button:focus-visible { outline:2px solid var(--accent); outline-offset:4px; }
      .nyc-case .xr-photo { position:relative; display:block; width:100%; padding:0; border:1px solid var(--hair); border-radius:2px; overflow:hidden; background:#111315; cursor:zoom-in; }
      .nyc-case .xr-photo img { display:block; width:100%; height:100%; object-fit:cover; }
      .nyc-case .xr-expand { position:absolute; bottom:8px; right:8px; display:grid; place-items:center; width:34px; height:34px; border:1px solid #ffffff55; border-radius:50%; background:#111c; color:#fff; font:23px Arial; }
      @media(hover:hover) { .nyc-case .xr-expand { opacity:0; } .nyc-case .xr-photo:hover .xr-expand,.nyc-case .xr-photo:focus-visible .xr-expand { opacity:1; } }
      @media(hover:hover) and (prefers-reduced-motion:no-preference) { .nyc-case .xr-photo img { transition:transform .4s; } .nyc-case .xr-photo:hover img { transform:translate(var(--xr-x,0px),var(--xr-y,0px)) scale(1.025); } }
      .nyc-case .xr-image-dialog { position:fixed; inset:0; margin:0; padding:0; border:0; background:transparent; width:100vw; height:100dvh; max-width:none; max-height:none; overflow:hidden; cursor:default!important; }
      .nyc-case .xr-image-dialog::backdrop { background:#000e; }
      .nyc-case .xr-image-canvas { width:100%; height:100%; display:flex; align-items:center; justify-content:center; overflow:hidden; touch-action:none; cursor:zoom-in!important; }
      .nyc-case .xr-image-canvas[data-zoomed=true] { cursor:grab!important; }
      .nyc-case .xr-image-canvas[data-dragging=true] { cursor:grabbing!important; }
      .nyc-case .xr-image-canvas img { display:block; max-width:94vw; max-height:90dvh; width:auto; height:auto; object-fit:contain; user-select:none; pointer-events:none; }
      .nyc-case .xr-image-close { position:absolute; top:16px; right:16px; z-index:2; width:44px; height:44px; display:grid; place-items:center; border:0; border-radius:50%; background:#0006; color:#fff; cursor:pointer!important; }
      .nyc-aerial .xr-photo { aspect-ratio:1; max-height:440px; }
      .nyc-asset-group { grid-column:1/-1; margin-top:0; gap:22px; }
      .nyc-asset-group .xr-photo { aspect-ratio:3/1; }
      .nyc-scene-copy { grid-column:1/6; padding-top:20px; }
      .nyc-scene-image { grid-column:7/13; }
      .nyc-checks { grid-column:1/-1; }
      .nyc-check-grid { display:grid; grid-template-columns:1fr 1fr; gap:22px; margin-top:20px; }
      .nyc-check-grid .xr-photo { aspect-ratio:2.36; }
      .nyc-character-pair { grid-column:2/12; display:grid; grid-template-columns:1fr 1fr; gap:22px; }
      .nyc-character-pair .xr-photo { aspect-ratio:1; }
      .nyc-case .nyc-character-pair .nyc-reference img { object-fit:contain; background:#242522; }
      .nyc-case .nyc-character-pair .nyc-model img { object-position:left center; }
      .nyc-character-pair b { display:block; color:var(--accent); font-weight:400; margin-bottom:7px; }
      .nyc-cast { grid-column:3/11; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; }
      .nyc-cast>span { grid-column:1/-1; margin-bottom:3px; }
      .nyc-decision { grid-column:2/11; }
      .nyc-decision p { max-width:80ch; }
      .nyc-asset-process { grid-column:1/-1; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; }
      .nyc-asset-process .xr-photo { aspect-ratio:4/3; }
      .nyc-asset-process b { display:block; color:var(--accent); font-weight:400; margin-bottom:6px; }
      .nyc-aerial .xr-photo { aspect-ratio:3/2; max-height:none; }
      .nyc-case .nyc-aerial img { object-fit:contain; }
      .nyc-case .nyc-asset-process img { object-fit:cover; }
      .nyc-case .nyc-asset-process .nyc-unreal-asset img { position:absolute; width:100%; height:150%; max-width:none; top:-40%; left:0; object-fit:cover; object-position:center; }
      .nyc-overhead { grid-column:2/12; }
      .nyc-overhead .xr-photo { aspect-ratio:2.36; }
      .nyc-team { grid-column:2/12; }
      .nyc-team .xr-photo img { height:auto; }
      .nyc-case .nyc-character-pair .nyc-model img { width:100%; max-width:none; height:150%; position:absolute; left:0; top:-28%; object-fit:cover; object-position:30% center; }
      .nyc-capture-pair { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
      .nyc-capture-pair .xr-photo { aspect-ratio:4/5; }
      .nyc-set-more { grid-column:1/-1; display:grid; grid-template-columns:1fr 1fr; gap:22px; }
      .nyc-set-more .xr-photo { aspect-ratio:16/10; }
      @media(max-width:760px) {
        .nyc-asset-process { grid-template-columns:1fr 1fr; gap:14px; }.nyc-asset-process>div:last-child { grid-column:1/-1; width:70%; margin:auto; }.nyc-set-more { gap:12px; }
        .nyc-cover { min-height:530px; height:76svh; padding-bottom:28px; }
        .nyc-cover h1 { font-size:clamp(48px,11.5vw,80px); letter-spacing:-2px; }
        .nyc-cover-bottom { display:block; }.nyc-cover-bottom p { font-size:13px; }
        .nyc-cover .nyc-action { margin-top:15px; }
        .nyc-brief { grid-template-columns:1fr 1fr; gap:20px; margin-bottom:35px; }.nyc-brief>div:first-child { grid-column:1/-1; }
        .nyc-flow { grid-template-columns:repeat(6,minmax(0,1fr)); gap:26px 12px; }.nyc-flow>* { grid-column:1/-1; padding-top:0; }
        .nyc-flow .nyc-aerial { grid-column:2/7; }.nyc-flow .nyc-facade { grid-column:1/5; }
        .nyc-cast { grid-template-columns:repeat(2,minmax(0,1fr)); }.nyc-cast .xr-photo { aspect-ratio:3/4; }
        .nyc-cast-note { margin-top:-12px; }.nyc-assets { margin-top:0; }
        .nyc-steps { gap:12px; }.nyc-steps li { font-size:11px; }
        .nyc-comparison { aspect-ratio:16/9; }.nyc-comparison img { object-fit:contain; }.nyc-compare-label { font-size:8px; top:6px; }
        .nyc-comparison-caption { flex-wrap:wrap; gap:0; }.nyc-comparison-caption p { max-width:32ch; }
        .nyc-flow .nyc-props { grid-column:2/7; }.nyc-bts-heading { align-items:baseline; }.nyc-bts h2 { font-size:30px; }
        .nyc-character-pair { gap:10px; }.nyc-character-pair .nyc-caption { font-size:9px; }.nyc-check-grid { grid-template-columns:1fr; gap:18px; }.nyc-asset-group { gap:12px; }.nyc-asset-group .xr-photo { aspect-ratio:2; }
        .nyc-result p { font-size:24px; }.nyc-copy h2 { font-size:32px; }
      }
      @media(prefers-reduced-motion:reduce) { .nyc-case [style*="opacity"] { transition:none!important; } }
    `}</style>
    <ProjectCover p={p} description="Two rival gangs. One digital street. A student virtual production film inspired by 1890s industrial New York." actionLabel="Watch the film" onAction={jump}/>
    <main className="nyc-main">
      <dl className="nyc-brief"><div><dt>My contribution</dt><dd>Unreal environment development<br/>Sony mocopi capture / XYN workflow</dd></div><div><dt>Core tools</dt><dd>Unreal Engine / Blender<br/>Gemini / Meshyfy 3D / Claude<br/>Sony mocopi / XYN</dd></div><div><dt>Production focus</dt><dd>Image-based architecture<br/>Character motion / XR-stage performance</dd></div></dl>
      <div className="nyc-flow">
        <div className="nyc-intro nyc-copy"><Reveal><span className="nyc-eyebrow">Image → geometry</span><h2>Start with an image.<br/><em>Build only the depth.</em></h2><p>Gemini-generated building images became façades in Blender. I mapped each image to a plane and extruded selected faces to bring windows, ledges, and rooflines forward—then assembled the street in Unreal.</p><ol className="nyc-steps"><li><b>Generate</b>Façade imagery</li><li><b>Shape</b>Selective extrusion</li><li><b>Assemble</b>Light and compose</li></ol></Reveal></div>
        <div className="nyc-aerial"><Reveal>{photo('gemini-lucas.webp','Gemini-generated Lucas Theatre façade reference')}<p className="nyc-caption">Gemini / the source image</p></Reveal></div>
        <div className="nyc-asset-process"><div>{photo('blender-projection.webp','Gray Lucas Theatre geometry built in Blender')}<p className="nyc-caption"><b>Blender / Model</b>Selective extrusion creates depth.</p></div><div>{photo('blender-model.webp','Gemini image projected onto the Lucas Theatre model in Blender')}<p className="nyc-caption"><b>Blender / Project</b>The source image becomes the surface.</p></div><div>{photo('screenshot-2026-10-06-115029.webp','Lucas Theatre asset imported into Unreal','nyc-unreal-asset')}<p className="nyc-caption"><b>Unreal / Assemble</b>The asset is ready for the street.</p></div></div>
        <div className="nyc-assets nyc-asset-group"><div>{photo('screenshot-2026-10-06-115146.webp','Building and façade assets in the Unreal content browser')}<p className="nyc-caption">Architecture library</p></div><div>{photo('screenshot-2026-10-06-115125.webp','Props and set dressing assets in the Unreal content browser')}<p className="nyc-caption">Props and set dressing</p></div></div>
        <div className="nyc-scene-copy nyc-copy"><Reveal><span className="nyc-eyebrow">Assembling the scene</span><h2>A street with<br/><em>a story to tell.</em></h2><p>Inspired by 1890s industrial New York, I built a cinematic street for a confrontation between two rival gangs, with depth, atmosphere, and room for live-action performance. I developed the full Unreal environment, from blockout to stage adaptation.</p></Reveal></div>
        <div className="nyc-scene-image"><Reveal>{photo('highresscreenshot00008.webp','Lucas façade integrated into the lit street environment')}<p className="nyc-caption">From the façade asset to its place in the street.</p></Reveal></div>
        <div className="nyc-wide"><Reveal><div className="nyc-comparison" role="group" aria-label="Compare neutral shading and the lit environment"><img src={base+'highresscreenshot00000.webp'} alt="Final lit industrial street" loading="lazy"/><img src={base+'highresscreenshot00001.webp'} alt="Neutral shading of the same street composition" loading="lazy" style={{clipPath:`inset(0 ${100-reveal}% 0 0)`}}/><span className="nyc-compare-label" style={{left:12}}>Neutral shading</span><span className="nyc-compare-label" style={{right:12}}>Lit environment</span><div className="nyc-compare-bar" style={{width:reveal+'%'}}><span>↔</span></div><input type="range" min="0" max="100" value={reveal} onChange={e=>setReveal(Number(e.target.value))} aria-label="Reveal neutral shading" aria-valuetext={`${reveal}% neutral shading`}/></div><div className="nyc-comparison-caption"><p className="nyc-caption">Drag to compare / the same composition, two render views</p><button className="nyc-action" onClick={()=>setSelected(media('highresscreenshot00000.webp','Final lit industrial street'))}>Inspect final image ↗</button></div></Reveal></div>
        <div className="nyc-overhead"><Reveal>{photo('highresscreenshot00009.webp','Top view of the complete Unreal street environment')}<p className="nyc-caption">The complete layout / arranging the façades, street, and set dressing.</p></Reveal></div>
        <div className="nyc-checks"><div><span className="nyc-eyebrow">Scene checks / Before the stage</span><p className="nyc-caption">Geometry, lighting, and render views / inspect each image for detail.</p></div><div className="nyc-check-grid"><div>{photo('highresscreenshot00005.webp','Unreal geometry diagnostic views around the final street render')}<p className="nyc-caption">Geometry diagnostics</p></div><div>{photo('highresscreenshot00002.webp','Unreal lighting and render buffer overview')}<p className="nyc-caption">Lighting / render buffers</p></div></div></div>
        <div className="nyc-cast-copy nyc-copy"><Reveal><span className="nyc-eyebrow">AI character development</span><h2>From an image<br/><em>to a performance.</em></h2><p>We generated the character reference in Gemini, then used Meshyfy 3D to create a rigged 3D character. Sony mocopi capture supplied the movement for the animation workflow in Unreal.</p></Reveal></div>
        <div className="nyc-cast-note"><p className="nyc-caption">Gemini image → Meshyfy 3D character → mocopi motion.<br/>Select any image to inspect it.</p></div>
        <div className="nyc-character-pair"><div>{photo('character-reference.webp','Gemini-generated dark-coat character reference','nyc-reference')}<p className="nyc-caption"><b>Gemini</b>Generated character reference</p></div><div>{photo('screenshot-2026-10-06-114820.webp','Matching dark-coat 3D character generated in Meshyfy 3D and imported into Unreal','nyc-model')}<p className="nyc-caption"><b>Meshyfy 3D</b>Generated 3D character / Unreal viewport</p></div></div>
        <div className="nyc-cast"><span className="nyc-eyebrow">More generated characters</span>{cast.map((id,i)=><div key={id}>{photo(`screenshot-2026-10-06-${id}.webp`,`AI-generated 3D character ${i+1} in Unreal`)}<p className="nyc-caption">Generated character</p></div>)}</div>
        <div className="nyc-capture"><Reveal><div className="nyc-capture-pair">{photo('mocopi-session.webp','Motion-capture recording in XYN software')}{photo('mocopi-performer.webp','Performer wearing Sony mocopi sensors during the capture session')}</div><p className="nyc-caption">Sony mocopi / capturing movement and recording in XYN</p></Reveal></div>
        <div className="nyc-capture-copy nyc-copy"><Reveal><span className="nyc-eyebrow">Performance capture</span><h2>Small sensors.<br/><em>Real movement.</em></h2><p>I set up Sony mocopi sensors and operated capture sessions in XYN. I recorded and exported the motion, made small adjustments, and incorporated the performance into the character workflow.</p></Reveal></div>
        <div className="nyc-stage-title nyc-copy"><Reveal><span className="nyc-eyebrow">On the XR stage</span><h2>Digital depth.<br/><em>Physical presence.</em></h2></Reveal></div>
        <div className="nyc-stage"><Reveal>{photo('photo-feb-17-2026-2-41-15-pm.webp','Crew dressing the physical set in front of the industrial street on the LED wall')}<p className="nyc-caption">Practical props meet the digital street extension.</p></Reveal></div>
        <div className="nyc-props">{photo('photo-feb-13-2026-10-44-59-am.webp','Barrels transported for the physical set')}{photo('photo-feb-16-2026-10-28-49-am.webp','Wooden pallets transported for the physical set')}<p className="nyc-caption">Working with production design, we brought rented props onto the stage and matched them to the environment.</p></div>
        <div className="nyc-set-more"><div>{photo('photo-feb-17-2026-3-10-30-pm.webp','Unreal workstations and monitoring at the XR stage')}<p className="nyc-caption">Monitoring the digital set</p></div><div>{photo('photo-feb-18-2026-12-47-50-pm.webp','Cast and crew preparing the scene on the XR stage')}<p className="nyc-caption">Cast and crew / preparing the take</p></div></div>
        <div className="nyc-decision nyc-copy"><Reveal><span className="nyc-eyebrow">A production decision</span><h3>The effect that stayed out.</h3><p>We tested an AI-generated explosion and compressed its data, but the XR system could not play it reliably. We removed it from the shoot and prioritized a stable scene, refining texture use, lighting, and scene complexity.</p></Reveal></div>
        <div className="nyc-team"><Reveal>{photo('team.webp','The Parley team together on the virtual production stage')}<p className="nyc-caption">The Parley / the team behind the film</p></Reveal></div>
        <div className="nyc-result"><Reveal><span className="nyc-eyebrow">What I took forward</span><p>AI sped up exploration. Capture brought in performance. <em>Stage testing shaped what we could actually film.</em></p></Reveal></div>
        <div id="nyc-film" className="nyc-bts"><div className="nyc-bts-heading"><h2>The finished work.</h2><span className="nyc-eyebrow">Film / environment / on set</span></div><StoryFilms p={p} x={x}/></div>
      </div>
    </main>
    <CaseFooterNav prev={prev} next={next} go={go}/>
    {selected&&<ProjectImageViewer media={selected} onClose={()=>setSelected(null)}/>}
  </article>;
}
