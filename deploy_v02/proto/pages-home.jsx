// proto/pages-home.jsx — home: parallax demo reel hero → intro → carousel → ongoing → interests → contact teaser.

function HomePage() {
  const { go } = React.useContext(RouteCtx);
  return (
    <div className="home-page">
      <ReelHero />
      <div style={{ position: 'relative', zIndex: 2, background: 'var(--bg, #0b0b0c)' }}>
        <HomeIntro />
        <OngoingSection />
        <ProjectHighlights />
        <ProjectCarousel onOpen={(slug) => go({ name: 'case', slug })} />
        <InterestsSection />
        <ContactTeaser go={go} />
        <Footer />
      </div>
    </div>
  );
}

const HOME_HIGHLIGHTS = [
  { project: 'Ranasthala', slug: 'ranasthala', topic: 'Photogrammetry', title: 'Real places. A world of my own.', description: 'My favourite part: turning architectural details I captured in Hampi and Rajasthan into the building blocks of Ranasthala.', image: 'Ranasthala/web/story-phogrammetry-assets.webp', alt: 'Architectural photogrammetry assets captured for Ranasthala, arranged in Unreal Engine.' },
  { project: 'The Parley', slug: 'xr02-1920s-nyc', topic: 'Behind the scenes', title: 'Beyond the viewport.', description: 'Seeing the digital street become part of a working set—with performers, cameras, and our crew—is the part I keep coming back to.', image: 'xr02-1920s-nyc/web/xr02-bts-poster.jpg', alt: 'The Parley cast and crew in front of the digital street on the XR stage.' },
  { project: 'The Gate Within', slug: 'xr01-chinese-temple', topic: 'AI-assisted exploration', title: 'Room to experiment.', description: 'Alongside terrain and scene assembly, I explored AI-assisted asset creation for my first Unreal virtual production environment.', image: 'xr01-chinese-temple/web/unreal-bd-3.webp', alt: 'The completed Chinese temple environment from The Gate Within.' },
  { project: 'Monsoon Station', slug: 'rainy-forest', topic: 'The final render', title: 'Finding the atmosphere.', description: 'My favourite view of Monsoon Station: the railway winding through the trees, with mountain light pulling the whole scene together.', image: 'monsoon-station/web/highresscreenshot00008.webp', alt: 'A final Unreal render of Monsoon Station, with railway bridges, forest and sunlit mountains.' },
];

