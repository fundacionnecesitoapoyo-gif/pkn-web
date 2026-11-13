// POKE WEB by HiseR — Gestor de sonidos. Pon aquí el archivo de cada evento (carpeta assets/sfx/). Vacío = sin sonido.
(function(){
const FILES={
 click:'',            // tocar botones y tarjetas
 'trainer-select':'', // elegir entrenador
 dialog:'',           // avanzar un diálogo
 'battle-start':'',   // empieza un combate
 attack:'',           // pulsar un ataque
 badge:'',            // ganar medalla
 win:'',              // ganar la región
 map:''               // volver al mapa
};
const VOL=.7,pool={};
const muted=()=>localStorage.getItem('hz-mute')==='1';
function play(n){const f=FILES[n];if(!f||muted())return;try{let a=pool[f];if(!a){a=pool[f]=new Audio('assets/sfx/'+f);a.preload='auto'}a.volume=VOL;a.currentTime=0;const r=a.play();r&&r.catch&&r.catch(()=>{})}catch(e){}}
window.hzSfx=play;
document.addEventListener('click',e=>{const t=e.target;if(!t||!t.closest)return;
 if(t.closest('#trainer-choices .trainer-card')){play('trainer-select');return}
 if(t.closest('[class*="gba-dialog"]')){play('dialog');return}
 const bs=t.closest('#battle-screen button');if(bs){play(/switch|bag|auto|dismiss/i.test(bs.id+bs.className)?'click':'attack');return}
 if(t.closest('button,.poke-card,.gen-btn,.trainer-card'))play('click')},true);
addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&document.querySelector('[class*="gba-dialog"]'))play('dialog')});
let prev='';new MutationObserver(()=>{const s=document.body.dataset.screen||'';if(s===prev)return;prev=s;
 if(s==='battle-screen')play('battle-start');else if(s==='badge-screen')play('badge');else if(s==='win-screen')play('win');else if(s==='map-screen')play('map')}).observe(document.body,{attributes:true,attributeFilter:['data-screen']});
})();
