// proto/app.jsx — root: intro → router + theme + tweaks.

function App() {
  // intro sequence shown once per session (reset on hard reload by default)
  const [introDone, setIntroDone] = React.useState(() => true);

  const parseHash = () => {
    const h = (window.location.hash || '').replace(/^#/, '');
    if (!h || h === '/') return { name: 'home' };
    const parts = h.split('/').filter(Boolean);
    if (parts[0] === 'case' && parts[1]) return { name: 'case', slug: parts[1] };
    if (['home', 'work', 'about', 'contact'].includes(parts[0])) return { name: parts[0] };
    return { name: 'home' };
  };
  const [route, setRoute] = React.useState(parseHash);
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
            <Nav /><LogoPreviewControls/>
            <div key={route.name+':' +(route.slug || '')} className={'site-page route-arrival site-page-' + route.name+(leaving?' route-leaving':'')} aria-busy={leaving}>{page}</div>
            <FloatingSurfaces routeKey={route.name+':'+(route.slug||'')}/><HeadlineMotion routeKey={route.name+':' +(route.slug || '')}/><SiteScrollMotion routeKey={route.name+':' +(route.slug || '')}/><CaseImageInteraction routeKey={route.name+':' +(route.slug || '')}/>

          </>
        )}
      </CursorCtx.Provider>
    </RouteCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
