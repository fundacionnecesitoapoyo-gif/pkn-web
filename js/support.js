// POKE WEB by HiseR — Tienda de apoyo (PayPal). Pega aquí los enlaces cuando existan.
(function(){
const LINKS={donate:'https://www.paypal.com/ncp/payment/PLB-4RNG2ZSLF8RQ',slots:'https://www.paypal.com/ncp/payment/PLB-GY99F835DQ5T'};window.__HZ_LINKS=LINKS; // se pueden cambiar en config.json
const DISCORD='https://discord.gg/SFaF5GnvAr';
const DON=[['☕','Café','$2','Gracias por ayudar'],['⚪','Pokébola','$5','Una de las favoritas','MÁS POPULAR'],['💎','Mega Piedra','$10','Ayudas a crear regiones'],['👑','Legendario','$25','Eres parte del proyecto']];
const SLOT=[['🎟️','5 GatuSlot','$1.99','+25 espacios en tu Caja'],['🎟️','15 GatuSlot','$4.99','+75 espacios · 3 packs por el precio de 2.5','MEJOR VALOR'],['🎟️','40 GatuSlot','$9.99','+200 espacios']];
const ST=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
function css(){if(document.getElementById('hz-supcss'))return;const s=document.createElement('style');s.id='hz-supcss';s.textContent=`
.hz-sup{position:fixed;inset:0;z-index:99997;background:#0b1020f5;color:#fff;overflow-y:auto;padding:calc(14px + env(safe-area-inset-top)) 14px calc(96px + env(safe-area-inset-bottom));font-family:inherit}
.hz-sup h2{margin:4px 0;font-size:20px}.hz-sup p{margin:4px 0;font-size:13px;opacity:.85}.hz-sup h4{margin:16px 0 6px;font-size:14px;color:#facc15}
.hz-sc{display:flex;align-items:center;gap:10px;background:#1e293b;border:2px solid #334155;border-radius:12px;padding:10px;margin:7px 0;position:relative;text-decoration:none;color:#fff}
.hz-sc.hot{border-color:#f59e0b}.hz-sc .i{font-size:28px}.hz-sc .t{flex:1;font-size:12px}.hz-sc .t b{font-size:14px;display:block}.hz-sc .p{font-weight:800;font-size:17px;color:#facc15}
.hz-sc .tag{position:absolute;top:-8px;right:10px;background:#f59e0b;color:#111;font-size:10px;font-weight:800;padding:2px 8px;border-radius:10px}
.hz-sup button,.hz-sup a.b{border:0;border-radius:10px;padding:11px 14px;font-weight:700;font-size:14px;background:#3b82f6;color:#fff;font-family:inherit;text-decoration:none;display:inline-block}
.hz-sup .y{background:#f59e0b;color:#111}.hz-sup .g{background:#475569}.hz-sup .d{background:#5865f2}.hz-sup input{padding:11px;border-radius:10px;border:0;width:170px;font-size:14px}
.hz-sup .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:8px 0}.hz-sup .m{font-size:12px;color:#facc15;min-height:16px}`;document.head.appendChild(s)}
async function sha(t){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
window.openSupport=function(focus){css();const w=document.createElement('div');w.className='hz-sup';document.body.appendChild(w);
 const E=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x)e.textContent=x;return e};
 const card=(a,url)=>{const c=E(url?'a':'div','hz-sc'+(a[4]?' hot':''));if(url){c.href=url;c.target='_blank';c.rel='noopener noreferrer'}
  c.append(E('div','i',a[0]));const t=E('div','t');t.append(E('b','',a[1]),document.createTextNode(a[3]));c.append(t,E('div','p',a[2]));if(a[4])c.append(E('span','tag',a[4]));return c};
 w.append(E('h2','','💛 Apoya POKE WEB'),E('p','','Gratis para siempre. Si te gusta, ayúdanos a crear más regiones, personajes y sorpresas. Pago seguro con PayPal, sin suscripciones.'));
 const donU=LINKS.donate||DISCORD;
 const h1=E('h4','','Donar · desbloquea a Hiser y KING');w.append(h1,E('p','','Cualquier monto te da el entrenador Hiser y al legendario KING.'));DON.forEach(a=>w.append(card(a,donU)));
 const h2=E('h4','','🎟️ GatuSlot · amplía tu Caja Pokémon');w.append(h2);
 if(LINKS.slots)SLOT.forEach(a=>w.append(card(a,LINKS.slots)));else w.append(E('p','','Los packs de GatuSlot llegan muy pronto. Mientras tanto, gana 1 GatuSlot por cada gimnasio que venzas.'));
 w.append(E('h4','','Después de pagar'),E('p','','Envía tu comprobante en nuestro Discord y recibirás tu código en poco tiempo. Luego pégalo aquí:'));
 const r=E('div','row');const i=E('input');i.placeholder='Código';i.autocapitalize='characters';const ok=E('button','g','Canjear');const m=E('div','m');
 ok.onclick=async()=>{const c=i.value.trim().toUpperCase();if(!c)return;const h=await sha(c);
  if((window.DONOR_HASHES||[]).includes(h)){localStorage.setItem('hz-donor','1');m.textContent='✅ ¡Gracias! Hiser y KING desbloqueados.';return}
  if(typeof window.__POKE_REDEEM==='function'){const q=await window.__POKE_REDEEM(h);if(q){m.textContent='🎟️ +'+q+' GatuSlot';return}}
  m.textContent='Código no válido o ya usado.'};
 r.append(i,ok);w.append(r,m);
 const d=E('a','b d','💬 Ir al Discord');d.href=DISCORD;d.target='_blank';d.rel='noopener noreferrer';w.append(d,E('p','','100% voluntario: ninguna función del juego es obligatoria de pagar. KING también se desbloquea compartiendo el juego 10 veces.'));
 const cl=E('button','g','✖ Cerrar');cl.style.cssText='position:fixed;left:14px;bottom:calc(76px + env(safe-area-inset-bottom));z-index:99999';cl.onclick=()=>w.remove();w.append(cl)};
// el botón Apoyar de la portada abre esta tienda
document.querySelectorAll('.xbtn button').forEach(b=>{if(/Apoyar/.test(b.textContent))b.onclick=()=>openSupport()});

// Configuración remota ligera: config.json (enlaces, anuncio) sin tocar el código
fetch('config.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(c=>{if(!c)return;
 if(c.paypal){if(c.paypal.donar)LINKS.donate=c.paypal.donar;if(c.paypal.slots)LINKS.slots=c.paypal.slots}
 if(c.anuncio&&c.anuncio.texto&&localStorage.getItem('hz-ann')!==c.anuncio.id){const b=document.createElement('div');b.id='hz-ann';b.textContent='📣 '+c.anuncio.texto+'  ✕';
  b.style.cssText='position:fixed;top:calc(8px + env(safe-area-inset-top));left:10px;right:10px;z-index:9990;background:#1d4ed8;color:#fff;padding:9px 12px;border-radius:12px;font:600 13px system-ui;text-align:center';
  b.onclick=()=>{localStorage.setItem('hz-ann',c.anuncio.id);b.remove()};const s=document.createElement('style');s.textContent='body:not([data-screen="title-screen"]) #hz-ann{display:none}';document.head.appendChild(s);document.body.appendChild(b)}}).catch(()=>{});
})();
