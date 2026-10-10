function ProjectCover({p, description, actionLabel, onAction}) {
  const ref=React.useRef(null);
  const titleRef=React.useRef(null);
  React.useLayoutEffect(()=>{
    const cover=ref.current,title=titleRef.current;
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    if(motion.matches || !title?.animate)return;
    const animations=[];
    title.querySelectorAll('.pc-title-line').forEach((line,i)=>animations.push(line.animate([
      {opacity:0,transform:'translateY(24px)',clipPath:'inset(0 0 100% 0)'},
      {opacity:1,transform:'translateY(0)',clipPath:'inset(0)'}
    ],{duration:1200,delay:200+i*120,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'})));
    animations.push(cover.querySelector('.pc-image').animate([{opacity:0,clipPath:'inset(5% 3%)'},{opacity:1,clipPath:'inset(0)'}],{duration:1900,delay:100,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}));
    const finish=()=>animations.forEach(a=>a.finish());
    motion.addEventListener('change',finish);
    return ()=>{animations.forEach(a=>a.cancel());motion.removeEventListener('change',finish);};
  },[p.slug]);
  React.useEffect(()=>{
    const cover=ref.current,motion=matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0;
    const update=()=>{
      frame=0;
      const box=cover.getBoundingClientRect();
      if(box.bottom<0 || box.top>innerHeight)return;
      cover.style.setProperty('--sy',motion.matches?'0px':`${Math.min(48,Math.max(0,-box.top)*.09)}px`);
    };
    const scroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
    const preference=()=>{cover.style.setProperty('--cx','0px');cover.style.setProperty('--cy','0px');update();};
    window.addEventListener('scroll',scroll,{passive:true});motion.addEventListener('change',preference);update();
    return ()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',scroll);motion.removeEventListener('change',preference);};
  },[p.slug]);
  const words=p.title.split(' '), last=words.pop();
  const move=e=>{if(!matchMedia('(hover:hover) and (prefers-reduced-motion:no-preference)').matches)return;const r=e.currentTarget.getBoundingClientRect();ref.current.style.setProperty('--cx',`${(e.clientX-r.left-r.width/2)*.012}px`);ref.current.style.setProperty('--cy',`${(e.clientY-r.top-r.height/2)*.012}px`);ref.current.style.setProperty('--lx',`${(e.clientX-r.left)/r.width*100}%`);};
  return <header className="project-cover" ref={ref} onPointerMove={move} onPointerLeave={()=>{ref.current.style.setProperty('--cx','0px');ref.current.style.setProperty('--cy','0px');}}>
    <style>{`
      .project-cover {--accent:#73c2fb;position:relative;isolation:isolate;overflow:hidden;min-height:660px;height:92svh;max-height:1080px;background:var(--bg);display:flex;flex-direction:column;justify-content:space-between;padding:125px var(--pad) 28px;}
      .project-cover .pc-image {position:absolute;inset:0;z-index:-3;overflow:hidden;}
      .pc-image-drift {width:100%;height:100%;transform:translate3d(var(--cx,0px),calc(var(--cy,0px) + var(--sy,0px)),0) scale(1.07);transition:transform 1.4s cubic-bezier(.2,.7,.2,1);}
      .pc-image-lens {width:100%;height:100%;animation:pc-lens 4.8s cubic-bezier(.2,.6,.3,1) both;}
      .pc-image-lens>img {width:100%;height:100%;object-fit:cover;filter:saturate(.94) contrast(1.045);}
      .pc-atmosphere {position:absolute;inset:0;z-index:-2;pointer-events:none;background:radial-gradient(ellipse at var(--lx,72%) 20%,#d98b4b19,transparent 55%),radial-gradient(ellipse at 12% 30%,#73c2fb12,transparent 55%),radial-gradient(ellipse at center,transparent 30%,#0004);transition:background-position 1s;}
      .pc-grain {position:absolute;inset:0;z-index:-1;pointer-events:none;opacity:.045;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Cpath filter='url(%23n)' opacity='.65' d='M0 0h180v180H0z'/%3E%3C/svg%3E");}
      @keyframes pc-lens {from{transform:scale(1.065)}to{transform:scale(1)}}
      .project-cover:after {content:'';position:absolute;inset:0;z-index:-2;background:linear-gradient(180deg,#0b0b0c65,transparent 27%,#0b0b0c22 45%,#0b0b0cd9 85%,var(--bg)),linear-gradient(90deg,#0b0b0c66,transparent 75%);pointer-events:none;}
      .pc-top,.pc-foot {display:flex;justify-content:space-between;align-items:center;gap:20px;font:12px/1.6 var(--mono);letter-spacing:1.5px;text-transform:uppercase;color:var(--ink);}
      .pc-top a {color:var(--ink);text-decoration:none;border-bottom:1px solid #f2ede350;padding-bottom:6px;cursor:pointer;}
      .pc-top span {color:var(--accent);}
      .pc-story {width:100%;max-width:none;margin:auto auto 28px;}
      .pc-role {font:12px/1.6 var(--mono);letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:22px;}
      .pc-story h1 {width:fit-content;position:relative;z-index:1;font:400 clamp(60px,8.8vw,138px)/.98 var(--serif);letter-spacing:-.055em;margin:0 0 26px;max-width:min(13ch,100%);text-shadow:0 4px 35px #0003;}
      .pc-story h1 em {color:var(--lab-primary,#C1663B);font-weight:400;}
      .pc-bottom {display:flex;align-items:flex-end;justify-content:space-between;gap:32px;}
      .pc-bottom p {font:14px/1.8 Arial,sans-serif;color:var(--ink);max-width:48ch;margin:0;}
      .pc-action {display:flex;align-items:center;gap:24px;border:0;background:transparent;color:var(--ink);padding:0;cursor:pointer;font:13px var(--mono);white-space:nowrap;}
      .pc-action span {display:grid;place-items:center;width:54px;height:54px;border:1px solid #f2ede360;border-radius:50%;font-size:21px;transition:background .25s,transform .25s;}
      .pc-action:hover span {background:var(--lab-primary,#C1663B);transform:rotate(45deg);}
      .pc-foot {border-top:1px solid #f2ede335;padding-top:18px;font-size:12px;color:var(--dim);}
      .pc-scroll {display:flex;align-items:center;gap:14px;}.pc-scroll:after {content:'↓';font-size:17px;color:var(--accent);}
      .pc-title-line {display:block;}
      @media(max-width:760px) {.project-cover{min-height:640px;height:90svh;padding-top:100px;}.pc-top{font-size:12px;}.pc-story{margin-top:auto;margin-bottom:24px;}.pc-story h1{font-size:clamp(56px,12vw,88px);}.pc-role{font-size:12px;}.pc-bottom{display:block;}.pc-bottom p{font-size:13px;max-width:38ch;}.pc-action{margin-top:20px;gap:15px;}.pc-action span{width:40px;height:40px;}.pc-foot{font-size:12px;}}
      @media(prefers-reduced-motion:reduce){.project-cover *{animation:none!important;transition:none!important;}.project-cover .pc-image-drift,.project-cover .pc-image-lens{transform:none!important;}}
    `}</style>
    <div className="pc-image"><div className="pc-image-drift"><div className="pc-image-lens">{p.hero ? <img src={p.hero} alt={p.title+' environment'} fetchpriority="high"/> : <Scene tone={p.tone} style={{width:'100%',height:'100%'}}/>}</div></div></div><div className="pc-atmosphere" aria-hidden="true"/><div className="pc-grain" aria-hidden="true"/>
    <div className="pc-top"><a href="#/work">← All work</a><span>Environment / {p.year}</span></div>
    <div className="pc-story"><div className="pc-role">{p.role}</div><h1 ref={titleRef}><span className="pc-title-line">{words.join(' ')}</span><em className="pc-title-line">{last.replace(/\.$/,'')}.</em></h1><div className="pc-bottom"><p>{description || p.tagline}</p>{onAction&&<button className="pc-action" onClick={onAction}>{actionLabel}<span aria-hidden="true">↗</span></button>}</div></div>
    <div className="pc-foot"><span>{p.client || 'Selected project'}</span><span className="pc-scroll">Scroll into the process</span></div>
  </header>;
}

// proto/pages-case.jsx — project page: hero + metadata, editorial process book, film, closing, prev/next.

function seedOf(str) {
  let h = 0;
  for (let i = 0; i < String(str).length; i++) h = (h * 31 + String(str).charCodeAt(i)) % 100000;
  return h;
}

const RADIUS = 6;

function Plate({ ph = {}, ar = '16 / 10', style = {} }) {
  const [h, setH] = React.useState(false);
  const hover = useCursorLabel('', 'default');
  return (
    <div {...hover} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ overflow: 'hidden', borderRadius: RADIUS, ...style }}>
      <Scene tone={ph.tone} image={ph.image} video={ph.video} vimeo={ph.vimeo} poster={ph.image}
        style={{
          aspectRatio: ar, width: '100%',
          transform: h ? 'scale(1.03)' : 'scale(1)', transition: 'transform 1.2s cubic-bezier(.2,.7,.2,1)',
        }} />
    </div>
  );
}

const microStyle = {
  fontFamily: 'var(--mono)', fontSize: 14, lineHeight: 2, letterSpacing: 0.8,
  textTransform: 'uppercase', color: 'var(--lab-muted,#cfc9bd)', textWrap: 'pretty',
};

function SectionLabel({ children, note }) {
  return (
    <Reveal>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--accent)', letterSpacing: 2, textTransform: 'uppercase' }}>{children}</div>
        <div style={{ flex: 1, height: 1, background: 'var(--hair)' }}></div>
        {note ? <div style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--dim)', letterSpacing: 1.5, textTransform: 'uppercase' }}>{note}</div> : null}
      </div>
    </Reveal>
  );
}

function SoftwareMarks({ list }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
      {(list.length ? list : ['—']).map((sw, i) => (
        <span key={i} style={{ fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: 1, color: 'var(--ink)' }}>
          {typeof sw === 'string' ? sw : sw.name}{i < list.length - 1 ? ' ·' : ''}
        </span>
      ))}
    </div>
  );
}

