'use strict';
const TAU = Math.PI * 2, DEG = Math.PI / 180;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Figuras: claras en el tema claro, oscuras en el oscuro */
const PANTALLA = {
  claro: { bg: '#ffffff', grid: 'rgba(20,23,22,0.07)', axis: 'rgba(20,23,22,0.28)', ghost: 'rgba(20,23,22,0.25)', circle: 'rgba(89,97,92,0.42)', arm: 'rgba(20,23,22,0.88)', trace: '#1f7a4d', glow: 'rgba(0,0,0,0)', x: '#2d6f9a', y: '#b85c2c', sample: '#8a6d1f', text: '#2a2f2c', muted: '#6b736d', pen: '#141716', faint: 'rgba(20,23,22,0.22)', guideY: 'rgba(184,92,44,0.6)', trap: 'rgba(20,23,22,0.55)' },
  oscuro: { bg: '#0b0d0e', grid: 'rgba(160,200,180,0.08)', axis: 'rgba(160,200,180,0.26)', ghost: 'rgba(170,200,185,0.3)', circle: 'rgba(170,190,180,0.34)', arm: 'rgba(236,240,238,0.92)', trace: '#7fd1a0', glow: 'rgba(0,0,0,0)', x: '#7cc4e8', y: '#e8a07a', sample: '#d9c27a', text: '#cfd6d1', muted: '#7f8a84', pen: '#ffffff', faint: 'rgba(255,255,255,0.25)', guideY: 'rgba(232,160,122,0.6)', trap: 'rgba(170,200,185,0.8)' },
};
const temaOscuro = () => (document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';
let COL = temaOscuro() ? PANTALLA.oscuro : PANTALLA.claro;
const FONT_MONO = '"JetBrains Mono", Consolas, monospace';

/* ---------- números ---------- */
const zero = (v, d) => Math.abs(v) < 0.5 * 10 ** -d ? 0 : v;
const fmt = (v, d = 3) => zero(v, d).toFixed(d).replace('-', '−').replace('.', ',');
const tnum = (v, d = 3) => zero(v, d).toFixed(d).replace('.', '{,}');
const fmtC = (c, d = 3) => { const re = zero(c[0], d), im = zero(c[1], d); if (im === 0) return fmt(re, d); if (re === 0) return fmt(im, d) + 'i'; return fmt(re, d) + (im < 0 ? ' − ' : ' + ') + fmt(Math.abs(im), d) + 'i'; };
const texC = (c, d = 3) => { const re = zero(c[0], d), im = zero(c[1], d); if (im === 0) return tnum(re, d); if (re === 0) return tnum(im, d) + 'i'; return '(' + tnum(re, d) + (im < 0 ? '-' : '+') + tnum(Math.abs(im), d) + 'i)'; };
const degOf = r => { let d = r / DEG; d = ((d + 180) % 360 + 360) % 360 - 180; return Math.abs(d + 180) < 1e-6 ? 180 : d; };

/* ---------- FFT radix 2 en el lugar (signo −) ---------- */
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const half = len >> 1, ang = -TAU / len;
    for (let k = 0; k < half; k++) {
      const wr = Math.cos(ang * k), wi = Math.sin(ang * k);
      for (let i = k; i < n; i += len) {
        const j = i + half, tr = re[j] * wr - im[j] * wi, ti = re[j] * wi + im[j] * wr;
        re[j] = re[i] - tr; im[j] = im[i] - ti; re[i] += tr; im[i] += ti;
      }
    }
  }
}
function fftMap(xs, ys) {
  const M = xs.length, re = Float64Array.from(xs), im = Float64Array.from(ys);
  fft(re, im);
  const map = new Map();
  for (let j = 0; j < M; j++) map.set(j < M / 2 ? j : j - M, [re[j] / M, im[j] / M]);
  return map;
}

/* ---------- coeficientes ---------- */
const termOf = (n, c) => ({ n, re: c[0], im: c[1], amp: Math.hypot(c[0], c[1]), ph: Math.atan2(c[1], c[0]) });
function termsFromMap(map) {
  const out = [];
  for (const [n, c] of map) if (n !== 0) { const T = termOf(n, c); if (T.amp > 1e-10) out.push(T); }
  return out.sort((a, b) => b.amp - a.amp || Math.abs(a.n) - Math.abs(b.n));
}
function harmonicsFromMap(map) {
  let K = 0;
  for (const n of map.keys()) K = Math.max(K, Math.abs(n));
  const xs = [], ys = [];
  for (let k = 1; k <= K; k++) {
    const cp = map.get(k) || [0, 0], cm = map.get(-k) || [0, 0];
    const a = cp[0] + cm[0], b = cm[1] - cp[1], p = cp[1] + cm[1], q = cp[0] - cm[0];
    if (Math.hypot(a, b) > 1e-10) xs.push({ k, a, b, A: Math.hypot(a, b), phi: Math.atan2(b, a) });
    if (Math.hypot(p, q) > 1e-10) ys.push({ k, a: p, b: q, A: Math.hypot(p, q), phi: Math.atan2(q, p) });
  }
  const by = (u, v) => v.A - u.A || u.k - v.k;
  return { x: xs.sort(by), y: ys.sort(by) };
}
function polySamples(V, M) {
  const n = V.length, L = [], cum = [0];
  for (let i = 0; i < n; i++) { const a = V[i], b = V[(i + 1) % n]; L.push(Math.hypot(b[0] - a[0], b[1] - a[1])); cum.push(cum[i] + L[i]); }
  const P = cum[n], xs = new Float64Array(M), ys = new Float64Array(M);
  let j = 0;
  for (let k = 0; k < M; k++) {
    const s = k * P / M;
    while (j < n - 1 && cum[j + 1] <= s) j++;
    const a = V[j], b = V[(j + 1) % n], u = L[j] > 0 ? (s - cum[j]) / L[j] : 0;
    xs[k] = a[0] + (b[0] - a[0]) * u; ys[k] = a[1] + (b[1] - a[1]) * u;
  }
  return { xs, ys };
}
/* Fórmula de los vértices: coeficientes exactos de un polígono a velocidad constante */
function vertexMap(V, K) {
  const n = V.length, E = [], L = [];
  let P = 0;
  for (let i = 0; i < n; i++) { const a = V[i], b = V[(i + 1) % n]; E.push([b[0] - a[0], b[1] - a[1]]); L.push(Math.hypot(E[i][0], E[i][1])); P += L[i]; }
  const t = []; let acc = 0;
  for (let i = 0; i < n; i++) { t.push(acc / P); acc += L[i]; }
  const v = E.map((e, i) => [e[0] * P / L[i], e[1] * P / L[i]]);
  const dv = v.map((vi, i) => { const pv = v[(i - 1 + n) % n]; return [vi[0] - pv[0], vi[1] - pv[1]]; });
  let cx = 0, cy = 0;
  for (let i = 0; i < n; i++) { const a = V[i], b = V[(i + 1) % n]; cx += (a[0] + b[0]) / 2 * L[i]; cy += (a[1] + b[1]) / 2 * L[i]; }
  const map = new Map([[0, [cx / P, cy / P]]]);
  for (let m = 1; m <= K; m++) for (const s of [m, -m]) {
    let re = 0, im = 0;
    for (let i = 0; i < n; i++) { const ang = -TAU * s * t[i], c = Math.cos(ang), sn = Math.sin(ang); re += dv[i][0] * c - dv[i][1] * sn; im += dv[i][0] * sn + dv[i][1] * c; }
    const f = -1 / (4 * Math.PI ** 2 * s * s);
    map.set(s, [re * f, im * f]);
  }
  return map;
}
const evalChain = (c0, sel, t) => { let x = c0[0], y = c0[1]; for (const T of sel) { const a = TAU * T.n * t + T.ph; x += T.amp * Math.cos(a); y += T.amp * Math.sin(a); } return [x, y]; };
const evalAxis = (v0, sel, t) => { let v = v0; for (const T of sel) v += T.A * Math.cos(TAU * T.k * t - T.phi); return v; };

