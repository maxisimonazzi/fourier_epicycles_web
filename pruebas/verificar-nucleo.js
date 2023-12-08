'use strict';
/* Compara el núcleo matemático de Series de Fourier con fórmulas cerradas.
   Uso, desde la raíz del repo:  node pruebas/verificar-nucleo.js
   Sale con código 1 si algún valor se aparta más de la tolerancia. */
const fs = require('fs');
const path = require('path');

const codigo = fs.readFileSync(path.join(__dirname, '..', 'herramientas', 'series-de-fourier', 'nucleo.js'), 'utf8');
const F = new Function(codigo + '\nreturn { WAVES, waveInfo, model, smoothStats, KMAX, GIBBS };')();
const PI = Math.PI;
const filas = [];
function revisar(que, obtenido, esperado, tolerancia) {
  filas.push({ que, obtenido, esperado, ok: Math.abs(obtenido - esperado) <= tolerancia });
}

// Distorsión armónica total de cada señal ideal (respecto de la fundamental)
const thd = { cuadrada: Math.sqrt(PI ** 2 / 8 - 1), triangular: Math.sqrt(PI ** 4 / 96 - 1), sierra: Math.sqrt(PI ** 2 / 6 - 1), rectificada: Math.sqrt(9 * PI ** 2 / 16 - 11 / 2) };
for (const [w, v] of Object.entries(thd)) revisar(`THD de la ${w}`, F.model({ wave: w, dc: false, N: 1 }).thd.F, v, 1e-12);

// Parseval: la potencia medida en el tiempo (R(0) de la autocorrelación) es la de las fórmulas cerradas
const potencia = { cuadrada: 1, triangular: 1 / 3, sierra: 1 / 3, rectificada: 1 / 2 };
for (const [w, v] of Object.entries(potencia)) revisar(`Potencia media de la ${w} (R(0))`, F.waveInfo(w, false).acf[0], v, 1e-6);
revisar('Potencia de la cuadrada con continua', F.waveInfo('cuadrada', true).acf[0], 2, 1e-6);

// Error eficaz por Parseval: con N términos, la potencia que falta
const n50 = F.model({ wave: 'cuadrada', dc: false, N: 50 });
let falta = 0; for (let k = 50; k < 2e6; k++) falta += 8 / (PI ** 2 * (2 * k + 1) ** 2);
revisar('Error eficaz de la cuadrada con N = 50', n50.err, Math.sqrt(falta), 1e-6);

// Fenómeno de Gibbs: el sobrepico tiende a Si(π)/π − 1/2 del salto
revisar(`Sobrepico de la cuadrada con N = ${F.KMAX}`, F.model({ wave: 'cuadrada', dc: false, N: F.KMAX }).over, F.GIBBS, 2e-5);
const m10 = F.model({ wave: 'cuadrada', dc: false, N: 10 });
revisar('Sobrepico con σ de Fejér (no hay)', F.smoothStats(m10.I, m10.terms, 'fejer').over, 0, 1e-9);

// Decaimiento de los coeficientes: 1/n con saltos, 1/n² con esquinas
revisar('Pendiente de Aₙ en la cuadrada', F.waveInfo('cuadrada', false).decaySlope, -1, 1e-9);
revisar('Pendiente de Aₙ en la triangular', F.waveInfo('triangular', false).decaySlope, -2, 1e-9);

// Coeficientes de fórmula cerrada contra una FFT de la señal ideal
for (const w of Object.keys(F.WAVES)) {
  const I = F.waveInfo(w, false); let dif = 0;
  for (const T of I.terms.slice(0, 50)) {
    if (T.dc) { dif = Math.max(dif, Math.abs(I.dft.re[0] - I.mean)); continue; }
    dif = Math.max(dif, Math.abs(2 * I.dft.re[T.n] - T.A * Math.sin(T.ph)), Math.abs(-2 * I.dft.im[T.n] - T.A * Math.cos(T.ph)));
  }
  revisar(`FFT contra fórmula cerrada, ${w} (50 términos)`, dif, 0, 1e-3);
}

// Simetrías detectadas
const sim = (w, k) => (F.waveInfo(w, false).sym[k] ? 1 : 0);
revisar('La cuadrada es impar y de media onda', sim('cuadrada', 'odd') + sim('cuadrada', 'half'), 2, 0);
revisar('La rectificada es par y se repite cada T/2', sim('rectificada', 'even') + sim('rectificada', 'halfPer'), 2, 0);
revisar('La diente de sierra no tiene media onda', sim('sierra', 'half'), 0, 0);

const ancho = Math.max(...filas.map(f => f.que.length));
for (const f of filas) console.log(`${f.ok ? 'OK ' : 'MAL'}  ${f.que.padEnd(ancho)}  ${f.obtenido.toPrecision(10)}  (esperado ${f.esperado.toPrecision(10)})`);
const malas = filas.filter(f => !f.ok).length;
console.log(malas ? `\n${malas} de ${filas.length} comprobaciones fallaron.` : `\nLas ${filas.length} comprobaciones coinciden con las fórmulas cerradas.`);
process.exitCode = malas ? 1 : 0;
