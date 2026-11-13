// Skin PokeWeb by Hiser: mascota, marca e idioma del menú principal
(function(){
const L={es:{'New Adventure':'Nueva aventura','Battle Tower':'Torre de batalla','Continue Run':'Continuar partida','Continue Battle Tower':'Continuar torre','Region':'Región','Pokémon Roguelike':'Roguelike · Kanto','Pokédex':'Pokédex','Achievements':'Logros','Hall of Fame':'Salón de la fama','Patch Notes':'Novedades','Settings':'Ajustes','How to Play':'Cómo jugar','Mega Stones':'Megapiedras','Save Code':'Código de guardado'},
pt:{'New Adventure':'Nova aventura','Battle Tower':'Torre de batalha','Continue Run':'Continuar jogo','Continue Battle Tower':'Continuar torre','Region':'Região','Pokémon Roguelike':'Roguelike · Kanto','Pokédex':'Pokédex','Achievements':'Conquistas','Hall of Fame':'Hall da fama','Patch Notes':'Novidades','Settings':'Configurações','How to Play':'Como jogar','Mega Stones':'Megapedras','Save Code':'Código de save'},en:{}};
function init(){
 const t=document.getElementById('title-screen');if(!t)return;
 const col=t.querySelector('.gba-title-col'),blk=t.querySelector('.gba-logo-block');if(!col||!blk)return;
 const cr=t.querySelector('.gba-credits');if(cr){cr.className='hz-beta';cr.textContent='BETA · Hecho para la comunidad · pkn-web.netlify.app'}
 const lg=blk.querySelector('.game-logo');if(lg)lg.textContent='POKEWEB';
 const m=document.createElement('img');m.className='hz-logo';m.src='assets/logo-pokeweb.png';m.alt='POKEWEB by HiseR';col.insertBefore(m,col.firstChild);
 const s=document.createElement('select');s.className='hz-lang';s.setAttribute('aria-label','Idioma');
 s.innerHTML='<option value="es">Español</option><option value="en">English</option><option value="pt">Português</option>';col.insertBefore(s,col.firstChild);
 const nodes=[];const w=document.createTreeWalker(t,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const k=n.nodeValue.replace(/^[\s▶📖🏆🏛️📋⚙️💠☁]+/,'').trim();if(k)nodes.push([n,n.nodeValue,k])}
 function apply(l){const d=L[l]||{};nodes.forEach(([n,o,k])=>{if(d[k]){const pre=o.match(/^[\s▶📖🏆🏛️📋⚙️💠☁]*/)[0];n.nodeValue=pre+d[k]}else n.nodeValue=o});
  const sub=blk.querySelector('.game-subtitle');if(sub)sub.textContent='by Hiser';
  try{localStorage.setItem('hz-lang',l)}catch(e){}}
 let l='es';try{l=localStorage.getItem('hz-lang')||'es'}catch(e){}s.value=l;s.onchange=()=>apply(s.value);apply(l);
}
if(document.readyState!=='loading')init();else document.addEventListener('DOMContentLoaded',init);
})();
