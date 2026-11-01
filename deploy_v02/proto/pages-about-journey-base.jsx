// proto/pages-about.jsx — about: bio → education → experience → certificates → hobbies → photos → movies.

function ClassicAboutPage() {
  return (
    <div className="about-page">
      <BioSection />
      <EducationSection />
      <ExperienceSection />
      <SkillsSection />
      <CertificatesSection />
      <HobbiesSection />
      <PhotoCollection />
      <MoviesSection />
      <Footer />
    </div>
  );
}

// ─── 01 — BIO ────────────────────────────────────────────────
function BioSection() {
 const [portraitOpen,setPortraitOpen]=React.useState(false);
  return (
    <div className="about-bio" style={{ padding: 'clamp(32px,6vw,48px) var(--pad) clamp(48px,9vw,70px)' }}>
      <Reveal delay={80}>
        <div className="about-title" style={{ fontSize: 'clamp(64px, 10vw, 136px)', lineHeight: 0.92, letterSpacing: -3, fontWeight: 300 }}>
          Hi, I&apos;m <span style={{ fontStyle: 'italic', color: 'var(--lab-primary,#C1663B)' }}>Kiran.</span>
        </div>
      </Reveal>

      {portraitOpen&&<PolaroidLightbox photos={[{image:"media/pages/about/portrait.jpg",cap:"Kiran Banda"}]} idx={0} close={()=>setPortraitOpen(false)}/>}
      <div className="about-bio-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(32px,5vw,64px)', alignItems: 'start', marginTop: 56, position: 'relative' }}>
        <Reveal className="about-portrait-column" delay={200}>
          {/* Portrait — drop your photo at: media/pages/about/portrait.jpg
              If the file is missing, the gradient placeholder will show. */}
          <img role="button" tabIndex={0} aria-label="Open portrait of Kiran Banda" onClick={()=>setPortraitOpen(true)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setPortraitOpen(true)}}} className="about-portrait" src="media/pages/about/portrait.jpg" alt="Kiran Banda" width="1536" height="1024"/>
          <RotatingRole />
        </Reveal>
        <Reveal className="about-bio-copy" delay={160}>
          <div className="about-bio-lead" style={{ fontSize: 'clamp(24px, 2.6vw, 36px)', lineHeight: 1.4, letterSpacing: -0.3, fontWeight: 300, marginBottom: 36 }}>
            It started as a kid glued to fantasy epics — big, impossible worlds I wanted to <span style={{ fontStyle: 'italic', color: 'var(--lab-primary,#C1663B)' }}>walk into.</span> Now I build them.
          </div>
          <div className="about-bio-text" style={{ fontFamily: 'var(--sans)', fontSize: 17, lineHeight: 1.95, color: 'var(--dim)', maxWidth: 660, fontWeight: 300 }}>
            Long before I knew what a render engine was, I was rewinding scenes that revealed impossible worlds — temples, ruins, forests that felt like places you could stand in. I wanted to build one.
            <br/><br/>
            I started in VFX compositing, learning how a frame comes together, layer by layer. But I kept wanting to shape the world in front of the camera: the light, the weather, the dust in the air. That led me to Unreal environment art.
            <br/><br/>
            After internships at Green Gold Animation and Studio Raaga, I’m now pursuing a Master’s in Visual Effects at <span style={{color:'var(--ink)'}}>SCAD</span>, building environments and operating the brain on XR-stage shorts. My work is mostly photogrammetry-driven and modular: capturing real surfaces, rebuilding them in Unreal, and dressing scenes that hold up under a moving camera. Lately, I’m exploring AI in the early stages of asset development.
            <br/><br/>
            Photogrammetry is still my favourite part — turning a real wall or stone into a world a camera can move through.
          </div>
        </Reveal>
      </div>
    </div>
  );
}

