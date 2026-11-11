/* Gabriel Basso — progressive enhancement, no external dependencies.
 * The main portfolio contact form posts to FormSubmit.io using native HTML.
 * Demonstration-site forms remain simulations and do not transmit data.
 */
(() => {
  'use strict';
  const $ = (s, context = document) => context.querySelector(s);
  const $$ = (s, context = document) => [...context.querySelectorAll(s)];
  const safeText = v => String(v ?? '');
  const T = window.GBTranslate || (s => String(s));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Resolve assets from the actual script location (supports local file:// and hosted subfolders).
  const imageBase = new URL('../img/', document.currentScript.src);
  const imageAsset = name => new URL(name, imageBase).href;

  // Photographic references (licensed Pexels images), full-resolution and responsive.
  // Retain the original local file as offline fallback if the CDN cannot be reached.
  const photoIds = {"bruma-hero.webp": "5644335", "casa-patio.webp": "13600515", "casa-sala.webp": "34622754", "casa-cozinha.webp": "36511382", "casa-suite.webp": "33197278", "apartamento-aura.webp": "7546720", "alva-hero.webp": "10829709", "prumo-hero.webp": "29253513", "risco-hero.webp": "32075861", "risco-frequencia.webp": "38888711", "risco-orbita.webp": "12193430", "risco-materia.webp": "5292240"};
  const realPhoto = (name, width=2200) => photoIds[name]
    ? `https://images.pexels.com/photos/${photoIds[name]}/pexels-photo-${photoIds[name]}.jpeg?auto=compress&cs=srgb&w=${width}`
    : imageAsset(name);
  const setPhoto = (img,name,alt) => {
    if (!img) return;
    img.dataset.photoFallback=imageAsset(name);
    if (photoIds[name]) {
      img.srcset=[900,1500,2200].map(w=>`${realPhoto(name,w)} ${w}w`).join(', ');
      img.sizes='(max-width:700px) 100vw, 65vw';
    } else img.removeAttribute('srcset');
    img.onerror=()=>{img.onerror=null;img.removeAttribute('srcset');img.src=imageAsset(name);};
    img.src=realPhoto(name);img.alt=alt;
  };


  // Continuous, viewport-aware marquees (portfolio and Risco).
  // Build two *identical* groups, each longer than the viewport, then move by
  // exactly one group. This prevents blank frames and visible jumps at any width.
  $$('[data-continuous-marquee]').forEach(root => {
    const track=$('[data-continuous-track]',root);
    const original=track?.firstElementChild;
    if(!track || !original)return;
    const unit=original.cloneNode(true);
    const SPEED=36; // pixels / second, constant on desktop and mobile
    let frame=0;
    const rebuild=()=>{
      if(!root.isConnected)return;
      track.style.animation='none';
      track.replaceChildren();
      const group=document.createElement('div');
      group.className='marquee-group';
      group.setAttribute('aria-hidden','true');
      track.append(group);
      group.append(unit.cloneNode(true));
      const firstWidth=group.getBoundingClientRect().width;
      if(firstWidth<1)return;
      // Extra unit ensures the first group can always cover the viewing area,
      // including during fractional-pixel layout and wide desktop viewports.
      const repetitions=Math.max(2,Math.ceil(root.clientWidth/firstWidth)+2);
      for(let i=1;i<repetitions;i++)group.append(unit.cloneNode(true));
      const duplicate=group.cloneNode(true);
      track.append(duplicate);
      const distance=group.getBoundingClientRect().width;
      track.style.setProperty('--marquee-duration',`${(distance/SPEED).toFixed(3)}s`);
      track.style.removeProperty('animation');
      track.classList.add('marquee-ready');
    };
    rebuild();
    // Fonts can change text width after the first render.
    if(document.fonts?.ready)document.fonts.ready.then(rebuild).catch(()=>{});
    window.addEventListener('resize',()=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(rebuild);
    },{passive:true});
  });

  // Navigation / accessibility.
  $$('[data-menu]').forEach(toggle => {
    const menu = document.getElementById(toggle.dataset.menu);
    if (!menu) return;
    const close = () => {toggle.setAttribute('aria-expanded','false'); menu.classList.remove('open');};
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('open',open);
      if(open) menu.querySelector('a')?.focus();
    });
    menu.addEventListener('click',event => { if(event.target.closest('a'))close(); });
    document.addEventListener('keydown',event => {if(event.key === 'Escape'){close();toggle.focus();}});
    document.addEventListener('pointerdown',event => {if(!menu.contains(event.target) && !toggle.contains(event.target))close();});
  });
  $$('[data-current-year]').forEach(x => {x.textContent = new Date().getFullYear();});

  // Motion respectful of preference & availability of IntersectionObserver.
  const reveals = $$('.reveal');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },{rootMargin:'0px 0px -25px 0px',threshold:.08});
    reveals.forEach(el => observer.observe(el));
  } else reveals.forEach(el => el.classList.add('is-visible'));

  // Portfolio form uses the native HTML POST endpoint provided by FormSubmit.io.
  // No JavaScript interception: this avoids unsupported AJAX paths,
  // false "message sent" notices, and email-application popups.

  // Actual interactive preview: iframe resizing. Nothing decorative.
  const controls = $('[data-preview-controls]');
  if (controls) {
    const frame = $('[data-preview-frame]');
    $$('[data-mode]',controls).forEach(button => button.addEventListener('click', () => {
      const mobile = button.dataset.mode==='mobile';
      frame.classList.toggle('mobile',mobile);
      $$('[data-mode]',controls).forEach(b => {
        const on = b === button;
        b.classList.toggle('active',on);
        b.setAttribute('aria-pressed', String(on));
      });
    }));
  }

  // Bruma — spatial exploration. Independent graphic views of the same conceptual residence.
  const floorplan = $('[data-floorplan]');
  if (floorplan) {
    const rooms = {
      patio:{title:'Pátio interno',text:'O jardim organiza a casa ao redor da luz natural, da vegetação e da água.',meta:'Vegetação · Água · Travertino',image:'casa-patio.webp',alt:'Ambiente conceitual da Casa Pátio, com materiais naturais e vegetação'},
      sala:{title:'Sala de estar',text:'Um ambiente aberto para o jardim, com painéis de madeira clara e superfícies táteis.',meta:'Madeira clara · Vidro · Luz natural',image:'casa-sala.webp',alt:'Sala de estar conceitual da Casa Pátio, integrada ao jardim'},
      cozinha:{title:'Cozinha integrada',text:'O plano de trabalho acompanha a transparência e a fluidez dos espaços compartilhados.',meta:'Pedra natural · Madeira · Integração',image:'casa-cozinha.webp',alt:'Cozinha conceitual de acabamentos em pedra e madeira'},
      suite:{title:'Suíte privativa',text:'Um espaço mais protegido, com materiais claros e luz indireta para uma atmosfera de descanso.',meta:'Linho · Madeira · Intimidade',image:'casa-suite.webp',alt:'Suíte conceitual com texturas naturais e iluminação suave'}
    };
    if(document.documentElement.lang === 'en')Object.values(rooms).forEach(room=>{for(const key of ['title','text','meta','alt'])room[key]=T(room[key]);});
    $$('[data-room]',floorplan).forEach(button => button.addEventListener('click', () => {
      $$('[data-room]',floorplan).forEach(b => {b.classList.remove('active');b.setAttribute('aria-pressed','false');});
      button.classList.add('active');button.setAttribute('aria-pressed','true');
      const room = rooms[button.dataset.room];
      if(!room) return;
      $('[data-room-title]',floorplan).textContent=room.title;
      $('[data-room-text]',floorplan).textContent=room.text;
      $('[data-room-meta]',floorplan).textContent=room.meta;
      const image=$('.room-result-image',floorplan);
      setPhoto(image,room.image,room.alt);
    }));
  }

  // Bruma — two distinct scene renders with the same architecture & viewpoint.
  const lighting = $('[data-lighting-tool]');
  if(lighting) $$('[data-light]',lighting).forEach(button=>button.addEventListener('click',()=>{
    const isDay=button.dataset.light==='dia';
    const scene=$('[data-lighting-image]',lighting);
    scene.src=imageAsset(isDay?'refugio-dia.webp':'refugio-noite.webp');
    scene.alt=T(isDay?'Visualização conceitual diurna do Refúgio Neblina':'Visualização conceitual noturna do Refúgio Neblina');
    $$('[data-light]',lighting).forEach(x=>x.setAttribute('aria-pressed',String(x===button)));
  }));

  // Bruma — material library; no fake commerce actions.
  const materials=$('[data-materials]');
  if(materials){
    const details={
      nogueira:['Nogueira','Madeira de tom profundo, usada em painéis e mobiliário para criar continuidade e calor visual.'],
      travertino:['Travertino','Pedra de variações suaves, prevista para superfícies de destaque e para dar unidade material.'],
      linho:['Linho','Tecido natural cuja textura discreta contribui para uma atmosfera acolhedora e tátil.'],
      bronze:['Bronze','Detalhes metálicos de acabamento quente que pontuam iluminação, puxadores e acessórios.']
    };
    if(document.documentElement.lang === 'en')Object.values(details).forEach(pair=>{pair[0]=T(pair[0]);pair[1]=T(pair[1]);});
    $$('[data-material]',materials).forEach(button=>button.addEventListener('click',()=>{
      const key=button.dataset.material, d=details[key];if(!d)return;
      $$('[data-material]',materials).forEach(x=>x.setAttribute('aria-pressed',String(x===button)));
      $('[data-material-title]').textContent=d[0];
      $('[data-material-description]').textContent=d[1];
      const image=$('[data-material-image]');image.src=imageAsset(`material-${key}.svg`);image.alt=(document.documentElement.lang === 'en'?`Concept material swatch of ${d[0]}`:`Amostra gráfica conceitual de ${d[0]}`);
    }));
  }

  const appendReview=(root,fields)=>{
    root.replaceChildren();
    fields.forEach(([key,value])=>{
      const row=document.createElement('div');
      const name=document.createElement('strong');name.textContent=T(safeText(key));
      const data=document.createElement('span');data.textContent=T(safeText(value));
      row.append(name,data);root.append(row);
    });
  };
  const formatDate = date => {
    if(!date) return '';
    const [y,m,d] = date.split('-');
    if(document.documentElement.lang==='en')return new Date(Number(y),Number(m)-1,Number(d)).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
    return `${d}/${m}/${y}`;
  };
  const showError = (root,message) => {
    const active=$('.booking-step.active,.quote-step.active',root);
    const error=$('[data-booking-error],[data-quote-error]',active);
    if(error){error.textContent=T(message);error.hidden=!message;}
  };

  // Alva — non-persistent booking simulation.
  const booking=$('[data-booking]');
  if(booking){
    let step=1, selectedTime='';
    const date=$('[name="date"]',booking);
    const today=new Date();
    const localToday=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    date.min=localToday;
    const showStep=n=>{
      step=n;
      $$('[data-booking-step]',booking).forEach(el=>el.classList.toggle('active',Number(el.dataset.bookingStep)===n));
      $$('.booking-progress span',booking).forEach((el,i)=>el.classList.toggle('active',i<n));
      showError(booking,'');
      booking.scrollIntoView({block:'start',behavior:reducedMotion?'instant':'smooth'});
    };
    const validate=()=>{
      if(step===1){
        for(const name of ['specialty','date']){
          const el=$(`[name="${name}"]`,booking);
          if(!el.checkValidity()){el.reportValidity();showError(booking,'Escolha a especialidade e a data demonstrativa.');return false;}
        }
      }
      if(step===2){
        if(!selectedTime){showError(booking,'Selecione um dos horários ilustrativos.');return false;}
        for(const name of ['name','email']){
          const el=$(`[name="${name}"]`,booking);
          if(!el.checkValidity()){el.reportValidity();showError(booking,'Informe um nome e um e-mail válidos para a simulação.');return false;}
        }
      }
      return true;
    };
    $$('[data-time]',booking).forEach(button=>button.addEventListener('click',()=>{
      selectedTime=button.dataset.time;
      $$('[data-time]',booking).forEach(b=>{
        b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));
      });
      showError(booking,'');
    }));
    $$('[data-booking-next]',booking).forEach(button=>button.addEventListener('click',()=>{
      if(!validate())return;
      if(step===2){
        appendReview($('[data-booking-summary]',booking),[
          ['Especialidade',$('[name="specialty"]',booking).value],
          ['Data ilustrativa',formatDate(date.value)],
          ['Horário ilustrativo',selectedTime],
          ['Nome de exemplo',$('[name="name"]',booking).value.trim()],
          ['E-mail de exemplo',$('[name="email"]',booking).value.trim()]
        ]);
      }
      if(step<4)showStep(step+1);
    }));
    $$('[data-booking-back]',booking).forEach(b=>b.addEventListener('click',()=>showStep(Math.max(step-1,1))));
    $('[data-booking-reset]',booking).addEventListener('click',()=>{
      booking.reset();selectedTime='';
      $$('[data-time]',booking).forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false');});
      showStep(1);
    });
    booking.addEventListener('submit',e=>e.preventDefault());
  }

  // Prumo — conditional quote-form simulation, with no network requests or storage.
  const quoteForm=$('[data-quote]');
  if(quoteForm){
    let step=1;
    const service=$('[name="service"]',quoteForm);
    const urgency=$('[name="urgency"]',quoteForm);
    const emergency=$('[name="emergency"]',quoteForm);
    const serviceToLabel=value=>service.querySelector(`option[value="${CSS.escape(value)}"]`)?.textContent||value;
    const showConditionals=()=>{
      const urgent=urgency.value==='Urgente';
      $('[data-cond="urgente"]',quoteForm).classList.toggle('show',urgent);
      emergency.required=urgent;
      if(!urgent)emergency.value='';
      $('[data-cond="preventiva"]',quoteForm).classList.toggle('show',service.value==='manutencao-preventiva');
    };
    service.addEventListener('change',showConditionals);
    urgency.addEventListener('change',showConditionals);
    const initialService=new URLSearchParams(location.search).get('servico');
    if(initialService && [...service.options].some(o=>o.value===initialService))service.value=initialService;
    showConditionals();
    const showStep=n=>{
      step=n;
      $$('[data-quote-step]',quoteForm).forEach(el=>el.classList.toggle('active',Number(el.dataset.quoteStep)===n));
      $$('.quote-progress span',quoteForm).forEach((el,i)=>el.classList.toggle('active',i<n));
      showError(quoteForm,'');
      quoteForm.scrollIntoView({block:'start',behavior:reducedMotion?'instant':'smooth'});
    };
    const validate=()=>{
      const fields=step===1?['service','property','region','urgency',...(urgency.value==='Urgente'?['emergency']:[])]:['description','contact','email'];
      for (const name of fields){
        const el=$(`[name="${name}"]`,quoteForm);
        if(!el.checkValidity()){
          el.reportValidity();showError(quoteForm,'Preencha os campos obrigatórios desta etapa antes de continuar.');return false;
        }
      }
      return true;
    };
    $$('[data-quote-next]',quoteForm).forEach(button=>button.addEventListener('click',()=>{
      if(!validate())return;
      if(step===2){
        const property=$('[name="property"]',quoteForm);
        const fields=[
          ['Serviço',serviceToLabel(service.value)],
          ['Tipo de imóvel',property.value],
          ['Região',$('[name="region"]',quoteForm).value.trim()],
          ['Prioridade',urgency.value],
          ...(urgency.value==='Urgente'?[['Risco imediato',emergency.value]]:[]),
          ...(service.value==='manutencao-preventiva'?[['Periodicidade',$('[name="frequency"]',quoteForm).value]]:[]),
          ['Descrição',$('[name="description"]',quoteForm).value.trim()],
          ['Nome de exemplo',$('[name="contact"]',quoteForm).value.trim()],
          ['E-mail de exemplo',$('[name="email"]',quoteForm).value.trim()]
        ];
        appendReview($('[data-quote-summary]',quoteForm),fields);
      }
      showStep(step+1);
    }));
    $$('[data-quote-back]',quoteForm).forEach(b=>b.addEventListener('click',()=>showStep(Math.max(1,step-1))));
    $('[data-quote-complete]',quoteForm).addEventListener('click',()=>{
      $('[data-quote-done]',quoteForm).hidden=false;
      $('[data-quote-complete]',quoteForm).hidden=true;
    });
    $('[data-quote-reset]',quoteForm).addEventListener('click',()=>{
      quoteForm.reset();
      $('[data-quote-done]',quoteForm).hidden=true;
      $('[data-quote-complete]',quoteForm).hidden=false;
      showConditionals();showStep(1);
    });
    quoteForm.addEventListener('submit',e=>e.preventDefault());
  }

  // Risco — functional contrast experiment and lightweight pointer response.
  $$('[data-risco-swap]').forEach(panel=>{
    $('[data-risco-palette]',panel)?.addEventListener('click',()=>{
      const inverse=panel.dataset.inverse==='true';
      panel.dataset.inverse=String(!inverse);
      panel.style.background=inverse?'#D9FF3F':'#17191D';
      panel.style.color=inverse?'#151515':'#D9FF3F';
      const button=$('[data-risco-palette]',panel);
      // Preserve the vector icon on palette swaps; never fall back to an emoji glyph.
      const icon=button.querySelector('.ui-icon')?.cloneNode(true);
      button.textContent=T(inverse?'Inverter linguagem ':'Voltar à linguagem original ');
      if(icon)button.append(icon);
      button.style.color='inherit';button.style.borderColor='currentColor';
    });
  });
  if(!reducedMotion){
    $$('[data-risco-parallax]').forEach(panel=>{
      panel.addEventListener('pointermove',event=>{
        if(event.pointerType==='touch')return;
        const rect=panel.getBoundingClientRect();
        const x=((event.clientX-rect.left)/rect.width-.5)*15;
        const y=((event.clientY-rect.top)/rect.height-.5)*12;
        panel.style.setProperty('--pointer-x',`${x}px`);
        panel.style.setProperty('--pointer-y',`${y}px`);
      },{passive:true});
      panel.addEventListener('pointerleave',()=>{panel.style.setProperty('--pointer-x','0px');panel.style.setProperty('--pointer-y','0px');});
    });
  }
})();