/* ---------- escenario ---------- */
class Stage {
  constructor(cv) {
    this.cv = cv; this.ctx = cv.getContext('2d'); this.fit();
    new ResizeObserver(() => { if (this.fit()) { this.onresize && this.onresize(); } }).observe(cv);
  }
  fit() {
    const r = this.cv.getBoundingClientRect();
    const W = Math.max(10, r.width), H = Math.max(10, r.height), dpr = Math.min(2, devicePixelRatio || 1);
    const changed = W !== this.W || H !== this.H || dpr !== this.dpr;
    this.W = W; this.H = H; this.dpr = dpr;
    const w = Math.round(W * dpr), h = Math.round(H * dpr);
    if (this.cv.width !== w || this.cv.height !== h) { this.cv.width = w; this.cv.height = h; }
    return changed;
  }
  clear() { const c = this.ctx; c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); c.globalAlpha = 1; c.setLineDash([]); c.fillStyle = COL.bg; c.fillRect(0, 0, this.W, this.H); }
  view(minX, maxX, minY, maxY, pad = 18) {
    const s = Math.min((this.W - 2 * pad) / Math.max(1e-9, maxX - minX), (this.H - 2 * pad) / Math.max(1e-9, maxY - minY));
    this.s = s; this.ox = this.W / 2 - s * (minX + maxX) / 2; this.oy = this.H / 2 + s * (minY + maxY) / 2;
  }
  X(x) { return this.ox + this.s * x; }
  Y(y) { return this.oy - this.s * y; }
  invX(px) { return (px - this.ox) / this.s; }
  invY(py) { return (this.oy - py) / this.s; }
}
function axes(st) {
  const c = st.ctx; c.strokeStyle = COL.grid; c.lineWidth = 1; c.beginPath();
  c.moveTo(0, st.Y(0)); c.lineTo(st.W, st.Y(0)); c.moveTo(st.X(0), 0); c.lineTo(st.X(0), st.H); c.stroke();
}
function polyPath(st, pts, closed) {
  const p = new Path2D();
  pts.forEach(([x, y], i) => i ? p.lineTo(st.X(x), st.Y(y)) : p.moveTo(st.X(x), st.Y(y)));
  if (closed) p.closePath();
  return p;
}
function dot(st, x, y, r, color) { const c = st.ctx; c.fillStyle = color; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }

/* Cadenas: 1 eje (complejo) y 2 ejes (x arriba, y a la izquierda) */
function chain1(st, c0, sel, t, alpha = 1) {
  const c = st.ctx; let x = c0[0], y = c0[1];
  const circ = new Path2D(), arms = new Path2D();
  arms.moveTo(st.X(x), st.Y(y));
  for (const T of sel) {
    const a = TAU * T.n * t + T.ph, r = T.amp * st.s;
    if (r > 0.6) { circ.moveTo(st.X(x) + r, st.Y(y)); circ.arc(st.X(x), st.Y(y), r, 0, TAU); }
    x += T.amp * Math.cos(a); y += T.amp * Math.sin(a);
    arms.lineTo(st.X(x), st.Y(y));
  }
  c.globalAlpha = alpha; c.lineWidth = 1.1; c.strokeStyle = COL.circle; c.stroke(circ);
  c.lineWidth = 1.6; c.strokeStyle = COL.arm; c.lineJoin = 'round'; c.stroke(arms); c.globalAlpha = 1;
  return [st.X(x), st.Y(y)];
}
function chains2(st, c0, selX, selY, t) {
  const c = st.ctx;
  let sx = st.X(c0[0]), sy = st.bandY;
  const cx = new Path2D(), ax = new Path2D(); ax.moveTo(sx, sy);
  for (const T of selX) { const a = TAU * T.k * t - T.phi, r = T.A * st.s; if (r > 0.6) { cx.moveTo(sx + r, sy); cx.arc(sx, sy, r, 0, TAU); } sx += r * Math.cos(a); sy -= r * Math.sin(a); ax.lineTo(sx, sy); }
  let tx = st.bandX, ty = st.Y(c0[1]);
  const cy = new Path2D(), ay = new Path2D(); ay.moveTo(tx, ty);
  for (const T of selY) { const a = TAU * T.k * t - T.phi, r = T.A * st.s; if (r > 0.6) { cy.moveTo(tx + r, ty); cy.arc(tx, ty, r, 0, TAU); } tx += r * Math.sin(a); ty -= r * Math.cos(a); ay.lineTo(tx, ty); }
  c.lineWidth = 1.1; c.strokeStyle = COL.circle; c.stroke(cx); c.stroke(cy);
  c.lineWidth = 1.7; c.lineJoin = 'round'; c.strokeStyle = COL.x; c.stroke(ax); c.strokeStyle = COL.y; c.stroke(ay);
  c.setLineDash([5, 5]); c.lineWidth = 1.2;
  c.strokeStyle = COL.x; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx, ty); c.stroke();
  c.strokeStyle = COL.y; c.beginPath(); c.moveTo(tx, ty); c.lineTo(sx, ty); c.stroke();
  c.setLineDash([]);
  dot(st, sx, sy, 3, COL.x); dot(st, tx, ty, 3, COL.y);
  return [sx, ty];
}

