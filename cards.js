/* Cards de post Moreira Contabilidade — desenhados em canvas (1080x1350, feed Instagram/WhatsApp).
   Usa o logo oficial (PNG) e a Montserrat (fonte alternativa autorizada no manual da marca). */
window.MoreiraCards=(function(){
const C={azul:'#355380',a700:'#1D2E46',a900:'#0A101A',a950:'#06090F',a50:'#F2F4F7',a100:'#E3E7ED',a400:'#688BC0',
  ouro:'#A6841F',ouroL:'#D9B54A',ouro100:'#F5E9C2',c700:'#5C5D5F',c500:'#848688',branco:'#FFFFFF'};
const F='"Univia Pro","Montserrat","Poppins","Inter",sans-serif';
const W=1080,H=1350,M=88;
let assets={ready:false};
const MESES=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

async function load(base){
  base=base||'';
  try{await Promise.all(['900','700','500','400','300'].map(w=>document.fonts.load(w+' 40px Montserrat')))}catch(e){}
  const img=async f=>{try{const b=await (await fetch(base+'brand/'+f)).blob();return await createImageBitmap(b)}catch(e){return null}};
  [assets.logoBranco,assets.logoAzul]=await Promise.all([img('moreira_horizontal_branco_1000w.png'),img('moreira_horizontal_azul_1000w.png')]);
  assets.ready=true;return assets;
}
function br(d){const [y,m,dd]=String(d||'').split('-');return dd?`${dd}/${m}/${y}`:String(d||'')}
function brCurto(d){const [y,m,dd]=String(d||'').split('-');return dd?`${+dd} ${MESES[+m-1]}`:''}
function lines(x,t,w){const out=[];let line='';for(const word of String(t||'').split(/\s+/).filter(Boolean)){const test=line?line+' '+word:word;if(x.measureText(test).width>w&&line){out.push(line);line=word}else line=test}if(line)out.push(line);return out}
function fit(x,t,w,weight,max,min,maxLines){let s=max;for(;s>=min;s-=2){x.font=`${weight} ${s}px ${F}`;if(lines(x,t,w).length<=maxLines)break}return s}
function text(x,t,X,Y,w,lh,maxLines){let ls=lines(x,t,w);if(maxLines&&ls.length>maxLines){ls=ls.slice(0,maxLines);let l=ls[maxLines-1];while(x.measureText(l+'…').width>w&&l.length)l=l.slice(0,-1);ls[maxLines-1]=l.replace(/[\s,.;:]+$/,'')+'…'}ls.forEach((l,i)=>x.fillText(l,X,Y+i*lh));return Y+ls.length*lh}
function rr(x,X,Y,w,h,r){x.beginPath();x.roundRect?x.roundRect(X,Y,w,h,r):x.rect(X,Y,w,h)}
function logo(x,im,X,Y,w,center){if(!im){x.font=`900 44px ${F}`;x.fillText('MOREIRA',X,Y+44);return}const h=w*im.height/im.width;x.drawImage(im,center?X-w/2:X,Y,w,h)}
function chev(x,X,Y,s,col){x.save();x.strokeStyle=col;x.lineWidth=s*.16;x.lineCap='round';x.globalAlpha=.06;x.beginPath();x.moveTo(X,Y);x.lineTo(X+s,Y+s);x.lineTo(X,Y+2*s);x.stroke();x.restore()}
function footer(x,fonte,dark){
  const y=H-128;x.fillStyle=dark?C.ouro:C.ouro;x.fillRect(0,y,W,5);
  x.fillStyle=dark?'#0B1422':C.a700;x.fillRect(0,y+5,W,H-y-5);
  x.fillStyle='rgba(255,255,255,.72)';x.font=`400 22px ${F}`;x.textAlign='left';
  text(x,(fonte?`Fonte: ${fonte}. `:'')+'Conteúdo informativo.',M,y+54,480,30,2);
  x.textAlign='right';x.fillStyle=C.ouroL;x.font=`700 28px ${F}`;x.fillText('@moreiracontabilidadeltda',W-M,y+56);
  x.fillStyle='rgba(255,255,255,.72)';x.font=`400 22px ${F}`;x.fillText('(94) 99119-8085',W-M,y+92);x.textAlign='left';
}
function campos(i){
  return {tit:i.card_titulo||i.titulo||'',dest:i.card_destaque||'',sub:i.card_sub||i.resumo||'',
    pontos:Array.isArray(i.card_pontos)&&i.card_pontos.length?i.card_pontos.slice(0,3):[],acao:i.card_acao||i.acao||'',
    tema:i.card_tema||'Reforma Tributária',fonte:i.fonte_card||i.orgao||'',quando:i.card_quando||''}
}
/* Card de uma notícia — fundo azul profundo; o que é, o que muda, quando, o que fazer. Auto-ajusta a fonte para caber. */
function noticia(cv,i){
  const x=cv.getContext('2d');cv.width=W;cv.height=H;const k=campos(i),tw=W-2*M,footerY=H-128;
  const head=k.tit.toUpperCase(),dest=k.dest.toUpperCase(),pts=k.pontos.slice(0,4);
  // mede (ou desenha) o conteúdo com escala s
  const lay=(s,draw)=>{
    let hs=70;
    for(;hs>=46;hs-=2){x.font=`900 ${hs}px ${F}`;const n=lines(x,head,tw).length+(dest?lines(x,dest,tw).length:0);if(n<=3&&lines(x,head,tw).every(l=>x.measureText(l).width<=tw))break}
    const lh=hs*1.02;let y=200+hs*.8;
    x.font=`900 ${hs}px ${F}`;const l1=lines(x,head,tw),l2=dest?lines(x,dest,tw):[];
    if(draw){x.fillStyle=C.branco;l1.forEach((l,n)=>x.fillText(l,M,y+n*lh));x.fillStyle=C.ouroL;l2.forEach((l,n)=>x.fillText(l,M,y+(l1.length+n)*lh))}
    const fs=Math.round(31*s),flh=Math.round(fs*1.35);
    y+=(l1.length+l2.length-1)*lh+Math.round(hs*.6)+fs;x.font=`400 ${fs}px ${F}`;const ls=lines(x,k.sub,tw);
    if(draw){x.fillStyle='rgba(255,255,255,.88)';ls.forEach((l,n)=>x.fillText(l,M,y+n*flh))}
    y+=(ls.length-1)*flh+Math.round(34*s);
    if(k.quando){const qs=Math.round(25*s);x.font=`700 ${qs}px ${F}`;const lab='QUANDO: ',lw=x.measureText(lab).width;x.font=`700 ${qs}px ${F}`;
      const qt=k.quando,qw=Math.min(tw,lw+x.measureText(qt).width+56),qh=Math.round(qs*2.1);
      if(draw){x.strokeStyle=C.ouroL;x.lineWidth=2;rr(x,M,y,qw,qh,qh/2);x.stroke();x.fillStyle=C.ouroL;x.fillText(lab,M+28,y+qh/2+qs*.36);x.fillStyle=C.branco;x.fillText(qt,M+28+lw,y+qh/2+qs*.36)}
      y+=qh+Math.round(24*s)}
    if(pts.length){const ps=Math.round(29*s),plh=Math.round(ps*1.3),pad=Math.round(30*s);x.font=`500 ${ps}px ${F}`;
      const pl=pts.map(p=>lines(x,p,tw-2*pad-36));const inner=pl.reduce((a,l)=>a+l.length*plh+Math.round(16*s),0)-Math.round(16*s);
      const bh=pad+Math.round(30*s)+Math.round(18*s)+inner+pad;
      if(draw){x.fillStyle='rgba(255,255,255,.07)';rr(x,M,y,tw,bh,20);x.fill();x.strokeStyle='rgba(255,255,255,.14)';x.lineWidth=2;x.stroke();
        x.fillStyle=C.a400;x.font=`700 ${Math.round(23*s)}px ${F}`;x.fillText('O QUE MUDA PARA VOCÊ',M+pad,y+pad+Math.round(20*s));
        let py=y+pad+Math.round(30*s)+Math.round(18*s)+ps*.8;x.font=`500 ${ps}px ${F}`;
        pl.forEach(ll=>{x.fillStyle=C.ouroL;x.beginPath();x.arc(M+pad+8,py-ps*.32,Math.max(5,6*s),0,7);x.fill();x.fillStyle=C.branco;x.font=`500 ${ps}px ${F}`;ll.forEach((l,n)=>x.fillText(l,M+pad+30,py+n*plh));py+=ll.length*plh+Math.round(16*s)})}
      y+=bh+Math.round(24*s)}
    const as=Math.round(30*s),alh=Math.round(as*1.28);x.font=`700 ${as}px ${F}`;const al=lines(x,k.acao,tw-72);const ah=Math.round(36*s)+Math.round(22*s)+Math.round(18*s)+al.length*alh+Math.round(26*s);
    return {y,ah,al,as,alh,s}};
  // escolhe a maior escala que cabe
  const g=x.createLinearGradient(0,0,W*.4,H);g.addColorStop(0,C.azul);g.addColorStop(.45,C.a700);g.addColorStop(1,C.a950);x.fillStyle=g;x.fillRect(0,0,W,H);
  chev(x,640,120,380,'#fff');
  logo(x,assets.logoBranco,M,84,300);
  x.textAlign='right';x.fillStyle=C.ouroL;x.font=`700 26px ${F}`;x.fillText((k.tema+' · '+brCurto(i.data)).toUpperCase(),W-M,128);x.textAlign='left';
  let s=1.22,r=lay(s,false);while(s>.7&&r.y+r.ah>footerY-30){s-=.02;r=lay(s,false)}
  r=lay(s,true);
  const ay=Math.max(r.y,footerY-30-r.ah);
  x.fillStyle=C.ouro;rr(x,M,ay,tw,r.ah,20);x.fill();
  x.fillStyle=C.a950;x.font=`900 ${Math.round(23*s)}px ${F}`;x.fillText('O QUE VOCÊ DEVE FAZER',M+36,ay+Math.round(36*s)+Math.round(8*s));
  x.font=`700 ${r.as}px ${F}`;r.al.forEach((l,n)=>x.fillText(l,M+36,ay+Math.round(36*s)+Math.round(22*s)+Math.round(18*s)+r.as*.8+n*r.alh));
  footer(x,k.fonte,true);
}
/* Resumo — vários itens, fundo claro, logo azul centralizado */
function resumo(cv,list,d,titulo,linha2){
  const x=cv.getContext('2d');cv.width=W;cv.height=H;
  x.fillStyle=C.a50;x.fillRect(0,0,W,H);
  logo(x,assets.logoAzul,W/2,70,300,true);
  x.textAlign='center';x.fillStyle=C.a700;x.font=`900 74px ${F}`;x.fillText((titulo||'RADAR FISCAL').toUpperCase(),W/2,250);
  x.fillStyle=C.ouro;x.font=`900 74px ${F}`;x.fillText((linha2||'DA SEMANA').toUpperCase(),W/2,328);
  x.fillStyle=C.c700;x.font=`500 27px ${F}`;x.fillText('A Reforma Tributária explicada de forma simples · '+br(d),W/2,384);x.textAlign='left';
  const items=list.slice(0,3),top=430,bottom=H-128-40,gap=18,h=(bottom-top-gap*(items.length-1))/items.length,tw=W-2*M;
  items.forEach((i,n)=>{const k=campos(i),y=top+n*(h+gap);
    x.fillStyle='#fff';rr(x,M,y,tw,h,22);x.fill();x.fillStyle=n===0?C.ouro:C.azul;rr(x,M,y,10,h,[22,0,0,22]);x.fill();
    x.fillStyle=n===0?C.ouro:C.azul;x.font=`900 60px ${F}`;x.fillText(String(n+1),M+38,y+h/2+20);
    const t=(k.tit+(k.dest?' '+k.dest:''));const cw=tw-150,cx=M+116;x.fillStyle=C.a700;const s=fit(x,t,cw,700,34,24,1);x.font=`700 ${s}px ${F}`;
    let yy=text(x,t,cx,y+48,cw,s*1.15,1);
    x.font=`700 23px ${F}`;const an=Math.min(2,lines(x,'O que fazer: '+k.acao,cw).length);const sl=Math.max(1,Math.min(3,Math.floor((y+h-yy-20-an*30)/31)));
    x.fillStyle='#333435';x.font=`400 24px ${F}`;yy=text(x,k.sub,cx,yy+6,cw,31,sl);
    x.fillStyle=C.azul;x.font=`700 23px ${F}`;text(x,'O que fazer: '+k.acao,cx,yy+8,cw,30,2);
  });
  footer(x,'sites oficiais do governo (gov.br)',false);
}
/* Comunicado ao cliente como imagem Moreira — cabeçalho azul, carta em painel branco, ação em ouro.
   o = {data, tema, titulo, destaque, texto, acao, fonte, itens:[{titulo,acao}]}  (itens = comunicado do dia) */
function comunicado(cv,o){
  const x=cv.getContext('2d'),tw=W-2*M,pad=56,bw=tw-2*pad;
  const paras=String(o.texto||'').replace(/\r/g,'').split(/\n+/).map(s=>s.trim()).filter(Boolean);
  // mede o corpo para decidir tamanho de fonte e altura final
  const measure=fs=>{cv.width=W;x.font=`400 ${fs}px ${F}`;let h=0;
    paras.forEach(p=>{const bold=/^\d+\./.test(p)||/^Prezad/.test(p)||/^Atenciosamente/.test(p);x.font=`${bold?700:400} ${fs}px ${F}`;h+=lines(x,p,bw).length*fs*1.4+fs*.7});return h};
  x.font=`700 33px ${F}`;const acaoL=o.acao?lines(x,o.acao,tw-72).length:0,acaoH=o.acao?84+acaoL*42:0;
  const headH=430,tot=b=>headH-40+b+2*pad+(acaoH?acaoH+32:0)+128+40;
  let fs=34,bodyH=measure(fs);while(fs>24&&tot(bodyH)>H){fs-=1;bodyH=measure(fs)}
  const Ht=Math.max(H,tot(bodyH));
  cv.width=W;cv.height=Ht;
  x.fillStyle=C.a50;x.fillRect(0,0,W,Ht);
  const g=x.createLinearGradient(0,0,W*.5,headH);g.addColorStop(0,C.azul);g.addColorStop(1,C.a700);x.fillStyle=g;x.fillRect(0,0,W,headH);
  chev(x,700,40,220,'#fff');
  logo(x,assets.logoBranco,M,70,280);
  x.textAlign='right';x.fillStyle=C.ouroL;x.font=`700 26px ${F}`;x.fillText(('Comunicado · '+br(o.data)).toUpperCase(),W-M,112);x.textAlign='left';
  const head=String(o.titulo||'').toUpperCase(),dest=String(o.destaque||'').toUpperCase();let hs=64;
  for(;hs>=40;hs-=2){x.font=`900 ${hs}px ${F}`;if(lines(x,head,tw).length+(dest?lines(x,dest,tw).length:0)<=3)break}
  let y=218;const lh=hs*1.04;x.font=`900 ${hs}px ${F}`;x.fillStyle=C.branco;
  lines(x,head,tw).forEach((l,n)=>x.fillText(l,M,y+n*lh));y+=lines(x,head,tw).length*lh;
  if(dest){x.fillStyle=C.ouroL;lines(x,dest,tw).forEach((l,n)=>x.fillText(l,M,y+n*lh))}
  // painel da carta
  let py=headH-40;const ph=bodyH+2*pad;
  x.save();x.shadowColor='rgba(10,16,26,.14)';x.shadowBlur=30;x.shadowOffsetY=10;x.fillStyle='#fff';rr(x,M,py,tw,ph,24);x.fill();x.restore();
  x.fillStyle=C.ouro;rr(x,M,py,tw,8,[24,24,0,0]);x.fill();
  let ty=py+pad+fs;
  paras.forEach(p=>{const bold=/^\d+\./.test(p)||/^Prezad/.test(p)||/^Atenciosamente/.test(p);
    x.font=`${bold?700:400} ${fs}px ${F}`;x.fillStyle=bold?C.a700:'#333435';
    const ls=lines(x,p,bw);ls.forEach((l,n)=>x.fillText(l,M+pad,ty+n*fs*1.4));ty+=ls.length*fs*1.4+fs*.7});
  if(/Atenciosamente,?$/.test(paras[paras.length-1]||'')){x.font=`700 ${fs}px ${F}`;x.fillStyle=C.azul;x.fillText('Equipe Moreira Contabilidade',M+pad,ty-fs*.2)}
  let ay=py+ph+32;
  if(o.acao){x.fillStyle=C.ouro;rr(x,M,ay,tw,acaoH,22);x.fill();x.fillStyle=C.a950;x.font=`900 24px ${F}`;x.fillText('O QUE VOCÊ DEVE FAZER',M+36,ay+50);
    x.font=`700 33px ${F}`;text(x,o.acao,M+36,ay+98,tw-72,42)}
  // rodapé
  const fy=Ht-128;x.fillStyle=C.ouro;x.fillRect(0,fy,W,5);x.fillStyle=C.a700;x.fillRect(0,fy+5,W,123);
  x.fillStyle='rgba(255,255,255,.72)';x.font=`400 22px ${F}`;text(x,(o.fonte?`Fonte: ${o.fonte}. `:'')+'Conteúdo informativo.',M,fy+54,470,30,2);
  x.textAlign='right';x.fillStyle=C.ouroL;x.font=`700 28px ${F}`;x.fillText('@moreiracontabilidadeltda',W-M,fy+56);
  x.fillStyle='rgba(255,255,255,.72)';x.font=`400 22px ${F}`;x.fillText('(94) 99119-8085',W-M,fy+92);x.textAlign='left';
}
return {load,noticia,resumo,comunicado,ready:()=>assets.ready};
})();
