(()=>{'use strict';
const preview=document.getElementById('recording-preview-video');let stopPreview=()=>{};
document.addEventListener('play',e=>{if(!e.target.matches('video,audio'))return;document.querySelectorAll('video,audio').forEach(m=>{if(m!==e.target)m.pause()});if(e.target!==preview&&!e.target.muted)stopPreview()},true);
const cards=[...document.querySelectorAll('video[data-recording-src]')];const attach=v=>{if(!v.getAttribute('src'))v.src=v.dataset.recordingSrc};
if('IntersectionObserver'in window){const lazy=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){attach(e.target);lazy.unobserve(e.target)}}),{rootMargin:'250px'});cards.forEach(v=>lazy.observe(v))}else cards.forEach(attach);
if(!preview)return;
fetch('locucoes-dados-v92.json').then(r=>{if(!r.ok)throw Error('Dados');return r.json()}).then(items=>{
let i=0,timer=null,visible=false,listening=false,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
const title=document.getElementById('recording-preview-title'),counter=document.getElementById('recording-counter'),pause=document.getElementById('recording-pause'),listen=document.getElementById('recording-listen');
const clear=()=>{clearInterval(timer);timer=null};const label=()=>{pause.textContent=paused?'Continuar':'Pausar';pause.setAttribute('aria-pressed',String(paused))};
const play=()=>{if(!preview.getAttribute('src'))preview.src=items[i].src;preview.play().catch(()=>{})};
const start=()=>{clear();if(!paused&&!listening&&visible&&!document.hidden)timer=setInterval(()=>show(i+1),5000)};
function show(n){clear();i=(n+items.length)%items.length;preview.pause();preview.muted=true;preview.controls=false;preview.removeAttribute('src');preview.load();preview.poster=items[i].poster;title.textContent=items[i].title;counter.textContent=`${i+1} de ${items.length}`;listening=false;listen.textContent='Ouvir amostra';const frame=preview.parentElement;frame.classList.remove('is-changing');void frame.offsetWidth;frame.classList.add('is-changing');if(visible&&!paused&&!document.hidden)play();start()}
stopPreview=()=>{paused=true;clear();preview.pause();label()};
document.getElementById('recording-prev').addEventListener('click',()=>show(i-1));document.getElementById('recording-next').addEventListener('click',()=>show(i+1));
pause.addEventListener('click',()=>{paused=!paused;label();if(paused){clear();preview.pause()}else{listening=false;preview.muted=true;preview.controls=false;if(visible&&!document.hidden)play();start()}});
listen.addEventListener('click',()=>{clear();paused=false;label();listening=true;preview.muted=false;preview.controls=true;if(!preview.getAttribute('src'))preview.src=items[i].src;preview.currentTime=0;preview.play().catch(()=>{});listen.textContent='Reiniciar amostra'});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clear();preview.pause()}else if(visible&&!paused&&!listening){play();start()}});
if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&!paused&&!document.hidden&&!listening){play();start()}else if(!visible){clear();preview.pause()}},{threshold:.2}).observe(preview);else{visible=true;show(0)}
label();show(0);
}).catch(()=>{document.querySelector('.recording-preview-controls').hidden=true;document.getElementById('recording-listen').hidden=true});
})();
