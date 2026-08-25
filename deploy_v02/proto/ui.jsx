// proto/ui.jsx — shared: cursor ctx, cursor render, nav (logo + 3 links), scene, footer, reveal, tweaks.

const { useState, useEffect, useRef, useContext, createContext, useMemo } = React;

const RouteCtx = createContext({ route: { name: 'home' }, go: () => {} });
const CursorCtx = createContext({ label: '', mode: 'default', setLabel: () => {}, setMode: () => {} });

function useCursorLabel(label, mode = 'default') {
  const { setLabel, setMode } = useContext(CursorCtx);
  return {
    onMouseEnter: () => { setLabel(label); setMode(mode); },
    onMouseLeave: () => { setLabel(''); setMode('default'); },
  };
}

// Row-level magnetic cursor: writes --mx/--my (% of row) and --mxn (-1..1 from center)
// directly onto the element via refs — no React state churn. Use in styles for
// spotlight gradients, translate, scale, etc. Pair with class="magnetic-row".
function useMagneticRow() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const xr = (e.clientX - r.left) / r.width;
      const yr = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', (xr * 100) + '%');
      el.style.setProperty('--my', (yr * 100) + '%');
      el.style.setProperty('--mxn', String((xr - 0.5) * 2));
      el.style.setProperty('--myn', String((yr - 0.5) * 2));
      el.style.setProperty('--mActive', '1');
    };
    const onLeave = () => {
      el.style.setProperty('--mxn', '0');
      el.style.setProperty('--myn', '0');
      el.style.setProperty('--mActive', '0');
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, []);
  return ref;
}
window.useMagneticRow = useMagneticRow;

// ─── Responsive breakpoint hook — mobile ≤680, tablet ≤1024, else desktop ───
function useBP() {
  const get = () => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    return w <= 680 ? 'mobile' : w <= 1024 ? 'tablet' : 'desktop';
  };
  const [bp, setBp] = React.useState(get);
  React.useEffect(() => {
    const onR = () => setBp(get());
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);
  return bp;
}
window.useBP = useBP;

// ─── Custom cursor ─────────────────────────────────────────
function Cursor() {
  const ref = useRef(null);
  const ringRef = useRef(null);
  const { label, mode } = useContext(CursorCtx);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (e) => { pos.current.x = e.clientX; pos.current.y = e.clientY; };
    window.addEventListener('mousemove', onMove);
    let raf;
    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.22;
      ring.current.y += (pos.current.y - ring.current.y) * 0.22;
      if (ref.current)    ref.current.style.transform    = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%,-50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); };
  }, []);

  const size = mode === 'link' ? 64 : mode === 'zoom' ? 72 : mode === 'hold' ? 90 : 22;

  return (
    <>
      <div ref={ringRef} className="cursor" style={{
        position: 'fixed', top: 0, left: 0, width: size, height: size,
        borderRadius: '50%', border: `1.5px solid var(--accent)`,
        pointerEvents: 'none', zIndex: 9999, transition: 'width .25s, height .25s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--accent)',
        letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap',
        backdropFilter: mode !== 'default' ? 'blur(4px)' : 'none',
        background: mode !== 'default' ? 'rgba(217,162,74,0.08)' : 'transparent',
      }}>{label}</div>
      <div ref={ref} className="cursor" style={{
        position: 'fixed', top: 0, left: 0, width: 4, height: 4,
        borderRadius: '50%', background: 'var(--accent)',
        pointerEvents: 'none', zIndex: 10000,
      }} />
    </>
  );
}

