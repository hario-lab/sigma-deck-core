let AC = null;

function getAC() {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  if (AC.state === 'suspended') AC.resume();
  return AC;
}

function tone(ac, n, f1, f2, dur, wave, vol) {
  const o = ac.createOscillator(), g = ac.createGain();
  o.connect(g); g.connect(ac.destination);
  o.type = wave || 'sine';
  o.frequency.setValueAtTime(f1, n);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, n + dur);
  g.gain.setValueAtTime(vol || .06, n);
  g.gain.exponentialRampToValueAtTime(.001, n + dur);
  o.start(n); o.stop(n + dur + .01);
}

function delay(ac, n, ms, f1, f2, dur, wave, vol) {
  setTimeout(() => {
    try { const ac2 = getAC(), n2 = ac2.currentTime; tone(ac2, n2, f1, f2, dur, wave, vol); } catch (e) {}
  }, ms);
}

function noise(ac, n, dur) {
  const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * .3;
  const src = ac.createBufferSource(), g = ac.createGain();
  src.buffer = buf; src.connect(g); g.connect(ac.destination);
  g.gain.setValueAtTime(.3, n); g.gain.exponentialRampToValueAtTime(.001, n + dur);
  src.start(n); src.stop(n + dur + .01);
}

const SOUND_THEMES = {
  digital: {
    check:   (ac, n) => { tone(ac, n, 1100, 800, .06, 'square', .06); },
    tap:     (ac, n) => { tone(ac, n, 750, 550, .07, 'sine', .05); },
    back:    (ac, n) => { tone(ac, n, 700, 350, .13, 'sine', .05); },
    flip:    (ac, n) => { tone(ac, n, 900, 650, .08, 'sine', .06); delay(ac, n, 65, 600, 600, .06, 'sine', .05); },
    execute: (ac, n) => { [0, 70, 140].forEach((d, i) => { delay(ac, n, d, [600, 800, 1100][i], null, .1, 'sine', .07); }); }
  },
  mechanical: {
    check:   (ac, n) => { noise(ac, n, .04); tone(ac, n, 3000, 1000, .02, 'square', .04); },
    tap:     (ac, n) => { noise(ac, n, .035); tone(ac, n, 2000, 800, .025, 'square', .03); },
    back:    (ac, n) => { noise(ac, n, .06); tone(ac, n, 1500, 500, .04, 'square', .03); },
    flip:    (ac, n) => { noise(ac, n, .05); tone(ac, n, 2500, 900, .03, 'square', .04); delay(ac, n, 40, 2000, 700, .03, 'square', .03); },
    execute: (ac, n) => { [0, 50, 100].forEach(d => { setTimeout(() => { try { const ac2 = getAC(), n2 = ac2.currentTime; noise(ac2, n2, .04); tone(ac2, n2, 2500, 1000, .03, 'square', .04); } catch(e) {} }, d); }); }
  },
  dark: {
    check:   (ac, n) => { tone(ac, n, 120, 80, .18, 'sine', .12); },
    tap:     (ac, n) => { tone(ac, n, 100, 60, .2, 'sine', .1); },
    back:    (ac, n) => { tone(ac, n, 140, 40, .35, 'sine', .12); },
    flip:    (ac, n) => { tone(ac, n, 200, 60, .25, 'sine', .1); delay(ac, n, 100, 80, 40, .2, 'sine', .08); },
    execute: (ac, n) => { tone(ac, n, 60, 40, .5, 'sine', .14); delay(ac, n, 200, 80, 50, .4, 'sine', .1); delay(ac, n, 400, 100, 60, .3, 'sine', .08); }
  },
  ghost: {
    check:   (ac, n) => { tone(ac, n, 2400, 1800, .15, 'sine', .04); },
    tap:     (ac, n) => { tone(ac, n, 2000, 1400, .2, 'sine', .04); },
    back:    (ac, n) => { tone(ac, n, 1600, 800, .3, 'sine', .04); },
    flip:    (ac, n) => { tone(ac, n, 2800, 1200, .25, 'sine', .04); delay(ac, n, 120, 2000, 900, .2, 'sine', .03); },
    execute: (ac, n) => { [0, 100, 200].forEach((d, i) => { delay(ac, n, d, [1800, 2200, 2800][i], [1200, 1600, 2000][i], .25, 'sine', .04); }); }
  },
  glitch: {
    check:   (ac, n) => { const f = 200 + Math.random() * 2000; tone(ac, n, f, f * 0.3, .05, 'sawtooth', .07); },
    tap:     (ac, n) => { const f = 150 + Math.random() * 1500; tone(ac, n, f, f * 0.4, .07, 'sawtooth', .06); },
    back:    (ac, n) => { const f = 100 + Math.random() * 800; tone(ac, n, f, 30, .12, 'sawtooth', .07); },
    flip:    (ac, n) => { [0, 30, 70].forEach(d => { setTimeout(() => { try { const ac2 = getAC(), n2 = ac2.currentTime, f2 = 200 + Math.random() * 1800; tone(ac2, n2, f2, f2 * 0.2, .05, 'sawtooth', .05); } catch(e) {} }, d); }); },
    execute: (ac, n) => { [0, 60, 120, 180].forEach(d => { setTimeout(() => { try { const ac2 = getAC(), n2 = ac2.currentTime, f2 = 100 + Math.random() * 2000; tone(ac2, n2, f2, f2 * 0.3, .08, 'sawtooth', .07); } catch(e) {} }, d); }); }
  },
  silent: {
    check: () => {}, tap: () => {}, back: () => {}, flip: () => {}, execute: () => {}
  }
};

export function sfx(type, theme) {
  const t = theme || localStorage.getItem('soundTheme') || 'digital';
  if (t === 'silent') return;
  try {
    const ac = getAC(), n = ac.currentTime;
    const themeObj = SOUND_THEMES[t] || SOUND_THEMES.digital;
    if (themeObj[type]) themeObj[type](ac, n);
  } catch (e) {}
}

export { SOUND_THEMES };
