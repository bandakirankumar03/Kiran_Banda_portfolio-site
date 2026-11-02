// proto/intro.jsx — entrance: 4-stage logo build (wireframe → solid → texture → lit).
// On done, fades out to reveal the site behind.

function Intro({ onEnter }) {
  // stage indices:
  //  0 = pre (palette background)
  //  1 = wireframe (logo line-art, scanlines, grid)
  //  2 = solid (filled silhouette in mid-grey)
  //  3 = texture (palette accent + grain)
  //  4 = lit (palette ink + soft halo)
  //  5 = pull-back / fade (logo shrinks, viewfinder corners pull in, fade)
  const [stage, setStage] = React.useState(0);

  React.useEffect(() => {
    const seq = [
      [120, 1],   // start wireframe quickly
      [900, 2],   // solid
      [1700, 3],  // texture
      [2500, 4],  // lit
      [3500, 5],  // pull back
      [4400, 6],  // done
    ];
    const timers = seq.map(([t, s]) => setTimeout(() => setStage(s), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  React.useEffect(() => {
    if (stage === 6) {
      const t = setTimeout(onEnter, 100);
      return () => clearTimeout(t);
    }
  }, [stage, onEnter]);

  // skip on click / key
  React.useEffect(() => {
    const skip = () => setStage(6);
    const onKey = (e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') skip(); };
    window.addEventListener('click', skip);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('click', skip); window.removeEventListener('keydown', onKey); };
  }, []);

  const stages = ['', 'wire', 'solid', 'texture', 'lit', 'final'];

  return (
    <div className="site-intro" style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'var(--bg)',
      opacity: stage >= 6 ? 0 : 1, transition: 'opacity .8s ease',
      pointerEvents: stage >= 6 ? 'none' : 'auto',
      overflow: 'hidden', cursor: 'none',
    }}>
      {/* Subtle technical grid bg */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(color-mix(in srgb,var(--accent) 6%,transparent) 1px, transparent 1px),
          linear-gradient(90deg, color-mix(in srgb,var(--accent) 6%,transparent) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
        opacity: stage === 1 ? 1 : stage >= 2 && stage < 5 ? 0.25 : 0,
        transition: 'opacity .5s ease',
        maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
      }} />

      {/* Scan lines that sweep down during wireframe stage */}
      {stage === 1 && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, transparent 0%, color-mix(in srgb,var(--accent) 18%,transparent) 50%, transparent 100%)',
          backgroundSize: '100% 220px',
          animation: 'scanSweep 1s linear',
        }} />
      )}

      {/* Center stage */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 36,
      }}>
        <div style={{
          filter: stage >= 4 ? 'drop-shadow(0 0 20px color-mix(in srgb,var(--accent) 30%,transparent))' : 'none',
          position: 'relative', width: 'min(480px, calc(100vw - 64px))', height: 'auto', aspectRatio: '12 / 7',
          transform: stage >= 5 ? 'scale(0.42) translateY(-18vh)' : 'scale(1)',
          transition: 'transform 1.1s cubic-bezier(.6,.0,.2,1)',
        }}>
          {/* viewfinder brackets */}
          {[
            { top: 0, left: 0 }, { top: 0, right: 0 },
            { bottom: 0, right: 0 }, { bottom: 0, left: 0 },
          ].map((c, i) => {
            const isTop = c.top !== undefined;
            const isLeft = c.left !== undefined;
            return (
              <div key={i} style={{
                position: 'absolute', ...c, width: 38, height: 38,
                borderTop: isTop ? '1.5px solid var(--accent)' : 'none',
                borderBottom: !isTop ? '1.5px solid var(--accent)' : 'none',
                borderLeft: isLeft ? '1.5px solid var(--accent)' : 'none',
                borderRight: !isLeft ? '1.5px solid var(--accent)' : 'none',
                opacity: stage >= 1 && stage < 5 ? 1 : 0,
                transform: `translate(${isLeft ? '-6px' : '6px'}, ${isTop ? '-6px' : '6px'}) ` +
                           (stage >= 1 ? 'translate(0,0)' : ''),
                transition: `opacity .4s ${0.05 + i * 0.06}s, transform .5s ${0.05 + i * 0.06}s cubic-bezier(.2,.7,.2,1)`,
              }} />
            );
          })}

          {/* WIRE: logo as outline only via filter trick — drop shadow + invert thin */}
          <div role="img" aria-label="Kiran Banda" style={{
            position: 'absolute', inset: 40,
            mask: 'url("proto/logo.png") center / contain no-repeat',
            WebkitMask: 'url("proto/logo.png") center / contain no-repeat',
            background: 'repeating-linear-gradient(45deg,var(--accent) 0 1.5px,transparent 1.5px 4px)', opacity: stage === 1 ? 1 : 0,
            transition: 'opacity .35s ease',
          }} />

          {/* SOLID: filled mid-grey silhouette */}
          <div role="img" aria-label="Kiran Banda" style={{
            position: 'absolute', inset: 40,
            mask: 'url("proto/logo.png") center / contain no-repeat',
            WebkitMask: 'url("proto/logo.png") center / contain no-repeat',
            background: 'color-mix(in srgb,var(--ink) 45%,var(--bg))', opacity: stage === 2 ? 1 : 0,
            transition: 'opacity .35s ease',
          }} />

          {/* TEXTURE: palette accent, no light yet */}
          <div role="img" aria-label="Kiran Banda" style={{
            position: 'absolute', inset: 40,
            mask: 'url("proto/logo.png") center / contain no-repeat',
            WebkitMask: 'url("proto/logo.png") center / contain no-repeat',
            background: 'var(--accent)', opacity: stage === 3 ? 1 : 0,
            transition: 'opacity .35s ease',
          }} />
          {stage === 3 && (
            <div style={{
              position: 'absolute', inset: 40, pointerEvents: 'none',
              background: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px)',
              mixBlendMode: 'multiply',
            }} />
          )}

          {/* LIT: palette ink + soft glow */}
          <div role="img" aria-label="Kiran Banda" style={{
            position: 'absolute', inset: 40,
            mask: 'url("proto/logo.png") center / contain no-repeat',
            WebkitMask: 'url("proto/logo.png") center / contain no-repeat',
            background: 'var(--ink)', opacity: stage >= 4 ? 1 : 0,
            transition: 'opacity .35s ease',
          }} />
        </div>

        {/* stage label + progress bar */}
        <div className="intro-progress-labels" style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 13, letterSpacing: 3,
          textTransform: 'uppercase', color: 'color-mix(in srgb,var(--ink) 70%,transparent)',
          opacity: stage >= 1 && stage < 5 ? 1 : 0, transition: 'opacity .4s',
          display: 'flex', alignItems: 'center', gap: 22, minWidth: 520, justifyContent: 'space-between',
        }}>
          <span style={{ color: 'color-mix(in srgb,var(--ink) 40%,transparent)' }}>render</span>
          <div className="intro-stages" style={{ display: 'flex', gap: 12, fontSize: 12 }}>
            {['wire', 'solid', 'texture', 'lit'].map((s, i) => (
              <span key={s} style={{ color: stage === i + 1 ? 'var(--accent)' : stage > i + 1 ? 'color-mix(in srgb,var(--ink) 70%,transparent)' : 'color-mix(in srgb,var(--ink) 25%,transparent)' }}>
                {String(i + 1).padStart(2, '0')} · {s}
              </span>
            ))}
          </div>
          <span style={{ color: 'var(--accent)', minWidth: 40, textAlign: 'right' }}>
            {stage <= 0 ? '00%' : stage === 1 ? '25%' : stage === 2 ? '50%' : stage === 3 ? '75%' : '100%'}
          </span>
        </div>

        {/* under-progress bar */}
        <div className="intro-progress-track" style={{
          width: 520, height: 1, background: 'color-mix(in srgb,var(--ink) 12%,transparent)', position: 'relative',
          opacity: stage >= 1 && stage < 5 ? 1 : 0, transition: 'opacity .4s', marginTop: -22,
        }}>
          <div style={{
            position: 'absolute', left: 0, top: -0.5, height: 2,
            background: 'var(--accent)',
            width: `${stage <= 0 ? 0 : Math.min(100, stage * 25)}%`,
            transition: 'width .8s cubic-bezier(.2,.7,.2,1)',
            boxShadow: '0 0 12px color-mix(in srgb,var(--accent) 60%,transparent)',
          }} />
        </div>

        {/* final wordmark line — appears at LIT */}
        <div className="intro-wordmark" style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 13, letterSpacing: 4,
          textTransform: 'uppercase', color: 'color-mix(in srgb,var(--ink) 60%,transparent)',
          opacity: stage >= 4 && stage < 5 ? 1 : 0, transition: 'opacity .6s',
          marginTop: -4,
        }}>
          <span style={{ color: 'var(--accent)' }}>kiran banda</span> &nbsp;·&nbsp; environment artist
        </div>
      </div>

      {/* corner timestamps */}
      <div style={{
        position: 'absolute', top: 24, left: 28,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: 'color-mix(in srgb,var(--ink) 45%,transparent)',
        letterSpacing: 2, textTransform: 'uppercase', lineHeight: 1.7,
        opacity: stage >= 1 && stage < 5 ? 1 : 0, transition: 'opacity .4s',
      }}>
        ◉ booting<br/>
        scene · 01<br/>
        {new Date().getFullYear()}
      </div>
      <div style={{
        position: 'absolute', top: 24, right: 28, textAlign: 'right',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: 'color-mix(in srgb,var(--ink) 45%,transparent)',
        letterSpacing: 2, textTransform: 'uppercase', lineHeight: 1.7,
        opacity: stage >= 1 && stage < 5 ? 1 : 0, transition: 'opacity .4s',
      }}>
        v / 2.6.0<br/>
        ue · 5.4<br/>
        4k · 24fps
      </div>

      <style>{`
        @media(max-width:680px){
 .intro-progress-labels{width:calc(100% - 40px);min-width:0!important;gap:10px!important;font-size:10px!important;letter-spacing:1px!important;flex-wrap:wrap}
 .intro-progress-labels>span:first-child{order:0}.intro-progress-labels>span:last-child{order:1;margin-left:auto}.intro-stages{order:2;width:100%;justify-content:space-between;gap:6px!important;font-size:9px!important}
 .intro-progress-track{width:calc(100% - 40px)!important;margin-top:-18px!important}
 .intro-wordmark{max-width:calc(100% - 40px);font-size:10px!important;letter-spacing:1.5px!important;text-align:center;line-height:1.8}
 }
 @keyframes scanSweep { 0% { background-position: 0 -100%; } 100% { background-position: 0 200%; } }
      `}</style>
    </div>
  );
}

window.Intro = Intro;