// ─── Scene placeholder ─────────────────────────────────────
// Accepts (in priority order): vimeo > video > image > tone-gradient placeholder
// `vimeo` may be a Vimeo URL (https://vimeo.com/123456789) OR the bare ID ("123456789").
// Optionally pass `poster` (a local image path) — shows while the Vimeo iframe loads.
function vimeoIdFrom(v) {
  if (!v) return null;
  const s = String(v).trim();
  const m = s.match(/(?:vimeo\.com\/|video\/)?(\d{6,})/);
  return m ? m[1] : null;
}
function Scene({ tone = 'dusk', cap, tag, children, style = {}, interactive = false, onClick, label, image, video, vimeo, poster }) {
  const hover = useCursorLabel(label || (interactive ? 'view →' : ''), interactive ? 'zoom' : 'default');
  const vid = vimeoIdFrom(vimeo);
  const [imgFailed, setImgFailed] = React.useState(false);
  const [vidFailed, setVidFailed] = React.useState(false);
  const [postFailed, setPostFailed] = React.useState(false);
  const showImage = image && !imgFailed;
  const showVideo = video && !vidFailed;
  const showPoster = poster && !postFailed;
  const hasMedia = vid || showVideo || showImage;
  return (
    <div onClick={onClick} {...(interactive ? hover : {})}
      style={{
        position: 'relative', overflow: 'hidden',
        background: hasMedia ? '#0b0b0c' : (SCENES[tone] || SCENES.dusk),
        color: '#f2ede3', cursor: interactive ? 'none' : 'inherit', ...style,
      }}>
      {vid && (
        <>
          {showPoster && (
            <img src={poster} alt="" onError={() => setPostFailed(true)}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          <iframe
            src={`https://player.vimeo.com/video/${vid}?background=1&autoplay=1&loop=1&muted=1&autopause=0&playsinline=1`}
            frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
            title={cap || `vimeo ${vid}`}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              width: '177.78vh', height: '56.25vw',
              minWidth: '100%', minHeight: '100%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }} />
        </>
      )}
      {!vid && showVideo && (
        <video src={video} autoPlay loop muted playsInline onError={() => setVidFailed(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
      {!vid && !showVideo && showImage && (
        <img src={image} alt={cap || ''} onError={() => setImgFailed(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
      <div style={{ position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.015) 0 2px, transparent 2px 4px)',
        pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0,
        boxShadow: 'inset 0 -60px 120px rgba(0,0,0,0.6), inset 0 60px 120px rgba(0,0,0,0.35)',
        pointerEvents: 'none' }} />
      {children}
      {cap && (
        <div style={{ position: 'absolute', left: 16, bottom: 14, right: 16,
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: 0.5,
          color: 'rgba(255,255,255,0.78)', textTransform: 'uppercase', pointerEvents: 'none' }}>
          <span>▸ {cap}</span>
          {tag && <span style={{ color: 'rgba(255,255,255,0.55)' }}>{tag}</span>}
        </div>
      )}
    </div>
  );
}

// ─── Scroll-triggered reveal ───────────────────────────────
function Reveal({ children, delay = 0, y = 30, as: Tag = 'div', style = {} }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } });
    }, { threshold: 0.12 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} style={{
      opacity: shown ? 1 : 0,
      transform: shown ? 'translateY(0)' : `translateY(${y}px)`,
      transition: `opacity .9s ${delay}ms ease, transform .9s ${delay}ms cubic-bezier(.2,.7,.2,1)`,
      ...style,
    }}>{children}</Tag>
  );
}

// ─── Nav (logo only · larger) ──────────────────────────────
function Nav() {
  const { route, go } = useContext(RouteCtx);
  const bp = useBP();
  const onHome = route.name === 'home';
  const [shown, setShown] = React.useState(!onHome);
  React.useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (onHome) { setShown(y > 40 && y < window.innerHeight * 1.5); return; }
      setShown(y < window.innerHeight * 0.9);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onHome]);
  const items = [
    { k: 'work',    l: 'Work' },
    { k: 'about',   l: 'About' },
    { k: 'contact', l: 'Contact' },
  ];
  return (
    <React.Fragment>
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', flexWrap: 'nowrap',
      padding: bp === 'mobile' ? '6px 16px' : 'clamp(6px,1.5vw,8px) var(--pad)',
      fontFamily: 'var(--mono)', fontSize: bp === 'mobile' ? 11 : 14, letterSpacing: bp === 'mobile' ? 0.8 : 1.5,
      height: bp === 'mobile' ? 56 : 'clamp(64px, 11vw, 93px)',
      textTransform: 'uppercase', color: 'var(--dim)',
      position: onHome ? 'fixed' : 'relative',
      top: 0, left: 0, right: 0,
      transform: (onHome && !shown) ? 'translateY(-100%)' : 'translateY(0)',
      opacity: (onHome && !shown) ? 0 : 1,
      transition: 'transform .5s cubic-bezier(.4,0,.2,1), opacity .4s ease',
      pointerEvents: (onHome && !shown) ? 'none' : 'auto',
      zIndex: 50,
      background: 'linear-gradient(180deg, rgba(30,44,58,0.72) 0%, rgba(16,22,30,0.62) 55%, rgba(10,12,15,0.5) 100%)',
      backdropFilter: 'blur(18px) saturate(140%)', WebkitBackdropFilter: 'blur(18px) saturate(140%)',
      borderBottom: '1px solid rgba(115,194,251,0.18)',
      boxShadow: '0 1px 0 rgba(115,194,251,0.06) inset, 0 18px 40px -28px rgba(115,194,251,0.5)',
    }}>
      <div {...useCursorLabel('home', 'link')} onClick={() => go({ name: 'home' })}
        style={{ display: 'flex', alignItems: 'center', cursor: 'none', flexShrink: 0 }}>
        <img src="proto/logo.png" alt="KB" style={{
          height: bp === 'mobile' ? 34 : 'clamp(52px, 9vw, 92px)', width: 'auto',
          filter: 'brightness(0) saturate(100%) invert(70%) sepia(59%) saturate(3272%) hue-rotate(175deg) brightness(101%) contrast(101%)',
        }} />
      </div>
      <div style={{ display: 'flex', gap: bp === 'mobile' ? 10 : 'clamp(10px, 2.2vw, 28px)', borderRadius: 175, flexShrink: 0 }}>
        {items.map((i) => (
          <NavLink key={i.k} onClick={() => go({ name: i.k })}
            style={{ color: route.name === i.k ? 'var(--accent)' : '#f2ede3',
              borderBottom: route.name === i.k ? `1px solid var(--accent)` : 'none', paddingBottom: 2, whiteSpace: 'nowrap' }}>
            {i.l}
          </NavLink>
        ))}
      </div>
      {bp !== 'mobile' ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16, color: '#f2ede3' }}>
          <span className="online-text" style={{ display: 'inline-flex', alignItems: 'center' }}><span className="online-dot" />open</span>
        </div>
      ) : <div />}
    </div>
    </React.Fragment>
  );
}

