// INITIALIZE LENIS (Smooth Scrolling)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// GSAP Integration with Lenis
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({ scroller: window });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{ lenis.raf(time * 1000) });
gsap.ticker.lagSmoothing(0);

// DISABLE SCROLL INITIALLY
lenis.stop();
document.body.style.overflow = 'hidden';

/* --- BOOT SEQUENCE --- */
const bootText = document.getElementById('boot-text');
const btnEnter = document.getElementById('btn-enter');
const bootScreen = document.getElementById('boot-screen');
const bootCursor = document.getElementById('boot-cursor');
const bootActions = document.getElementById('boot-actions');

const msgs = ["INITIALIZING EVENT", "30.08.2026", "LOCATION LOCKED", "HEAVEN", "ACCESS?"];
let msgIdx = 0;

setTimeout(() => {
    bootCursor.style.display = 'none';
    const interval = setInterval(() => {
        if (msgIdx < msgs.length) {
            bootText.innerHTML += `<div>${msgs[msgIdx]}</div>`;
            msgIdx++;
        } else {
            clearInterval(interval);
            setTimeout(() => { bootActions.classList.remove('hidden'); }, 500);
        }
    }, 600);
}, 1000);

btnEnter.addEventListener('click', () => {
    bootScreen.style.opacity = '0';
    setTimeout(() => {
        bootScreen.style.display = 'none';
        document.body.style.overflow = 'auto';
        lenis.start();
        initAudio();
        ScrollTrigger.refresh();
    }, 1500);
});

/* --- SCENE 01: THE NUMBER 30 ZOOM --- */
gsap.to(".huge-30", {
    scale: 150,
    opacity: 0,
    ease: "power2.in",
    scrollTrigger: {
        trigger: "#scene-30",
        start: "top top",
        end: "+=2000", // Scroll length for the zoom
        pin: true,
        scrub: true
    }
});

/* --- SCENE 02: THE REVEAL --- */
const tlReveal = gsap.timeline({
    scrollTrigger: {
        trigger: "#scene-reveal",
        start: "top center",
        end: "+=1500",
        pin: true,
        scrub: true
    }
});
tlReveal.to("#qt-1", { opacity: 1, duration: 1 })
        .to("#qt-1", { opacity: 0, duration: 1, delay: 1 })
        .to("#qt-2", { opacity: 1, duration: 1 })
        .to("#qt-2", { opacity: 0, duration: 1, delay: 1 })
        .from("#letter-h", { x: -300, opacity: 0, duration: 2 }, "letters")
        .from("#letter-s", { x: 300, opacity: 0, duration: 2 }, "letters")
        .to("#letter-x", { opacity: 1, duration: 1 })
        .to("#reveal-names", { opacity: 1, y: -20, duration: 2, delay: 1 });

/* --- THREAD LINE DRAWING --- */
const threadPath = document.getElementById('thread-path');
const pathLength = threadPath.getTotalLength();
threadPath.style.strokeDasharray = pathLength;
threadPath.style.strokeDashoffset = pathLength;
threadPath.style.opacity = 1;

gsap.to(threadPath, {
    strokeDashoffset: 0,
    ease: "none",
    scrollTrigger: {
        trigger: "#smooth-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: true
    }
});

/* --- SCENE 04: LIVING COUNTDOWN --- */
const countdownContainer = document.getElementById('living-countdown');
const targetDate = new Date("2026-08-30T00:00:00+03:00").getTime();

function updateLivingCountdown() {
    const distance = Math.max(0, targetDate - new Date().getTime());
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    countdownContainer.innerHTML = `<div>${d} DAYS</div> <div>${h} HOURS</div> <div>${m} MINS</div>`;
}
setInterval(updateLivingCountdown, 60000);
updateLivingCountdown();

gsap.to(".date-3d-container", {
    scale: 1.5,
    scrollTrigger: { trigger: "#scene-date", start: "top center", end: "bottom top", scrub: true }
});
gsap.to(".living-countdown", {
    opacity: 1, y: -20,
    scrollTrigger: { trigger: "#scene-date", start: "center center", end: "+=500", scrub: true }
});

/* --- SCENE 05: CITY FLYOVER --- */
gsap.to(".abstract-grid", {
    backgroundPosition: "0 100vh",
    ease: "none",
    scrollTrigger: { trigger: "#scene-city", start: "top bottom", end: "bottom top", scrub: true }
});
const infos = [".i-1", ".i-2", ".i-3"];
infos.forEach((info, i) => {
    gsap.to(info, {
        opacity: 1, y: -50,
        scrollTrigger: { trigger: info, start: "top 80%", end: "top 40%", scrub: true }
    });
});

