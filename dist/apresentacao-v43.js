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
    controls.innerHTML = '<button type="button" class="carousel-prev" aria-label="Anterior">‹</button><button type="button" class="carousel-pause" aria-pressed="false">Pausar</button><button type="button" class="carousel-next" aria-label="Próximo">›</button>';
    root.after(controls);
    const dots = document.createElement('div');
    dots.className = 'carousel-dots';
    dots.setAttribute('aria-label', 'Posição no carrossel');
    slides.forEach((slide, i) => {
      const dot = document.createElement('button');
      dot.type='button'; dot.setAttribute('aria-label', `Mostrar item ${i+1} de ${slides.length}`);
      dot.addEventListener('click', () => {show(i, i<current?-1:1);start();});
      dots.append(dot);
      slide.hidden = i !== 0;
      slide.setAttribute('aria-label', `${i+1} de ${slides.length}`);
    });
    controls.after(dots);
    let current = 0, timer, paused = false, animating = false;
    const mark = () => [...dots.children].forEach((dot,i) => dot.setAttribute('aria-current', String(i===current)));
    const show = (n, direction=1) => {
      const next = (n + slides.length) % slides.length;
      if (next===current || animating) return;
      const outgoing=slides[current], incoming=slides[next];
      current=next;mark();incoming.hidden=false;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches || !incoming.animate) {outgoing.hidden=true;return;}
      animating=true;
      outgoing.setAttribute('inert','');
      const options={duration:650,easing:'cubic-bezier(.25,.1,.25,1)'};
      const out=outgoing.animate([{transform:'translateX(0)'},{transform:`translateX(${-direction*100}%)`}], options);
      const enter=incoming.animate([{transform:`translateX(${direction*100}%)`},{transform:'translateX(0)'}], options);
      Promise.allSettled([out.finished,enter.finished]).then(() => {
        outgoing.hidden=true;outgoing.removeAttribute('inert');animating=false;
        window.dispatchEvent(new Event('resize'));
      });
    };
    const stop = () => clearInterval(timer);
    const start = () => {stop(); if (interval && !paused && !document.hidden && !matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => show(current+1), interval);};
    const move = step => {show(current+step, step);start();};
    controls.querySelector('.carousel-prev').addEventListener('click', () => move(-1));
    controls.querySelector('.carousel-next').addEventListener('click', () => move(1));
    if (interval) {
      const pause = controls.querySelector('.carousel-pause');
      pause.addEventListener('click', () => {paused=!paused;pause.textContent=paused?'Continuar':'Pausar';pause.setAttribute('aria-pressed',String(paused));start();});
      root.addEventListener('mouseenter',stop);root.addEventListener('mouseleave',start);
      root.addEventListener('focusin',stop);root.addEventListener('focusout',start);
      controls.addEventListener('focusin',stop);controls.addEventListener('focusout',start);
      document.addEventListener('visibilitychange',start);
    }
    let touch;
    root.addEventListener('touchstart', e => {touch=e.changedTouches[0];stop();}, {passive:true});
    root.addEventListener('touchend', e => {if(touch){const end=e.changedTouches[0], dx=end.clientX-touch.clientX,dy=end.clientY-touch.clientY;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1);touch=null;}start();}, {passive:true});
    mark(); start();
  }
  carousel('.service-stack', 'Áreas de atuação', 8000);
  carousel('.review-grid', 'Depoimentos', 8000);
  carousel('.project-logo-carousel', 'Projetos da DLD', 5000);
  const floating=document.querySelector('.floating-actions'), footer=document.querySelector('.site-footer');
  if(floating && footer && matchMedia('(max-width:760px)').matches) footer.before(floating);
})();
