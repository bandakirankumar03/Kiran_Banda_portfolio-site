// proto/pages-home.jsx — home: parallax demo reel hero → intro → carousel → ongoing → interests → contact teaser.

function HomePage() {
  const { go } = React.useContext(RouteCtx);
  return (
    <div>
      <ReelHero />
      <div style={{ position: 'relative', zIndex: 2, background: 'var(--bg, #0b0b0c)' }}>
        <HomeIntro />
        <ProjectCarousel onOpen={(slug) => go({ name: 'case', slug })} />
        <OngoingSection />
        <InterestsSection />
        <ContactTeaser go={go} />
        <Footer />
      </div>
    </div>
  );
}

// ─── Fullscreen demo reel hero — pure visual, no overlay text ─
function ReelHero() {
  // ──────────────────────────────────────────────────────────────
  // HERO REEL — paste your video here. Three options, in priority:
  //   1. Vimeo (recommended for a full-quality 1080p reel)
  //   2. Local mp4 (keep file < 8 MB, ~10–15 s, looping)
  //   3. Leave both empty → gradient cycler stays as fallback
  //
  // To use a LOCAL mp4 for the main page:
  //   ① Drop the file at:   media/pages/home/reel.mp4
  //   ② (Optional) Drop a still poster at:   media/pages/home/reel-poster.jpg
  //   ③ Set HERO_VIDEO below to 'media/pages/home/reel.mp4'
  // ──────────────────────────────────────────────────────────────
  const HERO_VIMEO  = '';                              // e.g. 'https://vimeo.com/123456789'
  const HERO_VIDEO  = '';                              // set to 'media/pages/home/reel.mp4' AFTER uploading the file
  const HERO_POSTER = '';                              // set to 'media/pages/home/reel-poster.jpg' AFTER uploading (optional)

  const heroVimeoId = (() => {
    if (!HERO_VIMEO) return null;
    const m = String(HERO_VIMEO).match(/(?:vimeo\.com\/|video\/)?(\d{6,})/);
    return m ? m[1] : null;
  })();
  const hasReelMedia = heroVimeoId || HERO_VIDEO;

  const tones = ['dusk', 'forest', 'rain', 'canyon', 'neon', 'studio'];
  const [i, setI] = React.useState(0);
  const [scrollY, setScrollY] = React.useState(0);
  // if the local mp4 or poster isn't uploaded yet, gracefully fall back to gradient cycler
  const [mediaFailed, setMediaFailed] = React.useState(false);
  const [posterFailed, setPosterFailed] = React.useState(false);
  const hasReelMediaResolved = hasReelMedia && !(HERO_VIDEO && mediaFailed && !heroVimeoId);

  React.useEffect(() => {
    if (hasReelMediaResolved) return;               // no cycler when a real video is set
    const t = setInterval(() => setI((x) => (x + 1) % tones.length), 2200);
    return () => clearInterval(t);
  }, [hasReelMediaResolved]);

  React.useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fgOpacity = Math.max(0, 1 - scrollY / 300);
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  // hold fullscreen for ~2 viewports of scroll, then ease out just before the page content arrives
  const holdOut = Math.min(1, Math.max(0, (scrollY - vh * 0.55) / (vh * 0.4)));
  const bp = useBP();
  const isMobile = bp === 'mobile';
  // on mobile, keep the reel a landscape strip instead of a full-height portrait crop
  const outerHeight = isMobile ? '78vh' : '165vh';
  const innerHeight = isMobile ? 'min(56vh, 100vw * 0.75)' : '100vh';

  return (
    <div style={{ height: outerHeight, position: 'relative', zIndex: 1, background: '#0b0b0c' }}>
    <div style={{ position: 'sticky', top: 0, height: innerHeight, overflow: 'hidden', background: '#0b0b0c',
      }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        {hasReelMediaResolved ? (
          <>
            {HERO_POSTER && !posterFailed && (
              <img src={HERO_POSTER} alt="" onError={() => setPosterFailed(true)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            )}
            {heroVimeoId ? (
              <iframe
                src={`https://player.vimeo.com/video/${heroVimeoId}?background=1&autoplay=1&loop=1&muted=1&autopause=0&playsinline=1`}
                frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
                title="hero reel"
                style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: '177.78vh', height: '56.25vw',
                  minWidth: '100%', minHeight: '100%',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                }} />
            ) : (
              <video src={HERO_VIDEO} autoPlay loop muted playsInline
                poster={(HERO_POSTER && !posterFailed) ? HERO_POSTER : undefined}
                onError={() => setMediaFailed(true)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            )}
            <div style={{ position: 'absolute', inset: 0,
              background: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.015) 0 2px, transparent 2px 4px)' }} />
            <div style={{ position: 'absolute', inset: 0,
              boxShadow: 'inset 0 -160px 260px rgba(0,0,0,0.7), inset 0 120px 220px rgba(0,0,0,0.45)' }} />
          </>
        ) : (
          tones.map((tone, ix) => (
            <div key={tone} style={{
              position: 'absolute', inset: -40, background: SCENES[tone],
              opacity: ix === i ? 1 : 0, transition: 'opacity 1.4s ease',
              animation: ix === i ? 'reelDrift 4s ease-in-out alternate infinite' : 'none',
            }}>
              <div style={{ position: 'absolute', inset: 0,
                background: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.015) 0 2px, transparent 2px 4px)' }} />
              <div style={{ position: 'absolute', inset: 0,
                boxShadow: 'inset 0 -160px 260px rgba(0,0,0,0.7), inset 0 120px 220px rgba(0,0,0,0.45)' }} />
            </div>
          ))
        )}
      </div>

      {/* tiny scroll cue only */}
      <div style={{
        position: 'absolute', bottom: 36, left: 0, right: 0, textAlign: 'center',
        fontFamily: 'var(--mono)', fontSize: 12, color: 'rgba(242,237,227,0.55)',
        letterSpacing: 3, textTransform: 'uppercase', zIndex: 5, opacity: fgOpacity,
      }}>
        <div style={{ fontSize: 18, color: 'var(--accent)', marginBottom: 8, animation: 'bobY 1.8s infinite' }}>↓</div>
        scroll
      </div>

      <style>{`
        @keyframes reelDrift { 0% { transform: scale(1.1) translateX(-1.5%); } 100% { transform: scale(1.1) translateX(1.5%); } }
        @keyframes bobY { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
      `}</style>
    </div>
    </div>
  );
}

// ─── Intro copy block ───
const HELLOS = ['hello', 'नमस्ते', 'bonjour', 'hola', 'ciao', 'こんにちは', '你好', 'hallo', 'olá', 'привет'];
function RotatingHello() {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % HELLOS.length), 1100);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ display: 'inline-block', width: 150, height: 23, lineHeight: '23px', textAlign: 'left', overflow: 'hidden', verticalAlign: 'top' }}>
      {HELLOS[i]}
    </span>
  );
}

