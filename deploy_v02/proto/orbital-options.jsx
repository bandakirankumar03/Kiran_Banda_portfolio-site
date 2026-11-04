const ORBITAL_CHOICES=[
 {name:'Studio circle',note:'The original orbit. One quiet circle, with Unreal Engine at its centre.'},
 {name:'Twin rings',note:'Two balanced rings turn in opposite directions, each at its own pace.'},
 {name:'Wide orbit',note:'A flatter, wider sweep. The logos stay upright as they move around the centre.'},
 {name:'Tilted plane',note:'A little more depth: a tilted orbit brings the near side forward.'},
 {name:'Open constellation',note:'More room between the logos, with a slow rotation and a soft floating drift.'}
];
function OrbitalOptionsPage(){
 const [choice,setChoice]=React.useState(()=>Math.max(1,Math.min(5,Number(new URLSearchParams(location.search).get('orbit'))||1)));
 const choose=n=>{setChoice(n);const u=new URL(location.href);u.searchParams.set('orbit',n);history.replaceState(null,'',u)};
 return <div className="tm-lab orbit-options">
  <div className="tm-options-head"><span>Orbital studies</span><a href="index.html#/about">Back to About ↗</a></div>
  <nav className="tm-choices" aria-label="Orbital variations">{ORBITAL_CHOICES.map((item,i)=><button key={item.name} aria-pressed={choice===i+1} onClick={()=>choose(i+1)}><span>{String(i+1).padStart(2,'0')}</span>{item.name}</button>)}</nav>
  <p className="tm-description">{ORBITAL_CHOICES[choice-1].note}</p>
  <section className="tm-concept" key={choice} aria-labelledby="orbit-preview-title">
   <h1 id="orbit-preview-title">How I <em>build.</em></h1>
   <div className="tm-main-row"><div className="tm-focus"><small>MY FOCUS</small><ul><li>Environment art & scene building</li><li>Photogrammetry & materials</li><li>Real-time lighting</li><li>Virtual production & compositing</li></ul></div><OrbitalToolkit tools={TOOL_LOGOS} variant={choice}/></div>
   <div className="tm-ai-row"><div><h2 className="tm-ai-heading"><strong>AI-assisted.</strong><em>Faster flow,<br/>more room for craft.</em></h2></div><OrbitalToolkit tools={AI_TOOL_LOGOS} ai variant={5}/></div>
  </section>
 </div>;
}
