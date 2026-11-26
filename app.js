/* Radar Moreira — app opcional: instalar, ativar avisos, novidades desde a última visita */
(function(){
const LS={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
const instalado=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
let promptEvt=null;
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{})}
const box=document.createElement('section');box.className='appbox';box.id='appbox';
box.innerHTML=`<div class="appico"><img src="app/icon-192.png" alt=""></div>
<div class="apptxt"><b>Quer receber as novidades no celular?</b><p>É opcional. Você pode continuar acessando por este link normalmente. Se preferir, instale o aplicativo da Moreira e ative os avisos para saber quando sair uma novidade ou estiver chegando um prazo.</p>
<div class="row appbtns"><button class="pri" id="appInstall">Instalar o aplicativo</button><button id="appNotif">Ativar avisos no celular</button><button class="lnk2" id="appClose">Agora não</button></div>
<p class="appios" id="appIos" hidden>No iPhone: toque em <b>Compartilhar</b> (o quadrado com a seta) e depois em <b>Adicionar à Tela de Início</b>. Depois abra o app pela tela inicial e toque em “Ativar avisos”.</p>
<p class="appmsg" id="appMsg"></p></div>`;
function montar(){const ref=document.getElementById('capp')||document.getElementById('areaTabs');if(!ref){setTimeout(montar,300);return}ref.parentNode.insertBefore(box,ref);box.classList.add('apptopo');atualizar()}
function atualizar(){const fechado=LS.get('radar_app_fechado')==='1';const perm=('Notification' in window)?Notification.permission:'unsupported';
  const bi=document.getElementById('appInstall'),bn=document.getElementById('appNotif');
  bi.hidden=instalado;bn.hidden=perm==='granted'||perm==='unsupported';
  if(perm==='granted'){document.getElementById('appMsg').textContent='Avisos ativados neste aparelho.'}
  if(perm==='unsupported'&&ios&&!instalado){bn.hidden=true}
  box.hidden=(fechado&&!instalado)||(instalado&&perm==='granted');}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvt=e});
window.addEventListener('appinstalled',()=>{document.getElementById('appMsg').textContent='Aplicativo instalado! Procure o ícone “Radar Moreira” na tela do celular.';document.getElementById('appInstall').hidden=true});
document.addEventListener('click',async e=>{
  if(e.target.id==='appInstall'){if(promptEvt){promptEvt.prompt();await promptEvt.userChoice;promptEvt=null}else if(ios){document.getElementById('appIos').hidden=false}else{document.getElementById('appMsg').textContent='No menu do navegador (⋮), toque em “Instalar app” ou “Adicionar à tela inicial”.'}}
  if(e.target.id==='appNotif'){if(!('Notification' in window)){document.getElementById('appIos').hidden=!ios;document.getElementById('appMsg').textContent=ios?'No iPhone, os avisos funcionam depois de instalar o app na tela de início.':'Este navegador não permite avisos.';return}
    const p=await Notification.requestPermission();
    if(p==='granted'){try{const reg=await navigator.serviceWorker.ready;if(reg.periodicSync){try{await reg.periodicSync.register('radar-novidades',{minInterval:6*60*60*1000})}catch(x){}}
      reg.active&&reg.active.postMessage('checar');reg.showNotification('Avisos da Moreira ativados',{body:'Você vai receber um aviso quando sair uma novidade para a sua empresa.',icon:'app/icon-192.png',badge:'app/badge-96.png'})}catch(x){}
      document.getElementById('appMsg').textContent='Avisos ativados neste aparelho.'}
    else document.getElementById('appMsg').textContent='Tudo bem! Você pode ativar depois, quando quiser.';atualizar()}
  if(e.target.id==='appClose'){LS.set('radar_app_fechado','1');box.hidden=true}
});
/* novidades desde a última visita */
Promise.all([fetch('data.json?v='+Date.now(),{cache:'no-store'}).then(r=>r.json()),fetch('visibilidade.json?v='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():{}).catch(()=>({}))]).then(([d,vj])=>{const vis=(vj&&vj.itens)||{};const ids=(d.atualizacoes||[]).filter(a=>{const x=vis[a.id];return x&&typeof x.cliente==='boolean'?x.cliente:a.cliente!==false}).map(x=>x.id);const old=LS.get('radar_vistos');
  if(old){const v=JSON.parse(old);const n=ids.filter(i=>!v.includes(i)).length;if(n){const c=document.createElement('div');c.className='novas';c.innerHTML=`<b>${n} ${n>1?'novidades':'novidade'}</b> desde a sua última visita`;const h=document.querySelector('.hero .wrap');h&&h.insertBefore(c,document.getElementById('status'))}}
  LS.set('radar_vistos',JSON.stringify(ids));if(navigator.clearAppBadge)navigator.clearAppBadge().catch(()=>{})}).catch(()=>{});
montar();
})();