const ROLES = ['Environment Artist', 'VFX Compositor', 'Editor', 'Photogrammetry Artist', 'Virtual Art Department', 'Director', 'VFX Supervisor', 'Producer'];
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%*+=-';
function RotatingRole() {
  const [i, setI] = React.useState(0);
  const [text, setText] = React.useState(ROLES[0]);
  React.useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % ROLES.length), 2600);
    return () => clearInterval(t);
  }, []);
  const [glitching, setGlitching] = React.useState(false);
  const [spike, setSpike] = React.useState(false);
  React.useEffect(() => {
    const target = ROLES[i];
    let frame = 0;
    setGlitching(true);
    const id = setInterval(() => {
      frame += 1;
      const settled = Math.floor(frame / 1.15);
      setText(target.split('').map((ch, k) => {
        if (k < settled || ch === ' ') return ch;
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }).join(''));
      if (settled >= target.length) { clearInterval(id); setText(target); setGlitching(false); }
    }, 32);
    return () => clearInterval(id);
  }, [i]);
  // occasional idle glitch spike even between transitions, for extra jitter
  React.useEffect(() => {
    const t = setInterval(() => {
      if (glitching) return;
      setSpike(true);
      setTimeout(() => setSpike(false), 160);
    }, 1400 + Math.random() * 900);
    return () => clearInterval(t);
  }, [glitching]);
  const active = glitching || spike;
  return (
    <div style={{ marginTop: 26, minHeight: 32 }}>
      <span data-text={text} className={active ? 'role-glitch is-active' : 'role-glitch'} style={{
        position: 'relative', display: 'inline-block', fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 32, letterSpacing: -0.3,
        color: 'var(--accent)', whiteSpace: 'normal', overflowWrap: 'anywhere', maxWidth: '100%',
      }}>{text}</span>
      <style>{`
        .role-glitch.is-active { animation: roleGlitchJump .13s steps(1, end) infinite; }
        .role-glitch.is-active::before,
        .role-glitch.is-active::after {
          content: attr(data-text);
          position: absolute; left: 0; top: 0; width: 100%; height: 100%;
          background: transparent; overflow: hidden; pointer-events: none;
        }
        .role-glitch.is-active::before {
          color: #ff3b6b; mix-blend-mode: screen;
          animation: roleGlitchSliceA .18s steps(1, end) infinite;
        }
        .role-glitch.is-active::after {
          color: #73c2fb; mix-blend-mode: screen;
          animation: roleGlitchSliceB .21s steps(1, end) infinite;
        }
        @keyframes roleGlitchJump {
          0%   { transform: translate(0,0) skewX(0deg); color: var(--accent); opacity: 1; }
          8%   { transform: translate(-4px,1px) skewX(-6deg); color: #d98a5f; }
          16%  { transform: translate(5px,-2px) skewX(4deg); color: #e8b48a; }
          24%  { transform: translate(-3px,2px) skewX(0deg); color: #73c2fb; opacity: 0.7; }
          32%  { transform: translate(0,0); color: var(--accent); opacity: 1; }
          40%  { transform: translate(4px,-1px) skewX(5deg); color: var(--lab-primary,#C1663B); }
          48%  { transform: translate(-5px,0) skewX(-3deg); opacity: 0.5; }
          56%  { transform: translate(2px,1px); color: #e8b48a; opacity: 1; }
          64%  { transform: translate(0,0) skewX(0deg); color: var(--accent); }
          72%  { transform: translate(-2px,-2px); color: #73c2fb; }
          80%  { transform: translate(3px,1px) skewX(3deg); color: #d98a5f; }
          88%  { transform: translate(-1px,0); color: var(--accent); opacity: 0.8; }
          100% { transform: translate(0,0) skewX(0deg); color: var(--accent); opacity: 1; }
        }
        @keyframes roleGlitchSliceA {
          0%   { clip-path: inset(0 0 88% 0); transform: translate(3px,-2px); }
          20%  { clip-path: inset(65% 0 5% 0); transform: translate(-4px,1px); }
          40%  { clip-path: inset(20% 0 60% 0); transform: translate(4px,2px); }
          60%  { clip-path: inset(80% 0 2% 0); transform: translate(-3px,-1px); }
          80%  { clip-path: inset(10% 0 75% 0); transform: translate(2px,1px); }
          100% { clip-path: inset(45% 0 40% 0); transform: translate(-2px,0); }
        }
        @keyframes roleGlitchSliceB {
          0%   { clip-path: inset(50% 0 20% 0); transform: translate(-3px,2px); }
          25%  { clip-path: inset(5% 0 85% 0); transform: translate(4px,-1px); }
          50%  { clip-path: inset(70% 0 10% 0); transform: translate(-2px,-2px); }
          75%  { clip-path: inset(30% 0 55% 0); transform: translate(3px,1px); }
          100% { clip-path: inset(15% 0 70% 0); transform: translate(-4px,0); }
        }
      `}</style>
    </div>
  );
}

// ─── 02 — EDUCATION ────────────────────────────────────────
function EducationSection() {
  const items = EDUCATION;
  return (
    <div style={{ padding: 'clamp(48px,10vw,90px) var(--pad)' }}>
      <Reveal delay={80}>
        <div style={{ fontSize: 'clamp(40px, 5.5vw, 80px)', lineHeight: 1, letterSpacing: -2, fontWeight: 300, marginBottom: 44, maxWidth: 1100 }}>
          Where I learned to <span style={{ fontStyle: 'italic', color: 'var(--lab-primary,#C1663B)' }}>build worlds.</span>
        </div>
      </Reveal>
      {items.map((e, i) => (
        <Reveal key={e.yr} delay={i * 80}>
          <EducationRow e={e} />
        </Reveal>
      ))}
    </div>
  );
}

function EducationRow({ e }) {
  const ref = useMagneticRow();
  const [h, setH] = React.useState(false);
  const bp = useBP();
  const hover = useCursorLabel(e.yr.split(' ')[0] || 'edu', 'default');
  return (
    <div ref={ref} {...hover}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: bp === 'mobile' ? '1fr' : bp === 'tablet' ? '140px 1fr 1fr' : '150px minmax(0,1.4fr) minmax(0,1fr)',
        gap: 'clamp(10px,2.5vw,24px)',
        padding: '28px 24px', borderTop: 'none', alignItems: bp === 'mobile' ? 'flex-start' : 'baseline',
        cursor: 'none', transition: 'padding .35s, background .3s',
        paddingLeft: h ? 36 : 24,
      }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(260px 220px at var(--mx, -200px) var(--my, 50%), rgba(var(--accent-rgb,215,184,125),0.10), transparent 70%)',
        opacity: 'var(--mActive, 0)', transition: 'opacity .25s',
      }} />

      <span style={{ position: 'relative', fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--accent)', letterSpacing: 1, textTransform: 'uppercase',
        transform: 'translateX(calc(var(--mxn, 0) * -2px))' }}>{e.yr}</span>
      <span style={{ position: 'relative', fontSize: 26, fontWeight: 300, letterSpacing: -0.4, fontStyle: 'italic',
        color: h ? 'var(--accent)' : 'var(--ink)', transition: 'color .3s',
        transform: 'translateX(calc(var(--mxn, 0) * 3px))' }}>{e.org}</span>
      <span style={{ position: 'relative', fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--ink)', letterSpacing: 1, textTransform: 'uppercase',
        transform: 'translateX(calc(var(--mxn, 0) * 4px))' }}>{e.where}</span>

    </div>
  );
}

