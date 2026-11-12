// proto/app.jsx — root: intro → router + theme + tweaks.

function App() {
  // intro sequence shown once per session (reset on hard reload by default)
  const [introDone, setIntroDone] = React.useState(() => sessionStorage.getItem('kb-intro-done') === '1');

  const parseHash = () => {
    const h = (window.location.hash || '').replace(/^#/, '');
    if (!h || h === '/') return { name: 'home' };
    const parts = h.split('/').filter(Boolean);
    if (parts[0] === 'case' && parts[1]) return { name: 'case', slug: parts[1] };
    if (['home', 'work', 'about', 'contact'].includes(parts[0])) return { name: parts[0] };
    return { name: 'home' };
  };
  const [route, setRoute] = React.useState(parseHash);
  React.useEffect(()=>{
    if(route.name==='work')return;
    let frame=0,target=scrollY;
    const maximum=()=>Math.max(0,document.documentElement.scrollHeight-innerHeight);
    const stop=()=>{cancelAnimationFrame(frame);frame=0;target=scrollY};
    const step=()=>{const difference=target-scrollY;if(Math.abs(difference)<.8){window.scrollTo({top:target,behavior:'instant'});frame=0;return}window.scrollTo({top:scrollY+difference*.4,behavior:'instant'});frame=requestAnimationFrame(step)};
    const wheel=e=>{
      if(document.fullscreenElement||e.defaultPrevented||!e.cancelable||e.ctrlKey||e.metaKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)||!e.deltaY||e.target.closest?.('input,textarea,select,[contenteditable="true"],[role="dialog"],dialog[open],.chapter-guide,.focus-scroll-track'))return;
      for(let el=e.target;el&&el!==document.body;el=el.parentElement){if(el.scrollHeight>el.clientHeight+2&&/auto|scroll/.test(getComputedStyle(el).overflowY)&&((e.deltaY>0&&el.scrollTop+el.clientHeight<el.scrollHeight-1)||(e.deltaY<0&&el.scrollTop>0)))return}
      const distance=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1)*1.22;
      const next=Math.max(0,Math.min(maximum(),(frame?target:scrollY)+distance));if(next===scrollY)return;e.preventDefault();target=next;
      if(matchMedia('(prefers-reduced-motion:reduce)').matches){window.scrollTo({top:target,behavior:'instant'});return}if(!frame)frame=requestAnimationFrame(step);
    };
    window.addEventListener('wheel',wheel,{passive:false});window.addEventListener('pointerdown',stop,{capture:true});window.addEventListener('keydown',stop);
    return()=>{stop();window.removeEventListener('wheel',wheel);window.removeEventListener('pointerdown',stop,{capture:true});window.removeEventListener('keydown',stop)};
  },[route.name,route.slug]);
  const [leaving,setLeaving]=React.useState(false);
  const navigationTimer=React.useRef(null);
  const currentRoute=React.useRef(route);
  const changePage=React.useCallback((next)=>{
    if(next.name===currentRoute.current.name && next.slug===currentRoute.current.slug){clearTimeout(navigationTimer.current);setLeaving(false);return;}
    clearTimeout(navigationTimer.current);
    const finish=()=>{currentRoute.current=next;window.scrollTo({top:0,behavior:'instant'});setRoute(next);setLeaving(false)};
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return;}
    setLeaving(true);navigationTimer.current=setTimeout(finish,220);
  },[]);
  React.useEffect(()=>()=>clearTimeout(navigationTimer.current),[]);

  const go = React.useCallback((r) => {
    const h = r.name === 'home' ? '' : r.name === 'case' ? `/case/${r.slug}` : `/${r.name}`;
    window.location.hash = h;

  }, []);
  window.__go__ = go;

  React.useEffect(() => {
    setLabel('');
    setMode('default');
  }, [route.name, route.slug]);

  React.useEffect(() => {
    const onHash = () => changePage(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [changePage]);

  const [label, setLabel] = React.useState('');
  const [mode, setMode] = React.useState('default');

  React.useEffect(() => {
    const saved = localStorage.getItem('kb-theme') || 'dark';
    document.documentElement.dataset.theme = saved;
  }, []);
  React.useEffect(() => {
    const mo = new MutationObserver(() => {
      localStorage.setItem('kb-theme', document.documentElement.dataset.theme || 'dark');
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);

  let page;
  if (route.name === 'home')    page = <HomePage />;
  else if (route.name === 'work')    page = <WorkPage />;
  else if (route.name === 'about')   page = <PortraitPreviewPage />;
  else if (route.name === 'contact') page = <ContactPage />;
  else if (route.name === 'case')    page = <CasePage key={route.slug} slug={route.slug} />;
  else page = <HomePage />;

  React.useEffect(()=>{const replay=()=>setIntroDone(false);window.addEventListener('kb-replay-intro',replay);return()=>window.removeEventListener('kb-replay-intro',replay);},[]);

  const enterSite = React.useCallback(() => {
    sessionStorage.setItem('kb-intro-done', '1');
    setIntroDone(true);
  }, []);

  return (
    <RouteCtx.Provider value={{ route, go }}>
      <CursorCtx.Provider value={{ label, mode, setLabel, setMode }}>
        <CursorStudio />
        {!introDone && <Intro onEnter={enterSite} />}
        {introDone && (
          <>
            <Nav />
            <div key={route.name+':' +(route.slug || '')} className={'site-page route-arrival site-page-' + route.name+(leaving?' route-leaving':'')} aria-busy={leaving}>{page}</div>
            <FloatingSurfaces routeKey={route.name+':'+(route.slug||'')}/><HeadlineMotion routeKey={route.name+':' +(route.slug || '')}/><SiteScrollMotion routeKey={route.name+':' +(route.slug || '')}/><CaseImageInteraction routeKey={route.name+':' +(route.slug || '')}/>
            <ChapterGuide route={route} routeKey={route.name+':'+(route.slug||'')}/>

          </>
        )}
      </CursorCtx.Provider>
    </RouteCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