// ─── process-book blocks — landscape-first, medium-sized plates ───
function FullImage({ ph, ar, width = '100%', align = 'left' }) {
  return (
    <Reveal delay={40}>
      <div style={{ width, marginLeft: align === 'right' ? 'auto' : 0 }}>
        <Plate ph={ph} ar={ar} />
      </div>
    </Reveal>
  );
}

// 2 or 3 medium plates in a row — the workhorse of the section
function MediumRow({ set, specs, align = 'left' }) {
  const bp = useBP();
  return (
    <Reveal delay={40}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: bp === 'mobile' ? '1fr' : specs.map((sp) => sp.fr).join(' '),
        gap: 'clamp(14px,3vw,22px)',
        alignItems: 'end', width: '100%', marginLeft: align === 'right' ? 'auto' : 0,
      }}>
        {specs.map((sp, i) => <Plate key={i} ph={set[i]} ar={sp.ar} />)}
      </div>
    </Reveal>
  );
}

function AsymPair({ a, b, flip }) {
  const bp = useBP();
  return (
    <Reveal delay={40}>
      <div style={{ display: 'grid', gridTemplateColumns: bp === 'mobile' ? '1fr' : (flip ? '1.6fr 1fr' : '1fr 1.6fr'), gap: 'clamp(14px,3vw,22px)', alignItems: 'end' }}>
        {flip ? <Plate ph={b} ar="3 / 2" /> : <Plate ph={a} ar="1 / 1" />}
        {flip ? <Plate ph={a} ar="1 / 1" /> : <Plate ph={b} ar="3 / 2" />}
      </div>
    </Reveal>
  );
}

// opening statement — every project starts on type, not a picture
function OpenText({ eyebrow, head, body, align = 'left' }) {
  return (
    <Reveal>
      <div style={{ maxWidth: 1000, marginLeft: align === 'right' ? 'auto' : 0, textAlign: align }}>
        {eyebrow ? (
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 24 }}>
            {eyebrow}
          </div>
        ) : null}
        <div style={{
          fontSize: 'clamp(34px, 4.4vw, 64px)', lineHeight: 1.14, fontWeight: 300, letterSpacing: -1.4,
          textTransform: 'uppercase', color: 'var(--lab-ink,#f2ede3)', textWrap: 'balance', maxWidth: '22ch',
          marginLeft: align === 'right' ? 'auto' : 0,
        }}>{head}</div>
        <div style={{
          fontFamily: 'var(--sans)', fontSize: 20, lineHeight: 1.8, color: 'var(--lab-muted,#cfc9bd)', fontWeight: 300,
          marginTop: 30, maxWidth: '62ch', textWrap: 'pretty', marginLeft: align === 'right' ? 'auto' : 0,
        }}>{body}</div>
      </div>
    </Reveal>
  );
}