// ─── 03 — WORK EXPERIENCE ──────────────────────────────────
function ExperienceSection() {
  return (
    <div style={{ padding: 'clamp(48px,10vw,90px) var(--pad)' }}>
      <Reveal delay={80}>
        <div style={{ fontSize: 'clamp(40px, 5.5vw, 80px)', lineHeight: 1, letterSpacing: -2, fontWeight: 300, marginBottom: 44, maxWidth: 1100 }}>
          Where I&apos;ve been <span style={{ fontStyle: 'italic', color: 'var(--lab-primary,#C1663B)' }}>building.</span>
        </div>
      </Reveal>
      {EXPERIENCE.map((e, i) => (
        <Reveal key={e.yr + e.role} delay={i * 80}>
          <ExperienceRow e={e} last={i === EXPERIENCE.length - 1} />
        </Reveal>
      ))}
    </div>
  );
}

function ExperienceRow({ e, last }) {
  const ref = useMagneticRow();
  const [h, setH] = React.useState(false);
  const bp = useBP();
  const hover = useCursorLabel(e.yr.split(' ')[0], 'default');
  return (
    <div ref={ref} {...hover} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: 'relative', overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: bp === 'mobile' ? '1fr' : bp === 'tablet' ? '140px 1fr 1fr' : '150px minmax(0,1.4fr) minmax(0,1fr)',
        gap: 'clamp(10px,2.5vw,24px)',
        padding: '32px 24px', borderTop: 'none', borderBottom: 'none',
        alignItems: bp === 'mobile' ? 'flex-start' : 'baseline', cursor: 'none', transition: 'padding .35s',
        paddingLeft: h ? 36 : 24 }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(280px 240px at var(--mx, -200px) var(--my, 50%), rgba(var(--accent-rgb,215,184,125),0.12), transparent 70%)',
        opacity: 'var(--mActive, 0)', transition: 'opacity .25s',
      }} />

      <span style={{ position: 'relative', fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--accent)', letterSpacing: 1, textTransform: 'uppercase',
        transform: 'translateX(calc(var(--mxn, 0) * -2px))' }}>{e.yr}</span>
      <span style={{ position: 'relative', fontSize: 28, fontWeight: 300, letterSpacing: -0.5, fontStyle: 'italic',
        color: h ? 'var(--accent)' : 'var(--ink)', transition: 'color .3s',
        transform: 'translateX(calc(var(--mxn, 0) * 3px))' }}>{e.role}</span>
      <span style={{ position: 'relative', fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--ink)', letterSpacing: 1, textTransform: 'uppercase',
        transform: 'translateX(calc(var(--mxn, 0) * 4px))' }}>{e.org}</span>
    </div>
  );
}

