/* =========================================
   MONDE JEAN LELOUP — "I Lost My Baby"
   ========================================= */

const WorldLeloup = (() => {
  const WORLD = 'leloup';
  const COLOR = '#F59E0B';

  const LEVELS = [
    {
      num: 1, title: 'Guitare électrique vs acoustique', icon: '🎸', xp: 100,
      badge: { name: 'Connaisseur', emoji: '🔍' },
      desc: 'Connais ta guitare',
    },
    {
      num: 2, title: 'E majeur — L\'accord de la route', icon: '🛣️', xp: 150,
      badge: { name: 'Enfant du Rock', emoji: '🤘' },
      desc: 'L\'accord de base du blues',
    },
    {
      num: 3, title: 'A majeur — Sur la route', icon: '🌅', xp: 150,
      badge: { name: 'Route 66', emoji: '🗺️' },
      desc: 'Transitions E → A',
    },
    {
      num: 4, title: 'B7 — Le Boss des accords', icon: '💀', xp: 250,
      badge: { name: 'B7 Survivor', emoji: '⚡' },
      desc: 'L\'accord le plus difficile',
    },
    {
      num: 5, title: 'Le Feel Blues', icon: '🎷', xp: 200,
      badge: { name: 'Soul du Blues', emoji: '🔥' },
      desc: 'Apprends le shuffle rhythm',
    },
    {
      num: 6, title: 'Jean Leloup à Montréal', icon: '🌃', xp: 300,
      badge: { name: 'Sur la Route avec Jean', emoji: '🚗' },
      desc: '4 sections de la chanson',
    },
    {
      num: 7, title: 'Boss: I Lost My Baby au complet', icon: '⚡', xp: 500,
      badge: { name: 'Légende du Désert', emoji: '🏜️' },
      desc: 'La performance finale !',
    },
  ];

  const SONG_SECTIONS = [
    {
      label: 'Intro / Verse 1',
      chords: ['E', 'A'],
      lyrics: 'I lost my baby, don\'t know where she\'s gone…',
    },
    {
      label: 'Verse 2',
      chords: ['E', 'B7'],
      lyrics: 'I been searching, searching all night long…',
    },
    {
      label: 'Chorus',
      chords: ['A', 'E', 'B7'],
      lyrics: 'Oh baby, come back to me…',
    },
    {
      label: 'Outro / Solo',
      chords: ['E', 'A', 'B7', 'E'],
      lyrics: '(guitare solo — improvise !) 🎸',
    },
  ];

  const KARAOKE = [
    { chord: 'E',  lyric: 'I lost my baby…', dur: 3000 },
    { chord: 'A',  lyric: 'don\'t know where she\'s gone…', dur: 3000 },
    { chord: 'E',  lyric: 'I been searching…', dur: 3000 },
    { chord: 'B7', lyric: 'searching all night long…', dur: 3000 },
    { chord: 'A',  lyric: 'Oh baby, come back to me…', dur: 3000 },
    { chord: 'E',  lyric: 'I need you by my side…', dur: 3000 },
    { chord: 'B7', lyric: 'Without you, can\'t you see…', dur: 3000 },
    { chord: 'E',  lyric: '🎸 Solo !', dur: 4000 },
  ];

  const GUITAR_PARTS = [
    { id: 'headstock', label: 'Tête (tuners)', x: '15%', y: '5%', desc: 'Les mécaniques pour accorder les cordes' },
    { id: 'neck', label: 'Manche', x: '25%', y: '35%', desc: 'Où tu poses tes doigts pour faire les accords' },
    { id: 'body', label: 'Corps', x: '65%', y: '55%', desc: 'La caisse de résonance — amplifie le son' },
    { id: 'bridge', label: 'Chevalet', x: '68%', y: '72%', desc: 'Attache les cordes au corps' },
    { id: 'frets', label: 'Frettes', x: '35%', y: '25%', desc: 'Les barres métalliques — chaque frette = une note différente' },
    { id: 'soundhole', label: 'Rosace', x: '60%', y: '45%', desc: 'L\'ouverture qui projette le son (guitare acoustique)' },
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

  /* ---- NIVEAU 1: Électrique vs acoustique ---- */
  function renderLevel1(container) {
    let discovered = new Set();

    container.innerHTML = `
      <div class="piano-link">Le manche de la guitare, c'est comme le manche de l'archet du violon — en plus grand et horizontal !</div>
      <div class="section-title">Quiz: Électrique ou acoustique ?</div>
      <div class="quiz-container">
        <div class="quiz-question">Quelle guitare utilise un amplificateur pour le son ?</div>
        <div class="quiz-options" id="q1">
          <button class="quiz-option" data-correct="true">La guitare électrique</button>
          <button class="quiz-option" data-correct="false">La guitare acoustique</button>
          <button class="quiz-option" data-correct="false">Les deux ont besoin d'un ampli</button>
        </div>
      </div>
      <div class="section-title mt-4">Explore les parties de la guitare</div>
      <div style="position:relative;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;min-height:200px;margin-bottom:16px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px" id="parts-grid">
          ${GUITAR_PARTS.map(p => `
            <button class="guitar-part-btn" data-id="${p.id}" style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:8px;padding:10px;text-align:left;cursor:pointer;transition:all 0.2s;color:white">
              <div style="font-family:'Space Mono',monospace;font-size:13px;font-weight:700;color:${COLOR}">${p.label}</div>
              <div style="font-size:11px;color:#64748B;margin-top:4px">${p.desc}</div>
            </button>`).join('')}
        </div>
        <div id="parts-discovered" style="margin-top:12px;font-family:'Space Mono',monospace;font-size:12px;color:#64748B;text-align:center">
          0 / ${GUITAR_PARTS.length} parties découvertes
        </div>
      </div>
      <div class="btn-row">
        <button class="btn btn-primary hidden" id="finish-l1">Continuer 🎸</button>
      </div>`;

    container.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);
        if (btn.dataset.correct === 'true') {
          btn.classList.add('correct');
          Rewards.toast('Exact ! La guitare électrique a besoin d\'un ampli.', 'success');
        } else {
          btn.classList.add('wrong');
          container.querySelector('[data-correct="true"]').classList.add('correct');
        }
      });
    });

    container.querySelectorAll('.guitar-part-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        discovered.add(btn.dataset.id);
        btn.style.borderColor = COLOR;
        btn.style.background = `rgba(245,158,11,0.15)`;
        document.getElementById('parts-discovered').textContent = `${discovered.size} / ${GUITAR_PARTS.length} parties découvertes`;
        if (discovered.size >= GUITAR_PARTS.length) {
          document.getElementById('finish-l1').classList.remove('hidden');
        }
      });
    });

    document.getElementById('finish-l1').addEventListener('click', () => {
      App.completeLevel(WORLD, 1, LEVELS[0].badge.name, LEVELS[0].badge.emoji, LEVELS[0].xp);
    });
  }

  /* ---- NIVEAU 2: E ---- */
  function renderLevel2(container) {
    let count = 0;

    container.innerHTML = `
      <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:12px;padding:12px 16px;font-size:13px;color:${COLOR};margin-bottom:16px">
        🎸 Fun fact: E est l'accord de base du blues et du rock ! Jimi Hendrix, Led Zeppelin, AC/DC… tout commence par E.
      </div>
      <div class="section-title">L'accord E majeur</div>
      <div class="neck-container">
        <div class="neck-title">E — Mi majeur</div>
        <div id="neck-e"></div>
      </div>
      <div class="section-title mt-4">Exercice: Gratte E 10 fois de suite</div>
      <p style="font-size:14px;color:#94A3B8;margin-bottom:16px">Clique sur le bouton à chaque fois que tu grattes l'accord !</p>
      <div style="text-align:center">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:64px;color:${COLOR}" id="strum-count">0 / 10</div>
        <button class="btn btn-primary" id="strum-btn" style="background:linear-gradient(135deg,${COLOR},#EF4444);margin-top:16px;font-size:24px;padding:20px 40px">
          🎸 GRATTE !
        </button>
      </div>
      <div class="btn-row">
        <button class="btn btn-success hidden" id="finish-e">Excellent ! 🤘</button>
      </div>`;

    GuitarNeck.animateChord('neck-e', 'E', { color: COLOR });

    document.getElementById('strum-btn').addEventListener('click', () => {
      count++;
      document.getElementById('strum-count').textContent = `${count} / 10`;
      if (count >= 10) {
        document.getElementById('strum-btn').disabled = true;
        document.getElementById('finish-e').classList.remove('hidden');
        Rewards.toast('10 fois E ! Tu rock !', 'success');
      }
    });

    document.getElementById('finish-e').addEventListener('click', () => {
      App.completeLevel(WORLD, 2, LEVELS[1].badge.name, LEVELS[1].badge.emoji, LEVELS[1].xp);
    });
  }

  /* ---- NIVEAU 3: A + transitions E→A ---- */
  function renderLevel3(container) {
    let transCount = 0;
    let timer = null;
    let active = 0;

    container.innerHTML = `
      <div class="section-title">L'accord A majeur</div>
      <div class="neck-container">
        <div class="neck-title">A — La majeur</div>
        <div id="neck-a"></div>
      </div>
      <div class="section-title mt-4">Défi: 5 transitions E → A en 30 secondes</div>
      <div class="chord-transition">
        <div class="chord-box" id="chord-e">E</div>
        <div class="chord-arrow">→</div>
        <div class="chord-box" id="chord-a">A</div>
      </div>
      <div class="timer-display" id="ea-timer">30</div>
      <div style="text-align:center;font-family:'Space Mono',monospace;font-size:14px;color:#64748B">
        Transitions: <span id="trans-count-ea" style="color:${COLOR};font-size:20px">0</span> / 5
      </div>
      <div class="btn-row">
        <button class="btn btn-primary" id="ea-start">▶ Démarrer</button>
        <button class="btn btn-success hidden" id="ea-done">J'ai réussi ! 🗺️</button>
      </div>`;

    GuitarNeck.animateChord('neck-a', 'A', { color: COLOR });

    document.getElementById('ea-start').addEventListener('click', () => {
      document.getElementById('ea-start').classList.add('hidden');
      let remaining = 30;
      active = 0;
      document.getElementById('chord-e').classList.add('active');

      const countdown = setInterval(() => {
        remaining--;
        document.getElementById('ea-timer').textContent = remaining;
        if (remaining <= 10) document.getElementById('ea-timer').classList.add('urgent');
        if (remaining <= 0) {
          clearInterval(countdown);
          clearInterval(timer);
          if (transCount >= 5) {
            document.getElementById('ea-done').classList.remove('hidden');
          } else {
            Rewards.toast(`${transCount}/5 transitions — réessaie !`, 'error');
            document.getElementById('ea-start').classList.remove('hidden');
            document.getElementById('ea-start').textContent = '↺ Réessayer';
            transCount = 0;
            document.getElementById('trans-count-ea').textContent = '0';
          }
        }
      }, 1000);

      timer = setInterval(() => {
        active = (active + 1) % 2;
        document.getElementById('chord-e').classList.toggle('active', active === 0);
        document.getElementById('chord-a').classList.toggle('active', active === 1);
        if (active === 0) {
          transCount++;
          document.getElementById('trans-count-ea').textContent = transCount;
        }
      }, 3000);
    });

    document.getElementById('ea-done').addEventListener('click', () => {
      App.completeLevel(WORLD, 3, LEVELS[2].badge.name, LEVELS[2].badge.emoji, LEVELS[2].xp);
    });
  }

  /* ---- NIVEAU 4: B7 ---- */
  function renderLevel4(container) {
    let trained = false;

    container.innerHTML = `
      <div class="piano-link">B7 c'est comme un accord de dominante — tu connais ça au piano ! C'est la tension avant de résoudre sur E.</div>
      <div class="section-title">B7 — tutoriel étape par étape</div>
      <div class="neck-container">
        <div class="neck-title">B7 — Si septième</div>
        <div id="neck-b7"></div>
        <div class="neck-help-text">4 doigts sur 3 cordes — prends ton temps !</div>
      </div>
      <div class="quiz-container">
        <div class="quiz-question">Sur quelle frette va le doigt sur la corde 4 (Ré) ?</div>
        <div class="quiz-options" id="b7-quiz">
          <button class="quiz-option" data-correct="false">Frette 2</button>
          <button class="quiz-option" data-correct="true">Frette 1</button>
          <button class="quiz-option" data-correct="false">Frette 3</button>
        </div>
      </div>
      <div id="b7-challenge" class="hidden">
        <div class="section-title">Mode entraînement: place B7 sans timer</div>
        <div class="neck-container">
          <div class="neck-title">Clique pour placer tes doigts</div>
          <div id="neck-b7-interactive"></div>
        </div>
        <div id="b7-success"></div>
      </div>`;

    GuitarNeck.animateChord('neck-b7', 'B7', { color: COLOR });

    container.querySelectorAll('#b7-quiz .quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('#b7-quiz .quiz-option').forEach(b => b.disabled = true);
        if (btn.dataset.correct === 'true') {
          btn.classList.add('correct');
          Rewards.toast('Exact ! La frette 1 sur la corde Ré.', 'success');
        } else {
          btn.classList.add('wrong');
          container.querySelector('#b7-quiz [data-correct="true"]').classList.add('correct');
        }
        document.getElementById('b7-challenge').classList.remove('hidden');
        GuitarNeck.renderInteractive('neck-b7-interactive', 'B7', { color: COLOR }, () => {
          document.getElementById('b7-success').innerHTML = `
            <div style="text-align:center;padding:16px">
              <div style="font-size:36px">⚡</div>
              <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:${COLOR}">B7 SURVIVOR !</div>
              <button class="btn btn-primary mt-4" id="b7-done">Réclamer mon badge ⚡</button>
            </div>`;
          document.getElementById('b7-done').addEventListener('click', () => {
            App.completeLevel(WORLD, 4, LEVELS[3].badge.name, LEVELS[3].badge.emoji, LEVELS[3].xp);
          });
        });
      });
    });
  }

  /* ---- NIVEAU 5: Feel Blues ---- */
  function renderLevel5(container) {
    container.innerHTML = `
      <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:12px;padding:12px 16px;font-size:13px;color:${COLOR};margin-bottom:16px">
        🎷 Le shuffle blues n'est PAS en 4/4 régulier — c'est un feeling "swing" : court-long, court-long. Comme une boiterie rythmique !
      </div>
      <div class="section-title">Pattern shuffle blues</div>
      <div style="display:flex;justify-content:center;gap:16px;margin:16px 0;flex-wrap:wrap">
        <div style="text-align:center;padding:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;min-width:80px">
          <div style="font-family:'Space Mono',monospace;font-size:24px;color:${COLOR}">↓</div>
          <div style="font-size:11px;color:#64748B;margin-top:4px">Court</div>
        </div>
        <div style="text-align:center;padding:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;min-width:80px">
          <div style="font-family:'Space Mono',monospace;font-size:24px;color:#64748B">↑</div>
          <div style="font-size:11px;color:#64748B;margin-top:4px">Long</div>
        </div>
        <div style="text-align:center;padding:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;min-width:80px">
          <div style="font-family:'Space Mono',monospace;font-size:24px;color:${COLOR}">↓</div>
          <div style="font-size:11px;color:#64748B;margin-top:4px">Court</div>
        </div>
        <div style="text-align:center;padding:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;min-width:80px">
          <div style="font-family:'Space Mono',monospace;font-size:24px;color:#64748B">↑</div>
          <div style="font-size:11px;color:#64748B;margin-top:4px">Long</div>
        </div>
      </div>
      <div id="metro-blues"></div>
      <div class="btn-row mt-4">
        <button class="btn btn-primary" id="blues-done">J'ai le feel blues ! 🔥</button>
      </div>`;

    Metronome.render('metro-blues', { bpm: 90, pattern: ['↓', '↑', '↓', '↑'] });

    document.getElementById('blues-done').addEventListener('click', () => {
      App.completeLevel(WORLD, 5, LEVELS[4].badge.name, LEVELS[4].badge.emoji, LEVELS[4].xp);
    });
  }

  /* ---- NIVEAU 6: Morceaux ---- */
  function renderLevel6(container) {
    let completed = new Set();

    container.innerHTML = `
      <div class="section-title">4 sections de "I Lost My Baby"</div>
      <p style="font-size:14px;color:#94A3B8;margin-bottom:16px">Joue chaque section avec ta guitare, puis clique pour la valider.</p>
      <div class="song-sections">
        ${SONG_SECTIONS.map((s, i) => `
          <div class="song-section" data-idx="${i}">
            <div class="song-section-header">
              <span class="section-label">${s.label}</span>
              <span id="section-check-${i}">○</span>
            </div>
            <div class="section-chords-strip">
              ${s.chords.map(c => `<div class="chord-pill" style="color:${COLOR};border-color:rgba(245,158,11,0.4);background:rgba(245,158,11,0.08)">${c}</div>`).join('')}
            </div>
            <div class="lyrics-line">"${s.lyrics}"</div>
          </div>`).join('')}
      </div>
      <div class="btn-row">
        <button class="btn btn-primary hidden" id="loup6-done">Toutes les sections ✓</button>
      </div>`;

    container.querySelectorAll('.song-section').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.idx);
        completed.add(idx);
        document.getElementById(`section-check-${idx}`).textContent = '✓';
        document.getElementById(`section-check-${idx}`).style.color = '#22C55E';
        el.style.borderColor = 'rgba(34,197,94,0.4)';
        if (completed.size >= SONG_SECTIONS.length) {
          document.getElementById('loup6-done').classList.remove('hidden');
        }
      });
    });

    document.getElementById('loup6-done').addEventListener('click', () => {
      App.completeLevel(WORLD, 6, LEVELS[5].badge.name, LEVELS[5].badge.emoji, LEVELS[5].xp);
    });
  }

  /* ---- NIVEAU 7: Boss ---- */
  function renderLevel7(container) {
    let idx = 0;

    container.innerHTML = `
      <div class="section-title">Mode performance — joue du début à la fin !</div>
      <div class="karaoke-display">
        <div class="karaoke-chord-now" id="k-chord" style="color:${COLOR}">E</div>
        <div class="karaoke-lyric" id="k-lyric">Prêt ? C'est ton moment de briller !</div>
        <div class="karaoke-next" id="k-next">Prochain: A</div>
        <div class="progress-bar-song"><div class="progress-bar-fill" id="k-prog" style="width:0%;background:linear-gradient(90deg,${COLOR},#EF4444)"></div></div>
      </div>
      <div class="btn-row">
        <button class="btn btn-primary" id="loup-boss-start" style="background:linear-gradient(135deg,${COLOR},#EF4444)">⚡ Démarrer</button>
      </div>
      <div id="loup-eval-zone" class="hidden">
        <div class="section-title mt-4">Comment tu t'en es sorti ?</div>
        <div class="self-eval">
          <button class="eval-btn" data-val="debutant">🎸<span>Débutant</span></button>
          <button class="eval-btn" data-val="rockeur">🔥<span>Rockeur</span></button>
          <button class="eval-btn" data-val="legende">⚡<span>Légende</span></button>
        </div>
      </div>`;

    document.getElementById('loup-boss-start').addEventListener('click', () => {
      document.getElementById('loup-boss-start').classList.add('hidden');
      idx = 0;
      showBeat();
    });

    function showBeat() {
      if (idx >= KARAOKE.length) {
        document.getElementById('k-chord').textContent = '⚡';
        document.getElementById('k-lyric').textContent = 'LÉGENDE DU DÉSERT !';
        document.getElementById('k-next').textContent = '';
        document.getElementById('k-prog').style.width = '100%';
        document.getElementById('loup-eval-zone').classList.remove('hidden');
        return;
      }
      const beat = KARAOKE[idx];
      document.getElementById('k-chord').textContent = beat.chord;
      document.getElementById('k-lyric').textContent = beat.lyric;
      const next = KARAOKE[idx + 1];
      document.getElementById('k-next').textContent = next ? `Prochain: ${next.chord}` : '⚡ Finale !';
      document.getElementById('k-prog').style.width = Math.round((idx / KARAOKE.length) * 100) + '%';
      idx++;
      setTimeout(showBeat, beat.dur);
    }

    container.querySelectorAll('.eval-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Rewards.bossComplete('"I Lost My Baby" de Jean Leloup', '🏜️', () => {
          App.completeLevel(WORLD, 7, LEVELS[6].badge.name, LEVELS[6].badge.emoji, LEVELS[6].xp);
        });
      });
    });
  }

  return { WORLD, LEVELS, renderLevel, COLOR };
})();
