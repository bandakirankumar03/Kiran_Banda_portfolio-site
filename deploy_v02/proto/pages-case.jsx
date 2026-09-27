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
  textTransform: 'uppercase', color: '#cfc9bd', textWrap: 'pretty',
};

function SectionLabel({ children, note }) {
  return (
    <Reveal>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--accent)', letterSpacing: 2, textTransform: 'uppercase' }}>{children}</div>
        <div style={{ flex: 1, height: 1, background: 'var(--hair)' }}></div>
        {note ? <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--dim)', letterSpacing: 1.5, textTransform: 'uppercase' }}>{note}</div> : null}
      </div>
    </Reveal>
  );
}

function SoftwareMarks({ list }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
      {(list.length ? list : ['—']).map((sw, i) => (
        <span key={i} style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: 1, color: 'var(--ink)' }}>
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
          textTransform: 'uppercase', color: '#f2ede3', textWrap: 'balance', maxWidth: '22ch',
          marginLeft: align === 'right' ? 'auto' : 0,
        }}>{head}</div>
        <div style={{
          fontFamily: 'var(--sans)', fontSize: 20, lineHeight: 1.8, color: '#cfc9bd', fontWeight: 300,
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
            <div style={{ fontFamily: 'var(--sans)', fontSize: 18, lineHeight: 1.85, color: '#cfc9bd', fontWeight: 300, textWrap: 'pretty' }}>
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
          letterSpacing: -1.2, textTransform: 'uppercase', color: '#f2ede3', textWrap: 'balance',
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
          <span style={{ color: '#cfc9bd' }}>{k}</span>
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

function StoryImage({ media, className = '' }) {
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
  return <div className={`xr-photo ${className}`} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
    <img src={media.image} alt={media.alt} width={media.width} height={media.height} loading="lazy" decoding="async" />
  </div>;
}

function RenderComparison({ media }) {
  const [active, setActive] = React.useState(0);
  const start = React.useRef(null);
  const labels = ['Final image', 'Color view', 'Gray shading'];
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
    <div className="xr-comparison-controls">
      <button type="button" onClick={()=>change(-1)} aria-label="Previous render view">←</button>
      <div className="xr-comparison-options">{labels.map((label,i)=><button type="button" key={label} aria-pressed={i===active} onClick={()=>setActive(i)}>{label}</button>)}</div>
      <button type="button" onClick={()=>change(1)} aria-label="Next render view">→</button>
    </div>
    <p className="xr-caption" aria-live="polite">{String(active+1).padStart(2,'0')} / 03 · {labels[active]} <span style={{float:'right'}}>Swipe to compare</span></p>
  </div>;
}

function StoryBook({ p, x }) {
  const groups = x.spreads.map(spread => ({ ...spread, media: spread.chapters.flatMap(id => x.chapters.find(ch => ch.id === id).media || []).filter(m => m.image) }));
  const [build, look, stage, crew] = groups;
  const mediaPlate = (media, cls = '') => (
    <StoryImage key={media.image} media={media} className={cls} />
  );
  return (
    <div className="xr-book">
      <style>{`
        .xr-book { margin: 0 auto 48px; max-width: 1280px; }
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
        .xr-kicker { font:11px var(--mono); text-transform:uppercase; color:var(--accent); letter-spacing:1.8px; }
        .xr-copy h2 { font-size:clamp(28px,3vw,42px); line-height:1.12; font-weight:300; margin:16px 0 22px; color:var(--ink); }
        .xr-copy p { font:16px/1.8 var(--sans); color:var(--ink); opacity:.83; margin:0 0 16px; }
        .xr-photo { position:relative; display:block; width:100%; min-width:0; padding:0; border:1px solid var(--hair); border-radius:6px; overflow:hidden; background:#101112; }
        .xr-photo img { display:block; width:100%; height:100%; object-fit:cover; }
        .xr-comparison-frame { overflow:hidden; border:1px solid var(--hair); border-radius:6px; aspect-ratio:16/9; touch-action:pan-y; cursor:grab; }
        .xr-comparison-frame:active { cursor:grabbing; }
        .xr-comparison-track { display:flex; height:100%; transition:transform .5s cubic-bezier(.2,.7,.2,1); }
        .xr-comparison-track img { flex:0 0 100%; min-width:0; width:100%; height:100%; object-fit:contain; user-select:none; }
        .xr-comparison-controls { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:12px; }
        .xr-comparison-controls button { background:transparent; border:1px solid var(--hair); border-radius:4px; color:var(--dim); padding:9px 10px; min-height:40px; font:11px var(--mono); cursor:pointer; }
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
        .xr-caption { color:var(--dim); font:12px/1.6 var(--sans); margin:10px 0 0; }
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
        .xr-films { max-width:950px; margin:16px auto 0; }
        .xr-tabs { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px; }
        .xr-tab { background:transparent; border:1px solid var(--hair); color:var(--dim); padding:12px 18px; border-radius:4px; cursor:pointer; font:12px var(--mono); }
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
      `}</style>
      <div className="xr-flow">
        <div className="xr-reveal xr-opening"><Reveal y={20}><div className="xr-copy"><h2>{build.title}</h2><p>{build.paragraphs[0]}</p></div></Reveal></div>
        <div className="xr-reveal xr-mountain"><Reveal delay={100} y={24}>{mediaPlate(build.media[0])}<p className="xr-caption">The backdrop begins in Gaea.</p></Reveal></div>
        <div className="xr-reveal xr-assembly"><Reveal y={24}>{mediaPlate(build.media[1])}<p className="xr-caption">Finding the composition inside Unreal.</p></Reveal></div>
        <div className="xr-reveal xr-build-note"><Reveal delay={100} y={20}><div className="xr-copy"><p>{build.paragraphs[1]}</p></div></Reveal></div>
        <div className="xr-reveal xr-look-note"><Reveal y={20}><div className="xr-copy"><p>{look.paragraphs[0]}</p><p>{look.paragraphs[1]}</p></div></Reveal></div>
        <div className="xr-reveal xr-beauty"><Reveal delay={100} y={24}><RenderComparison media={[look.media[0],look.media[1],look.media[6]]}/></Reveal></div>
        <div className="xr-diagnostics">{[look.media[2],look.media[3]].map((m,i)=><div key={m.image} className="xr-reveal"><Reveal delay={i*100} y={24}>{mediaPlate(m)}</Reveal></div>)}</div>
        <div className="xr-reveal xr-bridge"><Reveal y={20}><div className="xr-copy"><h2>Optimizing for the camera.</h2><p>{stage.paragraphs[0]}</p></div></Reveal></div>
        <div className="xr-reveal xr-stage-view"><Reveal y={24}><div className="xr-stage">{mediaPlate(stage.media[1])}{mediaPlate(stage.media[0])}</div></Reveal></div>
        <div className="xr-reveal xr-stage-note"><Reveal delay={100} y={20}><div className="xr-copy"><p>{stage.paragraphs[1]}</p></div></Reveal></div>
        <div className="xr-reveal xr-reflection"><Reveal y={20}><div className="xr-copy"><p>{crew.paragraphs[0]}</p></div></Reveal></div>
        <div className="xr-reveal xr-set"><Reveal delay={100} y={24}><div className="xr-set-grid">{[crew.media[0],crew.media[4],crew.media[1],crew.media[2]].map(m=>mediaPlate(m))}</div><p className="xr-caption">Beyond the viewport: camera, light, sound, and the people behind the shot.</p></Reveal></div>
        <div className="xr-reveal xr-crew-end"><Reveal y={24}>{mediaPlate(crew.media[5])}</Reveal></div>
        <div className="xr-reveal xr-ending"><Reveal delay={100} y={20}>{mediaPlate(crew.media[3])}<div className="xr-copy"><p>{crew.paragraphs[1]}</p></div></Reveal></div>
      </div>
    </div>
  );
}

function StoryFilms({p,x}) {
  const [active,setActive] = React.useState(0);
  const films = [x.video, x.chapters.find(ch=>ch.video).video, {src:'media/projects/xr01-chinese-temple/web/on-set.mp4',label:'On set',cap:'Behind the scenes on the XR stage.'}];
  return <div className="xr-films"><div className="xr-tabs" aria-label="Choose project video">{['Final film','Unreal render','Behind the scenes'].map((label,i)=><button key={label} className="xr-tab" aria-pressed={i===active} onClick={()=>setActive(i)}>{label}</button>)}</div><FinalVideo key={active} v={{...films[active],clickToPlay:true}} poster={active===0?'media/projects/xr01-chinese-temple/web/xr-shoot-02.webp':active===2?'media/projects/xr01-chinese-temple/web/on-set-poster.webp':p.hero} tone={p.tone}/></div>;
}

function FinalVideo({ v, poster, tone }) {
  const vid = vimeoIdFrom(v.vimeo);
  const [started,setStarted] = React.useState(!v.clickToPlay);
  return (
    <div style={{ marginBottom: 96 }}>
      <SectionLabel note={v.note || 'sound on'}>{v.label || 'the film'}</SectionLabel>
      <Reveal>
        <div style={{ position: 'relative', width: '100%', aspectRatio: v.aspectRatio || '16 / 9', background: '#0b0b0d', border: '1px solid var(--hair)', overflow: 'hidden', borderRadius: RADIUS }}>
          {vid && !started ? <button onClick={()=>setStarted(true)} aria-label={`Play ${v.label || 'video'}`} style={{position:'absolute',inset:0,width:'100%',height:'100%',padding:0,border:0,cursor:'pointer',background:'#101112',color:'#fff'}}><img src={poster} alt="" style={{width:'100%',height:'100%',objectFit:'cover',opacity:.65}}/><span style={{position:'absolute',inset:0,display:'grid',placeItems:'center',font:'18px var(--mono)'}}>▶ PLAY {v.label || 'FILM'}</span></button> : vid ? (
            <iframe
              src={`https://player.vimeo.com/video/${vid}?title=0&byline=0&portrait=0&playsinline=1${v.clickToPlay ? '&autoplay=1' : ''}`}
              frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
              title={v.cap || 'final film'}
              loading="lazy"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
          ) : v.src ? (
            <video src={v.src} poster={poster} controls preload="metadata"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
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
        <div style={{ marginTop: 12, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--dim)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
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
          color: '#f2ede3', textWrap: 'pretty',
        }}>{text}</div>
        <div style={{ marginTop: 34, fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--accent)', opacity: 0.8 }}>
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
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--dim)' }}>{label}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: 1.4, textTransform: 'uppercase', color: '#f2ede3', marginTop: 8 }}>{pp.title}</div>
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

function CasePage({ slug }) {
  const { go } = React.useContext(RouteCtx);
  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  const p = PROJECTS[idx] || PROJECTS[0];
  const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const x = (window.CASE_EXTRAS || {})[p.slug] || {};

  return (
    <div>
      <Scene tone={p.tone} image={p.hero} video={p.heroVideo} vimeo={p.heroVimeo} poster={p.hero}
        style={{ height: x.spreads ? '48vh' : '70vh', minHeight: 280, position: 'relative' }} />

      <div style={{ padding: 'clamp(36px,8vw,60px) var(--pad)' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28, fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)' }}>
            <NavLink onClick={() => go({ name: 'work' })}>← all work</NavLink>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(32px,6vw,80px)', marginBottom: 'clamp(36px,6vw,60px)' }}>
            <div style={{ fontSize: 'clamp(56px, 7vw, 96px)', lineHeight: 1, letterSpacing: -2.5, fontWeight: 300 }}>
              {p.title.split(' ').slice(0, -1).join(' ')}<br/>
              <span style={{ fontStyle: 'italic', color: '#C1663B' }}>{p.title.split(' ').slice(-1)}.</span>
            </div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.8, color: 'var(--dim)', fontWeight: 300, paddingTop: 12 }}>
              {p.blurb}
            </div>
          </div>
        </Reveal>

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

        {x.spreads ? <StoryFilms p={p} x={x} /> : <FinalVideo v={x.video || {}} poster={p.finalImage || p.hero} tone={p.tone} />}

        {x.spreads ? <p style={{textAlign:'center',fontFamily:'var(--serif)',fontStyle:'italic',fontSize:'clamp(22px,3vw,32px)',lineHeight:1.5,maxWidth:780,margin:'24px auto 44px'}}>{x.closing}</p> : <ClosingNote text={x.closing} title={p.title} />}
      </div>

      <CaseFooterNav prev={prev} next={next} go={go} />
    </div>
  );
}

Object.assign(window, { CasePage });