// ─── 04 — SKILLS (dynamic, cursor-reactive) ────────────────
function SkillsSection() {
  const [active, setActive] = React.useState(null); // { g: groupIdx, i: itemIdx }
  const [mouse, setMouse] = React.useState({ x: 0, y: 0 });
  const wrapRef = React.useRef(null);

  const onMove = (e) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div ref={wrapRef} onMouseMove={onMove} onMouseLeave={() => setActive(null)}
      style={{ padding: 'clamp(48px,10vw,90px) var(--pad)', position: 'relative', overflow: 'hidden' }}>

      {/* glow that follows the cursor when over a chip */}
      <div style={{
        position: 'absolute', left: mouse.x, top: mouse.y, width: 480, height: 480,
        transform: 'translate(-50%, -50%)', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(var(--accent-rgb,215,184,125),0.12) 0%, transparent 60%)',
        opacity: active ? 1 : 0, transition: 'opacity .4s', filter: 'blur(20px)',
      }} />

      <Reveal delay={80}>
        <div style={{ fontSize: 'clamp(40px, 5.5vw, 80px)', lineHeight: 1, letterSpacing: -2, fontWeight: 300, marginBottom: 44, maxWidth: 1100 }}>
          What I <span style={{ fontStyle: 'italic', color: 'var(--lab-primary,#C1663B)' }}>reach for.</span>
        </div>
      </Reveal>

      <div style={{ display: 'grid', gap: 48, marginTop: 32 }}>
        {SKILLS.map((g, gi) => (
          <Reveal key={g.group} delay={gi * 80}>
            <div style={{ display: 'grid', gridTemplateColumns: useBP() === 'mobile' ? '1fr' : '180px 1fr', gap: 'clamp(16px,3vw,32px)', alignItems: 'start' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--accent)', letterSpacing: 2, textTransform: 'uppercase', paddingTop: 14 }}>
                · {String(gi + 1).padStart(2, '0')} {g.group}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {g.items.map((s, ii) => {
                  const isActive = active && active.g === gi && active.i === ii;
                  const dim = active && !isActive;
                  return (
                    <SkillChip key={s} label={s}
                      isActive={isActive} dim={dim}
                      onEnter={() => setActive({ g: gi, i: ii })}
                      onLeave={() => setActive(null)} />
                  );
                })}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function SkillChip({ label, isActive, dim, onEnter, onLeave }) {
  const hover = useCursorLabel(label.toLowerCase(), 'default');
  return (
    <span {...hover} onMouseEnter={onEnter} onMouseLeave={onLeave}
      style={{
        position: 'relative',
        fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: 1, textTransform: 'uppercase',
        padding: '10px 16px',
        border: `1px solid ${isActive ? 'var(--accent)' : 'var(--hair)'}`,
        color: isActive ? 'var(--accent)' : 'var(--ink)',
        background: isActive ? 'rgba(var(--accent-rgb,215,184,125),0.08)' : 'transparent',
        opacity: dim ? 0.32 : 1,
        cursor: 'none',
        transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all .25s cubic-bezier(.2,.7,.2,1)',
        boxShadow: isActive ? '0 8px 24px rgba(var(--accent-rgb,215,184,125),0.18)' : 'none',
      }}>
      {label}
    </span>
  );
}

// ─── 05 — CERTIFICATES ─────────────────────────────────────
function CertificatesSection() {
  const learning = [
    {title:'Virtual Production · XR Stage',org:'SCAD',kind:'Hands-on',yr:'Practice'},
    {title:'Unreal Engine · Production',org:'Independent learning',kind:'Self-taught',yr:'Practice'},
    {title:'Photogrammetry · RealityCapture',org:'SCAD class + independent practice',kind:'Course & practice',yr:'Study'},
    {title:'AI-Assisted Asset Pipelines',org:'Independent study',kind:'Self-taught',yr:'Exploration'}
  ];
  const badges=CERTIFICATES.filter(c=>c.title.includes('Advanced Certificate')||c.title.includes('Creative Horizons'));
  return <section className="about-journal-section about-learning">
    <h2 className="about-section-title">Always <em>learning.</em></h2>
    <div className="learning-grid">{learning.map(c=><CertCard key={c.title} c={c}/>)}</div>
    <div className="learning-badges">{badges.map(c=><img key={c.id} src={'media/pages/about/badges/'+c.id+'.png'} alt={c.title} title={c.title} loading="lazy" width="120" height="120"/>)}</div>
  </section>;
}

function CertCard({ c }) {
  const ref = useMagneticRow();
  const [h, setH] = React.useState(false);
  const hover = useCursorLabel(c.kind.toLowerCase(), 'default');
  return (
    <div ref={ref} {...hover} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: 'relative', overflow: 'hidden',
        border: `1px solid var(--hair)`, padding: '24px 26px', cursor: 'none',
        transform: h ? 'translateY(-3px)' : 'translateY(0)', transition: 'transform .3s, border-color .3s',
        borderColor: h ? 'rgba(var(--accent-rgb,215,184,125),0.4)' : 'var(--hair)' }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(300px 240px at var(--mx, -200px) var(--my, -200px), rgba(var(--accent-rgb,215,184,125),0.10), transparent 70%)',
        opacity: 'var(--mActive, 0)', transition: 'opacity .25s',
      }} />
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 18 }}>
        <span>{c.yr}</span>
        <span style={{ color: h ? 'var(--accent)' : 'var(--dim)' }}>// {c.kind}</span>
      </div>
      <div style={{ position: 'relative', fontSize: 22, fontWeight: 300, letterSpacing: -0.3, fontStyle: 'italic', marginBottom: 8, lineHeight: 1.2,
        transform: 'translate(calc(var(--mxn, 0) * 3px), calc(var(--myn, 0) * 2px))' }}>
        {c.title}
      </div>
      <div style={{ position: 'relative', fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--accent)', letterSpacing: 1, textTransform: 'uppercase' }}>
        ↳ {c.org}
      </div>
    </div>
  );
}

