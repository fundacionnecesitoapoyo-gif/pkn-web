const V='pk3d-v1';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);
 if(/pokeapi|showdown/.test(u.host)||u.origin===location.origin&&/\/(ui|sprites|data)\//.test(u.pathname)||/cdnjs|fonts/.test(u.host)){
  e.respondWith(caches.open(V).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{if(n.ok||n.type==='opaque')c.put(e.request,n.clone());return n}).catch(()=>r))))}
 else e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)))});