// two columns of running text between the photo rows
function TextColumns({ items, align = 'left' }) {
  const bp = useBP();
  return (
    <Reveal delay={40}>
      <div style={{
        display: 'grid', gridTemplateColumns: (items.length > 1 && bp !== 'mobile') ? '1fr 1fr' : '1fr', gap: 'clamp(28px,5vw,56px)',
        maxWidth: 1100, marginLeft: align === 'right' ? 'auto' : 0,
      }}>
        {items.map((t, i) => (
          <div key={i}>
            {t.title ? (
              <div style={{ fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: 2.4, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16 }}>
                {t.title}
              </div>
            ) : null}
            <div style={{ fontFamily: 'var(--sans)', fontSize: 18, lineHeight: 1.85, color: 'var(--lab-muted,#cfc9bd)', fontWeight: 300, textWrap: 'pretty' }}>
              {t.cap}
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

function CaptionPair({ a, b, align = 'left' }) {
  return (
    <Reveal delay={40}>
      <div style={{
        display: 'grid', gridTemplateColumns: useBP() === 'mobile' ? '1fr' : '1fr 1fr', gap: 'clamp(24px,4vw,48px)', maxWidth: 1000,
        marginLeft: align === 'right' ? 'auto' : 0, textAlign: align === 'right' ? 'right' : 'left',
      }}>
        <div style={microStyle}>{a}</div>
        <div style={microStyle}>{b}</div>
      </div>
    </Reveal>
  );
}

function PullQuote({ head, body, align = 'center' }) {
  const centered = align === 'center';
  return (
    <Reveal delay={40}>
      <div style={{
        maxWidth: 1000, margin: centered ? '0 auto' : (align === 'right' ? '0 0 0 auto' : 0),
        textAlign: centered ? 'center' : align,
      }}>
        <div style={{
          fontSize: 'clamp(32px, 4vw, 58px)', lineHeight: 1.12, fontWeight: 700,
          letterSpacing: -1.2, textTransform: 'uppercase', color: 'var(--lab-ink,#f2ede3)', textWrap: 'balance',
        }}>{head}</div>
        <div style={{
          ...microStyle, maxWidth: '52ch', marginTop: 28,
          marginLeft: centered ? 'auto' : (align === 'right' ? 'auto' : 0),
          marginRight: centered ? 'auto' : (align === 'right' ? 0 : 'auto'),
        }}>{body}</div>
      </div>
    </Reveal>
  );
}

function Triptych({ set, caption, capAlign = 'right', reverse }) {
  const bp = useBP();
  const cols = bp === 'mobile' ? '1fr' : bp === 'tablet' ? '1fr 1fr' : (reverse ? '1fr 1.2fr 1.5fr' : '1.5fr 1.2fr 1fr');
  return (
    <Reveal delay={40}>
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 'clamp(14px,3vw,22px)', alignItems: 'end' }}>
        <Plate ph={set[0]} ar="16 / 10" />
        <Plate ph={set[1]} ar="4 / 3" />
        <Plate ph={set[2]} ar="1 / 1" />
      </div>
      <div style={{
        ...microStyle, maxWidth: 560, marginTop: 24,
        marginLeft: capAlign === 'right' ? 'auto' : 0, textAlign: capAlign,
      }}>{caption}</div>
    </Reveal>
  );
}

function TimelineBlock({ ph, rows, flip }) {
  const image = <Plate ph={ph} ar="4 / 3" />;
  const log = (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
      {rows.map(([k, v], i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'baseline',
          borderTop: '1px solid var(--hair)', padding: '18px 0',
          fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: 1.6, textTransform: 'uppercase',
        }}>
          <span style={{ color: 'var(--lab-muted,#cfc9bd)' }}>{k}</span>
          <span style={{ color: 'var(--dim)' }}>{v}</span>
        </div>
      ))}
    </div>
  );
  const bp = useBP();
  return (
    <Reveal delay={40}>
      <div style={{ display: 'grid', gridTemplateColumns: bp === 'mobile' ? '1fr' : (flip ? '1fr 0.9fr' : '0.9fr 1fr'), gap: 'clamp(28px,5vw,56px)', alignItems: 'stretch' }}>
        {flip ? log : image}
        {flip ? image : log}
      </div>
    </Reveal>
  );
}

function ProcessBook({ p, x }) {
  if (x.spreads) return <StoryBook p={p} x={x} />;
  const proc = x.process || [];
  const pool = [];
  proc.forEach((it) => {
    const list = (it.images && it.images.length) ? it.images : [it.image];
    list.forEach((src) => pool.push({ image: src, tone: it.tone || p.tone }));
  });
  if (p.hero || p.heroVideo || p.heroVimeo) pool.push({ image: p.hero, tone: p.tone });
  if (p.finalImage) pool.push({ image: p.finalImage, tone: p.tone });
  while (pool.length < 12) pool.push({ tone: p.tone });
  let pi = 0;
  const nextPh = () => pool[(pi++) % pool.length];

  const caps = proc.map((it) => it.cap).filter(Boolean);
  const heads = proc.map((it) => it.title).filter(Boolean);
  let ci = 0, hi = 0;
  const cap = () => caps.length ? caps[(ci++) % caps.length] : 'Caption placeholder — a note on this stage of the build.';
  const head = () => heads.length ? heads[(hi++) % heads.length] : 'A line about the work';

  const idx = PROJECTS.findIndex((q) => q.slug === p.slug);
  const n = idx < 0 ? 0 : idx;

  // every page opens on type, then the same vocabulary in a different order
  const SEQS = [
    ['open', 'row3', 'pair', 'text2', 'trip', 'quote', 'row2', 'timeline', 'wide'],
    ['open', 'pair', 'text2', 'row3', 'quote', 'timeline', 'trip', 'wide', 'row2'],
    ['open', 'trip', 'text2', 'row2', 'wide', 'quote', 'row3', 'pair', 'timeline'],
    ['open', 'row2', 'pair', 'quote', 'row3', 'text2', 'timeline', 'trip', 'wide'],
    ['open', 'row3', 'text2', 'trip', 'quote', 'pair', 'wide', 'row2', 'timeline'],
    ['open', 'pair', 'row2', 'text2', 'timeline', 'quote', 'row3', 'trip', 'wide'],
  ];
  const seq = SEQS[n % SEQS.length];
  const flip = n % 2 === 1;
  const sideA = flip ? 'right' : 'left';
  const sideB = flip ? 'left' : 'right';
  const quoteAlign = ['center', 'center', 'left', 'center', 'right', 'center'][n % 6];

  const timelineRows = (x.log && x.log.length) ? x.log : [
    ['Survey', p.year], ['Blockout', p.year], ['Look development', p.year],
    ['Lighting pass', p.year], ['Final render', p.year],
  ];

  const ROW3 = [
    [{ fr: '1.3fr', ar: '4 / 3' }, { fr: '1fr', ar: '1 / 1' }, { fr: '1.2fr', ar: '16 / 10' }],
    [{ fr: '1fr', ar: '1 / 1' }, { fr: '1.4fr', ar: '16 / 10' }, { fr: '1.1fr', ar: '4 / 3' }],
  ];
  const ROW2 = [
    [{ fr: '1fr', ar: '4 / 3' }, { fr: '1fr', ar: '4 / 3' }],
    [{ fr: '1.3fr', ar: '16 / 10' }, { fr: '1fr', ar: '1 / 1' }],
  ];

  const render = (kind, i) => {
    switch (kind) {
      case 'open':
        return <OpenText key={i} eyebrow={x.processLabel || 'the build'} head={x.statement || head()} body={x.processIntro || cap()} align="left" />;
      case 'row3':
        return <MediumRow key={i} set={[nextPh(), nextPh(), nextPh()]} specs={ROW3[n % ROW3.length]} />;
      case 'row2':
        return <MediumRow key={i} set={[nextPh(), nextPh()]} specs={ROW2[n % ROW2.length]} align={sideB} />;
      case 'pair':
        return (
          <React.Fragment key={i}>
            <AsymPair a={nextPh()} b={nextPh()} flip={flip} />
            <CaptionPair a={cap()} b={cap()} align={sideA} />
          </React.Fragment>
        );
      case 'trip':
        return <Triptych key={i} set={[nextPh(), nextPh(), nextPh()]} caption={cap()} capAlign={sideB} reverse={flip} />;
      case 'text2':
        return <TextColumns key={i} items={[{ title: head(), cap: cap() }, { title: head(), cap: cap() }]} align={sideA} />;
      case 'quote':
        return <PullQuote key={i} head={x.quoteHead || head()} body={x.quoteBody || cap()} align={quoteAlign} />;
      case 'timeline':
        return <TimelineBlock key={i} ph={nextPh()} rows={timelineRows} flip={flip} />;
      case 'wide':
        return <FullImage key={i} ph={nextPh()} ar="16 / 9" width="86%" align={sideB} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ marginBottom: 120 }}>
      <SectionLabel note={`${Math.max(proc.length, 1)} stages`}>process book</SectionLabel>
      <div style={{ display: 'grid', gap: 'clamp(48px,8vw,84px)' }}>
        {seq.map((kind, i) => render(kind, i))}
      </div>
    </div>
  );
}

function StoryImage({ media, className = '', onInspect }) {
  const reset = event => {
    event.currentTarget.style.setProperty('--xr-x', '0px');
    event.currentTarget.style.setProperty('--xr-y', '0px');
  };
  const move = event => {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--xr-x', `${((event.clientX - box.left) / box.width - .5) * 7}px`);
    event.currentTarget.style.setProperty('--xr-y', `${((event.clientY - box.top) / box.height - .5) * 7}px`);
  };
  return <button type="button" aria-label={`Expand image: ${media.alt}`} onClick={()=>onInspect(media)} className={`xr-photo ${className}`} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
    <img src={media.image} alt={media.alt} width={media.width} height={media.height} loading="lazy" decoding="async" />
    <span className="xr-expand" aria-hidden="true">⤢</span>
  </button>;
}

