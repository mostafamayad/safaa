const isMob=window.innerWidth<640||/Android|iPhone|iPad/i.test(navigator.userAgent);
const rand=(a,b)=>a+Math.random()*(b-a);
const lerp=(a,b,t)=>a+(b-a)*t;
const el=id=>document.getElementById(id);
// CURSOR
if(!isMob){const cur=el('cursor'),ring=el('cr');let mx=0,my=0,rx=0,ry=0;document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.cssText='left:'+mx+'px;top:'+my+'px;'});(function a(){rx=lerp(rx,mx,.11);ry=lerp(ry,my,.11);ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(a)})();document.addEventListener('mouseover',e=>{if(e.target.matches('a,button,[role=button]'))ring.classList.add('h');else ring.classList.remove('h')});}else{el('cursor').style.display='none';el('cr').style.display='none';}
// DUST
(function(){const cv=el('dc'),ctx=cv.getContext('2d');let W,H,ps=[];function rs(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight}rs();window.addEventListener('resize',rs);class D{constructor(){this.i(true)}i(r){this.x=rand(0,W);this.y=r?rand(0,H):H+3;this.r=rand(.5,1.8);this.vy=rand(-.25,-.7);this.vx=rand(-.15,.15);this.a=rand(.08,.4);this.da=rand(.002,.006)}s(){this.x+=this.vx;this.y+=this.vy;this.a-=this.da;if(this.a<=0||this.y<-5)this.i(false)}d(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle='rgba(212,175,110,'+this.a+')';ctx.fill()}}const n=isMob?25:55;for(let i=0;i<n;i++)ps.push(new D());(function l(){ctx.clearRect(0,0,W,H);ps.forEach(p=>{p.s();p.d()});requestAnimationFrame(l)})()})();
// AMBIENT
(function(){const cv=el('ac'),ctx=cv.getContext('2d');let W,H,ps=[],mx=-999,my=-999;function rs(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight}rs();window.addEventListener('resize',rs);document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});class A{constructor(){this.i(true)}i(){this.x=rand(0,W);this.y=rand(0,H);this.tx=this.x;this.ty=this.y;this.r=rand(.4,1.4);this.a=rand(.04,.18);this.spd=rand(.2,.7);this.ang=rand(0,Math.PI*2);this.aspd=rand(-.01,.01)}s(){this.ang+=this.aspd;this.tx+=Math.cos(this.ang)*this.spd*.3;this.ty+=Math.sin(this.ang)*this.spd*.3;this.ty-=.08;this.x=lerp(this.x,this.tx,.05);this.y=lerp(this.y,this.ty,.05);if(this.y<-10||this.x<-10||this.x>W+10)this.i();const dx=this.x-mx,dy=this.y-my,d=Math.sqrt(dx*dx+dy*dy);if(d<75){const f=(75-d)/75;this.x+=dx/d*f*1.8;this.y+=dy/d*f*1.8}}d(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle='rgba(212,175,110,'+this.a+')';ctx.fill()}}const n=isMob?18:45;for(let i=0;i<n;i++)ps.push(new A());(function l(){ctx.clearRect(0,0,W,H);ps.forEach(p=>{p.s();p.d()});requestAnimationFrame(l)})()})();
// LOADING
setTimeout(()=>el('ld').classList.add('out'),2800);
// CLOCK TICKS
(function(){const c=el('ckt');for(let i=0;i<60;i++){const t=document.createElement('div');t.className='ck'+(i%5===0?' m':'');t.style.transform='translateX(-50%) rotate('+(i*6)+'deg) translateY(-4px)';t.style.transformOrigin='bottom center';c.appendChild(t)}})();
// COUNTDOWN
const TGT=new Date('2026-08-30T00:00:00+03:00');
function pad(n){return String(Math.max(0,n)).padStart(2,'0')}
function setv(id,v){const e=el(id);if(!e)return;const nv=pad(v);if(e.textContent!==nv){e.textContent=nv;e.classList.remove('tk');void e.offsetWidth;e.classList.add('tk');setTimeout(()=>e.classList.remove('tk'),280)}}
function tick(){const diff=Math.max(0,TGT-new Date());setv('dd',Math.floor(diff/86400000));setv('dh',Math.floor((diff%86400000)/3600000));setv('dm',Math.floor((diff%3600000)/60000));setv('ds',Math.floor((diff%60000)/1000))}
tick();setInterval(tick,1000);
// STARS
(function(){const cv=el('scv'),ctx=cv.getContext('2d');let W,H,stars=[],comets=[],running=false;function rs(){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;stars=[];const n=isMob?120:260;for(let i=0;i<n;i++)stars.push({x:rand(0,W),y:rand(0,H),r:rand(.15,1.4),a:rand(.1,.9),spd:rand(.4,3),ph:rand(0,Math.PI*2),g:Math.random()<.14});if(!isMob){comets=[];for(let i=0;i<2;i++)comets.push({x:rand(-W*.2,W*1.2),y:rand(-50,H*.3),len:rand(60,170),spd:rand(4,9),a:rand(.3,.75),ang:rand(.3,.65)})}}let t=0;function loop(){ctx.clearRect(0,0,W,H);t++;stars.forEach(s=>{const a=.25+.75*(.5+.5*Math.sin(s.ph+t*s.spd*.001));ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=s.g?'rgba(212,175,110,'+a+')':'rgba(255,250,240,'+(a*.65)+')';ctx.fill()});comets.forEach(c=>{c.x+=Math.cos(c.ang)*c.spd;c.y+=Math.sin(c.ang)*c.spd;c.a-=.011;if(c.a<=0){c.x=rand(-W*.2,W*1.2);c.y=rand(-50,H*.3);c.a=rand(.3,.75);}const g=ctx.createLinearGradient(c.x,c.y,c.x-Math.cos(c.ang)*c.len,c.y-Math.sin(c.ang)*c.len);g.addColorStop(0,'rgba(212,175,110,'+c.a+')');g.addColorStop(1,'transparent');ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(c.x-Math.cos(c.ang)*c.len,c.y-Math.sin(c.ang)*c.len);ctx.strokeStyle=g;ctx.lineWidth=1.4;ctx.stroke()});requestAnimationFrame(loop)}const ob=new IntersectionObserver(en=>{if(en[0].isIntersecting&&!running){running=true;rs();loop();ob.disconnect()}},{threshold:.05});ob.observe(cv.parentElement);window.addEventListener('resize',()=>{if(running){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;stars=[];const n=isMob?120:260;for(let i=0;i<n;i++)stars.push({x:rand(0,W),y:rand(0,H),r:rand(.15,1.4),a:rand(.1,.9),spd:rand(.4,3),ph:rand(0,Math.PI*2),g:Math.random()<.14})}})})();
// ENVELOPE
let opened=false;
function openEnv(){if(opened)return;opened=true;el('epr').classList.add('out');el('env').classList.add('open');setTimeout(()=>{el('es').classList.add('out');const m=el('main');m.classList.add('on');document.body.classList.add('sc');setTimeout(()=>{el('ac').classList.add('on');el('mb2').classList.add('on')},400);setTimeout(revSec,750)},1650)}
el('env').addEventListener('click',openEnv);
el('env').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openEnv()}});
if(!isMob){document.addEventListener('mousemove',e=>{if(opened)return;const cx=window.innerWidth/2,cy=window.innerHeight/2;const dx=(e.clientX-cx)/cx,dy=(e.clientY-cy)/cy;el('env').style.transform='perspective(1000px) rotateY('+(dx*5)+'deg) rotateX('+(-dy*3.5)+'deg)'})}
// REVEAL
function revSec(){const a=(id,d)=>setTimeout(()=>{const e=el(id);if(e)e.classList.add('on')},d);a('rl',150);a('nm',450);a('rd',750);a('rc',1050)}
// OBSERVERS
function obs(id,fn){const e=el(id);if(!e)return;const io=new IntersectionObserver(en=>{if(en[0].isIntersecting){fn();io.disconnect()}},{threshold:.18,rootMargin:'0px 0px -40px 0px'});io.observe(e)}
obs('s2',()=>{setTimeout(()=>el('st').classList.add('on'),200);setTimeout(()=>{el('p1').classList.add('on');el('p2').classList.add('on')},600)});
obs('s3',()=>{setTimeout(()=>el('cdh').classList.add('on'),300);setTimeout(()=>el('cdf').classList.add('on'),600)});
obs('s4',()=>{[['vp',200],['vn',400],['vdt',700],['vd',900],['vsb',1100]].forEach(([id,d])=>setTimeout(()=>el(id).classList.add('on'),d))});
obs('s5',()=>{setTimeout(()=>el('lt2').classList.add('on'),200);setTimeout(()=>el('la').classList.add('on'),400);setTimeout(()=>el('mbt').classList.add('on'),700)});
obs('s6',()=>setTimeout(()=>el('pc').classList.add('on'),300));
obs('s7',()=>{[['sh',300],['sn',800],['sd',1200],['sc4',1600],['fb',2100]].forEach(([id,d])=>setTimeout(()=>el(id).classList.add('on'),d))});
// CARD 3D
if(!isMob){const card=el('pc');if(card){card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();const dx=(e.clientX-r.left-r.width/2)/(r.width/2);const dy=(e.clientY-r.top-r.height/2)/(r.height/2);card.style.transform='perspective(800px) rotateY('+(dx*9)+'deg) rotateX('+(-dy*9)+'deg) scale(1.015)'});card.addEventListener('mouseleave',()=>card.style.transform='perspective(800px) rotateY(-3deg) rotateX(1deg)')}}
// MUSIC
(function(){const btn=el('mb2');let ctx=null,gain=null,oscs=[],on=false;function start(){ctx=new(window.AudioContext||window.webkitAudioContext)();gain=ctx.createGain();gain.gain.setValueAtTime(0,ctx.currentTime);gain.gain.linearRampToValueAtTime(.055,ctx.currentTime+2);gain.connect(ctx.destination);[[146.83,.28],[293.66,.18],[369.99,.12],[440,.14],[73.42,.22],[587.33,.035],[220,.08]].forEach(([f,v])=>{const o=ctx.createOscillator(),g=ctx.createGain();g.gain.value=v;o.type='sine';o.frequency.value=f;o.connect(g);g.connect(gain);o.start();oscs.push(o)})}
function stop(){if(gain){gain.gain.linearRampToValueAtTime(0,ctx.currentTime+1.4);setTimeout(()=>{oscs.forEach(o=>{try{o.stop()}catch(e){}});oscs=[];if(ctx)ctx.close();ctx=null;gain=null},1500)}}
btn.addEventListener('click',()=>{if(!on){on=true;btn.classList.remove('p');start()}else{on=false;btn.classList.add('p');stop()}})})();
history.scrollRestoration='manual';window.scrollTo(0,0);
