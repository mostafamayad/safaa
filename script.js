const R=(a,b)=>a+Math.random()*(b-a);
const L=(a,b,t)=>a+(b-a)*t;
const $=id=>document.getElementById(id);
const mob=window.innerWidth<640||/Android|iPhone|iPad/i.test(navigator.userAgent);

// CURSOR (desktop only)
if(!mob){
  const cur=$("cur"),ring=$("ring");
  let mx=0,my=0,rx=0,ry=0;
  if(cur&&ring){
    document.addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;cur.style.cssText="left:"+mx+"px;top:"+my+"px;"});
    (function a(){rx=L(rx,mx,.1);ry=L(ry,my,.1);ring.style.left=rx+"px";ring.style.top=ry+"px";requestAnimationFrame(a)})();
    document.addEventListener("mouseover",e=>{if(e.target.closest("a,button,[role=button]"))ring.classList.add("h");else ring.classList.remove("h")});
  }
}else{
  const c=$("cur"),r=$("ring");
  if(c)c.style.display="none";
  if(r)r.style.display="none";
}

// DUST CANVAS (envelope scene)
(function(){
  const cv=$("dust"),ctx=cv.getContext("2d");
  if(!cv)return;
  let W,H,ps=[];
  function rs(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight}
  rs();window.addEventListener("resize",rs,{passive:true});
  class D{
    constructor(){this.reset(true)}
    reset(init){this.x=R(0,W);this.y=init?R(0,H):H+2;this.r=R(.4,1.6);this.vy=R(-.18,-.62);this.vx=R(-.12,.12);this.a=R(.06,.38);this.da=R(.0014,.0052)}
    step(){this.x+=this.vx;this.y+=this.vy;this.a-=this.da;if(this.a<=0||this.y<-4)this.reset(false)}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle="rgba(210,172,98,"+this.a+")";ctx.fill()}
  }
  const n=mob?20:48;
  for(let i=0;i<n;i++)ps.push(new D());
  (function loop(){ctx.clearRect(0,0,W,H);ps.forEach(p=>{p.step();p.draw()});requestAnimationFrame(loop)})();
})();

// LOADING
setTimeout(()=>{const l=$("ld");if(l)l.classList.add("out")},2800);

// COUNTDOWN - split flap
const TGT=new Date("2026-08-30T00:00:00+03:00");
const cdIds=["fc-d","fc-h","fc-m","fc-s"];
function pad(n){return String(Math.max(0,n)).padStart(2,"0")}
const cdPrev={};
function tick(){
  const diff=Math.max(0,TGT-new Date());
  const vals=[Math.floor(diff/86400000),Math.floor((diff%86400000)/3600000),Math.floor((diff%3600000)/60000),Math.floor((diff%60000)/1000)];
  cdIds.forEach((id,i)=>{
    const el=$(id);if(!el)return;
    const nv=pad(vals[i]);
    if(cdPrev[id]===nv)return;
    cdPrev[id]=nv;
    const span=el.querySelector(".flap-n");
    if(span){span.textContent=nv;el.classList.remove("flip");void el.offsetWidth;el.classList.add("flip");setTimeout(()=>el.classList.remove("flip"),280)}
  });
}
tick();setInterval(tick,1000);

// STAR CANVAS
(function(){
  const cv=$("star-cv"),ctx=cv.getContext("2d");
  if(!cv)return;
  let W,H,stars=[],comets=[],running=false,t=0;
  function mkComet(){return{x:R(-W*.3,W*1.3),y:R(-50,H*.25),len:R(50,155),spd:R(3,8),a:R(.2,.7),ang:R(.25,.62)}}
  function initSt(){
    W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;
    const n=mob?140:300;stars=[];
    for(let i=0;i<n;i++)stars.push({x:R(0,W),y:R(0,H),r:R(.1,1.3),spd:R(.3,2.5),ph:R(0,Math.PI*2),g:Math.random()<.12});
    if(!mob){comets=[];for(let i=0;i<3;i++)comets.push(mkComet())}
  }
  function loop(){
    ctx.clearRect(0,0,W,H);t++;
    stars.forEach(s=>{
      const a=.18+.82*(.5+.5*Math.sin(s.ph+t*s.spd*.001));
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=s.g?"rgba(196,154,60,"+a+")":"rgba(255,248,232,"+(a*.58)+")";ctx.fill()
    });
    comets.forEach(c=>{
      c.x+=Math.cos(c.ang)*c.spd;c.y+=Math.sin(c.ang)*c.spd;c.a-=.009;
      if(c.a<=0)Object.assign(c,mkComet());
      const g=ctx.createLinearGradient(c.x,c.y,c.x-Math.cos(c.ang)*c.len,c.y-Math.sin(c.ang)*c.len);
      g.addColorStop(0,"rgba(196,154,60,"+c.a+")");g.addColorStop(1,"transparent");
      ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(c.x-Math.cos(c.ang)*c.len,c.y-Math.sin(c.ang)*c.len);
      ctx.strokeStyle=g;ctx.lineWidth=1.2;ctx.stroke()
    });
    requestAnimationFrame(loop)
  }
  const io=new IntersectionObserver(en=>{if(en[0].isIntersecting&&!running){running=true;initSt();loop();io.disconnect()}},{threshold:.05});
  const sec=$("s-stars");if(sec)io.observe(sec);
  window.addEventListener("resize",()=>{if(running&&cv.offsetWidth>0){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight}},{passive:true});
})();

