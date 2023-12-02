'use strict';
/* =====================================================================
   Interfaz
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FONT_MONO = '"JetBrains Mono", ui-monospace, Consolas, monospace';
const FONT_UI = '"Hanken Grotesk", "Segoe UI", system-ui, sans-serif';
/* Paleta fija de la pantalla del instrumento (mismo mundo visual que los epiciclos de las herramientas) */
/* Pantalla del Laboratorio: clara en el tema claro, oscura en el oscuro */
const PANTALLA = {
  claro: {
    bg: '#ffffff', panel: '#f5f7f6', grid: 'rgba(20,23,22,0.07)', axis: 'rgba(20,23,22,0.35)',
    ref: 'rgba(20,23,22,0.45)', circle: 'rgba(89,97,92,0.42)', arm: 'rgba(20,23,22,0.85)', joint: 'rgba(20,23,22,0.6)',
    trace: '#1f7a4d', glow: 'rgba(0,0,0,0)', hi: '#2d6f9a', dc: '#b85c2c', text: '#2a2f2c', muted: '#6b736d',
    pen: '#141716', guide: 'rgba(20,23,22,0.4)', off: 'rgba(20,23,22,0.22)', row: 'rgba(20,23,22,0.07)',
  },
  oscuro: {
    bg: '#0b0d0e', panel: '#101314', grid: 'rgba(160,200,180,0.08)', axis: 'rgba(170,200,185,0.4)',
    ref: 'rgba(170,200,185,0.55)', circle: 'rgba(170,190,180,0.32)', arm: 'rgba(230,236,232,0.88)', joint: 'rgba(230,236,232,0.7)',
    trace: '#7fd1a0', glow: 'rgba(0,0,0,0)', hi: '#7cc4e8', dc: '#e8a07a', text: '#cfd6d1', muted: '#7f8a84',
    pen: '#ffffff', guide: 'rgba(230,236,232,0.5)', off: 'rgba(160,200,180,0.32)', row: 'rgba(160,200,180,0.14)',
  },
};
const temaOscuro = () => (document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';
let ST = temaOscuro() ? PANTALLA.oscuro : PANTALLA.claro;
const store = {
  get(k, d) { try { const v = localStorage.getItem('fourier:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('fourier:' + k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } },
};

/* ---------- números en castellano ---------- */
const nfCache = new Map();
function nf(v, d = 3) {
  if (!Number.isFinite(v)) return '—';
  if (Math.abs(v) < 0.5 * 10 ** -d) v = 0;
  let f = nfCache.get(d);
  if (!f) { f = new Intl.NumberFormat('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d }); nfCache.set(d, f); }
  return f.format(v).replace('-', '−');
}
const SUPS = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const supr = s => String(s).split('').map(ch => SUPS[ch] ?? ch).join('');
function sig(v, s = 4) {
  if (!Number.isFinite(v)) return '—';
  if (v === 0) return '0';
  const a = Math.abs(v), e = Math.floor(Math.log10(a));
  if (e < -3 || e >= 6) return nf(v / 10 ** e, s - 1) + '·10' + supr(e);
  return nf(v, clamp(s - 1 - e, 0, 9));
}
const PREF = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n']];
function si(v, unit, s = 4) {
  if (!Number.isFinite(v)) return '—';
  if (Math.abs(v) < 1e-15) return '0 ' + unit;
  const a = Math.abs(v);
  for (const [f, p] of PREF) if (a >= f * 0.99995) return sig(v / f, s) + ' ' + p + unit;
  return sig(v, s) + ' ' + unit;
}
/* Para valores que escribe el usuario (1 V, 50 Hz, 20 ms): sin ceros de relleno */
const siT = (v, unit) => si(v, unit, 4).replace(/(,\d*?)0+(?= )/, '$1').replace(/,(?= )/, '');
/* V² no admite prefijos SI (0,5 V² no son 500 mV²) */
const v2 = (v, s = 3) => sig(v, s) + ' V²';
function pc(v, d) {
  if (!Number.isFinite(v)) return '—';
  const x = 100 * v, ax = Math.abs(x);
  if (ax < 5e-7) return '0 %';
  return nf(x, d ?? (ax >= 10 ? 1 : ax >= 1 ? 2 : ax >= 0.01 ? 3 : 4)) + ' %';
}
const wrapDeg = r => { let d = r * 180 / PI; d = ((d + 180) % 360 + 360) % 360 - 180; return d <= -179.9999 ? 180 : d; };
const deg = r => nf(wrapDeg(r), 1) + '°';
const joinY = arr => arr.length <= 1 ? String(arr[0] ?? '') : arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1];
const tnum = (v, d = 3) => nf(v, d).replace('−', '-').replace(/\./g, '').replace(',', '{,}');
const sub = n => String(n).split('').map(ch => ({ '-': '₋', 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' })[ch] ?? ch).join('');

/* ---------- configuración ---------- */
const DEFAULTS = { wave: 'cuadrada', N: 3, dc: false, speed: 3, zoom: 1.5, showConn: true, showRef: true, showCircles: true, showGrid: true, amp: 1, f0: 50, R: 1, specMode: 'amp', specScale: 'lin', gLanczos: true, gFejer: false, tab: 'lab' };
const cfg = Object.assign({}, DEFAULTS, store.get('cfg', {}));
if (!WAVES[cfg.wave]) cfg.wave = DEFAULTS.wave;
cfg.N = clamp(Math.round(+cfg.N) || DEFAULTS.N, 1, KMAX);
cfg.speed = clamp(Math.round(+cfg.speed) || DEFAULTS.speed, 1, 10);
cfg.zoom = clamp(+cfg.zoom || DEFAULTS.zoom, 1, 5);
for (const k of ['amp', 'f0', 'R']) if (!(+cfg[k] > 0)) cfg[k] = DEFAULTS[k];
if (!['amp', 'fase', 'pot', 'bil'].includes(cfg.specMode)) cfg.specMode = 'amp';
if (!['lin', 'db'].includes(cfg.specScale)) cfg.specScale = 'lin';
cfg.dc = !!cfg.dc && cfg.wave !== 'rectificada';
const saveCfg = () => store.set('cfg', cfg);

/* ---------- estado del Laboratorio ---------- */
const DT0 = 0.025;         // paso de las muestras del trazo en la versión Python
const HIST_T = 10;         // radianes de trazo guardados: las 400 muestras × 0,025 de la versión Python
const WIN = 4 * PI;        // ancho de la ventana de la onda
const RATE = 0.625;        // rad/s por punto de velocidad: 3 ≈ 3,4 s por período
const lab = { t: 0, hist: [], xmin: 0, playing: !REDUCE, last: null, hi: -1, L: null, dpr: 1, M: null, terms: [], off: 0, dt: DT0, dirty: true, lastText: 0 };
function labSync() {
  lab.M = model(cfg); lab.terms = lab.M.terms; lab.off = lab.M.I.off;
  // El paso fijo de 0,025 rad alcanza hasta la armónica 31. Más arriba se achica para tener al menos
  // 8 muestras por período de la armónica más alta; si no, el trazo mostraría aliasing.
  lab.dt = clamp(PI / (4 * Math.max(1, lab.M.nmax)), 0.0015, DT0);
}
function yAt(t) { let y = lab.off; for (const T of lab.terms) y += T.dc ? T.A : T.A * Math.sin(T.n * t + T.ph); return y; }
function advance(d) {
  const t1 = lab.t + d, dt = lab.dt;
  let next = (Math.floor(lab.t / dt + 1e-9) + 1) * dt;
  while (next <= t1 + 1e-12) { lab.hist.push(next, yAt(next)); next += dt; }
  let cut = 0; const tmin = t1 - HIST_T;
  while (cut < lab.hist.length && lab.hist[cut] < tmin) cut += 2;
  if (cut) lab.hist.splice(0, cut);
  lab.t = t1;
  // desplazamiento automático de la ventana, como en la versión de escritorio
  if (lab.t > lab.xmin + WIN - PI) lab.xmin = lab.t - 3 * PI;
  lab.dirty = true;
}
function resetLab(prefill) { lab.t = 0; lab.hist = []; lab.xmin = 0; if (prefill) advance(prefill); lab.dirty = true; }

/* ---------- pantalla principal: epiciclos + onda ---------- */
const view = $('#view'), vctx = view.getContext('2d');
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
const piLabel = k => k === 0 ? '0' : k === 1 ? 'π' : k === -1 ? '−π' : String(k).replace('-', '−') + 'π';
const tickLabel = v => Number.isInteger(v) ? String(v).replace('-', '−') : nf(v, 1);
function layoutStage() {
  const W = $('#stage').clientWidth;
  if (W < 10) return false;
  const narrow = W < 560;
  const padL = narrow ? 30 : 40, padR = narrow ? 8 : 14, padT = 26, padB = 24, gap = narrow ? 14 : 24;
  const maxH = Math.max(230, Math.min(innerHeight * 0.62, 560));
  const S = Math.max(110, Math.floor(Math.min((W - padL - padR - gap) * (narrow ? 0.45 : 0.4), maxH - padT - padB)));
  const H = padT + S + padB, dpr = Math.min(2, devicePixelRatio || 1);
  if (view.width !== Math.round(W * dpr) || view.height !== Math.round(H * dpr)) { view.width = Math.round(W * dpr); view.height = Math.round(H * dpr); }
  view.style.height = H + 'px';
  lab.dpr = dpr;
  lab.L = { W, H, S, padL, padT, gap, narrow, ex: padL, ey: padT, wx: padL + S + gap, ww: W - padL - S - gap - padR };
  lab.dirty = true;
  return true;
}
function glowDot(c, x, y, r, color, glow) {
  const g = c.createRadialGradient(x, y, 0, x, y, r * 4);
  g.addColorStop(0, glow); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r * 4, 0, TAU); c.fill();
  c.fillStyle = color; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
}
function drawStage() {
  const L = lab.L; if (!L) return;
  const c = vctx, z = cfg.zoom, s = L.S / (2 * z), t = lab.t;
  c.setTransform(lab.dpr, 0, 0, lab.dpr, 0, 0);
  c.globalAlpha = 1; c.setLineDash([]); c.lineCap = 'butt';
  c.fillStyle = ST.bg; c.fillRect(0, 0, L.W, L.H);
  const cy = L.ey + L.S / 2, ecx = L.ex + L.S / 2, x0 = lab.xmin;
  const Y = v => cy - v * s, EX = v => ecx + v * s, TX = tt => L.wx + (tt - x0) / WIN * L.ww;
  c.fillStyle = ST.panel;
  rr(c, L.ex, L.ey, L.S, L.S, 8); c.fill();
  rr(c, L.wx, L.ey, L.ww, L.S, 8); c.fill();
  // retícula de osciloscopio
  const step = z <= 1.6 ? 0.5 : 1, ticks = [];
  for (let v = -Math.floor(z / step + 1e-9) * step; v <= z + 1e-9; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
  if (cfg.showGrid) {
    c.strokeStyle = ST.grid; c.lineWidth = 1; c.beginPath();
    for (const v of ticks) {
      if (Math.abs(v) < 1e-9) continue;
      const yy = Math.round(Y(v)) + 0.5, xx = Math.round(EX(v)) + 0.5;
      c.moveTo(L.ex, yy); c.lineTo(L.ex + L.S, yy); c.moveTo(L.wx, yy); c.lineTo(L.wx + L.ww, yy);
      c.moveTo(xx, L.ey); c.lineTo(xx, L.ey + L.S);
    }
    const xxc = Math.round(EX(0)) + 0.5; c.moveTo(xxc, L.ey); c.lineTo(xxc, L.ey + L.S);
    for (let k = Math.ceil(x0 / (PI / 2)); k * PI / 2 <= x0 + WIN + 1e-9; k++) { const xx = Math.round(TX(k * PI / 2)) + 0.5; c.moveTo(xx, L.ey); c.lineTo(xx, L.ey + L.S); }
    c.stroke();
  }
  // eje y = 0 en los dos paneles (línea gruesa, como en la versión de escritorio)
  c.strokeStyle = ST.axis; c.lineWidth = 1.5; c.beginPath();
  const y0 = Math.round(Y(0)) + 0.5;
  c.moveTo(L.ex, y0); c.lineTo(L.ex + L.S, y0); c.moveTo(L.wx, y0); c.lineTo(L.wx + L.ww, y0); c.stroke();
  // rótulos
  c.font = `500 ${L.narrow ? 9.5 : 10.5}px ${FONT_MONO}`; c.fillStyle = ST.muted;
  c.textAlign = 'right'; c.textBaseline = 'middle';
  const every = step * s < 15 ? 2 : 1;
  ticks.forEach((v, i) => { if (i % every && Math.abs(v) > 1e-9) return; c.fillText(tickLabel(v), L.ex - 6, Y(v)); });
  c.textAlign = 'center'; c.textBaseline = 'top';
  for (let k = Math.ceil(x0 / PI - 1e-9); k * PI <= x0 + WIN + 1e-9; k++) { const xx = TX(k * PI); if (xx < L.wx + 6 || xx > L.wx + L.ww - 4) continue; c.fillText(piLabel(k), xx, L.ey + L.S + 7); }
  c.textBaseline = 'alphabetic'; c.textAlign = 'left'; c.font = `600 12px ${FONT_UI}`; c.fillStyle = ST.text;
  c.fillText('Epiciclos', L.ex + 2, L.ey - 9);
  c.fillText('Onda resultante', L.wx + 2, L.ey - 9);
  if (L.ww > 300) { c.textAlign = 'right'; c.font = `500 11px ${FONT_MONO}`; c.fillStyle = ST.muted; c.fillText('t en rad · T = 2π', L.wx + L.ww, L.ey - 9); }

  // onda: ideal punteada, trazo y punto actual
  const y = yAt(t);
  c.save(); rr(c, L.wx, L.ey, L.ww, L.S, 8); c.clip();
  if (cfg.showRef) {
    const W = WAVES[cfg.wave], n = Math.max(2, Math.ceil(L.ww)), path = new Path2D();
    for (let i = 0; i <= n; i++) { const tt = x0 + WIN * i / n, v = W.ideal(tt) + lab.off; i ? path.lineTo(L.wx + L.ww * i / n, Y(v)) : path.moveTo(L.wx, Y(v)); }
    c.strokeStyle = ST.ref; c.lineWidth = 1.4; c.setLineDash([5, 4]); c.stroke(path); c.setLineDash([]);
  }
  const H = lab.hist, tr = new Path2D();
  let started = false;
  for (let i = 0; i < H.length; i += 2) { if (H[i] < x0 - lab.dt) continue; const px = TX(H[i]), py = Y(H[i + 1]); if (started) tr.lineTo(px, py); else { tr.moveTo(px, py); started = true; } }
  if (started) tr.lineTo(TX(t), Y(y)); else tr.moveTo(TX(t), Y(y));
  c.lineJoin = 'round'; c.lineCap = 'round';
  c.strokeStyle = ST.glow; c.lineWidth = 6; c.stroke(tr);
  c.strokeStyle = ST.trace; c.lineWidth = 2.2; c.stroke(tr);
  c.restore();

  // epiciclos
  c.save(); rr(c, L.ex, L.ey, L.S, L.S, 8); c.clip();
  let x = 0, yy = 0;
  if (lab.off) {
    c.strokeStyle = ST.dc; c.globalAlpha = 0.85; c.lineWidth = 1.6; c.setLineDash([5, 4]);
    c.beginPath(); c.arc(EX(0), Y(0), lab.off * s, 0, TAU); c.stroke(); c.setLineDash([]);
    c.lineWidth = 2.6; c.beginPath(); c.moveTo(EX(0), Y(0)); c.lineTo(EX(0), Y(lab.off)); c.stroke();
    c.fillStyle = ST.dc; c.fillRect(EX(0) - 4, Y(lab.off) - 4, 8, 8); c.globalAlpha = 1;
    yy = lab.off;
  }
  const segs = [];
  for (const T of lab.terms) {
    let nx, ny;
    if (T.dc) { nx = x; ny = yy + T.A; } else { const a = T.n * t + T.ph; nx = x + T.A * Math.cos(a); ny = yy + T.A * Math.sin(a); }
    segs.push([x, yy, nx, ny, T]); x = nx; yy = ny;
  }
  const circ = new Path2D(), arms = new Path2D();
  for (const [ax, ay, bx, by, T] of segs) {
    if (T.dc) continue;
    const r = T.A * s;
    if (r > 0.6) { circ.moveTo(EX(ax) + r, Y(ay)); circ.arc(EX(ax), Y(ay), r, 0, TAU); }
    arms.moveTo(EX(ax), Y(ay)); arms.lineTo(EX(bx), Y(by));
  }
  if (cfg.showCircles) { c.strokeStyle = ST.circle; c.lineWidth = 1.2; c.stroke(circ); }
  c.strokeStyle = ST.arm; c.lineWidth = 1.8; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(arms);
  for (const [ax, ay, bx, by, T] of segs) {
    if (!T.dc) continue;   // término de frecuencia cero (rectificada): vector fijo, como la componente continua
    c.strokeStyle = ST.dc; c.globalAlpha = 0.85; c.lineWidth = 1.6; c.setLineDash([5, 4]);
    if (cfg.showCircles) { c.beginPath(); c.arc(EX(ax), Y(ay), T.A * s, 0, TAU); c.stroke(); }
    c.setLineDash([]); c.lineWidth = 2.6; c.beginPath(); c.moveTo(EX(ax), Y(ay)); c.lineTo(EX(bx), Y(by)); c.stroke();
    c.fillStyle = ST.dc; c.fillRect(EX(bx) - 4, Y(by) - 4, 8, 8); c.globalAlpha = 1;
  }
  c.fillStyle = ST.joint;
  for (let i = 0; i < segs.length - 1; i++) { if (segs[i][4].dc) continue; c.beginPath(); c.arc(EX(segs[i][2]), Y(segs[i][3]), 2, 0, TAU); c.fill(); }
  if (lab.hi >= 0 && segs[lab.hi]) {
    const [ax, ay, bx, by, T] = segs[lab.hi];
    c.strokeStyle = ST.hi; c.lineWidth = 2.4;
    c.beginPath(); c.arc(EX(ax), Y(ay), T.A * s, 0, TAU); c.stroke();
    c.lineWidth = 3; c.beginPath(); c.moveTo(EX(ax), Y(ay)); c.lineTo(EX(bx), Y(by)); c.stroke();
  }
  c.restore();
  // línea conectora y puntos
  const tipX = EX(x), tipY = Y(yy), wX = TX(t);
  if (cfg.showConn) { c.strokeStyle = ST.guide; c.lineWidth = 1.3; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(tipX, tipY); c.lineTo(wX, tipY); c.stroke(); c.setLineDash([]); }
  if (tipX >= L.ex - 6 && tipX <= L.ex + L.S + 6 && tipY >= L.ey - 6 && tipY <= L.ey + L.S + 6) glowDot(c, tipX, tipY, 3.8, ST.pen, 'rgba(0,0,0,0)');
  if (tipY >= L.ey - 6 && tipY <= L.ey + L.S + 6) glowDot(c, wX, tipY, 4.2, ST.pen, 'rgba(0,0,0,0)');
}

/* ---------- pantallas auxiliares del Laboratorio ---------- */
function prep(cv) {
  const r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
  const w = Math.max(10, r.width), h = Math.max(10, r.height), W = Math.round(w * dpr), H = Math.round(h * dpr);
  if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
  const ctx = cv.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h); ctx.setLineDash([]); ctx.globalAlpha = 1;
  return { ctx, w, h, dpr };
}
function niceTicks(lo, hi, count = 5) {
  const span = hi - lo; if (!(span > 0)) return [lo];
  const raw = span / count, mag = 10 ** Math.floor(Math.log10(raw)), e = raw / mag;
  const st = (e >= 7.5 ? 10 : e >= 3.5 ? 5 : e >= 1.5 ? 2 : 1) * mag, out = [];
  for (let v = Math.ceil(lo / st - 1e-9) * st; v <= hi + st * 1e-9; v += st) out.push(Math.abs(v) < st * 1e-9 ? 0 : v);
  return out;
}
const labSpec = { items: [], X: null };
function drawLabSpec() {
  const cv = $('#labSpec'), { ctx, w, h } = prep(cv), I = lab.M.I, N = lab.M.N;
  ctx.fillStyle = ST.bg; ctx.fillRect(0, 0, w, h);
  const K = Math.min(KMAX, Math.max(N + 3, 6)), items = [];
  if (lab.off) items.push({ n: 0, A: lab.off, dc: true, used: true, idx: -2 });
  for (let i = 0; i < K; i++) { const T = I.terms[i]; items.push({ n: T.n, A: T.A, dc: T.dc, used: i < N, idx: i }); }
  const nMax = items[items.length - 1].n, amax = Math.max(...items.map(o => o.A));
  const l = 34, r = w - 10, t = 16, b = h - 22;
  const X = n => l + (n + 0.7) / (nMax + 1.4) * (r - l), Yv = v => b - v / (amax * 1.16) * (b - t);
  ctx.font = `500 10.5px ${FONT_MONO}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'right';
  for (const v of niceTicks(0, amax * 1.1, 4)) { const yy = Math.round(Yv(v)) + 0.5; ctx.strokeStyle = ST.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(l, yy); ctx.lineTo(r, yy); ctx.stroke(); ctx.fillStyle = ST.muted; ctx.fillText(tickLabel(Math.round(v * 100) / 100), l - 6, yy); }
  ctx.strokeStyle = ST.axis; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(l, Math.round(b) + 0.5); ctx.lineTo(r, Math.round(b) + 0.5); ctx.stroke();
  const spacing = (r - l) / (nMax + 1.4) * (items.length > 1 ? (items[items.length - 1].n - items[0].n) / (items.length - 1) : 1);
  const labelAll = spacing >= 38, tickEvery = Math.max(1, Math.ceil(24 / spacing)), mr = clamp(spacing * 0.32, 1.4, 4.5);
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  items.forEach((o, k) => { if (k % tickEvery) return; ctx.fillStyle = ST.muted; ctx.fillText(o.dc ? 'DC' : String(o.n), X(o.n), b + 6); });
  let labeled = 0;
  for (const o of items) {
    const x = X(o.n), y = Yv(o.A), hot = lab.hi >= 0 && o.idx === lab.hi;
    const col = hot ? ST.hi : o.dc ? ST.dc : o.used ? ST.trace : ST.off;
    ctx.strokeStyle = col; ctx.lineWidth = hot ? 3 : spacing < 6 ? 1 : 2; ctx.beginPath(); ctx.moveTo(x, b); ctx.lineTo(x, y); ctx.stroke();
    ctx.fillStyle = col; ctx.strokeStyle = ST.bg; ctx.lineWidth = mr > 2.5 ? 2 : 1;
    const r = hot ? Math.max(mr, 3.5) : mr;
    if (o.dc) { ctx.beginPath(); ctx.rect(x - r, y - r, 2 * r, 2 * r); ctx.fill(); ctx.stroke(); }
    else { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke(); }
    if (o.used && (labelAll || labeled < (spacing < 14 ? 1 : 2) || hot)) { ctx.fillStyle = ST.text; ctx.textBaseline = 'bottom'; ctx.fillText(nf(o.A, 3), x, y - 7); labeled++; }
  }
  labSpec.items = items; labSpec.X = X;
  const amp1 = Math.max(...lab.terms.map(T => T.A)), signif = lab.terms.filter(T => T.A > 0.05 * amp1).length;
  $('#labSpecNote').textContent = `${N} ${N === 1 ? 'término sumado' : 'términos sumados'}; ${signif} ${signif === 1 ? 'es significativo' : 'son significativos'} (más del 5 % del mayor). ` + (K > N ? 'En gris, los que todavía no se suman.' : 'Es el máximo de términos.');
}
const comp = { cache: null, key: '', rows: [], X: null, l: 0, r: 0, t: 0, rowH: 0, k: 0 };
function compRows() {
  const terms = lab.terms, amax = Math.max(lab.off, ...terms.map(T => T.A));
  const sigTerms = terms.map((T, i) => ({ T, i })).filter(o => o.T.A >= 0.05 * amax);
  const shown = sigTerms.slice(0, 7), rows = [];
  if (lab.off) rows.push({ kind: 'off', label: 'DC', sub: nf(lab.off, 3), color: ST.dc, val: () => lab.off, idx: -2 });
  for (const { T, i } of shown) rows.push({ kind: 'term', label: T.dc ? 'DC' : 'n = ' + T.n, sub: nf(T.A, 3), color: T.dc ? ST.dc : ST.arm, val: tt => T.dc ? T.A : T.A * Math.sin(T.n * tt + T.ph), idx: i });
  // la suma se dibuja alrededor de su valor medio: así la continua no achica la escala común
  const mean = lab.M.meanN;
  rows.push({ kind: 'sum', label: 'Suma', sub: Math.abs(mean) > 1e-9 ? 'media ' + nf(mean, 2) : 'N = ' + terms.length, color: ST.trace, val: tt => yAt(tt) - mean, idx: -1 });
  return { rows, hidden: terms.length - shown.length };
}
function drawCompStatic() {
  const cv = $('#labComp'), r0 = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
  const w = Math.max(10, r0.width), h = Math.max(10, r0.height);
  const key = [cfg.wave, lab.off, lab.terms.length, w, h, dpr, lab.hi].join('|');
  if (comp.key === key && comp.cache) return;
  comp.key = key;
  const { rows, hidden } = compRows();
  const off = comp.cache || document.createElement('canvas');
  off.width = Math.round(w * dpr); off.height = Math.round(h * dpr);
  const c = off.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.fillStyle = ST.bg; c.fillRect(0, 0, w, h);
  const l = 66, r = w - 8, t = 4, b = h - 20, rowH = (b - t) / rows.length;
  const I = lab.M.I, p = I.perN[lab.terms.length - 1];
  const vmax = Math.max(lab.off, ...lab.terms.map(T => T.A), p.max - p.mean, p.mean - p.min);
  const k = rowH * 0.45 / vmax, X = tt => l + tt / WIN * (r - l);
  c.font = `500 10.5px ${FONT_MONO}`;
  c.strokeStyle = ST.grid; c.lineWidth = 1; c.beginPath();
  for (let j = 1; j < 4; j++) { const xx = Math.round(X(j * PI)) + 0.5; c.moveTo(xx, t); c.lineTo(xx, b); }
  c.stroke();
  rows.forEach((row, j) => {
    const base = t + rowH * (j + 0.5), hot = lab.hi >= 0 && row.idx === lab.hi;
    if (row.kind === 'sum') { c.strokeStyle = ST.row; c.lineWidth = 1; c.beginPath(); c.moveTo(4, Math.round(t + rowH * j) + 0.5); c.lineTo(r, Math.round(t + rowH * j) + 0.5); c.stroke(); }
    c.strokeStyle = ST.row; c.lineWidth = 1; c.beginPath(); c.moveTo(l, Math.round(base) + 0.5); c.lineTo(r, Math.round(base) + 0.5); c.stroke();
    const n = Math.ceil(r - l), path = new Path2D();
    for (let i = 0; i <= n; i++) { const tt = WIN * i / n, yv = base - k * row.val(tt); i ? path.lineTo(l + i, yv) : path.moveTo(l, yv); }
    c.strokeStyle = hot ? ST.hi : row.color; c.lineWidth = hot ? 2.6 : row.kind === 'sum' ? 2.2 : 1.6; c.lineJoin = 'round'; c.stroke(path);
    c.textAlign = 'left'; c.textBaseline = rowH > 30 ? 'bottom' : 'middle';
    c.fillStyle = hot ? ST.hi : ST.text; c.font = `600 11px ${FONT_MONO}`; c.fillText(row.label, 6, rowH > 30 ? base : base);
    if (rowH > 30) { c.textBaseline = 'top'; c.fillStyle = ST.muted; c.font = `500 10.5px ${FONT_MONO}`; c.fillText(row.sub, 6, base + 2); }
  });
  c.fillStyle = ST.muted; c.font = `500 10.5px ${FONT_MONO}`; c.textAlign = 'center'; c.textBaseline = 'top';
  for (let j = 0; j <= 4; j++) c.fillText(piLabel(j), clamp(X(j * PI), l + 6, r - 8), b + 6);
  comp.cache = off; comp.rows = rows; comp.X = X; comp.l = l; comp.r = r; comp.t = t; comp.rowH = rowH; comp.k = k; comp.w = w; comp.h = h; comp.dpr = dpr;
  const note = $('#labCompNote');
  const shownTerms = rows.filter(o => o.kind === 'term').length;
  note.textContent = `Misma escala vertical para todas${Math.abs(lab.M.meanN) > 1e-9 ? '; la suma se dibuja alrededor de su valor medio' : ''}. ` + (hidden > 0 ? `Se ven ${shownTerms} de ${lab.terms.length} términos, los de mayor amplitud; los otros ${hidden} aportan ${pc((lab.M.pacN - shownAC()) / I.Pac, 2)} de la potencia de alterna.` : 'El punto de cada fila es la altura de su vector en este instante.');
}
function shownAC() { let s = 0; for (const row of comp.rows) if (row.kind === 'term') { const T = lab.terms[row.idx]; if (!T.dc) s += T.A * T.A / 2; } return s; }
function drawCompFrame() {
  const cv = $('#labComp');
  drawCompStatic();
  const r = cv.getBoundingClientRect(), dpr = comp.dpr;
  if (cv.width !== Math.round(r.width * dpr) || cv.height !== Math.round(r.height * dpr)) { cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); }
  const c = cv.getContext('2d');
  c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(comp.cache, 0, 0);
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  const tc = ((lab.t % WIN) + WIN) % WIN, x = comp.X(tc);
  c.strokeStyle = ST.guide; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(x, comp.t); c.lineTo(x, comp.t + comp.rowH * comp.rows.length); c.stroke(); c.setLineDash([]);
  comp.rows.forEach((row, j) => {
    const base = comp.t + comp.rowH * (j + 0.5), yv = base - comp.k * row.val(lab.t);
    c.fillStyle = row.kind === 'sum' ? ST.pen : (lab.hi >= 0 && row.idx === lab.hi ? ST.hi : row.color);
    c.strokeStyle = ST.bg; c.lineWidth = 2; c.beginPath(); c.arc(x, yv, row.kind === 'sum' ? 4 : 3.2, 0, TAU); c.fill(); c.stroke();
  });
}
function setHi(i) { if (lab.hi === i) return; lab.hi = i; drawLabSpec(); comp.key = ''; lab.dirty = true; }

/* ---------- textos del Laboratorio ---------- */
function usedText() {
  const terms = lab.terms, ords = terms.filter(T => !T.dc).map(T => T.n), hasDC = terms.some(T => T.dc), w = cfg.wave;
  if (!ords.length) return 'Solo la componente continua 2/π: todavía no hay ninguna senoidal.';
  const kind = w === 'sierra' ? '' : w === 'rectificada' ? ' pares' : ' impares';
  const list = ords.length <= 4 ? `${ords.length === 1 ? 'la armónica' : 'las armónicas'}${kind} n = ${joinY(ords)}` : `${ords.length} armónicas${kind}, de n = ${ords[0]} a n = ${ords[ords.length - 1]}`;
  const why = w === 'sierra' && ords.length >= 5 ? ` Usa todas las armónicas, así que con el mismo N llega a la mitad de frecuencia que la cuadrada (que con ${ords.length} términos llega a n = ${2 * ords.length - 1}).` : '';
  return (hasDC ? 'Suma la componente continua 2/π y ' : 'Suma ') + list + '.' + why;
}
function updateLabText() {
  const M = lab.M, W = WAVES[cfg.wave];
  $('#labTitle').textContent = W.name + (lab.off ? ' con componente continua' : '');
  const ords = M.terms.filter(T => !T.dc).map(T => T.n);
  $('#labSub').textContent = `N = ${M.N} · ${ords.length ? 'armónica más alta n = ' + M.nmax : 'solo continua'}`;
  $('#nHint').textContent = usedText();
  $('#lgDc').hidden = !(lab.off || lab.terms.some(T => T.dc));
  $$('[data-hint="dc"]').forEach(el => {
    el.textContent = cfg.wave === 'rectificada' ? 'La rectificada ya tiene componente continua (2/π, el primer término); el modo DC no se aplica.'
      : cfg.dc ? 'Se suma 1 a la señal: un vector vertical fijo (violeta) antes de los epiciclos. El rango se ajusta a ±2,5.'
      : 'Sin componente continua: la onda oscila alrededor de cero.';
  });
  const chips = [
    ['n', 'N', `${M.N} ${M.N === 1 ? 'término' : 'términos'}`],
    ['', 'potencia de alterna', pc(M.pacFrac)],
    ['', 'error eficaz', pc(M.errRel)],
    M.I.W.jump ? ['', 'sobrepico', pc(M.over) + ' del salto'] : ['', 'error máximo', pc(M.emaxN) + ' de A'],
    ['y', 'x(t)', ''],
  ];
  const box = $('#readout'); box.replaceChildren();
  for (const [cls, k, v] of chips) { const s = document.createElement('span'); s.className = 'chip ' + cls; s.append(k + ' '); const bb = document.createElement('b'); bb.textContent = v; s.appendChild(bb); box.appendChild(s); }
  updateLive();
}
function updateLive() {
  const y = yAt(lab.t), per = lab.t / TAU;
  $('#time').textContent = `t = ${nf(lab.t, 2)} rad · ${nf(per, 2)} T`;
  const b = $('#readout .chip.y b'); if (b) b.textContent = nf(y, 3);
}

/* ---------- fórmulas (MathJax si está disponible, texto si no) ---------- */
let mjReady = false;
const pendingTex = new Map(), pendingPanels = new Set(), typeset = new Set();
function setTex(el, lines) {
  const key = lines.join('|');
  if (el._texKey === key && el._texDone) return;   // misma fórmula ya dibujada
  el._texKey = key; el._texDone = mjReady;
  el._tex = lines;
  if (!mjReady) { const d = document.createElement('div'); d.className = 'fallback'; d.textContent = lines.join('\n'); el.replaceChildren(d); pendingTex.set(el, lines); return; }
  el.replaceChildren(...lines.map(tex => { try { return window.MathJax.tex2svg(tex, { display: true }); } catch { const d = document.createElement('div'); d.className = 'fallback'; d.textContent = tex; return d; } }));
}
function typesetPanel(el) {
  if (typeset.has(el)) return;
  if (!mjReady) { pendingPanels.add(el); return; }
  typeset.add(el);
  window.MathJax.typesetPromise([el]).catch(() => typeset.delete(el));
}
function texExpansion(M) {
  const parts = [], max = 4;
  if (M.I.off) parts.push('1');
  for (const T of M.terms.slice(0, max)) {
    if (T.dc) { parts.push(tnum(T.A)); continue; }
    const sn = Math.sin(T.ph), cs = Math.cos(T.ph), arg = T.n === 1 ? 't' : T.n + 't';
    let fn = '\\operatorname{sen}', neg = false;
    if (Math.abs(sn) < 1e-9) neg = cs < 0; else if (Math.abs(cs) < 1e-9) { fn = '\\cos'; neg = sn < 0; }
    const body = tnum(T.A) + fn + ' ' + arg;
    parts.push((neg ? '- ' : (parts.length ? '+ ' : '')) + body);
  }
  if (M.terms.length > max) parts.push('+ \\cdots');
  const rows = []; for (let i = 0; i < parts.length; i += 2) rows.push(parts.slice(i, i + 2).join(' '));
  const lhs = `x_{${M.N}}(t)`;
  return `\\begin{aligned} ${lhs} &= ${rows[0]}` + rows.slice(1).map(r => ` \\\\ &\\quad ${r}`).join('') + ' \\end{aligned}';
}
let formulaTimer = 0;
function scheduleFormula() {
  clearTimeout(formulaTimer);
  formulaTimer = setTimeout(() => {
    const W = WAVES[cfg.wave], pre = lab.off ? '1 + ' : '';
    setTex($('#labFormula'), [`x_N(t) = ${pre}${W.sumTex}`, texExpansion(lab.M)]);
  }, 90);
}

/* ---------- herramientas de los gráficos del Análisis ---------- */
/* Colores del tema: se leen una vez y se invalidan al cambiar de tema (leerlos en cada gráfico fuerza un recálculo de estilos) */
let tokCache = null;
function tokens() { return tokCache || (tokCache = readTokens()); }
function readTokens() {
  const s = getComputedStyle(document.documentElement), g = v => s.getPropertyValue(v).trim();
  return { ink: g('--ink'), muted: g('--muted'), line: g('--line'), strong: g('--line-strong'), surface: g('--surface'), v1: g('--viz-1'), v2: g('--viz-2'), v3: g('--viz-3'), off: g('--viz-off'), grid: g('--viz-grid') };
}
function gridY(ctx, C, box, ticks, Y, fmt) {
  ctx.font = `500 11px ${FONT_MONO}`; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.lineWidth = 1;
  for (const v of ticks) { const y = Math.round(Y(v)) + 0.5; if (y < box.t - 1 || y > box.b + 1) continue; ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(box.l, y); ctx.lineTo(box.r, y); ctx.stroke(); ctx.fillStyle = C.muted; ctx.fillText(fmt(v), box.l - 6, y); }
}
function axisX(ctx, C, box, ticks, X, fmt, baseY) {
  const y = Math.round(baseY ?? box.b) + 0.5;
  ctx.strokeStyle = C.strong; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(box.l, y); ctx.lineTo(box.r, y); ctx.stroke();
  ctx.font = `500 11px ${FONT_MONO}`; ctx.fillStyle = C.muted; ctx.textBaseline = 'top';
  let lastR = -Infinity;
  for (const v of ticks) {
    const x = X(v); if (x < box.l - 1 || x > box.r + 1) continue;
    const s = fmt(v), tw = ctx.measureText(s).width;
    let left = x - tw / 2; left = clamp(left, 2, ctx.canvas.width / (ctx.getTransform().a || 1) - tw - 2);
    if (left < lastR + 6) continue;
    ctx.textAlign = 'left'; ctx.fillText(s, left, box.b + 6); lastR = left + tw;
  }
}
function ringDot(ctx, x, y, r, fill, ring) { ctx.fillStyle = fill; ctx.strokeStyle = ring; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke(); }
function legend(el, items) {
  el.replaceChildren(...items.map(([color, text, kind]) => {
    const s = document.createElement('span'), i = document.createElement('i');
    if (kind === 'dot') { i.className = 'dot'; i.style.background = color; } else { i.style.borderTopColor = color; if (kind === 'dash') i.style.borderTopStyle = 'dashed'; if (kind === 'thin') i.className = 'thin'; }
    s.append(i, text); return s;
  }));
}
/* Tooltip compartido: valor primero, rótulo después */
const tip = $('#tip');
function showTip(lines, cx, cy) {
  tip.replaceChildren(...lines.map(([v, k]) => { const d = document.createElement('div'); if (v) { const b = document.createElement('span'); b.className = 'v'; b.textContent = v; d.append(b, ' '); } const s = document.createElement('span'); s.className = 'k'; s.textContent = k; d.append(s); return d; }));
  tip.hidden = false;
  const tw = tip.offsetWidth, th = tip.offsetHeight;
  let x = cx + 14, y = cy + 14;
  if (x + tw > innerWidth - 8) x = cx - tw - 14;
  if (y + th > innerHeight - 8) y = cy - th - 14;
  tip.style.transform = `translate(${Math.max(8, x)}px, ${Math.max(8, y)}px)`;
}
function hideTip() { tip.hidden = true; }
const hovers = {};
function hoverable(id, onMove) {
  const cv = $('#' + id);
  cv.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); const res = onMove(e.clientX - r.left, e.clientY - r.top); if (res) showTip(res, e.clientX, e.clientY); else hideTip(); });
  cv.addEventListener('pointerleave', () => { hideTip(); if (hovers[id] != null) { hovers[id] = null; redrawChart(id); } });
}
function setHover(id, v) { if (hovers[id] === v) return; hovers[id] = v; redrawChart(id); }

/* ---------- Análisis: textos y tablas ---------- */
/* Escribe un rótulo con subíndices: 'Valor eficaz X_rms' → X<sub>rms</sub> */
function subText(el, text) {
  el.replaceChildren();
  const re = /_([A-Za-zÁÉÍÓÚáéíóú0-9]+)/g; let last = 0, m;
  while ((m = re.exec(text))) { el.append(text.slice(last, m.index)); const sb = document.createElement('sub'); sb.textContent = m[1]; el.appendChild(sb); last = m.index + m[0].length; }
  el.append(text.slice(last));
  return el;
}
const U = () => ({ A: cfg.amp, f0: cfg.f0, R: cfg.R, T: 1 / cfg.f0 });
function renderLead(M) {
  const u = U(), W = M.I.W, ords = M.terms.filter(T => !T.dc).map(T => T.n);
  const per = siT(u.T, 's'), fmax = siT(M.nmax * u.f0, 'Hz');
  let txt = `${W.name} de ${siT(u.A, 'V')} de amplitud y f₀ = ${siT(u.f0, 'Hz')} (T = ${per})`;
  if (M.I.off) txt += `, con una componente continua de ${siT(u.A, 'V')}`;
  txt += `, aproximada con N = ${M.N} ${M.N === 1 ? 'término' : 'términos'}`;
  txt += ords.length ? (ords.length <= 4 ? `: ${ords.length === 1 ? 'la armónica' : 'las armónicas'} ${joinY(ords)}, hasta ${fmax}.` : `: armónicas de n = ${ords[0]} a n = ${ords[ords.length - 1]}, hasta ${fmax}.`) : ': solo la componente continua.';
  $('#anaLead').textContent = txt;
}
function devCell(td, ideal, val, unit) {
  td.className = 'dev';
  if (!Number.isFinite(ideal) || !Number.isFinite(val)) { td.textContent = '—'; return; }
  if (Math.abs(ideal) > 1e-12) { const r = (val - ideal) / Math.abs(ideal); td.textContent = (r > 0 ? '+' : '') + pc(r); if (Math.abs(r) >= 0.05) td.classList.add('big'); }
  else { const d = val - ideal; td.textContent = Math.abs(d) < 1e-12 ? '0' : (d > 0 ? '+' : '') + (unit ? si(d, unit) : sig(d)); }
}
function renderParams(M) {
  const I = M.I, W = I.W, u = U(), ex = I.off ? W.exDC : W.ex;
  const iAc = I.ac, iPk = Math.max(Math.abs(I.max), Math.abs(I.min)), nPk = Math.max(Math.abs(M.maxN), Math.abs(M.minN));
  const rows = [
    ['Valor medio X_dc', I.mean, M.meanN, 'V', ex.mean],
    ['Valor medio rectificado X_rect', I.mabs, M.mabsN, 'V', ex.mabs],
    ['Valor eficaz X_rms', I.rms, M.rmsN, 'V', ex.rms],
    ['Valor eficaz de alterna X_ac', iAc, M.acN, 'V', ex.ac],
    ['Valor máximo', I.max, M.maxN, 'V', ex.max],
    ['Valor mínimo', I.min, M.minN, 'V', ex.min],
    ['Valor pico a pico', I.max - I.min, M.maxN - M.minN, 'V', ex.pp],
    ['Factor de cresta X_pico/X_rms', iPk / I.rms, nPk / M.rmsN, '', ex.crest],
    ['Factor de forma X_rms/X_rect', I.rms / I.mabs, M.rmsN / M.mabsN, '', ex.form],
    ['Factor de rizado X_ac/|X_dc|', Math.abs(I.mean) > 1e-12 ? iAc / Math.abs(I.mean) : NaN, Math.abs(M.meanN) > 1e-12 ? M.acN / Math.abs(M.meanN) : NaN, '', ex.ripple || 'no aplica: X_dc = 0'],
    ['Potencia media en R', I.P, M.PN, 'W', ex.P],
  ];
  const tb = $('#paramsTable tbody'); tb.replaceChildren();
  for (const [label, iv, nv, unit, exs] of rows) {
    const tr = document.createElement('tr');
    const td0 = subText(document.createElement('td'), label);
    const scale = unit === 'V' ? u.A : unit === 'W' ? u.A * u.A / u.R : 1;
    const fmtv = v => !Number.isFinite(v) ? '—' : unit ? si(v * scale, unit, 4) : nf(v, 4);
    const td1 = document.createElement('td'); td1.textContent = fmtv(iv);
    if (exs && exs !== '0') { const e = subText(document.createElement('span'), exs); e.className = 'ex'; td1.appendChild(e); }
    const td2 = document.createElement('td'); td2.textContent = fmtv(nv);
    const td3 = document.createElement('td'); devCell(td3, iv * scale, nv * scale, unit);
    tr.append(td0, td1, td2, td3); tb.appendChild(tr);
  }
  const over = W.jump ? `El máximo de la suma parcial queda por encima del ideal por el fenómeno de Gibbs, y no baja al sumar términos.` : `La señal es continua: al sumar términos todos los valores convergen al ideal.`;
  $('#paramsNote').textContent = `El valor medio y el eficaz de la suma salen exactos de los coeficientes (Parseval); el valor medio rectificado, el máximo y el mínimo se miden sobre ${MS} muestras por período. ${over}`;
}
function renderPower(M) {
  const I = M.I, u = U(), kP = u.A * u.A / u.R, dcP = I.mean * I.mean;
  const kv = [
    ['Potencia total P', si(I.P * kP, 'W'), 'X²rms / R'],
    ['De la continua', si(dcP * kP, 'W'), pc(dcP / I.P) + ' del total'],
    ['De la alterna', si(I.Pac * kP, 'W'), pc(I.Pac / I.P) + ' del total'],
    ['Captada con N términos', si(M.PN * kP, 'W'), pc(M.pacFrac) + ' de la alterna'],
    ['Error cuadrático medio', si(M.err * M.err * kP, 'W'), 'potencia que falta'],
  ];
  const dl = $('#powerKV'); dl.replaceChildren();
  for (const [k, v, s] of kv) { const d = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = k; dd.textContent = v; const sm = document.createElement('small'); sm.textContent = s; dd.appendChild(sm); d.append(dt, dd); dl.appendChild(d); }
  const t = $('#bwTable'); t.replaceChildren();
  const th = document.createElement('thead'); th.innerHTML = '<tr><th scope="col">Potencia de alterna</th><th scope="col">Hasta la armónica</th><th scope="col">Frecuencia</th><th scope="col">Términos</th></tr>';
  const tb = document.createElement('tbody');
  for (const b of I.bw) {
    const tr = document.createElement('tr');
    for (const v of [pc(b.frac, b.frac === 0.999 ? 1 : 0), 'n = ' + b.n, si(b.n * u.f0, 'Hz'), String(b.count) + (b.count > KMAX ? ` (más que el máximo de ${KMAX})` : '')]) { const td = document.createElement('td'); td.textContent = v; tr.appendChild(td); }
    tb.appendChild(tr);
  }
  t.append(th, tb);
  const f1 = I.fund;
  $('#powNote').textContent = `La fundamental (n = ${f1.n}) sola lleva el ${pc(f1.A * f1.A / 2 / I.Pac)} de la potencia de alterna. La tabla es el ancho de banda de potencia: hasta qué armónica hay que llegar para captar cada porcentaje.`;
}
function renderTHD(M) {
  const I = M.I, u = U(), f = I.fund, V1 = f.A / Math.SQRT2, VH = Math.sqrt(Math.max(0, I.Pac - M.P1));
  const VHN = Math.sqrt(Math.max(0, M.pacN - M.P1)), has = !!M.thdN;
  const rows = [
    ['Fundamental', `n = ${f.n} · ${siT(f.n * u.f0, 'Hz')}`, '', has ? `n = ${f.n} · ${siT(f.n * u.f0, 'Hz')}` : 'no incluida'],
    ['Valor eficaz de la fundamental V_1', si(V1 * u.A, 'V'), '', has ? si(V1 * u.A, 'V') : '—'],
    ['Valor eficaz de las demás armónicas', si(VH * u.A, 'V'), '', has ? si(VHN * u.A, 'V') : '—'],
    ['THD_F (respecto de V_1)', pc(M.thd.F), I.W.thdEx, has ? pc(M.thdN.F) : '—'],
    ['THD_R (respecto de V_ac)', pc(M.thd.R), '', has ? pc(M.thdN.R) : '—'],
    ['Factor de distorsión V_1/V_ac', nf(M.thd.df, 4), '', has ? nf(M.thdN.df, 4) : '—'],
  ];
  const tb = $('#thdTable tbody'); tb.replaceChildren();
  for (const [label, iv, ex, nv] of rows) {
    const tr = document.createElement('tr');
    const td0 = subText(document.createElement('td'), label), td1 = document.createElement('td'), td2 = document.createElement('td');
    td1.textContent = iv; if (ex) { const e = document.createElement('span'); e.className = 'ex'; e.textContent = ex; td1.appendChild(e); }
    td2.textContent = nv; tr.append(td0, td1, td2); tb.appendChild(tr);
  }
  // armónica dominante después de la fundamental
  const rest = I.terms.filter(T => !T.dc && T !== f).sort((a, b) => b.A - a.A)[0];
  const extra = rest ? ` Después de la fundamental, la armónica más grande es la n = ${rest.n}, a ${nf(20 * Math.log10(rest.A / f.A), 1)} dB de la fundamental (dBc).` : '';
  $('#thdNote').textContent = (cfg.wave === 'rectificada' ? 'La rectificada se repite cada T/2: su fundamental real es la armónica 2, en 2f₀. ' : '') + `Con N = 1 la suma es una senoidal pura y su THD es cero; la THD de la señal ideal es la que da la suma de infinitos términos.` + extra;
}
function renderSym(M) {
  const I = M.I, s = I.sym, ul = $('#symList'); ul.replaceChildren();
  const items = [
    [s.even, 'Par', 'x(−t) = x(t)', s.even ? 'Todos los bₙ valen 0: solo cosenos.' : 'Hay términos en seno.'],
    [s.odd, 'Impar', 'x(−t) = −x(t)', s.odd ? 'Todos los aₙ valen 0: solo senos.' : 'Hay términos en coseno.'],
    [s.half, 'Media onda', 'x(t + T/2) = −x(t)', s.half ? 'Solo armónicas impares.' : 'No anula las armónicas pares.'],
    [s.halfPer, 'Período T/2', 'x(t + T/2) = x(t)', s.halfPer ? 'Solo armónicas pares: la señal se repite cada medio período.' : 'Tiene armónicas impares.'],
    [s.quarter, 'Cuarto de onda', 'simétrica respecto de T/4', s.quarter ? 'Alcanza con integrar de 0 a T/4 y multiplicar por 8/T en lugar de 2/T.' : 'Hay que integrar al menos medio período.'],
  ];
  for (const [yes, name, eq, why] of items) {
    const li = document.createElement('li'), p = document.createElement('span'), b = document.createElement('b'), w = document.createElement('span');
    p.className = 'pill ' + (yes ? 'yes' : 'no'); p.textContent = yes ? 'SÍ' : 'NO';
    b.textContent = name + ' '; const e = document.createElement('span'); e.textContent = eq; e.style.color = 'var(--muted)'; e.style.fontFamily = 'var(--font-mono)'; e.style.fontSize = '12.5px';
    const head = document.createElement('span'); head.append(b, e);
    w.className = 'why'; w.textContent = why;
    li.append(p, head, w); ul.appendChild(li);
  }
  $('#symNote').textContent = (I.off ? 'La componente continua no cuenta: las simetrías se miden sobre x(t) − a₀/2. ' : '') + `Se comprueban numéricamente sobre ${MS} muestras de la señal ideal. Las simetrías dependen del origen de tiempos; los módulos Aₙ no.`;
}
function fmtC(re, im) {
  const z = v => (Math.abs(v) < 5e-7 ? 0 : v);
  re = z(re); im = z(im);
  if (!im) return sig(re, 4);
  const jp = (im < 0 ? '−' : '+') + ' j' + sig(Math.abs(im), 4);
  return re ? sig(re, 4) + ' ' + jp : (im < 0 ? '−j' : 'j') + sig(Math.abs(im), 4);
}
let coefTSV = '';
function renderCoef(M) {
  const I = M.I, u = U(), kP = u.A * u.A / u.R, A1 = I.fund.A;
  $('#coefSub').textContent = `${M.N} ${M.N === 1 ? 'término' : 'términos'}${I.off ? ' y la componente continua' : ''}. Convención x(t) = a₀/2 + Σ [aₙ cos(nω₀t) + bₙ sen(nω₀t)], con fase θₙ en referencia coseno.`;
  setTex($('#coefExpr'), [(I.off ? '\\frac{a_0}{2} = 1\\ \\text{(modo DC)}, \\qquad ' : '') + I.W.coefTex]);
  const head = ['n', 'f', 'aₙ', 'bₙ', 'Aₙ', 'θₙ', 'cₙ', 'Aₙ/A₁', 'Pₙ', '% de P', '% acumulado'];
  const tsv = [['n', 'f (Hz)', 'a_n (V)', 'b_n (V)', 'A_n (V)', 'theta_n (grados)', 'Re c_n (V)', 'Im c_n (V)', 'A_n/A_1 (dB)', 'P_n (W)', '% de P', '% acumulado'].join('\t')];
  const rows = [];
  let acc = 0;
  const push = (o) => { acc += o.P; rows.push({ ...o, cum: acc / I.P }); };
  if (I.off) push({ n: 0, dc: true, a: I.off, b: 0, A: I.off, th: 0, P: I.off * I.off });
  for (const T of M.terms) {
    if (T.dc) { push({ n: 0, dc: true, a: T.A, b: 0, A: T.A, th: 0, P: T.A * T.A }); continue; }
    const a = T.A * Math.sin(T.ph), b = T.A * Math.cos(T.ph);
    push({ n: T.n, dc: false, a, b, A: T.A, th: T.ph - PI / 2, P: T.A * T.A / 2, fund: T === I.fund });
  }
  const tbl = $('#coefTable'); tbl.replaceChildren();
  const thead = document.createElement('thead'), trh = document.createElement('tr');
  for (const hname of head) { const th = document.createElement('th'); th.scope = 'col'; th.textContent = hname; trh.appendChild(th); }
  thead.appendChild(trh);
  const tbody = document.createElement('tbody');
  // números para planilla: coma decimal y sin separador de miles
  const plain = v => (Math.abs(v) < 5e-7 ? 0 : v).toFixed(6).replace('.', ',');
  for (const r of rows) {
    const tr = document.createElement('tr'); if (r.dc) tr.className = 'dc'; if (r.fund) tr.className = 'fund';
    const cRe = r.dc ? r.a : r.a / 2, cIm = r.dc ? 0 : -r.b / 2;
    const dB = r.dc ? NaN : 20 * Math.log10(r.A / A1);
    const cells = [r.dc ? 'DC' : String(r.n), si(r.n * u.f0, 'Hz'), si(r.a * u.A, 'V') + (r.dc ? ' (a₀/2)' : ''), si(r.b * u.A, 'V'), si(r.A * u.A, 'V'), r.dc ? '—' : deg(r.th), fmtC(cRe * u.A, cIm * u.A), Number.isFinite(dB) ? nf(dB, 2) + ' dB' : '—', si(r.P * kP, 'W'), pc(r.P / I.P), pc(r.cum)];
    for (const v of cells) { const td = document.createElement('td'); td.textContent = v; tr.appendChild(td); }
    tbody.appendChild(tr);
    tsv.push([r.n, plain(r.n * u.f0), plain(r.a * u.A), plain(r.b * u.A), plain(r.A * u.A), r.dc ? '' : plain(wrapDeg(r.th)), plain(cRe * u.A), plain(cIm * u.A), Number.isFinite(dB) ? plain(dB) : '', plain(r.P * kP), plain(100 * r.P / I.P), plain(100 * r.cum)].join('\t'));
  }
  tbl.append(thead, tbody);
  coefTSV = tsv.join('\n');
  // verificación con la FFT de la señal ideal
  let dmax = 0;
  const D = I.dft;
  for (const r of rows) {
    if (r.dc) { dmax = Math.max(dmax, Math.abs(D.re[0] - (I.mean))); continue; }
    if (r.n >= MS / 2) continue;
    const a = 2 * D.re[r.n], b = -2 * D.im[r.n];
    dmax = Math.max(dmax, Math.abs(a - r.a), Math.abs(b - r.b));
  }
  $('#coefNote').textContent = `Verificación: una FFT de ${MS} muestras de la señal ideal reproduce estos coeficientes con una diferencia máxima de ${si(dmax * u.A, 'V', 2)}${dmax > 1e-6 ? ', que es el aliasing de las armónicas que no entran en la grilla' : ''}. «Copiar tabla» la deja lista para pegar en una planilla, con coma decimal.`;
}

/* ---------- Análisis: gráficos ---------- */
const anaCharts = {};
function redrawChart(id) { const f = anaCharts[id]; if (f && !$('#ana').hidden) f(); }
function curModel() { return model(cfg); }

anaCharts.anaSpec = function drawAnaSpec() {
  const cv = $('#anaSpec'), { ctx, w, h } = prep(cv), C = tokens(), M = curModel(), I = M.I, u = U();
  const mode = cfg.specMode, db = cfg.specScale === 'db' && mode !== 'fase';
  const K = clamp(M.N + 6, 12, KMAX), items = [];
  const kV = u.A, kP = u.A * u.A / u.R;
  const unit = mode === 'pot' ? 'W' : mode === 'fase' ? '°' : 'V';
  const fundVal = mode === 'pot' ? I.fund.A ** 2 / 2 * kP : mode === 'bil' ? I.fund.A / 2 * kV : I.fund.A * kV;
  const toDb = v => (mode === 'pot' ? 10 : 20) * Math.log10(v / fundVal);
  if (Math.abs(I.mean) > 1e-12) items.push({ n: 0, dc: true, used: true, v: mode === 'pot' ? I.mean ** 2 * kP : mode === 'fase' ? (I.mean >= 0 ? 0 : 180) : Math.abs(I.mean) * kV, idx: -1, P: I.mean ** 2 });
  for (let i = 0; i < K; i++) {
    const T = I.terms[i]; if (T.dc) continue;
    const used = i < M.N, th = wrapDeg(T.ph - PI / 2);
    if (mode === 'bil') { items.push({ n: T.n, used, v: T.A / 2 * kV, idx: i, P: T.A * T.A / 4, th }); items.push({ n: -T.n, used, v: T.A / 2 * kV, idx: i, P: T.A * T.A / 4, th: -th }); }
    else items.push({ n: T.n, used, v: mode === 'pot' ? T.A * T.A / 2 * kP : mode === 'fase' ? th : T.A * kV, idx: i, P: T.A * T.A / 2, th });
  }
  items.sort((a, b) => a.n - b.n);
  const nAbs = Math.max(...items.map(o => Math.abs(o.n)));
  const fLo = mode === 'bil' ? -nAbs * u.f0 : 0, fHi = nAbs * u.f0, padF = (fHi - fLo) * 0.04 + u.f0 * 0.4;
  const box = { l: 58, r: w - 12, t: 12, b: h - 26 };
  const X = f => box.l + (f - (fLo - padF)) / (fHi - fLo + 2 * padF) * (box.r - box.l);
  let lo, hi, ticks, fmtY;
  if (mode === 'fase') { lo = -200; hi = 200; ticks = [-180, -90, 0, 90, 180]; fmtY = v => String(v).replace('-', '−') + '°'; }
  else if (db) {
    const dbs = items.map(o => toDb(o.v)).filter(Number.isFinite);
    const mn = Math.min(...dbs), mx = Math.max(0, ...dbs);
    lo = Math.min(-40, Math.floor((mn - 6) / 20) * 20); hi = Math.ceil((mx + 4) / 10) * 10;
    ticks = []; for (let v = lo; v <= hi; v += 20) ticks.push(v); fmtY = v => String(v).replace('-', '−') + ' dB';
  } else { const mx = Math.max(...items.map(o => o.v)); lo = 0; hi = mx * 1.12; ticks = niceTicks(0, hi, 4); fmtY = v => si(v, unit, 3); }
  const Y = v => box.b - (v - lo) / (hi - lo) * (box.b - box.t);
  gridY(ctx, C, box, ticks, Y, fmtY);
  const base = mode === 'fase' ? Y(0) : box.b;
  const xt = niceTicks(fLo, fHi, mode === 'bil' ? 6 : 6);
  axisX(ctx, C, box, xt, X, v => si(v, 'Hz', 3), base);
  if (mode === 'fase') { ctx.strokeStyle = C.strong; ctx.beginPath(); ctx.moveTo(box.l, Math.round(box.b) + 0.5); ctx.lineTo(box.r, Math.round(box.b) + 0.5); ctx.stroke(); }
  const hov = hovers.anaSpec;
  const gap0 = items.length > 1 ? Math.abs(X(items[1].n * u.f0) - X(items[0].n * u.f0)) : 99, mr = clamp(gap0 * 0.32, 1.4, 4);
  for (const o of items) {
    const x = X(o.n * u.f0), val = db ? toDb(o.v) : o.v, y = Y(clamp(val, lo, hi));
    const col = hov != null && o.n === hov ? C.v2 : o.used ? C.v1 : C.off;
    ctx.strokeStyle = col; ctx.lineWidth = gap0 < 6 ? 1 : 2; ctx.beginPath(); ctx.moveTo(x, base); ctx.lineTo(x, y); ctx.stroke();
    const r = hov != null && o.n === hov ? Math.max(mr, 3.5) : mr;
    if (o.dc) { ctx.fillStyle = col; ctx.strokeStyle = C.surface; ctx.lineWidth = 2; ctx.beginPath(); ctx.rect(x - r, y - r, 2 * r, 2 * r); ctx.fill(); ctx.stroke(); }
    else ringDot(ctx, x, y, r, col, C.surface);
  }
  // rótulos selectivos: los términos sumados si entran, si no solo el mayor
  if (mode !== 'fase') {
    const used = items.filter(o => o.used), gap = items.length > 1 ? Math.abs(X(items[1].n * u.f0) - X(items[0].n * u.f0)) : 99;
    const show = gap >= 46 ? used.slice(0, 6) : used.slice().sort((a, b) => b.v - a.v).slice(0, 1);
    ctx.font = `500 10.5px ${FONT_MONO}`; ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    for (const o of show) { const val = db ? toDb(o.v) : o.v; ctx.fillText(db ? nf(val, 1) + ' dB' : si(o.v, unit, 3), clamp(X(o.n * u.f0), box.l + 20, box.r - 20), Math.max(box.t + 10, Y(clamp(val, lo, hi)) - 7)); }
  }
  anaSpecItems = { items, X, u, mode, db, toDb, unit };
  legend($('#specLegend'), [[C.v1, `en la suma (N = ${M.N})`, 'dot'], [C.off, 'todavía no sumadas', 'dot']]);
  const f1 = I.fund;
  const notes = {
    amp: `Aₙ = √(aₙ² + bₙ²). El pico principal es la fundamental, n = ${f1.n}, con ${si(f1.A * kV, 'V')}. ${db ? 'En dB, 20·log₁₀(Aₙ/A₁): cada −20 dB es una amplitud diez veces menor.' : 'Probá la escala en dB para ver las armónicas chicas.'}`,
    fase: `θₙ es el ángulo de cₙ (referencia coseno). Para esta señal las fases son ${cfg.wave === 'rectificada' ? '180°: son cosenos negativos' : cfg.wave === 'cuadrada' ? '−90°: son senos positivos' : '±90°: son senos que alternan de signo'}. La fase depende del origen de tiempos; el módulo no.`,
    pot: `Potencia de cada armónica en la carga: Pₙ = Aₙ²/(2R). Para una señal periódica, la densidad espectral de potencia son impulsos en n·f₀ y estas barras son sus áreas. La suma de todas es la potencia total.`,
    bil: `Espectro bilateral |cₙ| = Aₙ/2: cada armónica aparece en +nf₀ y en −nf₀ con la mitad de la amplitud. El módulo es par porque la señal es real.`,
  };
  $('#specNote').textContent = notes[mode];
  $('#specSub').textContent = { amp: 'Amplitud de cada armónica (espectro unilateral).', fase: 'Fase de cada armónica, en referencia coseno.', pot: 'Potencia de cada armónica sobre la carga R.', bil: 'Módulo de los coeficientes complejos cₙ, en frecuencias positivas y negativas.' }[mode];
};
let anaSpecItems = null;
hoverable('anaSpec', (px) => {
  const S = anaSpecItems; if (!S) return null;
  let best = null, bd = 14;
  for (const o of S.items) { const d = Math.abs(S.X(o.n * S.u.f0) - px); if (d < bd) { bd = d; best = o; } }
  setHover('anaSpec', best ? best.n : null);
  if (!best) return null;
  const I = curModel().I, val = S.db ? nf(S.toDb(best.v), 1) + ' dB' : S.mode === 'fase' ? nf(best.v, 1) + '°' : si(best.v, S.unit);
  return [[val, S.mode === 'amp' ? 'amplitud' : S.mode === 'pot' ? 'potencia' : S.mode === 'bil' ? 'módulo |cₙ|' : 'fase θₙ'], [si(best.n * S.u.f0, 'Hz'), best.dc ? 'componente continua' : `armónica n = ${best.n}`], [pc(best.P / I.P), 'de la potencia total'], [best.used ? '' : '', best.used ? 'incluida en la suma' : 'todavía no sumada']];
});

anaCharts.anaPow = function drawAnaPow() {
  const cv = $('#anaPow'), { ctx, w, h } = prep(cv), C = tokens(), M = curModel(), I = M.I;
  const box = { l: 46, r: w - 46, t: 10, b: h - 24 };
  const first = 100 * I.pacN[1] / I.Pac, lo = clamp(Math.floor((first - 4) / 10) * 10, 0, 90);
  const X = logScale(1, KMAX, box.l, box.r), Y = v => box.b - (v - lo) / (100 - lo) * (box.b - box.t);
  gridY(ctx, C, box, niceTicks(lo, 100, 4), Y, v => nf(v, 0) + ' %');
  axisX(ctx, C, box, NTICKS, X, v => String(v));
  ctx.setLineDash([4, 4]); ctx.strokeStyle = C.muted; ctx.lineWidth = 1;
  ctx.font = `500 10.5px ${FONT_MONO}`; ctx.fillStyle = C.muted; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  for (const th of [90, 99]) { if (th < lo) continue; const y = Math.round(Y(th)) + 0.5; ctx.beginPath(); ctx.moveTo(box.l, y); ctx.lineTo(box.r, y); ctx.stroke(); ctx.fillText(th + ' %', box.r + 6, y + (th === 99 ? -5 : 5)); }
  ctx.setLineDash([]);
  ctx.strokeStyle = C.v2; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.beginPath();
  for (let N = 1; N <= KMAX; N++) { const x = X(N), y = Y(100 * I.pacN[N] / I.Pac); N === 1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
  ctx.stroke();
  const hv = hovers.anaPow;
  if (hv) { ctx.strokeStyle = C.strong; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(Math.round(X(hv)) + 0.5, box.t); ctx.lineTo(Math.round(X(hv)) + 0.5, box.b); ctx.stroke(); ringDot(ctx, X(hv), Y(100 * I.pacN[hv] / I.Pac), 4, C.v2, C.surface); }
  ringDot(ctx, X(M.N), Y(100 * M.pacFrac), 5, C.v1, C.surface);
};
hoverable('anaPow', (px) => {
  const cv = $('#anaPow'), w = cv.getBoundingClientRect().width, l = 46, r = w - 46;
  const N = clamp(Math.round(Math.exp((px - l) / (r - l) * LOGN)), 1, KMAX), I = curModel().I;
  setHover('anaPow', N);
  return [[pc(I.pacN[N] / I.Pac), `de la potencia de alterna con N = ${N}`], [pc(1 - I.pacN[N] / I.Pac), 'queda afuera']];
});

anaCharts.anaAcf = function drawAnaAcf() {
  const cv = $('#anaAcf'), { ctx, w, h } = prep(cv), C = tokens(), M = curModel(), I = M.I, u = U();
  const k2 = u.A * u.A, Tms = 1000 / u.f0;
  const box = { l: 58, r: w - 12, t: 10, b: h - 24 };
  const n = 600, taus = [], Ri = [], Rn = [];
  const acTerms = M.terms.filter(T => !T.dc);
  for (let i = 0; i <= n; i++) {
    const tau = -TAU + 2 * TAU * i / n; taus.push(tau);
    const m = ((Math.round(tau / TAU * MS) % MS) + MS) % MS; Ri.push(I.acf[m] * k2);
    let r = M.meanN * M.meanN; for (const T of acTerms) r += T.A * T.A / 2 * Math.cos(T.n * tau); Rn.push(r * k2);
  }
  const all = Ri.concat(Rn), mn = Math.min(...all), mx = Math.max(...all), pad = (mx - mn) * 0.08 || 1;
  const lo = Math.min(0, mn - pad), hi = mx + pad;
  const X = tau => box.l + (tau + TAU) / (2 * TAU) * (box.r - box.l), Y = v => box.b - (v - lo) / (hi - lo) * (box.b - box.t);
  gridY(ctx, C, box, niceTicks(lo, hi, 4), Y, v => v2(v));
  const xt = [-1, -0.5, 0, 0.5, 1].map(f => f * TAU);
  axisX(ctx, C, box, xt, X, v => (Math.abs(v) < 1e-9 ? '0' : si(v / TAU * Tms / 1000, 's', 3).replace('-', '−')), Y(Math.max(lo, 0)));
  const line = (arr, col, lw) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.beginPath(); arr.forEach((v, i) => { const x = X(taus[i]), y = Y(v); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); };
  line(Ri, C.muted, 1.5); line(Rn, C.v1, 2);
  ringDot(ctx, X(0), Y(I.acf[0] * k2), 4.5, C.v1, C.surface);
  ctx.font = `500 11px ${FONT_MONO}`; ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
  ctx.fillText('R(0) = ' + v2(I.acf[0] * k2, 4), X(0) + 8, Y(I.acf[0] * k2) + 4 > box.t + 14 ? Y(I.acf[0] * k2) - 4 : box.t + 14);
  const hv = hovers.anaAcf;
  if (hv != null) { const x = X(taus[hv]); ctx.strokeStyle = C.strong; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(Math.round(x) + 0.5, box.t); ctx.lineTo(Math.round(x) + 0.5, box.b); ctx.stroke(); ringDot(ctx, x, Y(Ri[hv]), 3.5, C.muted, C.surface); ringDot(ctx, x, Y(Rn[hv]), 3.5, C.v1, C.surface); }
  acfData = { taus, Ri, Rn, box, Tms };
  legend($('#acfLegend'), [[C.muted, 'señal ideal', 'thin'], [C.v1, `suma de N = ${M.N} términos`, 'line']]);
  $('#acfNote').textContent = `R(0) = X²rms es la potencia media (sobre 1 Ω). Es periódica con el mismo período T = ${siT(1 / u.f0, 's')} y no depende de las fases.` + (cfg.wave === 'cuadrada' ? ' La autocorrelación de la cuadrada es una triangular.' : cfg.wave === 'rectificada' ? ' Se repite cada T/2, igual que la rectificada.' : '');
};
let acfData = null;
hoverable('anaAcf', (px) => {
  const D = acfData; if (!D) return null;
  const i = clamp(Math.round((px - D.box.l) / (D.box.r - D.box.l) * (D.taus.length - 1)), 0, D.taus.length - 1);
  setHover('anaAcf', i);
  return [[si(D.taus[i] / TAU * D.Tms / 1000, 's', 3), 'corrimiento τ'], [v2(D.Ri[i], 4), 'R(τ) ideal'], [v2(D.Rn[i], 4), `R(τ) con N = ${cfg.N}`]];
});

const NTICKS = [1, 2, 5, 10, 20, 50, 100, 200, 500].filter(v => v <= KMAX);
function logScale(lo, hi, a, b) { const L0 = Math.log10(lo), L1 = Math.log10(hi); return v => a + (Math.log10(v) - L0) / (L1 - L0) * (b - a); }
anaCharts.anaDecay = function drawDecay() {
  const cv = $('#anaDecay'), { ctx, w, h } = prep(cv), C = tokens(), M = curModel(), I = M.I, u = U();
  const pts = I.terms.filter(T => !T.dc).map(T => ({ n: T.n, A: T.A * u.A, used: T.i < M.N }));
  const nHi = Math.max(...pts.map(p => p.n)), aHi = Math.max(...pts.map(p => p.A)), aLo = Math.min(...pts.map(p => p.A));
  const eLo = Math.floor(Math.log10(aLo)), eHi = Math.ceil(Math.log10(aHi * 1.05));
  const box = { l: 56, r: w - 10, t: 10, b: h - 24 };
  const X = logScale(1, Math.max(10, nHi * 1.1), box.l, box.r), Y = logScale(10 ** eLo, 10 ** eHi, box.b, box.t);
  const yt = []; for (let e = eLo; e <= eHi; e++) yt.push(10 ** e);
  gridY(ctx, C, box, yt, Y, v => si(v, 'V', 1));
  axisX(ctx, C, box, [1, 2, 5, 10, 20, 50, 100, 200, 500].filter(v => v <= nHi * 1.1), X, v => String(v));
  const f = pts[0];
  ctx.setLineDash([4, 4]); ctx.strokeStyle = C.muted; ctx.lineWidth = 1;
  ctx.font = `500 10.5px ${FONT_MONO}`; ctx.fillStyle = C.muted; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
  for (const p of [1, 2]) {
    ctx.beginPath(); let started = false;
    for (let k = 0; k <= 60; k++) { const n = f.n * (nHi * 1.1 / f.n) ** (k / 60), a = f.A * (f.n / n) ** p; if (a < 10 ** eLo) break; const x = X(n), y = Y(a); started ? ctx.lineTo(x, y) : ctx.moveTo(x, y); started = true; }
    ctx.stroke();
    // rótulo a mitad de camino: arriba de la recta 1/n, abajo de la 1/n²
    const nl = f.n * 3.2, al = f.A * (f.n / nl) ** p;
    if (al > 10 ** eLo) { ctx.textAlign = 'left'; ctx.textBaseline = p === 1 ? 'bottom' : 'top'; ctx.fillText(p === 1 ? '∝ 1/n' : '∝ 1/n²', X(nl) + (p === 1 ? 6 : -36), Y(al) + (p === 1 ? -6 : 6)); }
  }
  ctx.setLineDash([]);
  const hv = hovers.anaDecay;
  const pr = pts.length > 80 ? 2.2 : 3.2;
  for (const p of pts) { const on = hv != null && p.n === hv; ringDot(ctx, X(p.n), Y(p.A), on ? 4.5 : pr, on ? C.v2 : p.used ? C.v1 : C.off, C.surface); }
  decayData = { pts, X, Y };
};
let decayData = null;
hoverable('anaDecay', (px) => {
  const D = decayData; if (!D) return null;
  let best = null, bd = 12; for (const p of D.pts) { const d = Math.abs(D.X(p.n) - px); if (d < bd) { bd = d; best = p; } }
  setHover('anaDecay', best ? best.n : null);
  return best ? [[si(best.A, 'V'), `amplitud A${sub(best.n)}`], ['', `armónica n = ${best.n}`]] : null;
});
anaCharts.anaErr = function drawErr() {
  const cv = $('#anaErr'), { ctx, w, h } = prep(cv), C = tokens(), M = curModel(), I = M.I;
  const vals = []; for (let N = 1; N <= KMAX; N++) vals.push(100 * I.errN[N] / I.ac);
  const vMin = Math.min(...vals.filter(v => v > 0)), vMax = Math.max(...vals);
  const eLo = Math.floor(Math.log10(vMin)), eHi = Math.max(2, Math.ceil(Math.log10(vMax)));
  const box = { l: 52, r: w - 10, t: 10, b: h - 24 };
  const X = logScale(1, KMAX, box.l, box.r), Y = logScale(10 ** eLo, 10 ** eHi, box.b, box.t);
  const yt = []; for (let e = eLo; e <= eHi; e++) yt.push(10 ** e);
  gridY(ctx, C, box, yt, Y, v => (v >= 1 ? String(v) : nf(v, Math.ceil(-Math.log10(v)))) + ' %');
  axisX(ctx, C, box, NTICKS, X, v => String(v));
  const last = vals[KMAX - 1];
  ctx.setLineDash([4, 4]); ctx.strokeStyle = C.muted; ctx.lineWidth = 1; ctx.font = `500 10.5px ${FONT_MONO}`; ctx.fillStyle = C.muted; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
  for (const p of [0.5, 1.5]) {
    ctx.beginPath(); let started = false;
    for (let k = 0; k <= 40; k++) { const N = 4 * (KMAX / 4) ** (k / 40), v = last * (KMAX / N) ** p; if (v > 10 ** eHi) continue; const x = X(N), y = Y(v); if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y); }
    ctx.stroke();
    const Nl = 16, vl = last * (KMAX / Nl) ** p;
    if (vl < 10 ** eHi) { ctx.textAlign = p === 0.5 ? 'left' : 'right'; ctx.textBaseline = p === 0.5 ? 'top' : 'bottom'; ctx.fillText(p === 0.5 ? '∝ 1/√N' : '∝ 1/(N√N)', X(Nl) + (p === 0.5 ? 4 : -6), Y(vl) + (p === 0.5 ? 6 : -4)); }
  }
  ctx.setLineDash([]);
  ctx.strokeStyle = C.v2; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.beginPath();
  vals.forEach((v, i) => { if (!(v > 0)) return; const x = X(i + 1), y = Y(v); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
  ctx.stroke();
  const hv = hovers.anaErr;
  if (hv) { const x = X(hv); ctx.strokeStyle = C.strong; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(Math.round(x) + 0.5, box.t); ctx.lineTo(Math.round(x) + 0.5, box.b); ctx.stroke(); }
  if (vals[M.N - 1] > 0) ringDot(ctx, X(M.N), Y(vals[M.N - 1]), 5, C.v1, C.surface);
  errData = { vals, X, box };
};
let errData = null;
hoverable('anaErr', (px) => {
  const D = errData; if (!D) return null;
  let best = 1, bd = Infinity; for (let N = 1; N <= KMAX; N++) { const d = Math.abs(D.X(N) - px); if (d < bd) { bd = d; best = N; } }
  setHover('anaErr', best);
  return [[pc(D.vals[best - 1] / 100), `error eficaz con N = ${best}`], ['', 'relativo al valor eficaz de alterna']];
});
function renderConv(M) {
  const C = tokens(), I = M.I;
  legend($('#convLegend'), [[C.v1, `términos sumados (N = ${M.N})`, 'dot'], [C.off, 'no sumados', 'dot'], [C.v2, 'error eficaz', 'line'], [C.muted, 'pendientes de referencia', 'dash']]);
  const ds = -I.decaySlope, es = -I.errSlope;
  $('#convNote').textContent = `Pendiente medida de Aₙ: ${nf(-ds, 2)}, es decir Aₙ ∝ 1/n${ds > 1.5 ? '²' : ''}${I.W.jump ? ', típica de una señal con saltos' : ', típica de una señal continua con esquinas'}. Pendiente del error entre N = 10 y ${KMAX}: ${nf(-es, 2)} (la teoría da ${I.W.jump ? '−0,5' : '−1,5'}). Con N = ${M.N} el error eficaz es ${pc(M.errRel)} del valor eficaz de alterna.`;
}

function gibbsWindow(M) {
  const W = M.I.W, nm = Math.max(1, M.nmax);
  const a = clamp(8 * PI / (nm + 1), 0.02, PI);
  return [W.feat - a, W.feat + a];
}
anaCharts.anaGibbs = function drawGibbs() {
  const cv = $('#anaGibbs'), { ctx, w, h } = prep(cv), C = tokens(), M = curModel(), I = M.I, W = I.W, u = U();
  const [t0, t1] = gibbsWindow(M), n = Math.max(200, Math.round(w * 1.2));
  const curves = [{ key: 'ideal', col: C.muted, lw: 1.5, f: t => W.ideal(t) + I.off }, { key: 'S', col: C.v1, lw: 2, f: t => partial(M.terms, I.off, t) }];
  if (cfg.gLanczos) { const s = sigmaFactors(M.terms, 'lanczos'); curves.push({ key: 'L', col: C.v2, lw: 2, f: t => partial(M.terms, I.off, t, s) }); }
  if (cfg.gFejer) { const s = sigmaFactors(M.terms, 'fejer'); curves.push({ key: 'F', col: C.v3, lw: 2, f: t => partial(M.terms, I.off, t, s) }); }
  const ts = []; for (let i = 0; i <= n; i++) ts.push(t0 + (t1 - t0) * i / n);
  for (const cu of curves) cu.v = ts.map(cu.f);
  let mn = Infinity, mx = -Infinity; for (const cu of curves) for (const v of cu.v) { mn = Math.min(mn, v); mx = Math.max(mx, v); }
  const pad = (mx - mn) * 0.08 || 0.2;
  const lo = mn - pad, hi = mx + pad, box = { l: 58, r: w - 12, t: 10, b: h - 24 };
  const X = t => box.l + (t - t0) / (t1 - t0) * (box.r - box.l), Y = v => box.b - (v - lo) / (hi - lo) * (box.b - box.t);
  gridY(ctx, C, box, niceTicks(lo * u.A, hi * u.A, 4).map(v => v / u.A), Y, v => si(v * u.A, 'V', 3));
  const Tsec = 1 / u.f0, xt = niceTicks(t0 / TAU * Tsec, t1 / TAU * Tsec, 5).map(s => s / Tsec * TAU);
  axisX(ctx, C, box, xt, X, v => (Math.abs(v) < 1e-12 ? '0' : si(v / TAU * Tsec, 's', 3)));
  if (W.jump) { const yI = Math.round(Y(I.max)) + 0.5; ctx.setLineDash([4, 4]); ctx.strokeStyle = C.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(box.l, yI); ctx.lineTo(box.r, yI); ctx.stroke(); ctx.setLineDash([]); ctx.font = `500 10.5px ${FONT_MONO}`; ctx.fillStyle = C.muted; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText('máximo ideal', box.l + 4, yI + 3); }
  for (const cu of curves) { ctx.strokeStyle = cu.col; ctx.lineWidth = cu.lw; ctx.lineJoin = 'round'; ctx.beginPath(); cu.v.forEach((v, i) => { const x = X(ts[i]), y = Y(v); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); }
  // pico de la suma parcial
  const S = curves[1], top = Math.max(...S.v), tol = 2e-3 * (top - Math.min(...S.v)); let km = 0, bd = Infinity;
  S.v.forEach((v, i) => { const d = Math.abs(ts[i] - W.feat); if (v >= top - tol && d < bd) { bd = d; km = i; } });
  if (W.jump && M.over > 0.001) { const x = X(ts[km]), y = Y(S.v[km]); ringDot(ctx, x, y, 4.5, C.v1, C.surface); ctx.font = `600 11px ${FONT_MONO}`; ctx.fillStyle = C.ink; ctx.textAlign = x > (box.l + box.r) / 2 ? 'right' : 'left'; ctx.textBaseline = 'bottom'; ctx.fillText('+' + pc(M.over) + ' del salto', x + (ctx.textAlign === 'left' ? 8 : -8), Math.max(box.t + 12, y - 2)); }
  const hv = hovers.anaGibbs;
  if (hv != null) { const x = X(ts[hv]); ctx.strokeStyle = C.strong; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(Math.round(x) + 0.5, box.t); ctx.lineTo(Math.round(x) + 0.5, box.b); ctx.stroke(); for (const cu of curves) ringDot(ctx, x, Y(cu.v[hv]), 3.2, cu.col, C.surface); }
  gibbsData = { ts, curves, box, Tsec };
  const names = { ideal: 'señal ideal', S: `suma parcial S${sub(M.N)}`, L: 'σ de Lanczos', F: 'Fejér' };
  legend($('#gibbsLegend'), curves.map(cu => [cu.col, names[cu.key], cu.key === 'ideal' ? 'thin' : 'line']));
};
let gibbsData = null;
hoverable('anaGibbs', (px) => {
  const D = gibbsData; if (!D) return null;
  const i = clamp(Math.round((px - D.box.l) / (D.box.r - D.box.l) * (D.ts.length - 1)), 0, D.ts.length - 1);
  setHover('anaGibbs', i);
  const names = { ideal: 'ideal', S: 'suma parcial', L: 'Lanczos', F: 'Fejér' };
  return [[si(D.ts[i] / TAU * D.Tsec, 's', 3), 'instante']].concat(D.curves.map(cu => [si(cu.v[i] * cfg.amp, 'V', 4), names[cu.key]]));
});
anaCharts.anaGibbsN = function drawGibbsN() {
  const cv = $('#anaGibbsN'), { ctx, w, h } = prep(cv), C = tokens(), M = curModel(), I = M.I, W = I.W;
  const vals = []; for (let N = 1; N <= KMAX; N++) vals.push(100 * I.over[N]);
  const hi = Math.max(W.jump ? 100 * GIBBS * 1.25 : 0, ...vals) * 1.08, box = { l: 52, r: w - 12, t: 10, b: h - 24 };
  const X = logScale(1, KMAX, box.l, box.r), Y = v => box.b - v / hi * (box.b - box.t);
  gridY(ctx, C, box, niceTicks(0, hi, 3), Y, v => nf(v, v < 1 && v > 0 ? 1 : 0) + ' %');
  axisX(ctx, C, box, NTICKS, X, v => String(v));
  if (W.jump) { const y = Math.round(Y(100 * GIBBS)) + 0.5; ctx.setLineDash([4, 4]); ctx.strokeStyle = C.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(box.l, y); ctx.lineTo(box.r, y); ctx.stroke(); ctx.setLineDash([]); ctx.font = `500 10.5px ${FONT_MONO}`; ctx.fillStyle = C.muted; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText('límite de Gibbs: 8,95 %', box.r, y - 3); }
  ctx.strokeStyle = C.v1; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.beginPath();
  vals.forEach((v, i) => { const x = X(i + 1), y = Y(v); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
  const hv = hovers.anaGibbsN;
  if (hv) { const x = X(hv); ctx.strokeStyle = C.strong; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(Math.round(x) + 0.5, box.t); ctx.lineTo(Math.round(x) + 0.5, box.b); ctx.stroke(); }
  ringDot(ctx, X(M.N), Y(vals[M.N - 1]), 5, C.v1, C.surface);
  gibbsNData = { vals, X, box, jump: W.jump };
};
let gibbsNData = null;
hoverable('anaGibbsN', (px) => {
  const D = gibbsNData; if (!D) return null;
  const N = clamp(Math.round(Math.exp((px - D.box.l) / (D.box.r - D.box.l) * LOGN)), 1, KMAX);
  setHover('anaGibbsN', N);
  return [[pc(D.vals[N - 1] / 100), (D.jump ? 'sobrepico (del salto)' : 'error máximo (de A)') + ` con N = ${N}`]];
});
function renderGibbs(M) {
  const I = M.I, W = I.W;
  $('#gibbsSub').textContent = W.jump
    ? `Cerca de ${W.featTxt}, la suma parcial se pasa alrededor de un 9 % del salto por más términos que se sumen: el sobrepico se angosta pero no baja.`
    : `Esta señal es continua, así que no hay sobrepico: la serie converge uniformemente. Lo que se ve es cómo la suma redondea ${W.featTxt}.`;
  $('#gibbsNCap').firstChild.textContent = W.jump ? 'Sobrepico según N ' : 'Error máximo según N ';
  $('#gibbsNCap span').textContent = W.jump ? '% del salto' : '% de la amplitud A';
  const t = $('#gibbsTable'); t.replaceChildren();
  const thead = document.createElement('thead'); thead.innerHTML = `<tr><th scope="col">Con N = ${M.N}</th><th scope="col">Máximo</th><th scope="col">${W.jump ? 'Sobrepico (del salto)' : 'Error máximo (de A)'}</th></tr>`;
  const tb = document.createElement('tbody');
  const rows = [['Suma parcial', { max: M.maxN, over: M.over }], ['σ de Lanczos', smoothStats(I, M.terms, 'lanczos')], ['Fejér', smoothStats(I, M.terms, 'fejer')]];
  for (const [name, st] of rows) { const tr = document.createElement('tr'); for (const v of [name, si(st.max * cfg.amp, 'V', 4), pc(st.over)]) { const td = document.createElement('td'); td.textContent = v; tr.appendChild(td); } tb.appendChild(tr); }
  t.append(thead, tb);
  $('#gibbsNote').textContent = W.jump
    ? `El límite teórico es (Si(π)/π − 1/2) ≈ 8,95 % del salto. ${cfg.wave === 'sierra' ? 'La diente de sierra se acerca más despacio porque cerca del salto la propia señal todavía está subiendo. ' : ''}Los factores σ atenúan las armónicas altas: Lanczos deja un sobrepico chico y Fejér ninguno, a cambio de un salto más lento.`
    : `El error máximo baja como 1/N porque los coeficientes bajan como 1/n². Los factores σ redondean todavía más la esquina, así que acá no ayudan.`;
}

/* ---------- render del Análisis ---------- */
let anaDirty = true;
function renderAnalysis() {
  anaDirty = false;
  const M = curModel();
  renderLead(M); renderParams(M); renderPower(M); renderTHD(M); renderSym(M); renderCoef(M); renderConv(M); renderGibbs(M);
  for (const id of Object.keys(anaCharts)) anaCharts[id]();
  typesetPanel($('#ana'));
}

/* ---------- controles ---------- */
function syncControls() {
  $$('[data-bind="wave"] button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === cfg.wave)));
  $('#anaWaveSel').value = cfg.wave;
  const rect = cfg.wave === 'rectificada';
  $$('[data-bind="dc"] button').forEach(b => { b.setAttribute('aria-pressed', String((b.dataset.v === '1') === cfg.dc)); if (b.dataset.v === '1') { if (rect) b.setAttribute('aria-disabled', 'true'); else b.removeAttribute('aria-disabled'); } });
  for (const id of ['nRange', 'anaN']) {
    const el = $('#' + id);
    if (posToN(+el.value) !== cfg.N) el.value = nToPos(cfg.N);   // no mueve el que se está arrastrando
    el.setAttribute('aria-valuetext', `${cfg.N} ${cfg.N === 1 ? 'término' : 'términos'}`);
  }
  for (const id of ['nNum', 'anaNum']) { const el = $('#' + id); if (!(document.activeElement === el && parseInt(el.value, 10) === cfg.N)) el.value = cfg.N; }
  $('#speed').value = cfg.speed; $('#speedOut').textContent = `${nf(TAU / (cfg.speed * RATE), 1)} s/período`;
  $('#speed').setAttribute('aria-valuetext', `${cfg.speed}, ${nf(TAU / (cfg.speed * RATE), 1)} segundos por período`);
  $('#zoom').value = cfg.zoom; $('#zoomOut').textContent = '±' + nf(cfg.zoom, 1);
  $('#zoom').setAttribute('aria-valuetext', 'de menos ' + nf(cfg.zoom, 1) + ' a ' + nf(cfg.zoom, 1));
  for (const k of ['showConn', 'showRef', 'showCircles', 'showGrid', 'gLanczos', 'gFejer']) $('#' + k).checked = !!cfg[k];
  $$('[data-bind="specMode"] button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === cfg.specMode)));
  $$('[data-bind="specScale"] button').forEach(b => { b.setAttribute('aria-pressed', String(b.dataset.v === cfg.specScale)); if (cfg.specMode === 'fase') b.setAttribute('aria-disabled', 'true'); else b.removeAttribute('aria-disabled'); });
}
let anaRaf = 0;
function scheduleAnalysis() { if (!anaRaf) anaRaf = requestAnimationFrame(() => { anaRaf = 0; if (!$('#ana').hidden) renderAnalysis(); }); }
function refreshAll() {
  updateLabText(); drawLabSpec(); comp.key = ''; lab.dirty = true; scheduleFormula();
  if (!$('#ana').hidden) scheduleAnalysis(); else anaDirty = true;
}
function onSignalChange() { labSync(); resetLab(lab.playing ? 0 : 2.5 * PI); lab.hi = -1; syncControls(); refreshAll(); }
function setWave(w) {
  if (!WAVES[w] || w === cfg.wave) return;
  cfg.wave = w;
  if (w === 'rectificada' && cfg.dc) { cfg.dc = false; cfg.zoom = 1.5; }
  saveCfg(); onSignalChange();
}
function setDC(on) {
  if (cfg.wave === 'rectificada' || on === cfg.dc) return;
  cfg.dc = on; cfg.zoom = on ? 2.5 : 1.5;   // mismo ajuste automático que la versión de escritorio
  saveCfg(); onSignalChange();
}
const LOGN = Math.log(KMAX);
const nToPos = n => Math.round(Math.log(n) / LOGN * 1000);
const posToN = p => clamp(Math.round(Math.exp(p / 1000 * LOGN)), 1, KMAX);
function setN(N) {
  N = clamp(Math.round(N), 1, KMAX);
  if (N === cfg.N) { syncControls(); return; }
  cfg.N = N; saveCfg(); labSync(); lab.hi = -1; syncControls(); refreshAll();
}
function setPlaying(p) {
  lab.playing = p; lab.last = null;
  $('#play').setAttribute('aria-label', p ? 'Pausar' : 'Reproducir');
  $('#playIcon').setAttribute('d', p ? 'M7 5h4v14H7zM13 5h4v14h-4z' : 'M8 5v14l11-7z');
}
function bindControls() {
  document.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const g = b.closest('[data-bind]');
    if (g && b.dataset.v != null) {
      const k = g.dataset.bind;
      if (b.getAttribute('aria-disabled') === 'true') return;
      if (k === 'wave') setWave(b.dataset.v);
      else if (k === 'dc') setDC(b.dataset.v === '1');
      else if (k === 'specMode' || k === 'specScale') { cfg[k] = b.dataset.v; saveCfg(); syncControls(); hovers.anaSpec = null; redrawChart('anaSpec'); }
      return;
    }
    if (b.dataset.n && b.closest('[data-quick="N"]')) setN(+b.dataset.n);
  });
  for (const id of ['nRange', 'anaN']) {
    const el = $('#' + id);
    el.addEventListener('input', () => setN(posToN(+el.value)));
    // con el teclado, el deslizador avanza de a un término (de a 10 con RePág/AvPág)
    el.addEventListener('keydown', e => {
      const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 }[e.key];
      if (step) { e.preventDefault(); setN(cfg.N + step); }
      else if (e.key === 'Home') { e.preventDefault(); setN(1); }
      else if (e.key === 'End') { e.preventDefault(); setN(KMAX); }
    });
  }
  for (const id of ['nNum', 'anaNum']) {
    const el = $('#' + id);
    el.max = KMAX;
    el.addEventListener('input', () => { const v = parseInt(el.value, 10); if (v >= 1 && v <= KMAX) setN(v); });
    el.addEventListener('change', () => { const v = parseInt(el.value, 10); setN(Number.isFinite(v) ? v : cfg.N); el.value = cfg.N; });
  }
  $('#speed').addEventListener('input', e => { cfg.speed = +e.target.value; saveCfg(); syncControls(); });
  $('#zoom').addEventListener('input', e => { cfg.zoom = +e.target.value; saveCfg(); syncControls(); lab.dirty = true; });
  for (const k of ['showConn', 'showRef', 'showCircles', 'showGrid']) $('#' + k).addEventListener('change', e => { cfg[k] = e.target.checked; saveCfg(); lab.dirty = true; });
  for (const k of ['gLanczos', 'gFejer']) $('#' + k).addEventListener('change', e => { cfg[k] = e.target.checked; saveCfg(); redrawChart('anaGibbs'); });
  const units = [['amp', 'amp'], ['f0', 'f0'], ['res', 'R']];
  for (const [id, key] of units) {
    const el = $('#' + id); el.value = String(cfg[key]).replace('.', ',');
    el.addEventListener('input', () => {
      const v = parseFloat(el.value.trim().replace(/\s/g, '').replace(',', '.'));
      const ok = Number.isFinite(v) && v > 0 && v < 1e9;
      el.setAttribute('aria-invalid', String(!ok));
      if (!ok) return;
      cfg[key] = v; saveCfg(); if (!$('#ana').hidden) renderAnalysis(); else anaDirty = true;
    });
    el.addEventListener('change', () => { el.value = String(cfg[key]).replace('.', ','); el.setAttribute('aria-invalid', 'false'); });
  }
  $('#play').addEventListener('click', () => setPlaying(!lab.playing));
  $('#reset').addEventListener('click', () => { resetLab(lab.playing ? 0 : 0); updateLive(); });
  view.addEventListener('click', () => setPlaying(!lab.playing));
  // resaltar una armónica desde el espectro o las componentes
  $('#labSpec').addEventListener('pointermove', e => {
    const r = e.currentTarget.getBoundingClientRect(), px = e.clientX - r.left;
    let best = null, bd = 16; for (const o of labSpec.items) { const d = Math.abs(labSpec.X(o.n) - px); if (d < bd) { bd = d; best = o; } }
    setHi(best && best.idx >= 0 ? best.idx : -1);
    if (best) { const I = lab.M.I; showTip([[nf(best.A, 4), best.dc ? 'componente continua' : `amplitud de la armónica n = ${best.n}`], [best.dc ? '' : pc(best.A * best.A / 2 / I.Pac), best.dc ? 'no gira' : 'de la potencia de alterna'], ['', best.used ? 'incluida en la suma' : 'todavía no sumada']], e.clientX, e.clientY); } else hideTip();
  });
  $('#labSpec').addEventListener('pointerleave', () => { setHi(-1); hideTip(); });
  $('#labComp').addEventListener('pointermove', e => {
    const r = e.currentTarget.getBoundingClientRect(), py = e.clientY - r.top;
    const j = Math.floor((py - comp.t) / comp.rowH), row = comp.rows[j];
    setHi(row && row.idx >= 0 ? row.idx : -1);
  });
  $('#labComp').addEventListener('pointerleave', () => setHi(-1));
  $('#copyCoef').addEventListener('click', () => {
    const done = msg => { $('#copyStatus').textContent = msg; };
    const fallback = () => {
      try { const ta = document.createElement('textarea'); ta.value = coefTSV; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); done(ok ? 'Tabla copiada. Pegala en una planilla.' : 'No se pudo copiar: seleccioná la tabla y copiala a mano.'); }
      catch { done('No se pudo copiar: seleccioná la tabla y copiala a mano.'); }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(coefTSV).then(() => done('Tabla copiada. Pegala en una planilla.'), fallback);
    else fallback();
  });
  // Análisis: selector compacto de señal, unidades plegables e índice de secciones
  $('#anaWaveSel').addEventListener('change', e => setWave(e.target.value));
  $('#unitsToggle').addEventListener('click', e => {
    const open = e.currentTarget.getAttribute('aria-expanded') !== 'true';
    e.currentTarget.setAttribute('aria-expanded', String(open));
    $('#anaUnits').classList.toggle('open', open);
  });
  $('#anaToc').addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a) return;
    e.preventDefault();
    const card = $(a.getAttribute('href'));
    if (card) card.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'start' });
  });
  // índice: marca la primera tarjeta (en el orden de lectura) que cruza la franja superior de la pantalla
  const tocLinks = $$('#anaToc a'), tarjetas = $$('.ana-grid > .card'), enFranja = new Set();
  const tocObs = new IntersectionObserver(es => {
    for (const en of es) { if (en.isIntersecting) enFranja.add(en.target.id); else enFranja.delete(en.target.id); }
    const actual = tarjetas.find(c => enFranja.has(c.id));
    if (!actual) return;
    tocLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + actual.id));
    const on = tocLinks.find(a => a.classList.contains('on')), toc = $('#anaToc');
    if (on && toc.scrollWidth > toc.clientWidth) toc.scrollTo({ left: on.offsetLeft - 12, behavior: REDUCE ? 'auto' : 'smooth' });
  }, { rootMargin: '-20% 0px -60% 0px' });
  tarjetas.forEach(c => tocObs.observe(c));
  // teclado: Espacio, R y + / −
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const el = e.target instanceof Element ? e.target : null;
    if (el && el.closest('input, textarea, select, button, [contenteditable]')) return;
    if ($('#lab').hidden && !['+', '-', '=', '_'].includes(e.key)) return;
    if (e.key === ' ') { e.preventDefault(); setPlaying(!lab.playing); }
    else if (e.key === 'r' || e.key === 'R') { resetLab(0); updateLive(); }
    else if (e.key === '+' || e.key === '=') setN(cfg.N + 1);
    else if (e.key === '-' || e.key === '_') setN(cfg.N - 1);
  });
}

/* ---------- pestañas ---------- */
const TABS = $$('[role="tab"]');
function showTab(id, focus) {
  for (const t of TABS) { const on = t.dataset.tab === id; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; $('#' + t.dataset.tab).hidden = !on; if (on && focus) t.focus(); }
  cfg.tab = id; saveCfg();
  const t = TABS.find(x => x.dataset.tab === id);
  try { history.replaceState(null, '', '#' + t.dataset.hash); } catch { /* sin historial */ }
  avisarRuta(t.dataset.hash);
  hideTip();
  if (id === 'lab') { layoutStage(); drawLabSpec(); comp.key = ''; lab.dirty = true; }
  else if (id === 'ana') renderAnalysis();
  else typesetPanel($('#fun'));
}
/* Dentro de la portada (iframe): avisa en qué pestaña está y acepta pedidos de cambio de pestaña */
function avisarRuta(ruta) { if (window.parent !== window) { try { window.parent.postMessage({ fourier: 'ruta', ruta }, '*'); } catch { /* sin portada */ } } }
addEventListener('message', e => {
  const d = e.data;
  if (e.source !== window.parent || !d || d.fourier !== 'ir' || typeof d.ruta !== 'string') return;
  const id = { laboratorio: 'lab', analisis: 'ana', fundamentos: 'fun' }[d.ruta];
  if (id) showTab(id);
});
function bindTabs() {
  TABS.forEach((t, i) => {
    t.addEventListener('click', () => showTab(t.dataset.tab));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % TABS.length; else if (e.key === 'ArrowLeft') j = (i - 1 + TABS.length) % TABS.length; else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = TABS.length - 1;
      if (j != null) { e.preventDefault(); showTab(TABS[j].dataset.tab, true); }
    });
  });
}

/* ---------- bucle de animación ---------- */
function frame(now) {
  if (lab.last == null) lab.last = now;
  const dt = Math.min(0.1, (now - lab.last) / 1000); lab.last = now;
  if (lab.playing && dt > 0) advance(dt * cfg.speed * RATE);
  if (!$('#lab').hidden && lab.dirty && lab.L) {
    drawStage(); drawCompFrame(); lab.dirty = false;
    if (now - lab.lastText > 100) { updateLive(); lab.lastText = now; }
  }
  requestAnimationFrame(frame);
}

/* ---------- MathJax ---------- */
window.MathJax = {
  tex: { inlineMath: [['\\(', '\\)']], displayMath: [['\\[', '\\]']] },
  svg: { fontCache: 'local' },
  options: { enableMenu: false, ignoreHtmlClass: 'tex-dyn' },
  startup: {
    typeset: false,
    ready() {
      window.MathJax.startup.defaultReady();
      window.MathJax.startup.promise.then(() => {
        // hoja de estilos de la salida SVG: oculta la copia MathML para lectores de pantalla
        try { const ss = window.MathJax.svgStylesheet(); ss.id = 'mjx-svg-styles'; document.head.appendChild(ss); } catch { /* sigue sin estilos */ }
        mjReady = true;
        for (const [el, lines] of pendingTex) setTex(el, lines);
        pendingTex.clear();
        for (const el of pendingPanels) if (!el.hidden) typesetPanel(el);
        pendingPanels.clear();
      });
    },
  },
};

/* ---------- arranque ---------- */
function init() {
  document.documentElement.lang = 'es';
  bindTabs(); bindControls();
  labSync(); syncControls();
  layoutStage();
  resetLab(2.5 * PI);
  setPlaying(lab.playing);
  updateLabText(); drawLabSpec(); scheduleFormula();
  const fromHash = { '#laboratorio': 'lab', '#analisis': 'ana', '#fundamentos': 'fun' }[location.hash];
  showTab(fromHash || 'lab');
  let rt = 0;
  new ResizeObserver(() => { if (layoutStage()) { comp.key = ''; drawLabSpec(); } }).observe($('#stage'));
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { layoutStage(); drawLabSpec(); comp.key = ''; if (!$('#ana').hidden) for (const id of Object.keys(anaCharts)) anaCharts[id](); }, 120); });
  const retheme = () => { tokCache = null; ST = temaOscuro() ? PANTALLA.oscuro : PANTALLA.claro; comp.key = ''; lab.dirty = true; drawLabSpec(); drawStage(); if (!$('#ana').hidden) { for (const id of Object.keys(anaCharts)) anaCharts[id](); renderConv(curModel()); } };
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', retheme);
  new MutationObserver(retheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  document.fonts && document.fonts.ready.then(() => { comp.key = ''; drawLabSpec(); lab.dirty = true; if (!$('#ana').hidden) renderAnalysis(); });
  const mj = document.createElement('script');
  mj.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.min.js';
  mj.async = true;
  document.head.appendChild(mj);
  requestAnimationFrame(frame);
}
/* Dentro de la portada, los enlaces a otra herramienta le piden a la portada que la abra, sin recargar nada */
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-abrir]');
  if (!a || window.parent === window) return;
  e.preventDefault();
  try { window.parent.postMessage({ fourier: 'abrir', destino: a.dataset.abrir }, '*'); } catch { location.href = a.href; }
});
/* Tema elegido con el botón de la portada */
addEventListener('message', e => {
  const d = e.data;
  if (e.source !== window.parent || !d || d.fourier !== 'tema') return;
  if (d.tema === 'light' || d.tema === 'dark') document.documentElement.dataset.theme = d.tema;
  else delete document.documentElement.dataset.theme;
});
init();
