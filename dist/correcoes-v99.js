(()=>{
const grids=[...document.querySelectorAll('.sample-grid:not(.image-grid)')];
function organize(grid){const cards=[...grid.querySelectorAll('.sample-card')];if(!cards.length)return;
if(grid.classList.contains('print-grid')){const wide=cards.filter(c=>c.classList.contains('video-landscape')),upright=cards.filter(c=>!c.classList.contains('video-landscape'));cards.splice(0,cards.length,...upright,...wide)}
const key=cards.map(c=>c.querySelector('.sample-video').dataset.driveId+':'+c.classList.contains('video-landscape')).join('|');if(grid.dataset.layoutKey===key){center();return}grid.dataset.layoutKey=key;grid.replaceChildren();grid.classList.add('video-rows');let row,used=4,previousWide=false;
for(const c of cards){const span=c.classList.contains('video-landscape')?2:1;const wide=span===2;if(c.dataset.rowStart==='true'||used+span>4||(grid.classList.contains('print-grid')&&wide&&!previousWide)){row=document.createElement('div');row.className='video-row';grid.append(row);used=0}row.append(c);used+=span;previousWide=wide}
center()}
function center(){document.querySelectorAll('.video-row').forEach(row=>{const cards=[...row.children];const portrait=cards.filter(c=>!c.classList.contains('video-landscape'));const ref=Math.max(0,...portrait.map(c=>c.querySelector('.sample-video').getBoundingClientRect().height));cards.filter(c=>c.classList.contains('video-landscape')).forEach(c=>{c.style.setProperty('--center-offset',innerWidth>1000&&ref?Math.max(0,(ref-c.getBoundingClientRect().height)/2)+'px':'0px')})})}
let timer;function schedule(){clearTimeout(timer);timer=setTimeout(()=>grids.forEach(organize),40)}
document.querySelectorAll('.sample-video img').forEach(img=>img.addEventListener('load',schedule));window.addEventListener('load',schedule);window.addEventListener('resize',schedule);document.fonts.ready.then(schedule);schedule();
})();