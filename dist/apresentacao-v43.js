(() => {
  function carousel(selector, label, interval) {
    const root = document.querySelector(selector);
    if (!root) return;
    const slides = [...root.children];
    if (slides.length < 2) return;
    root.classList.add('dld-carousel');
    root.setAttribute('role', 'region');
    root.setAttribute('aria-roledescription', 'carrossel');
    root.setAttribute('aria-label', label);
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';
    controls.innerHTML = '<button type="button" aria-label="Anterior">‹</button><span class="carousel-count"></span><button type="button" aria-label="Próximo">›</button>';
    root.after(controls);
    const count = controls.querySelector('.carousel-count');
    let current = 0, timer, paused = false;
    const show = n => {
      current = (n + slides.length) % slides.length;
      slides.forEach((slide, i) => {slide.hidden = i !== current; slide.setAttribute('aria-label', `${i+1} de ${slides.length}`);});
      count.textContent = `${current+1} / ${slides.length}`;
      window.dispatchEvent(new Event('resize'));
    };
    const stop = () => clearInterval(timer);
    const start = () => {stop(); if (interval && !paused && !document.hidden && !matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => show(current+1), interval);};
    const move = step => {show(current+step);start();};
    controls.querySelectorAll('button')[0].addEventListener('click', () => move(-1));
    controls.querySelectorAll('button')[1].addEventListener('click', () => move(1));
    if (interval) {
      const pause = document.createElement('button'); pause.type='button'; pause.className='carousel-pause'; pause.textContent='Pausar'; pause.setAttribute('aria-pressed','false'); controls.append(pause);
      pause.addEventListener('click', () => {paused=!paused;pause.textContent=paused?'Continuar':'Pausar';pause.setAttribute('aria-pressed',String(paused));start();});
      root.addEventListener('mouseenter',stop);root.addEventListener('mouseleave',start);
      root.addEventListener('focusin',stop);root.addEventListener('focusout',start);
      controls.addEventListener('focusin',stop);controls.addEventListener('focusout',start);
      document.addEventListener('visibilitychange',start);
    }
    let touch;
    root.addEventListener('touchstart', e => {touch=e.changedTouches[0];stop();}, {passive:true});
    root.addEventListener('touchend', e => {if(touch){const end=e.changedTouches[0], dx=end.clientX-touch.clientX,dy=end.clientY-touch.clientY;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1);touch=null;}start();}, {passive:true});
    show(0); start();
  }
  carousel('.service-stack', 'Áreas de atuação', 0);
  carousel('.review-grid', 'Depoimentos', 5000);
  const floating=document.querySelector('.floating-actions'), footer=document.querySelector('.site-footer');
  if(floating && footer && matchMedia('(max-width:760px)').matches) footer.before(floating);
})();
