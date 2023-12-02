'use strict';
/* =====================================================================
   Núcleo matemático (sin DOM): señales, coeficientes y análisis
   ===================================================================== */
const PI = Math.PI, TAU = 2 * Math.PI;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const KMAX = 200;         // máximo de términos (la versión en Python llegaba a 50). Con MS = 4096 el primer
                          // lóbulo de Gibbs de la armónica 399 todavía ocupa unas 5 muestras de la grilla.
const MS = 4096;          // muestras por período para los cálculos numéricos
const GIBBS = 0.0894898722; // Si(π)/π − 1/2: sobrepico límite como fracción del salto

/* Cada término es { i, n, A, ph, dc }: la armónica n aporta A·sen(n t + ph). El término dc no gira. */
const WAVES = {
  cuadrada: {
    label: 'Cuadrada', name: 'Onda cuadrada',
    ideal: t => { const s = Math.sin(t); return Math.abs(s) < 1e-12 ? 0 : (s > 0 ? 1 : -1); },
    term: i => ({ i, n: 2 * i + 1, A: 4 / (PI * (2 * i + 1)), ph: 0, dc: false }),
    mean: 0, Pac: 1, mabs: 1, max: 1, min: -1, jump: 2, feat: 0, featTxt: 'el salto de t = 0',
    ex: { mean: '0', mabs: 'A', rms: 'A', ac: 'A', max: 'A', min: '−A', pp: '2A', crest: '1', form: '1', ripple: '', P: 'A²/R' },
    exDC: { mean: 'A', mabs: 'A', rms: '√2·A', ac: 'A', max: '2A', min: '0', pp: '2A', crest: '√2', form: '√2', ripple: '1', P: '2A²/R' },
    thdEx: '√(π²/8 − 1)',
    coefTex: 'b_n = \\frac{4}{n\\pi}\\ \\ (n\\ \\text{impar}), \\qquad a_n = 0',
    sumTex: '\\frac{4}{\\pi}\\sum_{k=1}^{N}\\frac{\\operatorname{sen}\\big((2k-1)t\\big)}{2k-1}',
  },
  triangular: {
    label: 'Triangular', name: 'Onda triangular',
    ideal: t => (2 / PI) * Math.asin(clamp(Math.sin(t), -1, 1)),
    term: i => { const n = 2 * i + 1; return { i, n, A: 8 / (PI * PI * n * n), ph: i % 2 ? PI : 0, dc: false }; },
    mean: 0, Pac: 1 / 3, mabs: 0.5, max: 1, min: -1, jump: 0, feat: PI / 2, featTxt: 'la esquina de t = π/2',
    ex: { mean: '0', mabs: 'A/2', rms: 'A/√3', ac: 'A/√3', max: 'A', min: '−A', pp: '2A', crest: '√3', form: '2/√3', ripple: '', P: 'A²/(3R)' },
    exDC: { mean: 'A', mabs: 'A', rms: '2A/√3', ac: 'A/√3', max: '2A', min: '0', pp: '2A', crest: '√3', form: '2/√3', ripple: '1/√3', P: '4A²/(3R)' },
    thdEx: '√(π⁴/96 − 1)',
    coefTex: 'b_n = \\frac{8\\,(-1)^{(n-1)/2}}{n^2\\pi^2}\\ \\ (n\\ \\text{impar}), \\qquad a_n = 0',
    sumTex: '\\frac{8}{\\pi^2}\\sum_{k=1}^{N}\\frac{(-1)^{k-1}}{(2k-1)^2}\\operatorname{sen}\\big((2k-1)t\\big)',
  },
  sierra: {
    label: 'Diente de sierra', name: 'Onda diente de sierra',
    ideal: t => { const u = t / TAU + 0.5, f = u - Math.floor(u); return (f < 1e-12 || f > 1 - 1e-12) ? 0 : 2 * f - 1; },
    term: i => { const n = i + 1; return { i, n, A: 2 / (PI * n), ph: n % 2 === 0 ? PI : 0, dc: false }; },
    mean: 0, Pac: 1 / 3, mabs: 0.5, max: 1, min: -1, jump: 2, feat: PI, featTxt: 'el salto de t = π',
    ex: { mean: '0', mabs: 'A/2', rms: 'A/√3', ac: 'A/√3', max: 'A', min: '−A', pp: '2A', crest: '√3', form: '2/√3', ripple: '', P: 'A²/(3R)' },
    exDC: { mean: 'A', mabs: 'A', rms: '2A/√3', ac: 'A/√3', max: '2A', min: '0', pp: '2A', crest: '√3', form: '2/√3', ripple: '1/√3', P: '4A²/(3R)' },
    thdEx: '√(π²/6 − 1)',
    coefTex: 'b_n = \\frac{2\\,(-1)^{n+1}}{n\\pi}, \\qquad a_n = 0',
    sumTex: '\\frac{2}{\\pi}\\sum_{n=1}^{N}\\frac{(-1)^{n+1}}{n}\\operatorname{sen}(nt)',
  },
  rectificada: {
    label: 'Rectificada', name: 'Senoidal rectificada',
    ideal: t => Math.abs(Math.sin(t)),
    term: i => i === 0 ? { i, n: 0, A: 2 / PI, ph: 0, dc: true } : { i, n: 2 * i, A: 4 / (PI * (4 * i * i - 1)), ph: -PI / 2, dc: false },
    mean: 2 / PI, Pac: 0.5 - 4 / (PI * PI), mabs: 2 / PI, max: 1, min: 0, jump: 0, feat: 0, featTxt: 'la esquina de t = 0',
    ex: { mean: '2A/π', mabs: '2A/π', rms: 'A/√2', ac: 'A·√(1/2 − 4/π²)', max: 'A', min: '0', pp: 'A', crest: '√2', form: 'π/(2√2)', ripple: '√(π²/8 − 1)', P: 'A²/(2R)' },
    exDC: null,
    thdEx: '√(9π²/16 − 11/2)',
    coefTex: '\\frac{a_0}{2} = \\frac{2}{\\pi}, \\qquad a_n = -\\frac{4}{\\pi\\,(n^2-1)}\\ \\ (n\\ \\text{par}), \\qquad b_n = 0',
    sumTex: '\\frac{2}{\\pi} - \\frac{4}{\\pi}\\sum_{k=1}^{N-1}\\frac{\\cos(2kt)}{4k^2-1}',
  },
};
const offOf = (w, dc) => (dc && w !== 'rectificada' ? 1 : 0);

