const CACHE='merma-v07-shell-1';
const SHELL=['./','./index.html','./app.js','./styles.css','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(SHELL);const sdk='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.74.0';const response=await fetch(sdk,{mode:'no-cors'});await c.put(sdk,response);await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('merma-v07-')&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{const r=event.request;if(r.method!=='GET')return;
 const url=new URL(r.url);if(url.hostname.endsWith('supabase.co'))return;
 if(r.mode==='navigate'){event.respondWith((async()=>{try{return await fetch(r)}catch{return (await caches.match('./index.html'))||Response.error()}})());return}
 event.respondWith((async()=>{const cached=await caches.match(r);if(cached)return cached;return fetch(r)})());
});