function RenderComparison({ media, onInspect }) {
  const [active, setActive] = React.useState(0);
  const start = React.useRef(null);
  const labels = ['Gray shading', 'Mesh', 'Final image'];
  const change = step => setActive(i => (i + step + media.length) % media.length);
  return <div className="xr-comparison" role="region" aria-label="Unreal render comparison">
    <div className="xr-comparison-frame" tabIndex={0} aria-label="Use left and right arrow keys to compare render views"
      onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); change(event.key === 'ArrowLeft' ? -1 : 1); } }}
      onPointerDown={event => { start.current = { x:event.clientX, y:event.clientY }; }}
      onPointerUp={event => { const origin = start.current; start.current = null; if (!origin) return; const dx = event.clientX-origin.x, dy = event.clientY-origin.y; if (Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)) change(dx<0?1:-1); }}
      onPointerCancel={()=>{start.current=null;}} onPointerLeave={()=>{start.current=null;}}>
      <div className="xr-comparison-track" style={{transform:`translateX(-${active*100}%)`}}>
        {media.map((item,i)=><img key={item.image} src={item.image} alt={item.alt} aria-hidden={i!==active} width={2400} height={1350} loading="lazy" decoding="async" draggable={false}/>)}
      </div>
    </div>
    <button type="button" className="xr-view-button" onClick={()=>onInspect(media[active])}>⤢ Expand current image</button>
    <div className="xr-comparison-controls">
      <button type="button" onClick={()=>change(-1)} aria-label="Previous render view">←</button>
      <div className="xr-comparison-options">{labels.map((label,i)=><button type="button" key={label} aria-pressed={i===active} onClick={()=>setActive(i)}>{label}</button>)}</div>
      <button type="button" onClick={()=>change(1)} aria-label="Next render view">→</button>
    </div>
    <p className="xr-caption" aria-live="polite">{String(active+1).padStart(2,'0')} / 03 · {labels[active]} <span style={{float:'right'}}>Swipe to compare</span></p>
  </div>;
}

function ProjectImageViewer({ media, onClose }) {
  const dialog = React.useRef(null), canvas = React.useRef(null), image = React.useRef(null);
  const view = React.useRef({scale:1,x:0,y:0});
  const drag = React.useRef(null);
  const [state,setState] = React.useState(view.current);
  const [dragging,setDragging] = React.useState(false);
  const update = next => {
    const box=canvas.current.getBoundingClientRect(), img=image.current;
    const limitX=Math.max(0,(img.offsetWidth*next.scale-box.width)/2);
    const limitY=Math.max(0,(img.offsetHeight*next.scale-box.height)/2);
    const bounded={scale:next.scale,x:Math.max(-limitX,Math.min(limitX,next.x)),y:Math.max(-limitY,Math.min(limitY,next.y))};
    view.current=bounded; setState(bounded);
  };
  const zoom = (factor,x=0,y=0) => {
    const old=view.current, scale=Math.max(1,Math.min(6,old.scale*factor)), ratio=scale/old.scale;
    update({scale,x:x-(x-old.x)*ratio,y:y-(y-old.y)*ratio});
  };
  React.useEffect(()=>{
    const element=dialog.current, surface=canvas.current;
    const overflow=document.body.style.overflow;
    element.showModal(); document.body.style.overflow='hidden';
    const wheel=event=>{
      event.preventDefault();
      const box=surface.getBoundingClientRect();
      const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?box.height:1);
      zoom(Math.exp(-Math.max(-100,Math.min(100,delta))*.003),event.clientX-box.left-box.width/2,event.clientY-box.top-box.height/2);
    };
    const resize=()=>update(view.current);
    surface.addEventListener('wheel',wheel,{passive:false}); window.addEventListener('resize',resize);
    return ()=>{surface.removeEventListener('wheel',wheel); window.removeEventListener('resize',resize); element.close(); document.body.style.overflow=overflow;};
  },[]);
  const endDrag=()=>{drag.current=null;setDragging(false);};
  return <dialog ref={dialog} className="xr-image-dialog" aria-label="Expanded project image" onCancel={onClose}
    onKeyDown={event=>{
      if(['+','=','-','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) {
        event.preventDefault();
        if(event.key==='+'||event.key==='=') zoom(1.25);
        else if(event.key==='-') zoom(.8);
        else if(event.key==='0') update({scale:1,x:0,y:0});
        else update({...view.current,x:view.current.x+(event.key==='ArrowLeft'?60:event.key==='ArrowRight'?-60:0),y:view.current.y+(event.key==='ArrowUp'?60:event.key==='ArrowDown'?-60:0)});
      }
    }}>
    <div ref={canvas} className="xr-image-canvas" data-zoomed={state.scale>1} data-dragging={dragging}
      onDoubleClick={()=>view.current.scale>1?update({scale:1,x:0,y:0}):zoom(2)}
      onPointerDown={event=>{if(event.button!==0||view.current.scale<=1)return;event.preventDefault();event.currentTarget.setPointerCapture(event.pointerId);drag.current={x:event.clientX,y:event.clientY,view:{...view.current}};setDragging(true);}}
      onPointerMove={event=>{if(!drag.current)return;update({...drag.current.view,x:drag.current.view.x+event.clientX-drag.current.x,y:drag.current.view.y+event.clientY-drag.current.y});}}
      onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}>
      <img ref={image} src={media.image} alt={media.alt} draggable={false} style={{transform:`translate(${state.x}px,${state.y}px) scale(${state.scale})`}}/>
    </div>
    <button type="button" className="xr-image-close" aria-label="Close image" autoFocus onClick={onClose}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
  </dialog>;
}

