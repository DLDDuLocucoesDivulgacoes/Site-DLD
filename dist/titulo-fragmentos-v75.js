(() => {
 const root=document.querySelector('.hero-copy'); if(!root)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const nodes=[...root.querySelectorAll('.hero-title-solid,.hero-title-outline,.eyebrow,.summary')];
 const layers=nodes.map((el)=>{el.classList.add('fragment-source');const layer=document.createElement('span');layer.className='fragment-overlay';layer.textContent=el.textContent;layer.setAttribute('aria-hidden','true');layer.style.setProperty('--fragment-color',el.matches('.eyebrow,.summary')?'#fcf8f8':'#ed1b24');el.append(layer);return layer});
 // Fixed randomized order: small rectangular pieces reveal across the entire text.
 const cols=32,rows=8,total=cols*rows;
 const order=Array.from({length:total},(_,i)=>i);let seed=751;
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 for(let i=total-1;i>0;i--){const k=Math.floor(random()*(i+1));[order[i],order[k]]=[order[k],order[i]]}
 function mask(progress,time){const n=Math.round(progress*total);let rects='';for(let i=0;i<n;i++){const cell=order[i];if(progress>0&&progress<1&&i>n-14&&Math.sin(time/65+cell)>0.7)continue;rects+=`<rect x="${cell%cols}" y="${Math.floor(cell/cols)}" width="1.01" height="1.01" fill="white"/>`}
 return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cols} ${rows}" preserveAspectRatio="none">${rects}</svg>`)}")`}
 let last=-1;const start=performance.now();
 function tick(now){const t=(now-start)%16000;let p=t<4000?0:t<6000?(t-4000)/2000:t<10000?1:t<12000?1-(t-10000)/2000:0;if(reduce.matches)p=0;
 const frame=Math.floor(now/60);if(frame!==last){const m=mask(p,now);for(const layer of layers){layer.style.maskImage=m;layer.style.webkitMaskImage=m}last=frame}requestAnimationFrame(tick)}requestAnimationFrame(tick);
})();