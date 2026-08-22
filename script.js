// Scroll Animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const elements = entry.target.querySelectorAll('.fade-up');
      elements.forEach(el => el.classList.add('active'));
    }
  });
}, observerOptions);

document.querySelectorAll('.sec').forEach(sec => {
  observer.observe(sec);
});

// Countdown
const targetDate = new Date("2026-08-30T00:00:00+03:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) return;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("d").innerText = String(days).padStart(2, '0');
  document.getElementById("h").innerText = String(hours).padStart(2, '0');
  document.getElementById("m").innerText = String(minutes).padStart(2, '0');
  document.getElementById("s").innerText = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Ambient Music
const audioBtn = document.getElementById('audio-btn');
let audioCtx = null;
let gainNode = null;
let oscs = [];
let isPlaying = false;

function startAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 2);
  gainNode.connect(audioCtx.destination);
  
  // Cinematic chord
  const freqs = [146.83, 293.66, 369.99, 440]; 
  freqs.forEach(f => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = f;
    osc.connect(gainNode);
    osc.start();
    oscs.push(osc);
  });
}

function stopAudio() {
  if (!gainNode) return;
  gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
  setTimeout(() => {
    oscs.forEach(o => { try { o.stop(); } catch(e){} });
    oscs = [];
    if(audioCtx) { audioCtx.close(); audioCtx = null; }
  }, 1200);
}

audioBtn.addEventListener('click', () => {
  isPlaying = !isPlaying;
  if(isPlaying) {
    audioBtn.classList.add('playing');
    startAudio();
  } else {
    audioBtn.classList.remove('playing');
    stopAudio();
  }
});
