/* Control de Merma: red primero; no almacenar respuestas de Supabase. */
const CACHE='control-merma-shell-2026-10-29-2';
const ASSETS=['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install', event=>{
 event.waitUntil((async()=>{
   const cache=await caches.open(CACHE);
   await Promise.all(ASSETS.map(async path=>{
     try{const r=await fetch(path,{cache:'reload'});if(r.ok)await cache.put(path,r)}catch(e){}
   }));
   // No forzar activación sobre una captura abierta.
 })());
});
self.addEventListener('message',event=>{
 if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith('control-merma-shell-')||k.startsWith('merma-v07-')).filter(k=>k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin)return;
 if(url.pathname.endsWith('/version.json'))return; // comprobación siempre fresca
 if(request.mode==='navigate'){
  event.respondWith((async()=>{
   try{return await fetch(request,{cache:'no-store'})}
   catch(e){return (await caches.match('./index.html'))||Response.error()}
  })());
  return;
 }
 if(!ASSETS.some(p=>url.pathname.endsWith(p.slice(1))))return;
 event.respondWith((async()=>{
  try{const response=await fetch(request,{cache:'no-store'});return response}
  catch(e){return (await caches.match(request))||Response.error()}
 })());
});
