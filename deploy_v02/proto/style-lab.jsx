// Local design preview: never changes the published default palette.
function StyleLab() {
  const enabled = ['localhost','127.0.0.1','::1'].includes(location.hostname);
  const presets = [
    {name:'Midnight / stone / crimson',bg:'#1B1E4A',primary:'#AFAEA2',accent:'#D21319',ink:'#F4F1E9'},
    {name:'Black / neon / indigo',bg:'#08070B',primary:'#F32E35',accent:'#4E50DE',ink:'#F5F3FF'},
    {name:'Ivory / gold / atlas',bg:'#E8E0D2',primary:'#0E1D61',accent:'#B89A5A',ink:'#172044'},
    {name:'Periwinkle / black / coral',bg:'#7E69E8',primary:'#000000',accent:'#FF5A5F',ink:'#101015'},
    {name:'Charcoal / earth / amber',bg:'#090907',primary:'#B99D73',accent:'#6C5636',ink:'#EEE8DB'},
    {name:'Ink / ivory / teal',bg:'#031211',primary:'#E8E4D3',accent:'#00AEBB',ink:'#E8E4D3'},
  ];
  const initial = {name:'Black / neon / indigo',bg:'#08070B',primary:'#F32E35',accent:'#4E50DE',ink:'#F5F3FF',font:'original',active:false};
  const read = (key, fallback) => {try{return JSON.parse(localStorage.getItem(key)) || fallback;}catch{return fallback;}};
  const [draft,setDraft] = React.useState(()=>read('kb-style-draft-v2',initial));
  const [open,setOpen] = React.useState(false);
  const [favorite,setFavorite] = React.useState(()=>read('kb-style-favorite-v1',null));
  const [notice,setNotice] = React.useState('');
  const fonts = {original:['"Lora",Georgia,serif','"Lora",Georgia,serif'],modern:['Arial,Helvetica,sans-serif','Arial,Helvetica,sans-serif'],editorial:['Georgia,"Times New Roman",serif','Arial,Helvetica,sans-serif'],technical:['"JetBrains Mono",monospace','Arial,Helvetica,sans-serif']};
  const valid = v => /^#[0-9a-f]{6}$/i.test(v);
  const rgb = hex => [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
  const luminance = hex => rgb(hex).map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
  const contrast = (a,b) => {const x=luminance(a),y=luminance(b);return ((Math.max(x,y)+.05)/(Math.min(x,y)+.05)).toFixed(1);};
  React.useEffect(()=>{
    if(!enabled)return;
    const el=document.documentElement;
    const keys=['--bg','--ink','--dim','--dimmer','--hair','--accent','--serif','--sans','--lab-ink','--lab-primary','--lab-muted','--lab-accent','--lab-body','--lab-cover-primary','--lab-logo-filter'];
    keys.forEach(k=>el.style.removeProperty(k));
    delete el.dataset.styleLab;
    if(draft.active && ['bg','primary','accent','ink'].every(k=>valid(draft[k]))){
      el.dataset.styleLab='active';
      const c=rgb(draft.ink).join(',');
      const f=fonts[draft.font] || fonts.original;
      const coverPrimary=Number(contrast(draft.primary,'#141414'))>=4.5?draft.primary:'rgb('+rgb(draft.primary).map(v=>Math.round(v*.35+255*.65)).join(',')+')';
      const values={'--lab-cover-primary':coverPrimary,'--lab-logo-filter':luminance(draft.bg)>.25?'brightness(0)':'brightness(0) invert(1)','--bg':draft.bg,'--ink':draft.ink,'--lab-ink':draft.ink,'--dim':`rgba(${c},.72)`,'--dimmer':`rgba(${c},.46)`,'--hair':`rgba(${c},.2)`,'--accent':draft.accent,'--lab-accent':draft.accent,'--lab-primary':draft.primary,'--lab-muted':`rgba(${c},.78)`,'--serif':f[0],'--sans':f[1],'--lab-body':f[1]};
      Object.entries(values).forEach(([k,v])=>el.style.setProperty(k,v));
    }
    try{localStorage.setItem('kb-style-draft-v2',JSON.stringify(draft));}catch{}
  },[draft,enabled]);
  React.useEffect(()=>{if(!open)return;const close=e=>{if(e.key==='Escape'){setOpen(false);document.getElementById('style-lab-toggle')?.focus();}};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close);},[open]);
  if(!enabled)return null;
  const update = patch => {setDraft(d=>({...d,...patch,active:true}));setNotice('');};
  const save = () => {try{localStorage.setItem('kb-style-favorite-v1',JSON.stringify(draft));setFavorite(draft);setNotice('Favorite saved in this browser.');}catch{setNotice('Browser storage is unavailable.');}};
  const exportSettings=()=>{
    const blob=new Blob([JSON.stringify(draft,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='kiran-portfolio-palette.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice('Settings exported.');
  };
  return <>
    <style>{`
      html[data-style-lab] .site-nav {background:color-mix(in srgb,var(--bg) 94%,transparent)!important;border-color:var(--hair)!important;box-shadow:none!important;}
      html[data-style-lab] .site-nav img {filter:var(--lab-logo-filter)!important;}
      html[data-style-lab] .project-cover:after {background:linear-gradient(180deg,#0b0b0c65,transparent 27%,#0b0b0c22 45%,#0b0b0cdd 85%,#0b0b0c),linear-gradient(90deg,#0b0b0c66,transparent 75%);}
      html[data-style-lab] .xr-editorial,html[data-style-lab] .project-cover {--accent:var(--lab-accent);}
      html[data-style-lab] .nyc-case {--nyc-muted:var(--lab-muted);}
      html[data-style-lab] .xr-copy p,html[data-style-lab] .xr-brief p,html[data-style-lab] .nyc-case p {font-family:var(--lab-body);}
      html[data-style-lab] .project-cover {--ink:#f5f2eb;--dim:rgba(245,242,235,.78);color:#f5f2eb;}
      html[data-style-lab] .project-cover .pc-story h1 em {color:var(--lab-cover-primary);text-shadow:0 2px 25px #0009;}
      .sl-toggle,.sl-panel {font:13px/1.5 Arial,Helvetica,sans-serif!important;color:#ececf0!important;letter-spacing:0!important;cursor:auto!important;}
      .sl-toggle {position:fixed;bottom:20px;right:20px;z-index:9999;background:#202127;border:1px solid #ffffff40;border-radius:30px;padding:12px 18px;box-shadow:0 8px 30px #0005;cursor:pointer!important;}
      .sl-panel {position:fixed;right:20px;bottom:76px;width:340px;max-width:calc(100vw - 32px);max-height:calc(100dvh - 104px);overflow:auto;z-index:9999;background:#17181e;border:1px solid #ffffff26;border-radius:18px;box-shadow:0 20px 80px #0008;padding:20px;box-sizing:border-box;}
      .sl-panel * {box-sizing:border-box;cursor:auto!important;}
      .sl-panel button,.sl-panel select,.sl-panel input[type=color] {cursor:pointer!important;}
      .sl-panel button,.sl-panel input,.sl-panel select {font:12px Arial,sans-serif;color:#ececf0;border:1px solid #ffffff2b;border-radius:7px;background:#25262e;}
      .sl-panel button {padding:9px 10px;text-align:left;}
      .sl-panel button:hover {border-color:#b8b3ff;}
      .sl-panel :focus-visible,.sl-toggle:focus-visible {outline:2px solid #b8b3ff;outline-offset:3px;}
      .sl-header {display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
      .sl-header strong {font-size:19px;letter-spacing:-.4px;}
      .sl-panel p {font:12px/1.6 Arial,sans-serif!important;color:#b9bac6!important;margin:4px 0 15px;}
      .sl-presets {display:grid;gap:6px;}
      .sl-presets button {display:flex;align-items:center;gap:10px;}
      .sl-presets button[aria-pressed=true] {border-color:#c5bdff;background:#363244;}
      .sl-swatches {display:flex;flex-shrink:0;}
      .sl-swatches i {width:17px;height:22px;display:block;border:1px solid #ffffff20;}
      .sl-panel h3 {font:bold 10px Arial,sans-serif;letter-spacing:1.5px;text-transform:uppercase;margin:22px 0 10px;color:#b9bac6;}
      .sl-color {display:grid;grid-template-columns:1fr 32px 86px;gap:7px;align-items:center;margin-bottom:8px;}
      .sl-color input[type=color] {width:32px;height:30px;padding:2px;}
      .sl-color input[type=text] {width:86px;padding:7px;}
      .sl-panel select {width:100%;padding:10px;margin-top:7px;}
      .sl-actions {display:flex;flex-wrap:wrap;gap:6px;margin-top:15px;}
      .sl-status {font-size:11px;color:#c7c5da;margin-top:12px;}
      @media(max-width:600px){.sl-panel{right:16px;bottom:72px;width:340px}.sl-toggle{bottom:16px;right:16px}}
    `}</style>
    <button id="style-lab-toggle" className="sl-toggle" aria-expanded={open} aria-controls="style-lab-panel" onClick={()=>setOpen(!open)}>{open?'Close style lab':'◐ Style lab'}</button>
    {open && <aside id="style-lab-panel" className="sl-panel" aria-label="Website style lab">
      <div className="sl-header"><strong>Make it your palette.</strong><button aria-label="Close style lab" onClick={()=>setOpen(false)}>×</button></div>
      <p>Live preview · local only. Browse any page while you experiment.</p>
      <div className="sl-presets">
        <button aria-pressed={!draft.active} onClick={()=>{setDraft(initial);setNotice('Published palette restored.');}}>↺ Published palette</button>
        {presets.map(p=><button key={p.name} aria-pressed={draft.active&&p.name===draft.name&&['bg','primary','accent','ink'].every(k=>p[k]===draft[k])} onClick={()=>update({...p,font:draft.font})}><span className="sl-swatches">{[p.bg,p.primary,p.accent].map((c,i)=><i key={i} style={{background:c}}/>)}</span>{p.name}</button>)}
      </div>
      <h3>Fine-tune colors</h3>
      {[['bg','Background'],['primary','Headings / emphasis'],['accent','Links / details'],['ink','Body text']].map(([key,label])=><div className="sl-color" key={key}><label htmlFor={'sl-'+key}>{label}</label><input id={'sl-'+key} type="color" value={draft[key]} onChange={e=>update({[key]:e.target.value})}/><input key={draft[key]} type="text" defaultValue={draft[key].toUpperCase()} aria-label={label+' hex'} maxLength={7} onBlur={e=>{if(valid(e.target.value))update({[key]:e.target.value});else e.target.value=draft[key].toUpperCase();}} onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}/></div>)}
      <div className="sl-status">Body contrast: {contrast(draft.ink,draft.bg)}:1 {Number(contrast(draft.ink,draft.bg))>=4.5?'· readable':'· try lighter or darker text'}</div>
      <p style={{marginTop:10}}>Text over cover photos stays light for clarity.</p>
      <h3>Typography</h3>
      <label htmlFor="sl-font">Heading & body pairing</label>
      <select id="sl-font" value={draft.font} onChange={e=>update({font:e.target.value})}><option value="original">Original · Lora</option><option value="modern">Modern · clean sans</option><option value="editorial">Editorial · serif + sans</option><option value="technical">Technical · mono + sans</option></select>
      <div className="sl-actions"><button onClick={save}>Save favorite</button>{favorite&&<button onClick={()=>{setDraft(favorite);setNotice('Favorite restored.');}}>Load favorite</button>}<button onClick={exportSettings}>Export settings</button></div>
      <div className="sl-status" role="status">{notice || 'Your draft stays saved as you browse and reload.'}</div>
    </aside>}
  </>;
}
