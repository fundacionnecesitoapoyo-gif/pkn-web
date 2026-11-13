// Compartir + instalar (PWA) + Discord comunidad
(function(){
const URL_='https://pkn-web.netlify.app';
const DISCORD_URL='https://discord.gg/SFaF5GnvAr';
const TXT='⚡ ¡Estoy jugando POKE WEB by HiseR! RPG Pokémon gratis en el celular: todas las regiones, Battle Tower y ranking. Únete 👉';
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
const css=document.createElement('style');css.textContent='.xbtn{position:fixed;z-index:200;right:10px;bottom:calc(10px + env(safe-area-inset-bottom));display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;max-width:92vw}.xbtn button,.xbtn a{background:#f59e0bf2;color:#111;border:0;border-radius:20px;padding:10px 14px;font:700 13px system-ui;box-shadow:0 2px 8px #0008;text-decoration:none;display:inline-flex;align-items:center}.xbtn #xi{background:#4ade80f2;display:none}.xbtn #xd{background:#5865F2;color:#fff}';
document.head.appendChild(css);
const w=document.createElement('div');w.className='xbtn';w.innerHTML='<button id="xi">📲 Instalar</button><a id="xd" href="'+DISCORD_URL+'" target="_blank" rel="noopener">💬 Discord</a><button id="xs">🔗 Compartir</button>';document.body.appendChild(w);
async function shareGame(){
  const d={title:'POKE WEB by HiseR',text:TXT,url:URL_};window.__POKE_SHARE_DATA=d;
  try{if(navigator.share)await navigator.share(d);else{await navigator.clipboard.writeText(TXT+' '+URL_);(window.hzToast?hzToast('🔗 ¡Enlace copiado! Pégalo en WhatsApp, TikTok o Discord'):alert('¡Enlace copiado!'))}}catch(e){}
}
document.getElementById('xs').onclick=shareGame;
const titleShare=document.getElementById('btn-share-game');
if(titleShare)titleShare.onclick=shareGame;
// Sync Discord hrefs if the user later edits DISCORD_URL above
document.querySelectorAll('#discord-cta, a.gba-chip--discord').forEach(a=>{if(a)a.href=DISCORD_URL});
let ev;addEventListener('beforeinstallprompt',e=>{e.preventDefault();ev=e;document.getElementById('xi').style.display='block'});
document.getElementById('xi').onclick=async()=>{if(!ev)return;ev.prompt();await ev.userChoice;ev=null;document.getElementById('xi').style.display='none'};
// Ocultar durante batalla para no tapar los controles
setInterval(()=>{const b=document.getElementById('battle-screen');w.style.display=b&&b.classList.contains('active')?'none':'flex'},500);
window.__POKE_SHARE_DATA={title:'POKE WEB by HiseR',text:TXT,url:URL_};
window.__POKE_SHARE={shareGame,DISCORD_URL,URL_};
})();
// ===== Marca del creador + apoyo voluntario =====
(function(){
const CREATOR='Hiser';
const DONATE_URL='';            // Preparado: añadir la URL PayPal.me cuando el propietario quiera activarlo.
const GOAL=100, RAISED=0;       // meta en USD y lo recaudado (edítalo tú, a mano)
const css=document.createElement('style');
css.textContent='#hb{position:fixed;z-index:200;left:10px;top:calc(10px + env(safe-area-inset-top));display:flex;align-items:center;gap:6px;background:#000b;border:2px solid #fff3;border-radius:20px;padding:4px 12px 4px 4px;color:#fff;font:700 13px system-ui}#hb{padding:3px 14px 3px 3px;font-size:14px}#hb img{width:56px;height:56px;margin:-2px 0}'+
'#hm{position:fixed;inset:0;z-index:300;background:#000c;display:none;align-items:center;justify-content:center;padding:18px}#hm>div{background:#0f172a;color:#fff;border:2px solid #facc15;border-radius:18px;max-width:380px;width:100%;padding:18px;font:14px/1.45 system-ui;text-align:center;max-height:90vh;overflow:auto}'+
'#hm h2{margin:6px 0 4px}#hm .bar{height:12px;background:#334155;border-radius:6px;overflow:hidden;margin:10px 0 4px}#hm .bar i{display:block;height:100%;background:#4ade80}#hm button,#hm a.go{display:block;width:100%;margin-top:10px;padding:12px;border:0;border-radius:12px;font:700 15px system-ui;text-decoration:none;color:#111;background:#facc15}#hm button.x{background:#334155;color:#fff}#hm small{display:block;opacity:.7;margin-top:10px;font-size:11px}';
document.head.appendChild(css);
const b=document.createElement('div');b.id='hb';b.innerHTML='<img src="hiser-logo.png" alt="Logo"><span></span>';b.lastChild.textContent='Hecho por '+CREATOR;document.body.appendChild(b);
const m=document.createElement('div');m.id='hm';
const pct=Math.min(100,Math.round(RAISED/GOAL*100));
m.innerHTML='<div><img src="hiser-logo.png" width="150" alt="Hiser"><h2>Apoya a '+CREATOR+'</h2>'+
'<p>Este juego es gratis y seguirá siendo gratis. Si quieres ayudar, mi meta es juntar <b>'+GOAL+' USD</b> para <b>mantener el proyecto</b>, más detalles y mejoras.</p>'+
'<div class="bar"><i style="width:'+pct+'%"></i></div><div>'+RAISED+' / '+GOAL+' USD ('+pct+'%)</div>'+
'<span id="hgo"></span><button class="x" id="hx">Cerrar</button>'+
'<small>Apoyo 100% voluntario: no desbloquea nada ni da ventajas en el juego. El pago se hace en la página segura de la plataforma; aquí nunca se piden tarjetas ni datos.</small>'+
'<small>Fan game no oficial. Pokémon es marca de Nintendo, Game Freak y The Pokémon Company. Versión 3D por '+CREATOR+', basada en pokelike.xyz y en el repositorio de pcasaspere.</small></div>';
document.body.appendChild(m);
const go=m.querySelector('#hgo');
if(DONATE_URL){const a=document.createElement('a');a.className='go';a.href=DONATE_URL;a.target='_blank';a.rel='noopener noreferrer';a.textContent='💛 Apoyar el proyecto';go.appendChild(a)}
else{const s=document.createElement('button');s.disabled=true;s.textContent='💛 Pronto disponible';go.appendChild(s)}
const open=()=>m.style.display='flex',close=()=>m.style.display='none';
m.querySelector('#hx').onclick=close;m.onclick=e=>{if(e.target===m)close()};
const sb=document.createElement('button');sb.textContent='💛 Apoyar';sb.onclick=open;document.querySelector('.xbtn').appendChild(sb);
setInterval(()=>{const bs=document.getElementById('battle-screen');b.style.display=bs&&bs.classList.contains('active')?'none':'flex'},500);
})();

// Free beta notice. Closing it does not affect gameplay.
(function(){
 try { if(localStorage.getItem('poke_beta_dismissed'))return; } catch {}
 const notice=document.createElement('div');notice.id='beta-notice';
 notice.style.cssText='position:relative;z-index:201;background:#263957;color:#fff;padding:8px 12px;font:13px/1.5 system-ui;display:flex;align-items:center;gap:10px;justify-content:center';
 const text=document.createElement('span');text.textContent='BETA GRATUITA · Juego en desarrollo. Apoyo voluntario sin ventajas.';
 const close=document.createElement('button');close.textContent='Cerrar';close.style.minHeight='44px';
 close.onclick=()=>{notice.remove();try{localStorage.setItem('poke_beta_dismissed','1')}catch{}};
 notice.append(text,close);document.getElementById('title-screen')?.prepend(notice);
})();
