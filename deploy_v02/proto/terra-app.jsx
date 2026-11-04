const TERRA_SCENE='media/projects/monsoon-station/web/highresscreenshot00008.webp';
function TerraMotion({routeKey}) {
  React.useEffect(()=>{
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let raf=0;
    const update=()=>{
      raf=0;
      const h=innerHeight;
      document.querySelectorAll('[data-drift]').forEach(el=>{
        const r=el.parentElement.getBoundingClientRect();
        const progress=Math.max(-1,Math.min(1,(h/2-r.top-r.height/2)/h));
        el.style.setProperty('--drift',reduced.matches?'0px':`${progress*Number(el.dataset.drift)}px`);
      });
      const hero=document.querySelector('.terra-hero');
      if(hero){const r=hero.getBoundingClientRect();const p=Math.max(0,Math.min(1,-r.top/Math.max(1,r.height-h)));hero.style.setProperty('--journey',reduced.matches?0:p);}
      document.documentElement.style.setProperty('--forest-shift',reduced.matches?'0px':`${Math.sin(scrollY/1800)*65}px`);
      document.querySelectorAll('.forest-section').forEach(el=>{
        const r=el.getBoundingClientRect();const p=Math.max(0,Math.min(1,(h-r.top)/(h*.65)));
        el.style.opacity=reduced.matches?1:.35+p*.65;el.style.translate=reduced.matches?'none':`0 ${(1-p)*36}px`;
      });
      document.querySelectorAll('.original-terra [data-card]').forEach(el=>{
        const r=el.getBoundingClientRect();const d=Math.max(-1,Math.min(1,(r.left+r.width/2-innerWidth/2)/innerWidth));
        el.style.rotate=reduced.matches?'none':`${d*4}deg`;el.style.translate=reduced.matches?'none':`0 ${Math.abs(d)*24}px`;
      });
      const total=document.documentElement.scrollHeight-h;
      document.documentElement.style.setProperty('--read',`${total>0?scrollY/total*100:0}%`);
    };
    const schedule=()=>{if(!raf)raf=requestAnimationFrame(update);};
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('terra-visible');io.unobserve(e.target);}}),{threshold:.09});
    document.querySelectorAll('.terra-reveal,.forest-section').forEach(el=>io.observe(el));
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);reduced.addEventListener('change',schedule);update();
    return()=>{io.disconnect();cancelAnimationFrame(raf);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule);};
  },[routeKey]);
  return null;
}
function TerraNav({route}) {
  return <header className="terra-nav"><a className="terra-wordmark" href="#/">Kiran Banda<span>Environment artist</span></a><nav aria-label="Main navigation">{['work','about','contact'].map(p=><a key={p} aria-current={route.name===p?'page':undefined} href={'#/'+p}>{p}</a>)}</nav><span className="terra-edition">TERRA / CONCEPT 02</span></header>;
}
function ScrollFavourites(){
  const ref=React.useRef(null);
  const [active,setActive]=React.useState(0),[paused,setPaused]=React.useState(false);
  React.useEffect(()=>{
    let frame=0;
    const update=()=>{frame=0;if(paused)return;const r=ref.current.getBoundingClientRect();const p=Math.max(0,Math.min(.999,-r.top/Math.max(1,r.height-innerHeight)));setActive(Math.floor(p*HOME_HIGHLIGHTS.length));};
    const tick=()=>{if(!frame)frame=requestAnimationFrame(update);};
    window.addEventListener('scroll',tick,{passive:true});window.addEventListener('resize',tick);update();
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',tick);window.removeEventListener('resize',tick);};
  },[paused]);
  return <section className="scroll-favourites" ref={ref} aria-label="A few favourites"><div className="favourites-pin"><div className="favourites-heading"><h2>A few <em>favourites.</em></h2><span>Scroll to explore ↓</span></div><div className="favourites-stage">{HOME_HIGHLIGHTS.map((item,i)=><article key={item.slug} className={'favourite-slide '+(i===active?'active':'')} aria-hidden={i!==active} inert={i!==active?'':undefined}><div className="favourite-copy"><span>{item.project} / {item.topic}</span><h3>{item.title}</h3><p>{item.description}</p><a href={'#/case/'+item.slug} tabIndex={i===active?0:-1}>Explore the project ↗</a></div><button className="favourite-photo" onClick={()=>setPaused(v=>!v)} tabIndex={i===active?0:-1} aria-pressed={paused} aria-label={paused?'Resume scroll highlights':'Hold this highlight'}><img src={'media/projects/'+item.image} alt={item.alt}/></button></article>)}</div><div className="favourites-progress" aria-hidden="true">{HOME_HIGHLIGHTS.map((x,i)=><span key={x.slug} className={i===active?'active':''}/>)}</div></div></section>;
}
function TerrainBackdrop(){
 const canvas=React.useRef(null);
 React.useEffect(()=>{
  const c=canvas.current, gl=c.getContext('webgl',{alpha:false,antialias:true,powerPreference:'low-power'});
  if(!gl)return;
  const vertex=`attribute vec3 position;attribute vec3 normal;uniform float aspect;uniform float journey;varying vec3 n;varying float depth;varying float height;
  void main(){vec3 p=position;float travel=journey*10.;p.z+=travel;p.x-=sin(journey*.65)*1.8; p.y-=3.2;float angle=-.12;float y=p.y*cos(angle)-p.z*sin(angle);float z=p.y*sin(angle)+p.z*cos(angle);p.y=y;p.z=z;depth=-z;height=position.y;n=normal;float near=.1;float far=100.;gl_Position=vec4(p.x*1.35/aspect,p.y*1.35,(-(far+near)/(far-near))*p.z-2.*far*near/(far-near),-p.z);}`;
  const fragment=`precision mediump float;varying vec3 n;varying float depth;varying float height;void main(){vec3 base=vec3(.055,.095,.075);float light=max(0.,dot(normalize(n),normalize(vec3(-.6,1.,.4))));vec3 rock=mix(vec3(.10,.16,.12),vec3(.32,.38,.27),light);rock+=max(height,0.)*.006;float fog=1.-exp(-depth*.045);gl_FragColor=vec4(mix(rock,base,fog),1.);}`;
  function shader(type,source){const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh));return sh;}
  const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment),program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.useProgram(program);
  const vertices=[],normals=[];
  const height=(x,z)=>{const edge=Math.pow(Math.min(1,Math.abs(x)/14),1.4);return -2+edge*(4+2.5*Math.sin(x*.27+z*.16)+1.4*Math.cos(z*.38-x*.2))+Math.sin(x*.73+z*.41)*.3;};
  const point=(x,z)=>[x,height(x,z),z];
  function triangle(a,b,c){const u=b.map((v,i)=>v-a[i]),v=c.map((v,i)=>v-a[i]);let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];if(n[1]<0)n=n.map(v=>-v);for(const p of [a,b,c]){vertices.push(...p);normals.push(...n);}}
  for(let z=-100;z<14;z+=1.5)for(let x=-48;x<48;x+=1.5){const a=point(x,z),b=point(x+1.5,z),d=point(x,z+1.5),e=point(x+1.5,z+1.5);triangle(a,b,d);triangle(b,e,d);}
  // Upright stone remnants give the valley a tangible foreground scale.
  function stone(x,z,w,h){const y=height(x,z);const a=[x-w,y,z],b=[x+w,y,z],d=[x-w*.7,y+h,z],e=[x+w*.6,y+h,z];triangle(a,b,d);triangle(b,e,d);triangle(b,[x+w,y,z-w],e);triangle(e,[x+w,y,z-w],[x+w*.6,y+h,z-w]);}
  for(const [x,z,h] of [[-9,-9,5],[10,-18,7],[-12,-34,6],[15,-46,8],[-8,-61,4]])stone(x,z,.8,h);
  const buffers=[];for(const [name,data] of [['position',vertices],['normal',normals]]){const b=gl.createBuffer();buffers.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);}
  const aspect=gl.getUniformLocation(program,'aspect'),journey=gl.getUniformLocation(program,'journey');gl.enable(gl.DEPTH_TEST);gl.clearColor(.055,.095,.075,1);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
  const draw=()=>{frame=0;const ratio=Math.min(devicePixelRatio,1.35);const w=Math.round(innerWidth*ratio),h=Math.round(innerHeight*ratio);if(c.width!==w||c.height!==h){c.width=w;c.height=h;gl.viewport(0,0,w,h);}gl.uniform1f(aspect,w/h);gl.uniform1f(journey,reduced.matches?0:Math.min(2.5,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*2.5));gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,vertices.length/3);};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(draw);};window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);reduced.addEventListener('change',schedule);draw();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule);buffers.forEach(b=>gl.deleteBuffer(b));gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);};
 },[]);
 return <canvas ref={canvas} className="terrain-canvas" aria-hidden="true"/>;
}