/* Vista de epiciclos reutilizable */
class EpiView {
  constructor(st, opt = {}) { this.st = st; this.mode = 1; this.N = 5; this.fixed = opt.fixed || null; this.ghost = null; this.dots = null; st.onresize = () => { this.layout(); this.draw(this.lastPh ?? 0); }; }
  setMap(map) { this.map = map; this.c0 = map.get(0) || [0, 0]; this.terms = termsFromMap(map); this.harm = harmonicsFromMap(map); this.recompute(); }
  recompute() {
    const K = 900, xs = new Float64Array(K + 1), ys = new Float64Array(K + 1);
    if (this.mode === 1) {
      this.sel = this.terms.slice(0, this.N);
      for (let k = 0; k <= K; k++) { const p = evalChain(this.c0, this.sel, k / K); xs[k] = p[0]; ys[k] = p[1]; }
    } else {
      this.selX = this.harm.x.slice(0, this.N); this.selY = this.harm.y.slice(0, this.N);
      for (let k = 0; k <= K; k++) { xs[k] = evalAxis(this.c0[0], this.selX, k / K); ys[k] = evalAxis(this.c0[1], this.selY, k / K); }
    }
    this.curve = { xs, ys };
    this.layout();
  }
  bbox() {
    if (this.fixed) return this.fixed.box;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    const add = (x, y) => { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; };
    if (this.ghost) for (const [x, y] of this.ghost.pts) add(x, y);
    for (let k = 0; k < this.curve.xs.length; k += 3) add(this.curve.xs[k], this.curve.ys[k]);
    return [minX, maxX, minY, maxY];
  }
  layout() {
    const st = this.st; st.fit();
    let [minX, maxX, minY, maxY] = this.bbox();
    if (this.mode === 1) {
      const r1 = this.sel && this.sel.length ? this.sel[0].amp : 0, c0 = this.c0;
      if (!this.fixed) { minX = Math.min(minX, c0[0] - r1); maxX = Math.max(maxX, c0[0] + r1); minY = Math.min(minY, c0[1] - r1); maxY = Math.max(maxY, c0[1] + r1); }
      st.view(minX, maxX, minY, maxY, 16);
      return;
    }
    const reach = list => {
      const top = list.slice(0, 30); let m = top.length ? top[0].A : 0;
      for (let k = 0; k < 96; k++) { let acc = 0; for (const T of top) { acc += T.A * Math.sin(TAU * T.k * k / 96 - T.phi); m = Math.max(m, Math.abs(acc)); } }
      return m;
    };
    const Sw = Math.max(1e-6, maxX - minX), Sh = Math.max(1e-6, maxY - minY), cap = 0.7 * Math.max(Sw, Sh);
    const rx = this.fixed ? this.fixed.reach : Math.min(reach(this.selX), cap), ry = this.fixed ? this.fixed.reach : Math.min(reach(this.selY), cap);
    const pad = 12, gap = 12;
    const s = Math.min((st.W - 2 * pad - gap) / (2 * ry + Sw), (st.H - 2 * pad - gap) / (2 * rx + Sh));
    const totW = 2 * ry * s + gap + Sw * s, totH = 2 * rx * s + gap + Sh * s;
    const x0 = (st.W - totW) / 2, y0 = (st.H - totH) / 2;
    st.s = s; st.bandX = x0 + ry * s; st.bandY = y0 + rx * s;
    st.ox = x0 + 2 * ry * s + gap - s * minX; st.oy = y0 + 2 * rx * s + gap + s * maxY;
  }
  draw(ph) {
    this.lastPh = ph;
    const st = this.st, c = st.ctx;
    st.clear();
    if (this.mode === 1 && this.showAxes) axes(st);
    if (this.ghost) { c.strokeStyle = COL.ghost; c.lineWidth = 2; c.lineJoin = 'round'; c.stroke(polyPath(st, this.ghost.pts, this.ghost.closed)); }
    if (this.dots) for (const [x, y] of this.dots) dot(st, st.X(x), st.Y(y), 2.6, COL.sample);
    if (this.extra) this.extra(st);
    const K = this.curve.xs.length - 1, upto = Math.min(K, Math.floor(ph * K));
    const tr = new Path2D();
    for (let k = 0; k <= upto; k++) { const px = st.X(this.curve.xs[k]), py = st.Y(this.curve.ys[k]); k ? tr.lineTo(px, py) : tr.moveTo(px, py); }
    const tip = this.mode === 1 ? chain1(st, this.c0, this.sel, ph) : chains2(st, this.c0, this.selX, this.selY, ph);
    tr.lineTo(tip[0], tip[1]);
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.strokeStyle = COL.glow; c.lineWidth = 6; c.stroke(tr);
    c.strokeStyle = COL.trace; c.lineWidth = 2.2; c.stroke(tr);
    dot(st, tip[0], tip[1], 3.4, COL.pen);
  }
  circles() { return this.mode === 1 ? this.sel.length : this.selX.length + this.selY.length; }
}

/* ---------- ecuaciones en vivo (MathJax si está, texto si no) ---------- */
let mjReady = false;
const pendingTex = new Map();
function setTex(el, lines) {
  el._tex = lines;
  if (!mjReady) { el.innerHTML = ''; const p = document.createElement('div'); p.className = 'fallback'; p.textContent = lines.join('\n'); el.appendChild(p); pendingTex.set(el, lines); return; }
  el.replaceChildren(...lines.map(tex => { try { return window.MathJax.tex2svg(tex, { display: true }); } catch { const d = document.createElement('div'); d.className = 'fallback'; d.textContent = tex; return d; } }));
}
const freqTex = (n, cplx) => { const m = 2 * n; const coef = Math.abs(m) === 1 ? '' : String(Math.abs(m)); return (m < 0 ? '-' : '') + coef + '\\pi ' + (cplx ? 'i\\,' : '') + 't'; };
/* Reparte los términos en renglones de a dos para que la ecuación no se desborde */
function texLines(lhs, parts, more) {
  if (!parts.length) return `${lhs} \\approx 0`;
  const rows = [];
  for (let i = 0; i < parts.length; i += 2) rows.push(parts.slice(i, i + 2).join(' '));
  if (more) rows[rows.length - 1] += ' + \\cdots';
  return `\\begin{aligned} ${lhs} &\\approx ${rows[0]}` + rows.slice(1).map(r => ` \\\\ &\\quad ${r}`).join('') + ' \\end{aligned}';
}
function texChain(c0, sel, max = 4) {
  const parts = [];
  if (Math.hypot(c0[0], c0[1]) > 5e-4) parts.push(texC(c0));
  for (const T of sel.slice(0, max)) {
    let d = degOf(T.ph), sign = '+';
    if (Math.abs(d) < 0.5) d = 0; else if (Math.abs(Math.abs(d) - 180) < 0.5) { d = 0; sign = '-'; }
    const body = d === 0 ? `${tnum(T.amp)}\\,e^{${freqTex(T.n, true)}}` : `${tnum(T.amp)}\\,e^{\\,i(${freqTex(T.n, false)}${d < 0 ? '-' : '+'}${Math.round(Math.abs(d))}^\\circ)}`;
    parts.push((parts.length || sign === '-' ? sign + ' ' : '') + body);
  }
  return texLines('z(t)', parts, sel.length > max);
}
function texAxis(name, v0, sel, max = 3) {
  const parts = [];
  if (Math.abs(v0) > 5e-4) parts.push(tnum(v0));
  for (const T of sel.slice(0, max)) {
    const fr = 2 * T.k + '\\pi t';
    for (const [val, fn] of [[T.a, '\\cos'], [T.b, '\\operatorname{sen}']]) {
      if (Math.abs(val) < 5e-4) continue;
      parts.push((val < 0 ? '- ' : (parts.length ? '+ ' : '')) + tnum(Math.abs(val)) + fn + ' ' + fr);
    }
  }
  return texLines(`${name}(t)`, parts, sel.length > max);
}

