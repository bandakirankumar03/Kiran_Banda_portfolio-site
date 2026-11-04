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

function ProjectHighlights(){
  const ref=React.useRef(null),activeRef=React.useRef(0);
  const [active,setActive]=React.useState(0),[paused,setPaused]=React.useState(false);
  React.useEffect(()=>{
    let frame=0;
    const update=()=>{frame=0;if(paused||!ref.current)return;const r=ref.current.getBoundingClientRect(),pin=ref.current.querySelector('.favourites-pin');
      // Use the stable pinned height, not the phone browser's changing toolbar height.
      const travel=Math.max(1,ref.current.offsetHeight-pin.offsetHeight),position=Math.max(0,Math.min(HOME_HIGHLIGHTS.length,-r.top/travel*HOME_HIGHLIGHTS.length));
      let next=activeRef.current;while(next<HOME_HIGHLIGHTS.length-1&&position>next+1.06)next++;while(next>0&&position<next-.06)next--;
      if(next!==activeRef.current){activeRef.current=next;setActive(next)}
    };
    const tick=()=>{if(!frame)frame=requestAnimationFrame(update);};
    window.addEventListener('scroll',tick,{passive:true});window.addEventListener('resize',tick);update();
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',tick);window.removeEventListener('resize',tick);};
  },[paused]);
  return <section className="scroll-favourites" data-active-project={HOME_HIGHLIGHTS[active].slug} ref={ref} aria-label="A few favourites"><div className="favourites-pin"><div className="favourites-heading"><h2>A few <em>favourites.</em></h2></div><div className="favourites-stage">{HOME_HIGHLIGHTS.map((item,i)=><article key={item.slug} className={'favourite-slide '+(i===active?'active':'')} aria-hidden={i!==active} inert={i!==active?'':undefined}><div className="favourite-copy"><span>{item.project} / {item.topic}</span><h3>{item.title}</h3><p>{item.description}</p><a href={'#/case/'+item.slug} tabIndex={i===active?0:-1}>Explore the project ↗</a></div><button className="favourite-photo" onClick={()=>setPaused(v=>!v)} tabIndex={i===active?0:-1} aria-pressed={paused} aria-label={paused?'Resume scroll highlights':'Hold this highlight'}><img src={'media/projects/'+item.image} alt={item.alt} decoding="async"/></button></article>)}</div></div></section>;
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
  const dragRef=React.useRef(null),dragged=React.useRef(false);
  const posRef = React.useRef(0);
  const speedRef = React.useRef(1.65);
  const dispRef = React.useRef(1.65);
  const cursorXRef = React.useRef(null);
  const manualRef = React.useRef(0);
  const moveByCard = direction => {
    const cards = trackRef.current?.querySelectorAll('[data-card]');
    if (!cards || cards.length < 2) return;
    manualRef.current -= direction * (cards[1].offsetLeft - cards[0].offsetLeft);
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
      let target = 1.65;
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
        target = .95 + k * 1.0;
      }
      speedRef.current = target;
      dispRef.current += (speedRef.current - dispRef.current) * 0.08;
      const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!dragRef.current) {
        // Blend the requested card movement with the running loop; no post-click hold.
        if (Math.abs(manualRef.current) > .1) {
          const step=reduced?manualRef.current:manualRef.current*(1-Math.pow(.86,delta));
          posRef.current+=step;manualRef.current-=step;
        }
        if(!reduced)posRef.current-=dispRef.current*delta;
      }
      const cards = track.querySelectorAll('[data-card]');
      const half = cards[PROJECTS.length].offsetLeft - cards[0].offsetLeft;
      if (half > 0) posRef.current = -(((-posRef.current % half) + half) % half);
      track.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
      cards.forEach(card=>{const center=card.offsetLeft+posRef.current+card.offsetWidth/2;const distance=Math.max(-1,Math.min(1,(center-innerWidth/2)/innerWidth));card.style.transform=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'none':`perspective(1500px) rotateY(${distance*-14}deg) translateY(${Math.abs(distance)*72-18}px) scale(${1-Math.abs(distance)*.1})`;});
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
          <span data-main-headline style={{ fontFamily: 'var(--serif, var(--mono))', fontSize: 'clamp(44px, 6vw, 76px)', lineHeight: 1, letterSpacing: -1.5, textTransform: 'none', color: 'var(--lab-ink,#f2ede3)', fontWeight: 300 }}>
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
      <div ref={trackRef} className="cinema-track" onPointerDown={e=>{if(e.button!==0)return;dragRef.current={x:e.clientX,last:e.clientX};manualRef.current=0;dragged.current=false;}} onPointerMove={e=>{if(!dragRef.current)return;const delta=e.clientX-dragRef.current.last;if(Math.abs(e.clientX-dragRef.current.x)>7){dragged.current=true;e.currentTarget.setPointerCapture(e.pointerId);}if(dragged.current)posRef.current+=delta;dragRef.current.last=e.clientX;}} onPointerUp={()=>{dragRef.current=null;}} onLostPointerCapture={()=>{dragRef.current=null;}} onPointerCancel={()=>{dragRef.current=null;}} onClickCapture={e=>{if(dragged.current){e.preventDefault();e.stopPropagation();dragged.current=false;}}} style={{ display: 'flex', gap: 'clamp(14px,4vw,28px)', willChange: 'transform', padding: '0 clamp(12px,4vw,24px)' }}>
        {loop.map((p, i) => <CarouselCard key={i} p={p} onOpen={onOpen} />)}
      </div>
    </div>
  );
}

