// POKE WEB by HiseR — Extras del modo STAFF (solo si el modo STAFF está activo)
(function(){
const ON=()=>localStorage.getItem('hz-creator')==='1';
const KEYS=['poke_dex','poke_shiny_dex','poke_achievements','poke_mega_stones','poke_mega_bracelet','hiser_armored_mewtwo','poke_pokedex','hz-gatu','hz-gatuslot','hz-box'];
// Copia de seguridad de tu progreso real: al salir del modo STAFF se restaura
window.hzStaffRestore=function(){try{const bk=JSON.parse(localStorage.getItem('hz-staff-bk')||'null');if(!bk)return;
 KEYS.forEach(k=>{if(bk[k]==null)localStorage.removeItem(k);else localStorage.setItem(k,bk[k])});
 localStorage.removeItem('hz-staff-bk');localStorage.removeItem('hz-staff-box')}catch(e){}};
if(!ON())return;
if(!localStorage.getItem('hz-staff-bk')){const bk={};KEYS.forEach(k=>bk[k]=localStorage.getItem(k));localStorage.setItem('hz-staff-bk',JSON.stringify(bk))}
// Pokédex completa (normal y shiny), logros, Megapulsera y todas las Megapiedras
try{const d={},s={};for(let i=1;i<=649;i++){d[i]=1;s[i]=1}
 localStorage.setItem('poke_dex',JSON.stringify(d));localStorage.setItem('poke_shiny_dex',JSON.stringify(s));
 if(typeof ACHIEVEMENTS!=='undefined')localStorage.setItem('poke_achievements',JSON.stringify(ACHIEVEMENTS.map(a=>a.id)));
 localStorage.setItem('poke_mega_bracelet','1');
 if(typeof MEGA_FORMS!=='undefined')localStorage.setItem('poke_mega_stones',JSON.stringify(Object.keys(MEGA_FORMS).map(Number)));
 localStorage.setItem('hiser_armored_mewtwo','1')}catch(e){}
// GatuCoin infinitas (99999) y GatuSlot siempre disponibles
setInterval(()=>{try{const c=Number(localStorage.getItem('hz-gatu'))||0;if(c<99999){if(window.__hzAddCoins)__hzAddCoins(99999-c);else localStorage.setItem('hz-gatu','99999')}
 const g=Number(JSON.parse(localStorage.getItem('hz-gatuslot')||'0'))||0;if(g<99)localStorage.setItem('hz-gatuslot','99')}catch(e){}},800);
// Caja STAFF: Mewtwo Acorazado + todos los legendarios shiny
window.hzStaffBox=async function(){let n=0;try{
 const B=JSON.parse(localStorage.getItem('hz-box')||'[]');
 const ids=[...(typeof LEGENDARY_ID_SET!=='undefined'?LEGENDARY_ID_SET:[])].filter(i=>i<=649).sort((a,b)=>a-b);
 if(!B.some(p=>p.armored)){const sp=await fetchPokemonById(150);if(sp){const p=createInstance(sp,50,true,1);p.name='Mewtwo Acorazado';p.armored=true;B.push(p);n++}}
 for(const id of ids){if(B.some(p=>p.speciesId===id&&p.isShiny&&!p.armored))continue;const sp=await fetchPokemonById(id);if(!sp)continue;B.push(createInstance(sp,50,true,1));n++}
 localStorage.setItem('hz-box',JSON.stringify(B));localStorage.setItem('hz-staff-box','1')}catch(e){}return n};
setTimeout(()=>{if(localStorage.getItem('hz-staff-box')!=='1')hzStaffBox().then(n=>{if(n&&window.hzToast)hzToast('🛠 STAFF: '+n+' Pokémon añadidos a la Caja')})},2500);
})();