/* ---------- reloj de animación compartido ---------- */
const figs = [];
let allPaused = REDUCE;
function makeFig(o) {
  const f = Object.assign({ period: 7, visible: false, paused: REDUCE, t0: performance.now(), ph: REDUCE ? 0.999 : 0 }, o);
  figs.push(f); io.observe(f.root);
  if (f.playbtn !== false) {
    const box = $('.stagebox', f.root), b = document.createElement('button');
    b.className = 'playbtn'; b.type = 'button';
    const sync = () => { b.setAttribute('aria-label', f.paused ? 'Reproducir' : 'Pausar'); b.innerHTML = f.paused ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>'; };
    b.addEventListener('click', () => { f.paused = !f.paused; if (!f.paused) f.t0 = performance.now() - f.ph * f.period * 1000; sync(); f.draw(f.ph); });
    f.sync = sync; sync(); box.appendChild(b);
  }
  return f;
}
const io = new IntersectionObserver(es => { for (const e of es) { const f = figs.find(g => g.root === e.target); if (f) { f.visible = e.isIntersecting; if (f.visible) f.draw(f.ph); } } }, { rootMargin: '120px' });
function loop(now) {
  for (const f of figs) if (f.visible && !f.paused) { f.ph = ((now - f.t0) / 1000 / f.period) % 1; f.draw(f.ph); }
  requestAnimationFrame(loop);
}
$('#pauseAll').addEventListener('click', () => {
  allPaused = !allPaused;
  $('#pauseAll').textContent = allPaused ? 'Reanudar todas las animaciones' : 'Pausar todas las animaciones';
  for (const f of figs) { f.paused = allPaused; if (!allPaused) f.t0 = performance.now() - f.ph * f.period * 1000; f.sync && f.sync(); f.draw(f.ph); }
});
if (REDUCE) $('#pauseAll').textContent = 'Reanudar todas las animaciones';

/* controles genéricos: data-k en .seg y en input[type=range] */
function bindControls(root, s, onChange) {
  for (const seg of $$('.seg[data-k]', root)) {
    const k = seg.dataset.k;
    const sync = () => $$('button', seg).forEach(b => b.setAttribute('aria-pressed', String(String(s[k]) === b.dataset.v)));
    seg.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; s[k] = isNaN(+b.dataset.v) ? b.dataset.v : +b.dataset.v; sync(); onChange(k); });
    sync();
  }
  for (const r of $$('input[type="range"][data-k]', root)) {
    const k = r.dataset.k; r.value = s[k];
    r.addEventListener('input', () => { s[k] = +r.value; showOut(root, s); onChange(k); });
  }
  showOut(root, s);
}
function showOut(root, s) {
  for (const o of $$('output[data-o]', root)) {
    const k = o.dataset.o, v = s[k];
    o.textContent = k === 'phi' ? `${v}°` : (typeof v === 'number' && !Number.isInteger(v) ? fmt(v, 2) : String(v).replace('-', '−'));
  }
}

/* ================= Figura A: el vector que gira ================= */
(() => {
  const root = $('#figA'), st = new Stage($('canvas', root)), live = $('.live', root);
  const f = makeFig({ root, period: 6, draw(ph) {
    const c = st.ctx, W = st.W, H = st.H; st.clear();
    const R = H * 0.36, cx = H * 0.52, cy = H / 2;
    c.strokeStyle = COL.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(cx - R * 1.25, cy); c.lineTo(cx + R * 1.25, cy); c.moveTo(cx, cy - R * 1.25); c.lineTo(cx, cy + R * 1.25); c.stroke();
    c.strokeStyle = COL.circle; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
    const a = TAU * ph, px = cx + R * Math.cos(a), py = cy - R * Math.sin(a);
    c.lineWidth = 4; c.strokeStyle = COL.x; c.beginPath(); c.moveTo(cx, cy); c.lineTo(px, cy); c.stroke();
    c.strokeStyle = COL.y; c.beginPath(); c.moveTo(px, cy); c.lineTo(px, py); c.stroke();
    c.lineWidth = 2; c.strokeStyle = COL.arm; c.beginPath(); c.moveTo(cx, cy); c.lineTo(px, py); c.stroke();
    c.strokeStyle = COL.muted; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, R * 0.22, 0, -a, true); c.stroke();
    dot(st, px, py, 4, '#fff');
    const gx0 = cx + R * 1.55, gx1 = W - 14;
    if (gx1 - gx0 > 60) {
      c.strokeStyle = COL.axis; c.beginPath(); c.moveTo(gx0, cy); c.lineTo(gx1, cy); c.moveTo(gx0, cy - R * 1.1); c.lineTo(gx0, cy + R * 1.1); c.stroke();
      const G = (fn, col) => { c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); for (let i = 0; i <= 240; i++) { const t = i / 240, x = gx0 + t * (gx1 - gx0), y = cy - R * fn(TAU * t); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); };
      G(Math.cos, COL.x); G(Math.sin, COL.y);
      const gx = gx0 + ph * (gx1 - gx0);
      c.strokeStyle = COL.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(gx, cy - R * 1.1); c.lineTo(gx, cy + R * 1.1); c.stroke();
      c.setLineDash([4, 4]); c.strokeStyle = COL.guideY; c.beginPath(); c.moveTo(px, py); c.lineTo(gx, py); c.stroke(); c.setLineDash([]);
      dot(st, gx, cy - R * Math.cos(a), 4, COL.x); dot(st, gx, py, 4, COL.y);
      c.font = `500 12px ${FONT_MONO}`; c.fillStyle = COL.muted; c.fillText('t = 0', gx0 + 3, cy + R * 1.1 + 14); c.textAlign = 'right'; c.fillText('t = 1', gx1, cy + R * 1.1 + 14); c.textAlign = 'left';
    }
    live.textContent = `t = ${fmt(ph, 3)}   ángulo = ${Math.round(360 * ph)}°   x = cos 2πt = ${fmt(Math.cos(a), 3)}   y = sen 2πt = ${fmt(Math.sin(a), 3)}`;
  } });
  st.onresize = () => f.draw(f.ph);
})();

/* ================= Figura B: el círculo ================= */
(() => {
  const root = $('#figB'), st = new Stage($('canvas', root)), eq = $('.eq', root);
  const s = { mode: 1, R: 0.8, phi: 30, n: 1 };
  const v = new EpiView(st, { fixed: { box: [-1.05, 1.05, -1.05, 1.05], reach: 1.05 } }); v.showAxes = true;
  function update() {
    v.mode = s.mode; v.N = 2;
    const c = [s.R * Math.cos(s.phi * DEG), s.R * Math.sin(s.phi * DEG)];
    v.setMap(new Map([[0, [0, 0]], [s.n, c]]));
    const nn = String(s.n).replace('-', '-');
    if (s.mode === 1) setTex(eq, [`c_{${nn}} = ${tnum(s.R, 2)}\\,e^{i\\,${s.phi}^\\circ} = ${texC(c, 3).replace(/^\(|\)$/g, '')}`, texChain([0, 0], v.sel), `\\text{círculos: }1`]);
    else setTex(eq, [texAxis('x', 0, v.selX), texAxis('y', 0, v.selY), `\\text{círculos: }${v.circles()}`]);
    f.draw(f.ph);
  }
  const f = makeFig({ root, period: 6, draw: ph => v.draw(ph) });
  bindControls(root, s, update);
  update();
})();

/* ================= Figura C: la elipse ================= */
(() => {
  const root = $('#figC'), st = new Stage($('canvas', root)), eq = $('.eq', root);
  const s = { mode: 1, a: 1, b: 0.45 };
  const v = new EpiView(st, { fixed: { box: [-1.05, 1.05, -1.05, 1.05], reach: 1.05 } }); v.showAxes = true;
  function update() {
    v.mode = s.mode; v.N = 2;
    v.setMap(new Map([[0, [0, 0]], [1, [(s.a + s.b) / 2, 0]], [-1, [(s.a - s.b) / 2, 0]]]));
    const g = []; for (let i = 0; i <= 120; i++) g.push([s.a * Math.cos(TAU * i / 120), s.b * Math.sin(TAU * i / 120)]);
    v.ghost = { pts: g, closed: true };
    if (s.mode === 1) setTex(eq, [`c_1 = \\tfrac{a+b}{2} = ${tnum((s.a + s.b) / 2, 3)}, \\quad c_{-1} = \\tfrac{a-b}{2} = ${tnum((s.a - s.b) / 2, 3)}`, texChain([0, 0], v.sel), `\\text{círculos: }${v.circles()}`]);
    else setTex(eq, [texAxis('x', 0, v.selX), texAxis('y', 0, v.selY), `\\text{círculos: }${v.circles()}`]);
    f.draw(f.ph);
  }
  const f = makeFig({ root, period: 6, draw: ph => v.draw(ph) });
  bindControls(root, s, update);
  update();
})();

