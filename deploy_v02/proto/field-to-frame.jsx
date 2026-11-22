const PROJECT_TAKEAWAYS={
 'ranasthala':'The camera and the stage decide which details matter.',
 'xr02-1920s-nyc':'Build the depth the camera needs.',
 'xr01-chinese-temple':'Keep the shot rich. Simplify what the stage has to render.',
 'rainy-forest':'A clear route gives a procedural world direction.',
 'photogrammetry-archive':'Capture the surface. Preserve the character.',
 'unreal-environment-studies':'Lighting and camera turn a scene into a place.',
 'vfx-compositing-works':'A convincing image is built one layer at a time.'
};

function ProjectTakeaway({p}){
 const line=p&&PROJECT_TAKEAWAYS[p.slug];
 if(!line)return null;
 return <aside className="project-takeaway" aria-label={p.title+' takeaway'}><span>The takeaway</span><p>{line}</p></aside>;
}

function RanaStoryPrimer({base}){
 const root=React.useRef(null),[chapter,setChapter]=React.useState(0);
 const chapters=['Capture','Reconstruct','Unreal','On stage','Trailer'];
 const seek=i=>{const video=root.current?.querySelector('video');if(video&&Number.isFinite(video.duration)){video.currentTime=i*4+.01;setChapter(i)}};
 return <section className="field-frame-primer" aria-labelledby="field-frame-title">
  <div className="field-frame-copy"><span className="field-frame-kicker">Ranasthala / the short version</span><h2 id="field-frame-title">Field<br/>to <em>frame.</em></h2>
   <div className="field-frame-signature" aria-label="Captured in Hampi. Rebuilt in Unreal. Filmed on stage."><span>Captured in <strong>Hampi.</strong></span><span>Rebuilt in <strong>Unreal.</strong></span><span>Filmed <strong>on stage.</strong></span></div>
  </div>
  <div className="field-frame-film"><div className="field-frame-player" ref={root} data-image-navigation=""><TapVideo seekable src={base+'films/field-to-frame-20s.mp4'} poster={base+'films/field-to-frame-poster.webp'} title="Ranasthala field to frame breakdown" onTimeUpdate={e=>setChapter(Math.min(4,Math.floor(e.currentTarget.currentTime/4)))}/><span className="field-frame-duration">20 seconds / silent breakdown</span></div>
   <div className="field-frame-chapters" role="group" aria-label="Breakdown chapters">{chapters.map((label,i)=><button key={label} type="button" aria-pressed={chapter===i} aria-label={'Jump to '+label+' in the breakdown'} onClick={()=>seek(i)}><span>{String(i+1).padStart(2,'0')}</span>{label}</button>)}</div>
  </div>
 </section>;
}

function ProductionDecisions({scene,selected,onSelect}){
 const notes=scene==='Empty stage'?[
  ['Start with the volume','A calibrated, empty stage comes before the environment.',72,25],
  ['Camera first','The production camera determines the view the environment needs to support.',34,49],
  ['Connect both worlds','The practical foreground and the LED backdrop need to read as one space.',57,76]
 ]:scene==='Hallway'?[
  ['A different atmosphere','The hallway brings a different lighting mood into the same volume.',72,25],
  ['Camera first','The scene needs to hold together from the shooting camera, not only the editor viewport.',34,49],
  ['Physical meets digital','Practical set dressing connects the actors to the environment behind them.',57,76]
 ]:[
  ['Scanned identity','Photogrammetry from India gives the fictional arena its carved stonework.',72,25],
  ['Camera first','Arena composition is judged from the shooting camera, not only the editor viewport.',34,49],
  ['Practical depth','Sand and handmade rocks were added on set to connect the foreground with the digital arena.',57,76]
 ];
 return <div className="production-decisions" role="group" aria-label="Production decisions">
  {notes.map(([title,text,x,y],i)=><button key={i} type="button" className="production-point" style={{left:x+'%',top:y+'%'}} aria-label={'Production decision '+(i+1)+': '+title} aria-expanded={selected===i} aria-controls="production-decision-note" onPointerEnter={e=>{if(e.pointerType==='mouse')onSelect(i)}} onFocus={()=>onSelect(i)} onClick={()=>onSelect(i)} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();onSelect(null)}}}>{String(i+1).padStart(2,'0')}</button>)}
  {selected!==null&&<div id="production-decision-note" className={'production-decision-note'+(selected===2?' at-top':'')} aria-live="polite"><div><strong>{notes[selected][0]}</strong><p>{notes[selected][1]}</p></div><button type="button" aria-label="Close production note" onClick={()=>onSelect(null)}>Close</button></div>}
 </div>;
}