function CarouselCard({ p, onOpen }) {
  const hover = useCursorLabel('open →', 'link');
  const [h, setH] = React.useState(false);
  return (
    <div data-card {...hover} role="link" tabIndex={0} aria-label={"Explore "+p.title} onKeyDown={e=>{if(e.key==='Enter')onOpen(p.slug);}}
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
        borderColor: h ? 'rgba(var(--accent-rgb,215,184,125),0.4)' : 'var(--hair)', transition: 'border-color .3s' }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(280px 240px at var(--mx, -200px) var(--my, -200px), rgba(var(--accent-rgb,215,184,125),0.10), transparent 70%)',
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

// ─── A small, living index of things worth following ───
const DISCOVERIES = [
  { id:'dlss5', title:'DLSS 5', source:'NVIDIA', note:'Neural rendering. A new conversation between lighting, materials, and AI.', image:'dlss5.webp', alt:'DLSS 5 game-rendering example published by NVIDIA.', href:'https://www.nvidia.com/en-us/geforce/news/dlss5-breakthrough-in-visual-fidelity-for-games/' },
  { id:'brush', title:'Brush / 4D splats', source:'Brush', note:'Beyond a frozen capture. Gaussian splat sequences, moving through time.', video:'brush.mp4', alt:'Brush Gaussian splatting demo, with captured scenes by GradeEterna.', href:'https://github.com/ArthurBrussee/brush' },
  { id:'foliage', title:'Procedural worlds', source:'Unreal Engine', note:'Following PCG, Nanite Foliage, and new ways to build living landscapes.', image:'foliage.webp', alt:'Procedural vegetation imagery from Epic Games’ Unreal Engine 5.7 announcement.', href:'https://www.unrealengine.com/en-US/news/unreal-engine-5-7-is-now-available' },
  { id:'marble', title:'Marble', source:'World Labs', note:'From a visual idea to a 3D world. Another way to explore a place.', image:'marble.webp', alt:'Victorian foyer reference shown in World Labs’ Marble world model article.', href:'https://www.worldlabs.ai/blog/marble-world-model' },
];

const DISCOVERY_EVENTS = [
  { title:'GDC', date:'1–4 March', start:'2027-03-01', end:'2027-03-04', place:'San Francisco', topic:'Real-time art & game technology', href:'https://gdconf.com/' },
  { title:'NAB Show', date:'3–7 April', start:'2027-04-03', end:'2027-04-07', place:'Las Vegas', topic:'Production, post & media technology', href:'https://www.nabshow.com/las-vegas/' },
  { title:'FMX', date:'27–30 April', start:'2027-04-27', end:'2027-04-30', place:'Stuttgart', topic:'Animation, VFX & digital media', href:'https://fmx.de/en/home' },
  { title:'SIGGRAPH', date:'8–12 August', start:'2027-08-08', end:'2027-08-12', place:'Anaheim', topic:'Graphics research & production', href:'https://s2027.siggraph.org/' },
];

function InterestsSection() {
  const root=React.useRef(null),video=React.useRef(null);
  const [active,setActive]=React.useState(0),[visible,setVisible]=React.useState(false);
  const [hovered,setHovered]=React.useState(false),[focused,setFocused]=React.useState(false),[paused,setPaused]=React.useState(false);
  const [reduced,setReduced]=React.useState(()=>matchMedia('(prefers-reduced-motion:reduce)').matches);
  React.useEffect(()=>{
    const media=matchMedia('(prefers-reduced-motion:reduce)'),change=()=>setReduced(media.matches);
    media.addEventListener('change',change);
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.18});
    observer.observe(root.current);
    const visibility=()=>{if(document.hidden)setVisible(false);else if(root.current){const r=root.current.getBoundingClientRect();setVisible(r.bottom>0&&r.top<innerHeight)}};
    document.addEventListener('visibilitychange',visibility);
    return()=>{observer.disconnect();media.removeEventListener('change',change);document.removeEventListener('visibilitychange',visibility)};
  },[]);
  React.useEffect(()=>{
    if(!visible||hovered||focused||paused||reduced)return;
    const timer=setTimeout(()=>setActive(i=>(i+1)%DISCOVERIES.length),4600);
    return()=>clearTimeout(timer);
  },[active,visible,hovered,focused,paused,reduced]);
  React.useEffect(()=>{
    const el=video.current;if(!el)return;
    if(active===1&&visible&&!paused&&!reduced)el.play().catch(()=>{});else el.pause();
  },[active,visible,paused,reduced]);
  const float=e=>{
    if(e.pointerType!=='mouse'||reduced)return;
    const r=e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--discovery-x',((e.clientX-r.left)/r.width-.5)*10+'px');
    e.currentTarget.style.setProperty('--discovery-y',((e.clientY-r.top)/r.height-.5)*8+'px');
  };
  const settle=e=>{e.currentTarget.style.setProperty('--discovery-x','0px');e.currentTarget.style.setProperty('--discovery-y','0px')};
  return <section ref={root} className="discovery-section" aria-labelledby="discovery-title" data-active-discovery={DISCOVERIES[active].id}
    onFocusCapture={e=>setFocused(!!e.target.closest('.discovery-index,.discovery-credit'))} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false)}}>
    <h2 id="discovery-title">Caught my <em>eye.</em></h2>
    <div className="discovery-layout">
      <div className="discovery-visual" onPointerMove={float} onPointerLeave={settle}>
        <button className="discovery-media" onClick={()=>setPaused(v=>!v)} aria-pressed={paused} aria-label={paused?'Resume discoveries':'Pause discoveries'}>
          {DISCOVERIES.map((item,i)=><span key={item.id} className={'discovery-frame'+(i===active?' is-current':'')} aria-hidden={i!==active}>
            {item.video?<video ref={video} src={'assets/radar/'+item.video} loop muted playsInline preload="metadata" aria-label={item.alt}/>:<img src={'assets/radar/'+item.image} alt={item.alt} loading="lazy" decoding="async" width="1100" height="700"/>}
          </span>)}
          <span className="discovery-glass" aria-hidden="true"/>
        </button>
        <a className="discovery-credit" href={DISCOVERIES[active].href} target="_blank" rel="noopener noreferrer">{DISCOVERIES[active].source}<span aria-hidden="true">↗</span></a>
      </div>
      <div className="discovery-index" aria-label="Things I’m following">
        {DISCOVERIES.map((item,i)=><a key={item.id} className={'discovery-entry'+(i===active?' is-current':'')} href={item.href} target="_blank" rel="noopener noreferrer"
          onPointerEnter={e=>{if(e.pointerType==='mouse'){setActive(i);setHovered(true)}}} onPointerLeave={()=>setHovered(false)} onFocus={()=>setActive(i)} aria-label={item.title+' — '+item.source+' (opens in a new tab)'}>
          <span className="discovery-name">{item.title}<span aria-hidden="true">↗</span></span>
          <span className="discovery-note">{item.note}</span>
        </a>)}
      </div>
    </div>
    <aside className="discovery-events" aria-labelledby="discovery-events-title">
      <h3 id="discovery-events-title">Looking ahead, <em>2027.</em></h3>
      <div className="discovery-events-list">
        {DISCOVERY_EVENTS.map(event=><a className="discovery-event" key={event.title} href={event.href} target="_blank" rel="noopener noreferrer" aria-label={`${event.title} 2027, ${event.date}, ${event.place} (opens in a new tab)`}>
          <span className="discovery-event-date"><time dateTime={event.start}>{event.date}</time><span aria-hidden="true">↗</span></span>
          <span className="discovery-event-title">{event.title}</span>
          <span className="discovery-event-place">{event.place}</span>
          <span className="discovery-event-topic">{event.topic}</span>
        </a>)}
      </div>
    </aside>
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