/* FFT radix 2 en el lugar (signo −, sin normalizar) */
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
/* Vértice de la parábola por tres muestras vecinas: afina un máximo o un mínimo muestreado */
function refine(S, k, sgn) {
  const n = S.length, a = S[(k - 1 + n) % n], b = S[k], c = S[(k + 1) % n], den = a - 2 * b + c;
  if (Math.abs(den) < 1e-15) return b;
  const v = b - (c - a) * (c - a) / (8 * den);
  return sgn > 0 ? Math.max(b, v) : Math.min(b, v);
}
function slopeLog(xs, ys) {
  let sx = 0, sy = 0, sxx = 0, sxy = 0, m = 0;
  for (let i = 0; i < xs.length; i++) { if (!(xs[i] > 0 && ys[i] > 0)) continue; const X = Math.log(xs[i]), Y = Math.log(ys[i]); sx += X; sy += Y; sxx += X * X; sxy += X * Y; m++; }
  return m > 1 ? (m * sxy - sx * sy) / (m * sxx - sx * sx) : NaN;
}
/* Suma parcial normalizada (amplitud 1) en t con los primeros `count` términos y factores σ opcionales */
function partial(terms, off, t, sig, count = terms.length) {
  let y = off;
  for (let i = 0; i < count; i++) { const T = terms[i]; y += T.dc ? T.A : (sig ? sig[i] : 1) * T.A * Math.sin(T.n * t + T.ph); }
  return y;
}
/* Máximo (sgn = 1) o mínimo (sgn = −1) exacto cerca de t0: sección áurea en [t0 − h, t0 + h] evaluando la
   suma directamente. La grilla ubica el lóbulo y esto lo afina aunque el lóbulo de Gibbs mida pocas muestras. */
function extremum(terms, count, off, t0, h, sgn, sig) {
  const f = t => sgn * partial(terms, off, t, sig, count), g = 0.6180339887498949;
  let a = t0 - h, b = t0 + h, c = b - g * (b - a), d = a + g * (b - a), fc = f(c), fd = f(d);
  for (let it = 0; it < 30; it++) {
    if (fc > fd) { b = d; d = c; fd = fc; c = b - g * (b - a); fc = f(c); }
    else { a = c; c = d; fc = fd; d = a + g * (b - a); fd = f(d); }
  }
  return sgn * Math.max(fc, fd, f(t0));
}
/* Suma parcial en las MS muestras de un período con una sola FFT: x_k = Re Σ (a_n − j b_n) e^{+j2πnk/M} */
function synthGrid(terms, off, sig) {
  const re = new Float64Array(MS), im = new Float64Array(MS);
  re[0] = off;
  for (let i = 0; i < terms.length; i++) {
    const T = terms[i], s = sig ? sig[i] : 1;
    if (T.dc) { re[0] += T.A; continue; }
    re[T.n] += s * T.A * Math.sin(T.ph);   // a_n
    im[T.n] += s * T.A * Math.cos(T.ph);   // b_n (ya conjugado: −(−b_n))
  }
  fft(re, im);                             // FFT de conj(C): su parte real es la síntesis buscada
  return re;
}
function sigmaFactors(terms, kind) {
  if (kind !== 'lanczos' && kind !== 'fejer') return null;
  let nmax = 0; for (const T of terms) if (!T.dc) nmax = Math.max(nmax, T.n);
  const m = nmax + 1;
  return terms.map(T => { if (T.dc) return 1; const u = T.n / m; return kind === 'fejer' ? 1 - u : Math.sin(PI * u) / (PI * u); });
}

