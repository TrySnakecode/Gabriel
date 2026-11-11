/* NÓRRIA editorial refinements: progressive enhancements, never changing checkout data. */
(()=>{'use strict';
const pt=document.documentElement.lang.toLowerCase().startsWith('pt');
const TXT=pt?{filter:'Mostrar filtros',close:'Ocultar filtros',zoom:'Ampliar ilustração',closeZoom:'Fechar',art:'Estudo ilustrado: nenhuma fotografia de produto'}:{filter:'Show filters',close:'Hide filters',zoom:'Enlarge illustration',closeZoom:'Close',art:'Illustrated concept: no product photograph'};
function initFilters(){const f=document.querySelector('#nr-filters');if(!f)return;
  const b=document.createElement('button');b.type='button';b.className='nr-filter-toggle';b.setAttribute('aria-controls','nr-filters');b.setAttribute('aria-expanded','false');
  b.innerHTML='<span>'+TXT.filter+'</span><span aria-hidden="true">＋</span>';
  f.before(b);f.classList.add('nr-is-collapsed');
  const update=()=>{const open=b.getAttribute('aria-expanded')==='true';b.querySelector('span').textContent=open?TXT.close:TXT.filter;b.querySelectorAll('span')[1].textContent=open?'−':'＋';f.classList.toggle('nr-is-open',open);f.classList.toggle('nr-is-collapsed',!open)};
  b.addEventListener('click',()=>{b.setAttribute('aria-expanded',String(b.getAttribute('aria-expanded')!=='true'));update()});
  update();
}
function initCardViews(){let current=null;
  function switchSide(target,back){const card=target?.closest('.nr-product-visual');if(!card)return;const img=card.querySelector('img[src$=".svg"]');if(!img)return;
    if(!img.dataset.nrFront)img.dataset.nrFront=img.getAttribute('src');
    const original=img.dataset.nrFront;if(!original.includes('-front.svg'))return;
    const src=back?original.replace('-front.svg','-back.svg'):original;
    if(img.getAttribute('src')!==src){img.setAttribute('src',src);img.setAttribute('alt',back?(pt?'Vista posterior — ilustração conceitual':'Back view — concept illustration'):(pt?'Vista frontal — ilustração conceitual':'Front view — concept illustration'))}
  }
  document.addEventListener('mouseover',e=>{const card=e.target.closest('.nr-product-visual');if(card&&!card.contains(e.relatedTarget))switchSide(card,true)});
  document.addEventListener('mouseout',e=>{const card=e.target.closest('.nr-product-visual');if(card&&!card.contains(e.relatedTarget))switchSide(card,false)});
  document.addEventListener('focusin',e=>{if(e.target.matches('.nr-product-visual a'))switchSide(e.target,true)});
  document.addEventListener('focusout',e=>{if(e.target.matches('.nr-product-visual a'))switchSide(e.target,false)});
}
function initZoom(){const img=document.querySelector('[data-product-image]');if(!img)return;const host=img.closest('.nr-gallery-main');if(!host)return;
  const button=document.createElement('button');button.type='button';button.className='nr-zoom-button';button.textContent=TXT.zoom+' ↗';host.append(button);
  const dialog=document.createElement('dialog');dialog.className='nr-zoom-dialog';dialog.setAttribute('aria-label',TXT.zoom);
  dialog.innerHTML='<img width="1200" height="1450" alt=""><div class="nr-zoom-dialog__bar"><span>'+TXT.art+'</span><button type="button">'+TXT.closeZoom+'</button></div>';
  document.body.append(dialog);const enlarged=dialog.querySelector('img');
  button.addEventListener('click',()=>{enlarged.src=img.src;enlarged.alt=img.alt;dialog.showModal()});
  dialog.querySelector('button').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
}
function initReveals(){if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('nr-onview');observer.unobserve(entry.target)}},{threshold:.09});
 for(const n of document.querySelectorAll('.nr-section-heading, .nr-editorial-tile, .nr-journal-entry, .nr-material-story__body'))observer.observe(n);
}
initFilters();initCardViews();initZoom();initReveals();
})();
