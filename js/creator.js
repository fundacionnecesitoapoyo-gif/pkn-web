// POKE WEB by HiseR — Modo Creador (solo dueño)
(function(){
const SALT='3a614d827bfde09b584fae31db0ae7fa',ITER=250000,VERIFY='fe82363b3cf450018ae909d84f839e731375deafe2338140396bd8dc15d0ab09';
const h2=h=>Uint8Array.from(h.match(/../g).map(x=>parseInt(x,16)));
async function check(pw){const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveBits']);
 const b=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:h2(SALT),iterations:ITER},k,256);
 return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')===VERIFY}
const on=()=>localStorage.getItem('hz-creator')==='1';
async function ask(){
 if(on()){if(confirm('¿Salir del modo STAFF?')){window.hzStaffRestore&&hzStaffRestore();localStorage.removeItem('hz-creator');localStorage.removeItem('poke_dev_mode');location.reload()}return}
 const until=+localStorage.getItem('hz-clock')||0;if(Date.now()<until){alert('Demasiados intentos. Espera unos minutos.');return}
 const pw=prompt('Clave de STAFF:');if(pw==null||!pw.trim())return;
 if(await check(pw.trim())){localStorage.setItem('hz-cf','0');localStorage.setItem('poke_dev_mode','1');localStorage.setItem('hz-creator','1');
  if(localStorage.getItem('hz-cgs')!=='1'){try{localStorage.setItem('hz-gatuslot',String((+JSON.parse(localStorage.getItem('hz-gatuslot')||'0'))+99))}catch(e){}localStorage.setItem('hz-cgs','1')}
  alert('MODO STAFF ACTIVO\n\n• Todo desbloqueado (regiones, entrenadores, Battle Tower, Megapiedras)\n• Pokédex y logros completos\n• GatuCoin 99999 infinitas y GatuSlot\n• Caja con Mewtwo Acorazado y todos los legendarios shiny\n• Tus marcas no se envían al ranking\n\nAl salir del modo STAFF se restaura tu progreso real.');location.reload()}
 else{const f=(+localStorage.getItem('hz-cf')||0)+1;localStorage.setItem('hz-cf',String(f));if(f>=5){localStorage.setItem('hz-clock',String(Date.now()+600000));localStorage.setItem('hz-cf','0')}alert('Clave incorrecta')}}
let taps=0,last=0;
document.addEventListener('click',e=>{if(!e.target.closest||!e.target.closest('#hb'))return;const n=Date.now();if(n-last>1500)taps=0;taps++;last=n;if(taps>=10){taps=0;ask()}},true);
if(on()){const b=document.createElement('div');b.id='hz-cbadge';b.textContent='🛠 STAFF';b.onclick=ask;b.style.cssText='position:fixed;top:calc(6px + env(safe-area-inset-top));right:6px;z-index:9999;background:#7c2d12cc;color:#fed7aa;font:700 11px system-ui;padding:4px 8px;border-radius:10px';document.body.appendChild(b);
 const s=document.createElement('style');s.textContent='body:not([data-screen="title-screen"]) #hz-cbadge{display:none}';document.head.appendChild(s)}
window.__POKE_CREATOR=on;
})();