/* Todo lo que depende solo de la señal y del modo AC/DC (se calcula una vez) */
const infoCache = new Map();
function waveInfo(w, dc) {
  const off = offOf(w, dc), key = w + '|' + off;
  if (infoCache.has(key)) return infoCache.get(key);
  const W = WAVES[w], h = TAU / MS;
  const terms = Array.from({ length: KMAX }, (_, i) => W.term(i));
  const fund = terms.find(T => !T.dc);
  const mean = W.mean + off, Pac = W.Pac, P = Pac + mean * mean;
  const max = W.max + off, min = W.min + off, mabs = min >= 0 ? mean : W.mabs;
  // señal ideal en la grilla regular (vale el promedio de los dos lados en cada salto)
  const xs = new Float64Array(MS);
  for (let k = 0; k < MS; k++) xs[k] = W.ideal(k * h) + off;
  // sumas parciales término a término: estadísticos para cada N
  const S = new Float64Array(MS).fill(off);
  const perN = [], pacN = new Float64Array(KMAX + 1), PN = new Float64Array(KMAX + 1), over = new Float64Array(KMAX + 1);
  pacN[0] = 0; PN[0] = off * off;
  let pac = 0, dcN = off;
  for (let i = 0; i < KMAX; i++) {
    const T = terms[i];
    if (T.dc) { dcN += T.A; for (let k = 0; k < MS; k++) S[k] += T.A; }
    else { pac += T.A * T.A / 2; for (let k = 0; k < MS; k++) S[k] += T.A * Math.sin(T.n * k * h + T.ph); }
    let mx = -Infinity, mn = Infinity, kx = 0, kn = 0, sa = 0, em = 0;
    for (let k = 0; k < MS; k++) {
      const v = S[k];
      if (v > mx) { mx = v; kx = k; }
      if (v < mn) { mn = v; kn = k; }
      sa += Math.abs(v);
      const e = Math.abs(v - xs[k]); if (e > em) em = e;
    }
    const st = { max: extremum(terms, i + 1, off, kx * h, h, 1), min: extremum(terms, i + 1, off, kn * h, h, -1), mabs: sa / MS, emax: em, mean: dcN };
    perN.push(st);
    pacN[i + 1] = pac; PN[i + 1] = pac + dcN * dcN;
    over[i + 1] = W.jump ? Math.max(0, st.max - max, min - st.min) / W.jump : em;
  }
  // simetrías, sobre la parte alterna y con muestras en el medio de cada intervalo
  const y = new Float64Array(MS); let ymax = 0;
  for (let k = 0; k < MS; k++) { y[k] = W.ideal((k + 0.5) * h) - W.mean; ymax = Math.max(ymax, Math.abs(y[k])); }
  const tol = 1e-9 * (ymax || 1), H = MS / 2;
  const all = f => { for (let k = 0; k < MS; k++) if (!f(k)) return false; return true; };
  const even = all(k => Math.abs(y[MS - 1 - k] - y[k]) < tol);
  const odd = all(k => Math.abs(y[MS - 1 - k] + y[k]) < tol);
  const half = all(k => Math.abs(y[(k + H) % MS] + y[k]) < tol);
  const halfPer = all(k => Math.abs(y[(k + H) % MS] - y[k]) < tol);
  const quarter = (even || odd) && half && all(k => Math.abs(y[(H - 1 - k + MS) % MS] - (odd ? y[k] : -y[k])) < tol);
  // FFT de la señal ideal: verificación de coeficientes
  const re = Float64Array.from(xs), im = new Float64Array(MS);
  fft(re, im);
  for (let k = 0; k < MS; k++) { re[k] /= MS; im[k] /= MS; }
  // autocorrelación por Wiener–Khinchin: |c_k|² y de vuelta al tiempo. Con muestras en el centro de
  // cada intervalo ninguna cae sobre un salto, y R(0) da exactamente la potencia.
  const pr = new Float64Array(MS), pi = new Float64Array(MS);
  for (let k = 0; k < MS; k++) pr[k] = y[k] + mean;
  fft(pr, pi);
  const acf = new Float64Array(MS), acfIm = new Float64Array(MS);
  for (let k = 0; k < MS; k++) acf[k] = (pr[k] * pr[k] + pi[k] * pi[k]) / (MS * MS);
  fft(acf, acfIm); // R[m] = Σ |c_k|² e^{−j2πkm/M}: real y par
  // pendientes en escala log–log
  const ac = terms.filter(T => !T.dc);
  const decaySlope = slopeLog(ac.map(T => T.n), ac.map(T => T.A));
  const errN = new Float64Array(KMAX + 1);
  for (let N = 0; N <= KMAX; N++) errN[N] = Math.sqrt(Math.max(0, Pac - pacN[N]));
  const Ns = [], Es = [];
  for (let N = 10; N <= KMAX; N++) { if (errN[N] > 0) { Ns.push(N); Es.push(errN[N]); } }
  const errSlope = slopeLog(Ns, Es);
  const info = { w, W, off, terms, fund, mean, Pac, P, rms: Math.sqrt(P), ac: Math.sqrt(Pac), max, min, mabs, xs, perN, pacN, PN, over, errN, sym: { even, odd, half, halfPer, quarter }, dft: { re, im }, acf, decaySlope, errSlope, bw: bandwidth(w) };
  infoCache.set(key, info);
  return info;
}
/* Términos necesarios para captar el 90, 99 y 99,9 % de la potencia de alterna */
const bwCache = new Map();
function bandwidth(w) {
  if (bwCache.has(w)) return bwCache.get(w);
  const W = WAVES[w], out = [];
  let acc = 0, i = 0;
  for (const frac of [0.9, 0.99, 0.999]) {
    while (i < 2e6) {
      const T = W.term(i); i++;
      if (T.dc) continue;
      acc += T.A * T.A / 2;
      if (acc >= frac * W.Pac * (1 - 1e-12)) { out.push({ frac, count: i, n: T.n }); break; }
    }
  }
  bwCache.set(w, out);
  return out;
}
/* Estado del análisis para una configuración (señal, modo y N); todo normalizado a amplitud 1 */
function model(c) {
  const I = waveInfo(c.wave, c.dc), N = clamp(Math.round(c.N), 1, KMAX), p = I.perN[N - 1];
  const terms = I.terms.slice(0, N);
  let nmax = 0; for (const T of terms) nmax = Math.max(nmax, T.n);
  const pacN = I.pacN[N], PN = I.PN[N];
  const P1 = I.fund.A * I.fund.A / 2, fundIn = terms.includes(I.fund);
  const thd = { F: Math.sqrt((I.Pac - P1) / P1), R: Math.sqrt((I.Pac - P1) / I.Pac), df: Math.sqrt(P1 / I.Pac) };
  const thdN = fundIn ? { F: Math.sqrt(Math.max(0, pacN - P1) / P1), R: Math.sqrt(Math.max(0, pacN - P1) / pacN), df: Math.sqrt(P1 / pacN) } : null;
  const err = I.errN[N];
  return {
    I, N, terms, nmax, meanN: p.mean, pacN, PN, rmsN: Math.sqrt(PN), acN: Math.sqrt(pacN),
    maxN: p.max, minN: p.min, mabsN: p.mabs, emaxN: p.emax, over: I.over[N],
    P1, thd, thdN, err, errRel: err / I.ac, pacFrac: pacN / I.Pac,
  };
}
/* Máximo, mínimo y error máximo de una suma suavizada (σ de Lanczos o Fejér), muestreada en un período */
function smoothStats(I, terms, kind) {
  const sig = sigmaFactors(terms, kind), h = TAU / MS, S = synthGrid(terms, I.off, sig);
  let kx = 0, kn = 0, em = 0;
  for (let k = 0; k < MS; k++) {
    if (S[k] > S[kx]) kx = k;
    if (S[k] < S[kn]) kn = k;
    const e = Math.abs(S[k] - I.xs[k]); if (e > em) em = e;
  }
  const max = extremum(terms, terms.length, I.off, kx * h, h, 1, sig), min = extremum(terms, terms.length, I.off, kn * h, h, -1, sig), W = I.W;
  return { max, min, emax: em, over: W.jump ? Math.max(0, max - I.max, I.min - min) / W.jump : em };
}
