/* Studio Motion — progressive enhancement powered by GSAP and ScrollTrigger.
   Content, navigation, and forms always work when the CDN is unavailable. */
(() => {
  'use strict';
  if (!document.querySelector('.new-hero, .case-page') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ready = () => {
    const load = src => new Promise((resolve, reject) => {
      const node = document.createElement('script');
      node.src = src; node.async = true; node.crossOrigin = 'anonymous';
      let settled = false;
      const timeout = window.setTimeout(() => {
        if (!settled) { settled = true; node.remove(); reject(new Error('Motion CDN timeout')); }
      }, 4500);
      node.onload = () => { if (!settled) { settled = true; clearTimeout(timeout); resolve(); } };
      node.onerror = () => { if (!settled) { settled = true; clearTimeout(timeout); reject(new Error('Motion unavailable')); } };
      document.head.append(node);
    });
    const startedAt = performance.now();
    load('https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js')
      .then(() => load('https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js'))
      .then(() => {
        if (!window.gsap || !window.ScrollTrigger) return;
        const gsap = window.gsap;
        gsap.registerPlugin(window.ScrollTrigger);
        const canAnimateHero = performance.now() - startedAt < 2200 && window.scrollY < 40;
        if (canAnimateHero && document.querySelector('.new-hero')) {
          gsap.timeline({defaults:{ease:'power3.out'}})
            .from('.new-hero .hero-index', {opacity:0,y:12,duration:.65},0)
            .from('.new-hero .eyebrow', {opacity:0,y:17,duration:.58},.1)
            .from('.new-hero h1', {opacity:0,y:33,duration:.9},.15)
            .from('.new-hero .hero-intro', {opacity:0,y:19,duration:.68},.43)
            .from('.new-hero .hero-cta', {opacity:0,y:15,duration:.65},.55)
            .from('.new-hero .hero-signals', {opacity:0,y:12,duration:.62},.64);
        }
        if (canAnimateHero && document.querySelector('.case-page')) {
          gsap.timeline({defaults:{ease:'power3.out'}})
            .from('.case-head .case-back', {opacity:0,y:15,duration:.65},0)
            .from('.case-head .case-heading', {opacity:0,y:29,duration:.85},.14)
            .from('.case-hero-art', {opacity:0,y:19,duration:.92},.28)
            .from('.case-facts', {opacity:0,y:14,duration:.65},.48);
        }
        document.querySelectorAll('.value-list article, .case-deep-grid article').forEach((item, index) => {
          gsap.from(item, {
            opacity: 0, y: 24, duration: .75, ease:'power2.out',
            scrollTrigger: {trigger:item,start:'top 92%',once:true},
            delay: (index % 2) * .05
          });
        });
        if (document.querySelector('.finder-panel')) {
          gsap.from('.finder-panel', {
            opacity:0,y:22,duration:.85,ease:'power2.out',
            scrollTrigger:{trigger:'.finder-panel',start:'top 90%',once:true}
          });
        }
      })
      .catch(() => { /* Native CSS and existing IntersectionObserver are the reliable fallback. */ });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',ready,{once:true});
  else ready();
})();
