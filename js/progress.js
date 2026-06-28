/* =========================================
   PROGRESS SYSTEM — localStorage
   ========================================= */

const LEVELS_CONFIG = [
  { name: 'Newbie',      min: 0,    max: 300  },
  { name: 'Strummer',   min: 300,  max: 800  },
  { name: 'Guitariste', min: 800,  max: 1600 },
  { name: 'Rockeur',    min: 1600, max: 2800 },
  { name: 'Légende',    min: 2800, max: 9999 },
];

const DEFAULT_STATE = {
  totalXP: 0,
  level: 0,
  streak: { count: 0, lastPlayed: null },
  combo: 0,
  worlds: {
    fredz:  { unlockedLevels: [1], completedLevels: [], badges: [] },
    leloup: { unlockedLevels: [1], completedLevels: [], badges: [] },
  },
};

const Progress = (() => {
  const KEY = 'guitarquest_v1';

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return Object.assign({}, DEFAULT_STATE, JSON.parse(raw));
    } catch (_) {}
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function get() { return load(); }

  function getLevelInfo(xp) {
    for (let i = LEVELS_CONFIG.length - 1; i >= 0; i--) {
      if (xp >= LEVELS_CONFIG[i].min) return { index: i, ...LEVELS_CONFIG[i] };
    }
    return { index: 0, ...LEVELS_CONFIG[0] };
  }

  function getXPPercent(xp) {
    const lvl = getLevelInfo(xp);
    const range = lvl.max - lvl.min;
    return Math.min(100, Math.round(((xp - lvl.min) / range) * 100));
  }

  function addXP(amount) {
    const state = load();
    const before = getLevelInfo(state.totalXP);

    // Streak bonus
    let bonus = 1;
    if (state.streak.count >= 7) bonus = 2;
    else if (state.streak.count >= 3) bonus = 1.5;
    const earned = Math.round(amount * bonus);

    state.totalXP += earned;
    const after = getLevelInfo(state.totalXP);
    state.level = after.index;

    save(state);
    return { earned, leveledUp: after.index > before.index, newLevel: after.name, totalXP: state.totalXP };
  }

  function completeLevel(world, levelNum, badgeName, badgeEmoji) {
    const state = load();
    const w = state.worlds[world];
    if (!w.completedLevels.includes(levelNum)) {
      w.completedLevels.push(levelNum);
    }
    const nextLevel = levelNum + 1;
    if (!w.unlockedLevels.includes(nextLevel) && nextLevel <= 7) {
      w.unlockedLevels.push(nextLevel);
    }
    if (badgeName && !w.badges.find(b => b.name === badgeName)) {
      w.badges.push({ name: badgeName, emoji: badgeEmoji, earned: Date.now() });
    }
    save(state);
  }

  function updateStreak() {
    const state = load();
    const today = new Date().toDateString();
    const lastPlayed = state.streak.lastPlayed;
    if (lastPlayed === today) return state.streak;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastPlayed === yesterday) {
      state.streak.count++;
    } else if (lastPlayed !== today) {
      state.streak.count = 1;
    }
    state.streak.lastPlayed = today;
    save(state);
    return state.streak;
  }

  function incrementCombo() {
    const state = load();
    state.combo = (state.combo || 0) + 1;
    save(state);
    return state.combo;
  }

  function resetCombo() {
    const state = load();
    state.combo = 0;
    save(state);
  }

  function reset() {
    localStorage.removeItem(KEY);
  }

  return { get, addXP, completeLevel, updateStreak, getLevelInfo, getXPPercent, incrementCombo, resetCombo, reset };
})();
