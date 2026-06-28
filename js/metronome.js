/* =========================================
   METRONOME — Visual & Tap
   ========================================= */

const Metronome = (() => {
  let bpm = 80;
  let intervalId = null;
  let beat = 0;
  let pattern = ['↓', '↓', '↑', '↓', '↑'];
  let patternIdx = 0;
  let pendulumDir = 1;
  let onBeatCb = null;

  function render(containerId, opts = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    bpm = opts.bpm || 80;
    pattern = opts.pattern || ['↓', '↓', '↑', '↓', '↑'];

    container.innerHTML = `
      <div class="metronome-container">
        <div class="metro-display">
          <div class="metro-bpm" id="metro-bpm">${bpm}</div>
          <div class="metro-bpm-label">BPM</div>
        </div>
        <div class="metro-pendulum-wrap">
          <div class="metro-pendulum" id="metro-pendulum"></div>
        </div>
        <div class="strum-pattern" id="strum-pattern">
          ${pattern.map((p, i) => `<div class="strum-arrow" data-idx="${i}">${p}</div>`).join('')}
        </div>
        <div class="metro-controls">
          <button class="btn btn-primary" id="metro-start">▶ Démarrer</button>
          <button class="btn btn-secondary" id="metro-stop">⏹ Stop</button>
        </div>
        ${opts.showTap ? `
        <div style="margin-top:12px;text-align:center">
          <button class="btn btn-secondary" id="metro-tap" style="width:120px;height:60px;font-size:20px">TAP</button>
          <div style="font-size:12px;color:#64748B;margin-top:6px;font-family:'Space Mono',monospace">Tape le rythme</div>
        </div>` : ''}
      </div>`;

    document.getElementById('metro-start').addEventListener('click', start);
    document.getElementById('metro-stop').addEventListener('click', stop);

    if (opts.showTap) {
      let tapTimes = [];
      document.getElementById('metro-tap').addEventListener('click', () => {
        tapTimes.push(Date.now());
        if (tapTimes.length > 4) tapTimes = tapTimes.slice(-4);
        if (tapTimes.length >= 2) {
          const intervals = tapTimes.slice(1).map((t, i) => t - tapTimes[i]);
          const avg = intervals.reduce((a, b) => a + b) / intervals.length;
          bpm = Math.round(60000 / avg);
          bpm = Math.max(40, Math.min(240, bpm));
          const el = document.getElementById('metro-bpm');
          if (el) el.textContent = bpm;
        }
      });
    }

    if (opts.onBeat) onBeatCb = opts.onBeat;
  }

  function start() {
    if (intervalId) stop();
    const ms = Math.round(60000 / bpm);
    patternIdx = 0;
    beat = 0;
    intervalId = setInterval(tick, ms);
    tick();
  }

  function stop() {
    clearInterval(intervalId);
    intervalId = null;
    const p = document.getElementById('metro-pendulum');
    if (p) { p.classList.remove('tick'); p.style.transform = 'rotate(0deg)'; }
    const arrows = document.querySelectorAll('.strum-arrow');
    arrows.forEach(a => a.classList.remove('active'));
  }

  function tick() {
    const pend = document.getElementById('metro-pendulum');
    if (pend) {
      pend.style.transform = `rotate(${pendulumDir * 22}deg)`;
      pendulumDir *= -1;
    }

    const arrows = document.querySelectorAll('.strum-arrow');
    arrows.forEach((a, i) => {
      a.classList.toggle('active', i === patternIdx);
    });

    if (onBeatCb) onBeatCb(beat, patternIdx);

    patternIdx = (patternIdx + 1) % pattern.length;
    beat++;
  }

  function isRunning() { return intervalId !== null; }
  function getBPM() { return bpm; }

  return { render, start, stop, isRunning, getBPM };
})();
