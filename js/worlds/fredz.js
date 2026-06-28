/* =========================================
   MONDE FREDZ — "3 Accords"
   ========================================= */

const WorldFredz = (() => {
  const WORLD = 'fredz';
  const COLOR = '#FF6B35';

  const LEVELS = [
    {
      num: 1, title: 'Nommer les cordes', icon: '🎸', xp: 100,
      badge: { name: 'Cartographe des cordes', emoji: '🗺️' },
      desc: 'Apprends les 6 cordes de la guitare',
    },
    {
      num: 2, title: 'Am — Ton premier accord', icon: '✊', xp: 150,
      badge: { name: 'Ami d\'Am', emoji: '💜' },
      desc: 'Place tes doigts sur Am',
    },
    {
      num: 3, title: 'C majeur — Le défi du pouce', icon: '☝️', xp: 150,
      badge: { name: 'Maître du C', emoji: '👑' },
      desc: 'Maîtrise l\'accord C',
    },
    {
      num: 4, title: 'G majeur — La transition', icon: '⚡', xp: 200,
      badge: { name: 'Triplé Gagnant', emoji: '🔱' },
      desc: 'Enchaîne Am → C → G',
    },
    {
      num: 5, title: 'Le Rythme de base', icon: '🥁', xp: 250,
      badge: { name: 'Rythme Urbain', emoji: '🌆' },
      desc: 'Apprends le strumming',
    },
    {
      num: 6, title: 'Joue la chanson en morceaux', icon: '🎵', xp: 300,
      badge: { name: 'Architecte de la Chanson', emoji: '🏗️' },
      desc: '4 sections de "3 Accords"',
    },
    {
      num: 7, title: 'Boss Level: La chanson complète', icon: '👑', xp: 500,
      badge: { name: 'Roi du 3 Accords', emoji: '🏆' },
      desc: 'Joue "3 Accords" au complet !',
    },
  ];

  const SONG_SECTIONS = [
    {
      label: 'Intro / Couplet 1',
      chords: ['Am', 'C', 'G'],
      lyrics: 'Avec juste 3 accords, j\'parle de mes amours…',
    },
    {
      label: 'Pré-refrain',
      chords: ['Am', 'C'],
      lyrics: 'Le monde entier, il tourne avec 3 accords…',
    },
    {
      label: 'Refrain',
      chords: ['G', 'Am', 'C', 'G'],
      lyrics: '3 accords, 3 accords, c\'est tout ce qu\'il me faut…',
    },
    {
      label: 'Outro',
      chords: ['Am', 'G', 'C'],
      lyrics: 'Et maintenant je joue, je joue pour vous…',
    },
  ];

  const KARAOKE = [
    { chord: 'Am', lyric: 'Avec juste 3 accords…', dur: 3000 },
    { chord: 'C',  lyric: 'j\'parle de mes amours…', dur: 3000 },
    { chord: 'G',  lyric: 'Le monde entier tourne', dur: 3000 },
    { chord: 'Am', lyric: 'avec 3 accords…', dur: 3000 },
    { chord: 'C',  lyric: '3 accords, 3 accords', dur: 3000 },
    { chord: 'G',  lyric: 'c\'est tout ce qu\'il me faut…', dur: 3000 },
    { chord: 'Am', lyric: 'Et maintenant je joue', dur: 3000 },
    { chord: 'G',  lyric: 'je joue pour vous…', dur: 3000 },
    { chord: 'C',  lyric: '🎸', dur: 2000 },
  ];

  function renderLevel(num, container) {
    switch (num) {
      case 1: return renderLevel1(container);
      case 2: return renderLevel2(container);
      case 3: return renderLevel3(container);
      case 4: return renderLevel4(container);
      case 5: return renderLevel5(container);
      case 6: return renderLevel6(container);
      case 7: return renderLevel7(container);
    }
  }

  /* ---- NIVEAU 1: Nommer les cordes ---- */
  function renderLevel1(container) {
    const strings = ['Mi aigu', 'Si', 'Sol', 'Ré', 'La', 'Mi grave'];
    const shuffled = [...strings].sort(() => Math.random() - 0.5);
    let filled = {};
    let dragItem = null;

    container.innerHTML = `
      <div class="piano-link">La guitare a 6 cordes — comme les 6 notes Mi, La, Ré, Sol, Si, Mi du piano !</div>

      <div class="section-title">Glisse les noms sur les bonnes cordes</div>
      <div id="strings-game">
        ${strings.map((_, i) => `
          <div class="string-row" style="margin-bottom:10px">
            <div style="font-family:'Space Mono',monospace;font-size:11px;color:#555;min-width:16px">${i + 1}</div>
            <div class="string-line" style="height:${1 + i * 0.5}px;background:linear-gradient(90deg,#888,#CCC,#888)"></div>
            <div class="string-drop-zone" id="drop-${i}" data-idx="${i}">?</div>
          </div>`).join('')}
      </div>

      <div class="section-title mt-4">Noms des cordes</div>
      <div class="drag-labels" id="drag-labels">
        ${shuffled.map(s => `<div class="drag-chip" draggable="true" data-note="${s}">${s}</div>`).join('')}
      </div>

      <div class="btn-row">
        <button class="btn btn-secondary" id="hint-btn">💡 Aide</button>
        <button class="btn btn-primary hidden" id="validate-btn">Valider ✓</button>
      </div>`;

    // Drag & drop
    container.querySelectorAll('.drag-chip').forEach(chip => {
      chip.addEventListener('dragstart', e => {
        dragItem = chip.dataset.note;
        e.dataTransfer.effectAllowed = 'move';
      });
    });

    container.querySelectorAll('.string-drop-zone').forEach(zone => {
      zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('over'));
      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('over');
        if (!dragItem) return;
        const idx = parseInt(zone.dataset.idx);
        // Remove from previous if re-used
        Object.keys(filled).forEach(k => {
          if (filled[k] === dragItem) {
            delete filled[k];
            const oldZone = container.querySelector(`[data-idx="${k}"]`);
            if (oldZone) { oldZone.textContent = '?'; oldZone.classList.remove('filled'); }
          }
        });
        filled[idx] = dragItem;
        zone.textContent = dragItem;
        zone.classList.add('filled');

        const chip = container.querySelector(`.drag-chip[data-note="${dragItem}"]`);
        if (chip) chip.classList.add('used');

        if (Object.keys(filled).length === strings.length) {
          document.getElementById('validate-btn').classList.remove('hidden');
        }
      });
    });

    // Touch support
    container.querySelectorAll('.drag-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const note = chip.dataset.note;
        if (chip.classList.contains('used')) return;
        const firstEmpty = [...container.querySelectorAll('.string-drop-zone')].find(z => z.textContent === '?');
        if (firstEmpty) {
          const idx = parseInt(firstEmpty.dataset.idx);
          filled[idx] = note;
          firstEmpty.textContent = note;
          firstEmpty.classList.add('filled');
          chip.classList.add('used');
          if (Object.keys(filled).length === strings.length) {
            document.getElementById('validate-btn').classList.remove('hidden');
          }
        }
      });
    });

    document.getElementById('hint-btn').addEventListener('click', () => {
      strings.forEach((s, i) => {
        const zone = container.querySelector(`[data-idx="${i}"]`);
        if (zone && zone.textContent === '?') {
          zone.textContent = s;
          zone.classList.add('filled');
          zone.style.borderColor = 'rgba(124,58,237,0.5)';
          filled[i] = s;
        }
      });
      document.getElementById('validate-btn').classList.remove('hidden');
    });

    document.getElementById('validate-btn').addEventListener('click', () => {
      let correct = 0;
      strings.forEach((s, i) => {
        const zone = container.querySelector(`[data-idx="${i}"]`);
        if (filled[i] === s) {
          correct++;
          zone.style.borderColor = '#22C55E';
          zone.style.color = '#22C55E';
        } else {
          zone.style.borderColor = '#EF4444';
          zone.textContent = `❌ ${s}`;
        }
      });
      if (correct >= 5) {
        App.completeLevel(WORLD, 1, LEVELS[0].badge.name, LEVELS[0].badge.emoji, LEVELS[0].xp);
      } else {
        Rewards.toast('Essaie encore ! ' + correct + '/6 correct', 'error');
      }
    });
  }

  /* ---- NIVEAU 2: Am ---- */
  function renderLevel2(container) {
    let step = 0;
    container.innerHTML = `
      <div class="piano-link">Am au piano = La mineur — tu connais déjà ça ! Sur guitare, on fait la même note avec 3 doigts.</div>
      <div class="section-title">Diagramme de l'accord Am</div>
      <div class="neck-container">
        <div class="neck-title">Am — La mineur</div>
        <div id="neck-display"></div>
        <div class="neck-help-text">Doigt 2 = index, 3 = majeur, 4 = annulaire</div>
      </div>
      <div id="challenge-zone">
        <div class="section-title">Étape 1: Observe les doigts</div>
        <p style="font-size:14px;color:#94A3B8;margin-bottom:16px">Regarde bien la position. Quand tu es prêt, clique sur "Je connais l'accord".</p>
        <div class="btn-row">
          <button class="btn btn-primary" id="next-step">Je connais l'accord →</button>
        </div>
      </div>`;

    GuitarNeck.animateChord('neck-display', 'Am', { color: COLOR });

    document.getElementById('next-step').addEventListener('click', () => {
      step++;
      if (step === 1) {
        document.getElementById('challenge-zone').innerHTML = `
          <div class="section-title">Étape 2: Place les doigts toi-même</div>
          <p style="font-size:14px;color:#94A3B8;margin-bottom:16px">Clique sur les bonnes frettes pour placer tes 3 doigts.</p>
          <div class="neck-container">
            <div class="neck-title">Clique pour placer tes doigts</div>
            <div id="neck-interactive"></div>
          </div>
          <div id="success-zone"></div>`;

        GuitarNeck.renderInteractive('neck-interactive', 'Am', { color: COLOR }, () => {
          document.getElementById('success-zone').innerHTML = `
            <div style="text-align:center;margin-top:16px">
              <div style="font-size:32px">🎉</div>
              <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:#22C55E">PARFAIT !</div>
              <div style="color:#94A3B8;font-size:14px;margin:8px 0">Tu as placé Am correctement !</div>
              <button class="btn btn-success mt-4" id="finish-lvl">Réclamer mon badge 🏅</button>
            </div>`;
          document.getElementById('finish-lvl').addEventListener('click', () => {
            App.completeLevel(WORLD, 2, LEVELS[1].badge.name, LEVELS[1].badge.emoji, LEVELS[1].xp);
          });
        });
      }
    });
  }

  /* ---- NIVEAU 3: C ---- */
  function renderLevel3(container) {
    let timer = null;
    let holding = false;
    let elapsed = 0;

    container.innerHTML = `
      <div class="section-title">L'accord C majeur</div>
      <div class="neck-container">
        <div class="neck-title">C — Do majeur</div>
        <div id="neck-c"></div>
      </div>
      <div class="quiz-container">
        <div class="quiz-question">Pourquoi C est plus difficile que Am ?</div>
        <div class="quiz-options" id="quiz-c">
          <button class="quiz-option" data-correct="false">Parce qu'il a plus d'accords</button>
          <button class="quiz-option" data-correct="true">Parce que les doigts doivent s'étirer davantage</button>
          <button class="quiz-option" data-correct="false">Parce qu'il faut gratter moins fort</button>
        </div>
      </div>
      <div id="hold-challenge" class="hidden">
        <div class="section-title">Défi: Tiens C pendant 10 secondes</div>
        <div class="countdown-num" id="hold-timer">10</div>
        <div class="countdown-label">secondes</div>
        <div class="btn-row">
          <button class="btn btn-primary" id="hold-start">▶ Commencer</button>
        </div>
      </div>`;

    GuitarNeck.animateChord('neck-c', 'C', { color: COLOR });

    container.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);
        if (btn.dataset.correct === 'true') {
          btn.classList.add('correct');
          Rewards.toast('Exact ! L\'extension des doigts rend C plus dur.', 'success');
          document.getElementById('hold-challenge').classList.remove('hidden');
        } else {
          btn.classList.add('wrong');
          const right = container.querySelector('[data-correct="true"]');
          if (right) right.classList.add('correct');
          Rewards.toast('Pas tout à fait — l\'extension des doigts !', 'error');
          document.getElementById('hold-challenge').classList.remove('hidden');
        }
      });
    });

    document.getElementById('hold-start').addEventListener('click', () => {
      elapsed = 0;
      const timerEl = document.getElementById('hold-timer');
      const btn = document.getElementById('hold-start');
      btn.disabled = true;
      timer = setInterval(() => {
        elapsed++;
        timerEl.textContent = 10 - elapsed;
        if (elapsed >= 10) {
          clearInterval(timer);
          timerEl.textContent = '✓';
          timerEl.style.color = '#22C55E';
          setTimeout(() => {
            App.completeLevel(WORLD, 3, LEVELS[2].badge.name, LEVELS[2].badge.emoji, LEVELS[2].xp);
          }, 500);
        }
      }, 1000);
    });
  }

  /* ---- NIVEAU 4: G + transitions ---- */
  function renderLevel4(container) {
    const chords = ['Am', 'C', 'G'];
    let active = 0;
    let transTimer = null;
    let running = false;
    let ticks = 0;

    container.innerHTML = `
      <div class="section-title">G majeur</div>
      <div class="neck-container">
        <div class="neck-title">G — Sol majeur</div>
        <div id="neck-g"></div>
      </div>
      <div class="section-title mt-4">Défi de transition — change d'accord toutes les 4 secondes</div>
      <div class="chord-transition" id="chord-trans">
        ${chords.map((c, i) => `<div class="chord-box" id="chord-${i}">${c}</div>${i < 2 ? '<div class="chord-arrow">→</div>' : ''}`).join('')}
      </div>
      <div class="countdown-num" id="trans-count">4</div>
      <div class="countdown-label" id="trans-label">secondes</div>
      <div class="btn-row">
        <button class="btn btn-primary" id="trans-start">▶ Démarrer</button>
        <button class="btn btn-secondary hidden" id="trans-done">J'ai réussi ! ✓</button>
      </div>`;

    GuitarNeck.animateChord('neck-g', 'G', { color: COLOR });

    document.getElementById('trans-start').addEventListener('click', () => {
      running = true;
      ticks = 0;
      active = 0;
      document.getElementById('trans-start').classList.add('hidden');
      highlight(0);

      transTimer = setInterval(() => {
        ticks++;
        const remaining = 4 - (ticks % 4);
        document.getElementById('trans-count').textContent = remaining === 4 ? 4 : remaining;
        if (ticks % 4 === 0) {
          active = (active + 1) % chords.length;
          highlight(active);
        }
        if (ticks >= 24) { // 3 full cycles
          clearInterval(transTimer);
          document.getElementById('trans-count').textContent = '🎸';
          document.getElementById('trans-label').textContent = 'Terminé !';
          document.getElementById('trans-done').classList.remove('hidden');
        }
      }, 1000);
    });

    document.getElementById('trans-done').addEventListener('click', () => {
      App.completeLevel(WORLD, 4, LEVELS[3].badge.name, LEVELS[3].badge.emoji, LEVELS[3].xp);
    });

    function highlight(idx) {
      chords.forEach((_, i) => {
        const el = document.getElementById(`chord-${i}`);
        el.classList.toggle('active', i === idx);
      });
    }
  }

  /* ---- NIVEAU 5: Rythme ---- */
  function renderLevel5(container) {
    container.innerHTML = `
      <div class="piano-link">Comme compter 1-2-3-4 au violon — mais avec des flèches ↓ et ↑ !</div>
      <div class="section-title">Pattern de strumming de "3 Accords"</div>
      <div id="metro-zone"></div>
      <div class="section-title mt-4">Tap Challenge — tape le rythme en cliquant sur TAP</div>
      <div id="metro-tap-zone"></div>
      <div class="btn-row mt-4">
        <button class="btn btn-primary" id="rhythm-done">J'ai le rythme ! 🥁</button>
      </div>`;

    Metronome.render('metro-zone', { bpm: 80, pattern: ['↓', '↓', '↑', '↓', '↑'] });
    Metronome.render('metro-tap-zone', { bpm: 80, showTap: true });

    document.getElementById('rhythm-done').addEventListener('click', () => {
      App.completeLevel(WORLD, 5, LEVELS[4].badge.name, LEVELS[4].badge.emoji, LEVELS[4].xp);
    });
  }

  /* ---- NIVEAU 6: Morceaux ---- */
  function renderLevel6(container) {
    let completed = new Set();

    container.innerHTML = `
      <div class="section-title">4 sections de "3 Accords"</div>
      <p style="font-size:14px;color:#94A3B8;margin-bottom:16px">Clique sur chaque section, joue-la, puis marque-la comme terminée.</p>
      <div class="song-sections" id="sections-list">
        ${SONG_SECTIONS.map((s, i) => `
          <div class="song-section" data-idx="${i}">
            <div class="song-section-header">
              <span class="section-label">${s.label}</span>
              <span id="section-check-${i}">○</span>
            </div>
            <div class="section-chords-strip">
              ${s.chords.map(c => `<div class="chord-pill">${c}</div>`).join('')}
            </div>
            <div class="lyrics-line">"${s.lyrics}"</div>
          </div>`).join('')}
      </div>
      <div class="btn-row">
        <button class="btn btn-primary hidden" id="all-done-btn">Toutes les sections ✓</button>
      </div>`;

    container.querySelectorAll('.song-section').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.idx);
        el.classList.add('active');
        setTimeout(() => {
          completed.add(idx);
          document.getElementById(`section-check-${idx}`).textContent = '✓';
          document.getElementById(`section-check-${idx}`).style.color = '#22C55E';
          el.style.borderColor = 'rgba(34,197,94,0.4)';
          Rewards.toast('Section complétée ! Continue !', 'success');
          if (completed.size >= SONG_SECTIONS.length) {
            document.getElementById('all-done-btn').classList.remove('hidden');
          }
        }, 800);
      });
    });

    document.getElementById('all-done-btn').addEventListener('click', () => {
      App.completeLevel(WORLD, 6, LEVELS[5].badge.name, LEVELS[5].badge.emoji, LEVELS[5].xp);
    });
  }

  /* ---- NIVEAU 7: Boss ---- */
  function renderLevel7(container) {
    let idx = 0;
    let timer = null;

    container.innerHTML = `
      <div class="section-title">Mode karaoké — les accords défilent en rythme</div>
      <div class="karaoke-display">
        <div class="karaoke-chord-now" id="k-chord" style="color:${COLOR}">Am</div>
        <div class="karaoke-lyric" id="k-lyric">Prêt ? Appuie sur Démarrer !</div>
        <div class="karaoke-next" id="k-next">Prochain: C</div>
        <div class="progress-bar-song"><div class="progress-bar-fill" id="k-prog" style="width:0%"></div></div>
      </div>
      <div class="btn-row">
        <button class="btn btn-primary" id="boss-start">🎸 Démarrer</button>
      </div>
      <div id="self-eval-zone" class="hidden">
        <div class="section-title mt-4">Comment tu t'en es sorti ?</div>
        <div class="self-eval">
          <button class="eval-btn" data-val="debutant">😰<span>Débutant</span></button>
          <button class="eval-btn" data-val="rockeur">😎<span>Rockeur</span></button>
          <button class="eval-btn" data-val="legende">⚡<span>Légende</span></button>
        </div>
      </div>`;

    document.getElementById('boss-start').addEventListener('click', startKaraoke);

    function startKaraoke() {
      document.getElementById('boss-start').classList.add('hidden');
      idx = 0;
      showBeat();
    }

    function showBeat() {
      if (idx >= KARAOKE.length) {
        endKaraoke();
        return;
      }
      const beat = KARAOKE[idx];
      document.getElementById('k-chord').textContent = beat.chord;
      document.getElementById('k-lyric').textContent = beat.lyric;
      const next = KARAOKE[idx + 1];
      document.getElementById('k-next').textContent = next ? `Prochain: ${next.chord}` : '🎸 Fin !';
      const pct = Math.round((idx / KARAOKE.length) * 100);
      document.getElementById('k-prog').style.width = pct + '%';
      idx++;
      timer = setTimeout(showBeat, beat.dur);
    }

    function endKaraoke() {
      document.getElementById('k-chord').textContent = '🎸';
      document.getElementById('k-lyric').textContent = 'Tu l\'as fait !';
      document.getElementById('k-next').textContent = '';
      document.getElementById('k-prog').style.width = '100%';
      document.getElementById('self-eval-zone').classList.remove('hidden');
    }

    container.querySelectorAll('.eval-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Rewards.bossComplete('"3 Accords" de Fredz', '🏆', () => {
          App.completeLevel(WORLD, 7, LEVELS[6].badge.name, LEVELS[6].badge.emoji, LEVELS[6].xp);
        });
      });
    });
  }

  return { WORLD, LEVELS, renderLevel, COLOR };
})();
