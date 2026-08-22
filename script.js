// ── SCROLL RESTORATION ──
// The critical reset is in <head> (inline script) — fires synchronously before browser restore.
// pagehide fires before iOS takes its page snapshot, saves scroll position as 0.
window.addEventListener('pagehide', () => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
});

// ── REGISTER GSAP PLUGINS ──
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ── AUDIO & SFX ──
const mBtn = document.getElementById('music-btn');
const bgm = document.getElementById('bg-music');
let playing = false;
let journeyStarted = false;

if(bgm) bgm.volume = 0.5;

// Web Audio API Synthesizer for SFX
const AudioContext = window.AudioContext || window.webkitAudioContext;
let sfxCtx = null;
function initSFX() { 
    if(!sfxCtx) {
        sfxCtx = new AudioContext();
        // Unlock context on iOS
        const osc = sfxCtx.createOscillator();
        osc.connect(sfxCtx.destination);
        osc.start(0); osc.stop(0);
    }
    if(sfxCtx.state === 'suspended') sfxCtx.resume();
}

function playTone(freq, type, duration, vol) {
    if(!sfxCtx) return;
    const osc = sfxCtx.createOscillator();
    const gain = sfxCtx.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, sfxCtx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, sfxCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, sfxCtx.currentTime + duration);
    osc.connect(gain); gain.connect(sfxCtx.destination);
    osc.start(); osc.stop(sfxCtx.currentTime + duration);
}

function playTextChime() {
    playTone(880, 'sine', 2.5, 0.03); // A5
    setTimeout(() => playTone(1108.73, 'sine', 2.5, 0.02), 150); // C#6
}

function playWhoosh() {
    // Deep magical hum
    playTone(150, 'sine', 3, 0.05);
    setTimeout(() => playTone(220, 'triangle', 3, 0.02), 100);
}

function playFlashSFX() {
    // Magical A Major 9 Chord
    const notes = [440, 554.37, 659.25, 830.61, 987.77];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 'triangle', 4, 0.02), i * 60);
    });
}

// Removed preventScroll functions

function startJourney() {
    if (journeyStarted) return;
    journeyStarted = true;
    
    initSFX(); // Unlock SFX context
    
    // Hide the invisible start button overlay
    const startBtn = document.getElementById('start-journey-btn');
    if (startBtn) {
        startBtn.style.opacity = '0';
        startBtn.style.pointerEvents = 'none'; // Instantly prevent double clicks
        setTimeout(() => startBtn.style.visibility = 'hidden', 800);
    }
    
    // Play background music
    if(!playing && bgm) { 
        let playPromise = bgm.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                playing = true; 
                mBtn.classList.add('playing'); 
            }).catch(e => { console.log('Safari blocked autoplay'); });
        }
    }
    
    // Force native mobile browser to ignore finger swipes during the cinematic
    document.documentElement.style.pointerEvents = 'none';
    
    // Flawless Auto-Scroll — linear ease = every animation stage gets equal time
    gsap.to(window, {
        duration: 13,
        scrollTo: { y: ScrollTrigger.maxScroll(window), autoKill: false },
        ease: "none", // Perfectly even — no rush at start, no lag at end
        onComplete: () => {
            document.documentElement.style.pointerEvents = 'auto';
        }
    });
}

// Toggle via button
mBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    initSFX();
    if(!playing) { 
        if(bgm) bgm.play(); 
        playing = true; 
        mBtn.classList.add('playing'); 
    } else { 
        if(bgm) bgm.pause(); 
        playing = false; 
        mBtn.classList.remove('playing'); 
    }
});

// Trigger journey exclusively from the start button overlay
const startBtnOverlay = document.getElementById('start-journey-btn');
if (startBtnOverlay) {
    startBtnOverlay.addEventListener('click', startJourney, { once: true });
}

// ── INITIAL SETUP ──
// Orbs starting position (Hamdy from left, Safaa from right)
gsap.set("#orb-h", { left: "-10%" });
gsap.set("#orb-s", { left: "110%" });

// ── THE MASTER TIMELINE ──
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "#cinema-container",
        pin: true,
        start: "top top",
        end: "+=4500", // Smooth optimized scroll distance
        scrub: 1
    }
});

tl
  // 1. Texts fade in/out
  .to("#text-1", { opacity: 1, duration: 2, onStart: () => { if(tl.scrollTrigger.direction === 1) playTextChime(); } }, "-=0.5")
  .to("#text-1", { opacity: 0, duration: 2 }, "+=1")
  
  .to("#text-2", { opacity: 1, duration: 2, onStart: () => { if(tl.scrollTrigger.direction === 1) playTextChime(); } })
  .to("#text-2", { opacity: 0, duration: 2 }, "+=1")

  // 2. Palace background rises
  .to("#palace-bg", { opacity: 1, scale: 1, duration: 4 }, "-=2")
  .to("#palace-overlay", { opacity: 1, duration: 4 }, "-=4")

  // 3. Orbs flash in immediately as palace finishes (no gap)
  .to("#orb-h", { left: "32%", scale: 1.5, opacity: 1, duration: 1.5, ease: "power3.out", onStart: () => { if(tl.scrollTrigger.direction === 1) playWhoosh(); } }, "-=1")
  .to("#orb-s", { left: "68%", scale: 1.5, opacity: 1, duration: 1.5, ease: "power3.out" }, "<")

  // ...then slowly float toward each other (romantic approach)
  .to("#orb-h", { left: "38%", duration: 4, ease: "sine.inOut" }, "+=0")
  .to("#orb-s", { left: "62%", duration: 4, ease: "sine.inOut" }, "<")
  
  // 4. Collision & Cinematic Flash
  .to("#orb-h", { left: "50%", scale: 0.1, duration: 1, ease: "back.in(2)" }, "collide")
  .to("#orb-s", { left: "50%", scale: 0.1, duration: 1, ease: "back.in(2)" }, "collide")
  .to("#flash", { opacity: 1, scale: 15, duration: 1.5, ease: "expo.out", onStart: () => { if(tl.scrollTrigger.direction === 1) playFlashSFX(); } }, "collide+=0.8")
  
  // 5. Fade out orbs, bring in the card (1 second faster)
  .to(".orb", { opacity: 0, duration: 0.1 }, "reveal")
  .to("#flash", { opacity: 0, duration: 0.5 }, "reveal")
  .to("#palace-overlay", { background: "linear-gradient(to bottom, rgba(3,6,20,0.6), rgba(3,6,20,0.2), rgba(3,6,20,0.8))", duration: 1 }, "reveal")
  .to("#invitation-card", { opacity: 1, y: "-50%", duration: 2 }, "reveal") // Was 3, now 2
  
  // 6. Buffer
  .to({}, { duration: 1.5 });


// ── COUNTDOWN ──
const TARGET = new Date('2026-08-30T20:00:00+03:00').getTime();
function tick() {
    const diff = Math.max(0, TARGET - Date.now());
    const d = document.getElementById('c-days');
    if (d) {
        d.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
        document.getElementById('c-hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
        document.getElementById('c-mins').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        document.getElementById('c-secs').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    }
}
tick(); setInterval(tick, 1000);
