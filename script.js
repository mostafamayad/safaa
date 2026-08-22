// ── AUDIO LOGIC ──
const musicBtn = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
let playing = false;

if (bgMusic) {
    bgMusic.volume = 0.5;
}

musicBtn?.addEventListener('click', () => {
    if (!bgMusic) return;
    
    if (!playing) {
        bgMusic.play().then(() => {
            playing = true;
            musicBtn.classList.add('playing');
        }).catch(err => console.log('Audio play failed:', err));
    } else {
        bgMusic.pause();
        playing = false;
        musicBtn.classList.remove('playing');
    }
});

// ── COUNTDOWN LOGIC ──
const TARGET = new Date('2026-08-30T20:00:00+03:00').getTime();
const els = {
    d: document.getElementById('c-days'),
    h: document.getElementById('c-hours'),
    m: document.getElementById('c-mins'),
    s: document.getElementById('c-secs')
};

function tick() {
    const diff = Math.max(0, TARGET - Date.now());
    if (els.d) els.d.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
    if (els.h) els.h.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    if (els.m) els.m.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    if (els.s) els.s.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
}

tick();
setInterval(tick, 1000);