/* --- SCENE 06: DESTINATION --- */
gsap.to(".sign-line", {
    opacity: 1, y: 0, stagger: 0.2,
    scrollTrigger: { trigger: "#scene-destination", start: "top center", end: "center center", scrub: true }
});
gsap.to(".entry-msg, .entry-date", {
    opacity: 1, stagger: 0.2,
    scrollTrigger: { trigger: "#scene-destination", start: "center center", end: "+=300", scrub: true }
});

/* --- SCENE 07: GLASS BLOCK INTERACTION --- */
const glassBlock = document.getElementById('glass-block');
let rx = 0, ry = 0, isDragging = false, startX, startY;

// Auto rotate
let autoRotate = gsap.to(glassBlock, { rotationY: 360, duration: 20, repeat: -1, ease: "none" });

function startDrag(e) {
    isDragging = true;
    autoRotate.pause();
    startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
}
function moveDrag(e) {
    if (!isDragging) return;
    const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const y = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    ry += (x - startX) * 0.5;
    rx -= (y - startY) * 0.5;
    rx = Math.max(-45, Math.min(45, rx)); // limit X rotation
    gsap.set(glassBlock, { rotationX: rx, rotationY: ry });
    startX = x; startY = y;
}
function endDrag() { isDragging = false; }

glassBlock.addEventListener('mousedown', startDrag);
glassBlock.addEventListener('touchstart', startDrag);
window.addEventListener('mousemove', moveDrag);
window.addEventListener('touchmove', moveDrag);
window.addEventListener('mouseup', endDrag);
window.addEventListener('touchend', endDrag);

/* --- SCENE 09: HUMAN MOMENT --- */
// Fade background to white
gsap.to("body", {
    backgroundColor: "#F5F4F0",
    color: "#030303",
    scrollTrigger: { trigger: "#scene-human", start: "top center", end: "center center", scrub: true }
});

/* --- SCENE 10: FINALE --- */
// Fade back to black
gsap.to("body", {
    backgroundColor: "#030303",
    color: "#F5F4F0",
    scrollTrigger: { trigger: "#scene-finale", start: "top center", end: "center center", scrub: true }
});

const tlFinale = gsap.timeline({
    scrollTrigger: { trigger: "#scene-finale", start: "center center", end: "+=1000", pin: true, scrub: true }
});
tlFinale.to(".fin-msg", { opacity: 1, duration: 1 })
        .to(".fin-hs", { opacity: 1, y: -20, duration: 1 })
        .to(".fin-date", { opacity: 1, duration: 1 })
        .to(".fin-hall", { opacity: 1, duration: 1 })
        .to(".fin-warn", { opacity: 1, duration: 1 });

/* --- AUDIO --- */
const audioCtrl = document.getElementById('audio-ctrl');
const bars = audioCtrl.querySelectorAll('.bar');
let actx, gain, oscs=[], isPlaying=false;

function initAudio() {
    if(actx) return;
    actx = new (window.AudioContext || window.webkitAudioContext)();
    gain = actx.createGain(); gain.connect(actx.destination);
    gain.gain.value = 0;
    
    // Very subtle low drone
    const freqs = [55, 110, 164.81];
    freqs.forEach(f => {
        const o = actx.createOscillator();
        o.type = 'sine'; o.frequency.value = f;
        o.connect(gain); o.start(); oscs.push(o);
    });
    isPlaying = true;
    audioCtrl.classList.remove('muted');
    gain.gain.setTargetAtTime(0.1, actx.currentTime, 2);
    animateBars();
}

audioCtrl.addEventListener('click', () => {
    if(!actx) initAudio();
    else if(isPlaying) { gain.gain.setTargetAtTime(0, actx.currentTime, 0.5); isPlaying = false; audioCtrl.classList.add('muted'); }
    else { gain.gain.setTargetAtTime(0.1, actx.currentTime, 0.5); isPlaying = true; audioCtrl.classList.remove('muted'); animateBars(); }
});

function animateBars() {
    if(!isPlaying) return;
    bars.forEach(b => b.style.height = (Math.random() * 10 + 5) + 'px');
    setTimeout(animateBars, 150);
}
