// Habilidades por entrenador, GatuCoin, Baúl de oro, mapa con más eventos y dificultad
(function(){
const DONOR_HASHES=['6003bbfc66cb35081b60d3cea40d9f8334b1d214b58dfee7393d81974bfcc059','986b2b0770d35274c9bbc673e21c4c3a3501c1c29a56ae87bfff7533655bda8f','cb7c9833cb0c46d32712a2bbd4b5ddc5d2e83977a487a17c34fe1c4dcd7e4f41','e68641d5be2cc0b3dcb105bfa101c25af2c51b763e4b75e0d3d55da3ef454506','76d30a15ecb7aa92c81e60f7aa3fe8344a9a1196b8ad516d01d883e28146cdb9','2ccd91c82d9fae9490c050b170ce3d6e63da5559337d46199b3f62f0450daffb','359255a40ed7ab951a679fb27d51a5a4115f6cf7e97e68f5eff74fd91ad8bf56','479900de17ab8d5df574345d1d8667276380d855912033b20d9759b7096c50cd','7a3a0db251b0ed3d75d760203f5ea73860c2a69d93e08f33ed6f3f16882c90f8','dc0aef3fdf9f8d005e5c245b05213b1732609a4d5badeb566f724a14bc180513'];
window.DONOR_HASHES=DONOR_HASHES;
const PERKS={
 boy:{n:'Fuerza',d:'+12% daño físico',phys:1.12},
 girl:{n:'Mente',d:'+12% daño especial',spec:1.12},
 red:{n:'Liderazgo',d:'+6% daño a todo tu equipo',all:1.06},
 blue:{n:'Cazador de raros',d:'Más capturas y encuentros legendarios',rare:true},
 silver:{n:'Golpe crítico',d:'+10% de críticos',crit:.10},
 ash:{n:'Perseverancia',d:'Empiezas con 2 Revivir Máx',start:['max_revive','max_revive']},
 dawn:{n:'Coordinadora',d:'+25% GatuCoin',coins:1.25},
 youngster:{n:'Ahorrador',d:'-20% en precios del baúl',disc:.8},
 hiser:{n:'Cazador shiny',d:'Más probabilidad de shiny (donante)',shiny:.03}
};
window.TRAINER_PERKS=PERKS;
const perk=()=>PERKS[(window.state&&state.trainer)||'']||{};
const ST=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const gatu=()=>ST('hz-gatu',0),setGatu=v=>{try{localStorage.setItem('hz-gatu',JSON.stringify(Math.max(0,Math.floor(v))))}catch(e){}};
window.hzGatu={get:gatu,add:v=>setGatu(gatu()+v)};
if(typeof NODE_TYPES!=='undefined')NODE_TYPES.CHEST='chest';
// ---- Mapa: más largo (ver map.js), más eventos y baúles de oro ----
if(typeof generateMap==='function'){const _g=generateMap;generateMap=function(mi){
 const map=_g.apply(this,arguments);try{
  const L=map.layers,n=L.length,rare=perk().rare;let chests=0;
  for(let l=3;l<n-2;l++)for(const nd of L[l]){
   if([NODE_TYPES.BATTLE,NODE_TYPES.ITEM,NODE_TYPES.QUESTION].includes(nd.type)&&chests<4&&Math.random()<.2){nd.type='chest';delete nd.trainerSprite;chests++}
   else if(nd.type===NODE_TYPES.BATTLE&&Math.random()<.18){nd.type=NODE_TYPES.QUESTION;delete nd.trainerSprite}
   else if(rare&&nd.type===NODE_TYPES.BATTLE&&Math.random()<.15){nd.type=NODE_TYPES.CATCH;delete nd.trainerSprite}}
  const t=Math.floor(n/3),c=L[t].find(x=>x.type===NODE_TYPES.BATTLE);if(c){c.type=NODE_TYPES.POKECENTER;delete c.trainerSprite}
  if(rare&&mi>=2&&Math.random()<.35){const c2=L[Math.floor(n/2)].find(x=>x.type===NODE_TYPES.CATCH||x.type===NODE_TYPES.BATTLE);if(c2){c2.type=NODE_TYPES.LEGENDARY;delete c2.trainerSprite}}
 }catch(e){console.warn('perks map',e)}return map}}
if(typeof getNodeSprite==='function'){const _s=getNodeSprite;getNodeSprite=function(node){return node&&node.type==='chest'?'sprites/goldChest.png':_s.apply(this,arguments)}}
// ---- GatuCoin al vencer entrenadores y jefes ----
if(typeof advanceFromNode==='function'){const _a=advanceFromNode;advanceFromNode=function(map,id){
 try{const n=map.nodes&&map.nodes[id];if(n){const base={trainer:40,boss:150,battle:12,silver:80}[n.type]||0;if(base){const g=Math.round(base*(perk().coins||1));window.hzGatu.add(g);hzToast('+'+g+' GatuCoin')}}}catch(e){}
 return _a.apply(this,arguments)}}
// ---- Daño: habilidades del entrenador y dificultad (+8% al rival) ----
if(typeof calcDamage==='function'){const _c=calcDamage;calcDamage=function(att,def){
 const r=_c.apply(this,arguments);try{
  const mine=state.team.some(m=>m.speciesId===att.speciesId&&m.level===att.level),p=perk();let m=1;
  if(mine){const sp=(att.baseStats?.special||0)>=(att.baseStats?.atk||0);m*=p.all||1;m*=sp?(p.spec||1):(p.phys||1);
   if(p.crit&&!r.crit&&r.damage>1&&Math.random()<p.crit){m*=1.5;r.crit=true}}
  else m*=1.08;
  if(m!==1&&r.damage>0){const v=r.damage*m,f=Math.floor(v);r.damage=Math.max(1,f+(Math.random()<v-f?1:0))}}catch(e){}return r}}
if(typeof createInstance==='function'){const _i=createInstance;createInstance=function(sp,lv,sh,mt){
 try{const p=perk();if(!sh&&p.shiny&&Math.random()<p.shiny)sh=true}catch(e){}return _i.call(this,sp,lv,sh,mt)}}
// ---- Objetos iniciales por habilidad ----
if(typeof showMapScreen==='function'){const _m=showMapScreen;showMapScreen=function(){
 try{if(state&&!state._perkStart){state._perkStart=true;(perk().start||[]).forEach(i=>grantUsable(i))}}catch(e){}return _m.apply(this,arguments)}}
// ---- Baúl de oro ----
const NAME={max_revive:'Revivir Máx',full_restore:'Restauración Total',rare_candy:'Caramelo Raro',moon_stone:'Piedra Lunar',tm_normal:'MT (mejora ataque)',escape_rope:'Cuerda Huida'};
const PRICE={max_revive:120,full_restore:90,rare_candy:220,moon_stone:150,tm_normal:130,escape_rope:100};
function openChest(node){
 const ids=Object.keys(NAME).sort(()=>Math.random()-.5).slice(0,3),disc=perk().disc||1;
 const w=document.createElement('div');w.className='hz-chest';const b=document.createElement('div');w.appendChild(b);
 function draw(){b.textContent='';const h=document.createElement('h3');h.textContent='🧰 Baúl de oro';b.appendChild(h);
  const c=document.createElement('p');c.textContent='Tus GatuCoin: 🐱 '+gatu();b.appendChild(c);
  ids.forEach(id=>{const price=Math.round(PRICE[id]*disc),it=USABLE_ITEM_POOL.find(x=>x.id===id);if(!it)return;
   const r=document.createElement('button');r.disabled=gatu()<price||r.dataset.sold;r.textContent=(it.icon||'')+' '+NAME[id]+' — 🐱 '+price;
   r.onclick=()=>{if(gatu()<price)return;setGatu(gatu()-price);grantUsable(id);ids.splice(ids.indexOf(id),1);draw()};b.appendChild(r)});
  const x=document.createElement('button');x.className='close';x.textContent='Cerrar baúl y continuar';x.onclick=()=>{w.remove();advanceFromNode(state.map,node.id);showMapScreen()};b.appendChild(x)}
 document.body.appendChild(w);draw()}
if(typeof onNodeClick==='function'){const _o=onNodeClick;onNodeClick=async function(node){
 if(node.type!=='chest')return _o.apply(this,arguments);
 if(_nodeClickBusy||!node.accessible)return;_nodeClickBusy=true;
 try{state.currentNode=node;for(const n of Object.values(state.map.nodes))if(n.layer===node.layer&&n.id!==node.id&&n.accessible)n.accessible=false;saveRun();openChest(node)}finally{_nodeClickBusy=false}}}
// ---- HUD GatuCoin + avisos ----
window.hzToast=function(t){const e=document.createElement('div');e.className='hz-toast';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),2200)};
const hud=document.createElement('div');hud.id='hz-gatu';document.body.appendChild(hud);
setInterval(()=>{const b=document.getElementById('battle-screen');hud.style.display=b&&b.classList.contains('active')?'none':'block';hud.textContent='🐱 '+gatu()+' GatuCoin'},600);
})();