function HomeIntro() {
  const bp = useBP();
  return (
    <div style={{ minHeight: bp === 'mobile' ? 'auto' : '85vh', display: 'flex', alignItems: 'center', padding: bp === 'mobile' ? '48px var(--pad) 40px' : 'clamp(90px,20vw,140px) var(--pad) clamp(48px,10vw,80px)', borderTop: `1px solid var(--hair)`, gap: 80, position: 'relative', overflow: 'hidden' }}>
      <div className="home-deco" style={{
        position: 'absolute', right: 48, bottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 14, opacity: 0.14, pointerEvents: 'none', userSelect: 'none',
      }}>
        <img src="proto/logo.png" alt="" aria-hidden="true" style={{
          height: 200, width: 'auto', filter: 'grayscale(1) brightness(2)',
        }} />
        <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontStyle: 'italic', letterSpacing: 1, color: 'var(--ink)', whiteSpace: 'nowrap', marginTop: -4 }}>
        </div>
        <div style={{ fontSize: 23, lineHeight: 1, position: 'absolute', left: 114, top: 140 }}>
          Kiran Banda
        </div>
      </div>
      <div style={{ maxWidth: 1300, width: '100%', flex: '1 1 auto' }}>
        <Reveal>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 23, lineHeight: 1, letterSpacing: 3, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 32, height: 23, paddingLeft: 3 }}>
            <RotatingHello />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div style={{ fontSize: 'clamp(56px, 8vw, 120px)', lineHeight: 0.98, letterSpacing: -3, fontWeight: 300, maxWidth: 1300 }}>
            I build the <span style={{ fontStyle: 'italic', color: '#C1663B' }}>worlds</span> I imagine,<br/>
            rendered in real time.
          </div>
        </Reveal>
        <Reveal delay={260} y={20}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(32px,6vw,80px)', marginTop: 'clamp(36px,6vw,60px)', maxWidth: 1100 }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 20, lineHeight: 1.7, color: 'var(--dim)', fontWeight: 300 }}>
              I build real-time worlds for virtual production and cinematic storytelling — and I like them epic. Places that used to stand, places that never did, built with the same care either way.
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ─── Auto-scrolling project carousel · slows near cursor · clickable ───
function ProjectCarousel({ onOpen }) {
  const trackRef = React.useRef(null);
  const posRef = React.useRef(0);
  const speedRef = React.useRef(0.5);
  const dispRef = React.useRef(0.5);
  const cursorXRef = React.useRef(null);
  const loop = [...PROJECTS, ...PROJECTS];

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onMove = (e) => {
      const r = track.getBoundingClientRect();
      cursorXRef.current = (e.clientY >= r.top - 40 && e.clientY <= r.bottom + 40) ? e.clientX : null;
    };
    window.addEventListener('mousemove', onMove);
    let raf;
    const loopFn = () => {
      let target = 0.5;
      if (cursorXRef.current !== null) {
        const cards = track.querySelectorAll('[data-card]');
        let min = Infinity;
        cards.forEach((c) => {
          const r = c.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const d = Math.abs(cx - cursorXRef.current);
          if (d < min) min = d;
        });
        const k = Math.min(1, Math.max(0, min / 400));
        target = 0.05 + k * 0.45;
      }
      speedRef.current = target;
      dispRef.current += (speedRef.current - dispRef.current) * 0.08;
      posRef.current -= dispRef.current;
      const half = track.scrollWidth / 2;
      if (-posRef.current >= half) posRef.current += half;
      track.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
      raf = requestAnimationFrame(loopFn);
    };
    loopFn();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); };
  }, []);

  return (
    <div style={{ borderTop: `1px solid var(--hair)`, padding: 'clamp(60px,12vw,100px) 0 clamp(60px,14vw,120px)', overflow: 'hidden' }}>
      <Reveal>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'baseline', padding: '0 var(--pad)', marginBottom: 48, fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)' }}>
          <span style={{ fontFamily: 'var(--serif, var(--mono))', fontSize: 'clamp(44px, 6vw, 76px)', lineHeight: 1, letterSpacing: -1.5, textTransform: 'none', color: '#f2ede3', fontWeight: 300 }}>
            worlds,&nbsp;<span style={{ fontStyle: 'italic', color: '#C1663B' }}>so far</span>
          </span>
          <NavLink onClick={() => window.__go__({ name: 'work' })} style={{ color: 'var(--accent)' }}>
            full index &nbsp;→
          </NavLink>
        </div>
      </Reveal>
      <div ref={trackRef} style={{ display: 'flex', gap: 'clamp(14px,4vw,28px)', willChange: 'transform', padding: '0 clamp(12px,4vw,24px)' }}>
        {loop.map((p, i) => <CarouselCard key={i} p={p} onOpen={onOpen} />)}
      </div>
    </div>
  );
}

