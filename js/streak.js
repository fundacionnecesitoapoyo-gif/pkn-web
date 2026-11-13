// POKE WEB by HiseR — Racha diaria con premios (se reclama una vez al día; si se salta un día, vuelve al día 1)
(function(){
const REW=[[30,0],[40,0],[60,0],[80,0],[100,0],[150,0],[250,1]]; // [GatuCoin, GatuSlot] por día
const KEY='hz-streak',day=d=>{const x=d||new Date();return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
const ST=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
const SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const yest=()=>{const d=new Date();d.setDate(d.getDate()-1);return day(d)};
function next(){const s=ST(KEY,{last:'',n:0});if(s.last===day())return null;return s.last===yest()?(s.n%7)+1:1}
function css(){if(document.getElementById('hz-stcss'))return;const s=document.createElement('style');s.id='hz-stcss';s.textContent=`
.hz-st{position:fixed;inset:0;z-index:99996;background:#000c;display:flex;align-items:center;justify-content:center;padding:16px}
.hz-st>div{background:#141a2b;color:#fff;border:2px solid #f59e0b;border-radius:16px;padding:16px;max-width:360px;width:100%;display:flex;flex-direction:column;gap:10px;font-family:inherit}
.hz-st h3{margin:0;font-size:20px}.hz-st p{margin:0;font-size:13px;opacity:.85}
.hz-st .g{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}.hz-st .c{background:#1e293b;border:2px solid #334155;border-radius:8px;text-align:center;padding:6px 0;font-size:10px}
.hz-st .c.done{background:#14532d;border-color:#22c55e}.hz-st .c.now{border-color:#facc15;background:#422006}.hz-st .c b{display:block;font-size:12px}
.hz-st button{border:0;border-radius:10px;padding:12px;font-weight:800;font-size:14px;font-family:inherit;color:#fff;background:#3b82f6}.hz-st .y{background:#f59e0b;color:#111}.hz-st .x{background:#475569}`;document.head.appendChild(s)}
function show(n){css();const w=document.createElement('div');w.className='hz-st';const b=document.createElement('div');w.appendChild(b);
 const E=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x)e.textContent=x;b.appendChild(e);return e};
 E('h3','','🔥 Racha diaria · Día '+n);E('p','','Entra cada día y gana más. Si te saltas un día, la racha vuelve al día 1.');
 const g=E('div','g');REW.forEach((r,i)=>{const c=document.createElement('div');c.className='c'+(i+1<n?' done':i+1===n?' now':'');c.innerHTML='Día '+(i+1)+'<b>'+(i+1<n?'✔':r[1]?'🎟️':'🪙'+r[0])+'</b>';g.appendChild(c)});
 const r=REW[n-1];E('p','','Hoy: '+r[0]+' GatuCoin'+(r[1]?' + 1 GatuSlot 🎟️':''));
 const give=m=>{const coins=r[0]*m;try{window.__hzAddCoins&&__hzAddCoins(coins)}catch(e){}
  if(r[1]){const gs=ST('hz-gatuslot',0);SV('hz-gatuslot',gs+r[1]*m)}
  SV(KEY,{last:day(),n:n});w.remove();window.hzToast&&hzToast('🔥 +'+coins+' GatuCoin'+(r[1]?' y +'+(r[1]*m)+' GatuSlot':''))};
 const a=E('button','','🎁 Reclamar');a.onclick=()=>give(1);
 const s=E('button','y','📣 Reclamar x2 compartiendo');s.onclick=async()=>{const d=window.__POKE_SHARE_DATA||{title:'POKE WEB by HiseR',text:'¡Juega POKE WEB by HiseR!',url:location.href};let ok=false;
  try{if(navigator.share){await navigator.share(d);ok=true}else if(navigator.clipboard){await navigator.clipboard.writeText(d.text+' '+d.url);ok=true}}catch(e){}
  if(ok)give(2);else window.hzToast&&hzToast('Compartir cancelado')};
 const l=E('button','x','Después');l.onclick=()=>w.remove();document.body.appendChild(w)}
let shown=false;
setInterval(()=>{if(shown||document.body.dataset.screen!=='title-screen')return;const n=next();if(!n)return;shown=true;setTimeout(()=>{if(document.body.dataset.screen==='title-screen')show(n)},900)},800);
window.hzStreak={next,show:()=>{const n=next();if(n)show(n)}};
})();
