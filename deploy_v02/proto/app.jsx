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

  const go = React.useCallback((r) => {
    const h = r.name === 'home' ? '' : r.name === 'case' ? `/case/${r.slug}` : `/${r.name}`;
    window.location.hash = h;
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  window.__go__ = go;

  React.useEffect(() => {
    setLabel('');
    setMode('default');
  }, [route.name, route.slug]);

  React.useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

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
  else if (route.name === 'about')   page = <AboutPage />;
  else if (route.name === 'contact') page = <ContactPage />;
  else if (route.name === 'case')    page = <CasePage slug={route.slug} />;
  else page = <HomePage />;

  const enterSite = React.useCallback(() => {
    sessionStorage.setItem('kb-intro-done', '1');
    setIntroDone(true);
  }, []);

  return (
    <RouteCtx.Provider value={{ route, go }}>
      <CursorCtx.Provider value={{ label, mode, setLabel, setMode }}>
        <Cursor />
        {!introDone && <Intro onEnter={enterSite} />}
        {introDone && (
          <>
            <Nav />
            {page}
          </>
        )}
      </CursorCtx.Provider>
    </RouteCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
