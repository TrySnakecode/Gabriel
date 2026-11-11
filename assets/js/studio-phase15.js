/* Fase 15: measured, loop-perfect marquee. No timers, no library, no duplicate speech. */
(()=>{'use strict';
 const marquees=[...document.querySelectorAll('[data-seamless-marquee]')];
 if(!marquees.length)return;
 let queued=false;
 function build(track){
   const bar=track.closest('.ticker');const first=track.querySelector('.ticker-unit');
   if(!bar||!first)return;
   // Temporarily suspend the animation while measuring and replacing copies.
   track.dataset.marqueeReady='false';track.style.animation='none';track.style.transform='none';
   [...track.children].slice(1).forEach(node=>node.remove());
   // Offset width is stable; no accumulating rounding error at the seam.
   const unitWidth=first.getBoundingClientRect().width;
   if(!Number.isFinite(unitWidth)||unitWidth<1)return;
   const visible=bar.getBoundingClientRect().width;
   const copies=Math.max(3,Math.ceil((visible*2+unitWidth)/unitWidth));
   for(let i=1;i<copies;i++){
     const clone=first.cloneNode(true);clone.setAttribute('aria-hidden','true');
     track.appendChild(clone);
   }
   // Constant speed even when language/viewport/font changes.
   const pixelsPerSecond=65;
   const seconds=unitWidth/pixelsPerSecond;
   track.style.setProperty('--marquee-distance',unitWidth+'px');
   track.style.setProperty('--marquee-duration',seconds.toFixed(4)+'s');
   track.style.removeProperty('animation');track.style.removeProperty('transform');
   track.dataset.marqueeReady='true';
 }
 function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;marquees.forEach(build);});}
 if('ResizeObserver' in window){const ro=new ResizeObserver(schedule);marquees.forEach(t=>ro.observe(t.closest('.ticker')))}
 else addEventListener('resize',schedule,{passive:true});
 if(document.fonts?.ready)document.fonts.ready.then(schedule).catch(()=>{});
 addEventListener('load',schedule,{once:true});schedule();
})();
