const AI_WORKFLOW_STUDIES=[
 {name:'Quiet orbit',position:'Centre',line:<>Faster flow,<br/>more room for craft.</>,note:'The headline stays still while five tools move slowly around it.'},
 {name:'Open studio',position:'Left',line:<>More time<br/>for the craft.</>,note:'A clear left-aligned statement, balanced by an open constellation on the right.'},
 {name:'Creative space',position:'Right',line:<>Explore faster.<br/>Create with intention.</>,note:'The tools lead on the left; the statement sits quietly to the right.'},
 {name:'Understated',position:'Centre',line:<>Less friction. More making.</>,note:'One compact headline with a gently floating line of tools beneath it.'},
 {name:'A little momentum',position:'Left',line:<>Ideas move faster.<br/>Craft stays personal.</>,note:'An editorial headline above a loose, softly drifting wave of tools.'},
 {name:'Room to make',position:'Right',line:<>Faster exploration.<br/>Room for the details.</>,note:'A tall, slow ellipse and a larger right-hand statement create a little more presence.'}
];

function AIWorkflowStudy({design}){
 const item=AI_WORKFLOW_STUDIES[design-1];
 const copy=<h2 className="ai-study-type"><strong>AI-assisted.</strong><em>{item.line}</em></h2>;
 return <section className={'ai-study ai-study-'+design} aria-label={item.name}>
  {design===1?<OrbitalToolkit tools={AI_TOOL_LOGOS} ai variant={5} center={copy}/>:<>{copy}<OrbitalToolkit tools={AI_TOOL_LOGOS} ai variant={design===4||design===5?1:5}/></>}
 </section>;
}

function AIWorkflowOptionsPage(){
 const [design,setDesign]=React.useState(()=>Math.max(1,Math.min(6,Number(new URLSearchParams(location.search).get('design'))||1)));
 const select=n=>{setDesign(n);const u=new URL(location.href);u.searchParams.set('design',n);history.replaceState(null,'',u)};
 const current=AI_WORKFLOW_STUDIES[design-1];
 return <main className="tm-lab ai-workflow-lab">
  <div className="tm-options-head"><span>AI workflow · six studies</span><a href={'ai-website-preview.html?design='+design+'#/about'}>See in full website ↗</a></div>
  <nav className="tm-choices" aria-label="AI workflow variations">{AI_WORKFLOW_STUDIES.map((item,i)=><button key={item.name} aria-pressed={design===i+1} onClick={()=>select(i+1)}><span>{String(i+1).padStart(2,'0')}</span>{item.name}<small>{item.position}</small></button>)}</nav>
  <p className="tm-description">{current.note}</p>
  <div key={design} className="ai-study-preview"><AIWorkflowStudy design={design}/></div>
 </main>;
}

function AIWorkflowInContext(){
 const [design,setDesign]=React.useState(()=>Math.max(1,Math.min(6,Number(new URLSearchParams(location.search).get('design'))||3)));
 const select=n=>{setDesign(n);const u=new URL(location.href);u.searchParams.set('design',n);history.replaceState(null,'',u)};
 return <div className="ai-context-preview">
  <nav className="ai-context-choices" aria-label="AI layout preview options">{AI_WORKFLOW_STUDIES.map((item,i)=><button type="button" key={item.name} onClick={()=>select(i+1)} aria-pressed={design===i+1}><span>{String(i+1).padStart(2,'0')}</span><span>{item.name}</span></button>)}</nav>
  <div className="ai-study-preview" key={design}><AIWorkflowStudy design={design}/></div>
 </div>;
}