function ProjectHighlights() {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [visible, setVisible] = React.useState(false);
  const [pageVisible, setPageVisible] = React.useState(!document.hidden);
  const sectionRef = React.useRef(null);
  const running = !paused && visible && pageVisible;
  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .3 });
    observer.observe(sectionRef.current);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);
  React.useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setActive(index => (index + 1) % HOME_HIGHLIGHTS.length), 2000);
    return () => clearTimeout(timer);
  }, [running, active]);
  const select = (index) => { setActive((index + HOME_HIGHLIGHTS.length) % HOME_HIGHLIGHTS.length); setPaused(false); };
  const item = HOME_HIGHLIGHTS[active];
  return (
    <section ref={sectionRef} className="project-highlights" aria-labelledby="highlights-title" aria-roledescription="carousel">
      <h2 id="highlights-title">A few <em>favourites.</em></h2>
      <div className="highlight-layout">
        <div className="highlight-copy" aria-live={paused ? 'polite' : 'off'}>
          <div className="highlight-project">{item.project} <span> / {item.topic}</span></div>
          <h3 key={item.title}>{item.title}</h3>
          <p>{item.description}</p>
          <a className="highlight-link" href={`#/case/${item.slug}`}>Explore the project <span aria-hidden="true">↗</span></a>
        </div>
        <button type="button" className="highlight-image" onClick={() => setPaused(value => !value)} aria-label={paused ? "Resume project highlights" : "Pause project highlights"} aria-pressed={paused}>
          {HOME_HIGHLIGHTS.map((slide, index) => <img key={slide.slug} className={index === active ? 'is-active' : ''} src={`media/projects/${slide.image}`} alt={index === active ? slide.alt : ''} aria-hidden={index !== active} width="1920" height="1080" loading="lazy"/>)}
        </button>
      </div>
      <style>{`
        .project-highlights{padding:clamp(60px,8vw,120px) var(--pad);scroll-margin-top:80px}
        .project-highlights h2{font:300 clamp(44px,5.5vw,80px)/1.06 var(--serif);letter-spacing:-2px;margin:0 0 40px}
        .project-highlights h2 em{color:var(--lab-primary,#C1663B);font-weight:300}
        .highlight-layout{display:flex;flex-direction:column;gap:30px;max-width:1200px;margin:0 auto}
        .highlight-image{order:-1;position:relative;display:block;width:100%;padding:0;border:0;cursor:pointer;aspect-ratio:16/9;background:#121219;overflow:hidden;text-align:left}
        .highlight-image img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:0;transition:opacity .45s ease}
        .highlight-image img.is-active{opacity:1}
        .highlight-copy{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:clamp(30px,8vw,120px);width:100%;align-items:start}
        .highlight-project{grid-column:1;font:11px/1.8 var(--mono);color:var(--accent);margin-bottom:12px}
        .highlight-project span{color:var(--dim)}
        .highlight-copy h3{grid-column:1;grid-row:2 / 4;font:300 clamp(26px,3vw,42px)/1.15 var(--serif);letter-spacing:-.7px;margin:0;min-height:98px;max-width:500px}
        .highlight-copy p{grid-column:2;grid-row:1 / 3;font:300 16px/1.8 var(--sans);color:var(--dim);margin:0;min-height:86px}
        .highlight-link{grid-column:2;display:inline-block;justify-self:start;padding:12px 0;font:11px/1.8 var(--mono);color:var(--ink);text-decoration:none}
        .highlight-link span{color:var(--accent);margin-left:16px}
        .project-highlights a:focus-visible,.highlight-image:focus-visible{outline:2px solid var(--accent);outline-offset:5px}
        @media(max-width:600px){.highlight-layout{gap:22px}.highlight-copy{display:block}.highlight-copy h3{font-size:28px;min-height:64px;margin-bottom:16px}.highlight-copy p{font-size:15px;min-height:108px}.highlight-project{font-size:10px}.highlight-link{margin-top:8px}}
        @media(prefers-reduced-motion:reduce){.highlight-image img{transition:none}}

      `}</style>
    </section>
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
  //   ③ Set HERO_VIDEO below to 'media/pages/home/reel-environments-v3.mp4'
  // ──────────────────────────────────────────────────────────────
  const HERO_VIMEO  = '';                              // e.g. 'https://vimeo.com/123456789'
  const HERO_VIDEO  = 'media/pages/home/reel-environments-v3.mp4';                              // set to 'media/pages/home/reel-environments-v3.mp4' AFTER uploading the file
  const HERO_POSTER = 'media/pages/home/reel-environments-v3.jpg';                              // set to 'media/pages/home/reel-environments-v3.jpg' AFTER uploading (optional)

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
  const outerHeight = isMobile ? 'auto' : '165vh';
  const innerHeight = isMobile ? '56.25vw' : '100vh';

  return (
    <div className="home-reel" style={{ height: outerHeight, position: 'relative', zIndex: 1, background: '#0b0b0c' }}>
    <div style={{ position: isMobile ? 'relative' : 'sticky', top: 0, height: innerHeight, overflow: 'hidden', background: '#0b0b0c',
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
              <TapVideo title="Homepage reel" src={HERO_VIDEO} autoPlay={!window.matchMedia('(prefers-reduced-motion: reduce)').matches} loop muted playsInline
                poster={(HERO_POSTER && !posterFailed) ? HERO_POSTER : undefined}
                onError={() => setMediaFailed(true)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            )}
            <div style={{ position: 'absolute', inset: 0,
              pointerEvents:'none', background: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.015) 0 2px, transparent 2px 4px)' }} />
            <div style={{ position: 'absolute', inset: 0,
              pointerEvents:'none', boxShadow: isMobile ? 'inset 0 -40px 65px rgba(0,0,0,.35)' : 'inset 0 -160px 260px rgba(0,0,0,0.7), inset 0 120px 220px rgba(0,0,0,0.45)' }} />
          </>
        ) : (
          tones.map((tone, ix) => (
            <div key={tone} style={{
              position: 'absolute', inset: -40, background: SCENES[tone],
              opacity: ix === i ? 1 : 0, transition: 'opacity 1.4s ease',
              animation: ix === i ? 'reelDrift 4s ease-in-out alternate infinite' : 'none',
            }}>
              <div style={{ position: 'absolute', inset: 0,
                pointerEvents:'none', background: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.015) 0 2px, transparent 2px 4px)' }} />
              <div style={{ position: 'absolute', inset: 0,
                pointerEvents:'none', boxShadow: isMobile ? 'inset 0 -40px 65px rgba(0,0,0,.35)' : 'inset 0 -160px 260px rgba(0,0,0,0.7), inset 0 120px 220px rgba(0,0,0,0.45)' }} />
            </div>
          ))
        )}
      </div>

      {/* tiny scroll cue only */}
      <div style={{
        position: 'absolute', bottom: isMobile ? 12 : 36, left: 0, right: 0, textAlign: 'center',
        fontFamily: 'var(--mono)', fontSize: isMobile ? 10 : 14, color: 'rgba(242,237,227,0.75)',
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
    <div className="home-intro" style={{ minHeight: bp === 'mobile' ? 'auto' : '85vh', display: 'flex', alignItems: 'center', padding: bp === 'mobile' ? '48px var(--pad) 40px' : 'clamp(90px,20vw,140px) var(--pad) clamp(48px,10vw,80px)', borderTop: 'none', gap: 80, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1300, width: '100%', flex: '1 1 auto' }}>
        <Reveal>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 23, lineHeight: 1, letterSpacing: 3, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 32, height: 23, paddingLeft: 3 }}>
            <RotatingHello />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="home-intro-title" style={{ fontSize: bp === 'mobile' ? 'clamp(36px, 10.5vw, 64px)' : 'clamp(56px, 8vw, 120px)', lineHeight: bp === 'mobile' ? 1.08 : 0.98, letterSpacing: bp === 'mobile' ? '-.04em' : -3, fontWeight: 300, maxWidth: 1300 }}>
            I build the <span style={{ fontStyle: 'italic', color: 'var(--lab-primary,#C1663B)' }}>worlds</span> I imagine,<br/>
            rendered in real time.
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
  const speedRef = React.useRef(1.1);
  const dispRef = React.useRef(1.1);
  const cursorXRef = React.useRef(null);
  const manualRef = React.useRef(0);
  const pauseUntilRef = React.useRef(0);
  const moveByCard = direction => {
    const cards = trackRef.current?.querySelectorAll('[data-card]');
    if (!cards || cards.length < 2) return;
    manualRef.current -= direction * (cards[1].offsetLeft - cards[0].offsetLeft);
    pauseUntilRef.current = performance.now() + 2200;
  };
  const loop = [...PROJECTS, ...PROJECTS];

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onMove = (e) => {
      const r = track.getBoundingClientRect();
      cursorXRef.current = (e.clientY >= r.top - 40 && e.clientY <= r.bottom + 40) ? e.clientX : null;
    };
    window.addEventListener('mousemove', onMove);
    let raf, previousTime;
    const loopFn = (time=performance.now()) => {
      const delta=Math.min(2,(time-(previousTime ?? time-16.667))/16.667); previousTime=time;
      let target = 1.1;
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
        target = 0.05 + k * 1.05;
      }
      speedRef.current = target;
      dispRef.current += (speedRef.current - dispRef.current) * 0.08;
      if (Math.abs(manualRef.current) > .1) {
        const step = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? manualRef.current : manualRef.current * .14;
        posRef.current += step;
        manualRef.current -= step;
      } else if (performance.now() > pauseUntilRef.current) {
        if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches) posRef.current -= dispRef.current * delta;
      }
      const cards = track.querySelectorAll('[data-card]');
      const half = cards[PROJECTS.length].offsetLeft - cards[0].offsetLeft;
      if (half > 0) posRef.current = -(((-posRef.current % half) + half) % half);
      track.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
      raf = requestAnimationFrame(loopFn);
    };
    loopFn();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); };
  }, []);

  return (
    <div className="home-projects" style={{ borderTop: 'none', padding: 'clamp(60px,12vw,100px) 0 clamp(60px,14vw,120px)', overflow: 'hidden' }}>
      <style>{`
        .work-carousel-actions { display:flex; align-items:center; gap:24px; }
        .work-carousel-arrows { display:flex; gap:8px; }
        .work-carousel-arrows button { width:46px; height:46px; display:grid; place-items:center; border:1px solid var(--hair); border-radius:50%; background:transparent; color:var(--ink); cursor:pointer; transition:border-color .2s,color .2s; }
        .work-carousel-arrows button:hover { border-color:var(--accent); color:var(--accent); }
        .work-carousel-arrows button:focus-visible { outline:2px solid var(--accent); outline-offset:4px; }
        .work-carousel-arrows svg { pointer-events:none; }
        @media(max-width:600px) { .work-carousel-actions { width:100%; justify-content:space-between; } }
      `}</style>
      <Reveal>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'baseline', padding: '0 var(--pad)', marginBottom: 48, fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)' }}>
          <span style={{ fontFamily: 'var(--serif, var(--mono))', fontSize: 'clamp(44px, 6vw, 76px)', lineHeight: 1, letterSpacing: -1.5, textTransform: 'none', color: 'var(--lab-ink,#f2ede3)', fontWeight: 300 }}>
            worlds,&nbsp;<span style={{ fontStyle: 'italic', color: 'var(--lab-primary,#C1663B)' }}>so far</span>
          </span>
          <div className="work-carousel-actions"><NavLink onClick={() => window.__go__({ name: 'work' })} style={{ color: 'var(--accent)' }}>
            full index &nbsp;→
          </NavLink>
          <div className="work-carousel-arrows" role="group" aria-label="Browse projects">
            <button type="button" aria-label="Previous projects" onClick={()=>moveByCard(-1)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7"/></svg></button>
            <button type="button" aria-label="Next projects" onClick={()=>moveByCard(1)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></button>
          </div></div>
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
      <div className="project-card-caption" style={{ marginTop: 18, display: 'flex', flexDirection:'column', gap:8, alignItems:'flex-start' }}>
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
    <div className="ongoing-section" style={{ borderTop: 'none', padding: 'clamp(60px,10vw,120px) var(--pad)' }}>
      <style>{`
        .ongoing-track { position: relative; height: 3px; border-radius: 3px; background: var(--hair); margin-top: 14px; }
        .ongoing-fill { position: absolute; inset: 0 auto 0 0; border-radius: inherit; background: linear-gradient(90deg, transparent, var(--accent)); }
        .ongoing-dot { position: absolute; top: 50%; width: 7px; height: 7px; transform: translate(-50%,-50%); border-radius: 50%; background: var(--accent); box-shadow: 0 0 10px var(--accent); }
        .ongoing-dot::after { content: ''; position: absolute; inset: -4px; border: 1px solid var(--accent); border-radius: 50%; animation: ongoing-pulse 2s ease-out infinite; }
        @keyframes ongoing-pulse { 0% { transform: scale(.6); opacity: .65; } 85%,100% { transform: scale(1.65); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .ongoing-dot::after { animation: none; opacity: .3; } }
      `}</style>
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
  const hover = useCursorLabel('', 'default');
  return (
    <div className="ongoing-card" ref={ref} {...hover} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ border: `1px solid var(--hair)`, padding: 26, position: 'relative', overflow: 'hidden', cursor: 'none',
        borderColor: h ? 'rgba(217,162,74,0.4)' : 'var(--hair)', transition: 'border-color .3s' }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(280px 240px at var(--mx, -200px) var(--my, -200px), rgba(217,162,74,0.10), transparent 70%)',
        opacity: 'var(--mActive, 0)', transition: 'opacity .25s',
      }} />
      <div style={{ position: 'relative', fontSize: 30, fontWeight: 300, letterSpacing: -0.6, fontStyle: 'italic', lineHeight: 1.1, marginBottom: 16,
        transform: 'translate(calc(var(--mxn, 0) * 3px), calc(var(--myn, 0) * 2px))' }}>
        {o.title}
      </div>

      <div style={{ position: 'relative', fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: 1, color: 'var(--dim)', display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase', marginBottom: 8 }}>
        <span>{o.status || o.eta}</span><span style={{ color: 'var(--accent)' }}>{o.pct}%</span>
      </div>
      <div className="ongoing-track" role="progressbar" aria-label={`${o.title}: ${o.status || o.eta}`} aria-valuenow={o.pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="ongoing-fill" style={{ width: `${o.pct}%` }} />
        <span className="ongoing-dot" aria-hidden="true" style={{ left: `${o.pct}%` }} />
      </div>
    </div>
  );
}

// ─── Interests ───
function InterestsSection() {
  const items = [
    { image: 'unreal', category: 'Exploring', title: 'Nanite tessellation', note: 'Surfaces with more to say.', source: 'Unreal Engine', href: 'https://www.unrealengine.com/en-US/unreal-engine-5' },
    { image: 'polycam', category: 'Watching', title: 'Gaussian splatting', note: 'Real places, captured differently.', source: 'Polycam', href: 'https://poly.cam/tools/gaussian-splatting' },
    { image: 'meshy', category: 'Experimenting', title: 'AI-assisted blockouts', note: 'Another way into an idea.', source: 'Meshy', href: 'https://www.meshy.ai/' },
    { image: 'scad', category: 'Creative rooms', title: 'SCAD AnimationFest', note: 'Animation, film, and the people making it.', source: 'SCAD', href: 'https://www.scad.edu/scadfilm/festivals/animationfest2026' },
    { image: 'fmx', category: 'On my radar', title: 'FMX · Stuttgart', note: 'Art, technology, and moving images.', source: 'FMX', href: 'https://fmx.de/en/home' },
    { image: 'poetics', category: 'On the bookshelf', title: 'The Poetics of Space', note: 'Gaston Bachelard. Thinking about atmosphere.', source: 'Book cover · Wikipedia', href: 'https://en.wikipedia.org/wiki/The_Poetics_of_Space' },
  ];
  return <section className="interest-editorial radar-section" aria-labelledby="radar-title">
    <h2 id="radar-title">On my <em>radar.</em></h2>
    <div className="radar-list">
      {items.map(item => <a key={item.image} className={'radar-item radar-item-'+item.image} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={`${item.title} — ${item.source} (opens in a new tab)`}>
        <div className="radar-image"><img src={'assets/radar/'+item.image+'.webp'} alt="" loading="lazy" width="112" height="88"/></div>
        <div className="radar-copy"><span className="radar-category">{item.category}</span><h3>{item.title}</h3><p>{item.note}</p><span className="radar-source">{item.source}</span></div>
        <span className="radar-arrow" aria-hidden="true">↗</span>
      </a>)}
    </div>
    <style>{`
      .radar-section{padding:clamp(40px,5vw,68px) var(--pad);max-width:1296px;margin:0 auto;box-sizing:border-box}
      .radar-section h2{font:300 clamp(44px,5.5vw,80px)/1.06 var(--serif);letter-spacing:-2px;margin:0 0 40px}
      .radar-section h2 em{font-weight:300;color:var(--lab-primary,#C1663B)}
      .radar-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:40px 36px}
      .radar-item{display:grid;grid-template-columns:84px minmax(0,1fr) 12px;gap:16px;align-items:center;text-decoration:none;color:var(--ink);min-width:0;outline-offset:8px}
      .radar-image{width:84px;height:98px;overflow:hidden;background:rgba(128,128,128,.06);border-radius:2px;transition:transform .35s ease,box-shadow .35s ease}
      .radar-image img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.65);transition:transform .5s ease,filter .35s ease}
      .radar-item-scad .radar-image img,.radar-item-poetics .radar-image img{object-fit:contain;padding:7px;box-sizing:border-box}
      .radar-item-scad .radar-image{background:#15131d}
      .radar-item-meshy .radar-image img{object-fit:contain;background:#fff}
      .radar-copy{min-width:0}
      .radar-category{font:11px/1.5 var(--mono);text-transform:uppercase;letter-spacing:.8px;color:var(--dim)}
      .radar-copy h3{font:300 26px/1.2 var(--serif);letter-spacing:-.4px;margin:8px 0}
      .radar-copy p{font:13px/1.6 var(--mono);color:var(--dim);margin:0}
      .radar-source{display:block;font:11px/1.5 var(--mono);color:var(--dim);opacity:.8;margin-top:8px}
      .radar-arrow{font:17px var(--serif);color:var(--dim);transition:transform .3s ease,color .3s ease}
      .radar-item:hover .radar-image,.radar-item:focus-visible .radar-image{transform:translateY(-4px) rotate(-2deg);box-shadow:0 9px 22px #0003}
      .radar-item:hover img,.radar-item:focus-visible img{filter:saturate(1);transform:scale(1.06)}
      .radar-item:hover .radar-arrow,.radar-item:focus-visible .radar-arrow{transform:translate(3px,-3px);color:var(--accent)}
      .radar-item:focus-visible{outline:1px solid var(--accent)}
      @media(max-width:1250px){.radar-list{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:600px){.radar-list{grid-template-columns:1fr;gap:28px}.radar-item{grid-template-columns:72px minmax(0,1fr) 16px;gap:16px}.radar-image{width:72px;height:88px}.radar-copy h3{font-size:25px}}
      @media(prefers-reduced-motion:reduce){.radar-item *{transition:none!important}.radar-item:hover .radar-image,.radar-item:focus-visible .radar-image,.radar-item:hover img,.radar-item:focus-visible img,.radar-item:hover .radar-arrow,.radar-item:focus-visible .radar-arrow{transform:none}}
    `}</style>
  </section>;
}


// ─── Contact teaser (links to /contact) ───
function ContactTeaser({ go }) {
  return (
    <div style={{ borderTop: 'none', padding: 'clamp(70px,14vw,140px) var(--pad)', textAlign: 'center' }}>
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
          <a href="documents/Kiran_Banda_Resume_2026.pdf" download="Kiran_Banda_Resume_2026.pdf" {...useCursorLabel('download', 'link')}
            style={{ display: 'inline-block', padding: '18px 40px', border: `1px solid var(--hair)`, color: 'var(--ink)', fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', cursor: 'none' }}>
            résumé · pdf &nbsp;↓
          </a>
        </div>
      </Reveal>
    </div>
  );
}

Object.assign(window, { HomePage });
