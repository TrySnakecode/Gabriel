/* ORÍVIA — Phase 11: enhancement only. Does not transmit or persist booking details. */
(()=>{'use strict';
 const q=(s,root=document)=>root.querySelector(s), qa=(s,root=document)=>Array.from(root.querySelectorAll(s));
 const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
 // Clear progress indication; does not alter routing or content.
 const progress=document.createElement('div');progress.className='or-scroll-progress';progress.setAttribute('aria-hidden','true');document.body.appendChild(progress);
 let frame=false;function draw(){frame=false;const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);progress.style.width=(Math.min(100,Math.max(0,(scrollY/max)*100))).toFixed(2)+'%'}
 addEventListener('scroll',()=>{if(!frame){frame=true;requestAnimationFrame(draw)}},{passive:true});draw();
 // Native content remains visible when scripts fail or motion reduction is requested.
 if(!reduced&&'IntersectionObserver' in window){const list=qa('.or-intro-grid,.or-kicker-row,.or-procedure-card,.or-feature-grid,.or-process-item,.or-graphic-break-inner,.or-quote,.or-faq,.or-detail-section,.or-case-item');
   const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.03,rootMargin:'0px 0px -18px 0px'});
   list.forEach(el=>{el.classList.add('or-reveal');observer.observe(el)});
 }
 const toggle=q('[data-or-toggle]'),nav=q('#or-nav');
 if(toggle&&nav){const close=()=>{toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open')};
   document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){close();toggle.focus()}});
   document.addEventListener('pointerdown',e=>{if(!nav.contains(e.target)&&!toggle.contains(e.target))close()});
 }
 // Active heading is visual only, native anchor links remain untouched.
 const headings=qa('.or-detail-section[id]');
 if(headings.length&&'IntersectionObserver' in window){const toc=qa('.or-toc a[href^="#"]');
   const obs=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){toc.forEach(a=>a.classList.toggle('or-active',a.getAttribute('href')==='#'+entry.target.id))}}},{rootMargin:'-18% 0px -68% 0px',threshold:0});headings.forEach(x=>obs.observe(x));
 }
 // The booked journey is a mock; update an external non-personal step indicator.
 const host=q('[data-or-booking]'),live=q('[data-or-live]');
 if(host&&live){const update=()=>{let count=qa('.or-progress span.active',host).length;count=Math.max(1,Math.min(6,count));const n=q('[data-or-live-step]',live),line=q('[data-or-live-line]',live);
   if(n)n.textContent=String(count).padStart(2,'0')+' / 06';if(line)line.style.width=(count/6*100).toFixed(2)+'%';
 };const observer=new MutationObserver(update);observer.observe(host,{childList:true});update();}
})();
