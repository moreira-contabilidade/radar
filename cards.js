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
  try{await Promise.all(['900','800','700','500','400','300'].map(w=>document.fonts.load(w+' 40px Montserrat')))}catch(e){}
  const img=async f=>{try{const b=await (await fetch(base+'brand/'+f)).blob();return await createImageBitmap(b)}catch(e){return null}};
  [assets.logoBranco,assets.logoAzul]=await Promise.all([img('moreira_horizontal_branco_1000w.png'),img('moreira_horizontal_azul_1000w.png')]);
  assets.ready=true;return assets;
}
function br(d){const [y,m,dd]=String(d||'').split('-');return dd?`${dd}/${m}/${y}`:String(d||'')}
function brCurto(d){const [y,m,dd]=String(d||'').split('-');return dd?`${+dd} ${MESES[+m-1]}`:''}
function lines(x,t,w){const out=[];let line='';for(const word of plain(t).split(/\s+/).filter(Boolean)){const test=line?line+' '+word:word;if(x.measureText(test).width>w&&line){out.push(line);line=word}else line=test}if(line)out.push(line);return out}
function fit(x,t,w,weight,max,min,maxLines){let s=max;for(;s>=min;s-=2){x.font=`${weight} ${s}px ${F}`;if(lines(x,t,w).length<=maxLines)break}return s}
function text(x,t,X,Y,w,lh,maxLines){let ls=lines(x,t,w);if(maxLines&&ls.length>maxLines){ls=ls.slice(0,maxLines);let l=ls[maxLines-1];while(x.measureText(l+'…').width>w&&l.length)l=l.slice(0,-1);ls[maxLines-1]=l.replace(/[\s,.;:]+$/,'')+'…'}ls.forEach((l,i)=>x.fillText(l,X,Y+i*lh));return Y+ls.length*lh}

/* Texto com destaque: trechos entre **duas estrelas** saem em destaque (cor/realce). */
function plain(t){return String(t||'').replace(/\*\*/g,'')}
function rwords(t){const out=[];String(t||'').split('**').forEach((seg,i)=>{const lead=!/^\s/.test(seg);seg.split(/\s+/).filter(Boolean).forEach((w,j)=>out.push({w,b:i%2===1,glue:i>0&&j===0&&lead&&/^[.,;:!?)%]/.test(w)}))});return out}
function rlines(x,t,w,fN,fB){const ws=rwords(t),ls=[];let cur=[],cw=0;x.font=fN;const sp=x.measureText(' ').width;
  ws.forEach(o=>{x.font=o.b?fB:fN;const ww=x.measureText(o.w).width;const gap=o.glue?0:sp;if(cur.length&&cw+gap+ww>w&&!o.glue){ls.push(cur);cur=[];cw=0}o.ww=ww;cw+=(cur.length?gap:0)+ww;cur.push(o)});if(cur.length)ls.push(cur);ls.sp=sp;return ls}
