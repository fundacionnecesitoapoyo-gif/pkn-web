// Poke Web by HiseR — GatuCoin, tienda Mega y ruleta diaria
(function(){
  'use strict';
  const KEY='hz-gatu', DATE_KEY='hiser-wheel-date', SHARE_KEY='hiser-wheel-share-date';
  const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
  const coins=()=>Math.max(0,Number(read(KEY,0))||0);
  const setCoins=n=>{try{localStorage.setItem(KEY,String(Math.max(0,Math.floor(n))))}catch{}};
  const addCoins=n=>{setCoins(coins()+n);renderWallet()};
  window.__hzAddCoins=addCoins;
  const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
  const sharedToday=()=>localStorage.getItem(SHARE_KEY)===today();
  const spunToday=()=>localStorage.getItem(DATE_KEY)===today();
  const safeText=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function renderWallet(){
    let el=document.getElementById('hiser-wallet');
    if(!el){el=document.createElement('button');el.id='hiser-wallet';el.type='button';el.title='Abrir tienda y ruleta';el.addEventListener('click',openHub);document.body.appendChild(el)}
    el.textContent=`🐱 ${coins().toLocaleString('es-CL')} GatuCoin`;
  }
  function openHub(){
    document.getElementById('hiser-hub')?.remove();
    const modal=document.createElement('div');modal.id='hiser-hub';modal.className='hiser-overlay';
    modal.innerHTML=`<section class="hiser-hub-card" role="dialog" aria-modal="true" aria-label="Centro GatuCoin">
      <header class="hiser-hub-head"><div><span class="hiser-eyebrow">POKE WEB BY HISER</span><h2>Centro de recompensas</h2><p>Tu saldo: <b id="hiser-hub-balance">${coins().toLocaleString('es-CL')} GatuCoin</b></p></div><button class="hiser-close" aria-label="Cerrar">×</button></header>
      <nav class="hiser-tabs"><button class="active" data-tab="wheel">🎡 Ruleta diaria</button><button data-tab="shop">💠 Mega tienda</button></nav>
      <div class="hiser-tab-panel" id="hiser-wheel-panel">
        <p class="hiser-note">Comparte el juego para habilitar un giro diario. Premios: 50, 100, 250 o 500 GatuCoin. <b>Probabilidad de Mewtwo Acorazado: 1%</b>.</p>
        <div class="hiser-wheel-wrap"><div class="hiser-wheel" id="hiser-wheel"><span>50</span><span>100</span><span>250</span><span>500</span><span>MEWTWO</span></div><div class="hiser-wheel-pointer"></div></div>
        <div class="hiser-wheel-actions"><button class="hiser-action" id="hiser-share">🔗 Compartir y habilitar</button><button class="hiser-action primary" id="hiser-spin" disabled>Girar ruleta</button></div>
        <p class="hiser-status" id="hiser-wheel-status" aria-live="polite">${spunToday()?'Ya utilizaste tu giro de hoy.':sharedToday()?'Compartido. ¡Puedes girar!':'Primero comparte el juego.'}</p>
        <div class="hiser-rare-reward" id="hiser-rare-reward" ${localStorage.getItem('hiser_armored_mewtwo')?'':'hidden'}>★ Mewtwo Acorazado ya está en tu colección.</div>
      </div>
      <div class="hiser-tab-panel" id="hiser-shop-panel" hidden>
        <p class="hiser-note">Cada Megaevolución cuesta <b>1.000 GatuCoin</b>. La compra desbloquea su megapiedra y el brazalete.</p>
        <div class="hiser-mega-grid" id="hiser-mega-grid"></div>
      </div>
    </section>`;
    document.body.appendChild(modal);
    modal.querySelector('.hiser-close').onclick=()=>modal.remove();
    modal.addEventListener('click',e=>{if(e.target===modal)modal.remove()});
    modal.querySelectorAll('[data-tab]').forEach(btn=>btn.onclick=()=>{
      modal.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b===btn));
      modal.querySelector('#hiser-wheel-panel').hidden=btn.dataset.tab!=='wheel';
      modal.querySelector('#hiser-shop-panel').hidden=btn.dataset.tab!=='shop';
    });
    renderMegaShop();refreshWheel();
    modal.querySelector('#hiser-share').onclick=shareForWheel;
    modal.querySelector('#hiser-spin').onclick=spin;
  }
  function renderMegaShop(){
    const grid=document.getElementById('hiser-mega-grid');if(!grid||typeof MEGA_FORMS==='undefined')return;
    const owned=typeof getMegaStones==='function'?getMegaStones():new Set();
    grid.innerHTML=Object.entries(MEGA_FORMS).map(([base,m])=>{
      const has=owned.has(Number(base));
      return `<article class="hiser-mega-card"><img src="sprites/pokemon/${m.megaId}.png" alt="Mega ${safeText(m.megaName)}" loading="lazy"><b>Mega ${safeText(m.megaName)}</b><small>${has?'Desbloqueada':'1.000 GatuCoin'}</small><button data-buy-mega="${Number(base)}" ${has||coins()<1000?'disabled':''}>${has?'Comprada':'Comprar'}</button></article>`;
    }).join('');
    grid.querySelectorAll('[data-buy-mega]').forEach(btn=>btn.onclick=()=>{
      const id=Number(btn.dataset.buyMega);
      if(coins()<1000||typeof unlockMegaStone!=='function')return;
      if(!confirm(`¿Comprar la megapiedra por 1.000 GatuCoin?`))return;
      setCoins(coins()-1000);unlockMegaStone(id);if(typeof grantMegaBracelet==='function')grantMegaBracelet();
      renderWallet();document.getElementById('hiser-hub-balance').textContent=coins().toLocaleString('es-CL')+' GatuCoin';renderMegaShop();
      const s=document.createElement('p');s.className='hiser-status';s.textContent='¡Megapiedra desbloqueada!';grid.before(s);setTimeout(()=>s.remove(),2500);
    });
  }
  async function shareForWheel(){
    const status=document.getElementById('hiser-wheel-status');if(!status)return;
    if(spunToday()){status.textContent='Ya utilizaste tu giro de hoy.';return}
    const shareData=window.__POKE_SHARE_DATA||{title:'POKE WEB by HiseR',text:'¡Ven a jugar POKE WEB by HiseR conmigo!',url:'https://pkn-web.netlify.app'};
    try{
      if(navigator.share){await navigator.share(shareData);localStorage.setItem(SHARE_KEY,today());status.textContent='¡Gracias por compartir! Tu giro está habilitado.';}
      else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(shareData.text+' '+shareData.url);status.textContent='Enlace copiado. Compártelo y luego pulsa “Ya compartí”.';
        let done=document.getElementById('hiser-confirm-share');if(!done){done=document.createElement('button');done.id='hiser-confirm-share';done.className='hiser-action';done.textContent='Ya compartí';document.querySelector('.hiser-wheel-actions').appendChild(done);done.onclick=()=>{localStorage.setItem(SHARE_KEY,today());done.remove();refreshWheel()}}return;}
      else {status.textContent='Este navegador no permite compartir desde aquí.';return}
    }catch(e){if(e?.name==='AbortError'){status.textContent='Compartir cancelado. No se habilitó el giro.';return}status.textContent='No se pudo completar el envío. Inténtalo otra vez.';return}
    refreshWheel();
  }
  function refreshWheel(){
    const spinBtn=document.getElementById('hiser-spin');if(!spinBtn)return;
    spinBtn.disabled=spunToday()||!sharedToday();
    const status=document.getElementById('hiser-wheel-status');
    if(spunToday())status.textContent='Ya utilizaste tu giro de hoy. Vuelve mañana.';
    else if(sharedToday())status.textContent='Compartido. ¡Tu giro está habilitado!';
    else status.textContent='Primero comparte el juego para habilitar el giro.';
    const bal=document.getElementById('hiser-hub-balance');if(bal)bal.textContent=coins().toLocaleString('es-CL')+' GatuCoin';
  }
  function spin(){
    if(spunToday()||!sharedToday())return;
    const roll=Math.random()*100;let prize;
    if(roll<1)prize={kind:'rare',label:'¡MEWTWO ACORAZADO!',coins:0};
    else if(roll<10)prize={kind:'coins',label:'500 GatuCoin',coins:500};
    else if(roll<25)prize={kind:'coins',label:'250 GatuCoin',coins:250};
    else if(roll<55)prize={kind:'coins',label:'100 GatuCoin',coins:100};
    else prize={kind:'coins',label:'50 GatuCoin',coins:50};
    localStorage.setItem(DATE_KEY,today());
    const wheel=document.getElementById('hiser-wheel');wheel?.classList.remove('spinning');void wheel?.offsetWidth;wheel?.classList.add('spinning');
    setTimeout(()=>{
      if(prize.kind==='rare'){
        localStorage.setItem('hiser_armored_mewtwo','1');
        try{const dex=read('poke_pokedex',{});dex['150']=dex['150']||{caught:true};dex['150'].caught=true;localStorage.setItem('poke_pokedex',JSON.stringify(dex))}catch{}
        document.getElementById('hiser-rare-reward').hidden=false;
        document.getElementById('hiser-wheel-status').textContent='¡INCREÍBLE! Desbloqueaste la recompensa especial Mewtwo Acorazado.';
      }else{addCoins(prize.coins);document.getElementById('hiser-wheel-status').textContent=`¡Ganaste ${prize.label}!`}
      refreshWheel();renderMegaShop();
    },1800);
  }
  window.addEventListener('storage',renderWallet);
  renderWallet();setInterval(renderWallet,2500);
  window.openGatuHub=openHub;
})();