function CarouselCard({ p, onOpen }) {
  const hover = useCursorLabel('open →', 'link');
  const [h, setH] = React.useState(false);
  return (
    <div data-card {...hover}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      onClick={() => onOpen(p.slug)}
      style={{ flex: '0 0 auto', width: 'clamp(260px, 70vw, 460px)', cursor: 'none' }}>
      <div style={{ position: 'relative' }}>
        <Scene tone={p.tone} image={p.hero} video={p.heroVideo} vimeo={p.heroVimeo} poster={p.hero} style={{
          width: '100%', aspectRatio: '4 / 3',
          transform: h ? 'scale(1.015)' : 'scale(1)', transition: 'transform .5s ease',
        }} />
        <div style={{
          position: 'absolute', inset: 0, padding: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          color: '#f2ede3', fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase',
          background: h ? 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 45%, rgba(0,0,0,0.65) 100%)' : 'transparent',
          transition: 'background .4s ease',
        }}>
          <span style={{ border: '1px solid rgba(242,237,227,0.4)', padding: '4px 10px' }}>{p.kindShort}</span>
          <span style={{ opacity: 0.75 }}>{p.year}</span>
        </div>
      </div>
      <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 30, fontWeight: 400, letterSpacing: -0.8, fontStyle: 'italic', color: h ? 'var(--accent)' : 'var(--ink)', transition: 'color .3s' }}>
          {p.title}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--dim)', letterSpacing: 1 }}>{p.role}</div>
      </div>
    </div>
  );
}