function rdraw(x,ls,X,Y,lh,o){const sp=ls.sp||8;ls.forEach((ln,n)=>{let cx=X;const y=Y+n*lh;
  const gp=k=>k<ln.length-1&&!ln[k+1].glue?sp:0;if(o.mark){ln.forEach((w,k)=>{const nx=cx+w.ww+gp(k);if(w.b){x.fillStyle=o.mark;const nb=k<ln.length-1&&ln[k+1].b;x.fillRect(cx-4,y-o.fs*.86,(nb?nx-cx:w.ww)+8,o.fs*1.12)}cx=nx});cx=X}
  ln.forEach((w,k)=>{x.font=w.b?o.fB:o.fN;x.fillStyle=w.b?o.cB:o.cN;x.fillText(w.w,cx,y);cx+=w.ww+gp(k)})})}
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
/* Card de uma notícia (Instagram) — o que é, quando, o que muda, o que fazer; destaques em ouro. */
function noticia(cv,i){
  const x=cv.getContext('2d');cv.width=W;cv.height=H;const k=campos(i),tw=W-2*M,footerY=H-128;
  const head=k.tit.toUpperCase(),dest=k.dest.toUpperCase(),pts=k.pontos.slice(0,3);
  const lay=(s,draw)=>{
    let hs=70;for(;hs>=46;hs-=2){x.font=`900 ${hs}px ${F}`;const n=lines(x,head,tw).length+(dest?lines(x,dest,tw).length:0);if(n<=3&&lines(x,head,tw).every(l=>x.measureText(l).width<=tw))break}
    const lh=hs*1.02;let y=200+hs*.8;x.font=`900 ${hs}px ${F}`;const l1=lines(x,head,tw),l2=dest?lines(x,dest,tw):[];
    if(draw){x.fillStyle=C.branco;l1.forEach((l,n)=>x.fillText(l,M,y+n*lh));x.fillStyle=C.branco;l2.forEach((l,n)=>x.fillText(l,M,y+(l1.length+n)*lh))}
    const fs=Math.round(31*s),flh=Math.round(fs*1.38);y+=(l1.length+l2.length-1)*lh+Math.round(hs*.6)+fs;
    const fN=`400 ${fs}px ${F}`,fB=`700 ${fs}px ${F}`;const sl=rlines(x,k.sub,tw,fN,fB);
    if(draw)rdraw(x,sl,M,y,flh,{fN,fB,cN:'rgba(255,255,255,.9)',cB:C.ouroL,fs});
    y+=(sl.length-1)*flh+Math.round(34*s);
    if(k.quando){const qt=plain(k.quando),lab='QUANDO: ';let qs=Math.round(27*s),lw,qw;for(;qs>=18;qs--){x.font=`900 ${qs}px ${F}`;lw=x.measureText(lab).width;x.font=`800 ${qs}px ${F}`;qw=lw+x.measureText(qt).width+60;if(qw<=tw)break}const qh=Math.round(qs*2.15);
      if(draw){x.fillStyle=C.ouro;rr(x,M,y,qw,qh,qh/2);x.fill();x.fillStyle=C.a950;x.font=`900 ${qs}px ${F}`;x.fillText(lab,M+30,y+qh/2+qs*.36);x.font=`800 ${qs}px ${F}`;x.fillStyle=C.a950;x.fillText(qt,M+30+lw,y+qh/2+qs*.36)}
      y+=qh+Math.round(24*s)}
    if(pts.length){const ps=Math.round(29*s),plh=Math.round(ps*1.32),pad=Math.round(30*s),pN=`500 ${ps}px ${F}`,pB=`800 ${ps}px ${F}`;
      const pl=pts.map(p=>rlines(x,p,tw-2*pad-36,pN,pB));const inner=pl.reduce((a,l)=>a+l.length*plh+Math.round(16*s),0)-Math.round(16*s);
      const bh=pad+Math.round(48*s)+inner+pad;
      if(draw){x.fillStyle='rgba(255,255,255,.07)';rr(x,M,y,tw,bh,20);x.fill();x.strokeStyle='rgba(255,255,255,.14)';x.lineWidth=2;x.stroke();
        x.fillStyle=C.a400;x.font=`700 ${Math.round(23*s)}px ${F}`;x.fillText('O QUE MUDA PARA VOCÊ',M+pad,y+pad+Math.round(20*s));
        let py=y+pad+Math.round(48*s)+ps*.8;pl.forEach(ll=>{x.fillStyle=C.ouroL;x.beginPath();x.arc(M+pad+8,py-ps*.32,Math.max(5,6*s),0,7);x.fill();rdraw(x,ll,M+pad+30,py,plh,{fN:pN,fB:pB,cN:C.branco,cB:C.ouroL,fs:ps});py+=ll.length*plh+Math.round(16*s)})}
      y+=bh+Math.round(24*s)}
    const as=Math.round(30*s),alh=Math.round(as*1.3),aN=`700 ${as}px ${F}`,aB=`900 ${as}px ${F}`;const al=rlines(x,k.acao,tw-72,aN,aB);
    const ah=Math.round(76*s)+al.length*alh+Math.round(26*s);
    return {y,ah,al,as,alh,aN,aB}};
  const g=x.createLinearGradient(0,0,W*.4,H);g.addColorStop(0,C.azul);g.addColorStop(.45,C.a700);g.addColorStop(1,C.a950);x.fillStyle=g;x.fillRect(0,0,W,H);
  chev(x,640,120,380,'#fff');logo(x,assets.logoBranco,M,84,300);
  x.textAlign='right';x.fillStyle=C.ouroL;x.font=`700 26px ${F}`;x.fillText((k.tema+' · '+brCurto(i.data)).toUpperCase(),W-M,128);x.textAlign='left';
  let s=1.22,r=lay(s,false);while(s>.7&&r.y+r.ah>footerY-30){s-=.02;r=lay(s,false)}r=lay(s,true);
  const ay=Math.max(r.y,footerY-30-r.ah);x.fillStyle=C.ouro;rr(x,M,ay,tw,r.ah,20);x.fill();
  x.fillStyle=C.a950;x.font=`900 ${Math.round(23*s)}px ${F}`;x.fillText('O QUE VOCÊ DEVE FAZER',M+36,ay+Math.round(44*s));
  rdraw(x,r.al,M+36,ay+Math.round(76*s)+r.as*.8,r.alh,{fN:r.aN,fB:r.aB,cN:C.a950,cB:C.a950,fs:r.as,mark:C.ouro100});
  footer(x,k.fonte,true);
}
/* Resumo — vários itens, fundo claro, logo azul centralizado */
function resumo(cv,list,d,titulo,linha2){
  const x=cv.getContext('2d');cv.width=W;cv.height=H;
  x.fillStyle=C.a50;x.fillRect(0,0,W,H);
  logo(x,assets.logoAzul,W/2,70,300,true);
  x.textAlign='center';x.fillStyle=C.a700;x.font=`900 74px ${F}`;x.fillText((titulo||'RADAR FISCAL').toUpperCase(),W/2,250);
  x.fillStyle=C.ouro;x.font=`900 74px ${F}`;x.fillText((linha2||'DA SEMANA').toUpperCase(),W/2,328);
  x.fillStyle=C.c700;x.font=`500 27px ${F}`;x.fillText('Fiscal e Departamento Pessoal, explicado de forma simples · '+br(d),W/2,384);x.textAlign='left';
  const items=list.slice(0,3),top=430,bottom=H-128-40,gap=18,h=(bottom-top-gap*(items.length-1))/items.length,tw=W-2*M;
  items.forEach((i,n)=>{const k=campos(i),y=top+n*(h+gap);
    x.fillStyle='#fff';rr(x,M,y,tw,h,22);x.fill();x.fillStyle=n===0?C.ouro:C.azul;rr(x,M,y,10,h,[22,0,0,22]);x.fill();
    x.fillStyle=n===0?C.ouro:C.azul;x.font=`900 60px ${F}`;x.fillText(String(n+1),M+38,y+h/2+20);
    const t=(k.tit+(k.dest?' '+k.dest:''));const cw=tw-150,cx=M+116;x.fillStyle=C.a700;const s=fit(x,t,cw,700,34,24,1);x.font=`700 ${s}px ${F}`;
    let yy=text(x,t,cx,y+48,cw,s*1.15,1);
    x.font=`700 23px ${F}`;const an=Math.min(2,lines(x,'O que fazer: '+k.acao,cw).length);const sl=Math.max(1,Math.min(3,Math.floor((y+h-yy-20-an*30)/31)));
    {const fN=`400 24px ${F}`,fB=`700 24px ${F}`;let ls=rlines(x,k.sub,cw,fN,fB);if(ls.length>sl){ls=ls.slice(0,sl);const lw=ls[sl-1];lw[lw.length-1]={...lw[lw.length-1],w:lw[lw.length-1].w+'…'}}ls.sp=rlines(x,'a b',cw,fN,fB).sp;rdraw(x,ls,cx,yy+6+24*.8-24*.8,31,{fN,fB,cN:'#333435',cB:C.a900,mark:C.ouro100,fs:24});yy+=6+ls.length*31}
    x.fillStyle=C.azul;x.font=`700 23px ${F}`;text(x,'O que fazer: '+k.acao,cx,yy+8,cw,30,2);
  });
  footer(x,'sites oficiais do governo (gov.br)',false);
}
/* Comunicado ao cliente (WhatsApp) — completo: saudação, explicação, quando, o que muda, o que fazer.
   o = {data, titulo, destaque, sub, pontos, quando, acao, fonte}  ou  {data, titulo, destaque, itens:[...], fonte} (comunicado do dia) */
