/* =========================================
   GUITAR NECK — Reusable SVG Component
   ========================================= */

const CHORD_DATA = {
  Am: {
    label: 'Am',
    fingers: [
      { string: 2, fret: 1, finger: 2 },
      { string: 3, fret: 2, finger: 3 },
      { string: 4, fret: 2, finger: 4 },
    ],
    open: [1, 5, 6],
    muted: [],
  },
  C: {
    label: 'C',
    fingers: [
      { string: 2, fret: 1, finger: 1 },
      { string: 4, fret: 2, finger: 2 },
      { string: 5, fret: 3, finger: 3 },
    ],
    open: [1, 3],
    muted: [6],
  },
  G: {
    label: 'G',
    fingers: [
      { string: 1, fret: 3, finger: 4 },
      { string: 5, fret: 2, finger: 1 },
      { string: 6, fret: 3, finger: 3 },
    ],
    open: [2, 3, 4],
    muted: [],
  },
  E: {
    label: 'E',
    fingers: [
      { string: 3, fret: 1, finger: 1 },
      { string: 4, fret: 2, finger: 2 },
      { string: 5, fret: 2, finger: 3 },
    ],
    open: [1, 2, 6],
    muted: [],
  },
  A: {
    label: 'A',
    fingers: [
      { string: 2, fret: 2, finger: 1 },
      { string: 3, fret: 2, finger: 2 },
      { string: 4, fret: 2, finger: 3 },
    ],
    open: [1, 5],
    muted: [6],
  },
  B7: {
    label: 'B7',
    fingers: [
      { string: 1, fret: 2, finger: 1 },
      { string: 2, fret: 0, finger: 0 }, // open treated special
      { string: 3, fret: 2, finger: 2 },
      { string: 4, fret: 1, finger: 1 },
      { string: 5, fret: 2, finger: 3 },
    ],
    open: [1],
    muted: [6],
  },
};

// Redefine B7 properly
CHORD_DATA.B7 = {
  label: 'B7',
  fingers: [
    { string: 5, fret: 2, finger: 1 },
    { string: 4, fret: 1, finger: 2 },
    { string: 3, fret: 2, finger: 3 },
    { string: 1, fret: 2, finger: 4 },
  ],
  open: [2],
  muted: [6],
};

const STRING_NAMES = ['Mi↑', 'Si', 'Sol', 'Ré', 'La', 'Mi↓'];
const STRING_FULL  = ['Mi aigu (1)', 'Si (2)', 'Sol (3)', 'Ré (4)', 'La (5)', 'Mi grave (6)'];

