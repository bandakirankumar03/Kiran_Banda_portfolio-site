// proto/intro.jsx — entrance: 4-stage logo build (wireframe → solid → texture → lit).
// On done, fades out to reveal the site behind.

function Intro({ onEnter }) {
  // stage indices:
  //  0 = pre (black)
  //  1 = wireframe (logo line-art, scanlines, grid)
  //  2 = solid (filled silhouette in mid-grey)
  //  3 = texture (warm albedo + grain)
  //  4 = lit (gold accent + soft halo)
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
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#0b0b0c',
      opacity: stage >= 6 ? 0 : 1, transition: 'opacity .8s ease',
      pointerEvents: stage >= 6 ? 'none' : 'auto',
      overflow: 'hidden', cursor: 'none',
    }}>
      {/* Subtle technical grid bg */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(217,162,74,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(217,162,74,0.06) 1px, transparent 1px)
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
          background: 'linear-gradient(180deg, transparent 0%, rgba(217,162,74,0.18) 50%, transparent 100%)',
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
          position: 'relative', width: 480, height: 280,
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
                borderTop: isTop ? '1.5px solid #C1663B' : 'none',
                borderBottom: !isTop ? '1.5px solid #C1663B' : 'none',
                borderLeft: isLeft ? '1.5px solid #C1663B' : 'none',
                borderRight: !isLeft ? '1.5px solid #C1663B' : 'none',
                opacity: stage >= 1 && stage < 5 ? 1 : 0,
                transform: `translate(${isLeft ? '-6px' : '6px'}, ${isTop ? '-6px' : '6px'}) ` +
                           (stage >= 1 ? 'translate(0,0)' : ''),
                transition: `opacity .4s ${0.05 + i * 0.06}s, transform .5s ${0.05 + i * 0.06}s cubic-bezier(.2,.7,.2,1)`,
              }} />
            );
          })}

          {/* WIRE: logo as outline only via filter trick — drop shadow + invert thin */}
          <img src="proto/logo.png" alt="" style={{
            position: 'absolute', inset: 40, width: 'calc(100% - 80px)', height: 'calc(100% - 80px)',
            objectFit: 'contain',
            opacity: stage === 1 ? 1 : 0,
            filter: 'invert(45%) sepia(48%) saturate(980%) hue-rotate(340deg) brightness(0.98) drop-shadow(0 0 0 #C1663B)',
            mixBlendMode: 'screen',
            // emulate "wireframe" look: high-contrast edges via outline trick + dotted overlay
            maskImage: 'repeating-linear-gradient(45deg, black 0 1.5px, transparent 1.5px 4px)',
            WebkitMaskImage: 'repeating-linear-gradient(45deg, black 0 1.5px, transparent 1.5px 4px)',
            transition: 'opacity .35s ease',
          }} />

          {/* SOLID: filled mid-grey silhouette */}
          <img src="proto/logo.png" alt="" style={{
            position: 'absolute', inset: 40, width: 'calc(100% - 80px)', height: 'calc(100% - 80px)',
            objectFit: 'contain',
            opacity: stage === 2 ? 1 : 0,
            filter: 'invert(48%) sepia(8%) saturate(50%) brightness(0.85)',
            transition: 'opacity .35s ease',
          }} />

          {/* TEXTURE: warm albedo, no light yet */}
          <img src="proto/logo.png" alt="" style={{
            position: 'absolute', inset: 40, width: 'calc(100% - 80px)', height: 'calc(100% - 80px)',
            objectFit: 'contain',
            opacity: stage === 3 ? 1 : 0,
            filter: 'invert(70%) sepia(35%) saturate(220%) hue-rotate(355deg) brightness(0.88)',
            transition: 'opacity .35s ease',
          }} />
          {stage === 3 && (
            <div style={{
              position: 'absolute', inset: 40, pointerEvents: 'none',
              background: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px)',
              mixBlendMode: 'multiply',
            }} />
          )}

          {/* LIT: gold accent + soft glow */}
          <img src="proto/logo.png" alt="Kiran Banda" style={{
            position: 'absolute', inset: 40, width: 'calc(100% - 80px)', height: 'calc(100% - 80px)',
            objectFit: 'contain',
            opacity: stage >= 4 ? 1 : 0,
            filter: 'invert(80%) sepia(40%) saturate(440%) hue-rotate(0deg) brightness(1.12) drop-shadow(0 0 24px rgba(217,162,74,0.4))',
            transition: 'opacity .5s ease',
          }} />
        </div>

        {/* stage label + progress bar */}
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 13, letterSpacing: 3,
          textTransform: 'uppercase', color: 'rgba(242,237,227,0.7)',
          opacity: stage >= 1 && stage < 5 ? 1 : 0, transition: 'opacity .4s',
          display: 'flex', alignItems: 'center', gap: 22, minWidth: 520, justifyContent: 'space-between',
        }}>
          <span style={{ color: 'rgba(242,237,227,0.4)' }}>render</span>
          <div style={{ display: 'flex', gap: 12, fontSize: 10 }}>
            {['wire', 'solid', 'texture', 'lit'].map((s, i) => (
              <span key={s} style={{ color: stage === i + 1 ? '#C1663B' : stage > i + 1 ? 'rgba(242,237,227,0.7)' : 'rgba(242,237,227,0.25)' }}>
                {String(i + 1).padStart(2, '0')} · {s}
              </span>
            ))}
          </div>
          <span style={{ color: '#C1663B', minWidth: 40, textAlign: 'right' }}>
            {stage <= 0 ? '00%' : stage === 1 ? '25%' : stage === 2 ? '50%' : stage === 3 ? '75%' : '100%'}
          </span>
        </div>

        {/* under-progress bar */}
        <div style={{
          width: 520, height: 1, background: 'rgba(242,237,227,0.12)', position: 'relative',
          opacity: stage >= 1 && stage < 5 ? 1 : 0, transition: 'opacity .4s', marginTop: -22,
        }}>
          <div style={{
            position: 'absolute', left: 0, top: -0.5, height: 2,
            background: '#C1663B',
            width: `${stage <= 0 ? 0 : Math.min(100, stage * 25)}%`,
            transition: 'width .8s cubic-bezier(.2,.7,.2,1)',
            boxShadow: '0 0 12px rgba(217,162,74,0.6)',
          }} />
        </div>

        {/* final wordmark line — appears at LIT */}
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 13, letterSpacing: 4,
          textTransform: 'uppercase', color: 'rgba(242,237,227,0.6)',
          opacity: stage >= 4 && stage < 5 ? 1 : 0, transition: 'opacity .6s',
          marginTop: -4,
        }}>
          <span style={{ color: '#C1663B' }}>kiran banda</span> &nbsp;·&nbsp; environment artist
        </div>
      </div>

      {/* skip hint */}
      <div style={{
        position: 'absolute', bottom: 28, right: 32,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(242,237,227,0.4)',
        letterSpacing: 2, textTransform: 'uppercase',
        opacity: stage >= 1 && stage < 5 ? 1 : 0, transition: 'opacity .4s',
      }}>
        click or press any key to skip
      </div>

      {/* corner timestamps */}
      <div style={{
        position: 'absolute', top: 24, left: 28,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(242,237,227,0.45)',
        letterSpacing: 2, textTransform: 'uppercase', lineHeight: 1.7,
        opacity: stage >= 1 && stage < 5 ? 1 : 0, transition: 'opacity .4s',
      }}>
        ◉ booting<br/>
        scene · 01<br/>
        {new Date().getFullYear()}
      </div>
      <div style={{
        position: 'absolute', top: 24, right: 28, textAlign: 'right',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(242,237,227,0.45)',
        letterSpacing: 2, textTransform: 'uppercase', lineHeight: 1.7,
        opacity: stage >= 1 && stage < 5 ? 1 : 0, transition: 'opacity .4s',
      }}>
        v / 2.6.0<br/>
        ue · 5.4<br/>
        4k · 24fps
      </div>

      <style>{`
        @keyframes scanSweep { 0% { background-position: 0 -100%; } 100% { background-position: 0 200%; } }
      `}</style>
    </div>
  );
}

window.Intro = Intro;