const LIFE_PHOTOS = [{"image": "media/pages/about/selected/img_7757.webp", "aspect": "2268 / 4032", "cap": "Photography", "category": "Photography"}, {"image": "media/pages/about/selected/img_1853.webp", "aspect": "3024 / 4032", "cap": "Travelling", "category": "Travelling"}, {"image": "media/pages/about/selected/img_0172.webp", "aspect": "4284 / 5712", "cap": "Food & cooking", "category": "Food & cooking"}, {"image": "media/pages/about/selected/img_7341.webp", "aspect": "3213 / 5712", "cap": "Trekking", "category": "Trekking"}, {"image": "media/pages/about/selected/img_7561.webp", "aspect": "4284 / 5712", "cap": "Fitness & yoga", "category": "Fitness & yoga"}, {"image": "media/pages/about/selected/img_9617.webp", "aspect": "4284 / 5712", "cap": "Music & art", "category": "Music & art"}, {"image": "media/pages/about/selected/img_9996.webp", "aspect": "4284 / 5712", "cap": "Reading", "category": "Reading"}, {"image": "media/pages/about/selected/img_6070.webp", "aspect": "5712 / 3213", "cap": "Photography", "category": "Photography"}, {"image": "media/pages/about/selected/img_8067.webp", "aspect": "4284 / 5712", "cap": "Travelling", "category": "Travelling"}, {"image": "media/pages/about/selected/img_5897.webp", "aspect": "4284 / 5712", "cap": "Food & cooking", "category": "Food & cooking"}, {"image": "media/pages/about/selected/img_2510.webp", "aspect": "4284 / 5712", "cap": "Trekking", "category": "Trekking"}, {"image": "media/pages/about/selected/img_9414.webp", "aspect": "3024 / 4032", "cap": "Fitness & yoga", "category": "Fitness & yoga"}, {"image": "media/pages/about/selected/img_5503.webp", "aspect": "4284 / 5712", "cap": "Music & art", "category": "Music & art"}, {"image": "media/pages/about/selected/img_8015.webp", "aspect": "3024 / 4032", "cap": "Photography", "category": "Photography"}, {"image": "media/pages/about/selected/img_8086.webp", "aspect": "4284 / 5712", "cap": "Travelling", "category": "Travelling"}, {"image": "media/pages/about/selected/img_6324.webp", "aspect": "3024 / 4032", "cap": "Food & cooking", "category": "Food & cooking"}, {"image": "media/pages/about/selected/img_2034.webp", "aspect": "3024 / 4032", "cap": "Trekking", "category": "Trekking"}, {"image": "media/pages/about/selected/img_4898.webp", "aspect": "3024 / 4032", "cap": "Music & art", "category": "Music & art"}, {"image": "media/pages/about/selected/img_0888.webp", "aspect": "4032 / 3024", "cap": "Photography", "category": "Photography"}, {"image": "media/pages/about/selected/img_5953.webp", "aspect": "3213 / 5712", "cap": "Travelling", "category": "Travelling"}, {"image": "media/pages/about/selected/img_4655.webp", "aspect": "4284 / 5712", "cap": "Food & cooking", "category": "Food & cooking"}, {"image": "media/pages/about/selected/img_9191.webp", "aspect": "3213 / 5712", "cap": "Trekking", "category": "Trekking"}, {"image": "media/pages/about/selected/img_4259.webp", "aspect": "4284 / 5712", "cap": "Music & art", "category": "Music & art"}, {"image": "media/pages/about/selected/img_4850.webp", "aspect": "3024 / 4032", "cap": "Photography", "category": "Photography"}, {"image": "media/pages/about/selected/img_8215.webp", "aspect": "3024 / 4032", "cap": "Travelling", "category": "Travelling"}, {"image": "media/pages/about/selected/img_4665.webp", "aspect": "3024 / 4032", "cap": "Food & cooking", "category": "Food & cooking"}, {"image": "media/pages/about/selected/img_9146.webp", "aspect": "5712 / 4284", "cap": "Trekking", "category": "Trekking"}, {"image": "media/pages/about/selected/img_1067.webp", "aspect": "3024 / 4032", "cap": "Photography", "category": "Photography"}, {"image": "media/pages/about/selected/img_8124.webp", "aspect": "3213 / 5712", "cap": "Travelling", "category": "Travelling"}, {"image": "media/pages/about/selected/img_6296.webp", "aspect": "2268 / 4032", "cap": "Food & cooking", "category": "Food & cooking"}, {"image": "media/pages/about/selected/img_9070.webp", "aspect": "4284 / 5712", "cap": "Photography", "category": "Photography"}, {"image": "media/pages/about/selected/img_7324.webp", "aspect": "4284 / 5712", "cap": "Travelling", "category": "Travelling"}, {"image": "media/pages/about/selected/img_6320.webp", "aspect": "5712 / 4284", "cap": "Food & cooking", "category": "Food & cooking"}, {"image": "media/pages/about/selected/img_7403.webp", "aspect": "4284 / 5712", "cap": "Photography", "category": "Photography"}, {"image": "media/pages/about/selected/img_8458.webp", "aspect": "5712 / 3213", "cap": "Travelling", "category": "Travelling"}, {"image": "media/pages/about/selected/img_6419.webp", "aspect": "4284 / 5712", "cap": "Food & cooking", "category": "Food & cooking"}, {"image": "media/pages/about/selected/img_7191.webp", "aspect": "3024 / 4032", "cap": "Food & cooking", "category": "Food & cooking"}, {"image": "media/pages/about/selected/img_8307.webp", "aspect": "3024 / 4032", "cap": "Food & cooking", "category": "Food & cooking"}, {"image": "media/pages/about/selected/img_5833.webp", "aspect": "4284 / 5712", "cap": "Food & cooking", "category": "Food & cooking"}, {"image": "media/pages/about/selected/img_5940.webp", "aspect": "4284 / 5712", "cap": "Food & cooking", "category": "Food & cooking"}];
function shuffleLifePhotos(items) {
  const copy=[...items];
  for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
  return copy;
}
function HobbiesSection() {
  const groups=[
    {label:'Photography & travel',categories:['Photography','Travelling']},
    {label:'Trekking & adventure',categories:['Trekking']},
    {label:'Cooking & new food',categories:['Food & cooking']},
    {label:'Music & art',categories:['Music & art']},
    {label:'Fitness & yoga',categories:['Fitness & yoga']},
    {label:'Reading',categories:['Reading']}
  ];
  const [paused,setPaused]=React.useState(false);
  return <section className="about-journal-section life-frames">
    <h2 className="about-section-title">Life <em>outside the frame.</em></h2>
    <p className="life-caption">Travelling, cooking, tasting something new, and finding adventure in the everyday.</p>
    <div className="hobby-accordion">{groups.map((g,i)=><HobbyFrame key={g.label} group={g} index={i} paused={paused} onToggle={()=>setPaused(v=>!v)}/>)}</div>
  </section>;
}
function HobbyFrame({group,index,paused,onToggle}) {
  const [photos]=React.useState(()=>shuffleLifePhotos(LIFE_PHOTOS.filter(p=>group.categories.includes(p.category))));
  const [current,setCurrent]=React.useState(0);
  const frame=React.useRef(null);
  React.useEffect(()=>{
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    let timer;
    const start=()=>{clearInterval(timer);if(paused||motion.matches||photos.length<2)return;
      timer=setInterval(()=>{const r=frame.current?.getBoundingClientRect();if(!document.hidden&&r&&r.bottom>0&&r.top<innerHeight)setCurrent(n=>(n+1)%photos.length);},1800+index*130);
    };
    start();motion.addEventListener('change',start);
    return()=>{clearInterval(timer);motion.removeEventListener('change',start);};
  },[paused,photos.length,index]);
  return <button ref={frame} type="button" className="hobby-expand-frame" onClick={onToggle} aria-pressed={paused} aria-label={group.label+' — click to pause or resume photos'}>
    {photos.map((p,i)=><img key={p.image} className={i===current?'is-current':''} src={p.image} alt={i===current?group.label+' from my photo journal':''} aria-hidden={i!==current} loading="lazy"/>)}
    <span>{group.label}</span>
  </button>;
}