function StoryBook({ p, x }) {
  const [selected, setSelected] = React.useState(null);
  const groups = x.spreads.map(spread => ({ ...spread, media: spread.chapters.flatMap(id => x.chapters.find(ch => ch.id === id).media || []).filter(m => m.image) }));
  const [build, look, stage, crew] = groups;
  const mediaPlate = (media, cls = '') => (
    <StoryImage key={media.image} media={media} className={cls} onInspect={setSelected} />
  );
  return (
    <div className="xr-book">
      <style>{`
        .xr-book { margin: 0 auto 48px; max-width: none; }
        .xr-flow { display:grid; grid-template-columns:repeat(12,minmax(0,1fr)); gap:38px 24px; align-items:center; }
        .xr-opening { grid-column:2/7; }
        .xr-mountain { grid-column:8/13; padding-top:45px; }
        .xr-assembly { grid-column:1/8; }
        .xr-build-note { grid-column:9/13; }
        .xr-look-note { grid-column:2/6; }
        .xr-beauty { grid-column:6/13; }
        .xr-diagnostics { grid-column:1/7; display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .xr-bridge { grid-column:8/13; }
        .xr-stage-view { grid-column:2/9; }
        .xr-stage-note { grid-column:9/13; }
        .xr-reflection { grid-column:1/5; }
        .xr-set { grid-column:6/13; }
        .xr-crew-end { grid-column:2/9; }
        .xr-ending { grid-column:9/13; }
        .xr-assembly .xr-photo { aspect-ratio:2400/742; }
        .xr-mountain .xr-photo,.xr-beauty .xr-photo,.xr-diagnostics .xr-photo,.xr-crew-end .xr-photo { aspect-ratio:16/9; }
        .xr-mountain img,.xr-assembly img,.xr-diagnostics img { object-fit:contain; }
        .xr-set-grid { display:grid; grid-template-columns:1fr 1fr 0.75fr; grid-template-rows:150px 105px; gap:9px; }
        .xr-set-grid .xr-photo:first-child { grid-column:1/3; }
        .xr-set-grid .xr-photo:nth-child(2) { grid-column:3; grid-row:1/3; }
        .xr-ending .xr-photo { width:55%; aspect-ratio:3/4; margin:0 0 22px auto; }
        .xr-kicker { font:13px var(--mono); text-transform:uppercase; color:var(--accent); letter-spacing:1.8px; }
        .xr-copy h2 { font-size:clamp(28px,3vw,42px); line-height:1.12; font-weight:300; margin:16px 0 22px; color:var(--ink); }
        .xr-copy p { font:16px/1.8 var(--sans); color:var(--ink); opacity:.83; margin:0 0 16px; }
        .xr-photo { position:relative; display:block; width:100%; min-width:0; padding:0; border:1px solid var(--hair); border-radius:6px; overflow:hidden; background:#101112; }
        .xr-photo { cursor:zoom-in; }
        .xr-expand { position:absolute; right:10px; bottom:10px; display:grid; place-items:center; width:38px; height:38px; border:1px solid #ffffff55; border-radius:50%; background:#101112dd; color:#fff; font:24px/1 var(--sans); }
        .xr-photo:focus-visible { outline:2px solid var(--accent); outline-offset:4px; }
        @media(hover:hover) { .xr-expand { opacity:0; transition:opacity .2s; } .xr-photo:hover .xr-expand,.xr-photo:focus-visible .xr-expand { opacity:1; } }
        .xr-view-button { display:block; margin:8px 0 0 auto; padding:8px; border:0; background:transparent; color:var(--dim); font:13px var(--mono); cursor:zoom-in; }
        .xr-image-dialog { position:fixed; inset:0; margin:0; padding:0; border:0; border-radius:0; background:transparent; width:100vw; height:100dvh; max-width:none; max-height:none; overflow:hidden; cursor:default!important; }
        .xr-image-dialog::backdrop { background:rgba(0,0,0,.92); }
        .xr-image-canvas { width:100%; height:100%; display:flex; align-items:center; justify-content:center; overflow:hidden; touch-action:none; cursor:zoom-in!important; }
        .xr-image-canvas[data-zoomed=true] { cursor:grab!important; }
        .xr-image-canvas[data-dragging=true] { cursor:grabbing!important; }
        .xr-image-canvas img { display:block; max-width:94vw; max-height:90dvh; width:auto; height:auto; object-fit:contain; user-select:none; pointer-events:none; transform-origin:center; }
        .xr-image-close { position:absolute; z-index:2; top:16px; right:16px; width:44px; height:44px; display:grid; place-items:center; padding:0; border:0; background:rgba(0,0,0,.35); border-radius:50%; color:#fff; cursor:pointer!important; }
        .xr-image-close svg { pointer-events:none; }
        .xr-image-close:focus-visible { outline:2px solid var(--accent); outline-offset:3px; }
        .xr-photo img { display:block; width:100%; height:100%; object-fit:cover; }
        .xr-comparison-frame { overflow:hidden; border:1px solid var(--hair); border-radius:6px; aspect-ratio:16/9; touch-action:pan-y; cursor:grab; }
        .xr-comparison-frame:active { cursor:grabbing; }
        .xr-comparison-track { display:flex; height:100%; transition:transform .5s cubic-bezier(.2,.7,.2,1); }
        .xr-comparison-track img { flex:0 0 100%; min-width:0; width:100%; height:100%; object-fit:contain; user-select:none; }
        .xr-comparison-controls { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:12px; }
        .xr-comparison-controls button { background:transparent; border:1px solid var(--hair); border-radius:4px; color:var(--dim); padding:9px 10px; min-height:40px; font:13px var(--mono); cursor:pointer; }
        .xr-comparison-options { display:flex; flex-wrap:wrap; gap:5px; justify-content:center; }
        .xr-comparison-options button[aria-pressed=true] { color:var(--accent); border-color:var(--accent); }
        .xr-comparison button:focus-visible,.xr-comparison-frame:focus-visible { outline:2px solid var(--accent); outline-offset:3px; }
        @media(prefers-reduced-motion:reduce) { .xr-comparison-track { transition:none; } }
        @media(hover:hover) and (prefers-reduced-motion:no-preference) {
          .xr-photo { transition:border-color .35s ease; }
          .xr-photo img { transition:transform .45s cubic-bezier(.2,.7,.2,1); }
          .xr-photo:hover { border-color:var(--accent); }
          .xr-photo:hover img { transform:translate(var(--xr-x,0px),var(--xr-y,0px)) scale(1.025); }
        }
        .xr-index button:focus-visible,.xr-tab:focus-visible { outline:2px solid var(--accent); outline-offset:4px; }
        .xr-reveal { min-width:0; }
        .xr-build { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .xr-build .xr-photo { aspect-ratio:16/10; }
        .xr-build .xr-photo:last-child { grid-column:1/-1; aspect-ratio:2400/742; }
        .xr-build .xr-photo img { object-fit:contain; }
        .xr-caption { color:var(--dim); font:14px/1.6 var(--sans); margin:10px 0 0; }
        .xr-inspect { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .xr-inspect .xr-photo { aspect-ratio:16/9; }
        .xr-inspect .xr-photo:first-child { grid-column:1/-1; aspect-ratio:2.5/1; }
        .xr-inspect .xr-photo:not(:first-child) img { object-fit:contain; }
        .xr-stage { display:grid; grid-template-columns:1fr 1fr; gap:10px; align-items:end; }
        .xr-stage .xr-photo:first-child { grid-column:1/-1; aspect-ratio:16/8; }
        .xr-stage .xr-photo:last-child { grid-column:2; aspect-ratio:16/9; margin-top:-80px; border:5px solid var(--bg,#08090b); }
        .xr-crew { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); grid-template-rows:155px 110px 85px; gap:8px; }
        .xr-crew .xr-photo:nth-child(1) { grid-column:1/4; }
        .xr-crew .xr-photo:nth-child(2) { grid-column:4; grid-row:1/3; }
        .xr-crew .xr-photo:nth-child(3) { grid-column:1/3; }
        .xr-crew .xr-photo:nth-child(4) { grid-column:3; }
        .xr-crew .xr-photo:nth-child(5) { grid-column:1/3; }
        .xr-crew .xr-photo:nth-child(6) { grid-column:3/5; }
        @media(prefers-reduced-motion:reduce) { .xr-reveal > div { opacity:1!important; transform:none!important; transition:none!important; } }
        .xr-films { max-width:none; margin:16px auto 0; }
        .xr-tabs { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px; }
        .xr-tab { background:transparent; border:1px solid var(--hair); color:var(--dim); padding:12px 18px; border-radius:4px; cursor:pointer; font:14px var(--mono); }
        .xr-tab[aria-pressed=true] { border-color:var(--accent); color:var(--accent); }
        @media(max-width:760px) {
          .xr-flow { grid-template-columns:repeat(6,minmax(0,1fr)); gap:26px 12px; }
          .xr-flow > * { grid-column:1/-1; padding-top:0; }
          .xr-flow .xr-mountain { grid-column:2/7; }
          .xr-flow .xr-build-note { grid-column:2/7; }
          .xr-flow .xr-diagnostics { grid-column:1/6; }
          .xr-flow .xr-stage-view { grid-column:1/7; }
          .xr-flow .xr-stage-note { grid-column:2/7; }
          .xr-ending > div { display:grid; grid-template-columns:1fr 1.5fr; gap:18px; align-items:center; }
          .xr-ending .xr-photo { width:100%; margin:0; }
          .xr-set-grid { grid-template-rows:105px 75px; }
          .xr-copy h2 { font-size:30px; margin:12px 0 16px; }
          .xr-copy p { font-size:15px; line-height:1.75; }
          .xr-crew { grid-template-rows:115px 85px 65px; }
          .xr-stage .xr-photo:last-child { margin-top:-40px; }
        }

        .xr-flow { gap:44px 28px; }
        .xr-opening { grid-column:1/6; }
        .xr-mountain { grid-column:8/13; padding-top:0; }
        .xr-assembly { grid-column:1/9; }
        .xr-build-note { grid-column:9/13; padding:0 0 0 16px; }
        .xr-look-note { grid-column:2/5; }
        .xr-beauty { grid-column:5/13; }
        .xr-diagnostics { grid-column:5/13; margin-top:-26px; }
        .xr-bridge { grid-column:1/10; padding:38px 0 0; }
        .xr-stage-view { grid-column:1/9; }
        .xr-stage-note { grid-column:9/13; }
        .xr-reflection { grid-column:1/5; padding-top:22px; }
        .xr-set { grid-column:5/13; }
        .xr-crew-end { grid-column:2/10; }
        .xr-ending { grid-column:10/13; align-self:end; }
        .xr-copy p { font-family:Arial,Helvetica,sans-serif; font-size:15px; line-height:1.8; color:var(--lab-muted,#bdbab3); opacity:1; max-width:48ch; }
        .xr-copy h2 { font-family:var(--serif); font-size:clamp(32px,3.8vw,54px); letter-spacing:-1.5px; line-height:1.15; margin:15px 0 20px; }
        .xr-copy h2 em { color:var(--lab-primary,#c88968); font-weight:400; }
        .xr-kicker { color:var(--lab-primary,#c88968); font-size:12px; letter-spacing:2px; display:block; }
        .xr-photo { border-radius:2px; }
        .xr-caption { font:12px/1.7 var(--mono); letter-spacing:.3px; }
        .xr-caption span { color:var(--lab-primary,#c88968); margin-right:12px; }
        .xr-mountain .xr-photo { aspect-ratio:16/10; }
        .xr-assembly .xr-photo { aspect-ratio:2400/742; }
        .xr-stage .xr-photo:first-child { aspect-ratio:16/10; }
        .xr-stage .xr-photo:last-child { width:62%; margin-left:auto; grid-column:1/-1; margin-top:-120px; margin-right:-16px; box-shadow:0 12px 40px #0008; }
        .xr-set-grid { grid-template-columns:1.2fr 1fr .85fr; grid-template-rows:180px 125px; }
        .xr-ending .xr-photo { width:100%; aspect-ratio:3/4; margin-bottom:12px; }
        .xr-tech-label { font:12px var(--mono); letter-spacing:1px; text-transform:uppercase; color:var(--lab-primary,#c88968); margin:0 0 8px; }
        .xr-tech-note { border-left:1px solid #c8896860; padding-left:18px; margin-bottom:25px; }
        .xr-tech-note p { margin:0; }
        .xr-comparison-controls { border-bottom:1px solid var(--hair); padding-bottom:12px; }
        .xr-comparison-controls button { border:0; border-radius:0; }
        .xr-comparison-options button[aria-pressed=true] { color:var(--lab-primary,#e5b196); box-shadow:inset 0 -1px var(--lab-primary,#c88968); }
        .xr-view-button { color:var(--lab-primary,#c88968); }
        .xr-outcome { grid-column:2/10; padding:12px 0 32px; }
        .xr-outcome p { font:clamp(23px,2.6vw,36px)/1.5 var(--serif); color:var(--ink); max-width:35ch; letter-spacing:-.6px; }
        @media(max-width:760px) {
          .xr-flow { gap:28px 12px; }
          .xr-flow > * { grid-column:1/-1; padding:0; }
          .xr-flow .xr-mountain { grid-column:2/7; }
          .xr-flow .xr-build-note { grid-column:2/7; }
          .xr-flow .xr-diagnostics { grid-column:1/7; margin-top:-12px; }
          .xr-flow .xr-stage-note { grid-column:2/7; }
          .xr-stage .xr-photo:last-child { margin-top:-50px; margin-right:0; }
          .xr-flow .xr-crew-end { grid-column:1/6; }
          .xr-flow .xr-ending { grid-column:6/7; }
          .xr-ending > div { display:block; }
          .xr-ending .xr-photo { aspect-ratio:3/5; }
          .xr-set-grid { grid-template-rows:130px 90px; }
          .xr-copy h2 { font-size:34px; }
          .xr-outcome p { font-size:25px; }
        }
      `}</style>
      <div className="xr-flow" id="xr-process">
        <div className="xr-reveal xr-opening"><Reveal y={20}><div className="xr-copy"><span className="xr-kicker">Environment / Development</span><h2>A world built<br/>for the <em>frame.</em></h2><p>{build.paragraphs[0]}</p></div></Reveal></div>
        <div className="xr-reveal xr-mountain"><Reveal y={24}>{mediaPlate(build.media[0])}<p className="xr-caption"><span>01</span>Gaea / terrain generation</p></Reveal></div>
        <div className="xr-reveal xr-assembly"><Reveal y={24}>{mediaPlate(build.media[1])}<p className="xr-caption"><span>02</span>Unreal Engine / scene assembly</p></Reveal></div>
        <div className="xr-reveal xr-build-note"><Reveal y={20}><div className="xr-copy"><div className="xr-tech-label">Terrain → composition</div><p>{build.paragraphs[1]}</p></div></Reveal></div>
        <div className="xr-reveal xr-look-note"><Reveal y={20}><div className="xr-copy"><span className="xr-kicker">Inside the scene</span><h2>Look closer.</h2><p>{look.paragraphs[0]}</p><p className="xr-caption">Three views. One environment.<br/>Select a view or swipe to compare.</p></div></Reveal></div>
        <div className="xr-reveal xr-beauty"><Reveal y={24}><RenderComparison onInspect={setSelected} media={[look.media[6],look.media[1],look.media[0]]}/></Reveal></div>
        <div className="xr-diagnostics">{[look.media[2],look.media[3]].map((m,i)=><div key={m.image} className="xr-reveal"><Reveal delay={i*80} y={24}>{mediaPlate(m)}<p className="xr-caption">{i===0?'Render buffers':'Geometry diagnostics'} ↗</p></Reveal></div>)}</div>
        <div className="xr-reveal xr-bridge"><Reveal y={20}><div className="xr-copy"><span className="xr-kicker">The production challenge</span><h2>Built in Unreal.<br/><em>Resolved on stage.</em></h2></div></Reveal></div>
        <div className="xr-reveal xr-stage-view"><Reveal y={24}><div className="xr-stage">{mediaPlate(stage.media[1])}{mediaPlate(stage.media[0])}</div><p className="xr-caption"><span>03</span>The environment meets the physical set.</p></Reveal></div>
        <div className="xr-reveal xr-stage-note"><Reveal y={20}><div className="xr-copy"><div className="xr-tech-note"><div className="xr-tech-label">Constraint</div><p>Dense foliage and wind animation were too demanding for the XR setup.</p></div><div className="xr-tech-note"><div className="xr-tech-label">Intervention</div><p>Replaced PCG with camera-visible manual placement. Swapped selected tree meshes for image cards with subtle motion.</p></div><div className="xr-tech-note"><div className="xr-tech-label">Result</div><p>Reduced scene complexity while preserving the composition used for filming.</p></div></div></Reveal></div>
        <div className="xr-reveal xr-reflection"><Reveal y={20}><div className="xr-copy"><span className="xr-kicker">Beyond the viewport</span><h2>A shared<br/><em>production.</em></h2><p>{crew.paragraphs[0]}</p></div></Reveal></div>
        <div className="xr-reveal xr-set"><Reveal y={24}><div className="xr-set-grid">{[crew.media[0],crew.media[4],crew.media[1],crew.media[2]].map(m=>mediaPlate(m))}</div><p className="xr-caption">Camera / light / sound / collaboration</p></Reveal></div>
        <div className="xr-reveal xr-crew-end"><Reveal y={24}>{mediaPlate(crew.media[5])}<p className="xr-caption"><span>04</span>The cast and crew behind The Gate Within.</p></Reveal></div>
        <div className="xr-reveal xr-ending"><Reveal y={24}>{mediaPlate(crew.media[3])}</Reveal></div>
        <div className="xr-reveal xr-outcome"><Reveal y={20}><span className="xr-kicker">What I took forward</span><p>Design for the image.<br/>Optimize for the shot.<br/><em>Build with the crew.</em></p></Reveal></div>
      </div>
      {selected && <ProjectImageViewer media={selected} onClose={()=>setSelected(null)}/>}
    </div>
  );
}