function NavLink({ children, onClick, style = {}, cursorLabel }) {
  const text = typeof children === 'string' ? children : '';
  const hover = useCursorLabel(cursorLabel ?? text, 'link');
  return (
    <span {...hover} onClick={onClick} style={{ cursor: 'none', ...style }}>{children}</span>
  );
}

// ─── Footer ────────────────────────────────────────────────
function Footer() {
  const { route, go } = useContext(RouteCtx);
  const pages = [
    { k: 'home',    l: 'Home' },
    { k: 'work',    l: 'Work' },
    { k: 'about',   l: 'About' },
    { k: 'contact', l: 'Contact' },
  ];
  return (
    <div style={{
      fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--dim)', letterSpacing: 1, textTransform: 'uppercase',
    }}>
      <div style={{ display: 'flex', gap: 'clamp(14px,3vw,32px)', justifyContent: 'center', flexWrap: 'wrap', padding: 'clamp(16px,3vw,22px) var(--pad)', borderBottom: `1px solid var(--hair)` }}>
        {pages.map((p) => (
          <NavLink key={p.k} onClick={() => go({ name: p.k })}
            style={{ color: route.name === p.k ? 'var(--accent)' : 'var(--dim)',
              borderBottom: route.name === p.k ? `1px solid var(--accent)` : 'none', paddingBottom: 2 }}>
            {p.l}
          </NavLink>
        ))}
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: useBP() === 'mobile' ? '1fr' : 'repeat(3, 1fr)',
        gap: 'clamp(12px,3vw,24px)', alignItems: 'center', padding: 'clamp(14px,3vw,20px) var(--pad)',
        textAlign: useBP() === 'mobile' ? 'center' : 'left',
      }}>
        <span>Kiran Banda · © 2026</span>
        <NavLink style={{ textAlign: 'center', display: 'block' }}>bandakirankumar03@gmail.com</NavLink>
        <div style={{ display: 'flex', gap: 'clamp(12px,3vw,22px)', justifyContent: useBP() === 'mobile' ? 'center' : 'flex-end', flexWrap: 'wrap' }}>
          {['LinkedIn', 'Polycam', 'Instagram'].map((s) => (
            <NavLink key={s}>{s}</NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  RouteCtx, CursorCtx, useCursorLabel, Cursor, Scene, Reveal, Nav, NavLink, Footer, vimeoIdFrom,
});
