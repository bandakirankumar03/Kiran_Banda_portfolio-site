function LogoPreviewControls(){
 const [tone,setTone]=React.useState(()=>new URLSearchParams(location.search).get('logo')==='gold'?'gold':'white');
 React.useLayoutEffect(()=>{document.documentElement.dataset.logoTone=tone;return()=>{delete document.documentElement.dataset.logoTone}},[tone]);
 const choose=value=>{setTone(value);history.replaceState(null,'','?logo='+value+location.hash)};
 return <aside className="logo-preview-controls" aria-label="Logo color preview"><style>{`
 .logo-preview-controls{position:fixed;right:24px;bottom:24px;z-index:100;display:flex;align-items:center;gap:8px;padding:9px 12px;border:1px solid var(--hair);border-radius:18px;background:color-mix(in srgb,var(--bg) 94%,transparent);backdrop-filter:blur(18px);box-shadow:0 12px 35px #0004;font:11px/1.5 var(--mono);color:var(--dim)}
 .logo-preview-controls>span{margin-right:5px}.logo-preview-controls button{display:flex;align-items:center;gap:7px;border:1px solid transparent;border-radius:10px;padding:9px 13px;background:transparent;color:var(--ink);font:inherit}.logo-preview-controls button[aria-pressed=true]{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 5%,transparent)}.logo-preview-controls i{width:8px;height:8px;border-radius:50%;background:var(--ink)}.logo-preview-controls button:last-child i{background:var(--accent)}.logo-preview-controls button:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
 @media(max-width:600px){.logo-preview-controls{right:12px;bottom:14px;padding:7px 9px;font-size:10px}.logo-preview-controls button{padding:8px 10px}}
 @media(prefers-reduced-motion:reduce){.nav-logo-mark{transition:none}}
 `}</style><span>Logo</span><button type="button" aria-pressed={tone==='white'} onClick={()=>choose('white')}><i aria-hidden="true"/>White</button><button type="button" aria-pressed={tone==='gold'} onClick={()=>choose('gold')}><i aria-hidden="true"/>Gold</button></aside>
}
