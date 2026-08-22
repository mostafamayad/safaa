/* ===== HEAVEN // 30.08 — Main Script ===== */

gsap.registerPlugin(ScrollTrigger);

// ── Stars Canvas (Scene 0) ──────────────────────────────────────────────
(function initStars() {
  const cv = document.getElementById('stars-cv');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.4 + 0.3,
    spd: Math.random() * 2 + 0.5,
    ph: Math.random() * Math.PI * 2,
  }));

  let t = 0;
  (function loop() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    t += 0.01;
    stars.forEach(s => {
      const a = 0.4 + 0.6 * Math.abs(Math.sin(s.ph + t * s.spd * 0.2));
      ctx.beginPath();
      ctx.arc(s.x * cv.width, s.y * cv.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,248,220,${a})`;
      ctx.fill();
    });
    requestAnimationFrame(loop);
  })();
})();

// ── Parallax backgrounds ────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  document.querySelectorAll('.parallax-bg').forEach(el => {
    const speed = parseFloat(el.dataset.speed || 0.3);
    el.style.transform = `translateY(${sy * speed}px)`;
  });
}, { passive: true });

// ── Intersection Observer helper ────────────────────────────────────────
function onVisible(el, cb, threshold = 0.25) {
  if (!el) return;
  new IntersectionObserver((entries, io) => {
    entries.forEach(e => { if (e.isIntersecting) { cb(el); io.disconnect(); } });
  }, { threshold }).observe(el);
}

// ── SCENE 1: Hamdy ──────────────────────────────────────────────────────
const s1 = document.getElementById('s1');
if (s1) {
  onVisible(s1, () => {
    s1.querySelector('.scene-text')?.classList.add('visible');
    s1.querySelector('.char-wrap')?.classList.add('visible');
  });
}

// ── SCENE 2: Safaa ──────────────────────────────────────────────────────
const s2 = document.getElementById('s2');
if (s2) {
  onVisible(s2, () => {
    s2.querySelector('.scene-text')?.classList.add('visible');
    s2.querySelector('.char-wrap')?.classList.add('visible');
  });
}

// ── SCENE 3: The Meeting ─────────────────────────────────────────────────
const s3 = document.getElementById('s3');
const mH = document.getElementById('meet-h');
const mS = document.getElementById('meet-s');
const mC = document.getElementById('meet-center');
if (s3) {
  onVisible(s3, () => {
    // chars walk toward center
    setTimeout(() => { mH?.classList.add('come'); mS?.classList.add('come'); }, 200);
    // burst in center
    setTimeout(() => { mC?.classList.add('burst'); }, 1800);
  }, 0.3);
}

// ── SCENE 4: Heaven Hall ─────────────────────────────────────────────────
const s4 = document.getElementById('s4');
if (s4) { onVisible(s4, () => s4.classList.add('visible')); }

// ── SCENE 5: Invitation Card ─────────────────────────────────────────────
const invCard = document.getElementById('inv-card');
if (invCard) { onVisible(invCard, el => el.classList.add('visible'), 0.2); }

// ── SCENE 6: Countdown ───────────────────────────────────────────────────
const TARGET = new Date('2026-08-30T20:00:00+03:00').getTime();
const cdEls = ['c-days', 'c-hours', 'c-mins', 'c-secs'].map(id => document.getElementById(id));
const prevVals = ['', '', '', ''];

function tick() {
  const diff = Math.max(0, TARGET - Date.now());
  const vals = [
    Math.floor(diff / 86400000),
    Math.floor((diff % 86400000) / 3600000),
    Math.floor((diff % 3600000) / 60000),
    Math.floor((diff % 60000) / 1000),
  ].map(n => String(n).padStart(2, '0'));

  vals.forEach((v, i) => {
    if (!cdEls[i] || v === prevVals[i]) return;
    prevVals[i] = v;
    cdEls[i].textContent = v;
    cdEls[i].classList.remove('flip');
    void cdEls[i].offsetWidth;
    cdEls[i].classList.add('flip');
  });
}
tick();
setInterval(tick, 1000);

// ── MUSIC (Web Audio API Ambient) ────────────────────────────────────────
const musicBtn = document.getElementById('music-btn');
let actx = null, gainNode = null, oscs = [], playing = false;

function startMusic() {
  actx = new (window.AudioContext || window.webkitAudioContext)();
  gainNode = actx.createGain();
  gainNode.gain.setValueAtTime(0, actx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.06, actx.currentTime + 3);
  gainNode.connect(actx.destination);

  // Warm ambient chord — D major base
  [[73.4, 0.22], [110, 0.18], [146.8, 0.14], [220, 0.10], [293.7, 0.07]].forEach(([freq, vol]) => {
    const osc = actx.createOscillator();
    const g = actx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.value = vol;
    osc.connect(g);
    g.connect(gainNode);
    osc.start();
    oscs.push(osc);
  });
  playing = true;
}

function stopMusic() {
  if (!gainNode) return;
  gainNode.gain.linearRampToValueAtTime(0, actx.currentTime + 1.5);
  setTimeout(() => {
    oscs.forEach(o => { try { o.stop(); } catch (e) {} });
    oscs = [];
    actx?.close();
    actx = null; gainNode = null;
    playing = false;
  }, 1600);
}

musicBtn?.addEventListener('click', () => {
  if (!playing) {
    startMusic();
    musicBtn.classList.remove('muted');
  } else {
    stopMusic();
    musicBtn.classList.add('muted');
  }
});

// ── Fix scroll to top on reload ──────────────────────────────────────────
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