// ─── Ongoing ───
function NowTicker() {
  const verbs = ['modelling', 'lighting', 'scanning', 'compositing', 'optimising'];
  const [i, setI] = React.useState(0);
  const [on, setOn] = React.useState(true);
  React.useEffect(() => {
    const a = setInterval(() => setI((n) => (n + 1) % verbs.length), 1500);
    const b = setInterval(() => setOn((v) => !v), 650);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);
  return (
    <span
      onClick={() => setI((n) => (n + 1) % verbs.length)}
      style={{ display: 'inline-flex', alignItems: 'baseline', gap: 12, fontSize: 20, letterSpacing: 1.5, cursor: 'none' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', opacity: on ? 1 : 0.15, transition: 'opacity .5s', alignSelf: 'center' }}></span>
      <span>now</span>
      <span style={{ color: 'var(--dim)', minWidth: 190, display: 'inline-block' }}>{verbs[i]}</span>
    </span>
  );
}

function OngoingSection() {
  return (
    <div style={{ borderTop: `1px solid var(--hair)`, padding: 'clamp(60px,10vw,120px) var(--pad)' }}>
      <Reveal>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 48 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: 2, color: 'var(--accent)', textTransform: 'uppercase' }}>
            <NowTicker />
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--dim)', letterSpacing: 1 }}>
            ◉ updated {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toLowerCase()}
          </div>
        </div>
      </Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'clamp(16px,3vw,28px)' }}>
        {ONGOING.map((o, i) => (
          <Reveal key={o.title} delay={i * 100}><OngoingCard o={o} /></Reveal>
        ))}
      </div>
    </div>
  );
}

