// POKE WEB by HiseR — Héroes con habilidad, KING, shiny +20% y botones fuera del juego
(function(){
const DONATE=()=>(window.__HZ_LINKS&&__HZ_LINKS.donate)||'https://discord.gg/SFaF5GnvAr';
const NEED=10, GAP=120000; // 10 compartidas, mínimo 2 min entre cada una
const ST=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const shares=()=>ST('hz-shares',0), donor=()=>ST('hz-donor',0)===1||localStorage.getItem('hz-donor')==='1'||localStorage.getItem('hz-creator')==='1';
const kingOpen=()=>ST('hz-king',0)===1||donor()||shares()>=NEED;
// ---- Datos de héroes: [clave, nombre, tipo, id inicial, nombre inicial, archivo de sprite opcional] ----
const TY={Electric:['⚡','Eléctrico'],Water:['💧','Agua'],Ground:['🪨','Tierra'],Rock:['🪨','Roca'],Grass:['🌿','Planta'],Fire:['🔥','Fuego'],Psychic:['🔮','Psíquico'],Poison:['☠️','Veneno'],Ice:['❄️','Hielo'],Fighting:['🥊','Lucha'],Dragon:['🐉','Dragón'],Ghost:['👻','Fantasma'],Flying:['🕊️','Volador'],Bug:['🐛','Bicho'],Normal:['⭐','Normal'],Dark:['🌑','Siniestro'],Steel:['⚙️','Acero']};
const REG=[
['Clásicos',[['boy','Chico'],['girl','Chica'],['red','Red'],['blue','Blue'],['silver','Silver'],['dawn','Dawn'],['youngster','Joven']]],
['Kanto',[['ash','Ash','Electric',25,'Pikachu','ash-johto'],['misty','Misty','Water',120,'Staryu'],['brock','Brock','Ground',74,'Geodude'],['ltsurge','Lt. Surge','Electric',100,'Voltorb'],['erika','Erika','Grass',43,'Oddish'],['koga','Koga','Poison',109,'Koffing'],['janine','Janine','Poison',48,'Venonat'],['sabrina','Sabrina','Psychic',63,'Abra'],['blaine','Blaine','Fire',58,'Growlithe'],['lorelei','Lorelei','Ice',124,'Jynx'],['bruno','Bruno','Fighting',66,'Machop'],['agatha','Agatha','Ghost',92,'Gastly'],['lance','Lance','Dragon',147,'Dratini']]],
['Equipo Rocket',[['jessie','Jessie','Poison',23,'Ekans','teamrocket'],['james','James','Poison',109,'Koffing','teamrocket']]],
['Johto',[['falkner','Falkner','Flying',16,'Pidgey'],['bugsy','Bugsy','Bug',123,'Scyther'],['whitney','Whitney','Normal',241,'Miltank'],['morty','Morty','Ghost',92,'Gastly'],['chuck','Chuck','Fighting',236,'Tyrogue'],['jasmine','Jasmine','Steel',81,'Magnemite'],['pryce','Pryce','Ice',86,'Seel'],['clair','Clair','Dragon',147,'Dratini'],['will','Will','Psychic',177,'Natu'],['karen','Karen','Dark',228,'Houndour']]],
['Hoenn',[['roxanne','Roxanne','Rock',299,'Nosepass'],['brawly','Brawly','Fighting',296,'Makuhita'],['wattson','Wattson','Electric',309,'Electrike'],['flannery','Flannery','Fire',322,'Numel'],['norman','Norman','Normal',287,'Slakoth'],['winona','Winona','Flying',333,'Swablu'],['tate','Tate','Psychic',343,'Baltoy'],['juan','Juan','Water',116,'Horsea'],['sidney','Sidney','Dark',261,'Poochyena'],['phoebe','Phoebe','Ghost',353,'Shuppet','phoebe-gen3'],['glacia','Glacia','Ice',361,'Snorunt'],['drake','Drake','Dragon',371,'Bagon','drake-gen3'],['steven','Steven','Steel',374,'Beldum'],['wallace','Wallace','Water',349,'Feebas']]],
['Sinnoh',[['roark','Roark','Rock',408,'Cranidos'],['gardenia','Gardenia','Grass',406,'Budew'],['maylene','Maylene','Fighting',447,'Riolu'],['crasherwake','Crasher Wake','Water',418,'Buizel'],['fantina','Fantina','Ghost',425,'Drifloon'],['byron','Byron','Steel',410,'Shieldon'],['candice','Candice','Ice',459,'Snover'],['volkner','Volkner','Electric',403,'Shinx'],['aaron','Aaron','Bug',401,'Kricketot'],['bertha','Bertha','Ground',449,'Hippopotas'],['flint','Flint','Fire',390,'Chimchar'],['lucian','Lucian','Psychic',439,'Mime Jr.'],['cynthia','Cynthia','Dragon',443,'Gible'],['cyrus','Cyrus','Dark',434,'Stunky']]],
['Unova',[['cilan','Cilan','Grass',511,'Pansage'],['clay','Clay','Ground',529,'Drilbur'],['skyla','Skyla','Flying',580,'Ducklett'],['elesa','Elesa','Electric',522,'Blitzle'],['burgh','Burgh','Bug',540,'Sewaddle'],['lenora','Lenora','Normal',506,'Lillipup'],['brycen','Brycen','Ice',613,'Cubchoo'],['drayden','Drayden','Dragon',610,'Axew'],['iris','Iris','Dragon',633,'Deino','iris-gen5bw2'],['n','N','Dark',570,'Zorua'],['ghetsis','Ghetsis','Dark',629,'Vullaby'],['colress','Colress','Steel',599,'Klink'],['alder','Alder','Bug',636,'Larvesta'],['shauntal','Shauntal','Ghost',607,'Litwick'],['grimsley','Grimsley','Dark',551,'Sandile'],['caitlin','Caitlin','Psychic',517,'Munna'],['marshal','Marshal','Fighting',532,'Timburr']]],
['Entrenadores',[['bugcatcher','Cazabichos','Bug',10,'Caterpie'],['hiker','Montañero','Rock',74,'Geodude'],['fisherman','Pescador','Water',60,'Poliwag'],['scientist','Científico','Electric',81,'Magnemite']]],
['Leyendas',[['hiser','Hiser 🔒'],['king','KING 🔒']]]];
const P=window.TRAINER_PERKS=window.TRAINER_PERKS||{};
const SI={hiser:[133,'Eevee'],king:[151,'Mew']};
const H=[];
REG.forEach(([rg,l])=>l.forEach(h=>{const [k,n,t,id,sn,f]=h;H.push([k,n,f,rg]);
 if(t){const e=TY[t];P[k]={n:e[0]+' Poder '+e[1],d:'+5% de daño de tipo '+e[1],type:t,tm:1.05};SI[k]=[id,sn]}}));
P.king={n:'👑 REY',d:'+10% de daño, +50% GatuCoin y más shiny',all:1.1,coins:1.5,shiny:.03};
if(typeof TRAINER_SVG!=='undefined'){H.forEach(([k,,f])=>{if(k==='boy'||k==='girl')return;
 TRAINER_SVG[k]=k==='hiser'?'<img src="assets/meowscarada.png" alt="" style="height:64px">':k==='king'?'<div style="font-size:54px;line-height:64px">👑</div>':'<img src="sprites/trainers/'+(f||k)+'.png" alt="" style="height:64px;image-rendering:pixelated">'})}
// ---- Daño de tipo del héroe ----
if(typeof calcDamage==='function'){const _c=calcDamage;calcDamage=function(att){const r=_c.apply(this,arguments);try{
 const p=P[(typeof state!=='undefined'&&state&&state.trainer)||'']||{};
 if(p.type&&r.damage>0&&String(r.moveType).toLowerCase()===p.type.toLowerCase()&&state.team.some(m=>m.speciesId===att.speciesId&&m.level===att.level)){const v=r.damage*p.tm,f=Math.floor(v);r.damage=Math.max(1,f+(Math.random()<v-f?1:0))}}catch(e){}return r}}
// ---- Shiny +20% ----
if(typeof shinyRollOdds==='function'){const _s=shinyRollOdds;shinyRollOdds=function(){return _s.apply(this,arguments)*1.2}}
// ---- Contador de compartidas (cuenta cuando el menú de compartir termina bien) ----
function countShare(){const now=Date.now();if(now-ST('hz-share-t',0)<GAP)return;SV('hz-share-t',now);SV('hz-shares',shares()+1);
 if(shares()>=NEED){SV('hz-king',1);window.hzToast&&hzToast('👑 ¡KING desbloqueado!')}else window.hzToast&&hzToast('Compartidas: '+shares()+'/'+NEED)}
if(navigator.share){const o=navigator.share.bind(navigator);navigator.share=async function(){const r=await o.apply(null,arguments);countShare();return r}}
if(navigator.clipboard&&navigator.clipboard.writeText){const o=navigator.clipboard.writeText.bind(navigator.clipboard);navigator.clipboard.writeText=async function(t){const r=await o(t);if(String(t).includes('pkn-web'))countShare();return r}}
// ---- Estilos ----
const css=document.createElement('style');css.textContent=`
#trainer-screen{overflow-y:auto}
#trainer-choices.hz-trainers{display:grid!important;grid-template-columns:repeat(2,1fr);gap:10px!important;width:100%;max-width:440px;padding:6px 10px calc(20px + env(safe-area-inset-bottom))}
.hz-trainers .trainer-card{padding:10px 8px!important;gap:6px!important;text-align:center;min-height:150px}
.hz-trainers .trainer-icon-wrap img{width:64px!important;height:64px!important;object-fit:contain}
.hz-perk{font-size:11px;line-height:1.25;opacity:.85}
.hz-reg{grid-column:1/-1;font-weight:800;letter-spacing:1px;text-transform:uppercase;font-size:13px;color:#facc15;padding:8px 2px 0}
.hz-chips{grid-column:1/-1;display:flex;gap:6px;overflow-x:auto;padding:2px 0 6px}
.hz-chip{flex:none;border:0;border-radius:16px;padding:7px 12px;font-size:12px;font-weight:700;background:#334155;color:#fff;font-family:inherit}
.hz-chip.on{background:#f59e0b;color:#111}
.hz-locked{opacity:.65;filter:grayscale(.5)}
.hz-chest{position:fixed;inset:0;z-index:99999;background:#000b;display:flex;align-items:center;justify-content:center;padding:16px}
.hz-chest>div{background:#141a2b;color:#fff;border:2px solid #c89820;border-radius:14px;padding:16px;max-width:360px;width:100%;display:flex;flex-direction:column;gap:10px;max-height:90dvh;overflow:auto}
.hz-chest h3{margin:0}.hz-chest p{margin:0;font-size:14px}
.hz-chest button,.hz-chest a.hz-donate,.hz-chest input{padding:12px;border-radius:10px;border:0;font-size:15px;font-weight:700;text-align:center;text-decoration:none;color:#fff;background:#3b82f6;font-family:inherit}
.hz-chest input{background:#fff;color:#111}.hz-chest a.hz-donate{background:#f59e0b}.hz-chest button.close{background:#475569}
.hz-prog{height:12px;background:#fff3;border-radius:8px;overflow:hidden}.hz-prog i{display:block;height:100%;background:#facc15}
.hz-toast{position:fixed;top:calc(12px + env(safe-area-inset-top));left:50%;transform:translateX(-50%);background:#000d;color:#fff;padding:8px 14px;border-radius:18px;z-index:100000;font-size:14px}
/* Franja inferior libre para el botón de Netlify */
.screen.active{padding-bottom:calc(68px + env(safe-area-inset-bottom))!important;box-sizing:border-box}
.xbtn{bottom:calc(76px + env(safe-area-inset-bottom))!important}
body:not([data-screen="title-screen"]) .xbtn,body:not([data-screen="title-screen"]) #hiser-wallet{display:none!important}`;
document.head.appendChild(css);
setInterval(()=>{const a=document.querySelector('.screen.active');document.body.dataset.screen=a?a.id:''},300);
// ---- Ventanas de bloqueo ----
async function sha(t){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function modal(title,text,kingMode,done){
 const w=document.createElement('div');w.className='hz-chest';const b=document.createElement('div');w.appendChild(b);
 const el=(t,x,c)=>{const e=document.createElement(t);if(x)e.textContent=x;if(c)e.className=c;b.appendChild(e);return e};
 el('h3',title);el('p',text);let bar,pc;
 if(kingMode){pc=el('p');bar=document.createElement('div');bar.className='hz-prog';bar.innerHTML='<i></i>';b.appendChild(bar);
  const up=()=>{const n=Math.min(NEED,shares());pc.textContent='Compartidas: '+n+'/'+NEED;bar.firstChild.style.width=100*n/NEED+'%';if(kingOpen()){w.remove();done(true)}};up();
  const s=el('button','🔗 Compartir ahora');s.onclick=async()=>{try{await (window.__POKE_SHARE&&__POKE_SHARE.shareGame?__POKE_SHARE.shareGame():navigator.share({title:'POKE WEB by HiseR',url:location.href}))}catch(e){}setTimeout(up,600)}}
 const a=el('a','💛 Donar con PayPal','hz-donate');a.href=DONATE();a.target='_blank';a.rel='noopener noreferrer';
 const i=el('input');i.placeholder='Código de donante (HISER-XXXXXXXX)';i.autocapitalize='characters';const m=el('p');
 const ok=el('button','Validar código');ok.onclick=async()=>{const h=await sha(i.value.trim().toUpperCase());
  if((window.DONOR_HASHES||[]).includes(h)){SV('hz-donor',1);w.remove();done(true)}else m.textContent='Código no válido.'};
 const x=el('button','Cerrar','close');x.onclick=()=>w.remove();document.body.appendChild(w)}
const toast2=m=>window.hzToast&&hzToast(m);
// ---- Pantalla de elegir héroe ----
window.showTrainerSelect=async function(){
 showScreen('trainer-screen');
 const wrap=document.getElementById('trainer-choices');wrap.textContent='';wrap.classList.add('hz-trainers');
 await new Promise(resolve=>{
  const chips=document.createElement('div');chips.className='hz-chips';wrap.appendChild(chips);
  const els=[];let cur=null;
  REG.forEach(([rg])=>{const c=document.createElement('button');c.textContent=rg;c.className='hz-chip';c.onclick=()=>{[...chips.children].forEach(x=>x.classList.toggle('on',x===c));els.forEach(e=>e.style.display=e.dataset.rg===rg?'':'none');wrap.scrollIntoView&&0};chips.appendChild(c)});
  const all=document.createElement('button');all.textContent='Todos';all.className='hz-chip on';all.onclick=()=>{[...chips.children].forEach(x=>x.classList.toggle('on',x===all));els.forEach(e=>e.style.display='')};chips.prepend(all);
  H.forEach(([k,n,f,rg])=>{
  if(rg!==cur){cur=rg;const hd=document.createElement('div');hd.className='hz-reg';hd.textContent=rg;hd.dataset.rg=rg;wrap.appendChild(hd);els.push(hd)}
  const p=P[k]||{},isH=k==='hiser',isK=k==='king',RG={Johto:'1',Hoenn:'2',Sinnoh:'3',Unova:'4'},RN={'1':'Kanto','2':'Johto','3':'Hoenn','4':'Sinnoh'},regLock=()=>RG[rg]&&typeof isGenBeaten==='function'&&!isGenBeaten(RG[rg]),lock=()=>regLock()||(isH&&!donor())||(isK&&!kingOpen());
  const c=document.createElement('div');c.className='trainer-card'+(lock()?' hz-locked':'');c.tabIndex=0;c.setAttribute('role','button');c.dataset.rg=rg;els.push(c);
  const w=document.createElement('div');w.className='trainer-icon-wrap';w.innerHTML=TRAINER_SVG[k]||TRAINER_SVG.boy;
  const l=document.createElement('div');l.className='trainer-label';l.textContent=(isH||isK)&&!lock()?n.replace(' 🔒',''):n;
  const d=document.createElement('div');d.className='hz-perk';d.textContent=p.n?p.n+': '+p.d:(k==='boy'||k==='girl'?'Sin habilidad':'');
  if(isK&&lock())d.textContent+=' · 🔒 10 compartidas o donación';
  if(regLock())d.textContent='🔒 Completa '+RN[RG[rg]]+' para desbloquear';
  const si=document.createElement('div');si.className='hz-perk';si.style.fontWeight='700';si.textContent=SI[k]?'Inicial: '+SI[k][1]:'Inicial a elegir';c.append(w,l,d,si);
  const go=()=>{state.trainer=k;try{localStorage.setItem('poke_trainer',k)}catch(e){}resolve()};
  const pick=()=>{if(regLock())return toast2('🔒 Completa '+RN[RG[rg]]+' para desbloquear a '+n);if(lock())return modal(isK?'👑 KING':'🔒 Entrenador Hiser',isK?'El héroe legendario. Desbloquéalo compartiendo el juego 10 veces o con una donación de cualquier monto.':'Se desbloquea con una donación: después de donar, pide tu código a Hiser y pégalo aquí.',isK,()=>{c.classList.remove('hz-locked');l.textContent=n.replace(' 🔒','')});go()};
  c.onclick=pick;c.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')pick()};wrap.appendChild(c)})});
 const f=SI[state.trainer];if(f&&typeof pickForcedStarter==='function')await pickForcedStarter(f[0]);else await showStarterSelect();
};
})();
