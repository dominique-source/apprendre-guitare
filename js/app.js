/* =========================================
   GUITAR QUEST — Main App Router
   ========================================= */

const App = (() => {
  let currentWorld = null;
  let currentLevel = null;

  function init() {
    Progress.updateStreak();
    Rewards.updateHUD();
    navigate('home');
    document.getElementById('btn-home').addEventListener('click', () => navigate('home'));
    document.getElementById('btn-badges').addEventListener('click', () => navigate('badges'));
  }

  function navigate(screen, opts = {}) {
    const app = document.getElementById('app');
    const hud = document.getElementById('hud');

    app.innerHTML = '';

    if (screen === 'home') {
      hud.classList.add('hidden');
      renderHome(app);
    } else if (screen === 'world') {
      hud.classList.remove('hidden');
      currentWorld = opts.world;
      renderWorld(app, opts.world);
    } else if (screen === 'level') {
      hud.classList.remove('hidden');
      currentWorld = opts.world;
      currentLevel = opts.level;
      renderLevel(app, opts.world, opts.level);
    } else if (screen === 'badges') {
      hud.classList.remove('hidden');
      renderBadges(app);
    }

    Rewards.updateHUD();
  }

  /* ---- HOME ---- */
  function renderHome(container) {
    const state = Progress.get();
    const fredzW = state.worlds.fredz;
    const loupW  = state.worlds.leloup;

    const el = document.createElement('div');
    el.id = 'screen-home';
    el.className = 'screen';
    el.innerHTML = `
      <div style="max-width:760px;width:100%;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:0">
        <div style="font-size:44px;margin-bottom:8px">🎸</div>
        <h1 class="home-title"><span>GUITAR QUEST</span></h1>
        <p class="home-subtitle">Choisis ton univers</p>

        <div class="worlds-grid">
          <!-- FREDZ CARD -->
          <div class="world-card fredz" id="card-fredz">
            <div class="world-bg" id="bg-fredz"></div>
            <div class="world-content">
              <div class="world-tag">Hip-hop québécois</div>
              <div class="world-song">3 Accords</div>
              <div class="world-artist">par Fredz</div>
              <div class="world-chords">Am · C · G</div>
              <div class="world-progress-mini">
                ${Array.from({length:7},(_,i)=>`<div class="level-dot ${fredzW.completedLevels.includes(i+1)?'done':fredzW.unlockedLevels.includes(i+1)?'active':''}"></div>`).join('')}
              </div>
              <button class="btn-enter">ENTRER →</button>
            </div>
          </div>

          <!-- LELOUP CARD -->
          <div class="world-card leloup" id="card-leloup">
            <div class="world-bg" id="bg-leloup"></div>
            <div class="world-content">
              <div class="world-tag">Blues / Road trip</div>
              <div class="world-song">I Lost My Baby</div>
              <div class="world-artist">par Jean Leloup</div>
              <div class="world-chords">E · A · B7</div>
              <div class="world-progress-mini">
                ${Array.from({length:7},(_,i)=>`<div class="level-dot ${loupW.completedLevels.includes(i+1)?'done':loupW.unlockedLevels.includes(i+1)?'active':''}"></div>`).join('')}
              </div>
              <button class="btn-enter">ENTRER →</button>
            </div>
          </div>
        </div>

        ${state.totalXP > 0 ? `<div style="margin-top:28px;text-align:center;color:#475569;font-size:13px;font-family:'Space Mono',monospace">${state.totalXP} XP · ${state.streak.count} jours de suite 🔥</div>` : ''}
      </div>`;

    container.appendChild(el);
    buildMontrealSkyline(document.getElementById('bg-fredz'));
    buildDesertRoad(document.getElementById('bg-leloup'));

    document.getElementById('card-fredz').addEventListener('click', () => navigate('world', { world: 'fredz' }));
    document.getElementById('card-leloup').addEventListener('click', () => navigate('world', { world: 'leloup' }));
  }

  /* ---- WORLD MAP ---- */
  function renderWorld(container, worldId) {
    const worldDef = worldId === 'fredz' ? WorldFredz : WorldLeloup;
    const state = Progress.get().worlds[worldId];
    const color = worldDef.COLOR;

    const el = document.createElement('div');
    el.id = 'screen-world';
    el.className = `screen with-hud world-${worldId}`;

    const levels = worldDef.LEVELS;

    el.innerHTML = `
      <div class="world-header" style="border-bottom:1px solid rgba(255,255,255,0.06);margin-bottom:8px">
        <button class="btn-icon" style="margin-bottom:12px" id="back-btn">← Retour</button>
        <div class="world-header-title">${worldId === 'fredz' ? '3 Accords — Fredz' : 'I Lost My Baby — Jean Leloup'}</div>
        <div class="world-header-sub">${state.completedLevels.length} / 7 niveaux complétés</div>
      </div>
      <div class="level-map">
        ${levels.map((lvl, i) => {
          const done = state.completedLevels.includes(lvl.num);
          const avail = state.unlockedLevels.includes(lvl.num);
          const locked = !avail && !done;
          const cls = done ? 'completed' : avail ? 'available' : 'locked';
          return `
            ${i > 0 ? `<div class="level-connector ${state.completedLevels.includes(i) ? 'done' : ''}"></div>` : ''}
            <div class="level-card ${cls}" data-lvl="${lvl.num}">
              <div class="level-icon">${locked ? '🔒' : done ? '✅' : lvl.icon}</div>
              <div class="level-info">
                <div class="level-num">NIVEAU ${lvl.num}</div>
                <div class="level-title">${lvl.title}</div>
                <div class="level-desc">${lvl.desc}</div>
              </div>
              <div class="level-xp">${lvl.xp} XP</div>
            </div>`;
        }).join('')}
      </div>`;

    container.appendChild(el);

    document.getElementById('back-btn').addEventListener('click', () => navigate('home'));

    el.querySelectorAll('.level-card.available, .level-card.completed').forEach(card => {
      card.addEventListener('click', () => {
        navigate('level', { world: worldId, level: parseInt(card.dataset.lvl) });
      });
    });

    el.querySelectorAll('.level-card.locked').forEach(card => {
      card.addEventListener('click', () => Rewards.toast('🔒 Termine le niveau précédent d\'abord !', 'error'));
    });
  }

  /* ---- LEVEL SCREEN ---- */
  function renderLevel(container, worldId, levelNum) {
    const worldDef = worldId === 'fredz' ? WorldFredz : WorldLeloup;
    const lvlInfo = worldDef.LEVELS[levelNum - 1];
    const color = worldDef.COLOR;

    const el = document.createElement('div');
    el.id = 'screen-level';
    el.className = `screen with-hud world-${worldId}`;

    el.innerHTML = `
      <div class="level-screen-inner">
        <button class="btn-icon" id="back-lvl" style="margin-bottom:16px">← Niveaux</button>
        <div class="level-screen-header">
          <div style="font-size:36px">${lvlInfo.icon}</div>
          <div class="level-screen-title" style="color:${color}">${lvlInfo.title}</div>
          <div class="level-screen-sub">Niveau ${levelNum} · ${lvlInfo.xp} XP</div>
        </div>
        <div id="level-content"></div>
      </div>`;

    container.appendChild(el);

    document.getElementById('back-lvl').addEventListener('click', () => navigate('world', { world: worldId }));
    worldDef.renderLevel(levelNum, document.getElementById('level-content'));
  }

  /* ---- BADGES SCREEN ---- */
  function renderBadges(container) {
    const state = Progress.get();
    const allBadges = [
      ...WorldFredz.LEVELS.map(l => ({ ...l.badge, world: 'fredz' })),
      ...WorldLeloup.LEVELS.map(l => ({ ...l.badge, world: 'leloup' })),
    ];

    const earnedNames = [
      ...state.worlds.fredz.badges.map(b => b.name),
      ...state.worlds.leloup.badges.map(b => b.name),
    ];

    const el = document.createElement('div');
    el.id = 'screen-badges';
    el.className = 'screen with-hud';

    el.innerHTML = `
      <div style="padding:20px 20px 8px;width:100%;max-width:640px;margin:0 auto">
        <button class="btn-icon" id="back-badges" style="margin-bottom:16px">← Retour</button>
        <h2 style="font-family:'Bebas Neue',sans-serif;font-size:32px;letter-spacing:2px">Collection de badges</h2>
        <p style="color:#64748B;font-size:14px;margin-top:4px">${earnedNames.length} / ${allBadges.length} badges débloqués</p>
      </div>
      <div class="badges-grid">
        ${allBadges.map(b => {
          const earned = earnedNames.includes(b.name);
          return `
            <div class="badge-item ${earned ? 'earned' : 'locked'}">
              <div class="badge-emoji">${earned ? b.emoji : '❓'}</div>
              <div class="badge-name">${earned ? b.name : '???'}</div>
            </div>`;
        }).join('')}
      </div>`;

    container.appendChild(el);
    document.getElementById('back-badges').addEventListener('click', () => navigate('home'));
  }

  /* ---- COMPLETE LEVEL (called from world files) ---- */
  function completeLevel(world, levelNum, badgeName, badgeEmoji, xp) {
    Progress.completeLevel(world, levelNum, badgeName, badgeEmoji);
    const result = Progress.addXP(xp);

    Rewards.xpPop(result.earned, window.innerWidth / 2, window.innerHeight / 2);
    Rewards.toast(`+${result.earned} XP gagnés !`, 'success');

    const combo = Progress.incrementCombo();
    if (combo >= 3) {
      setTimeout(() => Rewards.combo(combo), 600);
    }

    if (result.leveledUp) {
      setTimeout(() => Rewards.levelUp(result.newLevel), 1000);
    }

    if (badgeName) {
      setTimeout(() => Rewards.badgeUnlock(badgeEmoji, badgeName), 1800);
    }

    Rewards.updateHUD();

    setTimeout(() => navigate('world', { world }), 2500);
  }

  /* ---- SVG BACKGROUNDS ---- */
  function buildMontrealSkyline(container) {
    if (!container) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 300 300');
    svg.setAttribute('style', 'width:100%;height:100%;position:absolute;inset:0');

    // Night sky gradient
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.setAttribute('id', 'sky-fredz'); grad.setAttribute('x1','0'); grad.setAttribute('y1','0'); grad.setAttribute('x2','0'); grad.setAttribute('y2','1');
    [['0%','#0A0A1A'],['100%','#1A1A2E']].forEach(([offset,color]) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', offset); stop.setAttribute('stop-color', color);
      grad.appendChild(stop);
    });
    defs.appendChild(grad);
    svg.appendChild(defs);

    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', '300'); bg.setAttribute('height', '300');
    bg.setAttribute('fill', 'url(#sky-fredz)');
    svg.appendChild(bg);

    // Buildings
    const buildings = [
      [10, 180, 30, 120], [50, 150, 25, 150], [85, 170, 35, 130],
      [130, 120, 20, 180], [160, 155, 40, 145], [210, 140, 30, 160],
      [250, 165, 40, 135], [0, 195, 15, 105],
    ];
    buildings.forEach(([x, y, w, h]) => {
      const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      r.setAttribute('x', x); r.setAttribute('y', y);
      r.setAttribute('width', w); r.setAttribute('height', h);
      r.setAttribute('fill', '#1A1A2E');
      svg.appendChild(r);

      // Windows
      for (let wy = y + 8; wy < 300 - 10; wy += 14) {
        for (let wx = x + 4; wx < x + w - 4; wx += 10) {
          if (Math.random() > 0.4) {
            const win = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            win.setAttribute('x', wx); win.setAttribute('y', wy);
            win.setAttribute('width', '5'); win.setAttribute('height', '7');
            win.setAttribute('fill', Math.random() > 0.7 ? '#FF6B35' : '#FFD700');
            win.setAttribute('opacity', '0.8');
            svg.appendChild(win);
          }
        }
      }
    });

    // Stars
    for (let i = 0; i < 30; i++) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', Math.random() * 300);
      circle.setAttribute('cy', Math.random() * 130);
      circle.setAttribute('r', Math.random() > 0.8 ? '1.5' : '1');
      circle.setAttribute('fill', 'white');
      circle.setAttribute('opacity', Math.random() * 0.8 + 0.2);
      svg.appendChild(circle);
    }

    container.appendChild(svg);
  }

  function buildDesertRoad(container) {
    if (!container) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 300 300');
    svg.setAttribute('style', 'width:100%;height:100%;position:absolute;inset:0');

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    // Sky gradient
    const skyG = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    skyG.setAttribute('id', 'sky-leloup'); skyG.setAttribute('x1','0'); skyG.setAttribute('y1','0'); skyG.setAttribute('x2','0'); skyG.setAttribute('y2','1');
    [['0%','#0F172A'],['60%','#1E1B4B'],['100%','#F59E0B']].forEach(([o,c]) => {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      s.setAttribute('offset',o); s.setAttribute('stop-color',c); skyG.appendChild(s);
    });
    defs.appendChild(skyG);
    svg.appendChild(defs);

    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width','300'); bg.setAttribute('height','300');
    bg.setAttribute('fill','url(#sky-leloup)');
    svg.appendChild(bg);

    // Desert ground
    const ground = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    ground.setAttribute('x','0'); ground.setAttribute('y','190');
    ground.setAttribute('width','300'); ground.setAttribute('height','110');
    ground.setAttribute('fill','#92400E');
    svg.appendChild(ground);

    // Road perspective
    const road = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    road.setAttribute('points','120,190 180,190 300,300 0,300');
    road.setAttribute('fill','#1E293B');
    svg.appendChild(road);

    // Road lines
    [[148,210],[144,230],[140,252],[136,278]].forEach(([x,y]) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      line.setAttribute('x',x); line.setAttribute('y',y);
      line.setAttribute('width','4'); line.setAttribute('height','12');
      line.setAttribute('fill','#F59E0B'); line.setAttribute('opacity','0.7');
      svg.appendChild(line);
    });

    // Stars
    for (let i = 0; i < 40; i++) {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', Math.random() * 300);
      c.setAttribute('cy', Math.random() * 150);
      c.setAttribute('r', Math.random() > 0.8 ? '1.5' : '0.8');
      c.setAttribute('fill', 'white');
      c.setAttribute('opacity', Math.random() * 0.9 + 0.1);
      svg.appendChild(c);
    }

    // Sunset glow
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    glow.setAttribute('cx','150'); glow.setAttribute('cy','190');
    glow.setAttribute('rx','80'); glow.setAttribute('ry','25');
    glow.setAttribute('fill','#F59E0B'); glow.setAttribute('opacity','0.3');
    svg.appendChild(glow);

    container.appendChild(svg);
  }

  return { init, navigate, completeLevel };
})();

// Boot
document.addEventListener('DOMContentLoaded', App.init);
