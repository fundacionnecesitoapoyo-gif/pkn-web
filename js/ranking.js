// Anonymous device identity: the private token never appears in public lists.
(function () {
  function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
  function random(bytes) { return Array.from(crypto.getRandomValues(new Uint8Array(bytes)), b => b.toString(16).padStart(2,'0')).join(''); }
  function identity() {
    let value=read('poke_ranking_identity',null);
    if (!value) { value={id:random(16),token:random(32)}; localStorage.setItem('poke_ranking_identity',JSON.stringify(value)); }
    return value;
  }
  function localScore() {
    const previous=read('poke_ranking_best',{}), hof=getHallOfFame();
    const endless=read('poke_endless_state',{});
    const score={name:previous.name || 'Entrenador',
      stage:Math.max(previous.stage||0, endless.active ? endless.stageNumber||0 : 0,...hof.filter(e=>e.endless).map(e=>e.stageNumber||0)),
      leagues:Math.max(previous.leagues||0,hof.filter(e=>!e.endless).length),
      dex:Math.max(previous.dex||0,Object.values(getPokedex()).filter(_isDexCaught).length)};
    try { localStorage.setItem('poke_ranking_best',JSON.stringify(score)); } catch {}
    return score;
  }
  async function open() {
    document.getElementById('ranking-modal')?.remove();
    const overlay=document.createElement('div'); overlay.id='ranking-modal'; overlay.className='item-equip-overlay';
    const box=document.createElement('div'); box.className='item-equip-box';
    const heading=document.createElement('h2'); heading.textContent='Ranking'; box.appendChild(heading);
    const status=document.createElement('p'); status.setAttribute('role','status'); box.appendChild(status);
    const name=document.createElement('input'); name.value=localScore().name; name.maxLength=20; name.setAttribute('aria-label','Nombre público'); box.appendChild(name);
    const submit=document.createElement('button'); submit.className='btn-secondary'; submit.textContent='Subir mis marcas'; box.appendChild(submit);
    const lists=document.createElement('div');box.appendChild(lists);
    const close=document.createElement('button');close.className='btn-secondary';close.textContent='Cerrar';close.onclick=()=>overlay.remove();box.appendChild(close);
    overlay.appendChild(box);document.body.appendChild(overlay);
    function render(data) {
      lists.replaceChildren();
      [['Mejores runs',data.runs],['Pokédex',data.dex]].forEach(([title,rows])=>{
        const h=document.createElement('h3');h.textContent=title;lists.appendChild(h);
        const ol=document.createElement('ol');
        rows.forEach(row=>{const li=document.createElement('li');li.textContent=`${row.name} · Etapa ${row.stage} · Ligas ${row.leagues} · Pokédex ${row.dex}`;ol.appendChild(li)});
        if(!rows.length){const li=document.createElement('li');li.textContent='Sin marcas todavía';ol.appendChild(li)}
        lists.appendChild(ol);
      });
    }
    async function load(upload) {
      submit.disabled=true; status.textContent=upload?'Enviando…':'Consultando…';
      const own=localScore();render({runs:[own],dex:[own]});
      const ctl=new AbortController(), timer=setTimeout(()=>ctl.abort(),5000);
      try {
        let options={signal:ctl.signal};
        if(upload&&localStorage.getItem('hz-creator')!=='1'){
          const user=identity(); own.name=name.value.trim();
          localStorage.setItem('poke_ranking_best',JSON.stringify(own));
          options={...options,method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+user.token},body:JSON.stringify({...own,id:user.id})};
        }
        const response=await fetch('/api/ranking',options);
        if(!response.ok)throw new Error(String(response.status));
        const data=await response.json();
        if(!Array.isArray(data.runs)||!Array.isArray(data.dex))throw new Error('Invalid ranking');
        render(data);status.textContent='Ranking global · marcas declaradas por los jugadores';
      }catch(e){const own=localScore();render({runs:[own],dex:[own]});status.textContent='Solo marcas locales. '+(e.message==='400'?'Revisa el nombre y las marcas.':e.message==='429'?'Espera un minuto.':'Servidor no disponible.');}
      finally{clearTimeout(timer);submit.disabled=false;}
    }
    submit.onclick=()=>load(true); load(false);
  }
  // Wire existing title buttons if present; otherwise inject a chip.
  const rankBtn = document.getElementById('btn-open-ranking');
  if (rankBtn) rankBtn.onclick = open;
  else {
    const button=document.createElement('button');button.className='gba-chip';button.textContent='🏆 Ranking global';button.onclick=open;
    document.querySelector('#title-screen .gba-chip-grid')?.appendChild(button);
  }
  // Preserve personal best before existing run reset / game over writes.
  addEventListener('pagehide',()=>{try{localScore()}catch{}});
  setInterval(()=>{try{localScore()}catch{}},10000);
  window.openRankingModal = open;
})();
