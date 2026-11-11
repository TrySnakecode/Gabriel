(()=>{'use strict';
 const menuButton=document.querySelector('[data-menu-toggle]');
 const nav=document.querySelector('#main-nav');
 if(menuButton&&nav){
  const setOpen=(open)=>{menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?menuButton.dataset.closeLabel:menuButton.dataset.openLabel);nav.classList.toggle('is-open',open);document.body.classList.toggle('is-menu-open',open)};
  menuButton.addEventListener('click',()=>setOpen(menuButton.getAttribute('aria-expanded')!=='true'));
  nav.addEventListener('click',e=>{if(e.target.closest('a'))setOpen(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){setOpen(false);menuButton.focus()}});
  const mq=window.matchMedia('(min-width: 901px)');
  mq.addEventListener?.('change',e=>{if(e.matches)setOpen(false)});
 }
 document.querySelectorAll('[data-lang-link]').forEach(link=>{link.addEventListener('click',()=>{try{localStorage.setItem('gb-preferred-language',link.dataset.lang)}catch{}});if(location.hash){link.setAttribute('href',link.getAttribute('href')+location.hash)}});
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!reduced&&'IntersectionObserver' in window){
  document.documentElement.classList.add('is-enhanced');
  const observer=new IntersectionObserver((entries)=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}},{threshold:.07,rootMargin:'0px 0px -10px 0px'});
  document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));
 }
 const form=document.querySelector('[data-real-contact-form]');
 if(form){const feedback=form.querySelector('[data-form-feedback]');const submit=form.querySelector('[data-submit]');const label=submit?.querySelector('[data-button-label]');
  form.addEventListener('submit',e=>{
   if(!navigator.onLine){e.preventDefault();if(feedback){feedback.textContent=document.body.dataset.language==='en'?'You appear to be offline. Connect to the internet and try again.':'Você está sem conexão. Conecte-se à internet e tente novamente.';feedback.hidden=false}return}
   if(feedback)feedback.hidden=true;
   // Native POST to the verified original endpoint; only the provider may confirm actual delivery.
   if(submit&&label){submit.disabled=true;label.textContent=submit.dataset.sendingLabel}
  });
  // A back navigation may restore a page with disabled controls (bfcache).
  window.addEventListener('pageshow',()=>{if(submit&&label){submit.disabled=false;label.textContent=submit.dataset.defaultLabel}});
 }
})();
