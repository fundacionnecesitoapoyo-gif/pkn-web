// POKE WEB by HiseR — Selector de regiones propio y portada limpia
(function(){
const R=[['1','Kanto','I','🏯','linear-gradient(135deg,#ef4444,#7f1d1d)'],['2','Johto','II','🔔','linear-gradient(135deg,#f59e0b,#78350f)'],['3','Hoenn','III','🌊','linear-gradient(135deg,#38bdf8,#1e3a8a)'],['4','Sinnoh','IV','❄️','linear-gradient(135deg,#a78bfa,#4c1d95)'],['5','Unova','V','⚙️','linear-gradient(135deg,#94a3b8,#0f172a)'],['both','Todas','I–V','🌍','linear-gradient(135deg,#ec4899,#f59e0b,#22c55e,#3b82f6)']];
const PRE={'2':'Kanto','3':'Johto','4':'Hoenn','5':'Sinnoh','both':'las 5 regiones'};
function build(){const first=document.querySelector('.gen-btn');if(!first||document.getElementById('hz-regions'))return;const par=first.parentElement;par.style.display='none';
 const box=document.createElement('div');box.id='hz-regions';
 R.forEach(([g,n,r,ic,bg])=>{const b=document.createElement('button');b.type='button';b.dataset.g=g;b.style.background=bg;
  b.innerHTML='<span class="i">'+ic+'</span><b>'+n+'</b><small>'+r+'</small>';
  b.onclick=()=>{const o=document.querySelector('.gen-btn[data-gen="'+g+'"]');if(o)o.click()};box.appendChild(b)});
 par.parentElement.insertBefore(box,par)}
function tidy(){
 // quitar etiquetas de texto que sobran en la portada
 document.querySelectorAll('#title-screen *').forEach(e=>{if(e.children.length===0&&/^\s*(elige regi|choose region|escolha)/i.test(e.textContent||''))e.style.display='none'});
 // barra inferior más corta: sin Discord (ya está en el menú) y Instalar compacto
 document.querySelectorAll('.xbtn button,.xbtn a').forEach(b=>{const t=b.textContent||'';if(/Discord/.test(t))b.style.display='none';if(/Instalar/.test(t)&&t.trim()!=='⬇️'){b.textContent='⬇️';b.title='Instalar la app'}})}
function sync(){build();tidy();
 document.querySelectorAll('#hz-regions button').forEach(b=>{const g=b.dataset.g;let l=false;try{l=genLocked(g)}catch(e){}
  b.classList.toggle('lock',l);let t=b.querySelector('.t');
  if(l){if(!t){t=document.createElement('em');t.className='t';b.appendChild(t)}t.textContent='🔒 Completa '+PRE[g]}else if(t)t.remove();
  const o=document.querySelector('.gen-btn[data-gen="'+g+'"]');b.classList.toggle('on',!!(o&&o.classList.contains('gen-btn--active')))})}
sync();setInterval(sync,600);
})();