// ENVELOPE OPEN
let opened=false;
function doOpen(){
  if(opened)return;opened=true;
  const pr=$("env-prompt"),env=$("env-el"),scene=$("env-scene"),main=$("main"),mus=$("mus");
  if(pr)pr.classList.add("out");
  if(env)env.classList.add("open");
  setTimeout(()=>{
    if(scene)scene.classList.add("out");
    if(main)main.classList.add("on");
    document.body.classList.add("open");
    setTimeout(()=>{if(mus)mus.classList.add("on")},700);
    setTimeout(revealNames,950);
  },1850);
}
const envEl=$("env-el");
if(envEl){
  envEl.addEventListener("click",doOpen);
  envEl.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();doOpen()}});
}

// Envelope tilt - desktop only
if(!mob){
  document.addEventListener("mousemove",e=>{
    if(opened)return;
    const cx=window.innerWidth/2,cy=window.innerHeight/2;
    const dx=(e.clientX-cx)/cx,dy=(e.clientY-cy)/cy;
    if(envEl)envEl.style.transform="perspective(900px) rotateY("+(dx*4.5)+"deg) rotateX("+(-dy*3.5)+"deg)";
  });
}

// REVEAL NAMES SEQUENCE
function revealNames(){
  const vl=$("names-vline"),h=$("name-h"),s=$("name-s"),amp=$("names-amp"),dt=$("names-dt"),cp=$("names-cp");
  setTimeout(()=>{if(vl)vl.classList.add("on")},80);
  setTimeout(()=>{if(h)h.classList.add("on")},320);
  setTimeout(()=>{if(s)s.classList.add("on")},520);
  setTimeout(()=>{if(amp)amp.classList.add("on")},600);
  setTimeout(()=>{if(dt)dt.classList.add("on")},900);
  setTimeout(()=>{if(cp)cp.classList.add("on")},1200);
}

// SCROLL REVEAL (IntersectionObserver)
function obs(id,fn,th){
  const e=$(id);if(!e)return;
  const io=new IntersectionObserver(en=>{if(en[0].isIntersecting){fn();io.disconnect()}},{threshold:th||.18,rootMargin:"0px 0px -28px 0px"});
  io.observe(e);
}
function addOn(id,delay){const e=$(id);if(e)setTimeout(()=>e.classList.add("on"),delay||0)}

obs("s-story",()=>{addOn("st-num");addOn("st-p",220)});
obs("s-count",()=>{addOn("cnt-ttl");addOn("cnt-sub",350)});
obs("s-venue",()=>{addOn("v-pre",140);addOn("v-name",300);addOn("v-dt",600);addOn("v-deco",850);addOn("v-qt",1050)});
obs("s-loc",()=>{addOn("loc-h",140);addOn("loc-a",350);addOn("loc-btn",620)});
obs("s-card",()=>addOn("pcard",280));
obs("s-stars",()=>{addOn("st-hs",280);addOn("st-nm",780);addOn("st-dt",1180);addOn("st-cp",1580);addOn("st-btn",2080)},0.06);

// CARD 3D (desktop)
if(!mob){
  const card=$("pcard");
  if(card){
    card.addEventListener("mousemove",e=>{
      const r=card.getBoundingClientRect();
      const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
      const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
      card.style.transform="perspective(800px) rotateY("+(dx*7)+"deg) rotateX("+(-dy*7)+"deg) scale(1.01)";
    });
    card.addEventListener("mouseleave",()=>card.style.transform="perspective(800px) rotateY(-2deg)");
  }
}

// MUSIC (Web Audio API ambient chord)
(function(){
  const btn=$("mus");
  if(!btn)return;
  let actx=null,gain=null,oscs=[],playing=false;
  function start(){
    actx=new(window.AudioContext||window.webkitAudioContext)();
    gain=actx.createGain();
    gain.gain.setValueAtTime(0,actx.currentTime);
    gain.gain.linearRampToValueAtTime(.048,actx.currentTime+2.2);
    gain.connect(actx.destination);
    [[146.83,.26],[293.66,.16],[369.99,.11],[440,.13],[73.42,.21]].forEach(([f,v])=>{
      const o=actx.createOscillator(),g=actx.createGain();
      g.gain.value=v;o.type="sine";o.frequency.value=f;
      o.connect(g);g.connect(gain);o.start();oscs.push(o);
    });
  }
  function stop(){
    if(!gain)return;
    gain.gain.linearRampToValueAtTime(0,actx.currentTime+1.2);
    setTimeout(()=>{oscs.forEach(o=>{try{o.stop()}catch(e){}});oscs=[];if(actx){actx.close();actx=null;gain=null}},1350);
  }
  btn.addEventListener("click",()=>{
    playing=!playing;
    if(playing){btn.classList.remove("mt");start()}
    else{btn.classList.add("mt");stop()}
  });
})();

history.scrollRestoration="manual";
window.scrollTo(0,0);
