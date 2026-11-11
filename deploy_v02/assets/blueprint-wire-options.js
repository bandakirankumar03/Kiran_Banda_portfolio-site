/* Blueprint-inspired connectors, isolated from the approved portfolio. */
(()=>{
 'use strict';
 const NS='http://www.w3.org/2000/svg';
 const studies=[
  ['Quiet connections','Fine gold curves and small pins. A quiet detail between the existing content.'],
  ['Live signal','A soft signal travels along the wires. Connections draw in as you scroll.'],
  ['Section flow','One connection runs through the page margin, branching gently into each section.'],
  ['Focus wires','Connections become clearer around the section you hover or focus.'],
  ['Blueprint weave','A fuller network: paired ivory and gold wires, reroute points and moving signals.']
 ];
 let mode=Math.max(1,Math.min(5,Number(new URLSearchParams(location.search).get('wire'))||2));
 let pairs=[],headingNodes=[],lastRoute='',lastSignature='',discoverAt=0,frame=0,lastPaint=0,hovered=null,initialJump=false,jumpDue=0;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const svg=document.createElementNS(NS,'svg');
 svg.classList.add('wire-study-layer');svg.setAttribute('aria-hidden','true');svg.dataset.wireMode=mode;
 document.body.append(svg);
 const controls=document.createElement('aside');controls.className='wire-study-controls';controls.setAttribute('aria-label','Blueprint wire preview options');
 const sketch=i=>{
  const path=i===2?'M5 2 C35 2 8 18 36 18 S70 2 100 14':'M5 16 C35 16 55 3 100 3';
  return `<svg viewBox="0 0 108 22" fill="none" aria-hidden="true"><path d="${path}" stroke="currentColor" stroke-width="1.2" opacity=".65"/>${i===4?'<path d="M5 20 C40 20 58 7 100 7" stroke="currentColor" opacity=".3"/>':''}<circle cx="5" cy="${i===2?2:16}" r="2.5" fill="#090D0B" stroke="currentColor"/><path d="M100 0 105 3 100 6Z" fill="#090D0B" stroke="currentColor"/>${i===1||i===4?'<circle cx="56" cy="9" r="2" fill="currentColor"/>':''}</svg>`;
 };
 controls.innerHTML=`<div class="wire-study-top"><span class="wire-study-title">Blueprint wires · preview only</span><div class="wire-study-utilities"><button type="button" data-wire-toggle aria-pressed="true">Wires on</button><a href="./index.html${location.hash}" data-wire-original>Original site ↗</a><button type="button" data-wire-hide>Hide</button></div></div><div class="wire-study-options" role="group" aria-label="Wire treatments">${studies.map((s,i)=>`<button type="button" class="wire-study-option" data-wire-choice="${i+1}" aria-pressed="${mode===i+1}">${sketch(i)}${String(i+1).padStart(2,'0')} · ${s[0]}</button>`).join('')}</div><p class="wire-study-description"></p>`;
 document.body.append(controls);
 const show=document.createElement('button');show.className='wire-study-show';show.type='button';show.textContent='Wire options';show.hidden=true;document.body.append(show);
 const describe=()=>{controls.querySelector('.wire-study-description').textContent=studies[mode-1][1];svg.dataset.wireMode=mode;controls.querySelectorAll('[data-wire-choice]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.wireChoice)===mode)));};
 describe();
 controls.addEventListener('click',e=>{
  const choice=e.target.closest('[data-wire-choice]');
  if(choice){mode=Number(choice.dataset.wireChoice);const u=new URL(location.href);u.searchParams.set('wire',mode);history.replaceState(null,'',u);describe();discoverAt=0;}
  if(e.target.closest('[data-wire-hide]')){controls.hidden=true;show.hidden=false;}
  const toggle=e.target.closest('[data-wire-toggle]');if(toggle){const on=toggle.getAttribute('aria-pressed')!=='true';toggle.setAttribute('aria-pressed',String(on));toggle.textContent=on?'Wires on':'Wires off';svg.style.display=on?'':'none';}
 });
 show.addEventListener('click',()=>{controls.hidden=false;show.hidden=true;});
 const el=(tag,attrs={})=>{const n=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));return n;};
 const visible=n=>n&&n.getBoundingClientRect().width>5&&n.getBoundingClientRect().height>5;
 const rect=n=>n.getBoundingClientRect();
 const point=(n,side,f=.5)=>{const r=rect(n);return side==='left'?{x:r.left-7,y:r.top+r.height*f}:side==='right'?{x:r.right+7,y:r.top+r.height*f}:side==='top'?{x:r.left+r.width*f,y:r.top-8}:{x:r.left+r.width*f,y:r.bottom+8};};
 function makePair(a,b,as='right',bs='left',af=.5,bf=.5,kind='local'){
  if(!a||!b||a===b)return;
  const group=el('g',{'class':'wire-study-link'}),shadow=el('path',{'class':'wire-study-shadow'}),base=el('path',{'class':'wire-study-base'}),secondary=el('path',{'class':'wire-study-secondary'}),trace=el('path',{'class':'wire-study-trace',pathLength:1}),start=el('circle',{'class':'wire-study-pin',r:3}),end=el('path',{'class':'wire-study-exec'}),signal=el('circle',{'class':'wire-study-signal',r:2.3}),reroute=el('circle',{'class':'wire-study-pin',r:2.5});
  group.append(shadow,secondary,base,trace,start,end,signal,reroute);svg.append(group);
  pairs.push({a,b,as,bs,af,bf,kind,group,base,shadow,secondary,trace,start,end,signal,reroute});
 }
 function discover(){
  pairs=[];svg.replaceChildren();
  const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
  const add=(a,b,...rest)=>makePair(q(a),q(b),...rest);
  // Connections use the gaps of existing layouts; no new cards, labels or spacing.
  add('.favourite-slide.active .favourite-copy','.favourite-slide.active .favourite-photo','right','left',.5,.54);
  add('.ongoing-card:first-child','.ongoing-card:last-child','right','left',.53,.53);
  add('.discovery-visual','.discovery-index','right','left',.45,.39);
  add('.portrait-scene-copy','.portrait-person','right','left',.7,.58);
  add('.portrait-person','.portrait-side-note','right','left',.73,.38);
  add('.quiet-practice','.quiet-tools','right','left',.48,.5);
  add('.about-split-lenses>.practice-section:first-child','.about-split-lenses>.practice-section:last-child','right','left',.55,.55);
  add('.ws-focus-link[data-active="true"]','.ws-focus-stage','right','left',.5,.18);
  add('.contact-layout>div:first-child','.contact-layout form','right','left',.35,.4);
  add('.rn-prep-photo:nth-child(1) button','.rn-prep-photo:nth-child(2) button','right','left',.42,.48);
  add('.rn-prep-photo:nth-child(2) button','.rn-prep-photo:nth-child(5) button','bottom','top',.5,.4);
  add('.rn-prep-photo:nth-child(3) button','.rn-prep-photo:nth-child(4) button','right','left',.5,.6);
  add('.rn-prep-photo:nth-child(6) button','.rn-prep-photo:nth-child(7) button','right','left',.45,.5);
  // Header-to-image wires are restricted to the clear space above the visuals.
  [
   ['.rn-volume-opening h2','.rn-stage-world-button'],
   ['.rn-preparation-story h2','.rn-prep-photo:first-child button'],
   ['.rn-team-story h2','.rn-team-photo'],
   ['.life-frames h2','.hobby-accordion'],
   ['.about-photo-collection h2','.still-photo-card'],
   ['.home-projects h2','.cinema-track'],
   ['.ongoing-section h2','.ongoing-card'],
   ['.favourites-heading h2','.favourite-slide.active .favourite-photo'],
   ['.ws-header h1','.ws-focus-stage'],
   ['.contact-content [data-main-headline]','.contact-layout form'],
   ['.discovery-section h2','.discovery-media']
  ].forEach(([a,b])=>add(a,b,'bottom','top',.17,.18,'bridge'));
  // Section-to-section flow stays in the margin, away from artwork and copy.
  headingNodes=qa('.site-page h2,.home-intro-title,.ws-header h1,.portrait-scene-copy h1,.pc-story h1,.contact-content h1').filter(visible).filter((n,i,all)=>!all.some(o=>o!==n&&o.contains(n)));
  headingNodes.sort((a,b)=>rect(a).top-rect(b).top);
  for(let i=1;i<headingNodes.length;i++)makePair(headingNodes[i-1],headingNodes[i],'left','left',.45,.45,'spine');
 }
 function curve(a,b,as,bs,bend=0){
  const dx=b.x-a.x,dy=b.y-a.y;
  const vertical=['top','bottom'].includes(as);
  if(vertical){const h=Math.max(25,Math.min(150,Math.abs(dy)*.55));return `M${a.x} ${a.y} C${a.x+bend} ${a.y+h} ${b.x+bend} ${b.y-h} ${b.x} ${b.y}`;}
  const h=Math.max(28,Math.min(200,Math.abs(dx)*.55));return `M${a.x} ${a.y} C${a.x+h} ${a.y+bend} ${b.x-h} ${b.y+bend} ${b.x} ${b.y}`;
 }
 function paint(now){
  const mobile=innerWidth<700,modal=document.querySelector('dialog[open],.full-photo-viewer');
  svg.style.visibility=modal?'hidden':'visible';
  svg.setAttribute('viewBox',`0 0 ${innerWidth} ${innerHeight}`);
  for(let i=0;i<pairs.length;i++){
   const p=pairs[i],spine=p.kind==='spine';
   let shown=visible(p.a)&&visible(p.b)&&((mode===3&&(spine||(headingNodes.length<2&&p.kind==='bridge')))||(mode===5)||(mode!==3&&!spine));
   let as=p.as,bs=p.bs,a=point(p.a,as,p.af),b=point(p.b,bs,p.bf);
   if(Math.max(a.y,b.y)<-100||Math.min(a.y,b.y)>innerHeight+100)shown=false;
   // Stacked phone layouts receive short vertical links in their existing gaps.
   if(mobile&&!spine&&p.kind==='local'){
    const ar=rect(p.a),br=rect(p.b),first=ar.top<br.top?p.a:p.b,second=first===p.a?p.b:p.a;
    if(rect(second).top-rect(first).bottom<20)shown=false;
    else{a=point(first,'bottom',.16);b=point(second,'top',.16);as='bottom';bs='top';}
   }
   if(!shown){p.group.style.display='none';continue;}p.group.style.display='';
   let d;
   if(spine){const lane=mobile?7:Math.max(14,Math.min(28,Math.min(a.x,b.x)-18));a.x=Math.max(lane+10,a.x);b.x=Math.max(lane+10,b.x);const bend=Math.min(55,Math.max(20,(b.y-a.y)/5));d=`M${a.x} ${a.y} C${lane} ${a.y} ${lane} ${a.y+bend} ${lane} ${a.y+bend} L${lane} ${b.y-bend} C${lane} ${b.y} ${lane} ${b.y} ${b.x} ${b.y}`;}
   else d=curve(a,b,as,bs);
   // Drop crossed or overlapping inline connections instead of drawing over a photograph.
   if(!spine&&p.kind==='local'&&as==='right'&&(b.x-a.x<18||Math.abs(b.y-a.y)>460)){p.group.style.display='none';continue;}
   if(p.kind==='bridge'&&b.y-a.y<20){p.group.style.display='none';continue;}
   p.base.setAttribute('d',d);p.shadow.setAttribute('d',d);p.trace.setAttribute('d',d);
   p.secondary.setAttribute('d',d);p.secondary.setAttribute('transform','translate(0 7)');p.secondary.style.display=mode===5?'':'none';
   p.start.setAttribute('cx',a.x);p.start.setAttribute('cy',a.y);
   const endAngle=['top','bottom'].includes(bs)?90:0;
   p.end.setAttribute('d','M-3 -4 3 0 -3 4Z');p.end.setAttribute('transform',`translate(${b.x} ${b.y}) rotate(${endAngle})`);
   let opacity=1;
   if(mode===4){const hot=hovered&&(hovered.contains(p.a)||hovered.contains(p.b)||p.a.contains(hovered)||p.b.contains(hovered));opacity=hot?1:.16;}
   if(mode===5&&spine)opacity=.48;
   p.group.style.opacity=opacity;
   const progress=reduced.matches?1:Math.max(0,Math.min(1,(innerHeight*.93-Math.min(a.y,b.y))/(innerHeight*.4)));
   p.trace.style.display=mode===2?'':'none';p.trace.style.strokeDasharray=`${progress} 1`;
   p.trace.style.opacity='.42';
   const moving=(mode===2||mode===5)&&!reduced.matches;
   p.signal.style.display=moving?'':'none';p.reroute.style.display=mode===5?'':'none';
   if(moving||mode===5){const length=p.base.getTotalLength();if(length){const t=((now/((mode===2?5200:8500)+i*130)+i*.23)%1);const v=p.base.getPointAtLength(length*t);p.signal.setAttribute('cx',v.x);p.signal.setAttribute('cy',v.y);const mid=p.base.getPointAtLength(length*.5);p.reroute.setAttribute('cx',mid.x);p.reroute.setAttribute('cy',mid.y);}}
  }
 }
 function loop(now){
  if(!document.hidden&&now-lastPaint>(reduced.matches?120:32)){
   lastPaint=now;
   if(lastRoute!==location.hash||now-discoverAt>500){const changed=lastRoute!==location.hash;lastRoute=location.hash;discoverAt=now;const signature=location.hash+'|'+(document.querySelector('.site-page')?.className||'')+'|'+document.querySelectorAll('.site-page h2').length+'|'+(document.querySelector('.scroll-favourites')?.dataset.activeProject||'')+'|'+(document.querySelector('.ws-focus-link[data-active="true"]')?.textContent||'');if(signature!==lastSignature){lastSignature=signature;discover();}controls.querySelector('[data-wire-original]').href='./index.html'+location.hash;if(changed)hovered=null;}
   if(!initialJump&&document.querySelector('.rn-preparation-story')){if(!jumpDue)jumpDue=now+1400;if(now>jumpDue){initialJump=true;if(new URLSearchParams(location.search).get('view')==='prep')document.querySelector('.rn-preparation-story').scrollIntoView({block:'start',behavior:'instant'});}}
   paint(now);
  }
  frame=requestAnimationFrame(loop);
 }
 const focusGroup=e=>{if(e.target.closest('.wire-study-controls,.wire-study-show'))return;hovered=e.target.closest('section,.home-intro,.ongoing-section,.home-projects,.ws-focus,.portrait-scene,.about-photo-collection');};
 document.addEventListener('pointerover',focusGroup,{passive:true});document.addEventListener('focusin',focusGroup);
 window.addEventListener('resize',()=>{discoverAt=0;});window.addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
 frame=requestAnimationFrame(loop);
})();