/* ================= Figura D: girar hacia atrás y promediar ================= */
(() => {
  const root = $('#figD'), st = new Stage($('canvas', root)), eq = $('.eq', root);
  const s = { shape: 'elipse', n: 1 };
  const M = 48;
  const HOUSE = [[0, 0], [2, 0], [2, 1.5], [1, 2.4], [0, 1.5]].map(([x, y]) => [x - 1, y - 1.1]);
  let pts = [], exact = null;
  function samples() {
    if (s.shape === 'elipse') { pts = []; for (let k = 0; k < M; k++) pts.push([Math.cos(TAU * k / M), 0.5 * Math.sin(TAU * k / M)]); exact = new Map([[1, [0.75, 0]], [-1, [0.25, 0]]]); return; }
    const V = s.shape === 'cuadrado' ? [[0.8, 0], [0.8, 0.8], [-0.8, 0.8], [-0.8, -0.8], [0.8, -0.8]] : HOUSE;
    const sm = polySamples(V, M); pts = []; for (let k = 0; k < M; k++) pts.push([sm.xs[k], sm.ys[k]]);
    exact = vertexMap(V, 8);
  }
  function rotated(u) { // u: fracción del giro aplicada (0 = sin girar, 1 = girado del todo)
    return pts.map(([x, y], k) => { const a = -TAU * s.n * k / M * u, c = Math.cos(a), sn = Math.sin(a); return [x * c - y * sn, x * sn + y * c]; });
  }
  function mean(arr) { let x = 0, y = 0; for (const p of arr) { x += p[0]; y += p[1]; } return [x / arr.length, y / arr.length]; }
  function update() {
    samples();
    const cn = mean(rotated(1)), ex = exact.get(s.n) || [0, 0];
    const nk = s.n === 1 ? 'k' : s.n < 0 ? `(${s.n})\\,k` : `${s.n}k`;
    setTex(eq, [`c_{${s.n}} \\approx \\tfrac{1}{48}\\textstyle\\sum_k z_k\\,e^{-2\\pi i\\,${nk}/48}`, `= ${texC(cn, 3).replace(/^\(|\)$/g, '')}`, `\\text{exacto: } c_{${s.n}} = ${texC(ex, 3).replace(/^\(|\)$/g, '')}`]);
    f.draw(f.ph);
  }
  const f = makeFig({ root, period: 5, draw(ph) {
    st.clear(); st.view(-1.15, 1.15, -1.15, 1.15, 14); axes(st);
    const c = st.ctx;
    c.strokeStyle = COL.ghost; c.lineWidth = 2; c.stroke(polyPath(st, pts, true));
    const u = smoothstep(clamp((ph - 0.1) / 0.5, 0, 1));
    const r = rotated(u);
    for (const [x, y] of r) dot(st, st.X(x), st.Y(y), 3, COL.sample);
    const m = mean(r);
    c.strokeStyle = COL.trace; c.lineWidth = 2.5; c.beginPath(); c.moveTo(st.X(0), st.Y(0)); c.lineTo(st.X(m[0]), st.Y(m[1])); c.stroke();
    dot(st, st.X(m[0]), st.Y(m[1]), 6, COL.trace);
    c.font = `500 12px ${FONT_MONO}`; c.fillStyle = COL.muted; c.fillText(u < 1 ? `girando… ${Math.round(u * 100)} %` : 'girado: el punto dorado es c' + subN(s.n), 10, 18);
  } });
  bindControls(root, s, update);
  update();
})();
function smoothstep(x) { return x * x * (3 - 2 * x); }
function subN(n) { const sub = { '-': '₋', 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' }; return String(n).split('').map(ch => sub[ch] ?? ch).join(''); }

/* ================= Figura E: el cuadrado ================= */
(() => {
  const root = $('#figE'), st = new Stage($('canvas.stage:not(.scope)', root)), sc = new Stage($('canvas.scope', root)), eq = $('.eq', root);
  const s = { mode: 1, N: 3 };
  const K8 = 8 * Math.SQRT2 / Math.PI ** 2;
  const map = new Map([[0, [0, 0]]]);
  for (let m = -150; m <= 150; m++) { const n = 4 * m + 1; map.set(n, [K8 * (m % 2 ? -1 : 1) / (n * n), 0]); }
  const v = new EpiView(st);
  v.ghost = { pts: [[1, 0], [1, 1], [-1, 1], [-1, -1], [1, -1]], closed: true };
  const trap = t => { t = ((t % 1) + 1) % 1; if (t <= 1 / 8 || t >= 7 / 8) return 1; if (t <= 3 / 8) return 1 - 8 * (t - 1 / 8); if (t <= 5 / 8) return -1; return -1 + 8 * (t - 5 / 8); };
  function update() {
    v.mode = s.mode; v.N = s.N; v.setMap(map);
    $('[data-l="N"]', root).firstChild.textContent = s.mode === 1 ? 'Términos N ' : 'Armónicos por eje N ';
    if (s.mode === 1) setTex(eq, [texChain([0, 0], v.sel, 4), `\\text{círculos: }${v.circles()}\\quad n = ${v.sel.slice(0, 6).map(T => T.n).join(',\\,')}${v.sel.length > 6 ? ',\\dots' : ''}`]);
    else setTex(eq, [texAxis('x', 0, v.selX), texAxis('y', 0, v.selY), `\\text{círculos: }${v.circles()}\\quad k = ${v.selX.slice(0, 6).map(T => T.k).join(',\\,')}${v.selX.length > 6 ? ',\\dots' : ''}`]);
    f.draw(f.ph);
  }
  const f = makeFig({ root, period: 8, draw(ph) {
    v.draw(ph);
    sc.clear(); const c = sc.ctx, W = sc.W, H = sc.H, x0 = 10, x1 = W - 10, A = H * 0.36, cy = H / 2;
    c.strokeStyle = COL.grid; c.beginPath(); c.moveTo(x0, cy); c.lineTo(x1, cy); c.stroke();
    const plot = (fn, col, w) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); for (let i = 0; i <= 300; i++) { const t = i / 300, X = x0 + t * (x1 - x0), Y = cy - A * fn(t) / 1.2; i ? c.lineTo(X, Y) : c.moveTo(X, Y); } c.stroke(); };
    c.setLineDash([5, 4]); plot(trap, COL.trap, 1.5); c.setLineDash([]);
    const xs = v.curve.xs, K = xs.length - 1;
    plot(t => xs[Math.round(t * K)], COL.x, 2);
    const gx = x0 + ph * (x1 - x0);
    c.strokeStyle = COL.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(gx, 4); c.lineTo(gx, H - 4); c.stroke();
    dot(sc, gx, cy - A * xs[Math.round(ph * K)] / 1.2, 3.5, COL.x);
    c.font = `500 11px ${FONT_MONO}`; c.fillStyle = COL.muted; c.fillText('x(t)', x0 + 2, 14);
  } });
  sc.onresize = () => f.draw(f.ph);
  bindControls(root, s, update);
  update();
})();

