/* Keep the editorial name as HTML text outside the bitmap; the source imagery contains no embedded copy. */
(() => {
 const panel=document.getElementById('index-view');
 if(!panel)return;
 const media=panel.querySelector('.index-media');
 const mark=panel.querySelector('[data-index-media-brand]');
 const tabs=[...document.querySelectorAll('[data-index-tab]')];
 const refresh=()=>{
  const tab=tabs.find(t=>t.getAttribute('aria-selected')==='true') || tabs[0];
  if(!tab)return;
  if(media)media.dataset.indexKind=(tab.dataset.name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  if(mark)mark.textContent=tab.dataset.name || '';
 };
 const obs=new MutationObserver(refresh);
 tabs.forEach(t=>obs.observe(t,{attributes:true,attributeFilter:['aria-selected']}));
 refresh();
})();
