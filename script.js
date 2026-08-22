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

function startJourney() {
    if (journeyStarted) return;
    journeyStarted = true;
    
    initSFX(); // Unlock SFX context
    
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
    
    // Auto-Scroll the page
    gsap.to(window, {
        duration: 9,
        scrollTo: { y: "max", autoKill: true },
        ease: "power2.inOut"
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

// Trigger journey on first interaction
['touchstart', 'click'].forEach(evt => {
    document.addEventListener(evt, startJourney, { once: true });
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
        end: "+=4500", // Smooth optimized scroll distance
        scrub: 1
    }
});

tl
  // 1. Instantly fade out the scroll instruction
  .to("#scroll-hint", { opacity: 0, duration: 0.5 })
  
  // 2. Text 1 fades in and out (with Chime)
  .to("#text-1", { opacity: 1, duration: 2, onStart: () => { if(tl.scrollTrigger.direction === 1) playTextChime(); } }, "-=0.5")
  .to("#text-1", { opacity: 0, duration: 2 }, "+=1")
  
  // 3. Text 2 fades in and out (with Chime)
  .to("#text-2", { opacity: 1, duration: 2, onStart: () => { if(tl.scrollTrigger.direction === 1) playTextChime(); } })
  .to("#text-2", { opacity: 0, duration: 2 }, "+=1")

  // 4. Palace background rises
  .to("#palace-bg", { opacity: 1, scale: 1, duration: 4 }, "-=2")
  .to("#palace-overlay", { opacity: 1, duration: 4 }, "-=4")

  // 5. The Orbs (Lights) enter (with Whoosh)
  .to("#orb-h", { left: "30%", scale: 1.5, opacity: 1, duration: 4, ease: "power1.inOut", onStart: () => { if(tl.scrollTrigger.direction === 1) playWhoosh(); } }, "orbs")
  .to("#orb-s", { left: "70%", scale: 1.5, opacity: 1, duration: 4, ease: "power1.inOut" }, "orbs")
  
  // 6. Collision & Optimized Cinematic Flash (with Flash SFX)
  .to("#orb-h", { left: "50%", scale: 0.1, duration: 1, ease: "back.in(2)" }, "collide")
  .to("#orb-s", { left: "50%", scale: 0.1, duration: 1, ease: "back.in(2)" }, "collide")
  .to("#flash", { opacity: 1, scale: 15, duration: 1.5, ease: "expo.out", onStart: () => { if(tl.scrollTrigger.direction === 1) playFlashSFX(); } }, "collide+=0.8")
  
  // 7. Fade out orbs, bring in the card, and kill flash FAST
  .to(".orb", { opacity: 0, duration: 0.1 }, "reveal")
  .to("#flash", { opacity: 0, duration: 0.5 }, "reveal") // Fades out ultra fast so it doesn't get stuck
  .to("#palace-overlay", { background: "linear-gradient(to bottom, rgba(3,6,20,0.6), rgba(3,6,20,0.2), rgba(3,6,20,0.8))", duration: 1 }, "reveal")
  .to("#invitation-card", { opacity: 1, y: "-50%", duration: 3 }, "reveal")
  
  // 8. Empty buffer at the end guarantees the animation finishes exactly before you hit the bottom scroll limit
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
