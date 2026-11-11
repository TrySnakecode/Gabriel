/* Phase09 — progressive enhancements: no dependence on external libraries */
(()=>{'use strict';
 const doc=document, reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const lang=doc.body.dataset.lang==='en'?'en':'pt';
 const copy=(pt,en)=>lang==='en'?en:pt;
 const app=doc.querySelector('#estarelia-app'); if(!app)return;
 const listen=(type,handler)=>doc.addEventListener(type,handler);
 let lastTrigger=null;
 listen('click',e=>{
   const filter=e.target.closest('[data-est-filters]');
   if(filter){const panel=filter.closest('.filter-panel');const open=panel.classList.toggle('filters-open');filter.setAttribute('aria-expanded',String(open));const icon=filter.querySelector('[data-filter-icon]');if(icon)icon.textContent=open?'−':'+';return}
   const zoom=e.target.closest('[data-est-zoom]');
   if(zoom){const dlg=doc.querySelector('#est-lightbox');const img=doc.querySelector('#est-lightbox-image');const base=doc.body.dataset.imgroot||'../../assets/estarelia/';const file=zoom.dataset.estZoom;
     if(!dlg||!img||!file||!/^(?:[a-z0-9-]+\.(?:webp|svg))$/i.test(file))return;
     lastTrigger=zoom;img.src=base+file;img.alt=copy('Imagem arquitetônica conceitual ampliada, não é um imóvel real','Enlarged conceptual architecture image, not a real listed property');if(typeof dlg.showModal==='function')dlg.showModal();return}
   if(e.target.closest('[data-est-close]')){doc.querySelector('#est-lightbox')?.close();return}
   if(e.target.id==='est-lightbox'){const rect=e.target.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)e.target.close()}
 });
 listen('close',e=>{if(e.target.id==='est-lightbox')lastTrigger?.focus()},true);
 const bar=doc.querySelector('.est-progress span'); const header=doc.querySelector('.site-head');
 let ticking=false;
 const update=()=>{const max=Math.max(1,doc.documentElement.scrollHeight-innerHeight);if(bar)bar.style.width=Math.max(0,Math.min(100,scrollY/max*100))+'%';header?.classList.toggle('est-scrolled',scrollY>22);ticking=false};
 addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});update();
 const canAnimate=!reduced.matches&&'IntersectionObserver'in window;
 if(canAnimate){const obs=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('est-inview');obs.unobserve(e.target)}}},{rootMargin:'0px 0px -50px 0px',threshold:.05});
  const scan=()=>{doc.body.classList.add('est-motion-ready');doc.querySelectorAll('[data-est-reveal]:not(.est-inview)').forEach(el=>{if(el.dataset.estObserved!=='1'){el.dataset.estObserved='1';obs.observe(el)}})};
  scan();const mo=new MutationObserver(()=>{requestAnimationFrame(scan)});mo.observe(app,{childList:true,subtree:false});
 }
 // On systems with reduced motion, keep everything visible and stop decorative movement.
 reduced.addEventListener?.('change',e=>{doc.body.classList.toggle('est-motion-ready',!e.matches);if(e.matches)doc.querySelectorAll('[data-est-reveal]').forEach(el=>el.classList.add('est-inview'))});
})();
