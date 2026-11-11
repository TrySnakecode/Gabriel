/* Progressive enhancement: recommendation is advisory only; no collection or tracking. */
(() => {
  'use strict';
  const T=window.GBTranslate || (s=>String(s));
  const root=document.querySelector('[data-site-finder]');
  if(!root)return;
  const result=root.querySelector('[data-finder-result]');
  const buttons=[...root.querySelectorAll('[data-finder-choice]')];
  const options={
    landing:{title:'Uma landing page pode ser um bom começo.',text:'Se o objetivo é apresentar uma oferta e incentivar uma ação específica, uma página direta e bem estruturada pode ser a solução inicial mais adequada.',value:'Landing Page'},
    institucional:{title:'Um website institucional pode fazer mais sentido.',text:'Quando você precisa apresentar a marca, explicar serviços e organizar várias informações, um site com páginas bem planejadas oferece mais espaço e clareza.',value:'Website institucional'},
    redesign:{title:'Vamos avaliar um redesign do site atual.',text:'Se seu website já existe, o primeiro passo é entender o que funciona e o que precisa evoluir, antes de mudar visual, conteúdo ou navegação.',value:'Redesign de site'}
  };
  if(document.documentElement.lang==='en')Object.values(options).forEach(o=>{o.title=T(o.title);o.text=T(o.text);});
  buttons.forEach(button => button.addEventListener('click', () => {
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    const o=options[button.dataset.finderChoice];if(!o)return;
    result.replaceChildren();
    const kicker=document.createElement('span');kicker.className='smallcaps';kicker.textContent=T('Ponto de partida sugerido');
    const title=document.createElement('h3');title.textContent=o.title;
    const text=document.createElement('p');text.textContent=o.text;
    const link=document.createElement('a');link.href='#contato';link.textContent=T('Conversar sobre esse projeto');
    const arrow=document.createElementNS('http://www.w3.org/2000/svg','svg');
    arrow.setAttribute('viewBox','0 0 24 24');arrow.setAttribute('width','18');arrow.setAttribute('height','18');
    arrow.setAttribute('aria-hidden','true');arrow.setAttribute('fill','none');arrow.setAttribute('stroke','currentColor');
    arrow.setAttribute('stroke-width','1.8');arrow.setAttribute('stroke-linecap','round');arrow.setAttribute('stroke-linejoin','round');
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d','M7 17 17 7M7 7h10v10');arrow.append(path);link.append(arrow);
    link.addEventListener('click',()=>{
      const selector=document.querySelector('#your-service');
      const field=document.querySelector('#your-project');
      if(selector && [...selector.options].some(option=>option.value===o.value))selector.value=o.value;
      if(field && !field.value.trim())field.value=document.documentElement.lang==='en'?`I'm interested in ${T(o.value).toLowerCase()}. I'd love to discuss the scope and possibilities for my business.`:`Tenho interesse em ${o.value.toLowerCase()}. Gostaria de conversar sobre o escopo e as possibilidades para meu negócio.`;
    });
    result.append(kicker,title,text,link);
    result.hidden=false;
  }));
})();
