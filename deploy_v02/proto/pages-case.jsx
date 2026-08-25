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

function FinalVideo({ v, poster, tone }) {
  const vid = vimeoIdFrom(v.vimeo);
  return (
    <div style={{ marginBottom: 96 }}>
      <SectionLabel note="sound on">the film</SectionLabel>
      <Reveal>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', background: '#0b0b0d', border: '1px solid var(--hair)', overflow: 'hidden', borderRadius: RADIUS }}>
          {vid ? (
            <iframe
              src={`https://player.vimeo.com/video/${vid}?title=0&byline=0&portrait=0&playsinline=1`}
              frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
              title={v.cap || 'final film'}
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
          {v.cap}
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
        style={{ height: '70vh', minHeight: 320, position: 'relative' }} />

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
            {[['Client', `${p.client} · ${p.year}`], ['Role', p.role], ['Duration', p.duration], ['Software', null]].map(([k, v]) => (
              <div key={k} style={{ borderTop: `1px solid var(--hair)`, paddingTop: 14 }}>
                <div>{k}</div>
                {v ? <div style={{ color: 'var(--ink)', marginTop: 6 }}>{v}</div> : <SoftwareMarks list={x.software || []} />}
              </div>
            ))}
          </div>
        </Reveal>

        <ProcessBook p={p} x={x} />

        <FinalVideo v={x.video || {}} poster={p.finalImage || p.hero} tone={p.tone} />

        <ClosingNote text={x.closing} title={p.title} />
      </div>

      <CaseFooterNav prev={prev} next={next} go={go} />
    </div>
  );
}

Object.assign(window, { CasePage });
