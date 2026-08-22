// ── INIT SMOOTH SCROLLING ──
const lenis = new Lenis({ duration: 1.5, smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

// ── INIT STARS CANVAS ──
const cv = document.getElementById('stars');
const ctx = cv.getContext('2d');
let stars = [];
function resize() {
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    stars = Array.from({length: 150}, () => ({
        x: Math.random() * cv.width, y: Math.random() * cv.height,
        r: Math.random() * 1.5, p: Math.random() * Math.PI * 2
    }));
}
window.addEventListener('resize', resize); resize();
function drawStars() {
    ctx.clearRect(0,0,cv.width,cv.height);
    stars.forEach(s => {
        s.p += 0.02;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(s.p)*0.7})`; ctx.fill();
    });
    requestAnimationFrame(drawStars);
}
drawStars();

// ── AUDIO ──
const mBtn = document.getElementById('music-btn');
const bgm = document.getElementById('bg-music');
let playing = false;
if(bgm) bgm.volume = 0.5;

function startMusic() {
    if(!playing && bgm) { 
        let playPromise = bgm.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                playing = true; 
                mBtn.classList.add('playing'); 
                
                // Only remove listeners ON SUCCESS (fixes Safari blocking the first touchstart)
                ['touchstart', 'touchend', 'click', 'keydown'].forEach(evt => {
                    document.removeEventListener(evt, playOnInteraction);
                });
            }).catch(e => {
                console.log('Safari blocked autoplay, waiting for next touch...');
            });
        }
    }
}

// Toggle via button
mBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if(!playing) { 
        startMusic(); 
    } else { 
        bgm.pause(); 
        playing = false; 
        mBtn.classList.remove('playing'); 
    }
});

// Play immediately on first touch or click anywhere
function playOnInteraction() {
    startMusic();
}
// Attach to multiple events, don't use {once: true} because Safari might block the first one
['touchstart', 'touchend', 'click', 'keydown'].forEach(evt => {
    document.addEventListener(evt, playOnInteraction);
});

// ── INITIAL SETUP ──
gsap.set("#orb-h", { left: "-10%" });
gsap.set("#orb-s", { left: "110%" });

// ── THE MASTER TIMELINE ──
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "#cinema-container",
        pin: true,
        start: "top top",
        end: "+=6000",
        scrub: 1
    }
});

tl
  // 1. Instantly fade out the scroll instruction as they start scrolling
  .to("#scroll-hint", { opacity: 0, duration: 0.5 })
  
  // 2. Text 1 fades in and out
  .to("#text-1", { opacity: 1, duration: 2 }, "-=0.5")
  .to("#text-1", { opacity: 0, duration: 2 }, "+=1")
  
  // 3. Text 2 fades in and out
  .to("#text-2", { opacity: 1, duration: 2 })
  .to("#text-2", { opacity: 0, duration: 2 }, "+=1")

  // 4. Palace background rises from the dark
  .to("#palace-bg", { opacity: 1, scale: 1, duration: 4 }, "-=2")
  .to("#palace-overlay", { opacity: 1, duration: 4 }, "-=4")

  // 5. The Orbs (Lights) enter magnetically (stopped further apart for mobile screens)
  .to("#orb-h", { left: "25%", scale: 1.5, opacity: 1, duration: 4, ease: "power1.inOut" }, "orbs")
  .to("#orb-s", { left: "75%", scale: 1.5, opacity: 1, duration: 4, ease: "power1.inOut" }, "orbs")
  
  // 6. Collision & Cinematic Flash
  .to("#orb-h", { left: "50%", scale: 0.1, duration: 1, ease: "back.in(2)" }, "collide")
  .to("#orb-s", { left: "50%", scale: 0.1, duration: 1, ease: "back.in(2)" }, "collide")
  .to("#flash", { opacity: 1, scale: 15, duration: 1.5, ease: "expo.out" }, "collide+=0.8")
  
  // 7. Fade out orbs, bring in the card
  .to(".orb", { opacity: 0, duration: 0.1 }, "reveal")
  .to("#palace-overlay", { background: "linear-gradient(to bottom, rgba(3,6,20,0.6), rgba(3,6,20,0.2), rgba(3,6,20,0.8))", duration: 1 }, "reveal")
  .to("#invitation-card", { opacity: 1, y: "-50%", duration: 3 }, "reveal")
  
  // 8. Flash fades away perfectly
  .to("#flash", { opacity: 0, duration: 3 }, "reveal+=1");


// ── COUNTDOWN ──
const TARGET = new Date('2026-08-30T20:00:00+03:00').getTime();
function tick() {
    const diff = Math.max(0, TARGET - Date.now());
    document.getElementById('c-days').textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
    document.getElementById('c-hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    document.getElementById('c-mins').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('c-secs').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
}
tick(); setInterval(tick, 1000);