/* ================= Figura F: polígonos regulares ================= */
(() => {
  const root = $('#figF'), st = new Stage($('canvas', root)), eq = $('.eq', root);
  const s = { mode: 1, k: 3, N: 4 };
  const v = new EpiView(st);
  function update() {
    const k = s.k, A = k * k * Math.sin(Math.PI / k) ** 2 / Math.PI ** 2;
    const map = new Map([[0, [0, 0]]]);
    for (let m = -60; m <= 60; m++) { const n = 1 + m * k; if (Math.abs(n) <= 400) map.set(n, [A * (m % 2 ? -1 : 1) / (n * n), 0]); }
    const g = [[Math.cos(Math.PI / k), 0]]; for (let j = 0; j < k; j++) g.push([Math.cos((2 * j + 1) * Math.PI / k), Math.sin((2 * j + 1) * Math.PI / k)]);
    v.ghost = { pts: g, closed: true };
    v.mode = s.mode; v.N = s.N; v.setMap(map);
    $('[data-l="N"]', root).firstChild.textContent = s.mode === 1 ? 'Términos N ' : 'Armónicos por eje N ';
    const ns = [1]; for (let m = 1; ns.length < 7; m++) { ns.push(1 - m * k, 1 + m * k); }
    if (s.mode === 1) setTex(eq, [`n = ${ns.slice(0, 7).join(',\\,')},\\dots`, texChain([0, 0], v.sel, 4), `\\text{círculos: }${v.circles()}`]);
    else setTex(eq, [texAxis('x', 0, v.selX), texAxis('y', 0, v.selY), `\\text{círculos: }${v.circles()}`]);
    f.draw(f.ph);
  }
  const f = makeFig({ root, period: 8, draw: ph => v.draw(ph) });
  bindControls(root, s, update);
  update();
})();

/* ================= Figura G: tu polígono ================= */
(() => {
  const root = $('#figG'), cv = $('canvas', root), st = new Stage(cv), msg = $('[data-msg]', root), tbody = $('tbody', root);
  const s = { mode: 1, N: 12 };
  const HOUSE = () => [[0, 0], [2, 0], [2, 1.5], [1, 2.4], [0, 1.5]];
  let V = HOUSE(), drag = -1;
  const box = [-0.9, 2.9, -0.9, 3.0];
  const v = new EpiView(st, { fixed: { box, reach: 1.25 } });
  function clean(P) { const out = []; for (const p of P) if (!out.length || Math.hypot(p[0] - out[out.length - 1][0], p[1] - out[out.length - 1][1]) > 1e-6) out.push(p); if (out.length > 2 && Math.hypot(out[0][0] - out[out.length - 1][0], out[0][1] - out[out.length - 1][1]) < 1e-6) out.pop(); return out; }
  function update() {
    v.mode = s.mode; v.N = s.N;
    $('[data-l="N"]', root).firstChild.textContent = s.mode === 1 ? 'Términos N ' : 'Armónicos por eje N ';
    const P = clean(V);
    if (P.length < 3) {
      msg.textContent = `Hacé clic en la figura para poner al menos 3 vértices (van ${P.length}).`;
      tbody.innerHTML = ''; v.map = null; f.draw(f.ph); return;
    }
    msg.textContent = '';
    const map = vertexMap(P, 80);
    v.ghost = { pts: P, closed: true };
    v.setMap(map);
    const rows = [[0, map.get(0)], ...v.terms.slice(0, 6).map(T => [T.n, [T.re, T.im]])];
    tbody.innerHTML = rows.map(([n, c]) => `<tr><td>${String(n).replace('-', '−')}</td><td>${fmt(Math.hypot(c[0], c[1]), 3)}</td><td>${n === 0 ? '—' : Math.round(degOf(Math.atan2(c[1], c[0]))) + '°'}</td><td>${fmtC(c, 3)}</td></tr>`).join('');
    f.draw(f.ph);
  }
  const f = makeFig({ root, period: 9, draw(ph) {
    if (!v.map) {
      st.clear(); st.view(...box, 16);
      const c = st.ctx; c.strokeStyle = COL.ghost; c.lineWidth = 2; if (V.length > 1) c.stroke(polyPath(st, V, false));
      for (const [x, y] of V) dot(st, st.X(x), st.Y(y), 5, COL.sample);
      return;
    }
    v.extra = st2 => { for (const [x, y] of V) dot(st2, st2.X(x), st2.Y(y), 5, COL.sample); };
    v.draw(ph);
  } });
  const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener('pointerdown', e => {
    const [px, py] = pos(e);
    if (!v.map) st.view(...box, 16);
    let best = -1, bd = 14;
    V.forEach(([x, y], i) => { const d = Math.hypot(st.X(x) - px, st.Y(y) - py); if (d < bd) { bd = d; best = i; } });
    if (best >= 0) drag = best; else { V.push([st.invX(px), st.invY(py)]); drag = V.length - 1; update(); }
    cv.setPointerCapture(e.pointerId);
  });
  cv.addEventListener('pointermove', e => { if (drag < 0) return; const [px, py] = pos(e); V[drag] = [st.invX(px), st.invY(py)]; update(); });
  const end = () => { drag = -1; };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    if (b.dataset.act === 'undo') V.pop(); else if (b.dataset.act === 'clear') V = []; else V = HOUSE();
    update();
  });
  bindControls(root, s, update);
  update();
})();

/* ================= Figura H: la DFT con pocos puntos ================= */
(() => {
  const root = $('#figH'), st = new Stage($('canvas', root)), eq = $('.eq', root);
  const s = { M: 4 };
  const SQ = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
  const K8 = 8 * Math.SQRT2 / Math.PI ** 2;
  const exact = n => { const m = (n - 1) / 4, a = K8 * (m % 2 ? -1 : 1) / (n * n), ang = TAU * n / 8; return [a * Math.cos(ang), a * Math.sin(ang)]; };
  let samp, rec;
  function update() {
    const sm = polySamples(SQ, s.M); samp = []; for (let k = 0; k < s.M; k++) samp.push([sm.xs[k], sm.ys[k]]);
    const map = fftMap(sm.xs, sm.ys), terms = [...map].filter(([, c]) => Math.hypot(c[0], c[1]) > 1e-12);
    rec = []; const K = 600;
    for (let i = 0; i <= K; i++) { const t = i / K; let x = 0, y = 0; for (const [n, c] of terms) { const a = TAU * n * t, co = Math.cos(a), si = Math.sin(a); x += c[0] * co - c[1] * si; y += c[0] * si + c[1] * co; } rec.push([x, y]); }
    const show = n => (n >= -s.M / 2 && n < s.M / 2) ? fmtC(map.get(n), 4) : 'no entra';
    eq.innerHTML = `<table class="mini"><thead><tr><th></th><th>DFT con M = ${s.M}</th><th>exacto</th></tr></thead><tbody>` +
      [[1, 'c₁'], [-3, 'c₋₃'], [5, 'c₅']].map(([n, lab]) => `<tr><td>${lab}</td><td>${show(n)}</td><td>${fmtC(exact(n), 4)}</td></tr>`).join('') + '</tbody></table>';
    f.draw(0);
  }
  const f = makeFig({ root, playbtn: false, paused: true, draw() {
    st.clear(); st.view(-1.55, 1.55, -1.55, 1.55, 14); axes(st);
    const c = st.ctx;
    c.strokeStyle = COL.ghost; c.lineWidth = 2; c.stroke(polyPath(st, SQ, true));
    c.strokeStyle = COL.glow; c.lineWidth = 6; c.stroke(polyPath(st, rec, false));
    c.strokeStyle = COL.trace; c.lineWidth = 2.2; c.stroke(polyPath(st, rec, false));
    if (s.M <= 64) for (const [x, y] of samp) dot(st, st.X(x), st.Y(y), 3.6, COL.sample);
  } });
  st.onresize = () => f.draw(0);
  bindControls(root, s, update);
  update();
})();

