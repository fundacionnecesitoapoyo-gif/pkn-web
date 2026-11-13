// Capa 3D: convierte los sprites de batalla en figuras de cubos (voxels) con Three.js. Solo Gen 1.
(function(){
if(!window.THREE)return;
const st=document.createElement('style');
st.textContent='.gen-btn:not([data-gen="1"]){display:none!important}'+
'#fx3d{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:100;display:none}'+
'#battle-screen.active .battle-sprite:not([data-nofx]){clip-path:inset(100%)!important}';
document.head.appendChild(st);
const cv=document.createElement('canvas');cv.id='fx3d';document.body.appendChild(cv);
const R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
const S=new THREE.Scene();S.add(new THREE.HemisphereLight(0xffffff,0x6677aa,1.05));
const L=new THREE.DirectionalLight(0xffffff,.7);L.position.set(-200,300,500);S.add(L);
let C,W=0,H=0;
function size(){W=innerWidth;H=innerHeight;R.setSize(W,H);C=new THREE.OrthographicCamera(0,W,0,-H,-2000,2000);C.position.z=1000}
addEventListener('resize',size);size();
const pts={},models=new Map();
function getPts(url){return pts[url]||(pts[url]=new Promise((ok,no)=>{const i=new Image();i.crossOrigin='anonymous';
 i.onload=()=>{try{const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const x=c.getContext('2d');x.drawImage(i,0,0);
  const d=x.getImageData(0,0,c.width,c.height).data,a=[];for(let y=0;y<c.height;y++)for(let xx=0;xx<c.width;xx++){const k=(y*c.width+xx)*4;if(d[k+3]>128)a.push([xx,y,d[k],d[k+1],d[k+2]])}
  ok({a,w:c.width,h:c.height})}catch(e){no(e)}};i.onerror=no;i.src=url}))}
let STEP=1;
function build(p){const D=matchMedia('(pointer:coarse)').matches?2:3,k=STEP,a=p.a.filter(q=>q[0]%k===0&&q[1]%k===0),m=new THREE.InstancedMesh(new THREE.BoxGeometry(k,k,k),new THREE.MeshLambertMaterial({transparent:true}),a.length*D),M=new THREE.Matrix4(),c=new THREE.Color();let n=0;
 a.forEach(q=>{for(let z=0;z<D;z++){M.setPosition(q[0]-p.w/2,p.h-q[1],(z-D/2)*k);m.setMatrixAt(n,M);c.setRGB(q[2]/255,q[3]/255,q[4]/255);m.setColorAt(n++,c)}});
 const g=new THREE.Group();g.add(m);
 const sh=new THREE.Mesh(new THREE.CircleGeometry(1,32),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.3}));sh.scale.set(p.w*.34,p.w*.1,1);sh.position.set(0,2,-D*k);g.add(sh);
 const pl=new THREE.Mesh(new THREE.CircleGeometry(1,40),new THREE.MeshBasicMaterial({color:0xb7ff58,transparent:true,opacity:.14}));pl.scale.set(p.w*.46,p.w*.14,1);pl.position.set(0,1,-D*k-1);g.add(pl);g.userData.h=p.h;return g}
function sync(img){let o=models.get(img);const url=img.currentSrc||img.src;
 if(!url)return;if(!o||o.url!==url){if(o)S.remove(o.g);o={url,g:null,t:Math.random()*6};models.set(img,o);
  getPts(url).then(p=>{if(models.get(img)===o){o.g=build(p);S.add(o.g)}}).catch(()=>img.setAttribute('data-nofx','1'))}}
(function loop(t){requestAnimationFrame(loop);
 const on=document.getElementById('battle-screen')?.classList.contains('active');cv.style.display=on?'block':'none';
 if(!on){models.forEach(o=>o.g&&S.remove(o.g));models.clear();return}
 const imgs=[...document.querySelectorAll('#battle-screen .battle-sprite:not([data-nofx])')];
 models.forEach((o,i)=>{if(!imgs.includes(i)){o.g&&S.remove(o.g);models.delete(i)}});
 STEP=imgs.length<=4?1:2;imgs.forEach(sync);
 models.forEach((o,img)=>{if(!o.g)return;const r=img.getBoundingClientRect(),cs=getComputedStyle(img),vis=r.width>2&&cs.visibility!=='hidden'&&cs.display!=='none';
  o.g.visible=vis;if(!vis)return;const s=r.height/o.g.userData.h,side=img.closest('.battle-side-player,.player-side,[class*=player]')?-1:1;
  o.g.scale.setScalar(s);o.g.position.set(r.left+r.width/2,-r.bottom,0);
  o.g.rotation.y=side*.45+Math.sin(t/900+o.t)*.25;o.g.rotation.x=.12;
  const op=parseFloat(cs.opacity);o.g.children.forEach(ch=>{if(ch.isInstancedMesh)ch.material.opacity=isNaN(op)?1:op})});
 R.render(S,C)})(0);
})();
