/* Gabriel Basso Studio — Fase 07 / motion layer.
 * Zero external dependencies. Decorative only, with reduced-motion and manual toggle.
 * FormSubmit POST is never accessed or intercepted by this script.
 */
(()=>{'use strict';
 const root=document.documentElement;
 const body=document.body;
 const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)');
 const finePointer=matchMedia('(pointer: fine) and (hover: hover)');
 const motionButton=document.querySelector('[data-motion-toggle]');
 const storageKey='gb-studio-motion-off';
 let chosenOff=false;
 try{chosenOff=localStorage.getItem(storageKey)==='1'}catch{}
 const allowed=()=>!prefersReduced.matches&&!root.classList.contains('motion-off');
 const updateButton=()=>{
  if(!motionButton)return;
  const off=root.classList.contains('motion-off')||prefersReduced.matches;
  const en=body.dataset.language==='en';
  motionButton.setAttribute('aria-pressed',String(off));
  motionButton.disabled=prefersReduced.matches;
  if(prefersReduced.matches){
   motionButton.setAttribute('aria-label',en?'Reduced motion enabled in system settings':'Movimento reduzido nas configurações do sistema');
   motionButton.title=en?'Controlled by system settings':'Controlado pelas configurações do sistema';
   return;
  }
  motionButton.setAttribute('aria-label',off?(en?'Enable motion effects':'Ativar efeitos de movimento'):(en?'Disable motion effects':'Desativar efeitos de movimento'));
  motionButton.title=off?(en?'Enable animations':'Ativar animações'):(en?'Reduce animations':'Reduzir animações');
 };
 if(chosenOff)root.classList.add('motion-off');
 if(!prefersReduced.matches&&!chosenOff){
  root.classList.add('motion-capable');
  // Two frames let the initial scene settle; no blocking loader or long blank screen.
  requestAnimationFrame(()=>requestAnimationFrame(()=>root.classList.add('motion-started')));
  window.setTimeout(()=>root.classList.add('motion-intro-complete'),2150);
 }
 updateButton();
 motionButton?.addEventListener('click',()=>{
  const off=!root.classList.contains('motion-off');
  root.classList.toggle('motion-off',off);
  if(!off&&!prefersReduced.matches){root.classList.add('motion-capable','motion-started','motion-intro-complete')}
  try{localStorage.setItem(storageKey,off?'1':'0')}catch{}
  if(off){resetPointer();clearParallax()}
  updateButton();
 });
 if(prefersReduced.addEventListener)prefersReduced.addEventListener('change',()=>{
  if(prefersReduced.matches){root.classList.remove('motion-capable','motion-started');resetPointer();clearParallax()}
  else if(!root.classList.contains('motion-off')){root.classList.add('motion-capable','motion-started','motion-intro-complete')}
  updateButton();
 });

 // Switch animation for the existing fully accessible, keyboard-operable index.
 const panel=document.querySelector('[data-motion-panel]');
 let panelTimer=0;
 const list=document.querySelector('.studio-index-list');
 if(list&&panel){
  const handleSwitch=event=>{
   if(!allowed())return;
   const tab=event.target.closest('[data-studio-tab]');
   if(!tab||tab.getAttribute('aria-selected')==='true')return;
   panel.classList.remove('is-switching');
   void panel.offsetWidth;
   panel.classList.add('is-switching');
   window.clearTimeout(panelTimer);
   panelTimer=window.setTimeout(()=>panel.classList.remove('is-switching'),930);
  };
  // The phase06 handler owns content; this listener only adds visual feedback.
  list.addEventListener('click',handleSwitch,{capture:true});
  list.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(e.key)){
   if(allowed()){panel.classList.remove('is-switching');void panel.offsetWidth;panel.classList.add('is-switching');clearTimeout(panelTimer);panelTimer=setTimeout(()=>panel.classList.remove('is-switching'),930)}
  }},{capture:true});
 }

 // Scroll-linked parallax (small, clamped, and CSS-variable driven). Only one
 // passive listener and one rAF; CSS handles final composition.
 const portrait=document.querySelector('.portrait-frame img');
 const aboutPhoto=document.querySelector('.about-photo img');
 const hero=document.querySelector('.hero');
 let scrollQueued=false;
 const scrollParallax=()=>{
  if(scrollQueued)return;
  scrollQueued=true;
  requestAnimationFrame(()=>{
   scrollQueued=false;
   if(!allowed()||innerWidth<=660)return;
   if(hero&&portrait){const r=hero.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){
    const y=Math.max(-13,Math.min(13,(r.top*-0.016)));portrait.style.setProperty('--portrait-scroll',y.toFixed(1)+'px');
   }}
   if(aboutPhoto){const r=aboutPhoto.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){
    const y=Math.max(-12,Math.min(12,(innerHeight/2-r.top-r.height/2)*.025));aboutPhoto.style.setProperty('--about-scroll',y.toFixed(1)+'px');
   }}
  });
 };
 window.addEventListener('scroll',scrollParallax,{passive:true});
 scrollParallax();
 function clearParallax(){portrait?.style.removeProperty('--portrait-scroll');aboutPhoto?.style.removeProperty('--about-scroll')}

 // Slight perspective on the real portrait and tracking label over work images.
 const heroArt=document.querySelector('.hero-art');
 const frame=heroArt?.querySelector('.portrait-frame');
 const visuals=[...document.querySelectorAll('[data-motion-project]')];
 let moveQueued=false,lastEvent=null;
 const onPortraitMove=e=>{
  if(!allowed()||!finePointer.matches)return;
  lastEvent=e;
  if(moveQueued)return;
  moveQueued=true;
  requestAnimationFrame(()=>{
   moveQueued=false;
   if(!lastEvent||!frame)return;
   const r=frame.getBoundingClientRect();
   const x=((lastEvent.clientX-r.left)/r.width-.5)*2;
   const y=((lastEvent.clientY-r.top)/r.height-.5)*2;
   frame.style.setProperty('--hero-rx',(-y*1.75).toFixed(2)+'deg');
   frame.style.setProperty('--hero-ry',(x*1.75).toFixed(2)+'deg');
  });
 };
 const resetPointer=()=>{
  if(frame){frame.style.removeProperty('--hero-rx');frame.style.removeProperty('--hero-ry')}
  visuals.forEach(v=>{v.style.removeProperty('--cursor-x');v.style.removeProperty('--cursor-y')});
 };
 heroArt?.addEventListener('pointermove',onPortraitMove,{passive:true});
 heroArt?.addEventListener('pointerleave',()=>{frame?.style.removeProperty('--hero-rx');frame?.style.removeProperty('--hero-ry')});
 for(const visual of visuals){
  let queued=false,point=null;
  visual.addEventListener('pointermove',e=>{
   if(!allowed()||!finePointer.matches)return;
   point=[e.clientX,e.clientY];
   if(queued)return;
   queued=true;
   requestAnimationFrame(()=>{
    queued=false;
    if(!point)return;
    const r=visual.getBoundingClientRect();
    visual.style.setProperty('--cursor-x',(point[0]-r.left).toFixed(1)+'px');
    visual.style.setProperty('--cursor-y',(point[1]-r.top).toFixed(1)+'px');
   });
  },{passive:true});
 }

 // Motion rail active section, with native anchor navigation and keyboard focus.
 const rails=[...document.querySelectorAll('.motion-rail-link')];
 const railItems=rails.map(link=>({link,el:document.querySelector(link.getAttribute('href'))})).filter(x=>x.el);
 if('IntersectionObserver' in window&&railItems.length){
  const io=new IntersectionObserver(entries=>{
   for(const entry of entries){if(entry.isIntersecting){
    railItems.forEach(x=>x.link.classList.toggle('is-active',x.el===entry.target));
   }}
  },{rootMargin:'-15% 0px -60% 0px',threshold:0});
  railItems.forEach(({el})=>io.observe(el));
 }
 // Illuminate current steps when they enter view; no dependency on interaction.
 const steps=[...document.querySelectorAll('[data-motion-step]')];
 if('IntersectionObserver' in window&&steps.length){
  const io=new IntersectionObserver(entries=>{
   for(const e of entries){if(e.isIntersecting)e.target.classList.add('is-motion-active')}
  },{rootMargin:'0px 0px -20% 0px',threshold:.2});
  steps.forEach(x=>io.observe(x));
 }
})();