/* ================= Figura I: un SVG de verdad ================= */
(() => {
  const root = $('#figI'), st = new Stage($('canvas', root)), eq = $('.eq', root), msg = $('[data-msg]', root), ta = $('#svgPathD');
  const PRESETS = {
    corazon: 'M 50 30 C 50 0 0 0 0 30 C 0 60 40 75 50 100 C 60 75 100 60 100 30 C 100 0 50 0 50 30 Z',
    gota: 'M 50 0 C 60 25 90 45 90 70 A 40 40 0 0 1 10 70 C 10 45 40 25 50 0 Z',
    estrella: 'M 50 0 L 61 35 L 98 35 L 68 57 L 79 91 L 50 70 L 21 91 L 32 57 L 2 35 L 39 35 Z',
    nota: 'M 40 10 L 90 0 L 90 70 C 90 85 75 95 62 92 C 49 89 45 77 54 69 C 63 61 78 63 80 68 L 80 18 L 50 24 L 50 80 C 50 95 35 105 22 102 C 9 99 5 87 14 79 C 23 71 38 73 40 78 Z',
  };
  const s = { mode: 1, M: 256, N: 20 };
  const probe = $('#svgProbe');
  const v = new EpiView(st);
  let raw = null;
  function sample() {
    probe.setAttribute('d', ta.value.trim() || 'M0 0');
    let L = 0;
    try { L = probe.getTotalLength(); } catch { L = 0; }
    if (!(L > 0)) { msg.textContent = 'No pude leer ese trazo. Revisá que sea el atributo d de un <path>.'; raw = null; return; }
    const MM = 4096, xs = new Float64Array(MM), ys = new Float64Array(MM);
    let jumps = 0, prev = null;
    for (let k = 0; k < MM; k++) { const p = probe.getPointAtLength(L * k / MM); xs[k] = p.x; ys[k] = -p.y; if (prev && Math.hypot(p.x - prev.x, p.y - prev.y) > 6 * L / MM) jumps++; prev = p; }
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let k = 0; k < MM; k++) { minX = Math.min(minX, xs[k]); maxX = Math.max(maxX, xs[k]); minY = Math.min(minY, ys[k]); maxY = Math.max(maxY, ys[k]); }
    const sc = 2 / Math.max(maxX - minX, maxY - minY), cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    for (let k = 0; k < MM; k++) { xs[k] = (xs[k] - cx) * sc; ys[k] = (ys[k] - cy) * sc; }
    raw = { xs, ys, L, jumps };
    msg.textContent = jumps ? 'Este trazo tiene más de una pieza: el lápiz va a saltar entre ellas. El Taller las une con puentes.' : '';
  }
  function update() {
    if (!raw) { st.clear(); setTex(eq, ['\\text{sin trazo}']); return; }
    const step = 4096 / s.M, xs = new Float64Array(s.M), ys = new Float64Array(s.M);
    for (let k = 0; k < s.M; k++) { xs[k] = raw.xs[k * step]; ys[k] = raw.ys[k * step]; }
    const g = []; for (let k = 0; k < 4096; k += 8) g.push([raw.xs[k], raw.ys[k]]);
    v.ghost = { pts: g, closed: true };
    v.dots = s.M <= 256 ? Array.from(xs, (x, k) => [x, ys[k]]) : null;
    v.mode = s.mode; v.N = s.N; v.setMap(fftMap(xs, ys));
    $('[data-l="N"]', root).firstChild.textContent = s.mode === 1 ? 'Círculos N ' : 'Armónicos por eje N ';
    if (s.mode === 1) setTex(eq, [texChain(v.c0, v.sel, 3), `\\text{círculos: }${v.circles()}`]);
    else setTex(eq, [texAxis('x', v.c0[0], v.selX, 2), texAxis('y', v.c0[1], v.selY, 2), `\\text{círculos: }${v.circles()}`]);
    f.draw(f.ph);
  }
  const f = makeFig({ root, period: 10, draw: ph => { if (raw) v.draw(ph); } });
  root.addEventListener('click', e => { const b = e.target.closest('[data-preset]'); if (!b) return; ta.value = PRESETS[b.dataset.preset]; sample(); update(); });
  let tmr; ta.addEventListener('input', () => { clearTimeout(tmr); tmr = setTimeout(() => { sample(); update(); }, 250); });
  ta.value = PRESETS.corazon;
  bindControls(root, s, update);
  sample(); update();
})();

