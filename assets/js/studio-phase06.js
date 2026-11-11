/* Studio-only interactivity: reading progress, section indication and the
   accessible project index. Original native FormSubmit POST stays untouched. */
(()=>{'use strict';
 const index=document.querySelector('.studio-index');
 const tabs=[...document.querySelectorAll('[data-studio-tab]')];
 const panel=document.querySelector('[data-studio-panel]');
 if(index && tabs.length===4 && panel){
  const $=selector=>panel.querySelector(selector);
  const show=(tab,focus=false)=>{
   if(!tab)return;
   tabs.forEach(item=>{
    const active=item===tab;
    item.classList.toggle('is-active',active);
    item.setAttribute('aria-selected',String(active));
    item.tabIndex=active?0:-1;
   });
   const pic=$('[data-studio-image]');
   // Keep a fully functional static first state when JavaScript is disabled.
   if(pic && pic.getAttribute('src')!==tab.dataset.image){
     pic.setAttribute('src',tab.dataset.image);
     pic.setAttribute('alt',tab.dataset.alt);
   }
   panel.dataset.brand=tab.dataset.brand;
   panel.setAttribute('aria-labelledby',tab.id);
   const name=$('[data-studio-name]'),kind=$('[data-studio-kind]'),skill=$('[data-studio-skill]'),desc=$('[data-studio-description]');
   if(name)name.textContent=tab.dataset.name;
   if(kind)kind.textContent=tab.dataset.kind;
   if(skill)skill.textContent=tab.dataset.skill;
   if(desc)desc.textContent=tab.dataset.description;
   const caseLink=$('[data-studio-case]'),demoLink=$('[data-studio-demo]');
   if(caseLink)caseLink.href=tab.dataset.case;
   if(demoLink)demoLink.href=tab.dataset.demo;
   const counter=$('.studio-image-counter');
   if(counter)counter.textContent=String(tabs.indexOf(tab)+1).padStart(2,'0')+' — 04';
   if(focus)tab.focus();
  };
  tabs.forEach((tab,i)=>{
   tab.addEventListener('click',()=>show(tab));
   tab.addEventListener('keydown',event=>{
    let next=-1;
    if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(i+1)%tabs.length;
    else if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=tabs.length-1;
    if(next>=0){event.preventDefault();show(tabs[next],true)}
   });
  });
 }
 const header=document.querySelector('.site-header');
 const progress=document.querySelector('[data-reading-progress]');
 let ticking=false;
 const onScroll=()=>{
  if(ticking)return;
  ticking=true;
  requestAnimationFrame(()=>{
   if(header)header.classList.toggle('is-scrolled',scrollY>10);
   if(progress){const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);const amount=Math.min(1,Math.max(0,scrollY/max));progress.style.transform=`scaleX(${amount})`}
   ticking=false;
  });
 };
 addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll,{passive:true});onScroll();
 const navLinks=[...document.querySelectorAll('.main-nav a[href^="#"]')];
 const sections=navLinks.map(a=>[a,document.querySelector(a.getAttribute('href'))]).filter(pair=>pair[1]);
 if('IntersectionObserver' in window && sections.length){
  const obs=new IntersectionObserver(entries=>{
    const candidates=entries.filter(e=>e.isIntersecting);
    if(!candidates.length)return;
    const target=candidates.sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0].target;
    sections.forEach(([a,section])=>section===target?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current'));
  },{rootMargin:'-18% 0px -52% 0px',threshold:[0,.1,.5]});
  sections.forEach(([,section])=>obs.observe(section));
 }
})();