function StoryFilms({p,x}) {
  const [active,setActive]=React.useState(0);
  const gate=p.slug==='xr01-chinese-temple';
  const candidates=x.films || (gate ? [
    {...x.video,label:'Final film',poster:'media/projects/xr01-chinese-temple/web/xr-shoot-02.webp'},
    {...(x.chapters || []).find(ch=>ch.video)?.video,label:'Unreal render',poster:p.hero},
    {src:'media/projects/xr01-chinese-temple/web/on-set.mp4',label:'Behind the scenes',poster:'media/projects/xr01-chinese-temple/web/on-set-poster.webp',cap:'Behind the scenes on the XR stage.'}
  ] : [{...x.video,label:'Final film'},...(x.chapters || []).filter(ch=>ch.video).map(ch=>({...ch.video,label:ch.video.label || 'Unreal render'}))]);
  const films=candidates.filter(v=>v.vimeo || v.src);
  if(!films.length) return null;
  const current=films[Math.min(active,films.length-1)];
  return <div className="xr-films shared-films">
    <style>{`.shared-films .xr-tabs{display:flex;gap:24px;flex-wrap:wrap;margin:0 0 24px;}.shared-films .xr-tab{background:none;border:0;border-bottom:1px solid transparent;border-radius:0;padding:12px 0;color:var(--dim);font:13px var(--mono);cursor:pointer;}.shared-films .xr-tab[aria-pressed=true]{color:var(--ink);border-bottom-color:var(--accent);}.shared-films .xr-tab:focus-visible{outline:2px solid var(--accent);outline-offset:4px;}.shared-films video{object-fit:contain!important;cursor:auto;}`}</style>
    <div className="xr-tabs" role="group" aria-label="Choose project video">{films.map((film,i)=><button key={film.label+i} className="xr-tab" aria-pressed={i===active} onClick={()=>setActive(i)}>{film.label}</button>)}</div>
    <FinalVideo key={current.src || current.vimeo} v={{...current,clickToPlay:true}} poster={current.poster || p.hero} tone={p.tone}/>
  </div>;
}