function comunicado(cv,o){
  const x=cv.getContext('2d'),tw=W-2*M,pad=52,bw=tw-2*pad;
  const blocks=o.itens&&o.itens.length?o.itens:[o];const HMAX=blocks.length>1?Math.min(4000,1500+blocks.length*900):1920,SMIN=blocks.length>1?.86:.68;
  const lay=(s,draw,y0)=>{let y=y0;const fs=Math.round(30*s),lh=Math.round(fs*1.42),fN=`400 ${fs}px ${F}`,fB=`700 ${fs}px ${F}`,X=M+pad;
    const T=(t,opt)=>{const ls=rlines(x,t,bw-(opt&&opt.ind||0),opt&&opt.fN||fN,opt&&opt.fB||fB);if(draw)rdraw(x,ls,X+(opt&&opt.ind||0),y+fs*.8,lh,{fN:opt&&opt.fN||fN,fB:opt&&opt.fB||fB,cN:opt&&opt.cN||'#333435',cB:C.a900,mark:C.ouro100,fs});y+=ls.length*lh};
    const L=(t,c)=>{const ls=Math.round(22*s);if(draw){x.font=`800 ${ls}px ${F}`;x.fillStyle=c||C.azul;x.fillText(t,X,y+ls*.8)}y+=Math.round(ls*1.7)};
    if(draw){x.font=`700 ${fs}px ${F}`;x.fillStyle=C.a700;x.fillText('Prezado(a) cliente,',X,y+fs*.8)}y+=lh+Math.round(10*s);
    if(blocks.length>1)T('Confira as atualizações fiscais e da Reforma Tributária que podem afetar a sua empresa:'),y+=Math.round(14*s);
    blocks.forEach((b,bi)=>{
      if(blocks.length>1){const hs=Math.round(31*s);x.font=`800 ${hs}px ${F}`;const hl=lines(x,(bi+1)+'. '+plain(b.titulo)+(b.destaque?' '+plain(b.destaque):''),bw);if(draw){x.fillStyle=C.a700;hl.forEach((l,n)=>x.fillText(l,X,y+hs*.8+n*hs*1.25))}y+=hl.length*hs*1.25+Math.round(8*s)}
      if(b.sub)T(b.sub),y+=Math.round(16*s);
      if(b.quando){const lab='QUANDO: ';let qs=Math.round(27*s),lw,qw;for(;qs>=18;qs--){x.font=`900 ${qs}px ${F}`;lw=x.measureText(lab).width;x.font=`800 ${qs}px ${F}`;qw=lw+x.measureText(plain(b.quando)).width+56;if(qw<=bw)break}const qh=Math.round(qs*2.1);
        if(draw){x.fillStyle=C.ouro;rr(x,X,y,qw,qh,qh/2);x.fill();x.fillStyle=C.a950;x.font=`900 ${qs}px ${F}`;x.fillText(lab,X+28,y+qh/2+qs*.36);x.font=`800 ${qs}px ${F}`;x.fillText(plain(b.quando),X+28+lw,y+qh/2+qs*.36)}y+=qh+Math.round(20*s)}
      if(b.pontos&&b.pontos.length){L('O QUE MUDA PARA VOCÊ');b.pontos.slice(0,3).forEach(p=>{if(draw){x.fillStyle=C.ouro;x.beginPath();x.arc(X+8,y+fs*.5,Math.max(5,6*s),0,7);x.fill()}T(p,{ind:30});y+=Math.round(8*s)});y+=Math.round(10*s)}
      if(b.acao){const as=Math.round(29*s),alh=Math.round(as*1.32),aN=`700 ${as}px ${F}`,aB=`900 ${as}px ${F}`,al=rlines(x,b.acao,bw-56,aN,aB),ah=Math.round(66*s)+al.length*alh+Math.round(20*s);
        if(draw){x.fillStyle=C.a50;rr(x,X,y,bw,ah,16);x.fill();x.fillStyle=C.ouro;rr(x,X,y,10,ah,[16,0,0,16]);x.fill();x.font=`900 ${Math.round(21*s)}px ${F}`;x.fillStyle=C.azul;x.fillText('O QUE VOCÊ DEVE FAZER',X+30,y+Math.round(38*s));
          rdraw(x,al,X+30,y+Math.round(66*s)+as*.8,alh,{fN:aN,fB:aB,cN:C.a900,cB:C.a900,fs:as,mark:C.ouro100})}y+=ah+Math.round(22*s)}
      if(blocks.length>1&&bi<blocks.length-1){if(draw){x.fillStyle=C.a100;x.fillRect(X,y,bw,2)}y+=Math.round(24*s)}
    });
    if(blocks.length>1)T('Nossa equipe acompanha cada etapa e está à disposição para avaliar os impactos no seu negócio.'),y+=Math.round(10*s);
    if(draw){x.font=`700 ${fs}px ${F}`;x.fillStyle=C.a700;x.fillText('Atenciosamente,',X,y+fs*.8);x.fillStyle=C.azul;x.fillText('Equipe Moreira Contabilidade',X,y+fs*.8+lh)}y+=2*lh;
    return y};
  // cabeçalho
  const head=plain(o.titulo).toUpperCase(),dest=plain(o.destaque||'').toUpperCase();
  const headFit=()=>{let hs=62;for(;hs>=40;hs-=2){x.font=`900 ${hs}px ${F}`;if(lines(x,head,tw).length+(dest?lines(x,dest,tw).length:0)<=3)break}return hs};
  cv.width=W;cv.height=H;const hs=headFit();x.font=`900 ${hs}px ${F}`;const hl1=lines(x,head,tw),hl2=dest?lines(x,dest,tw):[];
  const headH=Math.round(210+(hl1.length+hl2.length)*hs*1.04+40);const panelTop=headH-36;
  let s=1.15,need=lay(s,false,0);const avail=HMAX-panelTop-2*pad-128-50;while(s>SMIN&&need>avail){s-=.02;need=lay(s,false,0)}
  const Ht=Math.max(H,panelTop+2*pad+need+128+50);
  cv.width=W;cv.height=Ht;x.fillStyle=C.a50;x.fillRect(0,0,W,Ht);
  const g=x.createLinearGradient(0,0,W*.5,headH);g.addColorStop(0,C.azul);g.addColorStop(1,C.a700);x.fillStyle=g;x.fillRect(0,0,W,headH);
  chev(x,700,30,200,'#fff');logo(x,assets.logoBranco,M,70,280);
  x.textAlign='right';x.fillStyle=C.ouroL;x.font=`700 26px ${F}`;x.fillText(('Comunicado ao cliente · '+br(o.data)).toUpperCase(),W-M,112);x.textAlign='left';
  x.font=`900 ${hs}px ${F}`;let y=214;x.fillStyle=C.branco;hl1.forEach((l,n)=>x.fillText(l,M,y+n*hs*1.04));y+=hl1.length*hs*1.04;x.fillStyle=C.branco;hl2.forEach((l,n)=>x.fillText(l,M,y+n*hs*1.04));
  const ph=Ht-128-40-panelTop;x.save();x.shadowColor='rgba(10,16,26,.14)';x.shadowBlur=30;x.shadowOffsetY=10;x.fillStyle='#fff';rr(x,M,panelTop,tw,ph,24);x.fill();x.restore();
  x.fillStyle=C.ouro;rr(x,M,panelTop,tw,8,[24,24,0,0]);x.fill();
  lay(s,true,panelTop+pad);
  const fy=Ht-128;x.fillStyle=C.ouro;x.fillRect(0,fy,W,5);x.fillStyle=C.a700;x.fillRect(0,fy+5,W,123);
  x.fillStyle='rgba(255,255,255,.72)';x.font=`400 22px ${F}`;text(x,(o.fonte?`Fonte: ${plain(o.fonte)}. `:'')+'Conteúdo informativo.',M,fy+54,470,30,2);
  x.textAlign='right';x.fillStyle=C.ouroL;x.font=`700 28px ${F}`;x.fillText('@moreiracontabilidadeltda',W-M,fy+56);
  x.fillStyle='rgba(255,255,255,.72)';x.font=`400 22px ${F}`;x.fillText('(94) 99119-8085',W-M,fy+92);x.textAlign='left';
}
return {load,noticia,resumo,comunicado,plain,ready:()=>assets.ready};
})();
