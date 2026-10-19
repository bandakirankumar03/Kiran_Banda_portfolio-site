// proto/intro.jsx — entrance: 4-stage logo build (wireframe → solid → texture → lit).
// On done, fades out to reveal the site behind.

function Intro({ onEnter }) {
  // stage indices:
  //  0 = pre (black)
  //  1 = wireframe (logo line-art, scanlines, grid)
  //  2 = solid (filled silhouette in mid-grey)
  //  3 = texture (lavender albedo + grain)
  //  4 = lit (white accent + soft halo)
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
      background: '#0b0b0c',
      opacity: stage >= 6 ? 0 : 1, transition: 'opacity .8s ease',
      pointerEvents: stage >= 6 ? 'none' : 'auto',
      overflow: 'hidden', cursor: 'none',
    }}>
      {/* Subtle technical grid bg */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(180,170,255,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(180,170,255,0.06) 1px, transparent 1px)
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
          background: 'linear-gradient(180deg, transparent 0%, rgba(180,170,255,0.18) 50%, transparent 100%)',
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
                borderTop: isTop ? '1.5px solid var(--lab-primary,#F32E35)' : 'none',
                borderBottom: !isTop ? '1.5px solid var(--lab-primary,#F32E35)' : 'none',
                borderLeft: isLeft ? '1.5px solid var(--lab-primary,#F32E35)' : 'none',
                borderRight: !isLeft ? '1.5px solid var(--lab-primary,#F32E35)' : 'none',
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
            filter: 'brightness(0) invert(1)',
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

          {/* TEXTURE: lavender albedo, no light yet */}
          <img src="proto/logo.png" alt="" style={{
            position: 'absolute', inset: 40, width: 'calc(100% - 80px)', height: 'calc(100% - 80px)',
            objectFit: 'contain',
            opacity: stage === 3 ? 1 : 0,
            filter: 'brightness(0) saturate(100%) invert(76%) sepia(18%) saturate(900%) hue-rotate(202deg)',
            transition: 'opacity .35s ease',
          }} />
          {stage === 3 && (
            <div style={{
              position: 'absolute', inset: 40, pointerEvents: 'none',
              background: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px)',
              mixBlendMode: 'multiply',
            }} />
          )}

          {/* LIT: white accent + soft glow */}
          <img src="proto/logo.png" alt="Kiran Banda" style={{
            position: 'absolute', inset: 40, width: 'calc(100% - 80px)', height: 'calc(100% - 80px)',
            objectFit: 'contain',
            opacity: stage >= 4 ? 1 : 0,
            filter: 'brightness(0) invert(1) drop-shadow(0 0 20px rgba(180,170,255,0.25))',
            transition: 'opacity .5s ease',
          }} />
        </div>

        {/* under-progress bar */}
        <div className="intro-progress-track" style={{
          width: 520, height: 1, background: 'rgba(242,237,227,0.12)', position: 'relative',
          opacity: stage >= 1 && stage < 5 ? 1 : 0, transition: 'opacity .4s', marginTop: -22,
        }}>
          <div style={{
            position: 'absolute', left: 0, top: -0.5, height: 2,
            background: 'var(--lab-primary,#F32E35)',
            width: `${stage <= 0 ? 0 : Math.min(100, stage * 25)}%`,
            transition: 'width .8s cubic-bezier(.2,.7,.2,1)',
            boxShadow: '0 0 12px rgba(180,170,255,0.6)',
          }} />
        </div>

        {/* final wordmark line — appears at LIT */}
        <div className="intro-wordmark" style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 13, letterSpacing: 4,
          textTransform: 'uppercase', color: 'rgba(242,237,227,0.6)',
          opacity: stage >= 4 && stage < 5 ? 1 : 0, transition: 'opacity .6s',
          marginTop: -4,
        }}>
          <span style={{ color: 'var(--lab-primary,#F32E35)' }}>kiran banda</span> &nbsp;·&nbsp; Unreal &amp; VFX artist
        </div>
      </div>

      {/* skip hint */}
      <div style={{
        position: 'absolute', bottom: 28, right: 32,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: 'rgba(242,237,227,0.4)',
        letterSpacing: 2, textTransform: 'uppercase',
        opacity: stage >= 1 && stage < 5 ? 1 : 0, transition: 'opacity .4s',
      }}>
        Tap to skip
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
