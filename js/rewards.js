/* =========================================
   REWARDS — Animations & Feedback
   ========================================= */

const Rewards = (() => {
  // ---- XP Pop ----
  function xpPop(amount, x, y) {
    const el = document.createElement('div');
    el.className = 'xp-pop';
    el.textContent = `+${amount} XP`;
    el.style.left = (x || window.innerWidth / 2) + 'px';
    el.style.top  = (y || window.innerHeight / 2) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }

  // ---- Toast ----
  function toast(msg, type = 'info') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.style.borderColor = type === 'success' ? 'rgba(34,197,94,0.4)'
      : type === 'error' ? 'rgba(239,68,68,0.4)'
      : 'rgba(255,255,255,0.15)';
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2800);
  }

  // ---- Confetti ----
  function confetti(duration = 3000) {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ['#7C3AED','#F59E0B','#22C55E','#EF4444','#C084FC','#FF6B35'];
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 40,
      w: 8 + Math.random() * 8,
      h: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 8,
    }));

    let start = null;
    function draw(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        p.vy += 0.08;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - elapsed / duration);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (elapsed < duration) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(draw);
  }

  // ---- Level Up ----
  function levelUp(newLevelName) {
    const el = document.createElement('div');
    el.className = 'levelup-overlay';
    el.innerHTML = `
      <div class="levelup-content">
        <div class="levelup-label">Niveau supérieur !</div>
        <div class="levelup-title">LEVEL UP</div>
        <div class="levelup-new">Tu es maintenant<br><strong>${newLevelName}</strong></div>
      </div>`;
    document.body.appendChild(el);
    confetti(2500);
    el.addEventListener('click', () => el.remove());
    setTimeout(() => el.remove(), 3500);
  }

  // ---- Badge Unlock ----
  function badgeUnlock(emoji, name) {
    const el = document.createElement('div');
    el.className = 'badge-popup';
    el.innerHTML = `
      <div class="badge-popup-emoji">${emoji}</div>
      <div class="badge-popup-text">
        <div class="badge-popup-label">Badge débloqué !</div>
        <div class="badge-popup-name">${name}</div>
      </div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => { requestAnimationFrame(() => el.classList.add('show')); });
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 500);
    }, 3500);
  }

  // ---- Boss Complete Sequence ----
  function bossComplete(songName, emoji, cb) {
    const el = document.createElement('div');
    el.className = 'levelup-overlay';
    el.style.background = 'rgba(0,0,0,0.92)';
    el.innerHTML = `
      <div class="levelup-content" style="display:flex;flex-direction:column;align-items:center;gap:16px">
        <div style="font-size:72px;animation:comboPop 0.6s ease-out">${emoji}</div>
        <div class="levelup-label" style="font-size:16px;letter-spacing:3px">BOSS TERMINÉ !</div>
        <div class="levelup-title" style="font-size:48px;line-height:1.1">FÉLICITATIONS</div>
        <div style="font-size:16px;color:#94A3B8;text-align:center;max-width:300px">
          Tu peux maintenant jouer<br><strong style="color:white">${songName}</strong><br>devant tes amis ! 🎸
        </div>
        <button class="btn btn-primary mt-4" id="boss-close-btn">Continuer →</button>
      </div>`;
    document.body.appendChild(el);
    confetti(4000);
    document.getElementById('boss-close-btn').addEventListener('click', () => {
      el.remove();
      if (cb) cb();
    });
  }

  // ---- Combo ----
  function combo(count) {
    const el = document.createElement('div');
    el.className = 'combo-display';
    el.textContent = `COMBO x${count} !`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  // ---- Update HUD ----
  function updateHUD() {
    const state = Progress.get();
    const lvl = Progress.getLevelInfo(state.totalXP);
    const pct = Progress.getXPPercent(state.totalXP);
    const fill = document.getElementById('xp-fill');
    const label = document.getElementById('xp-label');
    const levelEl = document.getElementById('hud-level');
    const streakEl = document.getElementById('streak-count');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = state.totalXP + ' XP';
    if (levelEl) levelEl.textContent = lvl.name;
    if (streakEl) streakEl.textContent = state.streak.count;
  }

  return { xpPop, toast, confetti, levelUp, badgeUnlock, bossComplete, combo, updateHUD };
})();
