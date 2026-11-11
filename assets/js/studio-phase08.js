/* Gabriel Basso Studio — Fase 08. No framework, no external dependencies.
 * Native POST to original FormSubmit endpoint; only external provider confirms delivery. */
(()=>{'use strict';
 const root=document.documentElement,body=document.body;
 root.classList.add('has-js');
 const lang=body.dataset.language==='en'?'en':'pt';
 const menuBtn=document.querySelector('[data-menu-toggle]'),nav=document.querySelector('#primary-nav');
 const setMenu=(open)=>{
  if(!menuBtn||!nav)return;
  nav.classList.toggle('open',open);body.classList.toggle('menu-open',open);
  menuBtn.setAttribute('aria-expanded',String(open));
  menuBtn.setAttribute('aria-label',open?menuBtn.dataset.closeLabel:menuBtn.dataset.openLabel);
 };
 menuBtn?.addEventListener('click',()=>setMenu(menuBtn.getAttribute('aria-expanded')!=='true'));
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuBtn?.getAttribute('aria-expanded')==='true'){setMenu(false);menuBtn.focus();}});
 addEventListener('resize',()=>{if(innerWidth>800)setMenu(false)},{passive:true});
 document.querySelectorAll('[data-lang-link]').forEach(a=>{
  a.addEventListener('click',()=>{try{localStorage.setItem('gb-preferred-language',a.dataset.lang)}catch{}});
  if(location.hash&&!a.href.includes('#'))a.href+=location.hash;
 });
 const toggle=document.querySelector('[data-motion-toggle]');
 const system=matchMedia('(prefers-reduced-motion: reduce)');
 let userOff=false;try{userOff=localStorage.getItem('gb-studio-motion-off')==='1'}catch{}
 const motionAllowed=()=>!system.matches&&!userOff;
 const updateMotion=()=>{
  root.classList.toggle('motion-off',!motionAllowed());
  root.classList.toggle('motion-allowed',motionAllowed());
  if(toggle){toggle.disabled=system.matches;toggle.setAttribute('aria-pressed',String(!motionAllowed()));
   toggle.setAttribute('aria-label',system.matches?(lang==='en'?'Reduced motion enabled in system settings':'Movimento reduzido nas configurações do sistema'):motionAllowed()?(lang==='en'?'Turn motion off':'Desativar animações'):(lang==='en'?'Turn motion on':'Ativar animações'));
  }
  if(!motionAllowed())document.querySelectorAll('[data-reveal]').forEach(el=>el.classList.add('in-view'));
 };
 updateMotion();
 toggle?.addEventListener('click',()=>{userOff=!userOff;try{localStorage.setItem('gb-studio-motion-off',userOff?'1':'0')}catch{}updateMotion()});
 system.addEventListener?.('change',updateMotion);
 const revealEls=[...document.querySelectorAll('[data-reveal]')];
 if('IntersectionObserver' in window){
  const io=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target)}},{threshold:.07,rootMargin:'0px 0px -45px 0px'});
  revealEls.forEach(el=>io.observe(el));
 } else revealEls.forEach(el=>el.classList.add('in-view'));
 // The projects index is a fully working set of ARIA tabs with arrow/Home/End control.
 const tabs=[...document.querySelectorAll('[data-index-tab]')],panel=document.querySelector('#index-view');
 const activate=(tab,focus=false)=>{
  if(!tab||!panel)return;
  tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.classList.toggle('is-active',active);t.tabIndex=active?0:-1;});
  panel.classList.add('is-switching');
  const img=panel.querySelector('[data-index-image]');
  if(img){img.src=tab.dataset.asset;img.alt=tab.dataset.alt;}
  const set=(selector,value)=>{const el=panel.querySelector(selector);if(el)el.textContent=value};
  set('[data-index-current]',tab.dataset.num);
  set('[data-index-tag]',tab.dataset.tag);
  set('[data-index-name]',tab.dataset.name);
  set('[data-index-note]',tab.dataset.note);
  const linkCase=panel.querySelector('[data-index-case]'),linkDemo=panel.querySelector('[data-index-demo]');
  if(linkCase)linkCase.href=tab.dataset.case;
  if(linkDemo)linkDemo.href=tab.dataset.demo;
  panel.setAttribute('aria-labelledby',tab.id);
  setTimeout(()=>panel.classList.remove('is-switching'),250);
  if(focus)tab.focus();
 };
 tabs.forEach((t,i)=>{
  t.addEventListener('click',()=>activate(t));
  t.addEventListener('keydown',e=>{
   let idx=-1;
   if(e.key==='ArrowDown'||e.key==='ArrowRight')idx=(i+1)%tabs.length;
   if(e.key==='ArrowUp'||e.key==='ArrowLeft')idx=(i+tabs.length-1)%tabs.length;
   if(e.key==='Home')idx=0;
   if(e.key==='End')idx=tabs.length-1;
   if(idx!==-1){e.preventDefault();activate(tabs[idx],true)}
  });
 });
 // One scheduled frame for sticky header and reading progress.
 const progress=document.querySelector('[data-progress]'),header=document.querySelector('.topbar');let pending=false;
 const syncScroll=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;
  header?.classList.toggle('scrolled',scrollY>12);
  if(progress){const total=Math.max(1,document.documentElement.scrollHeight-innerHeight);progress.style.transform=`scaleX(${Math.min(1,Math.max(0,scrollY/total))})`}
 })};
 addEventListener('scroll',syncScroll,{passive:true});addEventListener('resize',syncScroll,{passive:true});syncScroll();
 if('IntersectionObserver' in window){
  const navAnchors=[...document.querySelectorAll('.nav a[href^="#"]')];
  const entries=navAnchors.map(a=>({a,section:document.querySelector(a.getAttribute('href'))})).filter(x=>x.section);
  const observer=new IntersectionObserver(records=>{
   for(const record of records)if(record.isIntersecting){entries.forEach(x=>x.a===entries.find(y=>y.section===record.target)?.a?x.a.setAttribute('aria-current','location'):x.a.removeAttribute('aria-current'))}
  },{rootMargin:'-18% 0px -58% 0px',threshold:0});
  entries.forEach(x=>observer.observe(x.section));
 }
 // Form integration is deliberately NOT replaced with fetch/ajax or a mock success.
 const form=document.querySelector('[data-real-contact-form]');
 if(form){
  const feedback=form.querySelector('[data-form-feedback]'),btn=form.querySelector('[data-submit]'),label=btn?.querySelector('[data-button-label]');
  form.addEventListener('submit',e=>{
   if(!navigator.onLine){e.preventDefault();if(feedback){feedback.hidden=false;feedback.textContent=lang==='en'?'You appear to be offline. Connect to the internet and try again.':'Você está sem conexão. Conecte-se à internet e tente novamente.'}return;}
   if(feedback)feedback.hidden=true;
   if(btn&&label){btn.disabled=true;label.textContent=btn.dataset.sendingLabel;}
  });
  addEventListener('pageshow',()=>{if(btn&&label){btn.disabled=false;label.textContent=btn.dataset.defaultLabel}});
 }
})();