function TerraHome(){
 const {go}=React.useContext(RouteCtx);
 return <main className="home-page original-terra"><ReelHero/><div className="forest-content"><div className="forest-backdrop" aria-hidden="true"><TerrainBackdrop/></div><div className="forest-section"><HomeIntro/></div><div className="forest-section"><OngoingSection/></div><ScrollFavourites/><div className="forest-section"><ProjectCarousel onOpen={slug=>go({name:'case',slug})}/></div><div className="forest-section"><InterestsSection/></div><div className="forest-section"><ContactTeaser go={go}/></div><Footer/></div></main>;
}
function TerraApp(){
  const parse=()=>{const parts=location.hash.replace(/^#\/?/,'').split('/');return parts[0]==='case'?{name:'case',slug:parts[1]}:{name:['work','about','contact'].includes(parts[0])?parts[0]:'home'};};
  const [route,setRoute]=React.useState(parse);
  const [label,setLabel]=React.useState(''),[mode,setMode]=React.useState('default');
  const go=React.useCallback(r=>{location.hash=r.name==='home'?'/':r.name==='case'?'/case/'+r.slug:'/'+r.name;},[]);
  window.__go__=go;
  React.useEffect(()=>{const change=()=>{setRoute(parse());window.scrollTo({top:0,behavior:'instant'});};window.addEventListener('hashchange',change);return()=>window.removeEventListener('hashchange',change);},[]);
  const key=route.name+':'+(route.slug||'');
  let page=route.name==='home'?<TerraHome/>:route.name==='about'?<AboutPage/>:route.name==='work'?<WorkPage/>:route.name==='contact'?<ContactPage/>:<CasePage key={route.slug} slug={route.slug}/>;
  return <RouteCtx.Provider value={{route,go}}><CursorCtx.Provider value={{label,mode,setLabel,setMode}}><Nav/><div className={'terra-page site-page site-page-'+route.name} key={key}>{page}</div><TerraMotion routeKey={key}/><CaseImageInteraction routeKey={key}/><div className="terra-progress" aria-hidden="true"/><a className="terra-preview-tag" href="index.html">Preview 03 <span>↗ Current version</span></a></CursorCtx.Provider></RouteCtx.Provider>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<TerraApp/>);
