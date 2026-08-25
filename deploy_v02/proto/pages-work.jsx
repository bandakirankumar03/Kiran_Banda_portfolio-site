// proto/pages-work.jsx — work index page with filters + reveals.

function WorkPage() {
  const { go } = React.useContext(RouteCtx);
  const [filter, setFilter] = React.useState('All');
  const [hovered, setHovered] = React.useState(null);
  const filters = ['All', 'Virtual Production', 'Environment', 'Photogrammetry', 'VFX Reel'];
  const counts = filters.reduce((a, f) => {
    a[f] = f === 'All' ? PROJECTS.length : PROJECTS.filter((p) => p.kind === f).length;
    return a;
  }, {});
  const list = PROJECTS.filter((p) => filter === 'All' || p.kind === filter);

  return (
    <div>
      <div style={{ padding: 'clamp(28px,6vw,40px) var(--pad) 20px' }}>
        <Reveal>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: 2, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 14 }}>
            selected work
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div style={{ fontSize: 'clamp(64px, 10vw, 136px)', lineHeight: 0.92, letterSpacing: -3, fontWeight: 300 }}>
            The <span style={{ fontStyle: 'italic', color: '#C1663B' }}>shot list.</span>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'baseline', marginTop: 40, fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--dim)' }}>
            <div style={{ display: 'flex', gap: 'clamp(12px,3vw,24px)', flexWrap: 'wrap' }}>
              {filters.map((f) => (
                <NavLink key={f} onClick={() => setFilter(f)}
                  style={{ color: filter === f ? 'var(--accent)' : 'var(--dim)',
                    borderBottom: filter === f ? `1px solid var(--accent)` : 'none', paddingBottom: 2 }}>
                  {f} <span style={{ opacity: 0.6 }}>· {counts[f]}</span>
                </NavLink>
              ))}
            </div>
            <span>showing {list.length} of {PROJECTS.length}</span>
          </div>
        </Reveal>
      </div>

      <div style={{ padding: 'clamp(48px,10vw,100px) var(--pad)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70} y={20}>
              <WorkRow p={p} hovered={hovered} setHovered={setHovered}
                onOpen={() => go({ name: 'case', slug: p.slug })} last={i === list.length - 1} />
            </Reveal>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function WorkRow({ p, hovered, setHovered, onOpen, last }) {
  const isH = hovered === p.slug;
  const cur = useCursorLabel('open project →', 'link');
  return (
    <div {...cur}
      onMouseEnter={(e) => { cur.onMouseEnter && cur.onMouseEnter(e); setHovered(p.slug); }}
      onMouseLeave={(e) => { cur.onMouseLeave && cur.onMouseLeave(e); setHovered(null); }}
      onClick={onOpen}
      style={{
        display: 'grid', gridTemplateColumns: 'clamp(96px,26vw,220px) 1fr clamp(24px,6vw,40px)',
        alignItems: 'center', padding: '28px 0', borderTop: `1px solid var(--hair)`,
        borderBottom: last ? `1px solid var(--hair)` : 'none', gap: 'clamp(14px,3vw,28px)',
        cursor: 'none', transition: 'padding .45s cubic-bezier(.2,.8,.2,1), transform .45s cubic-bezier(.2,.8,.2,1), background .45s',
        paddingLeft: isH ? 40 : 0, paddingRight: isH ? 12 : 0,
        transform: isH ? 'translateX(18px)' : 'translateX(0)',
        background: isH ? 'linear-gradient(90deg, rgba(115,194,251,0.07), rgba(115,194,251,0))' : 'transparent',
      }}>
      <Scene tone={p.tone} image={p.hero} video={p.heroVideo} vimeo={p.heroVimeo} poster={p.hero}
        style={{
          width: '100%', aspectRatio: '4 / 3', overflow: 'hidden',
          transform: isH ? 'scale(1.06) translateX(6px)' : 'scale(1)',
          filter: isH ? 'saturate(1.1) brightness(1.06)' : 'saturate(0.85) brightness(0.92)',
          boxShadow: isH ? '0 24px 50px -30px rgba(115,194,251,0.7)' : 'none',
          transition: 'transform .5s cubic-bezier(.2,.8,.2,1), filter .45s, box-shadow .45s',
        }}
        cap={p.kindShort} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 8 }}>
          <span style={{
            fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: 400, letterSpacing: -0.7,
            fontStyle: 'italic', color: isH ? 'var(--accent)' : 'var(--ink)', transition: 'color .3s',
          }}>{p.title}</span>
        </div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--dim)', fontWeight: 300, lineHeight: 1.5, maxWidth: 560, marginBottom: 8 }}>
          {p.tagline}
        </div>
      </div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--accent)', textAlign: 'right',
        transform: isH ? 'translateX(6px)' : 'translateX(-10px)',
        opacity: isH ? 1 : 0.3, transition: 'all .45s cubic-bezier(.2,.8,.2,1)' }}>→</div>
    </div>
  );
}

Object.assign(window, { WorkPage });
