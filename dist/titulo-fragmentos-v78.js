(()=>{
const root=document.querySelector('.hero-copy');if(!root)return;
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
const nodes=[...root.querySelectorAll('.hero-title-solid,.hero-title-outline,.eyebrow,.summary')];
const layers=nodes.map(el=>{const text=el.textContent;el.textContent='';el.classList.add('signal-text');const base=document.createElement('span');base.className='signal-base';base.textContent=text;const next=base.cloneNode(true);next.className='signal-next';next.setAttribute('aria-hidden','true');el.append(base,next);return {el,base,next}});
let seed=77;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const cols=64,rows=18;const cells=Array.from({length:cols*rows},(_,i)=>({x:i%cols,y:Math.floor(i/cols),threshold:rand()}));
function masks(progress,time){let whitePath='',redPath='';for(const c of cells){const wobble=Math.abs(c.threshold-progress)<.045?Math.sin(time/42+c.x*3+c.y)*.035:0;const piece=`M${c.x} ${c.y}h1v1h-1z`;if(c.threshold<progress+wobble)redPath+=piece;else whitePath+=piece;}
const svg=path=>`url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cols} ${rows}" preserveAspectRatio="none"><path d="${path}" fill="white"/></svg>`)}")`;
return [svg(whitePath),svg(redPath)]}
let origin=performance.now(),last=-1;
function frame(now){const t=(now-origin)%14000;let p=t<3500?0:t<5500?(t-3500)/2000:t<9000?1:t<11000?1-(t-9000)/2000:0;if(reduced.matches)p=0;
if(Math.floor(now/65)!==last){last=Math.floor(now/65);const m=p>0&&p<1?masks(p,now):null;for(const {base,next}of layers){base.style.visibility=p===1?'hidden':'visible';next.style.visibility=p===0?'hidden':'visible';base.style.maskImage=m?m[0]:'none';base.style.webkitMaskImage=m?m[0]:'none';next.style.maskImage=m?m[1]:'none';next.style.webkitMaskImage=m?m[1]:'none'}}requestAnimationFrame(frame)}requestAnimationFrame(frame);
})();