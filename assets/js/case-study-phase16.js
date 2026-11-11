(() => {
 const progress = document.querySelector('[data-scroll-progress]');
 if (!progress) return;
 let scheduled=false;
 const update=()=>{
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(()=>{
   scheduled=false;
   const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
   progress.style.transform=`scaleX(${Math.min(1,Math.max(0,window.scrollY/max))})`;
  });
 };
 addEventListener('scroll',update,{passive:true});
 addEventListener('resize',update,{passive:true});
 update();
})();