// ─── 06 — PHOTO COLLECTION (clean grid, hover lift, click to open) ────
function PhotoCollection() {
  const photos = GALLERY;
  const N = photos.length;
  const [focus, setFocus] = React.useState(null);
  const [origin,setOrigin]=React.useState(null);

  // keyboard nav in focus mode
  React.useEffect(() => {
    if (focus === null) return;
    const k = (e) => {
      // Escape is handled by the animated photo viewer.
      if (e.key === 'ArrowRight') setFocus((i) => (i + 1) % N);
      if (e.key === 'ArrowLeft')  setFocus((i) => (i - 1 + N) % N);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [focus, N]);

  return (
    <div className="about-photo-collection" style={{ padding: 'clamp(48px,10vw,90px) var(--pad)' }}>
      <Reveal delay={80}>
        <div style={{ fontSize: 'clamp(44px, 6vw, 88px)', lineHeight: 1, letterSpacing: -2, fontWeight: 300, marginBottom: 40, maxWidth: 1100 }}>
          Stills from <span style={{ fontStyle: 'italic', color: 'var(--lab-primary,#C1663B)' }}>worlds</span> <span style={{ fontStyle: 'italic' }}>I&apos;ve walked through.</span>
        </div>
      </Reveal>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gridAutoRows: 'minmax(160px, auto)',
        gap: 20,
      }}>
        {photos.map((p, i) => {
          const aspects = ['4 / 5', '5 / 6', '1 / 1', '4 / 5', '3 / 4'];
          const aspect = p.aspect || aspects[i % aspects.length];
          return (
            <Reveal key={i} delay={i * 60} y={20}>
              <PhotoCard p={p} i={i} aspect={aspect} hero={false} onOpen={rect=>{setOrigin(rect);setFocus(i)}} />
            </Reveal>
          );
        })}
      </div>

      {focus !== null && <PolaroidLightbox photos={photos} idx={focus} origin={origin} setIdx={setFocus} close={() => setFocus(null)} />}
    </div>
  );
}

