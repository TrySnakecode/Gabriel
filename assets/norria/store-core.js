/* Pure, testable storefront logic. No payments, personal data or inventory changes. */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.NorriaStore=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const n=v=>Math.max(0,Number.isFinite(Number(v))?Number(v):0);
 function cartKey(id,color,size){return `${id}|${color}|${size}`;}
 function normalizeCart(cart,products){
  if(!Array.isArray(cart))return [];
  const out=[];
  for(const item of cart){
    if(!item||typeof item!=='object')continue;
    const p=products.find(p=>p.id===item.id);
    if(!p||!p.colorOptions.includes(item.color)||!p.sizes.includes(item.size))continue;
    const qty=Math.max(1,Math.min(20,Math.trunc(n(item.qty))||1));
    const match=out.find(x=>cartKey(x.id,x.color,x.size)===cartKey(item.id,item.color,item.size));
    if(match)match.qty=Math.min(20,match.qty+qty);
    else out.push({id:p.id,color:item.color,size:item.size,qty});
  }
  return out;
 }
 function addToCart(cart,products,item){
  return normalizeCart([...normalizeCart(cart,products),item],products);
 }
 function updateCart(cart,products,key,qty){
  return normalizeCart(cart,products).filter(i=>cartKey(i.id,i.color,i.size)!==key).concat(
    qty>0?normalizeCart(cart,products).filter(i=>cartKey(i.id,i.color,i.size)===key).map(i=>({...i,qty:Math.min(20,Math.trunc(n(qty)))})):[]);
 }
 function subtotal(cart,products){
  return normalizeCart(cart,products).reduce((total,item)=>total+products.find(p=>p.id===item.id).price*item.qty,0);
 }
 function count(cart,products){return normalizeCart(cart,products).reduce((total,item)=>total+item.qty,0);}
 function filterProducts(products,filters,favorites){
  const f=filters||{},fav=new Set(favorites||[]);
  let output=products.filter(p=>{
    const text=[...Object.values(p.name),...Object.values(p.categoryLabel),p.id,p.slug].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const term=String(f.search||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
    return (!term||text.includes(term))
      &&(!f.category||p.category===f.category||(f.category==='accessories'&&['tote','cap','scarf'].includes(p.category)))
      &&(!f.size||p.sizes.includes(f.size))
      &&(!f.color||p.colorOptions.includes(f.color))
      &&(!f.collection||p.collection.en===f.collection)
      &&(!f.max||p.price<=n(f.max)*100)
      &&(!f.min||p.price>=n(f.min)*100)
      &&(!f.favorites||fav.has(p.id));
  });
  switch(f.sort){
   case 'low':output=output.slice().sort((a,b)=>a.price-b.price);break;
   case 'high':output=output.slice().sort((a,b)=>b.price-a.price);break;
   case 'az':output=output.slice().sort((a,b)=>a.name.en.localeCompare(b.name.en));break;
   case 'new':output=output.slice().sort((a,b)=>Number(b.isNew)-Number(a.isNew));break;
  }
  return output;
 }
 function validateDemoContact(v){
  // Demo-safe: only example data, no real-person contact info or card details.
  const name=String(v.name||'').trim(),email=String(v.email||'').trim().toLowerCase(),street=String(v.street||'').trim(),city=String(v.city||'').trim();
  return name.length>=2&&name.length<=80&&street.length>=4&&street.length<=100&&city.length>=2&&city.length<=70
    &&/^[^\s@]+@example\.(com|org|test)$/.test(email)&&/^\d{5}-?\d{3}$/.test(String(v.zip||''));
 }
 return {cartKey,normalizeCart,addToCart,updateCart,subtotal,count,filterProducts,validateDemoContact};
});