const GuitarNeck = (() => {
  const W = 440, H = 220;
  const LEFT = 50, RIGHT = W - 20;
  const TOP = 30, BOT = H - 20;
  const FRETS = 5;
  const STRINGS = 6;
  const fretW = (RIGHT - LEFT) / FRETS;
  const stringH = (BOT - TOP) / (STRINGS - 1);

  function sx(fret) { return LEFT + fret * fretW; }
  function sy(string) { return TOP + (string - 1) * stringH; } // string 1 = high e (top)

  function render(containerId, chordName, opts = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const chord = CHORD_DATA[chordName];
    const interactive = opts.interactive || false;
    const showHelp = opts.showHelp !== false;

    // Build SVG
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'guitar-neck-svg');

    // Nut
    const nut = document.createElementNS(ns, 'rect');
    nut.setAttribute('x', LEFT - 4); nut.setAttribute('y', TOP - 5);
    nut.setAttribute('width', 5); nut.setAttribute('height', (STRINGS - 1) * stringH + 10);
    nut.setAttribute('fill', '#E8E8E8'); nut.setAttribute('rx', '2');
    svg.appendChild(nut);

    // Fret lines
    for (let f = 0; f <= FRETS; f++) {
      const x = sx(f);
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', x); line.setAttribute('y1', TOP);
      line.setAttribute('x2', x); line.setAttribute('y2', BOT);
      line.setAttribute('stroke', f === 0 ? '#888' : '#444');
      line.setAttribute('stroke-width', f === 0 ? '3' : '1.5');
      svg.appendChild(line);

      // Fret number
      if (f > 0) {
        const txt = document.createElementNS(ns, 'text');
        txt.setAttribute('x', sx(f - 0.5));
        txt.setAttribute('y', BOT + 15);
        txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('fill', '#555');
        txt.setAttribute('font-size', '11');
        txt.setAttribute('font-family', 'Space Mono, monospace');
        txt.textContent = f;
        svg.appendChild(txt);
      }
    }

    // String lines
    for (let s = 1; s <= STRINGS; s++) {
      const y = sy(s);
      const thickness = 1 + (s - 1) * 0.4;
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', LEFT - 4); line.setAttribute('y1', y);
      line.setAttribute('x2', RIGHT); line.setAttribute('y2', y);
      line.setAttribute('stroke', '#9CA3AF');
      line.setAttribute('stroke-width', thickness);
      svg.appendChild(line);

      // String label
      const txt = document.createElementNS(ns, 'text');
      txt.setAttribute('x', LEFT - 8);
      txt.setAttribute('y', y + 4);
      txt.setAttribute('text-anchor', 'end');
      txt.setAttribute('fill', '#666');
      txt.setAttribute('font-size', '10');
      txt.setAttribute('font-family', 'Space Mono, monospace');
      txt.textContent = STRING_NAMES[s - 1];
      svg.appendChild(txt);
    }

    // Open / Muted indicators
    if (chord) {
      (chord.open || []).forEach(s => {
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', LEFT - 16); circle.setAttribute('cy', sy(s));
        circle.setAttribute('r', '7'); circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', '#22C55E'); circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);
      });
      (chord.muted || []).forEach(s => {
        const g = document.createElementNS(ns, 'g');
        const cx = LEFT - 16, cy = sy(s);
        ['M-5,-5 L5,5', 'M5,-5 L-5,5'].forEach(d => {
          const path = document.createElementNS(ns, 'path');
          path.setAttribute('d', `M${cx-5},${cy-5} L${cx+5},${cy+5}`);
          path.setAttribute('stroke', '#EF4444'); path.setAttribute('stroke-width', '2');
          path.setAttribute('stroke-linecap', 'round');
          svg.appendChild(path);
        });
        const path2 = document.createElementNS(ns, 'path');
        path2.setAttribute('d', `M${cx+5},${cy-5} L${cx-5},${cy+5}`);
        path2.setAttribute('stroke', '#EF4444'); path2.setAttribute('stroke-width', '2');
        path2.setAttribute('stroke-linecap', 'round');
        svg.appendChild(path2);
      });
    }

    // Finger dots
    if (chord) {
      chord.fingers.forEach(({ string: s, fret: f, finger }) => {
        if (f === 0) return;
        const cx = sx(f - 0.5);
        const cy = sy(s);
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', cx); circle.setAttribute('cy', cy);
        circle.setAttribute('r', '12');
        circle.setAttribute('fill', opts.color || '#7C3AED');
        circle.setAttribute('class', 'finger-dot');
        if (showHelp) {
          circle.style.filter = opts.animated ? 'none' : 'none';
        }
        svg.appendChild(circle);

        const txt = document.createElementNS(ns, 'text');
        txt.setAttribute('x', cx); txt.setAttribute('y', cy + 4);
        txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('fill', 'white');
        txt.setAttribute('font-size', '12');
        txt.setAttribute('font-weight', 'bold');
        txt.setAttribute('font-family', 'Inter, sans-serif');
        txt.textContent = finger;
        svg.appendChild(txt);
      });
    }

    // Chord name
    const title = document.createElementNS(ns, 'text');
    title.setAttribute('x', W - 10); title.setAttribute('y', TOP + 5);
    title.setAttribute('text-anchor', 'end');
    title.setAttribute('fill', opts.color || '#7C3AED');
    title.setAttribute('font-size', '22');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('font-family', 'Bebas Neue, sans-serif');
    title.setAttribute('letter-spacing', '2');
    title.textContent = chordName;
    svg.appendChild(title);

    container.innerHTML = '';
    container.appendChild(svg);
  }

  // Interactive placement mode — player clicks to place fingers
  function renderInteractive(containerId, chordName, opts = {}, onComplete) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const chord = CHORD_DATA[chordName];
    if (!chord) return render(containerId, chordName, opts);

    const placed = new Set();
    const target = chord.fingers.map(f => `${f.string}-${f.fret}`);

    render(containerId, chordName, { ...opts, showFingers: false });
    const svg = container.querySelector('svg');

    // Add invisible clickable zones
    const ns = 'http://www.w3.org/2000/svg';
    for (let s = 1; s <= STRINGS; s++) {
      for (let f = 1; f <= FRETS; f++) {
        const cx = sx(f - 0.5), cy = sy(s);
        const zone = document.createElementNS(ns, 'circle');
        zone.setAttribute('cx', cx); zone.setAttribute('cy', cy);
        zone.setAttribute('r', '16');
        zone.setAttribute('fill', 'rgba(255,255,255,0.04)');
        zone.setAttribute('stroke', 'rgba(255,255,255,0.08)');
        zone.setAttribute('cursor', 'pointer');
        zone.setAttribute('class', 'neck-dot');
        zone.dataset.string = s; zone.dataset.fret = f;

        zone.addEventListener('click', () => {
          const key = `${s}-${f}`;
          if (placed.has(key)) {
            placed.delete(key);
            zone.setAttribute('fill', 'rgba(255,255,255,0.04)');
            zone.setAttribute('stroke', 'rgba(255,255,255,0.08)');
          } else {
            const isCorrect = target.includes(key);
            placed.add(key);
            zone.setAttribute('fill', isCorrect ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)');
            zone.setAttribute('stroke', isCorrect ? '#22C55E' : '#EF4444');

            const allCorrect = target.every(t => placed.has(t));
            const noWrong = [...placed].every(k => target.includes(k));
            if (allCorrect && noWrong && onComplete) {
              setTimeout(() => onComplete(), 400);
            }
          }
        });
        svg.appendChild(zone);
      }
    }
  }

  // Animated reveal
  function animateChord(containerId, chordName, opts = {}) {
    const chord = CHORD_DATA[chordName];
    if (!chord) return;
    render(containerId, chordName, { ...opts, showFingers: false });
    const container = document.getElementById(containerId);
    const svg = container.querySelector('svg');
    if (!svg) return;

    const ns = 'http://www.w3.org/2000/svg';
    chord.fingers.forEach(({ string: s, fret: f, finger }, i) => {
      if (f === 0) return;
      const cx = sx(f - 0.5), cy = sy(s);
      setTimeout(() => {
        const g = document.createElementNS(ns, 'g');
        g.style.transformOrigin = `${cx}px ${cy}px`;
        g.style.animation = 'none';

        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', cx); circle.setAttribute('cy', cy);
        circle.setAttribute('r', '12');
        circle.setAttribute('fill', opts.color || '#7C3AED');
        circle.setAttribute('class', 'finger-dot');

        const txt = document.createElementNS(ns, 'text');
        txt.setAttribute('x', cx); txt.setAttribute('y', cy + 4);
        txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('fill', 'white');
        txt.setAttribute('font-size', '12');
        txt.setAttribute('font-weight', 'bold');
        txt.setAttribute('font-family', 'Inter, sans-serif');
        txt.textContent = finger;

        g.appendChild(circle);
        g.appendChild(txt);
        svg.appendChild(g);

        g.style.transform = 'scale(0)';
        requestAnimationFrame(() => {
          g.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
          g.style.transform = 'scale(1)';
        });
      }, i * 200);
    });
  }

  return { render, renderInteractive, animateChord, CHORD_DATA, STRING_NAMES, STRING_FULL };
})();