function PhotoCard({ p, i, aspect = '4 / 5', hero = false, onOpen }) {
  const [hov, setH] = React.useState(false);
  const hover = useCursorLabel('open →', 'zoom');
  // bigger tilt range so cards feel handmade
  const tilts = [-3.5, 2.2, -1.8, 3.1, -2.6, 1.4, -2.9, 2.7, -1.2];
  const baseTilt = tilts[i % tilts.length];
  // tape positions alternate
  const tapeLeft = i % 2 === 0;
  return (
    <div {...hover} role="button" tabIndex={0} aria-label={"Open "+p.cap} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onOpen(e.currentTarget.getBoundingClientRect());}}} onClick={e=>onOpen(e.currentTarget.getBoundingClientRect())}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        position: 'relative',
        background: 'var(--lab-ink,#f2ede3)',
        padding: 14,
        paddingBottom: hero ? 56 : 42,
        boxShadow: hov
          ? '0 30px 64px rgba(0,0,0,0.55), 0 8px 18px rgba(0,0,0,0.35)'
          : '0 10px 28px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.3)',
        transform: `rotate(${hov ? 0 : baseTilt}deg) translateY(${hov ? -8 : 0}px) scale(${hov ? 1.03 : 1})`,
        transformOrigin: 'center center',
        transition: 'transform .45s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease',
        cursor: 'none',
        userSelect: 'none',
        // paper grain — subtle noise via repeating gradients
        backgroundImage: `
          radial-gradient(120% 90% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.06) 100%),
          repeating-linear-gradient(45deg,  rgba(0,0,0,0.014) 0 1px, transparent 1px 3px),
          repeating-linear-gradient(135deg, rgba(0,0,0,0.012) 0 1px, transparent 1px 3px)`,
        backgroundBlendMode: 'normal',
        zIndex: hov ? 5 : 1,
      }}>
      {/* tape sticker */}
      <div aria-hidden style={{
        position: 'absolute',
        top: -10, [tapeLeft ? 'left' : 'right']: '14%',
        width: 64, height: 22,
        background: 'rgba(var(--accent-rgb,215,184,125),0.32)',
        border: '1px solid rgba(var(--accent-rgb,215,184,125),0.45)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
        transform: `rotate(${tapeLeft ? -4 : 4}deg)`,
        backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 4px, transparent 4px 8px)',
      }} />

      <div style={{
        position: 'relative', overflow: 'hidden',
        aspectRatio: aspect,
        background: p.image ? '#0b0b0c' : (SCENES[p.tone] || SCENES.studio),
      }}>
        {p.image && (
          <img src={p.image} alt={p.cap || ''}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain',
              filter: hov ? 'saturate(1.05) contrast(1.04)' : 'saturate(0.95)',
              transition: 'filter .5s ease, transform .8s ease',
              transform: 'none',
            }} />
        )}
        <div style={{ position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 4px)' }} />
        <div style={{ position: 'absolute', inset: 0,
          boxShadow: 'inset 0 -60px 120px rgba(0,0,0,0.45), inset 0 30px 60px rgba(0,0,0,0.2)' }} />
        {/* corner brackets */}
        <div style={{ position: 'absolute', top: 8, left: 8, width: 14, height: 14, borderTop: '1px solid rgba(242,237,227,0.5)', borderLeft: '1px solid rgba(242,237,227,0.5)' }} />
        <div style={{ position: 'absolute', top: 8, right: 8, width: 14, height: 14, borderTop: '1px solid rgba(242,237,227,0.5)', borderRight: '1px solid rgba(242,237,227,0.5)' }} />
        <div style={{ position: 'absolute', bottom: 8, left: 8, width: 14, height: 14, borderBottom: '1px solid rgba(242,237,227,0.5)', borderLeft: '1px solid rgba(242,237,227,0.5)' }} />
        <div style={{ position: 'absolute', bottom: 8, right: 8, width: 14, height: 14, borderBottom: '1px solid rgba(242,237,227,0.5)', borderRight: '1px solid rgba(242,237,227,0.5)' }} />

      </div>


    </div>
  );
}

