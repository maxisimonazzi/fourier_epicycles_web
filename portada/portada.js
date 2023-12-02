'use strict';
/* =====================================================================
   Portada de Fourier interactivo: navegación entre herramientas,
   animación de presentación e ilustraciones de las tarjetas
   ===================================================================== */
const PI = Math.PI, TAU = 2 * Math.PI;
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- herramientas ---------- */
// Cada herramienta es una página propia que se abre dentro de esta (en un iframe) y conserva su estado
// al cambiar de una a otra. También se puede abrir sola desde su carpeta.
const HERRAMIENTAS = {
  series: { src: 'herramientas/series-de-fourier/index.html', nombre: 'Series de Fourier' },
  tutorial: { src: 'herramientas/del-circulo-al-svg/index.html', nombre: 'Del círculo al SVG' },
  taller: { src: 'herramientas/taller-epiciclos/index.html', nombre: 'Taller de epiciclos' },
};
const TITULO = 'Fourier interactivo';
const inicio = document.getElementById('portada'), visor = document.getElementById('visor');
const marcos = {};
let enfocar = false;

/* La dirección es #herramienta o #herramienta/pestaña, por ejemplo #series/analisis */
function leerRuta() {
  const [id = '', ...resto] = decodeURIComponent(location.hash.slice(1)).split('/');
  return { id, sub: resto.join('/') };
}
function mostrar() {
  const { id, sub } = leerRuta(), h = HERRAMIENTAS[id];
  for (const a of document.querySelectorAll('.nav a, .marca')) {
    if (a.dataset.id === (h ? id : 'inicio') && a.closest('.nav')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  if (!h) {
    document.body.classList.remove('en-herramienta');
    visor.hidden = true; inicio.hidden = false;
    document.title = TITULO;
    demo.activar(true);
    return;
  }
  demo.activar(false);
  document.body.classList.add('en-herramienta');
  inicio.hidden = true; visor.hidden = false;
  let marco = marcos[id];
  if (!marco) {
    marco = document.createElement('iframe');
    marco.title = h.nombre;
    // la herramienta recibe el tema en la dirección: así arranca con el color correcto aunque no pueda leer lo guardado (abierta con doble clic)
    const tema = document.documentElement.dataset.theme;
    marco.src = h.src + (tema ? '?tema=' + tema : '') + (sub ? '#' + sub : '');
    marco.addEventListener('load', () => avisarTema(marco));
    if (enfocar) marco.addEventListener('load', () => marco.focus(), { once: true });
    visor.appendChild(marco);
    marcos[id] = marco;
  } else if (sub) {
    marco.contentWindow.postMessage({ fourier: 'ir', ruta: sub }, '*');
  }
  for (const [k, m] of Object.entries(marcos)) m.hidden = k !== id;
  document.title = `${h.nombre} · ${TITULO}`;
  if (enfocar) marco.focus();
  enfocar = false;
}
// un clic en un enlace interno pasa el foco a la herramienta, así el teclado y la rueda funcionan enseguida
document.addEventListener('click', e => { if (e.target.closest('a[href^="#"]')) enfocar = true; });
addEventListener('hashchange', mostrar);
// cada herramienta avisa en qué pestaña está: la dirección de la portada lo refleja (sirve para recargar o compartir)
addEventListener('message', e => {
  const d = e.data;
  // una herramienta pide abrir otra (por ejemplo, el tutorial abre el taller)
  if (d && d.fourier === 'abrir' && typeof d.destino === 'string') {
    const [id] = d.destino.split('/');
    if (HERRAMIENTAS[id] && Object.values(marcos).some(m => m.contentWindow === e.source)) { enfocar = true; location.hash = '#' + d.destino; }
    return;
  }
  if (!d || d.fourier !== 'ruta' || typeof d.ruta !== 'string') return;
  const id = Object.keys(marcos).find(k => marcos[k].contentWindow === e.source);
  if (!id || leerRuta().id !== id) return;
  const destino = '#' + id + (d.ruta ? '/' + d.ruta : '');
  if (location.hash !== destino) { try { history.replaceState(null, '', destino); } catch { /* sin historial */ } }
});

/* ---------- tema claro u oscuro: sin elección guardada, sigue al sistema ---------- */
const temaSistema = matchMedia('(prefers-color-scheme: dark)');
const botonTema = document.getElementById('tema');
const temaActual = () => document.documentElement.dataset.theme || (temaSistema.matches ? 'dark' : 'light');
function mostrarBotonTema() {
  const oscuro = temaActual() === 'dark', texto = oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  botonTema.dataset.modo = oscuro ? 'oscuro' : 'claro';
  botonTema.setAttribute('aria-label', texto); botonTema.title = texto;
}
// las herramientas abiertas en la portada usan el mismo tema
function avisarTema(marco) { try { marco.contentWindow.postMessage({ fourier: 'tema', tema: document.documentElement.dataset.theme || '' }, '*'); } catch { /* sin herramienta */ } }
botonTema.addEventListener('click', () => {
  const tema = temaActual() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = tema;
  try { localStorage.setItem('fourier:tema', tema); } catch { /* sin almacenamiento */ }
  mostrarBotonTema();
  Object.values(marcos).forEach(avisarTema);
});
temaSistema.addEventListener('change', mostrarBotonTema);
mostrarBotonTema();

/* ---------- animación de presentación: epiciclos de una onda cuadrada ---------- */
const demo = (() => {
  const cv = document.getElementById('demo'), ctx = cv.getContext('2d');
  const PASOS = [1, 2, 3, 5, 9, 15, 25];
  const PALETAS = {
    claro: { bg: '#ffffff', panel: '#f5f7f6', grid: 'rgba(20,23,22,0.06)', axis: 'rgba(20,23,22,0.3)', ref: 'rgba(20,23,22,0.42)', circle: 'rgba(89,97,92,0.42)', arm: 'rgba(20,23,22,0.85)', trace: '#1f7a4d', glow: 'rgba(0,0,0,0)', guide: 'rgba(20,23,22,0.35)', text: '#59615c', pen: '#141716' },
    oscuro: { bg: '#0b0d0e', panel: '#101314', grid: 'rgba(160,200,180,0.07)', axis: 'rgba(170,200,185,0.32)', ref: 'rgba(170,200,185,0.48)', circle: 'rgba(170,190,180,0.32)', arm: 'rgba(230,236,232,0.88)', trace: '#7fd1a0', glow: 'rgba(0,0,0,0)', guide: 'rgba(170,200,185,0.42)', text: '#9aa19c', pen: '#ffffff' },
  };
  let COL = PALETAS.oscuro;
  let paso = 2, cambio = 0, t = 0, ultimo = null, activo = true, visible = true, pedido = 0;
  const etiqueta = document.getElementById('demoN'), txt = document.getElementById('demoTxt');
  const terminos = N => Array.from({ length: N }, (_, i) => { const n = 2 * i + 1; return [n, 4 / (PI * n)]; });
  const suma = (T, tt) => { let y = 0; for (const [n, A] of T) y += A * Math.sin(n * tt); return y; };
  function rotular() { const N = PASOS[paso]; etiqueta.textContent = N; txt.textContent = N === 1 ? 'armónica' : 'armónicas'; }
  function dibujar() {
    COL = temaActual() === 'dark' ? PALETAS.oscuro : PALETAS.claro;
    const r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    const W = Math.max(10, r.width), H = Math.max(10, r.height);
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = COL.bg; ctx.fillRect(0, 0, W, H);
    const pad = Math.max(10, W * 0.03), S = Math.min(H - 2 * pad, W * 0.4), z = 1.45, s = S / (2 * z);
    const ex = pad, ey = (H - S) / 2, wx = pad + S + pad * 1.4, ww = W - wx - pad, cy = ey + S / 2, ecx = ex + S / 2;
    const Y = v => cy - v * s, EX = v => ecx + v * s, WIN = 4 * PI;
    ctx.fillStyle = COL.panel; ctx.fillRect(ex, ey, S, S); ctx.fillRect(wx, ey, ww, S);
    ctx.strokeStyle = COL.grid; ctx.lineWidth = 1; ctx.beginPath();
    for (const v of [-1, -0.5, 0.5, 1]) { const yy = Math.round(Y(v)) + 0.5; ctx.moveTo(ex, yy); ctx.lineTo(ex + S, yy); ctx.moveTo(wx, yy); ctx.lineTo(wx + ww, yy); }
    ctx.stroke();
    ctx.strokeStyle = COL.axis; ctx.beginPath(); const y0 = Math.round(Y(0)) + 0.5; ctx.moveTo(ex, y0); ctx.lineTo(ex + S, y0); ctx.moveTo(wx, y0); ctx.lineTo(wx + ww, y0); ctx.stroke();
    const T = terminos(PASOS[paso]);
    // onda ideal y suma parcial en la ventana [t − 4π, t]: el punto actual queda en el borde derecho
    ctx.save(); ctx.beginPath(); ctx.rect(wx, ey, ww, S); ctx.clip();
    const n = Math.ceil(ww), ideal = new Path2D(), tr = new Path2D();
    for (let i = 0; i <= n; i++) {
      const tt = t - WIN + WIN * i / n, x = wx + ww * i / n, sq = Math.sin(tt) >= 0 ? 1 : -1;
      i ? ideal.lineTo(x, Y(sq)) : ideal.moveTo(x, Y(sq));
      const yv = Y(suma(T, tt)); i ? tr.lineTo(x, yv) : tr.moveTo(x, yv);
    }
    ctx.setLineDash([5, 4]); ctx.strokeStyle = COL.ref; ctx.lineWidth = 1.3; ctx.stroke(ideal); ctx.setLineDash([]);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = COL.glow; ctx.lineWidth = 6; ctx.stroke(tr);
    ctx.strokeStyle = COL.trace; ctx.lineWidth = 2.2; ctx.stroke(tr);
    ctx.restore();
    // epiciclos
    ctx.save(); ctx.beginPath(); ctx.rect(ex, ey, S, S); ctx.clip();
    let x = 0, y = 0; const circ = new Path2D(), arms = new Path2D(); arms.moveTo(EX(0), Y(0));
    for (const [nn, A] of T) {
      const rr = A * s; if (rr > 0.6) { circ.moveTo(EX(x) + rr, Y(y)); circ.arc(EX(x), Y(y), rr, 0, TAU); }
      x += A * Math.cos(nn * t); y += A * Math.sin(nn * t); arms.lineTo(EX(x), Y(y));
    }
    ctx.strokeStyle = COL.circle; ctx.lineWidth = 1.2; ctx.stroke(circ);
    ctx.strokeStyle = COL.arm; ctx.lineWidth = 1.7; ctx.stroke(arms);
    ctx.restore();
    const px = EX(x), py = Y(y), qx = wx + ww;
    ctx.strokeStyle = COL.guide; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(qx, py); ctx.stroke(); ctx.setLineDash([]);
    for (const [cx, rad] of [[px, 3.4], [qx - 1, 4]]) {
      const g = ctx.createRadialGradient(cx, py, 0, cx, py, rad * 4); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, py, rad * 4, 0, TAU); ctx.fill();
      ctx.fillStyle = COL.pen; ctx.beginPath(); ctx.arc(cx, py, rad, 0, TAU); ctx.fill();
    }
    ctx.font = `600 ${Math.max(12, W * 0.024)}px "JetBrains Mono", Consolas, monospace`; ctx.fillStyle = COL.text; ctx.textAlign = 'right'; ctx.textBaseline = 'top';
    ctx.fillText('N = ' + PASOS[paso], wx + ww - 8, ey + 8);
  }
  function cuadro(ahora) {
    pedido = 0;
    if (!activo || !visible) { ultimo = null; return; }
    if (ultimo == null) { ultimo = ahora; cambio = ahora; }
    t += Math.min(0.1, (ahora - ultimo) / 1000) * 2.1; ultimo = ahora;
    if (ahora - cambio > 2800) { paso = (paso + 1) % PASOS.length; cambio = ahora; rotular(); }
    dibujar();
    pedido = requestAnimationFrame(cuadro);
  }
  function seguir() { if (!REDUCE && activo && visible && !pedido) pedido = requestAnimationFrame(cuadro); }
  new IntersectionObserver(es => { visible = es[0].isIntersecting; seguir(); }).observe(cv);
  new ResizeObserver(() => { if (activo) dibujar(); }).observe(cv);
  // al cambiar el tema (botón o sistema) se redibuja con la otra paleta
  new MutationObserver(() => { if (activo) dibujar(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  temaSistema.addEventListener('change', () => { if (activo) dibujar(); });
  rotular();
  if (REDUCE) { paso = 3; t = 1.1; rotular(); }
  return {
    activar(on) { activo = on; if (on) { dibujar(); seguir(); } },
  };
})();

/* ---------- ilustraciones de las tarjetas: también son sumas de Fourier ---------- */
(() => {
  const SVGNS = 'http://www.w3.org/2000/svg';
  const f = v => (Math.round(v * 10) / 10).toString();
  const camino = pts => 'M' + pts.map(([x, y]) => f(x) + ' ' + f(y)).join(' L');
  const curva = (n, fn) => Array.from({ length: n + 1 }, (_, i) => fn(i / n));
  const circulo = (g, cx, cy, r) => { const c = document.createElementNS(SVGNS, 'circle'); c.setAttribute('cx', f(cx)); c.setAttribute('cy', f(cy)); c.setAttribute('r', f(r)); g.appendChild(c); };
  const trazo = (g, d, cls) => { const p = document.createElementNS(SVGNS, 'path'); p.setAttribute('d', d); if (cls) p.setAttribute('class', cls); g.appendChild(p); };
  const punto = (g, x, y) => { const c = document.createElementNS(SVGNS, 'circle'); c.setAttribute('cx', f(x)); c.setAttribute('cy', f(y)); c.setAttribute('r', '2.6'); c.setAttribute('class', 'pen'); g.appendChild(c); };
  const cadena = (g, x, y, lista) => {   // lista de [radio, ángulo]: círculos encadenados y sus brazos
    const pts = [[x, y]];
    for (const [r, a] of lista) { circulo(g, x, y, r); x += r * Math.cos(a); y -= r * Math.sin(a); pts.push([x, y]); }
    trazo(g, camino(pts), 'arm'); punto(g, x, y);
    return [x, y];
  };
  for (const svg of document.querySelectorAll('svg[data-ilus]')) {
    const g = svg.querySelector('.c'), base = svg.querySelector('.b'), linea = svg.querySelector('.t'), tipo = svg.dataset.ilus;
    if (tipo === 'series') {
      // cuadrada con 5 armónicas, dos períodos, y la cadena de sus tres primeros círculos
      const sq = u => { const tt = 4 * PI * u; let y = 0; for (let k = 0; k < 5; k++) { const n = 2 * k + 1; y += 4 / (PI * n) * Math.sin(n * tt); } return y; };
      linea.setAttribute('d', camino(curva(160, u => [96 + 128 * u, 40 - 22 * sq(u)])));
      base.setAttribute('d', 'M96 40 H224');
      const [x, y] = cadena(g, 40, 40, [[28, 0.9], [9.3, 2.7], [5.6, 4.5]]);
      trazo(g, `M${f(x)} ${f(y)} H96`, 'guia');
    } else if (tipo === 'tutorial') {
      // del círculo al polígono y a una figura cualquiera
      circulo(g, 40, 40, 20);
      trazo(g, camino(Array.from({ length: 7 }, (_, k) => [104 + 20 * Math.cos(PI / 3 * k + PI / 6), 40 + 20 * Math.sin(PI / 3 * k + PI / 6)])));
      trazo(g, 'M64 40 H78 M72 35 L78 40 L72 45 M130 40 H144 M138 35 L144 40 L138 45');
      linea.setAttribute('d', camino(curva(120, u => { const s = TAU * u, r = 19 + 4 * Math.cos(3 * s) + 2.5 * Math.sin(2 * s); return [186 + r * Math.cos(s), 40 + r * Math.sin(s)]; })) + 'Z');
    } else if (tipo === 'taller') {
      // un corazón dibujado por una cadena de círculos
      const cor = s => [150 + 1.75 * 16 * Math.sin(s) ** 3, 38 - 1.75 * (13 * Math.cos(s) - 5 * Math.cos(2 * s) - 2 * Math.cos(3 * s) - Math.cos(4 * s))];
      linea.setAttribute('d', camino(curva(84, u => cor(TAU * u * 0.62))));
      base.setAttribute('d', camino(curva(120, u => cor(TAU * u))) + 'Z');
      // la cadena arranca donde hace falta para que su punta caiga justo sobre el trazo, como en el taller
      const destino = cor(TAU * 0.62), lista = [[22, 2.6], [10, 0.6], [5, -1.2]];
      let x0 = destino[0], y0 = destino[1];
      for (const [r, a] of lista) { x0 -= r * Math.cos(a); y0 += r * Math.sin(a); }
      cadena(g, x0, y0, lista);
    }
  }
})();

mostrar();