function OngoingCard({ o }) {
  const ref = useMagneticRow();
  const [h, setH] = React.useState(false);
  const hover = useCursorLabel('in progress', 'default');
  return (
    <div ref={ref} {...hover} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ border: `1px solid var(--hair)`, padding: 26, position: 'relative', overflow: 'hidden', cursor: 'none',
        borderColor: h ? 'rgba(217,162,74,0.4)' : 'var(--hair)', transition: 'border-color .3s' }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(280px 240px at var(--mx, -200px) var(--my, -200px), rgba(217,162,74,0.10), transparent 70%)',
        opacity: 'var(--mActive, 0)', transition: 'opacity .25s',
      }} />
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', gap: 16, whiteSpace: 'nowrap', fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 20 }}>
        <span>in progress</span>
        <span style={{ color: 'var(--accent)' }}>ETA · {o.eta}</span>
      </div>
      <div style={{ position: 'relative', fontSize: 30, fontWeight: 300, letterSpacing: -0.6, fontStyle: 'italic', lineHeight: 1.1, marginBottom: 16,
        transform: 'translate(calc(var(--mxn, 0) * 3px), calc(var(--myn, 0) * 2px))' }}>
        {o.title}
      </div>
      <div style={{ position: 'relative', fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.6, color: 'var(--dim)', fontWeight: 300, minHeight: 100, marginBottom: 22 }}>
        {o.note}
      </div>
      <div style={{ position: 'relative', fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: 1, color: 'var(--dim)', display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase', marginBottom: 8 }}>
        <span>progress</span><span style={{ color: 'var(--accent)' }}>{o.pct}%</span>
      </div>
      <div style={{ position: 'relative', height: 2, background: 'var(--hair)' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${o.pct}%`, background: 'var(--accent)', transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

// ─── Interests ───
function InterestsSection() {
  return (
    <div style={{ borderTop: `1px solid var(--hair)`, padding: 'clamp(60px,10vw,120px) var(--pad)' }}>
      <Reveal delay={120}>
        <div style={{ fontSize: 'clamp(40px, 5.5vw, 80px)', lineHeight: 1, letterSpacing: -2, fontWeight: 300, maxWidth: 1100, marginBottom: 'clamp(36px,6vw,60px)' }}>
          New <span style={{ fontStyle: 'italic', color: '#C1663B' }}>tools, rooms,</span> <span style={{ fontStyle: 'italic' }}>and ideas</span> changing the way I make worlds.
        </div>
      </Reveal>
      <div style={{ display: 'flex', flexDirection: 'column', borderTop: `1px solid var(--hair)` }}>
        {INTERESTS.map((it, i) => (
          <Reveal key={it.title} delay={i * 60}><InterestRow it={it} /></Reveal>
        ))}
      </div>
    </div>
  );
}

function InterestRow({ it }) {
  const ref = useMagneticRow();
  const [h, setH] = React.useState(false);
  const bp = useBP();
  const hover = useCursorLabel(it.kind.toLowerCase(), 'link');
  return (
    <div ref={ref} {...hover} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      onClick={() => it.link && window.open(it.link, '_blank', 'noopener')}
      style={{
        position: 'relative', overflow: 'hidden',
        padding: '28px 24px', borderBottom: `1px solid var(--hair)`, cursor: 'none', display: 'grid',
        gridTemplateColumns: bp === 'mobile' ? '1fr' : bp === 'tablet' ? '100px 1fr 1fr' : '120px 1.4fr 1.6fr 1fr',
        gap: 'clamp(10px,3vw,28px)', alignItems: bp === 'mobile' ? 'flex-start' : 'baseline',
        transition: 'background .3s, padding .35s',
        paddingLeft: h ? 36 : 24,
        background: 'transparent',
      }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(260px 220px at var(--mx, -200px) var(--my, 50%), rgba(217,162,74,0.10), transparent 70%)',
        opacity: 'var(--mActive, 0)', transition: 'opacity .25s',
      }} />
      <div aria-hidden style={{
        position: 'absolute', left: 0, right: 0, bottom: -1, height: 1,
        background: `linear-gradient(90deg, transparent 0%, var(--accent) var(--mx, -10%), transparent calc(var(--mx, -10%) + 18%))`,
        opacity: 'var(--mActive, 0)', transition: 'opacity .25s',
      }} />
      <span style={{
        fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase',
        color: h ? 'var(--accent)' : 'var(--dim)', position: 'relative',
        transform: 'translateX(calc(var(--mxn, 0) * -2px))', transition: 'color .3s',
      }}>{it.kind}</span>
      <span style={{
        fontSize: 26, fontWeight: 300, letterSpacing: -0.4, fontStyle: 'italic', position: 'relative',
        color: h ? 'var(--accent)' : 'var(--ink)',
        transform: 'translateX(calc(var(--mxn, 0) * 3px))', transition: 'color .3s',
      }}>{it.title}</span>
      <span style={{
        fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--dim)', fontWeight: 300, lineHeight: 1.6, position: 'relative',
        transform: 'translateX(calc(var(--mxn, 0) * 4px))',
      }}>{it.note}</span>
      <span style={{
        fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase',
        color: h ? 'var(--accent)' : 'var(--dimmer)', textAlign: 'right', position: 'relative',
        transform: 'translateX(calc(var(--mxn, 0) * 5px))', transition: 'color .3s',
      }}>{h ? '▸ open' : '· hover'}</span>
    </div>
  );
}

// ─── Contact teaser (links to /contact) ───
function ContactTeaser({ go }) {
  return (
    <div style={{ borderTop: `1px solid var(--hair)`, padding: 'clamp(70px,14vw,140px) var(--pad)', textAlign: 'center' }}>
      <Reveal delay={120}>
        <div style={{ fontSize: 'clamp(72px, 11vw, 180px)', lineHeight: 0.95, letterSpacing: -4, fontWeight: 300 }}>
          <span style={{ fontStyle: 'italic' }}>let&apos;s build</span><br/>
          <span style={{ color: 'var(--accent)' }}>a world.</span>
        </div>
      </Reveal>
      <Reveal delay={240}>
        <div style={{ marginTop: 40, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <NavLink onClick={() => go({ name: 'contact' })}
            style={{ display: 'inline-block', padding: '18px 40px', border: `1px solid var(--accent)`, color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>
            contact me &nbsp;→
          </NavLink>
          <a href="#resume" {...useCursorLabel('download', 'link')}
            style={{ display: 'inline-block', padding: '18px 40px', border: `1px solid var(--hair)`, color: 'var(--ink)', fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', cursor: 'none' }}>
            résumé · pdf &nbsp;↓
          </a>
        </div>
      </Reveal>
    </div>
  );
}

Object.assign(window, { HomePage });