function PolaroidLightbox({photos,idx,setIdx,close,origin}) {
 const frameRef=React.useRef(null),backdrop=React.useRef(null),closing=React.useRef(false);
 const returnPhoto=()=>{if(closing.current)return;closing.current=true;const frame=frameRef.current;if(!frame||matchMedia('(prefers-reduced-motion:reduce)').matches){close();return}const r=frame.getBoundingClientRect(),to=origin?`translate(${origin.left+origin.width/2-r.left-r.width/2}px,${origin.top+origin.height/2-r.top-r.height/2}px) scale(${origin.width/r.width},${origin.height/r.height}) rotate(-3deg)`:'scale(.92)';backdrop.current?.animate([{opacity:1},{opacity:0}],{duration:480,fill:'forwards'});frame.animate([{transform:'none',opacity:1},{transform:to,opacity:origin?1:0}],{duration:480,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'}).onfinish=close};
 React.useLayoutEffect(()=>{if(!frameRef.current||matchMedia('(prefers-reduced-motion:reduce)').matches)return;const r=frameRef.current.getBoundingClientRect();const from=origin?`translate(${origin.left+origin.width/2-r.left-r.width/2}px,${origin.top+origin.height/2-r.top-r.height/2}px) scale(${origin.width/r.width},${origin.height/r.height}) rotate(-3deg)`:'scale(.9)';frameRef.current.animate([{transform:from,opacity:origin?1:0},{transform:'none',opacity:1}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'})},[]);
 const panel=React.useRef(null),latestClose=React.useRef(close);latestClose.current=returnPhoto;
 React.useEffect(()=>{const previous=document.activeElement,old=document.body.style.overflow;document.body.style.overflow='hidden';panel.current?.querySelector('button')?.focus({preventScroll:true});const keys=e=>{if(e.key==='Escape'){e.preventDefault();latestClose.current()}if(e.key==='Tab'){const buttons=[...panel.current.querySelectorAll('button')];const first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};window.addEventListener('keydown',keys);return()=>{document.body.style.overflow=old;window.removeEventListener('keydown',keys);previous?.focus?.({preventScroll:true})}},[]);
 const p=photos[idx];return ReactDOM.createPortal(<div ref={panel} className="full-photo-viewer" role="dialog" aria-modal="true" aria-label="Full photograph" onClick={returnPhoto}><div ref={backdrop} className="photo-viewer-backdrop"/><button className="photo-close" onClick={e=>{e.stopPropagation();returnPhoto()}} aria-label="Close photograph">Close ×</button><div ref={frameRef} className="viewer-polaroid"><img src={p.image} alt={p.cap||'Photograph'}/></div>{photos.length>1&&<><button className="photo-prev" aria-label="Previous photograph" onClick={e=>{e.stopPropagation();setIdx(i=>(i-1+photos.length)%photos.length)}}>←</button><button className="photo-next" aria-label="Next photograph" onClick={e=>{e.stopPropagation();setIdx(i=>(i+1)%photos.length)}}>→</button></>}<style>{`
 .full-photo-viewer{position:fixed;inset:0;z-index:11000;background:transparent;display:flex;align-items:center;justify-content:center;padding:64px 70px 30px;animation:photoOpen .3s ease}.viewer-polaroid img{display:block;max-width:100%;max-height:calc(100dvh - 94px);width:auto;height:auto;object-fit:contain;filter:none!important;transform:none!important}.full-photo-viewer button{position:absolute;background:color-mix(in srgb,var(--bg) 85%,transparent);color:var(--ink);border:1px solid var(--hair);border-radius:30px;padding:12px 16px;font:12px var(--mono);cursor:pointer}.full-photo-viewer button:focus-visible{outline:2px solid var(--accent);outline-offset:3px}.photo-close{right:22px;top:18px}.photo-prev{left:14px;top:50%}.photo-next{right:14px;top:50%}.studio-pointer,.studio-follower{z-index:12000!important}@keyframes photoOpen{from{opacity:0}to{opacity:1}}@media(max-width:600px){.full-photo-viewer{padding:65px 14px 70px}.viewer-polaroid img{max-height:calc(100dvh - 135px)}.photo-prev,.photo-next{top:auto;bottom:16px}}@media(prefers-reduced-motion:reduce){.full-photo-viewer{animation:none}}

 .photo-viewer-backdrop{position:absolute;inset:0;background:rgba(7,10,8,.94);backdrop-filter:blur(18px);z-index:-1}.viewer-polaroid{padding:14px 14px 42px;background:var(--ink);box-shadow:0 30px 100px #0008;max-width:100%;max-height:100%;position:relative;transform-origin:center;cursor:pointer}.viewer-polaroid:before{content:'';position:absolute;top:-10px;left:18%;width:64px;height:22px;background:color-mix(in srgb,var(--accent) 45%,transparent);rotate:-4deg}.viewer-polaroid img{max-height:calc(100dvh - 160px);max-width:calc(100vw - 170px);width:auto;height:auto;object-fit:contain;display:block}.full-photo-viewer button{z-index:2}@media(max-width:600px){.viewer-polaroid{padding:9px 9px 30px}.viewer-polaroid img{max-width:calc(100vw - 50px);max-height:calc(100dvh - 180px)}}
 `}</style></div>,document.body);
}

// ─── 07 — MOVIES ───────────────────────────────────────────
function MoviesSection() {
  const [focus, setFocus] = React.useState(null);
  return (
    <div id="about-films" style={{ padding: 'clamp(48px,10vw,90px) var(--pad)' }}>
      <Reveal delay={80}>
        <div style={{ fontSize: 'clamp(44px, 6vw, 88px)', lineHeight: 1, letterSpacing: -2, fontWeight: 300, marginBottom: 44, maxWidth: 1200 }}>
          Films that <span style={{ fontStyle: 'italic', color: 'var(--lab-primary,#C1663B)' }}>inspired</span> my world-building.
        </div>
      </Reveal>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {MOVIES.map((m, i) => (
          <Reveal key={m.title} delay={i * 50}>
            <MovieRow m={m} active={focus === i} onEnter={() => setFocus(i)} onLeave={() => setFocus(null)} last={i === MOVIES.length - 1} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function MovieRow({ m, active, onEnter, onLeave, last }) {
  const ref = useMagneticRow();
  const bp = useBP();
  const hover = useCursorLabel('★ ' + m.rating + '/10', 'link');
  return (
    <div ref={ref} {...hover} onMouseEnter={onEnter} onMouseLeave={onLeave}
      style={{ position: 'relative', overflow: 'hidden',
        display: 'grid', gridTemplateColumns: bp === 'mobile' ? '1fr' : bp === 'tablet' ? '50px 1fr 140px' : '60px minmax(0,1fr) 180px 120px', gap: 'clamp(10px,2.5vw,24px)', alignItems: bp === 'mobile' ? 'flex-start' : 'center',
        borderTop: 'none', borderBottom: 'none',
        padding: '24px 24px', cursor: 'none', transition: 'padding .35s',
        paddingLeft: active ? 40 : 24 }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(280px 200px at var(--mx, -200px) var(--my, 50%), rgba(var(--accent-rgb,215,184,125),0.10), transparent 70%)',
        opacity: 'var(--mActive, 0)', transition: 'opacity .25s',
      }} />

      <span style={{ position: 'relative', fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--dim)', letterSpacing: 1,
        transform: 'translateX(calc(var(--mxn, 0) * -2px))' }}>{m.year}</span>
      <span style={{ position: 'relative', fontSize: 'clamp(24px, 2.6vw, 40px)', fontWeight: 400, letterSpacing: -0.5, fontStyle: 'italic',
        color: active ? 'var(--accent)' : 'var(--ink)', transition: 'color .3s',
        transform: 'translateX(calc(var(--mxn, 0) * 3px))' }}>
        {m.title}
      </span>
      <span style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: 1,
        transform: 'translateX(calc(var(--mxn, 0) * 4px))' }}>
        <span>dir · {m.dir}</span>
        <span>vfx sup · {m.vfx}</span>
      </span>

      <div style={{ position: 'relative', fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--accent)', letterSpacing: 1, textAlign: 'right',
        transform: 'translateX(calc(var(--mxn, 0) * 6px))' }}>
        {'★'.repeat(Math.round(m.rating / 2))}{'☆'.repeat(5 - Math.round(m.rating / 2))} <span style={{ color: 'var(--ink)', marginLeft: 8 }}>{m.rating}/10</span>
      </div>
    </div>
  );
}

Object.assign(window, { ClassicAboutPage });
