/* Radar Moreira — service worker (app opcional do cliente) */
const CACHE='radar-moreira-v2';
const SHELL=['./cliente.html','./cards.js','./brand/moreira_horizontal_branco_1000w.png','./brand/moreira_horizontal_azul_1000w.png','./app/icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  // dados e páginas: rede primeiro (sempre atualizado), cache se estiver sem internet
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})))});
/* verificação em segundo plano (Android com o app instalado) */
async function checar(){try{const r=await fetch('./data.json?sw='+Date.now(),{cache:'no-store'});const d=await r.json();let vis={};try{const v=await fetch('./visibilidade.json?sw='+Date.now(),{cache:'no-store'});if(v.ok)vis=(await v.json()).itens||{}}catch(x){}
  d.atualizacoes=(d.atualizacoes||[]).filter(a=>{const x=vis[a.id];return x&&typeof x.cliente==='boolean'?x.cliente:a.cliente!==false});
  const c=await caches.open('radar-moreira-estado');const old=await c.match('vistos');const vistos=old?await old.json():null;
  const ids=(d.atualizacoes||[]).map(x=>x.id);
  if(vistos){const novos=(d.atualizacoes||[]).filter(x=>!vistos.includes(x.id));
    if(novos.length){const n=novos[0];const t=(s)=>String(s||'').replace(/\*\*/g,'');
      await self.registration.showNotification(novos.length>1?`${novos.length} novidades da Moreira`:'Novidade da Moreira Contabilidade',{body:t(n.card_titulo||n.titulo)+(n.card_destaque?' '+t(n.card_destaque):''),icon:'./app/icon-192.png',badge:'./app/badge-96.png',tag:'radar-moreira',data:{url:'./cliente.html?app=1'}});
      if(self.navigator&&navigator.setAppBadge)navigator.setAppBadge(novos.length).catch(()=>{})}}
  await c.put('vistos',new Response(JSON.stringify(ids)))}catch(e){}}
self.addEventListener('periodicsync',e=>{if(e.tag==='radar-novidades')e.waitUntil(checar())});
self.addEventListener('message',e=>{if(e.data==='checar')e.waitUntil(checar())});
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch(x){d={title:'Moreira Contabilidade',body:e.data&&e.data.text()}}
  e.waitUntil(self.registration.showNotification(d.title||'Novidade da Moreira Contabilidade',{body:d.body||'',icon:'./app/icon-192.png',badge:'./app/badge-96.png',data:{url:d.url||'./cliente.html?app=1'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=(e.notification.data&&e.notification.data.url)||'./cliente.html';
  e.waitUntil(self.clients.matchAll({type:'window'}).then(ws=>{for(const w of ws){if(w.url.includes('cliente.html'))return w.focus()}return self.clients.openWindow(url)}))});
