(() => {
 'use strict';
 document.querySelectorAll('.sample-video').forEach(frame=>{
  const button=frame.querySelector('button');
  const image=button.querySelector('img');
  const orient=()=>{if(image.naturalWidth&&image.naturalHeight){frame.style.setProperty('--video-ratio',`${image.naturalWidth}/${image.naturalHeight}`);frame.closest('.sample-card').classList.toggle('video-landscape',image.naturalWidth>image.naturalHeight);}};
  image.addEventListener('load',orient);orient();
  image.addEventListener('error',()=>{image.hidden=true;});
  button.addEventListener('click',()=>{
   document.querySelectorAll('.sample-video iframe').forEach(other=>{
    const parent=other.parentElement;other.remove();parent.querySelector('button').hidden=false;
   });
   const iframe=document.createElement('iframe');
   iframe.src=`https://drive.google.com/file/d/${encodeURIComponent(frame.dataset.driveId)}/preview`;
   iframe.title=button.getAttribute('aria-label');
   iframe.allow='autoplay; fullscreen; picture-in-picture';iframe.allowFullscreen=true;
   button.hidden=true;frame.append(iframe);iframe.focus();
  });
 });
 document.querySelectorAll('.audiovisual-card').forEach(card=>{
  const frame=card.querySelector('iframe');if(!frame)return;
  const id=frame.src.match(/\/d\/([^/]+)/)?.[1];if(!id)return;
  const probe=new Image();probe.onload=()=>{if(probe.naturalWidth&&probe.naturalHeight){frame.style.setProperty('--video-ratio',`${probe.naturalWidth}/${probe.naturalHeight}`);card.classList.toggle('video-landscape',probe.naturalWidth>probe.naturalHeight);}};
  probe.src=`https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w400`;
 });
 const dialog=document.querySelector('.image-dialog');
 if(!dialog)return;
 const img=dialog.querySelector('img'),caption=dialog.querySelector('figcaption');let opener;
 document.querySelectorAll('[data-enlarge]').forEach(button=>button.addEventListener('click',()=>{
  opener=button;dialog.classList.toggle('logo-dialog',button.classList.contains('sample-logo'));img.src=button.dataset.enlarge;img.alt=button.dataset.title;caption.textContent=button.dataset.title;dialog.showModal();
 }));
 dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
 dialog.addEventListener('close',()=>opener?.focus());
})();