/* ================= Figura J: cuántos círculos ================= */
(() => {
  const root = $('#figJ'), ch = new Stage($('canvas.chart', root)), js = new Stage($('canvas.jump', root)), eq = $('.eq', root);
  const s = { N: 30 };
  const M = 4096;
  const errCurve = (xs, ys) => {
    const map = fftMap(xs, ys); const a2 = []; for (const [n, c] of map) if (n !== 0) a2.push(c[0] ** 2 + c[1] ** 2);
    a2.sort((p, q) => q - p); const tot = a2.reduce((p, q) => p + q, 0); let acc = 0; const out = [];
    for (let N = 1; N <= 1000; N++) { acc += a2[N - 1]; out.push(100 * Math.sqrt(Math.max(tot - acc, 1e-30))); }
    return out;
  };
  const ell = []; for (let i = 0; i < 3000; i++) ell.push([0.5 * Math.cos(TAU * i / 3000), 0.3 * Math.sin(TAU * i / 3000)]);
  const e1 = polySamples(ell, M), e2 = polySamples([[0.5, 0], [0.5, 0.5], [-0.5, 0.5], [-0.5, -0.5], [0.5, -0.5]], M);
  const jx = new Float64Array(M), jy = new Float64Array(M);
  for (let k = 0; k < M; k++) { const a = Math.PI * (k / M - 0.5); jx[k] = 0.5 * Math.cos(a); jy[k] = 0.5 * Math.sin(a); }
  const curves = [[errCurve(e1.xs, e1.ys), COL.x], [errCurve(e2.xs, e2.ys), COL.trace], [errCurve(jx, jy), COL.y]];
  const jmap = fftMap(jx, jy);
  const v = new EpiView(js);
  v.ghost = { pts: Array.from({ length: 200 }, (_, i) => [0.5 * Math.cos(Math.PI * (i / 199 - 0.5)), 0.5 * Math.sin(Math.PI * (i / 199 - 0.5))]), closed: false };
  function drawChart() {
    ch.clear(); const c = ch.ctx, W = ch.W, H = ch.H, l = 54, r = W - 12, t = 10, b = H - 26;
    const X = N => l + Math.log10(N) / 3 * (r - l), lo = -6, hi = 2, Y = e => clamp(t + (hi - Math.log10(Math.max(e, 1e-12))) / (hi - lo) * (b - t), t, b);
    const SUP = { '-': '⁻', 0: '⁰', 2: '²', 4: '⁴', 6: '⁶' };
    c.font = `500 11px ${FONT_MONO}`; c.lineWidth = 1;
    for (let d = lo; d <= hi; d += 2) { const y = Y(10 ** d); c.strokeStyle = COL.grid; c.beginPath(); c.moveTo(l, y); c.lineTo(r, y); c.stroke(); c.fillStyle = COL.muted; c.textAlign = 'right'; c.fillText((d === 0 ? '1' : '10' + String(d).split('').map(ch => SUP[ch]).join('')) + ' %', l - 6, y + 4); }
    c.textAlign = 'center'; for (const N of [1, 10, 100, 1000]) { c.fillStyle = COL.muted; c.fillText(String(N), Math.min(X(N), r - 12), H - 8); }
    for (const [arr, col] of curves) { c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); arr.forEach((e, i) => { const x = X(i + 1), y = Y(e); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); }
    c.strokeStyle = COL.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(X(s.N), t); c.lineTo(X(s.N), b); c.stroke(); c.setLineDash([]);
    c.textAlign = 'left'; c.fillStyle = COL.text; c.fillText('N = ' + s.N, Math.min(X(s.N) + 4, r - 60), t + 12);
  }
  function update() {
    v.N = s.N; v.setMap(jmap);
    let mx = -Infinity; for (let k = 0; k < v.curve.ys.length; k++) mx = Math.max(mx, v.curve.ys[k]);
    const over = 100 * (mx - 0.5) / 1;
    const e = curves.map(([arr]) => arr[s.N - 1]);
    const pc = v => v < 1e-5 ? 'menos de 0,00001 %' : fmt(v, v < 0.01 ? 5 : v < 1 ? 4 : 2) + ' %';
    eq.innerHTML = `<table class="mini"><thead><tr><th>error con N = ${s.N}</th><th></th></tr></thead><tbody>` +
      `<tr><td>elipse</td><td>${pc(e[0])}</td></tr><tr><td>cuadrado</td><td>${pc(e[1])}</td></tr><tr><td>con salto</td><td>${pc(e[2])}</td></tr>` +
      `<tr><td>sobrepico</td><td>${fmt(over, 1)} % del salto</td></tr></tbody></table>`;
    drawChart(); f.draw(f.ph);
  }
  const f = makeFig({ root, period: 7, draw: ph => v.draw(ph) });
  ch.onresize = drawChart;
  bindControls(root, s, update);
  update();
})();

/* ================= Figura K: la velocidad cambia la receta ================= */
(() => {
  const root = $('#figK'), sa = new Stage($('canvas.ka', root)), sb = new Stage($('canvas.kb', root)), pa = new Stage($('canvas.kas', root)), pb = new Stage($('canvas.kbs', root));
  const la = $('[data-la]', root), lb = $('[data-lb]', root);
  const s = { N: 8 };
  const M = 2048, hx = new Float64Array(M), hy = new Float64Array(M);
  for (let k = 0; k < M; k++) { const t = TAU * k / M; hx[k] = 16 * Math.sin(t) ** 3; hy[k] = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t); }
  const poly = []; for (let k = 0; k < M; k++) poly.push([hx[k], hy[k]]);
  const ar = polySamples(poly, M);
  const mapA = fftMap(hx, hy), mapB = fftMap(ar.xs, ar.ys);
  const va = new EpiView(sa), vb = new EpiView(sb);
  va.ghost = vb.ghost = { pts: poly.filter((_, i) => i % 8 === 0), closed: true };
  const err = (map, N) => { const a2 = []; let tot = 0; for (const [n, c] of map) if (n !== 0) { const q = c[0] ** 2 + c[1] ** 2; a2.push(q); tot += q; } a2.sort((p, q) => q - p); let acc = 0; for (let i = 0; i < N; i++) acc += a2[i]; return 100 * Math.sqrt(Math.max(tot - acc, 0)) / 33; };
  function spectrum(st, map, sel) {
    st.clear(); const c = st.ctx, W = st.W, H = st.H, K = 12, bw = (W - 16) / (2 * K + 1), base = H - 16;
    let mx = 0; for (let n = -K; n <= K; n++) if (n) mx = Math.max(mx, Math.hypot(...(map.get(n) || [0, 0])));
    const used = new Set(sel.map(T => T.n));
    for (let n = -K; n <= K; n++) { if (!n) continue; const a = Math.hypot(...(map.get(n) || [0, 0])), h = Math.max(0, (Math.log10(a / mx) + 4) / 4) * (base - 6); c.fillStyle = used.has(n) ? COL.trace : 'rgba(150,170,240,0.35)'; c.fillRect(8 + (n + K) * bw + bw * 0.15, base - h, bw * 0.7, h); }
    c.font = `500 10px ${FONT_MONO}`; c.fillStyle = COL.muted; c.textAlign = 'center';
    for (const n of [-12, -6, 0, 6, 12]) c.fillText(String(n).replace('-', '−'), 8 + (n + K + 0.5) * bw, H - 3);
  }
  function update() {
    va.N = vb.N = s.N; va.setMap(mapA); vb.setMap(mapB);
    spectrum(pa, mapA, va.sel); spectrum(pb, mapB, vb.sel);
    la.textContent = `Tiempo de la fórmula · error con N = ${s.N}: ${fmt(err(mapA, s.N), 3)} %`;
    lb.textContent = `Velocidad constante · error con N = ${s.N}: ${fmt(err(mapB, s.N), 3)} %`;
    f.draw(f.ph);
  }
  const f = makeFig({ root, period: 8, draw: ph => { va.draw(ph); vb.draw(ph); } });
  pa.onresize = pb.onresize = () => { spectrum(pa, mapA, va.sel); spectrum(pb, mapB, vb.sel); };
  bindControls(root, s, update);
  update();
})();

/* ---------- índice: resaltar el paso visible ---------- */
(() => {
  const links = $$('.toc a'), map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const obs = new IntersectionObserver(es => { for (const e of es) if (e.isIntersecting) { links.forEach(a => a.classList.remove('on')); const a = map.get(e.target.id); if (a) a.classList.add('on'); } }, { rootMargin: '-20% 0px -70% 0px' });
  $$('.lesson').forEach(s => obs.observe(s));
})();

/* ---------- MathJax ---------- */
window.MathJax = {
  tex: { inlineMath: [['\\(', '\\)']], displayMath: [['\\[', '\\]']] },
  svg: { fontCache: 'local' },
  options: { enableMenu: false, ignoreHtmlClass: 'eq' },
  startup: {
    ready() {
      window.MathJax.startup.defaultReady();
      window.MathJax.startup.promise.then(() => {
        mjReady = true;
        for (const [el, lines] of pendingTex) setTex(el, lines);
        pendingTex.clear();
      });
    },
  },
};
const mj = document.createElement('script');
mj.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.min.js';
mj.async = true;
document.head.appendChild(mj);
requestAnimationFrame(loop);

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
/* Al cambiar el tema (botón o sistema), las figuras se redibujan con la otra paleta */
function aplicarPaleta() { COL = temaOscuro() ? PANTALLA.oscuro : PANTALLA.claro; for (const f of figs) f.draw(f.ph); }
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', aplicarPaleta);
new MutationObserver(aplicarPaleta).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