function FinalVideo({ v, poster, tone }) {
  const vid = vimeoIdFrom(v.vimeo);
  const [started,setStarted] = React.useState(!v.clickToPlay);
  const [nativeRatio,setNativeRatio]=React.useState(null);
  const ratio=nativeRatio || ({'1233905426':'16 / 9','1230103396':'426 / 178','1230103395':'16 / 9'}[vid]) || v.aspectRatio || '16 / 9';
  return (
    <div style={{ marginBottom: 96 }}>
      <SectionLabel note={v.note || 'sound on'}>{v.label || 'the film'}</SectionLabel>
      <Reveal>
        <div style={{ position: 'relative', width: '100%', aspectRatio: ratio, background: 'transparent', border: 0, overflow: 'hidden', borderRadius: 0 }}>
          {vid && !started ? <button onClick={()=>setStarted(true)} aria-label={`Play ${v.label || 'video'}`} style={{position:'absolute',inset:0,width:'100%',height:'100%',padding:0,border:0,cursor:'pointer',background:'#101112',color:'#fff'}}><img src={poster} alt="" style={{width:'100%',height:'100%',objectFit:'cover',opacity:.65}}/><span style={{position:'absolute',inset:0,display:'grid',placeItems:'center',font:'18px var(--mono)'}}>▶ PLAY {v.label || 'FILM'}</span></button> : vid ? (
            <iframe
              src={`https://player.vimeo.com/video/${vid}?title=0&byline=0&portrait=0&playsinline=1${v.clickToPlay ? '&autoplay=1' : ''}`}
              frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
              title={v.cap || 'final film'}
              loading="lazy"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
          ) : v.src ? (
            <video src={v.src} poster={poster} controls playsInline preload="metadata" onLoadedMetadata={e=>{const el=e.currentTarget;if(el.videoWidth && el.videoHeight)setNativeRatio(`${el.videoWidth} / ${el.videoHeight}`);}}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxHeight:'none', aspectRatio:'auto', objectFit: 'contain', border:0, borderRadius:0 }} />
          ) : (
            <div style={{ position: 'absolute', inset: 0 }}>
              <Scene tone={tone} image={poster} poster={poster} style={{ height: '100%' }} />
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)',
                background: 'rgba(8,9,11,0.45)',
              }}>
                film coming — drop a vimeo link or mp4
              </div>
            </div>
          )}
        </div>
      </Reveal>
      {v.cap ? (
        <div style={{ marginTop: 12, fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--dim)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
          {v.cap} {vid && <a href={`https://vimeo.com/${vid}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', marginLeft: 12 }}>Watch on Vimeo ↗</a>}
        </div>
      ) : null}
    </div>
  );
}

function ClosingNote({ text, title }) {
  if (!text) return null;
  return (
    <Reveal>
      <div style={{ padding: '110px 0 90px', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 1, height: 56, background: 'var(--accent)', opacity: 0.5, margin: '0 auto 40px' }}></div>
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 300,
          fontSize: 'clamp(30px, 3.4vw, 50px)', lineHeight: 1.35, letterSpacing: -0.8,
          color: 'var(--lab-ink,#f2ede3)', textWrap: 'pretty',
        }}>{text}</div>
        <div style={{ marginTop: 34, fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--accent)', opacity: 0.8 }}>
          — kiran, on {title.toLowerCase()}
        </div>
      </div>
    </Reveal>
  );
}

// prev / next with thumbnails
function CaseFooterNav({ prev, next, go }) {
  const item = (label, pp, right) => (
    <div {...useCursorLabel(pp.title.toLowerCase(), 'link')} onClick={() => go({ name: 'case', slug: pp.slug })}
      style={{ display: 'flex', alignItems: 'center', gap: 22, cursor: 'none', flexDirection: right ? 'row-reverse' : 'row' }}>
      <span style={{
        width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--hair)', flex: '0 0 auto',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--accent)',
      }}>{right ? '→' : '←'}</span>
      <div style={{ width: 140, flex: '0 0 auto', overflow: 'hidden', borderRadius: RADIUS }}>
        <Scene tone={pp.tone} image={pp.hero} poster={pp.hero} style={{ aspectRatio: '16 / 10', width: '100%' }} />
      </div>
      <div style={{ textAlign: right ? 'right' : 'left' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--dim)' }}>{label}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--lab-ink,#f2ede3)', marginTop: 8 }}>{pp.title}</div>
      </div>
    </div>
  );
  return (
    <div style={{ borderTop: '1px solid var(--hair)', padding: '32px var(--pad) clamp(48px,8vw,90px)', display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
      {item('previous', prev, false)}
      {item('next', next, true)}
    </div>
  );
}

function XRCasePage({p,x,prev,next,go}) {
  return <div className="xr-editorial case-cinematic">
    <style>{`
      .xr-editorial { --accent:var(--lab-primary,#c88968); }
      .xr-cover { position:relative; min-height:660px; height:88svh; max-height:1000px; display:flex; align-items:flex-end; padding:100px var(--pad) 48px; overflow:hidden; }
      .xr-cover > img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:50% 48%; }
      .xr-cover:after { content:''; position:absolute; inset:0; background:linear-gradient(180deg,#0004 0%,#0000 30%,#0b0b0c88 62%,#0b0b0c 100%); }
      .xr-cover-copy { position:relative; z-index:1; width:100%; max-width:1280px; margin:auto auto 0; }
      .xr-cover-meta { font:12px var(--mono); text-transform:uppercase; letter-spacing:2px; color:#e0d7ca; display:flex; gap:18px; margin-bottom:24px; }
      .xr-cover h1 { font:400 clamp(64px,9.4vw,142px)/.98 var(--serif); letter-spacing:-5px; margin:0 0 24px; text-shadow:0 3px 35px #0005; }
      .xr-cover h1 em { color:#d79a7b; }
      .xr-cover-bottom { display:flex; justify-content:space-between; align-items:flex-end; gap:28px; }
      .xr-cover-bottom p { font:15px/1.7 Arial,sans-serif; max-width:350px; margin:0; color:#d6d0c6; }
      .xr-cover-links { display:flex; gap:24px; font:13px var(--mono); flex-shrink:0; }
      .xr-cover-links a { border-bottom:1px solid #d79a7b80; padding:12px 0; cursor:pointer; }
      .xr-cover-links a:hover { color:#d79a7b; }
      .xr-case-body { padding:0 var(--pad); max-width:none; margin:auto; }
      .xr-brief { display:grid; grid-template-columns:1.5fr 1fr 1fr; gap:32px; padding:32px 0 40px; margin:0 auto 64px; max-width:none; border-bottom:1px solid var(--hair); }
      .xr-brief span { display:block; font:12px var(--mono); text-transform:uppercase; letter-spacing:1.8px; color:var(--lab-primary,#c88968); margin-bottom:12px; }
      .xr-brief p { font:13px/1.8 Arial,sans-serif; margin:0; color:var(--lab-muted,#c7c2b9); }
      .xr-brief strong { color:var(--ink); font-weight:400; }
      .xr-screening { max-width:none; margin:0 auto; scroll-margin-top:90px; border-top:1px solid var(--hair); padding-top:38px; }
      .xr-screening-heading { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:28px; }
      .xr-screening h2 { font:400 clamp(32px,4vw,52px)/1.2 var(--serif); margin:0; letter-spacing:-1px; }
      .xr-screening .xr-films { max-width:none; }
      .xr-screening .xr-tabs { gap:24px; }
      .xr-screening .xr-tab { border:0; border-radius:0; border-bottom:1px solid transparent; padding:12px 0; }
      .xr-screening .xr-tab[aria-pressed=true] { border-bottom-color:var(--accent); }
      #xr-process { scroll-margin-top:100px; }
      @media(max-width:760px) {
        .xr-cover { min-height:580px; height:82svh; padding-bottom:28px; }
        .xr-cover h1 { font-size:clamp(58px,13vw,90px); letter-spacing:-2.5px; }
        .xr-cover-meta { font-size:12px; gap:12px; letter-spacing:1px; }
        .xr-cover-bottom { display:block; }
        .xr-cover-bottom p { font-size:13px; max-width:32ch; }
        .xr-cover-links { margin-top:20px; }
        .xr-brief { grid-template-columns:1fr 1fr; gap:24px; margin-bottom:44px; padding-top:24px; }
        .xr-brief > div:first-child { grid-column:1/-1; }
        .xr-screening-heading { display:block; }
        .xr-screening-heading .xr-kicker { margin-top:12px; }
      }
      @media(prefers-reduced-motion:reduce) { .xr-editorial * { scroll-behavior:auto; } }
    `}</style>
    <ProjectCover p={p} description="An Unreal environment brought to life on the virtual production stage." actionLabel="Watch the film" onAction={()=>document.getElementById('xr-screening').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}/>
    <main className="xr-case-body">
      <div className="xr-brief"><div><span>My contribution</span><p><strong>Environment artist · Virtual production</strong><br/>Scene development, composition, and on-stage adaptation.</p></div><div><span>Toolset</span><p>Unreal Engine 5 / Gaea<br/>Fab asset integration</p></div><div><span>Production focus</span><p>Camera-led foliage placement<br/>Real-time scene optimization</p></div></div>
      <StoryBook p={p} x={x}/>
      <div id="xr-screening" className="xr-screening"><div className="xr-screening-heading"><h2>The finished work.</h2><span className="xr-kicker">Film / environment / on set</span></div><StoryFilms p={p} x={x}/></div>
    </main>
    <CaseFooterNav prev={prev} next={next} go={go}/>
  </div>;
}

function CasePage({ slug }) {
  React.useLayoutEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[slug]);
  React.useEffect(()=>{
    let previousY=scrollY,previousTime=performance.now(),speed=0;
    const track=()=>{
      const now=performance.now();
      const delta=Math.abs(scrollY-previousY)/Math.max(16,Math.min(64,now-previousTime));
      speed=now-previousTime>180?delta:speed*.35+delta*.65;
      previousY=scrollY;previousTime=now;
      window.dispatchEvent(new CustomEvent('case-scroll-motion',{detail:{speed}}));
    };
    window.addEventListener('scroll',track,{passive:true});
    return ()=>window.removeEventListener('scroll',track);
  },[slug]);
  const { go } = React.useContext(RouteCtx);
  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  const p = PROJECTS[idx] || PROJECTS[0];
  const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const x = (window.CASE_EXTRAS || {})[p.slug] || {};
  if (x.layout === 'nyc') return <NYCCasePage p={p} x={x} prev={prev} next={next} go={go}/>;
  if (x.spreads) return <XRCasePage p={p} x={x} prev={prev} next={next} go={go}/>;

  return (
    <div className="case-cinematic">
      <ProjectCover p={p}/>

      <div style={{ padding: 'clamp(36px,8vw,60px) var(--pad)' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28, fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)' }}>
            <NavLink onClick={() => go({ name: 'work' })}>← all work</NavLink>
          </div>
        </Reveal>

        <Reveal delay={100}><p style={{fontSize:15,lineHeight:1.8,color:'var(--dim)',maxWidth:760,margin:'0 0 48px'}}>{p.blurb}</p></Reveal>

        <Reveal delay={180}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 24, marginBottom: 'clamp(48px,8vw,90px)', fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: 1 }}>
            {[['Client', `${p.client} · ${p.year}`], ['Role', p.role], p.focus ? ['Focus', p.focus] : ['Duration', p.duration], ['Software', null]].map(([k, v]) => (
              <div key={k} style={{ borderTop: `1px solid var(--hair)`, paddingTop: 14 }}>
                <div>{k}</div>
                {v ? <div style={{ color: 'var(--ink)', marginTop: 6 }}>{v}</div> : <SoftwareMarks list={x.software || []} />}
              </div>
            ))}
          </div>
        </Reveal>

        <ProcessBook p={p} x={x} />

        <StoryFilms p={p} x={x} />

        {x.spreads ? <p style={{textAlign:'center',fontFamily:'var(--serif)',fontStyle:'italic',fontSize:'clamp(22px,3vw,32px)',lineHeight:1.5,maxWidth:780,margin:'24px auto 44px'}}>{x.closing}</p> : <ClosingNote text={x.closing} title={p.title} />}
      </div>

      <CaseFooterNav prev={prev} next={next} go={go} />
    </div>
  );
}

Object.assign(window, { CasePage });
