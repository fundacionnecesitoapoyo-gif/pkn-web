// Arena PvP entry point. Does not pretend to be online until matchmaking and
// authoritative battle storage are deployed and tested.
(function(){
 const btn=document.getElementById('btn-pvp-arena');if(!btn)return;
 btn.addEventListener('click',()=>{
  document.getElementById('hiser-pvp-info')?.remove();
  const overlay=document.createElement('div');overlay.id='hiser-pvp-info';overlay.className='hiser-overlay';
  overlay.innerHTML='<section class="hiser-hub-card" role="dialog" aria-modal="true"><header class="hiser-hub-head"><div><span class="hiser-eyebrow">POKE WEB BY HISER</span><h2>⚔️ Arena PvP</h2></div><button class="hiser-close" aria-label="Cerrar">×</button></header><p class="hiser-note">La Arena PvP está en preparación. El sitio actual ya es público, pero todavía no tiene emparejamiento online ni sincronización segura de turnos. No voy a mostrar combates falsos como si fueran contra personas reales.</p><p class="hiser-note">La siguiente fase necesita salas privadas, códigos de invitación, sincronización de turnos y validación del servidor para evitar trampas. El modo de aventura y la Torre siguen funcionando mientras tanto.</p><button class="hiser-action primary" id="hiser-pvp-close">Entendido</button></section>';
  document.body.appendChild(overlay);
  overlay.querySelector('.hiser-close').onclick=()=>overlay.remove();
  overlay.querySelector('#hiser-pvp-close').onclick=()=>overlay.remove();
  overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove()});
 });
})();
