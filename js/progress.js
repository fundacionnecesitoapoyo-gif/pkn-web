// POKE WEB by HiseR — Música, regiones, Caja de 30 espacios y GatuSlot
(function(){
const GATUSLOT_URL=''; // enlace de PayPal para comprar un GatuSlot ($0.20)
const SLOT_HASHES={"00075e7416c73e7bb5b946062409d95ee73fd40ba3c6aef1059bc477dbde9cd4": 5, "7e13984039b0fa3da8068105ee56b4fdf93e098a192a06399ad89be565ec84cb": 5, "fc10b3d268a7d7a6d04c5586f11aeb6fd5e0066d4afbe199ab7a92fdb3f0319c": 5, "e31e20ad7292a08340a65b6cf7befc0863e7e628ecd6d7df6c3aa605bb7a5936": 5, "84955a1ae1061b7b2d811786bc2401fa51ad2c0b0236bcd57028c54455ee976a": 5, "70e835181269a0b6a78646a226d0aad65145c7bf15b61ee58f2037aed5ec4199": 5, "d4a4b07cad7fd2b79856e2288f7679cf4a10591a2010580dc48fbfba24b6139c": 5, "070246ea3fbf48427ad2ac93ae1f151fd836756a269fd3a5f56c19f99ab9147b": 5, "671ea500538a2462447022d12bdb12f970549a8bc45e4a387c812c0a82ac9d6b": 5, "07f2076a72469b64691fbf3d370218f3f616dd51c5fbdb18d2d66ddfab61cb41": 5, "ecc0f1b9f63964346658b933ad0217533765e24073fe82b159c1574034f827d9": 15, "b41d6983310e357a2ca2f0d546f8a5f44fa2dcfa893f1a58e32ff940b3521232": 15, "1a1cec31a085569f8d61df884b42a76f38090532060a1707f917445a7ad8ec96": 15, "cccc13ba0d4416b2ed79e5d7290bd407f0dd2d16e4d435c429d90f959e06e371": 15, "5ff3f2dd80cea73944a89f733c871e36d0f911f582079a10e7c869673669d2ae": 15, "9fb258b3b3a2a57c5ebf7f83cf3b88aff814d747e895983dda5a0af10cad9f3b": 15, "5ee5d9709fa612151a606c79e7c540d281ba4c9524c85aa89d0fc6e190c00536": 15, "e77012301e622b53909d27d6115a158fe9fdb725d0a5944922be8d1af79d4c41": 15, "80adfc1e6c5002db233ff4247d8c980ea304968228a3b99c4be8e18c4f3bc338": 15, "fb157d615e7cec55115fbe113f24e35bc4d7cff0b4c5babbbff7e4d1129eb0ae": 15, "309ebf40d0779536e03b9d756c5771f19784ea69ac32f326d99a015ffae5673a": 40, "89fadcbecf4b9f198ed96380fc2241ea1b2b480529c778130821c802901dd1d4": 40, "ccaa0247828224cb492776f21d67b3595754d674e39ace35bb0f33f7364ebd65": 40, "e198eb20c3625da7119880e6ec78d59b46f5214e088961335edda2ece2e48e25": 40, "7910ca2aad267773745e4622ac56aa813ac2a9c268ef66da879429be3efe6d08": 40};
const BASE=30, PER=5;
const ST=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
const SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const toast=m=>window.hzToast?hzToast(m):(typeof showAchievementToast==='function'&&showAchievementToast({icon:'📦',name:m,desc:''}));
const NAMES={'1':'Kanto','2':'Johto','3':'Hoenn','4':'Sinnoh','5':'Unova'};
// ---------- Música ----------
const mk=s=>{const a=new Audio(s);a.preload='auto';a.volume=.6;return a};
const intro=mk('assets/music/intro.m4a'), retry=mk('assets/music/retry.m4a');
let introDone=false;
const tryIntro=()=>{if(introDone)return;const r=intro.play();if(r&&r.then)r.then(()=>{introDone=true;off()}).catch(()=>{});else introDone=true};
const evs=['pointerdown','touchstart','keydown','click'];
const off=()=>evs.forEach(e=>removeEventListener(e,tryIntro,true));
evs.forEach(e=>addEventListener(e,tryIntro,true));tryIntro();
function playRetry(){try{intro.pause();retry.currentTime=0;retry.play().catch(()=>{})}catch(e){}}
['showLevelRetryScreen','doGameOver'].forEach(n=>{if(typeof window[n]==='function'){const o=window[n];window[n]=function(){playRetry();return o.apply(this,arguments)}}});
// ---------- Caja ----------
const box=()=>ST('hz-box',[]),saveBox=b=>SV('hz-box',b);
const extra=()=>ST('hz-slots',0),cap=()=>(localStorage.getItem('hz-creator')==='1'?999:BASE+extra()),gs=()=>ST('hz-gatuslot',0);
const copy=p=>JSON.parse(JSON.stringify(p));
const inRun=()=>{try{return !!(state&&Array.isArray(state.team)&&state.team.length&&document.querySelector('.screen.active')&&document.querySelector('.screen.active').id==='map-screen')}catch(e){return false}};
const stage=()=>{try{return Math.max(5,...state.team.map(p=>p.level|0))}catch(e){return 5}};
function fit(p){const L=stage();p.level=L;const b=(p.statBuffs&&p.statBuffs.hp)||0;try{p.maxHp=Math.floor(calcHp(p.baseStats.hp,L)*(1+.1*b))}catch(e){}p.currentHp=p.maxHp;return p}
const persist=()=>{try{typeof saveRun==='function'&&saveRun()}catch(e){}};
function css(){if(document.getElementById('hz-boxcss'))return;const s=document.createElement('style');s.id='hz-boxcss';s.textContent=`
.hz-box{position:fixed;inset:0;z-index:99998;background:#0b1020f2;color:#fff;overflow-y:auto;padding:calc(12px + env(safe-area-inset-top)) 12px calc(90px + env(safe-area-inset-bottom));font-family:inherit}
.hz-box h3{margin:6px 0}.hz-box .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:6px 0}
.hz-box button{border:0;border-radius:10px;padding:10px 12px;font-weight:700;font-size:13px;background:#3b82f6;color:#fff;font-family:inherit}
.hz-box button.y{background:#f59e0b;color:#111}.hz-box button.g{background:#475569}.hz-box input{padding:10px;border-radius:10px;border:0;width:150px;font-size:13px}
.hz-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.hz-tile{background:#1e293b;border:2px solid #334155;border-radius:10px;padding:6px 4px;text-align:center;min-height:92px;font-size:11px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
.hz-tile img{width:56px;height:56px;image-rendering:pixelated;object-fit:contain}.hz-tile.e{border-style:dashed;opacity:.4}.hz-tile.sel{border-color:#facc15}.hz-tile.pick{border-color:#22c55e}
.hz-msg{font-size:12px;color:#facc15;min-height:16px}`;document.head.appendChild(s)}
function tile(p,cls,fn){const d=document.createElement('div');d.className='hz-tile '+(cls||'');if(!p){d.className='hz-tile e';d.textContent='vacío';return d}
 const i=document.createElement('img');i.src=p.spriteUrl||('sprites/pokemon/'+p.speciesId+'.png');i.onerror=()=>{i.style.display='none'};d.appendChild(i);
 const n=document.createElement('b');n.textContent=(p.isShiny?'✨ ':'')+p.name;d.appendChild(n);const l=document.createElement('span');l.textContent='Nv '+p.level;d.appendChild(l);if(fn)d.onclick=fn;return d}
async function sha(t){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
let sel=null,rel=false;
window.__POKE_REDEEM=async function(h){const q=SLOT_HASHES[h],used=ST('hz-used',[]);if(!q||used.includes(h))return 0;used.push(h);SV('hz-used',used);SV('hz-gatuslot',gs()+q);return q};
const atCenter=()=>{try{return inRun()&&!!state.__hzCenter}catch(e){return false}};
window.__hzInRun=inRun;
window.openBox=function(){css();sel=null;rel=false;let mode='',shiny=false;const picks=new Set();const w=document.createElement('div');w.className='hz-box';document.body.appendChild(w);
 const close=()=>{w.remove();if(inRun()){try{showMapScreen()}catch(e){}}};
 const draw=()=>{w.textContent='';const B=box(),run=atCenter(),E=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x)e.textContent=x;return e};
  w.appendChild(E('h3','','📦 Caja Pokémon  '+B.length+'/'+cap()));
  const r=E('div','row');
  const us=E('button','y','🎟️ Usar GatuSlot ('+gs()+') +'+PER+' espacios');us.onclick=()=>{if(gs()<1){msg.textContent='No tienes GatuSlot. Gánalos al vencer gimnasios o cómpralos.';return}SV('hz-gatuslot',gs()-1);SV('hz-slots',extra()+PER);draw()};r.appendChild(us);
  const by=E('button','','💛 Comprar GatuSlot');by.onclick=()=>{if(window.openSupport)openSupport('slots');else msg.textContent='Gana GatuSlot venciendo gimnasios.'};r.appendChild(by);w.appendChild(r);
  const r1=E('div','row');
  const bm=(k,t)=>{const b=E('button',mode===k?'y':'g',mode===k?t+': ACTIVADO':t);b.onclick=()=>{mode=mode===k?'':k;sel=null;picks.clear();draw()};return b};
  r1.append(bm('rel','🗑️ Liberar'),bm('multi','☑️ Varios'),bm('lock','🔒 Bloquear'));
  const sh=E('button',shiny?'y':'g',shiny?'✨ Solo shiny: SÍ':'✨ Solo shiny');sh.onclick=()=>{shiny=!shiny;draw()};r1.appendChild(sh);
  if(localStorage.getItem('hz-creator')==='1'){const sb=E('button','y','🛠 Legendarios shiny');sb.onclick=async()=>{msg.textContent='Añadiendo…';const n=await window.hzStaffBox();msg.textContent='Añadidos: '+n;draw()};r1.appendChild(sb)}
  w.appendChild(r1);
  if(mode==='multi'){const rm=E('div','row');const all=E('button','g','Seleccionar todos');all.onclick=()=>{B.forEach((p,i)=>{if(p&&!p.locked&&(!shiny||p.isShiny))picks.add(i)});draw()};const cl2=E('button','g','Limpiar');cl2.onclick=()=>{picks.clear();draw()};
   const del=E('button','y','🗑️ Eliminar ('+picks.size+')');del.onclick=()=>{const td=[...picks].filter(i=>B[i]&&!B[i].locked);const sk=picks.size-td.length;if(!td.length){msg.textContent='No hay nada que eliminar (los bloqueados 🔒 no se eliminan).';return}
    if(confirm('¿Eliminar '+td.length+' Pokémon para siempre?'+(sk?' ('+sk+' bloqueados se conservan)':''))){const nb=B.filter((_,i)=>!td.includes(i));saveBox(nb);picks.clear();draw()}};rm.append(all,cl2,del);w.appendChild(rm)}
  const r2=E('div','row');const inp=E('input');inp.placeholder='Código SLOT-XXXXXXXX';inp.autocapitalize='characters';const ok=E('button','g','Canjear');
  ok.onclick=async()=>{const c=inp.value.trim().toUpperCase(),hh=await sha(c),used=ST('hz-used',[]);const q=SLOT_HASHES[hh];if(!q)msg.textContent='Código no válido.';else if(used.includes(hh))msg.textContent='Ese código ya se usó.';else{used.push(hh);SV('hz-used',used);SV('hz-gatuslot',gs()+q);msg.textContent='🎟️ +'+q+' GatuSlot';draw()}};r2.append(inp,ok);w.appendChild(r2);
  const msg=E('div','hz-msg',mode==='multi'?'Toca varios Pokémon para elegirlos y luego pulsa Eliminar. Los bloqueados 🔒 se conservan.':mode==='lock'?'Toca un Pokémon para bloquearlo o desbloquearlo. Los bloqueados no se pueden liberar.':mode==='rel'?'Toca un Pokémon para liberarlo (pide confirmación).':'');w.appendChild(msg);
  if(run){w.appendChild(E('h3','','Equipo ('+state.team.length+'/6) · se ajusta a Nv '+stage()));const g=E('div','hz-grid');
   state.team.forEach((p,j)=>g.appendChild(tile(p,sel!==null?'pick':'',()=>{
    if(sel!==null){const out=copy(state.team[j]),inc=copy(B[sel]);B[sel]=out;state.team[j]=fit(inc);saveBox(B);sel=null;persist();draw();return}
    if(state.team.length<2){msg.textContent='Necesitas al menos 1 Pokémon en el equipo.';return}
    if(B.length>=cap()){msg.textContent='La caja está llena. Usa un GatuSlot.';return}
    B.push(copy(state.team[j]));state.team.splice(j,1);saveBox(B);persist();draw()})));w.appendChild(g)}
  else w.appendChild(E('div','hz-msg','Para cambiar tu equipo, usa la Caja en un Centro Pokémon 🏥 durante la aventura.'));
  w.appendChild(E('h3','','Caja'));const g2=E('div','hz-grid');let shown=0;
  for(let i=0;i<cap();i++){const p=B[i];if(shiny&&!(p&&p.isShiny))continue;
   if(!p){if(!shiny&&shown<9)g2.appendChild(tile(null));shown++;continue}
   const t=tile(p,(sel===i||picks.has(i))?'sel':'',()=>{
    if(mode==='multi'){if(picks.has(i))picks.delete(i);else picks.add(i);draw();return}
    if(mode==='lock'){B[i].locked=!B[i].locked;saveBox(B);draw();return}
    if(mode==='rel'){if(p.locked){msg.textContent='🔒 '+p.name+' está bloqueado. Desbloquéalo para poder liberarlo.';return}
     if(confirm('¿Liberar a '+p.name+' Nv '+p.level+'? No se puede deshacer.')){B.splice(i,1);saveBox(B);draw()}return}
    if(!run){msg.textContent='Usa la Caja en un Centro Pokémon para sacar Pokémon.';return}
    if(state.team.length<6){const inc=copy(B[i]);B.splice(i,1);state.team.push(fit(inc));saveBox(B);persist();draw()}
    else{sel=i;msg.textContent='Toca el Pokémon del equipo que quieres cambiar.';draw()}});
   if(p.locked){const n=t.querySelector('b');if(n)n.textContent='🔒 '+n.textContent}
   g2.appendChild(t)}
  w.appendChild(g2);
  const cl=E('button','g','✖ Cerrar');cl.style.cssText='position:fixed;left:12px;bottom:calc(76px + env(safe-area-inset-bottom));z-index:99999';cl.onclick=close;w.appendChild(cl)};
 draw()};
// botón 📦 en el mapa y en la portada
function addBtns(){document.querySelectorAll('.map-header > div:last-child, .map-actions').forEach(c=>{if(c.querySelector('.hz-boxbtn'))return;const b=document.createElement('button');b.className='btn-icon-sm hz-boxbtn';b.title='Caja (Centro Pokémon)';b.textContent='📦';b.style.display='none';b.style.cssText='font-size:20px;background:transparent;border:0;color:inherit';b.onclick=()=>openBox();c.prepend(b)});
 const x=document.querySelector('.xbtn');if(x&&!x.querySelector('.hz-boxbtn2')){const b=document.createElement('button');b.className='hz-boxbtn2';b.textContent='📦 Caja';b.onclick=()=>openBox();x.appendChild(b)}}
addBtns();setInterval(addBtns,1500);
setInterval(()=>{document.querySelectorAll('.map-header .hz-boxbtn, .map-actions .hz-boxbtn').forEach(b=>{b.style.display=atCenter()?'':'none'})},400);
// Intercambio: lo que se reemplaza o sobra va a la Caja
if(typeof showSwapScreen==='function'){const o=showSwapScreen;showSwapScreen=function(newPoke,node){const r=o.apply(this,arguments);try{
 const ch=document.getElementById('swap-choices');
 if(!ch._hzL){ch._hzL=1;ch.addEventListener('click',e=>{const c=e.target.closest('.poke-card');if(!c)return;const i=[...ch.querySelectorAll('.poke-card')].indexOf(c);const B=box();if(i>=0&&state.team[i]&&B.length<cap()){B.push(copy(state.team[i]));saveBox(B)}},true)}
 if(box().length<cap()){const b=document.createElement('button');b.className='btn-secondary';b.style.cssText='width:100%;margin-bottom:10px;';b.textContent='📦 Enviar '+newPoke.name+' a la Caja ('+box().length+'/'+cap()+')';
  b.onclick=()=>{const B=box();if(B.length>=cap())return;try{loadBuffsIntoPokemon(newPoke)}catch(e){}B.push(copy(newPoke));saveBox(B);state.savedCatch=null;state.savedQuestionResolve=null;advanceFromNode(state.map,node.id);state.currentNode=null;showMapScreen();toast('📦 '+newPoke.name+' fue a la Caja')};ch.prepend(b)}
 }catch(e){}return r}}
// ---------- GatuSlot por gimnasio ----------
if(typeof showBadgeScreen==='function'){const o=showBadgeScreen;showBadgeScreen=function(){const r=o.apply(this,arguments);try{if(!state.isEndlessMode){SV('hz-gatuslot',gs()+1);if(typeof showAchievementToast==='function')showAchievementToast({icon:'🎟️',name:'+1 GatuSlot',desc:'Úsalo en la Caja 📦 para +'+PER+' espacios'})}}catch(e){}return r}}
// ---------- Fin de región ----------
if(typeof showWinScreen==='function'){const o=showWinScreen;showWinScreen=function(){const r=o.apply(this,arguments);try{
 if(state.__hzWon)return r;state.__hzWon=1;
 const g=String(getRunGen());const done=ST('hz-regions',[]);const ids=g==='all'||g==='both'?['1','2','3','4','5']:[g];ids.forEach(x=>{if(!done.includes(x))done.push(x)});SV('hz-regions',done);
 const B=box();let moved=0;state.team.forEach(p=>{if(B.length<cap()){B.push(copy(p));moved++}});saveBox(B);SV('hz-bag',state.items||[]);
 const nx=NAMES[String(Number(g)+1)];const b=document.getElementById('btn-play-again');
 if(b){b.textContent='🏠 Volver al menú principal';b.onclick=()=>{try{initGame()}catch(e){location.reload()}}}
 const t=document.querySelector('#win-screen p');if(t)t.textContent='¡Región completada! Tus Pokémon ('+moved+') están en la Caja 📦 y tus ítems te esperan'+(nx?'. Se desbloqueó '+nx+'.':'.')
 }catch(e){}return r}}
// Los ítems guardados vuelven en la siguiente aventura
if(typeof selectStarter==='function'){const o=selectStarter;selectStarter=async function(){try{const bag=ST('hz-bag',[]);if(bag.length&&state&&Array.isArray(state.items)){state.items.push(...bag);SV('hz-bag',[])}}catch(e){}return o.apply(this,arguments)}}
})();

(function(){
 if(typeof doPokeCenterNode==='function'){const o=doPokeCenterNode;doPokeCenterNode=async function(){const r=await o.apply(this,arguments);try{state.__hzCenter=true;setTimeout(()=>{try{if(window.__hzInRun()&&!document.querySelector('.hz-box'))openBox()}catch(e){}},1100)}catch(e){}return r}}
 if(typeof onNodeClick==='function'){const o=onNodeClick;onNodeClick=function(){try{state.__hzCenter=false}catch(e){}return o.apply(this,arguments)}}
 const NM={'2':'Kanto','3':'Johto','4':'Hoenn','5':'Sinnoh','both':'las 5 regiones'};
 function locks(){document.querySelectorAll('.gen-btn').forEach(b=>{const g=b.dataset.gen;let l=false;try{l=genLocked(g)}catch(e){}
  let o=b.querySelector('.hz-lock');if(l&&!o){o=document.createElement('div');o.className='hz-lock';o.textContent='🔒 Completa '+(g==='both'?'las 5 regiones':({'2':'Kanto','3':'Johto','4':'Hoenn','5':'Sinnoh'})[g]);b.appendChild(o)}else if(!l&&o)o.remove()})}
 locks();setInterval(locks,1200);
})();
