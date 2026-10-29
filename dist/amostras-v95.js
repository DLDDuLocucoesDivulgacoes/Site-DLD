(() => {
 'use strict';
 document.querySelectorAll('.sample-video').forEach(frame=>{
  const button=frame.querySelector('button');
  const image=button.querySelector('img');
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
 const dialog=document.querySelector('.image-dialog');
 if(!dialog)return;
 const img=dialog.querySelector('img'),caption=dialog.querySelector('figcaption');let opener;
 document.querySelectorAll('[data-enlarge]').forEach(button=>button.addEventListener('click',()=>{
  opener=button;img.src=button.dataset.enlarge;img.alt=button.dataset.title;caption.textContent=button.dataset.title;dialog.showModal();
 }));
 dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
 dialog.addEventListener('close',()=>opener?.focus());
})();
