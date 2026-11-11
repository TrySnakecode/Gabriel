/* Page progress: small, dependency-free navigation enhancement. */
(() => {
  const onReady=()=>{
    const progress=document.querySelector('.site-progress');
    const links=[...document.querySelectorAll('.gb-header .gb-nav a')];
    const sections=[...document.querySelectorAll('main section[id]')];
    if(!progress)return;
    let scheduled=false;
    const update=()=>{
      scheduled=false;
      const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
      progress.style.transform=`scaleX(${Math.max(0,Math.min(1,scrollY/max))})`;
      let active='';
      for(const el of sections){if(el.getBoundingClientRect().top < innerHeight*.4)active=el.id;}
      links.forEach(link=>{
        const hash=link.getAttribute('href')?.split('#')[1];
        if(hash && hash===active)link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    };
    const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}};
    addEventListener('scroll',schedule,{passive:true});
    addEventListener('resize',schedule,{passive:true});
    update();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',onReady,{once:true});
  else onReady();
})();
