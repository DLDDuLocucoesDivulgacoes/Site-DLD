(()=>{
'use strict';

// Re-evaluate after CSS/fonts and viewport changes. Left-aligned titles stay unchanged.
const titleHeadings=[...document.querySelectorAll('main h1,main h2,main h3')].filter(h=>!h.closest('.work,.project-logo-slide,.dld-sample-hero,.sample-caption,.card-caption'));
const updateProjectTitles=()=>document.querySelectorAll('.project-logo-slide h3').forEach(title=>{
 title.classList.remove('dld-project-title');
 const originalSize=parseFloat(getComputedStyle(title).fontSize);
 title.style.setProperty('--project-title-size',originalSize*1.05+'px');
 title.classList.add('dld-project-title');
});
const updateTitleBands=()=>{
 updateProjectTitles();
 document.querySelectorAll('.dld-title-band').forEach(e=>e.classList.remove('dld-title-band'));
 titleHeadings.forEach(h=>{
  if(getComputedStyle(h).textAlign!=='center')return;
  h.classList.add('dld-title-band');
 });
};
let titleFrame;const queueTitleBands=()=>{cancelAnimationFrame(titleFrame);titleFrame=requestAnimationFrame(updateTitleBands)};
window.addEventListener('load',queueTitleBands);window.addEventListener('resize',queueTitleBands);document.fonts.ready.then(queueTitleBands);queueTitleBands();
document.querySelectorAll('.portfolio .portfolio-grid>.work').forEach(card=>{
 const clear=()=>card.classList.remove('dld-touch-active');
 card.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')card.classList.add('dld-touch-active')});
 card.addEventListener('pointerup',clear);card.addEventListener('pointercancel',clear);card.addEventListener('pointerleave',clear);card.addEventListener('blur',clear);
});

const playerObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){const frame=entry.target;frame.src=frame.dataset.playerSrc;playerObserver.unobserve(frame)}}),{rootMargin:'100px'});
document.querySelectorAll('iframe[data-player-src]').forEach(frame=>playerObserver.observe(frame));
document.querySelectorAll('.sample-image img').forEach(img=>{let tried=false;img.addEventListener('load',()=>img.parentElement.classList.remove('media-failed'));img.addEventListener('error',()=>{if(!tried){tried=true;const url=new URL(img.src,location.href);url.searchParams.set('v','100');img.src=url.href}else{img.parentElement.classList.add('media-failed')}})});
document.querySelectorAll('video').forEach(video=>{let panel;video.addEventListener('error',()=>{if(panel)return;panel=document.createElement('div');panel.className='media-recovery';const message=document.createElement('span');message.textContent='Não foi possível carregar este vídeo.';const retry=document.createElement('button');retry.type='button';retry.textContent='Tentar novamente';retry.addEventListener('click',()=>{const src=video.dataset.recordingSrc||video.currentSrc||video.getAttribute('src');if(src)video.src=src;video.controls=true;video.load();video.play().catch(()=>{})});panel.append(message,retry);const src=video.dataset.recordingSrc||video.currentSrc||video.getAttribute('src');if(src){const a=document.createElement('a');a.href=src;a.textContent='Abrir vídeo em nova guia';a.target='_blank';a.rel='noopener';panel.append(a)}video.parentElement.after(panel)});video.addEventListener('playing',()=>{panel?.remove();panel=null})});
const dialog=document.querySelector('.image-dialog');if(dialog){const img=dialog.querySelector('img'),caption=dialog.querySelector('figcaption');let opener;document.querySelectorAll('[data-enlarge]').forEach(button=>button.addEventListener('click',()=>{if(button.classList.contains('media-failed')){button.querySelector('img').src=button.dataset.enlarge+'?retry='+Date.now();return}opener=button;dialog.classList.toggle('logo-dialog',button.classList.contains('sample-logo'));img.src=button.dataset.enlarge;img.alt=button.dataset.title;caption.textContent=button.dataset.title;dialog.showModal()}));dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog.addEventListener('close',()=>opener?.focus())}
})();
/* v108: center the media frames themselves, independently of captions. */
(()=>{
 const rows=[...document.querySelectorAll('.video-row')];
 const align=()=>{
  rows.forEach(row=>{
   const cells=[...row.children];
   cells.forEach(cell=>cell.style.removeProperty('--media-center-offset'));
   if(window.innerWidth<=1000)return;
   const portraits=cells.filter(c=>!c.classList.contains('video-cell-wide'));
   if(!portraits.length)return;
   const portraitHeight=Math.max(...portraits.map(c=>c.querySelector('.sample-video')?.getBoundingClientRect().height||0));
   cells.filter(c=>c.classList.contains('video-cell-wide')).forEach(cell=>{
    const media=cell.querySelector('.sample-video');
    if(media)cell.style.setProperty('--media-center-offset',Math.max(0,(portraitHeight-media.getBoundingClientRect().height)/2)+'px');
   });
  });
 };
 let frame;const queue=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(align)};
 const observer=new ResizeObserver(queue);
 rows.forEach(row=>row.querySelectorAll('.sample-video').forEach(media=>observer.observe(media)));
 window.addEventListener('resize',queue);window.addEventListener('load',queue);document.fonts.ready.then(queue);queue();
})();
