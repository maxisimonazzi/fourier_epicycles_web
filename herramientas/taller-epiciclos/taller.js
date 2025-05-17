'use strict';
/* ============================================================
   Datos de ejemplo
   ============================================================ */
const ICONS = {"dove":{"w":512,"h":512,"d":"M160.8 96.5c14 17 31 30.9 49.5 42.2c25.9 15.8 53.7 25.9 77.7 31.6V138.8C265.8 108.5 250 71.5 248.6 28c-.4-11.3-7.5-21.5-18.4-24.4c-7.6-2-15.8-.2-21 5.8c-13.3 15.4-32.7 44.6-48.4 87.2zM320 144v30.6l0 0v1.3l0 0 0 32.1c-60.8-5.1-185-43.8-219.3-157.2C97.4 40 87.9 32 76.6 32c-7.9 0-15.3 3.9-18.8 11C46.8 65.9 32 112.1 32 176c0 116.9 80.1 180.5 118.4 202.8L11.8 416.6C6.7 418 2.6 421.8 .9 426.8s-.8 10.6 2.3 14.8C21.7 466.2 77.3 512 160 512c3.6 0 7.2-1.2 10-3.5L245.6 448H320c88.4 0 160-71.6 160-160V128l29.9-44.9c1.3-2 2.1-4.4 2.1-6.8c0-6.8-5.5-12.3-12.3-12.3H400c-44.2 0-80 35.8-80 80zm80-16a16 16 0 1 1 0 32 16 16 0 1 1 0-32z"},"dragon":{"w":640,"h":512,"d":"M352 124.5l-51.9-13c-6.5-1.6-11.3-7.1-12-13.8s2.8-13.1 8.7-16.1l40.8-20.4L294.4 28.8c-5.5-4.1-7.8-11.3-5.6-17.9S297.1 0 304 0H416h32 16c30.2 0 58.7 14.2 76.8 38.4l57.6 76.8c6.2 8.3 9.6 18.4 9.6 28.8c0 26.5-21.5 48-48 48H538.5c-17 0-33.3-6.7-45.3-18.7L480 160H448v21.5c0 24.8 12.8 47.9 33.8 61.1l106.6 66.6c32.1 20.1 51.6 55.2 51.6 93.1C640 462.9 590.9 512 530.2 512H496 432 32.3c-3.3 0-6.6-.4-9.6-1.4C13.5 507.8 6 501 2.4 492.1C1 488.7 .2 485.2 0 481.4c-.2-3.7 .3-7.3 1.3-10.7c2.8-9.2 9.6-16.7 18.6-20.4c3-1.2 6.2-2 9.5-2.2L433.3 412c8.3-.7 14.7-7.7 14.7-16.1c0-4.3-1.7-8.4-4.7-11.4l-44.4-44.4c-30-30-46.9-70.7-46.9-113.1V181.5v-57zM512 72.3c0-.1 0-.2 0-.3s0-.2 0-.3v.6zm-1.3 7.4L464.3 68.1c-.2 1.3-.3 2.6-.3 3.9c0 13.3 10.7 24 24 24c10.6 0 19.5-6.8 22.7-16.3zM130.9 116.5c16.3-14.5 40.4-16.2 58.5-4.1l130.6 87V227c0 32.8 8.4 64.8 24 93H112c-6.7 0-12.7-4.2-15-10.4s-.5-13.3 4.6-17.7L171 232.3 18.4 255.8c-7 1.1-13.9-2.6-16.9-9s-1.5-14.1 3.8-18.8L130.9 116.5z"},"cat":{"w":576,"h":512,"d":"M320 192h17.1c22.1 38.3 63.5 64 110.9 64c11 0 21.8-1.4 32-4v4 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V339.2L280 448h56c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-53 0-96-43-96-96V192.5c0-16.1-12-29.8-28-31.8l-7.9-1c-17.5-2.2-30-18.2-27.8-35.7s18.2-30 35.7-27.8l7.9 1c48 6 84.1 46.8 84.1 95.3v85.3c34.4-51.7 93.2-85.8 160-85.8zm160 26.5v0c-10 3.5-20.8 5.5-32 5.5c-28.4 0-54-12.4-71.6-32h0c-3.7-4.1-7-8.5-9.9-13.2C357.3 164 352 146.6 352 128v0V32 12 10.7C352 4.8 356.7 .1 362.6 0h.2c3.3 0 6.4 1.6 8.4 4.2l0 .1L384 21.3l27.2 36.3L416 64h64l4.8-6.4L512 21.3 524.8 4.3l0-.1c2-2.6 5.1-4.2 8.4-4.2h.2C539.3 .1 544 4.8 544 10.7V12 32v96c0 17.3-4.6 33.6-12.6 47.6c-11.3 19.8-29.6 35.2-51.4 42.9zM432 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm48 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32z"},"horse":{"w":576,"h":512,"d":"M448 238.1V160h16l9.8 19.6c12.5 25.1 42.2 36.4 68.3 26c20.5-8.2 33.9-28 33.9-50.1V80c0-19.1-8.4-36.3-21.7-48H560c8.8 0 16-7.2 16-16s-7.2-16-16-16H480 448C377.3 0 320 57.3 320 128H224 203.2 148.8c-30.7 0-57.6 16.3-72.5 40.8C33.2 174.5 0 211.4 0 256v56c0 13.3 10.7 24 24 24s24-10.7 24-24V256c0-13.4 6.6-25.2 16.7-32.5c1.6 13 6.3 25.4 13.6 36.4l28.2 42.4c8.3 12.4 6.4 28.7-1.2 41.6c-16.5 28-20.6 62.2-10 93.9l17.5 52.4c4.4 13.1 16.6 21.9 30.4 21.9h33.7c21.8 0 37.3-21.4 30.4-42.1l-20.8-62.5c-2.1-6.4-.5-13.4 4.3-18.2l12.7-12.7c13.2-13.2 20.6-31.1 20.6-49.7c0-2.3-.1-4.6-.3-6.9l84 24c4.1 1.2 8.2 2.1 12.3 2.8V480c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V315.7c19.2-19.2 31.5-45.7 32-75.7h0v-1.9zM496 64a16 16 0 1 1 0 32 16 16 0 1 1 0-32z"},"crow":{"w":640,"h":512,"d":"M456 0c-48.6 0-88 39.4-88 88v29.2L12.5 390.6c-14 10.8-16.6 30.9-5.9 44.9s30.9 16.6 44.9 5.9L126.1 384H259.2l46.6 113.1c5 12.3 19.1 18.1 31.3 13.1s18.1-19.1 13.1-31.3L311.1 384H352c1.1 0 2.1 0 3.2 0l46.6 113.2c5 12.3 19.1 18.1 31.3 13.1s18.1-19.1 13.1-31.3l-42-102C484.9 354.1 544 280 544 192V128v-8l80.5-20.1c8.6-2.1 13.8-10.8 11.6-19.4C629 52 603.4 32 574 32H523.9C507.7 12.5 483.3 0 456 0zm0 64a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"},"fish":{"w":576,"h":512,"d":"M180.5 141.5C219.7 108.5 272.6 80 336 80s116.3 28.5 155.5 61.5c39.1 33 66.9 72.4 81 99.8c4.7 9.2 4.7 20.1 0 29.3c-14.1 27.4-41.9 66.8-81 99.8C452.3 403.5 399.4 432 336 432s-116.3-28.5-155.5-61.5c-16.2-13.7-30.5-28.5-42.7-43.1L48.1 379.6c-12.5 7.3-28.4 5.3-38.7-4.9S-3 348.7 4.2 336.1L50 256 4.2 175.9c-7.2-12.6-5-28.4 5.3-38.6s26.1-12.2 38.7-4.9l89.7 52.3c12.2-14.6 26.5-29.4 42.7-43.1zM448 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"},"chess-knight":{"w":448,"h":512,"d":"M96 48L82.7 61.3C70.7 73.3 64 89.5 64 106.5V238.9c0 10.7 5.3 20.7 14.2 26.6l10.6 7c14.3 9.6 32.7 10.7 48.1 3l3.2-1.6c2.6-1.3 5-2.8 7.3-4.5l49.4-37c6.6-5 15.7-5 22.3 0c10.2 7.7 9.9 23.1-.7 30.3L90.4 350C73.9 361.3 64 380 64 400H384l28.9-159c2.1-11.3 3.1-22.8 3.1-34.3V192C416 86 330 0 224 0H83.8C72.9 0 64 8.9 64 19.8c0 7.5 4.2 14.3 10.9 17.7L96 48zm24 68a20 20 0 1 1 40 0 20 20 0 1 1 -40 0zM22.6 473.4c-4.2 4.2-6.6 10-6.6 16C16 501.9 26.1 512 38.6 512H409.4c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16L384 432H64L22.6 473.4z"},"guitar":{"w":512,"h":512,"d":"M465 7c-9.4-9.4-24.6-9.4-33.9 0L383 55c-2.4 2.4-4.3 5.3-5.5 8.5l-15.4 41-77.5 77.6c-45.1-29.4-99.3-30.2-131 1.6c-11 11-18 24.6-21.4 39.6c-3.7 16.6-19.1 30.7-36.1 31.6c-25.6 1.3-49.3 10.7-67.3 28.6C-16 328.4-7.6 409.4 47.5 464.5s136.1 63.5 180.9 18.7c17.9-17.9 27.4-41.7 28.6-67.3c.9-17 15-32.3 31.6-36.1c15-3.4 28.6-10.5 39.6-21.4c31.8-31.8 31-85.9 1.6-131l77.6-77.6 41-15.4c3.2-1.2 6.1-3.1 8.5-5.5l48-48c9.4-9.4 9.4-24.6 0-33.9L465 7zM208 256a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"},"music":{"w":512,"h":512,"d":"M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"},"gear":{"w":512,"h":512,"d":"M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"},"rocket":{"w":512,"h":512,"d":"M156.6 384.9L125.7 354c-8.5-8.5-11.5-20.8-7.7-32.2c3-8.9 7-20.5 11.8-33.8L24 288c-8.6 0-16.6-4.6-20.9-12.1s-4.2-16.7 .2-24.1l52.5-88.5c13-21.9 36.5-35.3 61.9-35.3l82.3 0c2.4-4 4.8-7.7 7.2-11.3C289.1-4.1 411.1-8.1 483.9 5.3c11.6 2.1 20.6 11.2 22.8 22.8c13.4 72.9 9.3 194.8-111.4 276.7c-3.5 2.4-7.3 4.8-11.3 7.2v82.3c0 25.4-13.4 49-35.3 61.9l-88.5 52.5c-7.4 4.4-16.6 4.5-24.1 .2s-12.1-12.2-12.1-20.9V380.8c-14.1 4.9-26.4 8.9-35.7 11.9c-11.2 3.6-23.4 .5-31.8-7.8zM384 168a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"},"atom":{"w":512,"h":512,"d":"M256 398.8c-11.8 5.1-23.4 9.7-34.9 13.5c16.7 33.8 31 35.7 34.9 35.7s18.1-1.9 34.9-35.7c-11.4-3.9-23.1-8.4-34.9-13.5zM446 256c33 45.2 44.3 90.9 23.6 128c-20.2 36.3-62.5 49.3-115.2 43.2c-22 52.1-55.6 84.8-98.4 84.8s-76.4-32.7-98.4-84.8c-52.7 6.1-95-6.8-115.2-43.2C21.7 346.9 33 301.2 66 256c-33-45.2-44.3-90.9-23.6-128c20.2-36.3 62.5-49.3 115.2-43.2C179.6 32.7 213.2 0 256 0s76.4 32.7 98.4 84.8c52.7-6.1 95 6.8 115.2 43.2c20.7 37.1 9.4 82.8-23.6 128zm-65.8 67.4c-1.7 14.2-3.9 28-6.7 41.2c31.8 1.4 38.6-8.7 40.2-11.7c2.3-4.2 7-17.9-11.9-48.1c-6.8 6.3-14 12.5-21.6 18.6zm-6.7-175.9c2.8 13.1 5 26.9 6.7 41.2c7.6 6.1 14.8 12.3 21.6 18.6c18.9-30.2 14.2-44 11.9-48.1c-1.6-2.9-8.4-13-40.2-11.7zM290.9 99.7C274.1 65.9 259.9 64 256 64s-18.1 1.9-34.9 35.7c11.4 3.9 23.1 8.4 34.9 13.5c11.8-5.1 23.4-9.7 34.9-13.5zm-159 88.9c1.7-14.3 3.9-28 6.7-41.2c-31.8-1.4-38.6 8.7-40.2 11.7c-2.3 4.2-7 17.9 11.9 48.1c6.8-6.3 14-12.5 21.6-18.6zM110.2 304.8C91.4 335 96 348.7 98.3 352.9c1.6 2.9 8.4 13 40.2 11.7c-2.8-13.1-5-26.9-6.7-41.2c-7.6-6.1-14.8-12.3-21.6-18.6zM336 256a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zm-80-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"},"leaf":{"w":512,"h":512,"d":"M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5h88c8.8 0 16 7.2 16 16s-7.2 16-16 16H288 216s0 0 0 0c-16.6 0-32.7 1.9-48.3 5.4c-25.9 5.9-49.9 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440v16c0 13.3 10.7 24 24 24s24-10.7 24-24V440c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z"}};

const EXAMPLES = [
  { id: 'paloma', label: 'Paloma', icon: 'dove' },
  { id: 'dragon', label: 'Dragón', icon: 'dragon' },
  { id: 'gato', label: 'Gato', icon: 'cat' },
  { id: 'caballo', label: 'Caballo', icon: 'horse' },
  { id: 'cuervo', label: 'Cuervo', icon: 'crow' },
  { id: 'pez', label: 'Pez', icon: 'fish' },
  { id: 'ajedrez', label: 'Caballo de ajedrez', icon: 'chess-knight' },
  { id: 'guitarra', label: 'Guitarra', icon: 'guitar' },
  { id: 'nota', label: 'Nota', icon: 'music' },
  { id: 'engranaje', label: 'Engranaje', icon: 'gear' },
  { id: 'cohete', label: 'Cohete', icon: 'rocket' },
  { id: 'atomo', label: 'Átomo', icon: 'atom' },
  { id: 'hoja', label: 'Hoja', icon: 'leaf' },
  { id: 'corazon', label: 'Corazón', math: 'heart' },
  { id: 'mariposa', label: 'Mariposa', math: 'butterfly' },
  { id: 'cuadrado', label: 'Cuadrado', math: 'square' },
  { id: 'espiro', label: 'Espirógrafo', math: 'spiro' },
  { id: 'pi', label: 'Pi', text: 'π' },
];

const THEMES = {
  noche: { label: 'Noche', bg: '#0b0d0e', vignette: '#15191b', ghost: 'rgba(160,200,180,0.10)', ghostLine: 'rgba(170,200,185,0.28)', circle: 'rgba(170,190,180,0.30)', arm: 'rgba(230,236,232,0.88)', trace: '#7fd1a0', glow: 'rgba(0,0,0,0)', prev: 'rgba(127,209,160,0.5)', pen: '#ffffff', title: '#eef1ee', sub: '#b4bbb6', accent: '#7fd1a0', chainX: 'rgba(124,196,232,0.80)', chainY: 'rgba(232,160,122,0.80)', guide: 'rgba(230,236,232,0.45)', formula: '#cfd6d1', fx: '#7cc4e8', fy: '#e8a07a', handle: '#9aa19c' },
  pizarra: { label: 'Pizarra', bg: '#0a1511', vignette: '#13241d', ghost: 'rgba(196,180,118,0.13)', ghostLine: 'rgba(196,180,118,0.32)', circle: 'rgba(200,232,218,0.26)', arm: 'rgba(236,244,238,0.85)', trace: '#f3eedf', glow: 'rgba(0,0,0,0)', prev: 'rgba(243,238,223,0.45)', pen: '#fff4d6', title: '#eef3ee', sub: '#93b3a6', accent: '#ee8a62', chainX: 'rgba(127,209,185,0.85)', chainY: 'rgba(227,182,90,0.85)', guide: 'rgba(225,236,228,0.45)', formula: '#cfe0d8', fx: '#7fd1b9', fy: '#e3b65a', handle: '#6f8f82' },
  tinta: { label: 'Tinta', bg: '#000000', vignette: '#0b0d10', ghost: 'rgba(255,255,255,0.07)', ghostLine: 'rgba(255,255,255,0.22)', circle: 'rgba(255,255,255,0.24)', arm: 'rgba(255,255,255,0.86)', trace: '#5fd4f0', glow: 'rgba(0,0,0,0)', prev: 'rgba(95,212,240,0.5)', pen: '#ffffff', title: '#ffffff', sub: '#9aa3ad', accent: '#ffd75e', chainX: 'rgba(95,212,240,0.85)', chainY: 'rgba(255,215,94,0.85)', guide: 'rgba(255,255,255,0.4)', formula: '#d8dde3', fx: '#5fd4f0', fy: '#ffd75e', handle: '#8a929b' },
  papel: { label: 'Papel', bg: '#e9ece9', vignette: '#ffffff', ghost: 'rgba(20,23,22,0.11)', ghostLine: 'rgba(20,23,22,0.32)', circle: 'rgba(89,97,92,0.55)', arm: 'rgba(20,23,22,0.9)', trace: '#1f7a4d', glow: 'rgba(0,0,0,0)', prev: 'rgba(31,122,77,0.45)', pen: '#141716', title: '#141716', sub: '#59615c', accent: '#1f7a4d', chainX: 'rgba(45,111,154,0.85)', chainY: 'rgba(184,92,44,0.85)', guide: 'rgba(20,23,22,0.35)', formula: '#2a2f2c', fx: '#2d6f9a', fy: '#b85c2c', handle: '#6b736d' },
};

// Estilo del video: "Según el sitio" usa Papel con el tema claro y Noche con el oscuro.
// La vista previa es el video que se exporta, así que siempre se ve el estilo que se va a guardar.
const temaSistema = matchMedia('(prefers-color-scheme: dark)');
function estiloVideo() {
  if (THEMES[cfg.estilo]) return cfg.estilo;
  const tema = document.documentElement.dataset.theme || (temaSistema.matches ? 'dark' : 'light');
  return tema === 'dark' ? 'noche' : 'papel';
}

const FORMATS = { '9:16': [1080, 1920], '4:5': [1080, 1350], '1:1': [1080, 1080], '16:9': [1920, 1080] };
const FONT_DISPLAY = '"Hanken Grotesk", "Segoe UI", system-ui, sans-serif';
const FONT_SERIF = '"Spectral", Georgia, serif';
const FONT_UI = '"Hanken Grotesk", "Segoe UI", system-ui, sans-serif';
const FONT_MONO = '"JetBrains Mono", Consolas, monospace';
const SVGNS = 'http://www.w3.org/2000/svg';
const TAU = Math.PI * 2;
const M = 2048;   // muestras sobre el contorno (potencia de 2)
const M2 = 4096;  // resolución del trazo dibujado

/* ============================================================
   Utilidades
   ============================================================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const nf = (v, d = 1) => new Intl.NumberFormat('es-AR', { maximumFractionDigits: d, minimumFractionDigits: 0 }).format(v);
const fmtTime = s => { s = Math.max(0, s); const m = Math.floor(s / 60); return m + ':' + String(Math.floor(s % 60)).padStart(2, '0'); };
function loadScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = () => rej(new Error('No se pudo cargar ' + src));
    document.head.appendChild(s);
  });
}
const store = {
  get(k, d) { try { const v = localStorage.getItem('epiciclos:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('epiciclos:' + k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } },
};

/* ============================================================
   FFT radix-2 en el lugar (signo −, sin normalizar)
   ============================================================ */
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
        const j = i + half;
        const tr = re[j] * wr - im[j] * wi, ti = re[j] * wi + im[j] * wr;
        re[j] = re[i] - tr; im[j] = im[i] - ti;
        re[i] += tr; im[i] += ti;
      }
    }
  }
}
/* Suma Σ X_j e^{+2πi jk/n} (síntesis sin dividir por n) */
function synthSum(re, im) {
  for (let i = 0; i < im.length; i++) im[i] = -im[i];
  fft(re, im);
  for (let i = 0; i < im.length; i++) im[i] = -im[i];
}

/* ============================================================
   Geometría: limpieza, normalización, recorrido y remuestreo
   ============================================================ */
function polyLength(p, closed) {
  let L = 0;
  for (let i = 1; i < p.length; i++) L += dist(p[i - 1], p[i]);
  if (closed && p.length > 2) L += dist(p[p.length - 1], p[0]);
  return L;
}
function bboxOf(polys) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of polys) for (const [x, y] of p.pts) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  return { minX, minY, maxX, maxY };
}
function normalizePolys(polys) {
  const b = bboxOf(polys);
  const cx = (b.minX + b.maxX) / 2, cy = (b.minY + b.maxY) / 2;
  const sc = 1 / Math.max(b.maxX - b.minX, b.maxY - b.minY, 1e-9);
  return polys.map(p => ({ closed: p.closed, fromRect: p.fromRect, pts: p.pts.map(([x, y]) => [(x - cx) * sc, (y - cy) * sc]) }));
}
function cleanPolys(polys, minFrac) {
  let out = [];
  for (const p of polys) {
    const pts = [];
    for (const q of p.pts) { if (!Number.isFinite(q[0]) || !Number.isFinite(q[1])) continue; if (!pts.length || dist(q, pts[pts.length - 1]) > 1e-6) pts.push(q); }
    if (p.closed && pts.length > 2 && dist(pts[0], pts[pts.length - 1]) < 1e-6) pts.pop();
    const closed = p.closed && pts.length > 2;
    if (pts.length < 2) continue;
    out.push({ pts, closed, fromRect: p.fromRect, len: polyLength(pts, closed) });
  }
  // descarta un rectángulo de fondo o marco que ocupa casi todo el dibujo
  if (out.length > 1) {
    const all = bboxOf(out), allA = (all.maxX - all.minX) * (all.maxY - all.minY);
    out = out.filter(p => {
      if (!p.fromRect) return true;
      const b = bboxOf([p]);
      return (b.maxX - b.minX) * (b.maxY - b.minY) < 0.8 * allA;
    });
  }
  const total = out.reduce((s, p) => s + p.len, 0);
  out = out.filter(p => p.len >= minFrac * total && p.len > 0);
  out.sort((a, b) => b.len - a.len);
  return out.slice(0, 400);
}
/* Recorrido cerrado de una parte que empieza y termina en `entry`. Las partes abiertas se recorren ida y vuelta. */
function tourIndices(poly, entry) {
  const n = poly.pts.length, idx = [];
  if (poly.closed) { for (let k = 0; k <= n; k++) idx.push((entry + k) % n); }
  else {
    for (let i = entry; i < n; i++) idx.push(i);
    for (let i = n - 2; i >= 0; i--) idx.push(i);
    for (let i = 1; i <= entry; i++) idx.push(i);
  }
  return idx;
}
function candidates(p, k) {
  const step = Math.max(1, Math.floor(p.pts.length / k)), out = [];
  for (let i = 0; i < p.pts.length; i += step) out.push(i);
  return out;
}
function closestBetween(A, B, ca, cb) {
  let best = Infinity, bi = 0, bj = 0;
  for (const i of ca) { const a = A.pts[i]; for (const j of cb) { const b = B.pts[j]; const d = (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2; if (d < best) { best = d; bi = i; bj = j; } } }
  // refinamiento local alrededor del mejor par
  const ra = Math.max(2, Math.ceil(A.pts.length / ca.length) * 2), rb = Math.max(2, Math.ceil(B.pts.length / cb.length) * 2);
  const i0 = bi, j0 = bj;
  for (let di = -ra; di <= ra; di++) {
    const i = (i0 + di + A.pts.length) % A.pts.length; const a = A.pts[i];
    for (let dj = -rb; dj <= rb; dj++) {
      const j = (j0 + dj + B.pts.length) % B.pts.length; const b = B.pts[j];
      const d = (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
      if (d < best) { best = d; bi = i; bj = j; }
    }
  }
  return { d: Math.sqrt(best), i: bi, j: bj };
}
function buildLoop(polys, join) {
  const X = [], Y = [], P = []; // P[i]: lápiz en el tramo que llega al vértice i
  const add = (pt, pen) => { X.push(pt[0]); Y.push(pt[1]); P.push(pen); };
  const m = polys.length;
  if (join === 'jump') {
    const used = new Array(m).fill(false);
    let cur = 0; used[0] = true;
    const first = polys[0];
    const visitOrder = [{ pi: 0, entry: 0, rev: false }];
    let endPt;
    const endOf = (p, entry, rev) => p.closed ? p.pts[entry] : (rev ? p.pts[0] : p.pts[p.pts.length - 1]);
    endPt = endOf(first, 0, false);
    const K = clamp(Math.floor(Math.sqrt(4e6 / Math.max(1, m))), 8, 200);
    const cands = polys.map(p => candidates(p, K));
    for (let step = 1; step < m; step++) {
      let best = Infinity, bp = -1, be = 0, br = false;
      for (let q = 0; q < m; q++) {
        if (used[q]) continue;
        const p = polys[q];
        if (p.closed) { for (const i of cands[q]) { const d = dist(endPt, p.pts[i]); if (d < best) { best = d; bp = q; be = i; br = false; } } }
        else {
          const d0 = dist(endPt, p.pts[0]), d1 = dist(endPt, p.pts[p.pts.length - 1]);
          if (d0 < best) { best = d0; bp = q; be = 0; br = false; }
          if (d1 < best) { best = d1; bp = q; be = p.pts.length - 1; br = true; }
        }
      }
      used[bp] = true; visitOrder.push({ pi: bp, entry: be, rev: br });
      endPt = endOf(polys[bp], be, br);
      cur = bp;
    }
    visitOrder.forEach((v, k) => {
      const p = polys[v.pi];
      let idx;
      if (p.closed) { idx = []; for (let s = 0; s <= p.pts.length; s++) idx.push((v.entry + s) % p.pts.length); }
      else { idx = [...p.pts.keys()]; if (v.rev) idx.reverse(); }
      idx.forEach((i, s) => add(p.pts[i], s === 0 ? (k === 0 ? 0 : 0) : 1));
    });
    return { X, Y, P };
  }
  // Puentes: árbol de expansión mínima entre partes (Prim)
  const bridgePen = join === 'bridge-visible' ? 1 : 0;
  const K = clamp(Math.floor(Math.sqrt(2e7 / Math.max(1, m * m))), 6, 160);
  const cands = polys.map(p => candidates(p, K));
  const inTree = new Array(m).fill(false), bestD = new Array(m).fill(Infinity), link = new Array(m).fill(null);
  const attach = polys.map(() => new Map());
  inTree[0] = true;
  for (let q = 1; q < m; q++) { const r = closestBetween(polys[0], polys[q], cands[0], cands[q]); bestD[q] = r.d; link[q] = { from: 0, i: r.i, j: r.j }; }
  for (let added = 1; added < m; added++) {
    let q = -1, bd = Infinity;
    for (let k = 0; k < m; k++) if (!inTree[k] && bestD[k] < bd) { bd = bestD[k]; q = k; }
    if (q < 0) break;
    inTree[q] = true;
    const L = link[q];
    if (!attach[L.from].has(L.i)) attach[L.from].set(L.i, []);
    attach[L.from].get(L.i).push({ child: q, at: L.j });
    for (let k = 0; k < m; k++) {
      if (inTree[k]) continue;
      const r = closestBetween(polys[q], polys[k], cands[q], cands[k]);
      if (r.d < bestD[k]) { bestD[k] = r.d; link[k] = { from: q, i: r.i, j: r.j }; }
    }
  }
  const visit = (pi, entry, penIn) => {
    const p = polys[pi], idx = tourIndices(p, entry), done = new Set();
    for (let k = 0; k < idx.length; k++) {
      const v = idx[k];
      add(p.pts[v], k === 0 ? penIn : 1);
      const kids = attach[pi].get(v);
      if (kids && !done.has(v)) {
        done.add(v);
        for (const kid of kids) { visit(kid.child, kid.at, bridgePen); add(p.pts[v], bridgePen); }
      }
    }
  };
  visit(0, 0, 1);
  if (X.length > 1 && X[X.length - 1] === X[0] && Y[Y.length - 1] === Y[0]) { X.pop(); Y.pop(); const last = P.pop(); P[0] = last; }
  return { X, Y, P };
}
function resampleLoop(loop, n) {
  const { X, Y, P } = loop, V = X.length;
  const cum = new Float64Array(V + 1);
  for (let i = 0; i < V; i++) { const j = (i + 1) % V; cum[i + 1] = cum[i] + Math.hypot(X[j] - X[i], Y[j] - Y[i]); }
  const L = cum[V];
  const xs = new Float64Array(n), ys = new Float64Array(n), pen = new Uint8Array(n);
  let e = 0;
  for (let k = 0; k < n; k++) {
    const s = (k * L) / n;
    while (e < V - 1 && cum[e + 1] <= s) e++;
    const len = cum[e + 1] - cum[e], tt = len > 0 ? (s - cum[e]) / len : 0, j = (e + 1) % V;
    xs[k] = X[e] + (X[j] - X[e]) * tt; ys[k] = Y[e] + (Y[j] - Y[e]) * tt;
    pen[k] = P[j];
  }
  return { x: xs, y: ys, pen, length: L };
}

/* ============================================================
   Fourier: análisis completo de las 2048 muestras
   ============================================================ */
function analyze(S) {
  const re = Float64Array.from(S.x), im = Float64Array.from(S.y);
  fft(re, im);
  for (let j = 0; j < M; j++) { re[j] /= M; im[j] /= M; }
  const terms = [];
  let Etot = 0;
  for (let j = 1; j < M; j++) {
    const n = j < M / 2 ? j : j - M;
    const amp = Math.hypot(re[j], im[j]);
    terms.push({ n, re: re[j], im: im[j], amp, ph: Math.atan2(im[j], re[j]) });
    Etot += amp * amp;
  }
  const byAmp = [...terms].sort((a, b) => b.amp - a.amp);
  const byFreq = [...terms].sort((a, b) => (Math.abs(a.n) - Math.abs(b.n)) || (b.n - a.n));
  // Series reales: X_n = (c_n + conj c_-n)/2, Y_n = (c_n − conj c_-n)/(2i)
  const xs = [], ys = [];
  let Ex = 0, Ey = 0;
  for (let k = 1; k < M / 2; k++) {
    const j = k, jm = M - k;
    const Xr = (re[j] + re[jm]) / 2, Xi = (im[j] - im[jm]) / 2;
    const Yr = (im[j] + im[jm]) / 2, Yi = -(re[j] - re[jm]) / 2;
    const ax = 2 * Math.hypot(Xr, Xi), ay = 2 * Math.hypot(Yr, Yi);
    xs.push({ n: k, re: Xr, im: Xi, amp: ax, ph: Math.atan2(Xi, Xr) });
    ys.push({ n: k, re: Yr, im: Yi, amp: ay, ph: Math.atan2(Yi, Yr) });
    Ex += ax * ax / 2; Ey += ay * ay / 2;
  }
  return {
    re, im, c0: [re[0], im[0]], byAmp, byFreq, Etot,
    X0: re[0], Y0: im[0], Ex, Ey,
    xByFreq: xs, yByFreq: ys,
    xByAmp: [...xs].sort((a, b) => b.amp - a.amp), yByAmp: [...ys].sort((a, b) => b.amp - a.amp),
  };
}

/* ============================================================
   Fuentes de figuras
   ============================================================ */
function sanitizeSVG(root) {
  root.querySelectorAll('script, foreignObject, iframe, object, embed, style, image, audio, video').forEach(n => n.remove());
  root.querySelectorAll('a').forEach(a => a.replaceWith(...[...a.childNodes]));
  for (const el of [root, ...root.querySelectorAll('*')]) {
    for (const at of [...el.attributes]) {
      const nm = at.name.toLowerCase();
      if (nm.startsWith('on')) el.removeAttribute(at.name);
      else if ((nm === 'href' || nm === 'xlink:href') && !at.value.trim().startsWith('#')) el.removeAttribute(at.name);
    }
  }
}
function resolveUses(root) {
  for (let pass = 0; pass < 4; pass++) {
    const uses = [...root.querySelectorAll('use')];
    if (!uses.length) break;
    for (const u of uses) {
      const ref = u.getAttribute('href') || u.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || '';
      let target = null;
      try { target = ref.startsWith('#') ? root.querySelector('#' + CSS.escape(ref.slice(1))) : null; } catch { target = null; }
      if (!target || target.contains(u)) { u.remove(); continue; }
      const g = root.ownerDocument.createElementNS(SVGNS, 'g');
      const x = parseFloat(u.getAttribute('x')) || 0, y = parseFloat(u.getAttribute('y')) || 0;
      const tr = ((u.getAttribute('transform') || '') + (x || y ? ` translate(${x} ${y})` : '')).trim();
      if (tr) g.setAttribute('transform', tr);
      if (target.localName === 'symbol') for (const ch of target.children) g.appendChild(ch.cloneNode(true));
      else g.appendChild(target.cloneNode(true));
      g.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
      u.replaceWith(g);
    }
  }
}
function shapeToPath(el) {
  const v = a => parseFloat(el.getAttribute(a)) || 0;
  switch (el.localName) {
    case 'rect': {
      const x = v('x'), y = v('y'), w = v('width'), h = v('height');
      if (!(w > 0 && h > 0)) return null;
      let rx = v('rx'), ry = v('ry');
      if (!el.hasAttribute('ry')) ry = rx;
      if (!el.hasAttribute('rx')) rx = ry;
      rx = Math.min(rx, w / 2); ry = Math.min(ry, h / 2);
      if (rx > 0 && ry > 0) return `M${x + rx} ${y}H${x + w - rx}A${rx} ${ry} 0 0 1 ${x + w} ${y + ry}V${y + h - ry}A${rx} ${ry} 0 0 1 ${x + w - rx} ${y + h}H${x + rx}A${rx} ${ry} 0 0 1 ${x} ${y + h - ry}V${y + ry}A${rx} ${ry} 0 0 1 ${x + rx} ${y}Z`;
      return `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
    }
    case 'circle': { const cx = v('cx'), cy = v('cy'), r = v('r'); if (!(r > 0)) return null; return `M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`; }
    case 'ellipse': { const cx = v('cx'), cy = v('cy'), rx = v('rx'), ry = v('ry'); if (!(rx > 0 && ry > 0)) return null; return `M${cx - rx} ${cy}A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}Z`; }
    case 'line': return `M${v('x1')} ${v('y1')}L${v('x2')} ${v('y2')}`;
    case 'polyline': case 'polygon': {
      const n = (el.getAttribute('points') || '').trim().split(/[\s,]+/).map(Number).filter(Number.isFinite);
      if (n.length < 4) return null;
      let d = `M${n[0]} ${n[1]}`;
      for (let i = 2; i + 1 < n.length; i += 2) d += `L${n[i]} ${n[i + 1]}`;
      return el.localName === 'polygon' ? d + 'Z' : d;
    }
  }
  return null;
}
/* Lee el atributo d de un trazo: subtrazos con sus segmentos en coordenadas absolutas.
   Las cuadráticas pasan a cúbicas y los arcos, a su forma con centro. */
const PATH_ARGS = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
function parsePathData(d) {
  const n = d.length, subs = [];
  let i = 0;
  const isDigit = k => k >= 48 && k <= 57;
  const skip = () => { while (i < n) { const k = d.charCodeAt(i); if (k === 32 || k === 44 || (k >= 9 && k <= 13)) i++; else break; } };
  const num = () => {
    skip();
    const s = i;
    if (d[i] === '+' || d[i] === '-') i++;
    let dig = 0;
    while (isDigit(d.charCodeAt(i))) { i++; dig++; }
    if (d[i] === '.') { i++; while (isDigit(d.charCodeAt(i))) { i++; dig++; } }
    if (!dig) { i = s; return NaN; }
    if (d[i] === 'e' || d[i] === 'E') {
      let j = i + 1;
      if (d[j] === '+' || d[j] === '-') j++;
      if (isDigit(d.charCodeAt(j))) { while (isDigit(d.charCodeAt(j))) j++; i = j; }
    }
    return Number(d.slice(s, i));
  };
  // las banderas de los arcos son un solo dígito y pueden venir pegadas: «a1 1 0 01-2 2»
  const flag = () => { skip(); const c = d[i]; if (c === '0' || c === '1') { i++; return +c; } return NaN; };
  const args = C => {
    const a = [];
    for (let j = 0; j < PATH_ARGS[C]; j++) { const v = C === 'A' && (j === 3 || j === 4) ? flag() : num(); if (!Number.isFinite(v)) return null; a.push(v); }
    return a;
  };
  let x = 0, y = 0, x0 = 0, y0 = 0, qx = 0, qy = 0, last = '', cmd = '', sub = null;
  const begin = () => { if (!sub) { sub = { x0: x, y0: y, segs: [], closed: false }; subs.push(sub); x0 = x; y0 = y; } };
  for (;;) {
    skip();
    if (i >= n) break;
    if (/[a-z]/i.test(d[i])) cmd = d[i++];
    else if (!cmd || cmd === 'Z' || cmd === 'z') break;
    const C = cmd.toUpperCase();
    if (!(C in PATH_ARGS)) break;
    const a = args(C);
    if (!a) break; // ante un error se usa lo leído hasta ahí, como hace el navegador
    const ox = cmd === C ? 0 : x, oy = cmd === C ? 0 : y;
    if (C === 'Z') {
      if (sub) { if (x !== x0 || y !== y0) sub.segs.push({ t: 'L', x: x0, y: y0 }); sub.closed = true; }
      x = x0; y = y0; sub = null; last = C;
      continue;
    }
    if (C === 'M') {
      x = a[0] + ox; y = a[1] + oy; sub = null; begin();
      cmd = cmd === C ? 'L' : 'l'; // los pares que siguen a una M son líneas
      last = C;
      continue;
    }
    begin();
    let ex, ey;
    if (C === 'L') { ex = a[0] + ox; ey = a[1] + oy; sub.segs.push({ t: 'L', x: ex, y: ey }); }
    else if (C === 'H') { ex = a[0] + ox; ey = y; sub.segs.push({ t: 'L', x: ex, y: ey }); }
    else if (C === 'V') { ex = x; ey = a[0] + oy; sub.segs.push({ t: 'L', x: ex, y: ey }); }
    else if (C === 'C' || C === 'S') {
      const k = C === 'C' ? 2 : 0;
      let x1 = x, y1 = y;
      if (C === 'C') { x1 = a[0] + ox; y1 = a[1] + oy; }
      else if (last === 'C' || last === 'S') { x1 = 2 * x - qx; y1 = 2 * y - qy; }
      qx = a[k] + ox; qy = a[k + 1] + oy; ex = a[k + 2] + ox; ey = a[k + 3] + oy;
      sub.segs.push({ t: 'C', x1, y1, x2: qx, y2: qy, x: ex, y: ey });
    } else if (C === 'Q' || C === 'T') {
      if (C === 'Q') { qx = a[0] + ox; qy = a[1] + oy; ex = a[2] + ox; ey = a[3] + oy; }
      else {
        if (last === 'Q' || last === 'T') { qx = 2 * x - qx; qy = 2 * y - qy; } else { qx = x; qy = y; }
        ex = a[0] + ox; ey = a[1] + oy;
      }
      sub.segs.push({ t: 'C', x1: x + (qx - x) * 2 / 3, y1: y + (qy - y) * 2 / 3, x2: ex + (qx - ex) * 2 / 3, y2: ey + (qy - ey) * 2 / 3, x: ex, y: ey });
    } else {
      ex = a[5] + ox; ey = a[6] + oy;
      sub.segs.push(arcSegment(x, y, a[0], a[1], a[2], a[3], a[4], ex, ey));
    }
    x = ex; y = ey; last = C;
  }
  return subs;
}
/* Arco SVG dado por sus extremos → centro, radios y ángulos (apéndice de implementación de SVG) */
function arcSegment(x1, y1, rx, ry, rot, fA, fS, x2, y2) {
  rx = Math.abs(rx); ry = Math.abs(ry);
  if (!(rx > 0 && ry > 0) || (x1 === x2 && y1 === y2)) return { t: 'L', x: x2, y: y2 };
  const cp = Math.cos(rot * Math.PI / 180), sp = Math.sin(rot * Math.PI / 180);
  const hx = (x1 - x2) / 2, hy = (y1 - y2) / 2;
  const xp = cp * hx + sp * hy, yp = -sp * hx + cp * hy;
  const lam = xp * xp / (rx * rx) + yp * yp / (ry * ry);
  if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam); }
  const rx2 = rx * rx, ry2 = ry * ry;
  let k = Math.sqrt(Math.max(0, (rx2 * ry2 - rx2 * yp * yp - ry2 * xp * xp) / (rx2 * yp * yp + ry2 * xp * xp)));
  if (fA === fS) k = -k;
  const cxp = k * rx * yp / ry, cyp = -k * ry * xp / rx;
  const ux = (xp - cxp) / rx, uy = (yp - cyp) / ry, vx = (-xp - cxp) / rx, vy = (-yp - cyp) / ry;
  let dt = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  if (!fS && dt > 0) dt -= TAU; else if (fS && dt < 0) dt += TAU;
  return { t: 'A', cx: cp * cxp - sp * cyp + (x1 + x2) / 2, cy: sp * cxp + cp * cyp + (y1 + y2) / 2, rx, ry, cp, sp, t1: Math.atan2(uy, ux), dt, x: x2, y: y2 };
}
/* Largo aproximado de un segmento después de aplicarle la matriz m: alcanza para decidir en cuántos tramos aplanarlo */
function segEstimate(s, x, y, m) {
  const lin = (dx, dy) => Math.hypot(m.a * dx + m.c * dy, m.b * dx + m.d * dy);
  if (s.t === 'L') return lin(s.x - x, s.y - y);
  if (s.t === 'C') return lin(s.x1 - x, s.y1 - y) + lin(s.x2 - s.x1, s.y2 - s.y1) + lin(s.x - s.x2, s.y - s.y2);
  return Math.abs(s.dt) * Math.max(lin(s.rx * s.cp, s.rx * s.sp), lin(-s.ry * s.sp, s.ry * s.cp));
}
/* Aplana un subtrazo en tramos rectos de largo ≈ h, ya en coordenadas del dibujo; devuelve también su largo */
function flattenSub(sub, h) {
  const { a, b, c, d, e, f } = sub.m;
  const X = [], Y = [];
  let L = 0;
  const put = (px, py) => {
    const tx = a * px + c * py + e, ty = b * px + d * py + f, k = X.length;
    if (k) L += Math.hypot(tx - X[k - 1], ty - Y[k - 1]);
    X.push(tx); Y.push(ty);
  };
  let x = sub.x0, y = sub.y0;
  put(x, y);
  for (const s of sub.segs) {
    if (s.t === 'L') put(s.x, s.y);
    else {
      const k = clamp(Math.ceil(segEstimate(s, x, y, sub.m) / h), 2, 2000);
      for (let j = 1; j <= k; j++) {
        const t = j / k;
        if (s.t === 'C') {
          const u = 1 - t, w0 = u * u * u, w1 = 3 * u * u * t, w2 = 3 * u * t * t, w3 = t * t * t;
          put(w0 * x + w1 * s.x1 + w2 * s.x2 + w3 * s.x, w0 * y + w1 * s.y1 + w2 * s.y2 + w3 * s.y);
        } else {
          const th = s.t1 + s.dt * t, ct = Math.cos(th), st = Math.sin(th);
          put(s.cx + s.rx * s.cp * ct - s.ry * s.sp * st, s.cy + s.rx * s.sp * ct + s.ry * s.cp * st);
        }
      }
    }
    x = s.x; y = s.y;
  }
  return { X, Y, L };
}
/* n puntos equiespaciados por longitud de arco sobre una poligonal (si es cerrada, sin repetir el primero) */
function resamplePolyline(X, Y, n, closed) {
  const V = X.length, cum = new Float64Array(V);
  for (let i = 1; i < V; i++) cum[i] = cum[i - 1] + Math.hypot(X[i] - X[i - 1], Y[i] - Y[i - 1]);
  const L = cum[V - 1], pts = new Array(n);
  let e = 0;
  for (let k = 0; k < n; k++) {
    const s = L * k / (closed ? n : n - 1);
    while (e < V - 2 && cum[e + 1] < s) e++;
    const len = cum[e + 1] - cum[e], t = len > 0 ? (s - cum[e]) / len : 0;
    pts[k] = [X[e] + (X[e + 1] - X[e]) * t, Y[e] + (Y[e + 1] - Y[e]) * t];
  }
  return pts;
}
function polysFromSVGText(text) {
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  const svg = doc.documentElement;
  if (doc.querySelector('parsererror') || !svg || svg.localName !== 'svg') throw new Error('El archivo no es un SVG válido.');
  sanitizeSVG(svg);
  resolveUses(svg);
  const host = $('#svgHost');
  const live = document.importNode(svg, true);
  live.setAttribute('width', '1000'); live.setAttribute('height', '1000');
  host.replaceChildren(live);
  try {
    const rootM = live.getScreenCTM();
    if (!rootM) throw new Error('No pude medir el SVG.');
    const inv = rootM.inverse();
    const els = $$('path, rect, circle, ellipse, line, polyline, polygon', live).filter(el => !el.closest('defs, clipPath, mask, symbol, marker, pattern'));
    // El navegador solo da la matriz de cada elemento (transformaciones y viewBox); el trazo se lee acá.
    // getPointAtLength recorre el trazo desde el principio en cada llamada: 24 000 puntos tardaban segundos.
    const subs = [];
    let est = 0;
    for (const el of els) {
      const d = el.localName === 'path' ? el.getAttribute('d') : shapeToPath(el);
      const sm = d && el.getScreenCTM();
      if (!sm) continue;
      const m = inv.multiply(sm);
      for (const s of parsePathData(d)) {
        let len = 0, x = s.x0, y = s.y0;
        for (const g of s.segs) { len += segEstimate(g, x, y, m); x = g.x; y = g.y; }
        if (!(len > 0) || !Number.isFinite(len)) continue;
        s.m = m; s.rect = el.localName === 'rect';
        subs.push(s); est += len;
      }
    }
    if (!subs.length) throw new Error('El SVG no tiene trazos medibles (path, rect, circle…). Si tiene texto, convertilo a trazos.');
    const lines = subs.map(s => flattenSub(s, est / 50000));
    const total = lines.reduce((acc, l) => acc + l.L, 0);
    const polys = [];
    lines.forEach((l, k) => {
      if (!(l.L > 0)) return;
      const n = Math.max(8, Math.round(24000 * l.L / total));
      // un subtrazo sin «Z» que termina donde empezó también es cerrado
      const closed = subs[k].closed || Math.hypot(l.X[l.X.length - 1] - l.X[0], l.Y[l.Y.length - 1] - l.Y[0]) < 3 * l.L / (n - 1);
      if (closed && !subs[k].closed) { l.X.push(l.X[0]); l.Y.push(l.Y[0]); }
      polys.push({ pts: resamplePolyline(l.X, l.Y, n, closed), closed, fromRect: subs[k].rect });
    });
    return polys;
  } finally {
    host.replaceChildren();
  }
}
let d3Promise = null;
function ensureD3() {
  if (window.d3 && window.d3.contours) return Promise.resolve();
  if (!d3Promise) d3Promise = loadScript('https://cdn.jsdelivr.net/npm/d3-array@3.2.4/dist/d3-array.min.js').then(() => loadScript('https://cdn.jsdelivr.net/npm/d3-contour@4.0.2/dist/d3-contour.min.js'));
  return d3Promise;
}
function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    const [x1, y1] = pts[s], [x2, y2] = pts[e];
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    let md = -1, mi = -1;
    for (let i = s + 1; i < e; i++) {
      // si el tramo es un punto (anillo cerrado), se mide la distancia a ese punto
      const d = L < 1e-9 ? Math.hypot(pts[i][0] - x1, pts[i][1] - y1) : Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / L;
      if (d > md) { md = d; mi = i; }
    }
    if (md > eps) { keep[mi] = 1; stack.push([s, mi], [mi, e]); }
  }
  return pts.filter((_, i) => keep[i]);
}
function chaikin(pts, iters) {
  let p = pts;
  for (let it = 0; it < iters; it++) {
    const q = [];
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length];
      q.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]);
    }
    p = q;
  }
  return p;
}
/* Rasteriza → valores en [0,1] → contornos (marching squares de d3) → anillos cerrados */
async function polysFromValues(values, w, h) {
  await ensureD3();
  const W = w + 2, H = h + 2, padded = new Float64Array(W * H);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) padded[(y + 1) * W + x + 1] = values[y * w + x];
  const [mp] = window.d3.contours().size([W, H]).thresholds([0.5]).smooth(true)(padded);
  const polys = [];
  for (const polygon of mp.coordinates) for (const ring of polygon) {
    let pts = ring.slice(0, -1).map(([x, y]) => [x, y]);
    if (pts.length < 8) continue;
    pts = rdp([...pts, pts[0]], 0.55).slice(0, -1);
    if (pts.length < 4) continue;
    pts = chaikin(pts, 2);
    polys.push({ pts, closed: true });
  }
  return polys;
}
async function polysFromText(text, fontKind) {
  const fam = fontKind === 'sans' ? FONT_UI : fontKind === 'emoji' ? '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' : FONT_SERIF;
  const weight = fontKind === 'emoji' ? 400 : 600;
  if (fontKind !== 'emoji') { try { await document.fonts.load(`${weight} 100px ${fam}`, text); } catch { /* usa la alternativa */ } }
  const probe = document.createElement('canvas').getContext('2d');
  let size = 420;
  probe.font = `${weight} ${size}px ${fam}`;
  let tw = probe.measureText(text).width;
  if (tw > 2200) { size = Math.floor(size * 2200 / tw); probe.font = `${weight} ${size}px ${fam}`; tw = probe.measureText(text).width; }
  const w = Math.ceil(tw + size * 0.5), h = Math.ceil(size * 1.5);
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  ctx.font = `${weight} ${size}px ${fam}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'center'; ctx.fillStyle = '#000';
  ctx.fillText(text, w / 2, h / 2);
  const data = ctx.getImageData(0, 0, w, h).data, vals = new Float64Array(w * h);
  for (let i = 0; i < w * h; i++) vals[i] = data[i * 4 + 3] / 255;
  const polys = await polysFromValues(vals, w, h);
  if (!polys.length) throw new Error('No se pudo trazar ese texto. Probá con otra tipografía.');
  return polys;
}
async function polysFromImage(bitmap, thr, invert) {
  const maxSide = 900, sc = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(8, Math.round(bitmap.width * sc)), h = Math.max(8, Math.round(bitmap.height * sc));
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(bitmap, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data, vals = new Float64Array(w * h);
  let transparent = 0;
  for (let i = 0; i < w * h; i++) if (data[i * 4 + 3] < 200) transparent++;
  const useAlpha = transparent > 0.05 * w * h;
  for (let i = 0; i < w * h; i++) {
    const a = data[i * 4 + 3] / 255;
    const lum = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255;
    let v = useAlpha ? a * (invert ? lum : 1) : (invert ? lum : 1 - lum);
    // el umbral elegido pasa a ser el nivel 0,5 del contorno
    v = v >= thr ? 0.5 + 0.5 * (v - thr) / Math.max(1e-6, 1 - thr) : 0.5 * v / Math.max(1e-6, thr);
    vals[i] = v;
  }
  const polys = await polysFromValues(vals, w, h);
  if (!polys.length) throw new Error('No encontré una silueta. Probá mover el umbral o invertir.');
  return polys;
}
function mathFigure(kind) {
  const P = [];
  if (kind === 'heart') {
    // Muestreado en el tiempo de su fórmula: tiene exactamente 8 términos, así que con N = 8 queda perfecto.
    const x = new Float64Array(M), y = new Float64Array(M);
    for (let k = 0; k < M; k++) { const t = TAU * k / M; x[k] = 16 * Math.sin(t) ** 3; y[k] = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)); }
    return { direct: { x, y } };
  }
  if (kind === 'butterfly') {
    for (let i = 0; i < 9000; i++) { const t = i / 9000 * 12 * Math.PI; const r = Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.sin(t / 12) ** 5; P.push([Math.sin(t) * r, -Math.cos(t) * r]); }
    return { polys: [{ pts: P, closed: true }] };
  }
  if (kind === 'square') return { polys: [{ pts: [[-1, -1], [1, -1], [1, 1], [-1, 1]], closed: true }] };
  if (kind === 'spiro') {
    // Tres términos exactos, muestreados en el tiempo (no por longitud de arco): con N = 3 es perfecto.
    const x = new Float64Array(M), y = new Float64Array(M);
    for (let k = 0; k < M; k++) {
      const a = TAU * k / M;
      x[k] = Math.cos(a) + 0.42 * Math.cos(-5 * a + 0.6) + 0.13 * Math.cos(11 * a);
      y[k] = Math.sin(a) + 0.42 * Math.sin(-5 * a + 0.6) + 0.13 * Math.sin(11 * a);
    }
    return { direct: { x, y } };
  }
  return { polys: [] };
}

/* ============================================================
   Estado
   ============================================================ */
const DEFAULTS = {
  src: 'ejemplos', example: 'dragon', mode: 'complex', N: 150, order: 'amp', join: 'bridge-hidden',
  script: 'single', drawSec: 12, stepSec: 1.4, holdSec: 2.5,
  showCircles: true, showArms: true, showGhost: true, showFormula: true, showCounter: true, fadeEnd: true,
  cam: 'fixed', zoom: 8, fmt: '9:16', estilo: 'auto',
  title: 'Dibujar con círculos', subtitle: 'Cada círculo es un término de una serie de Fourier', handle: '@tu.pagina',
  fps: 30, minFrac: 0.2, imgThr: 50, imgInv: false, txt: 'Fourier', txtFont: 'serif',
};
const cfg = Object.assign({}, DEFAULTS, store.get('cfg', {}));
const state = { fig: null, samples: null, A: null, curves: new Map(), tl: null, layout: null, formula: null, figVersion: 0, rawPolys: null, lastSource: null };
const saveCfg = () => store.set('cfg', cfg);

function Nmax() { return cfg.mode === 'complex' ? 1000 : 500; }
function termsFor(N) {
  const A = state.A;
  if (cfg.mode === 'complex') return (cfg.order === 'amp' ? A.byAmp : A.byFreq).slice(0, N);
  return { x: (cfg.order === 'amp' ? A.xByAmp : A.xByFreq).slice(0, N), y: (cfg.order === 'amp' ? A.yByAmp : A.yByFreq).slice(0, N) };
}
function curveFor(N) {
  const key = cfg.mode + '|' + cfg.order + '|' + N;
  let c = state.curves.get(key);
  if (c) return c;
  const A = state.A, sel = termsFor(N);
  if (cfg.mode === 'complex') {
    const re = new Float64Array(M2), im = new Float64Array(M2);
    re[0] = A.c0[0]; im[0] = A.c0[1];
    for (const t of sel) { const j = ((t.n % M2) + M2) % M2; re[j] += t.re; im[j] += t.im; }
    synthSum(re, im);
    c = { x: re, y: im };
  } else {
    const xr = new Float64Array(M2), xi = new Float64Array(M2), yr = new Float64Array(M2), yi = new Float64Array(M2);
    xr[0] = A.X0; yr[0] = A.Y0;
    for (const t of sel.x) { xr[t.n] += 2 * t.re; xi[t.n] += 2 * t.im; }
    for (const t of sel.y) { yr[t.n] += 2 * t.re; yi[t.n] += 2 * t.im; }
    synthSum(xr, xi); synthSum(yr, yi);
    c = { x: xr, y: yr };
  }
  if (state.curves.size > 60) state.curves.clear();
  state.curves.set(key, c);
  return c;
}
function errorCurve() {
  const A = state.A, nmax = Nmax(), err = new Float64Array(nmax + 1);
  if (cfg.mode === 'complex') {
    const list = cfg.order === 'amp' ? A.byAmp : A.byFreq;
    let res = A.Etot; err[0] = Math.sqrt(res);
    for (let i = 0; i < nmax; i++) { res -= list[i].amp ** 2; err[i + 1] = Math.sqrt(Math.max(0, res)); }
    return { err, E: A.Etot };
  }
  const lx = cfg.order === 'amp' ? A.xByAmp : A.xByFreq, ly = cfg.order === 'amp' ? A.yByAmp : A.yByFreq;
  let res = A.Ex + A.Ey; err[0] = Math.sqrt(res);
  for (let i = 0; i < nmax; i++) { res -= (lx[i].amp ** 2 + ly[i].amp ** 2) / 2; err[i + 1] = Math.sqrt(Math.max(0, res)); }
  return { err, E: A.Ex + A.Ey };
}
function progressiveSeq(N) {
  const nice = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400, 500, 600, 800, 1000];
  let s = nice.filter(v => v < N); s.push(N);
  while (s.length > 16) {
    const keep = s.slice(0, 3);
    for (let i = 3; i < s.length - 1; i += 2) keep.push(s[i]);
    keep.push(s[s.length - 1]);
    if (keep.length >= s.length) break;
    s = keep;
  }
  return s;
}
function rebuildTimeline() {
  const seq = cfg.script === 'progressive' ? progressiveSeq(cfg.N) : [cfg.N];
  const durs = seq.map((n, i) => i === seq.length - 1 ? cfg.drawSec : cfg.stepSec);
  const starts = []; let acc = 0;
  for (const d of durs) { starts.push(acc); acc += d; }
  state.tl = { seq, durs, starts, drawEnd: acc, total: acc + cfg.holdSec };
  state.layout = null;
}
function tlAt(time) {
  const tl = state.tl;
  if (time >= tl.drawEnd) return { i: tl.seq.length - 1, N: tl.seq[tl.seq.length - 1], phase: 1, hold: time - tl.drawEnd, prevN: null, stepT: 99 };
  let i = tl.starts.length - 1;
  while (i > 0 && tl.starts[i] > time) i--;
  return { i, N: tl.seq[i], phase: clamp((time - tl.starts[i]) / tl.durs[i], 0, 1), hold: -1, prevN: i > 0 ? tl.seq[i - 1] : null, stepT: time - tl.starts[i] };
}

/* Carga una figura nueva (polilíneas en cualquier escala) */
function setFigure(fig, name) {
  let polys = null, direct = null;
  if (fig.direct) {
    const b = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    for (let k = 0; k < M; k++) { b.minX = Math.min(b.minX, fig.direct.x[k]); b.maxX = Math.max(b.maxX, fig.direct.x[k]); b.minY = Math.min(b.minY, fig.direct.y[k]); b.maxY = Math.max(b.maxY, fig.direct.y[k]); }
    const cx = (b.minX + b.maxX) / 2, cy = (b.minY + b.maxY) / 2, sc = 1 / Math.max(b.maxX - b.minX, b.maxY - b.minY);
    direct = { x: fig.direct.x.map(v => (v - cx) * sc), y: fig.direct.y.map(v => (v - cy) * sc) };
    const pts = []; for (let k = 0; k < M; k++) pts.push([direct.x[k], direct.y[k]]);
    polys = [{ pts, closed: true, len: 1 }];
  } else {
    polys = cleanPolys(normalizePolys(fig.polys.filter(p => p.pts && p.pts.length >= 2)), cfg.minFrac / 100);
    if (!polys.length) throw new Error('No encontré trazos utilizables en esta figura.');
    polys = normalizePolys(polys).map((p, i) => ({ ...p, len: polyLength(p.pts, p.closed) }));
  }
  state.rawPolys = fig.direct ? null : fig.polys;
  state.fig = { name, polys, direct, bbox: bboxOf(polys) };
  state.figVersion++;
  rebuildLoop();
  const parts = polys.length;
  setStatus('#figStatus', `${name}: ${parts} ${parts === 1 ? 'parte' : 'partes'}, ${M} muestras.`);
}
function rebuildLoop() {
  const f = state.fig;
  if (f.direct) state.samples = { x: Float64Array.from(f.direct.x), y: Float64Array.from(f.direct.y), pen: new Uint8Array(M).fill(1) };
  else state.samples = resampleLoop(buildLoop(f.polys, cfg.join), M);
  state.A = analyze(state.samples);
  state.curves.clear();
  state.ghost = buildGhost(f.polys);
  rebuildTerms();
}
function rebuildTerms() {
  cfg.N = clamp(Math.round(cfg.N), 1, Nmax());
  state.err = errorCurve();
  rebuildTimeline();
  updateFormula();
  updateReadouts();
  drawCharts();
  updateExportInfo();
  syncN();
  requestRender(true);
  if (!$('#explain').hidden) drawMultiples();
}
function buildGhost(polys) {
  const path = new Path2D(), lines = new Path2D();
  let anyClosed = false, anyOpen = false;
  for (const p of polys) {
    const target = p.closed ? path : lines;
    p.closed ? anyClosed = true : anyOpen = true;
    target.moveTo(p.pts[0][0], p.pts[0][1]);
    for (let i = 1; i < p.pts.length; i++) target.lineTo(p.pts[i][0], p.pts[i][1]);
    if (p.closed) target.closePath();
  }
  return { path, lines, anyClosed, anyOpen };
}

/* ============================================================
   Fórmulas (MathJax → SVG → imagen para el lienzo)
   ============================================================ */
let mjPromise = null;
function ensureMathJax() {
  if (mjPromise) return mjPromise;
  window.MathJax = {
    tex: { inlineMath: [['\\(', '\\)']], displayMath: [['\\[', '\\]']] },
    svg: { fontCache: 'local' },
    options: { enableMenu: false },
    startup: { typeset: false },
  };
  mjPromise = loadScript('https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.min.js').then(() => window.MathJax.startup.promise);
  return mjPromise;
}
function svgUrl(svg, w, h, color) {
  svg.setAttribute('width', w); svg.setAttribute('height', h);
  const s = new XMLSerializer().serializeToString(svg).replaceAll('currentColor', color);
  return URL.createObjectURL(new Blob([s], { type: 'image/svg+xml' }));
}
function loadImage(url) {
  const img = new Image();
  return new Promise((res, rej) => { img.onload = () => res(img); img.onerror = () => rej(new Error('fórmula')); img.src = url; });
}
async function texImage(tex, color) {
  await ensureMathJax();
  const node = await window.MathJax.tex2svgPromise(tex, { display: true });
  const svg = node.querySelector('svg');
  const vb = svg.getAttribute('viewBox').split(/[\s,]+/).map(Number);
  const em = 100; // px por em en la imagen de muestra
  const w = vb[2] / 1000 * em, h = vb[3] / 1000 * em;
  svg.removeAttribute('style');
  svg.setAttribute('xmlns', SVGNS);
  const url = svgUrl(svg, w, h, color);
  return { img: await loadImage(url), w, h, url, svg, color, rasters: new Map() };
}
// una imagen escalada se desenfoca: la fórmula se rasteriza aparte para cada tamaño en que se dibuja
function formulaRaster(f, w, h) {
  const k = w + 'x' + h;
  let r = f.rasters.get(k);
  if (r) return r;
  r = { canvas: null };
  f.rasters.set(k, r);
  if (f.rasters.size > 6) f.rasters.delete(f.rasters.keys().next().value);
  const url = svgUrl(f.svg, w, h, f.color);
  r.ready = loadImage(url).then(img => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    c.getContext('2d').drawImage(img, 0, 0, w, h);
    r.canvas = c; requestRender();
  }).catch(() => { /* queda la imagen de muestra */ }).finally(() => URL.revokeObjectURL(url));
  return r;
}
// antes de exportar, la fórmula ya rasterizada al tamaño del video
async function formulaLista(ctx, W, H) {
  state.layout = null;
  const b = getLayout(ctx, W, H).blocks.formula;
  if (b) await Promise.all(b.map((r, i) => formulaRaster(state.formula.imgs[i], r.w, r.h).ready));
}
function formulaTex() {
  if (cfg.mode === 'complex') {
    return [cfg.order === 'freq'
      ? 'z_N(t)=c_0+\\sum_{0<|n|\\le N/2} c_n\\,e^{2\\pi i\\,n t}'
      : 'z_N(t)=c_0+\\sum_{n\\in K_N} c_n\\,e^{2\\pi i\\,n t}'];
  }
  const rng = cfg.order === 'freq' ? '_{k=1}^{N}' : '_{k\\in K_N}';
  return [
    `x_N(t)=a_0+\\sum${rng}\\big(a_k\\cos 2\\pi kt+b_k\\sin 2\\pi kt\\big)`,
    `y_N(t)=c_0+\\sum${rng}\\big(c_k\\cos 2\\pi kt+d_k\\sin 2\\pi kt\\big)`,
  ];
}
let formulaReq = 0;
async function updateFormula() {
  const T = THEMES[estiloVideo()];
  const texs = formulaTex();
  const colors = cfg.mode === 'complex' ? [T.formula] : [T.fx, T.fy];
  const key = texs.join('|') + '|' + colors.join(',');
  if (state.formula && state.formula.key === key) return state.formula;
  const req = ++formulaReq;
  try {
    const imgs = await Promise.all(texs.map((t, i) => texImage(t, colors[i])));
    if (req !== formulaReq) return state.formula;
    if (state.formula) state.formula.imgs.forEach(f => URL.revokeObjectURL(f.url));
    state.formula = { key, imgs };
    state.layout = null;
    requestRender(true);
  } catch { /* sin fórmula: el resto funciona igual */ }
  return state.formula;
}

/* ============================================================
   Diagramación del cuadro (mismas proporciones en vista previa y video)
   ============================================================ */
function wrapText(ctx, text, maxW, maxLines) {
  const words = text.split(/\s+/).filter(Boolean), lines = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (ctx.measureText(t).width <= maxW || !cur) cur = t; else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] += '…'; }
  return lines;
}
function getLayout(ctx, W, H) {
  const key = [W, H, cfg.fmt, cfg.mode, cfg.order, cfg.title, cfg.subtitle, cfg.handle, cfg.showFormula, cfg.showCounter, cfg.N, cfg.script, state.figVersion, cfg.join, state.formula && state.formula.key].join('|');
  if (state.layout && state.layout.key === key) return state.layout;
  const u = Math.min(W, H) / 1080;
  const vertical = cfg.fmt === '9:16';
  const padX = 44 * u;
  const blocks = {};
  let y = (vertical ? 0.055 : 0.04) * H;
  if (cfg.title.trim()) {
    const size = (cfg.fmt === '16:9' ? 64 : 78) * u;
    ctx.font = `600 ${size}px ${FONT_DISPLAY}`;
    const lines = wrapText(ctx, cfg.title.trim(), W - 2 * padX, 2);
    blocks.title = { y: y + size * 0.82, size, lines };
    y += lines.length * size * 1.1 + 8 * u;
  }
  if (cfg.subtitle.trim()) {
    const size = 40 * u;
    ctx.font = `500 ${size}px ${FONT_UI}`;
    const lines = wrapText(ctx, cfg.subtitle.trim(), W - 2 * padX * 1.15, 3);
    blocks.sub = { y: y + size, size, lines };
    y += lines.length * size * 1.3 + 16 * u;
  }
  if (cfg.showFormula && state.formula) {
    const n = state.formula.imgs.length, lineH = (n > 1 ? 84 : 112) * u, maxW = W - 2 * 40 * u;
    // cada renglón en píxeles enteros, a la medida de su rasterización
    blocks.formula = state.formula.imgs.map((f, i) => {
      let h = lineH, w = f.w / f.h * h;
      if (w > maxW) { h *= maxW / w; w = maxW; }
      w = Math.max(1, Math.round(w)); h = Math.max(1, Math.round(h));
      return { x: Math.round(W / 2 - w / 2), y: Math.round(y + i * lineH * 1.08 + (lineH - h) / 2), w, h };
    });
    y += n * lineH * 1.08 + 10 * u;
  }
  const top = y + 10 * u;
  // en 9:16 queda libre el 10 % de abajo, donde las apps de video ponen sus botones
  let bottom = H * (vertical ? 0.90 : 0.965);
  if (cfg.handle.trim()) { blocks.handle = { y: bottom, size: 32 * u }; bottom -= 56 * u; }
  const area = (right, bot) => ({ x: padX, y: top, w: right - padX, h: Math.max(120 * u, bot - top) });
  let region = area(W - padX, bottom), base;
  if (cfg.showCounter) {
    // el contador va debajo de la figura o en una columna al costado: donde la figura quede más grande
    const size = 100 * u;
    ctx.font = `600 ${size}px ${FONT_DISPLAY}`;
    const cw = Math.max(260 * u, ctx.measureText('N = ' + state.tl.seq[state.tl.seq.length - 1]).width + 48 * u);
    const abajo = area(W - padX, bottom - 185 * u), costado = area(W - padX - cw, bottom);
    const fa = fitGeometry(abajo, u), fc = fitGeometry(costado, u);
    if (fc.s > fa.s) { region = costado; base = fc; blocks.counter = { x: W - padX - cw / 2, y: (top + bottom) / 2, size, w: cw }; }
    else { region = abajo; base = fa; blocks.counter = { x: W / 2, y: bottom - 42 * u, size, w: W - 2 * padX }; }
  }
  if (!base) base = fitGeometry(region, u);
  state.layout = { key, u, blocks, region, base };
  return state.layout;
}
function fitGeometry(region, u) {
  const bb = state.fig.bbox, A = state.A;
  const maxN = state.tl.seq[state.tl.seq.length - 1];
  if (cfg.mode === 'complex') {
    const sel = termsFor(Math.min(maxN, 4));
    const r1 = sel.length ? sel[0].amp : 0;
    const minX = Math.min(bb.minX, A.c0[0] - r1), maxX = Math.max(bb.maxX, A.c0[0] + r1);
    const minY = Math.min(bb.minY, A.c0[1] - r1), maxY = Math.max(bb.maxY, A.c0[1] + r1);
    const s = Math.min(region.w / (maxX - minX), region.h / (maxY - minY)) * 0.97;
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    return { s, cx, cy, ox: region.x + region.w / 2 - s * cx, oy: region.y + region.h / 2 - s * cy };
  }
  const sel = termsFor(maxN);
  // alcance real de cada cadena en su dirección «libre» (la que no marca la coordenada)
  const reach = list => {
    const top = list.slice(0, 40);
    let m = top.length ? top[0].amp : 0;
    for (let k = 0; k < 120; k++) {
      let acc = 0;
      for (const T of top) { acc += T.amp * Math.sin(TAU * T.n * k / 120 + T.ph); if (Math.abs(acc) > m) m = Math.abs(acc); }
    }
    return m * 1.04;
  };
  const Sw = bb.maxX - bb.minX, Sh = bb.maxY - bb.minY, cap = 0.6 * Math.max(Sw, Sh);
  const rx = Math.min(reach(sel.x), cap), ry = Math.min(reach(sel.y), cap), gap = 30 * u;
  const s = Math.min((region.w - gap) / (2 * ry + Sw), (region.h - gap) / (2 * rx + Sh)) * 0.985;
  const totalW = 2 * ry * s + gap + Sw * s, totalH = 2 * rx * s + gap + Sh * s;
  const x0 = region.x + (region.w - totalW) / 2, y0 = region.y + (region.h - totalH) / 2;
  return { s, bandX: x0 + ry * s, bandY: y0 + rx * s, ox: x0 + 2 * ry * s + gap - s * bb.minX, oy: y0 + 2 * rx * s + gap - s * bb.minY };
}
function cameraAt(L, st) {
  const b = L.base;
  if (cfg.mode !== 'complex' || cfg.cam !== 'follow') return b;
  let r = 0;
  const last = st.i === state.tl.seq.length - 1;
  if (st.hold < 0 && last) r = smooth(st.phase / 0.07) * (1 - smooth((st.phase - 0.93) / 0.07));
  if (r <= 0) return b;
  const tip = chainTipComplex(termsFor(st.N), st.phase);
  const s = b.s * (1 + (cfg.zoom - 1) * r);
  const cx = b.cx + (tip[0] - b.cx) * r, cy = b.cy + (tip[1] - b.cy) * r;
  const rc = L.region;
  return { s, ox: rc.x + rc.w / 2 - s * cx, oy: rc.y + rc.h / 2 - s * cy };
}
function chainTipComplex(sel, t) {
  let x = state.A.c0[0], y = state.A.c0[1];
  for (const T of sel) { const a = TAU * T.n * t + T.ph; x += T.amp * Math.cos(a); y += T.amp * Math.sin(a); }
  return [x, y];
}

/* ============================================================
   Render de un cuadro
   ============================================================ */
function tracePath(curve, K, cam, tip) {
  const pen = state.samples.pen, X = curve.x, Y = curve.y, ratio = M / M2;
  const path = new Path2D();
  let started = false;
  const last = Math.min(K, M2 - 1);
  for (let k = 0; k <= last; k++) {
    const sx = cam.ox + cam.s * X[k], sy = cam.oy + cam.s * Y[k];
    if (!started) { path.moveTo(sx, sy); started = true; continue; }
    if (pen[Math.floor(k * ratio)]) path.lineTo(sx, sy); else path.moveTo(sx, sy);
  }
  if (tip && pen[Math.min(M - 1, Math.floor(last * ratio))]) path.lineTo(cam.ox + cam.s * tip[0], cam.oy + cam.s * tip[1]);
  return path;
}
function strokeGlow(ctx, path, color, glow, w, alpha) {
  ctx.globalAlpha = alpha;
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.strokeStyle = glow; ctx.lineWidth = w * 3.2; ctx.stroke(path);
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke(path);
  ctx.globalAlpha = 1;
}
function drawGhost(ctx, cam, T, alpha) {
  const g = state.ghost;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.setTransform(cam.s * ctx.__dpr, 0, 0, cam.s * ctx.__dpr, cam.ox * ctx.__dpr, cam.oy * ctx.__dpr);
  if (g.anyClosed) { ctx.fillStyle = T.ghost; ctx.fill(g.path, 'evenodd'); }
  if (g.anyOpen) { ctx.strokeStyle = T.ghostLine; ctx.lineWidth = 3 / cam.s * (ctx.__u || 1); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(g.lines); }
  ctx.restore();
}
function render(ctx, W, H, time) {
  const T = THEMES[estiloVideo()];
  ctx.__dpr = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, H);
  if (!state.A) return;
  const L = getLayout(ctx, W, H), u = L.u;
  ctx.__u = u;
  const vg = ctx.createRadialGradient(W / 2, L.region.y + L.region.h / 2, 0, W / 2, L.region.y + L.region.h / 2, Math.max(W, H) * 0.7);
  vg.addColorStop(0, T.vignette); vg.addColorStop(1, T.bg);
  ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  const st = tlAt(time);
  const fade = cfg.fadeEnd && st.hold >= 0 ? smooth(st.hold / 0.9) : 0;
  const cam = cameraAt(L, st);
  if (cfg.showGhost) drawGhost(ctx, cam, T, 1 - 0.35 * fade);
  // paso anterior (modo N creciente): se desvanece mientras se dibuja el nuevo
  if (st.prevN && st.hold < 0) {
    const pc = curveFor(st.prevN);
    const a = 0.85 * (1 - smooth(st.phase * 1.4));
    if (a > 0.01) { const p = tracePath(pc, M2 - 1, cam, [pc.x[0], pc.y[0]]); ctx.globalAlpha = a; ctx.strokeStyle = T.prev; ctx.lineWidth = 2 * u; ctx.lineJoin = 'round'; ctx.stroke(p); ctx.globalAlpha = 1; }
  }
  const cur = curveFor(st.N);
  const K = Math.floor(st.phase * M2);
  let tip;
  if (cfg.mode === 'complex') tip = chainTipComplex(termsFor(st.N), st.phase);
  else { const k = Math.min(M2 - 1, Math.floor(st.phase * M2)); tip = xyTip(st); if (!tip) tip = [cur.x[k], cur.y[k]]; }
  strokeGlow(ctx, tracePath(cur, st.phase >= 1 ? M2 - 1 : K, cam, st.phase >= 1 ? [cur.x[0], cur.y[0]] : tip), T.trace, T.glow, 3 * u, 1);
  const chainAlpha = 1 - fade;
  if (chainAlpha > 0.01) {
    if (cfg.mode === 'complex') drawChainComplex(ctx, st, cam, T, u, chainAlpha);
    else drawChainsXY(ctx, st, cam, T, u, chainAlpha);
  }
  // punta del lápiz
  const px = cam.ox + cam.s * tip[0], py = cam.oy + cam.s * tip[1];
  const pg = ctx.createRadialGradient(px, py, 0, px, py, 16 * u);
  pg.addColorStop(0, T.glow.replace(/[\d.]+\)$/, '0.9)')); pg.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = pg; ctx.globalAlpha = 1 - 0.7 * fade; ctx.beginPath(); ctx.arc(px, py, 16 * u, 0, TAU); ctx.fill();
  ctx.fillStyle = T.pen; ctx.beginPath(); ctx.arc(px, py, 4.2 * u, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
  drawTexts(ctx, W, H, L, T, st);
}
function xyTip(st) {
  const sel = termsFor(st.N), A = state.A;
  let x = A.X0, y = A.Y0;
  for (const t of sel.x) x += t.amp * Math.cos(TAU * t.n * st.phase + t.ph);
  for (const t of sel.y) y += t.amp * Math.cos(TAU * t.n * st.phase + t.ph);
  return [x, y];
}
function drawChainComplex(ctx, st, cam, T, u, alpha) {
  const sel = termsFor(st.N), t = st.phase;
  let x = state.A.c0[0], y = state.A.c0[1];
  let sx = cam.ox + cam.s * x, sy = cam.oy + cam.s * y;
  const circles = new Path2D(), arms = new Path2D();
  arms.moveTo(sx, sy);
  const W = ctx.canvas.width, H = ctx.canvas.height;
  for (const T2 of sel) {
    const r = T2.amp * cam.s, a = TAU * T2.n * t + T2.ph;
    const nx = x + T2.amp * Math.cos(a), ny = y + T2.amp * Math.sin(a);
    const nsx = cam.ox + cam.s * nx, nsy = cam.oy + cam.s * ny;
    if (cfg.showCircles && r > 0.7 * u && sx + r > 0 && sx - r < W && sy + r > 0 && sy - r < H) { circles.moveTo(sx + r, sy); circles.arc(sx, sy, r, 0, TAU); }
    arms.lineTo(nsx, nsy);
    x = nx; y = ny; sx = nsx; sy = nsy;
  }
  ctx.globalAlpha = alpha;
  if (cfg.showCircles) { ctx.strokeStyle = T.circle; ctx.lineWidth = 1.4 * u; ctx.stroke(circles); }
  if (cfg.showArms) { ctx.strokeStyle = T.arm; ctx.lineWidth = 1.9 * u; ctx.lineJoin = 'round'; ctx.stroke(arms); }
  ctx.globalAlpha = 1;
}
function drawChainsXY(ctx, st, cam, T, u, alpha) {
  const sel = termsFor(st.N), t = st.phase, A = state.A;
  const drawChain = (list, startX, startY, horizontal, color) => {
    let lx = 0, ly = 0;
    const circles = new Path2D(), arms = new Path2D();
    let sx = startX, sy = startY;
    arms.moveTo(sx, sy);
    for (const T2 of list) {
      const a = TAU * T2.n * t + T2.ph, r = T2.amp * cam.s;
      const dx = horizontal ? T2.amp * Math.cos(a) : T2.amp * Math.sin(a);
      const dy = horizontal ? T2.amp * Math.sin(a) : T2.amp * Math.cos(a);
      if (cfg.showCircles && r > 0.7 * u) { circles.moveTo(sx + r, sy); circles.arc(sx, sy, r, 0, TAU); }
      lx += dx; ly += dy;
      sx = startX + cam.s * lx; sy = startY + cam.s * ly;
      arms.lineTo(sx, sy);
    }
    if (cfg.showCircles) { ctx.strokeStyle = T.circle; ctx.lineWidth = 1.4 * u; ctx.stroke(circles); }
    if (cfg.showArms) { ctx.strokeStyle = color; ctx.lineWidth = 2 * u; ctx.lineJoin = 'round'; ctx.stroke(arms); }
    return [sx, sy];
  };
  ctx.globalAlpha = alpha;
  const tipX = drawChain(sel.x, cam.ox + cam.s * A.X0, cam.bandY, true, T.chainX);
  const tipY = drawChain(sel.y, cam.bandX, cam.oy + cam.s * A.Y0, false, T.chainY);
  const pen = xyTip(st), px = cam.ox + cam.s * pen[0], py = cam.oy + cam.s * pen[1];
  ctx.setLineDash([7 * u, 7 * u]); ctx.lineWidth = 1.6 * u;
  ctx.strokeStyle = T.chainX; ctx.beginPath(); ctx.moveTo(tipX[0], tipX[1]); ctx.lineTo(px, py); ctx.stroke();
  ctx.strokeStyle = T.chainY; ctx.beginPath(); ctx.moveTo(tipY[0], tipY[1]); ctx.lineTo(px, py); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = T.chainX; ctx.beginPath(); ctx.arc(tipX[0], tipX[1], 4 * u, 0, TAU); ctx.fill();
  ctx.fillStyle = T.chainY; ctx.beginPath(); ctx.arc(tipY[0], tipY[1], 4 * u, 0, TAU); ctx.fill();
  ctx.globalAlpha = 1;
}
function drawTexts(ctx, W, H, L, T, st) {
  const b = L.blocks, u = L.u;
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  if (b.title) { ctx.fillStyle = T.title; ctx.font = `600 ${b.title.size}px ${FONT_DISPLAY}`; b.title.lines.forEach((ln, i) => ctx.fillText(ln, W / 2, b.title.y + i * b.title.size * 1.1)); }
  if (b.sub) { ctx.fillStyle = T.sub; ctx.font = `500 ${b.sub.size}px ${FONT_UI}`; b.sub.lines.forEach((ln, i) => ctx.fillText(ln, W / 2, b.sub.y + i * b.sub.size * 1.3)); }
  if (b.formula) {
    b.formula.forEach((r, i) => {
      const f = state.formula.imgs[i], ras = formulaRaster(f, r.w, r.h);
      // mientras se prepara la del tamaño justo, va la imagen de muestra escalada
      if (ras.canvas) ctx.drawImage(ras.canvas, r.x, r.y); else ctx.drawImage(f.img, r.x, r.y, r.w, r.h);
    });
  }
  if (b.counter) {
    const pop = cfg.script === 'progressive' && st.i > 0 ? 1 + 0.16 * (1 - smooth(st.stepT / 0.3)) : 1;
    const size = b.counter.size;
    ctx.font = `600 ${size}px ${FONT_DISPLAY}`;
    const left = 'N = ', num = String(st.N);
    const wl = ctx.measureText(left).width, wn = ctx.measureText(num).width;
    const x0 = b.counter.x - (wl + wn) / 2;
    ctx.textAlign = 'left';
    ctx.fillStyle = T.sub; ctx.fillText(left, x0, b.counter.y);
    ctx.save(); ctx.translate(x0 + wl + wn / 2, b.counter.y - size * 0.35); ctx.scale(pop, pop);
    ctx.fillStyle = T.accent; ctx.textAlign = 'center'; ctx.fillText(num, 0, size * 0.35); ctx.restore();
    ctx.textAlign = 'center';
    ctx.font = `500 ${34 * u}px ${FONT_UI}`; ctx.fillStyle = T.sub;
    const etiqueta = cfg.mode === 'complex' ? (st.N === 1 ? 'círculo' : 'círculos') : 'armónicos en cada serie';
    wrapText(ctx, etiqueta, b.counter.w - 16 * u, 2).forEach((ln, i) => ctx.fillText(ln, b.counter.x, b.counter.y + (56 + i * 42) * u));
  }
  if (b.handle) { ctx.font = `600 ${b.handle.size}px ${FONT_UI}`; ctx.fillStyle = T.handle; ctx.fillText(cfg.handle.trim(), W / 2, b.handle.y); }
}

/* ============================================================
   Vista previa y reproducción
   ============================================================ */
const view = $('#view'), vctx = view.getContext('2d');
let playing = !matchMedia('(prefers-reduced-motion: reduce)').matches;
let clock = 0, lastNow = null, dirty = true;
function requestRender(resetLayout) { if (resetLayout) state.layout = null; dirty = true; }
function fitStage() {
  const stage = $('#stage'), cs = getComputedStyle(stage);
  const availW = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const wide = innerWidth >= 1060;
  // en pantallas anchas la vista previa queda fija: tiene que entrar entera con el transporte y las lecturas
  const maxH = wide && innerHeight >= 600 ? Math.max(240, Math.min(innerHeight - 190, 1000)) : Math.min(innerHeight * (wide ? 0.8 : 0.7), 1000);
  const [fw, fh] = FORMATS[cfg.fmt];
  let w = availW, h = w * fh / fw;
  if (h > maxH) { h = maxH; w = h * fw / fh; }
  // el lienzo mide un número entero de píxeles del dispositivo y se muestra a ese tamaño exacto:
  // sin reescalado no se desenfoca el texto (en 9:16 el ancho salía con decimales)
  const dpr = Math.min(2, devicePixelRatio || 1);
  view.width = Math.max(2, Math.floor(w * dpr)); view.height = Math.max(2, Math.floor(h * dpr));
  view.style.width = view.width / dpr + 'px'; view.style.height = view.height / dpr + 'px';
  const pad = $('#drawpad');
  pad.style.width = view.style.width; pad.style.height = view.style.height;
  pad.width = view.width; pad.height = view.height;
  redrawPad();
  requestRender(true);
}
function frame(now) {
  if (lastNow == null) lastNow = now;
  const dt = (now - lastNow) / 1000; lastNow = now;
  if (state.tl && playing && !drawing) { clock = (clock + dt) % state.tl.total; dirty = true; }
  if (dirty && state.A) {
    render(vctx, view.width, view.height, clock);
    if (!scrubbing) $('#scrub').value = Math.round(clock / state.tl.total * 1000);
    $('#time').textContent = fmtTime(clock) + ' / ' + fmtTime(state.tl.total);
    dirty = false;
  }
  requestAnimationFrame(frame);
}
function setPlaying(p) {
  playing = p;
  $('#play').setAttribute('aria-label', p ? 'Pausar' : 'Reproducir');
  $('#playIcon').setAttribute('d', p ? 'M7 5h4v14H7zM13 5h4v14h-4z' : 'M8 5v14l11-7z');
}
let scrubbing = false;

/* ============================================================
   Lecturas y gráficos
   ============================================================ */
function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
function updateReadouts() {
  const e = state.err, N = cfg.N;
  const errPct = 100 * e.err[N], energy = 100 * (1 - (e.err[N] ** 2) / e.E);
  const parts = state.fig.polys.length;
  $('#readout').innerHTML = '';
  const chips = [
    ['n', 'N', N + (cfg.mode === 'complex' ? ' círculos' : ' por serie')],
    ['', 'energía', nf(Math.min(99.99, energy), 2) + ' %'],
    ['', 'error medio', nf(errPct, errPct < 1 ? 2 : 1) + ' % del tamaño'],
    ['', 'partes', String(parts)],
  ];
  for (const [cls, k, v] of chips) { const s = document.createElement('span'); s.className = 'chip ' + cls; s.innerHTML = `${k} <b></b>`; s.querySelector('b').textContent = v; $('#readout').appendChild(s); }
}
function sizeCanvas(cv) {
  const r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
  cv.width = Math.max(2, Math.round(r.width * dpr)); cv.height = Math.max(2, Math.round(r.height * dpr));
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: r.width, h: r.height };
}
function drawCharts() { if (!state.A) return; drawSpec(); drawErr(); }
function drawSpec() {
  const { ctx, w, h } = sizeCanvas($('#specChart'));
  const ink = css('--ink'), muted = css('--muted'), line = css('--line'), lineStrong = css('--line-strong'), accent = css('--accent'), cobalt = css('--cobalt');
  ctx.clearRect(0, 0, w, h);
  const A = state.A, K = 48, padL = 8, padR = 8, padB = 18, padT = 6;
  const plotW = w - padL - padR, plotH = h - padB - padT;
  ctx.font = `500 11px ${FONT_MONO}`; ctx.fillStyle = muted; ctx.textAlign = 'center';
  if (cfg.mode === 'complex') {
    const sel = new Set(termsFor(cfg.N).map(t => t.n));
    const amps = []; let mx = 0;
    for (let n = -K; n <= K; n++) { if (n === 0) { amps.push(0); continue; } const j = (n + M) % M; const a = Math.hypot(A.re[j], A.im[j]); amps.push(a); if (a > mx) mx = a; }
    const lo = Math.log10(mx) - 4, bw = plotW / (2 * K + 1);
    const base = padT + plotH;
    for (let i = 0; i < amps.length; i++) {
      const n = i - K; if (n === 0) continue;
      const v = clamp((Math.log10(Math.max(amps[i], 1e-12)) - lo) / 4, 0, 1);
      ctx.fillStyle = sel.has(n) ? accent : lineStrong;
      ctx.fillRect(padL + i * bw + bw * 0.15, base - v * plotH, Math.max(1, bw * 0.7), v * plotH);
    }
    ctx.strokeStyle = line; ctx.beginPath(); ctx.moveTo(padL, base + 0.5); ctx.lineTo(w - padR, base + 0.5); ctx.stroke();
    ctx.fillStyle = muted;
    for (const n of [-K, -24, 0, 24, K]) ctx.fillText(n === 0 ? 'n = 0' : String(n).replace('-', '−'), padL + (n + K + 0.5) * bw, h - 4);
    const shown = [...sel].filter(n => Math.abs(n) <= K).length;
    $('#specNote').textContent = `Barras en color: los ${cfg.N} términos que usa la animación (${shown} caen entre −${K} y ${K}). El círculo más grande es n = ${String(A.byAmp[0].n).replace('-', '−')}.`;
    $('#specCap').textContent = 'radio |cₙ| de cada círculo, escala log';
  } else {
    const sx = new Set(termsFor(cfg.N).x.map(t => t.n)), sy = new Set(termsFor(cfg.N).y.map(t => t.n));
    let mx = 0;
    for (let k = 1; k <= K; k++) mx = Math.max(mx, A.xByFreq[k - 1].amp, A.yByFreq[k - 1].amp);
    const lo = Math.log10(mx) - 4, bw = plotW / K, mid = padT + plotH / 2;
    for (let k = 1; k <= K; k++) {
      const vx = clamp((Math.log10(Math.max(A.xByFreq[k - 1].amp, 1e-12)) - lo) / 4, 0, 1);
      const vy = clamp((Math.log10(Math.max(A.yByFreq[k - 1].amp, 1e-12)) - lo) / 4, 0, 1);
      const x = padL + (k - 1) * bw + bw * 0.15, bwi = Math.max(1, bw * 0.7);
      ctx.fillStyle = sx.has(k) ? cobalt : lineStrong; ctx.fillRect(x, mid - vx * plotH / 2, bwi, vx * plotH / 2);
      ctx.fillStyle = sy.has(k) ? accent : lineStrong; ctx.fillRect(x, mid, bwi, vy * plotH / 2);
    }
    ctx.strokeStyle = line; ctx.beginPath(); ctx.moveTo(padL, mid + 0.5); ctx.lineTo(w - padR, mid + 0.5); ctx.stroke();
    ctx.fillStyle = muted;
    for (const k of [1, 12, 24, 36, K]) ctx.fillText('k = ' + k, padL + (k - 0.5) * bw, h - 4);
    ctx.textAlign = 'left'; ctx.fillStyle = cobalt; ctx.fillText('serie x', padL + 2, padT + 10); ctx.fillStyle = accent; ctx.fillText('serie y', padL + 2, h - padB - 4);
    $('#specNote').textContent = `Arriba la serie de x, abajo la de y (armónicos k = 1 a ${K}). En color, los ${cfg.N} que usa cada cadena.`;
    $('#specCap').textContent = 'amplitud de cada armónico, escala log';
  }
}
function drawErr() {
  const { ctx, w, h } = sizeCanvas($('#errChart'));
  const muted = css('--muted'), line = css('--line'), accent = css('--accent'), cobalt = css('--cobalt'), ink = css('--ink');
  ctx.clearRect(0, 0, w, h);
  const e = state.err.err, nmax = Nmax();
  const padL = 60, padR = 16, padT = 8, padB = 20, pw = w - padL - padR, ph = h - padT - padB;
  let lo = Infinity, hi = 0;
  for (let n = 1; n <= nmax; n++) { const v = 100 * e[n]; if (v > 0) lo = Math.min(lo, v); hi = Math.max(hi, v); }
  const yHi = Math.ceil(Math.log10(hi)), yLo = Math.max(yHi - 5, Math.floor(Math.log10(Math.max(lo, 1e-6))));
  const X = n => padL + Math.log10(n) / Math.log10(nmax) * pw;
  const Yv = v => padT + (yHi - Math.log10(Math.max(v, 10 ** yLo))) / (yHi - yLo) * ph;
  ctx.font = `500 11px ${FONT_MONO}`; ctx.textAlign = 'right'; ctx.fillStyle = muted; ctx.strokeStyle = line; ctx.lineWidth = 1;
  for (let d = yLo; d <= yHi; d++) {
    const y = Math.round(Yv(10 ** d)) + 0.5;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
    const lab = 10 ** d >= 1 ? (10 ** d) + ' %' : nf(10 ** d, 4) + ' %';
    ctx.fillText(lab, padL - 6, y + 4);
  }
  for (const n of [1, 10, 100, 1000]) if (n <= nmax) { ctx.textAlign = n === 1 ? 'left' : X(n) > w - padR - 14 ? 'right' : 'center'; ctx.fillText(String(n), n === 1 ? padL - 3 : Math.min(X(n), w - 2), h - 5); }
  ctx.textAlign = 'center';
  ctx.strokeStyle = cobalt; ctx.lineWidth = 2; ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let n = 1; n <= nmax; n++) { const x = X(n), y = Yv(100 * e[n]); n === 1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
  ctx.stroke();
  const cx = X(cfg.N), cy = Yv(100 * e[cfg.N]);
  ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, TAU); ctx.fill();
  ctx.strokeStyle = css('--surface'); ctx.lineWidth = 2; ctx.stroke();
  const v = 100 * e[cfg.N];
  const half = (() => { for (let n = 1; n <= nmax; n++) if (100 * e[n] < 1) return n; return null; })();
  $('#errNote').textContent = `Con ${cfg.N} ${cfg.mode === 'complex' ? 'círculos' : 'armónicos por serie'}, el trazo se aparta en promedio ${nf(v, v < 1 ? 2 : 1)} % del tamaño de la figura.` + (half ? ` Baja del 1 % con ${half}.` : '');
}

/* ============================================================
   Controles
   ============================================================ */
function setStatus(sel, msg, err) { const el = $(sel); el.textContent = msg || ''; el.classList.toggle('err', !!err); }
function bindSeg(id, key, onChange) {
  const seg = $(id);
  const sync = () => $$('button', seg).forEach(b => b.setAttribute('aria-pressed', String(b.dataset[key] === String(cfg[key === 'fmt' ? 'fmt' : key]))));
  seg.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const v = b.dataset[key];
    cfg[key] = key === 'fps' ? Number(v) : v;
    sync(); saveCfg(); onChange && onChange(v);
  });
  sync();
  return sync;
}
const nToPos = n => Math.round(Math.log(n) / Math.log(Nmax()) * 1000);
const posToN = p => Math.max(1, Math.round(Math.exp(p / 1000 * Math.log(Nmax()))));
function syncN() {
  $('#nOut').textContent = String(cfg.N);
  $('#nRange').value = nToPos(cfg.N);
  $('#nRange').setAttribute('aria-valuetext', cfg.N + (cfg.mode === 'complex' ? ' círculos' : ' armónicos por serie'));
  $('#nLabel').textContent = cfg.mode === 'complex' ? 'Círculos' : 'Armónicos por serie';
}
function updateHints() {
  $('#modeHint').textContent = cfg.mode === 'complex'
    ? 'Una sola cadena de vectores que giran; su punta dibuja la figura. Es la versión del video de 3Blue1Brown.'
    : 'Una cadena controla la x y otra la y; el lápiz está donde se cruzan las guías. Es el estilo del reel del colibrí.';
  $('#scriptHint').textContent = cfg.script === 'single'
    ? 'La cadena da una vuelta completa con la cantidad de círculos elegida.'
    : 'Arranca con 1 círculo y suma de a poco hasta llegar a N. Cada paso es una vuelta completa.';
  $('#stepField').hidden = cfg.script !== 'progressive';
  $('#drawSecLbl').firstChild.textContent = cfg.script === 'progressive' ? 'Duración del último paso ' : 'Duración del dibujo ';
  $('#camField').hidden = cfg.mode !== 'complex';
  $('#zoomField').hidden = cfg.mode !== 'complex' || cfg.cam !== 'follow';
}
function updateExportInfo() {
  if (!state.tl) return;
  const [w, h] = FORMATS[cfg.fmt];
  $('#exportInfo').textContent = `${w} × ${h} px · ${nf(state.tl.total, 1)} s · ${cfg.fps} fps · MP4 (H.264)`;
}
function bindRange(id, key, fmt, onChange, scale = 1) {
  const el = $(id), out = $(id + 'Out');
  el.value = cfg[key] * scale;
  const show = () => { if (out) out.textContent = fmt(cfg[key]); };
  el.addEventListener('input', () => { cfg[key] = Number(el.value) / scale; show(); onChange && onChange(); saveCfg(); });
  show();
}
function bindCheck(id, key, onChange) {
  const el = $(id); el.checked = !!cfg[key];
  el.addEventListener('change', () => { cfg[key] = el.checked; saveCfg(); onChange ? onChange() : requestRender(true); });
}
function bindText(id, key) {
  const el = $(id); el.value = cfg[key];
  el.addEventListener('input', () => { cfg[key] = el.value; saveCfg(); requestRender(true); });
}

/* Fuentes */
async function loadExample(id) {
  const ex = EXAMPLES.find(e => e.id === id) || EXAMPLES[0];
  cfg.example = ex.id; saveCfg();
  $$('.ex').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === ex.id)));
  setStatus('#figStatus', 'Calculando…');
  try {
    let fig;
    if (ex.icon) { const ic = ICONS[ex.icon]; fig = { polys: polysFromSVGText(`<svg xmlns="${SVGNS}" viewBox="0 0 ${ic.w} ${ic.h}"><path d="${ic.d}"/></svg>`) }; }
    else if (ex.math) fig = mathFigure(ex.math);
    else fig = { polys: await polysFromText(ex.text, 'serif') };
    state.lastSource = { kind: 'example', id: ex.id };
    setFigure(fig, ex.label);
  } catch (err) { setStatus('#figStatus', err.message, true); }
}
function buildExamples() {
  const box = $('#examples');
  for (const ex of EXAMPLES) {
    const b = document.createElement('button');
    b.className = 'ex'; b.type = 'button'; b.dataset.id = ex.id; b.setAttribute('aria-pressed', 'false');
    let svg;
    if (ex.icon) { const ic = ICONS[ex.icon]; svg = `<svg viewBox="0 0 ${ic.w} ${ic.h}" aria-hidden="true"><path d="${ic.d}"/></svg>`; }
    else if (ex.text) svg = `<svg viewBox="0 0 100 100" aria-hidden="true"><text x="50" y="76" font-size="88" text-anchor="middle" font-family="Spectral, Georgia, serif" font-weight="600">${ex.text}</text></svg>`;
    else {
      const fig = mathFigure(ex.math);
      let pts;
      if (fig.direct) { pts = []; for (let k = 0; k < M; k += 8) pts.push([fig.direct.x[k], fig.direct.y[k]]); }
      else pts = fig.polys[0].pts.filter((_, i, a) => a.length < 400 || i % Math.ceil(a.length / 400) === 0);
      const n = normalizePolys([{ pts, closed: true }])[0].pts;
      const d = 'M' + n.map(([x, y]) => `${(50 + x * 84).toFixed(1)} ${(50 + y * 84).toFixed(1)}`).join('L') + 'Z';
      svg = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/></svg>`;
    }
    b.innerHTML = svg + `<span>${ex.label}</span>`;
    b.addEventListener('click', () => loadExample(ex.id));
    box.appendChild(b);
  }
}
async function handleFile(file) {
  if (!file) return;
  try {
    if (/svg/i.test(file.type) || /\.svg$/i.test(file.name)) {
      selectSource('svg');
      setStatus('#figStatus', 'Leyendo ' + file.name + '…');
      const text = await file.text();
      state.lastSource = { kind: 'svg', text, name: file.name };
      setFigure({ polys: polysFromSVGText(text) }, file.name.replace(/\.svg$/i, ''));
    } else if (/^image\//.test(file.type)) {
      selectSource('imagen');
      setStatus('#figStatus', 'Trazando ' + file.name + '…');
      const bmp = await createImageBitmap(file);
      state.lastSource = { kind: 'image', bmp, name: file.name };
      setFigure({ polys: await polysFromImage(bmp, cfg.imgThr / 100, cfg.imgInv) }, file.name.replace(/\.\w+$/, ''));
    } else throw new Error('Formato no reconocido. Usá SVG, PNG, JPG o WebP.');
    $$('.ex').forEach(b => b.setAttribute('aria-pressed', 'false'));
  } catch (err) { setStatus('#figStatus', err.message, true); }
}
async function retraceImage() {
  const s = state.lastSource;
  if (!s || s.kind !== 'image') return;
  try { setFigure({ polys: await polysFromImage(s.bmp, cfg.imgThr / 100, cfg.imgInv) }, s.name.replace(/\.\w+$/, '')); }
  catch (err) { setStatus('#figStatus', err.message, true); }
}
function reloadSource() {
  const s = state.lastSource;
  if (!s) return;
  try {
    if (s.kind === 'svg') setFigure({ polys: polysFromSVGText(s.text) }, s.name.replace(/\.svg$/i, ''));
    else if (s.kind === 'example') loadExample(s.id);
    else if (s.kind === 'image') retraceImage();
    else if (s.kind === 'drawing') setFigure({ polys: s.polys }, 'Tu dibujo');
    else if (s.kind === 'text') setFigure({ polys: s.polys }, s.name);
  } catch (err) { setStatus('#figStatus', err.message, true); }
}
function selectSource(src) {
  cfg.src = src;
  $$('#srcSeg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.src === src)));
  $$('.srcpane').forEach(p => p.hidden = p.dataset.pane !== src);
  setDrawing(src === 'dibujo');
  if (src === 'dibujo' && innerWidth < 1060) {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    $('#stage').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
}

/* Dibujo a mano */
let drawing = false, strokes = [], curStroke = null;
const pad = $('#drawpad'), pctx = pad.getContext('2d');
function setDrawing(on) {
  drawing = on;
  pad.hidden = !on; $('#drawhint').hidden = !on;
  redrawPad();
}
function redrawPad() {
  if (pad.hidden) return;
  const W = pad.width, H = pad.height, dpr = W / pad.clientWidth || 1;
  pctx.setTransform(1, 0, 0, 1, 0, 0);
  const claro = estiloVideo() === 'papel';
  pctx.fillStyle = claro ? 'rgba(255,255,255,0.88)' : 'rgba(11,13,14,0.86)'; pctx.fillRect(0, 0, W, H);
  pctx.strokeStyle = claro ? 'rgba(20,23,22,0.08)' : 'rgba(170,200,185,0.08)'; pctx.lineWidth = 1;
  const g = 40 * dpr;
  for (let x = g; x < W; x += g) { pctx.beginPath(); pctx.moveTo(x, 0); pctx.lineTo(x, H); pctx.stroke(); }
  for (let y = g; y < H; y += g) { pctx.beginPath(); pctx.moveTo(0, y); pctx.lineTo(W, y); pctx.stroke(); }
  pctx.strokeStyle = THEMES[estiloVideo()].trace; pctx.lineWidth = 3 * dpr; pctx.lineJoin = 'round'; pctx.lineCap = 'round';
  for (const s of strokes) { pctx.beginPath(); s.forEach(([x, y], i) => i ? pctx.lineTo(x * dpr, y * dpr) : pctx.moveTo(x * dpr, y * dpr)); pctx.stroke(); }
}
pad.addEventListener('pointerdown', e => { pad.setPointerCapture(e.pointerId); curStroke = [[e.offsetX, e.offsetY]]; strokes.push(curStroke); redrawPad(); });
pad.addEventListener('pointermove', e => {
  if (!curStroke) return;
  const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
  for (const ev of evs) { const last = curStroke[curStroke.length - 1]; if (Math.hypot(ev.offsetX - last[0], ev.offsetY - last[1]) > 1.5) curStroke.push([ev.offsetX, ev.offsetY]); }
  redrawPad();
});
const endStroke = () => { if (curStroke && curStroke.length < 3) strokes.pop(); curStroke = null; redrawPad(); };
pad.addEventListener('pointerup', endStroke);
pad.addEventListener('pointercancel', endStroke);

/* ============================================================
   Exportación
   ============================================================ */
async function offerFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
  return 'Archivo listo: ' + filename;
}
const slug = s => (s || 'figura').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'figura';
async function ensureFonts() {
  const specs = [`600 64px ${FONT_DISPLAY}`, `400 32px ${FONT_UI}`, `500 28px ${FONT_UI}`];
  await Promise.all(specs.map(s => document.fonts.load(s).catch(() => null)));
}
let exporting = false, cancelExport = false;
// bitrate según el tamaño del cuadro: 16 Mbit/s para 1080×1920 a 30 cuadros por segundo
const bitrateVideo = (W, H, fps) => Math.round((fps > 30 ? 24 : 16) * 1e6 * (W * H) / (1080 * 1920));
async function pickEncoder(W, H, fps) {
  if (typeof VideoEncoder === 'undefined' || !window.Mp4Muxer) return null;
  const bitrate = bitrateVideo(W, H, fps);
  const codecs = ['avc1.640033', 'avc1.64002A', 'avc1.640028', 'avc1.4D0033', 'avc1.4D002A', 'avc1.42E033', 'avc1.42E02A', 'avc1.42001F'];
  for (const codec of codecs) {
    const c = { codec, width: W, height: H, bitrate, framerate: fps, avc: { format: 'avc' } };
    try { const r = await VideoEncoder.isConfigSupported(c); if (r.supported) return c; } catch { /* siguiente */ }
  }
  return null;
}
async function encodeMp4(cv, ctx, W, H, fps, total, config, bar) {
  const frames = Math.round(total * fps);
  const muxer = new Mp4Muxer.Muxer({ target: new Mp4Muxer.ArrayBufferTarget(), video: { codec: 'avc', width: W, height: H, frameRate: fps }, fastStart: 'in-memory' });
  let encErr = null;
  const enc = new VideoEncoder({ output: (chunk, meta) => { try { muxer.addVideoChunk(chunk, meta); } catch (e) { encErr = e; } }, error: e => { encErr = e; } });
  enc.configure(config);
  const t0 = performance.now();
  try {
    for (let i = 0; i < frames; i++) {
      if (cancelExport) throw new Error('cancel');
      if (encErr) throw encErr;
      state.layout = null;
      render(ctx, W, H, Math.min(i / fps, total - 1e-4));
      const vf = new VideoFrame(cv, { timestamp: Math.round(i * 1e6 / fps), duration: Math.round(1e6 / fps) });
      enc.encode(vf, { keyFrame: i % (fps * 2) === 0 });
      vf.close();
      while (enc.encodeQueueSize > 6) await new Promise(r => setTimeout(r, 2));
      if (i % 6 === 0) {
        const p = (i + 1) / frames, el = (performance.now() - t0) / 1000;
        bar.style.width = (100 * p).toFixed(1) + '%';
        setStatus('#exportStatus', `Cuadro ${i + 1} de ${frames}` + (p > 0.05 ? ` · faltan ~${Math.ceil(el / p - el)} s` : ''));
        await new Promise(r => setTimeout(r, 0));
      }
    }
    await enc.flush();
    if (encErr) throw encErr;
    muxer.finalize();
  } finally {
    if (enc.state !== 'closed') enc.close();
  }
  return new Blob([muxer.target.buffer], { type: 'video/mp4' });
}
async function exportVideo() {
  if (exporting) { cancelExport = true; return; }
  const [W, H] = FORMATS[cfg.fmt], fps = cfg.fps;
  const total = state.tl.total;
  exporting = true; cancelExport = false;
  const btn = $('#exportVideo'); btn.textContent = 'Cancelar exportación';
  const prog = $('#progress'), bar = prog.querySelector('i'); prog.hidden = false; bar.style.width = '0%';
  setStatus('#exportStatus', 'Preparando…');
  try {
    await ensureFonts();
    if (cfg.showFormula) await updateFormula();
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d', { alpha: false });
    const savedLayout = state.layout;
    await formulaLista(ctx, W, H);
    const config = await pickEncoder(W, H, fps);
    let blob = null, ext = 'mp4';
    if (config) {
      // si el navegador codifica pero no entrega la configuración del H.264 (le pasa a Firefox), se graba en tiempo real
      try { blob = await encodeMp4(cv, ctx, W, H, fps, total, config, bar); } catch (err) { if (err && err.message === 'cancel') throw err; }
    }
    if (!blob) {
      setStatus('#exportStatus', 'Este navegador no codifica H.264 cuadro por cuadro; grabo en tiempo real (tarda lo que dura el video).');
      ({ blob, ext } = await recordRealtime(cv, ctx, W, H, fps, total, p => { bar.style.width = (100 * p).toFixed(1) + '%'; }));
    }
    state.layout = savedLayout;
    bar.style.width = '100%';
    const name = `epiciclos-${slug(state.fig.name)}-${cfg.mode === 'complex' ? 'N' : 'xy'}${cfg.N}-${cfg.fmt.replace(':', 'x')}.${ext}`;
    setStatus('#exportStatus', `Video listo (${nf(blob.size / 1048576, 1)} MB). Guardando…`);
    setStatus('#exportStatus', await offerFile(blob, name));
  } catch (err) {
    setStatus('#exportStatus', err && err.message === 'cancel' ? 'Exportación cancelada.' : 'No se pudo exportar: ' + (err && err.message || err), !(err && err.message === 'cancel'));
  } finally {
    exporting = false; btn.textContent = 'Exportar video MP4';
    setTimeout(() => { prog.hidden = true; }, 1200);
    requestRender(true);
  }
}
async function recordRealtime(cv, ctx, W, H, fps, total, onProg) {
  const types = ['video/mp4;codecs=avc1.640028', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
  const mime = types.find(t => window.MediaRecorder && MediaRecorder.isTypeSupported(t));
  if (!mime) throw new Error('el navegador no puede grabar video. Probá con Chrome o Edge.');
  render(ctx, W, H, 0);
  const stream = cv.captureStream(fps);
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: bitrateVideo(W, H, fps) });
  const chunks = [];
  rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
  const stopped = new Promise(r => { rec.onstop = r; });
  rec.start(500);
  const t0 = performance.now();
  await new Promise((resolve, reject) => {
    const step = now => {
      if (cancelExport) { reject(new Error('cancel')); return; }
      const t = (now - t0) / 1000;
      if (t >= total) { render(ctx, W, H, total - 1e-4); resolve(); return; }
      state.layout = null; render(ctx, W, H, t); onProg(t / total);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }).finally(() => rec.state !== 'inactive' && rec.stop());
  await stopped;
  const type = mime.split(';')[0];
  return { blob: new Blob(chunks, { type }), ext: type.includes('mp4') ? 'mp4' : 'webm' };
}
async function exportPng() {
  const [W, H] = FORMATS[cfg.fmt];
  await ensureFonts();
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d'), saved = state.layout;
  await formulaLista(ctx, W, H);
  state.layout = null;
  render(ctx, W, H, state.tl.total - 1e-4);
  state.layout = saved;
  const blob = await new Promise(r => cv.toBlob(r, 'image/png'));
  setStatus('#exportStatus', await offerFile(blob, `epiciclos-${slug(state.fig.name)}-final.png`));
}
async function exportJson() {
  const A = state.A, S = state.samples, r = v => Number(v.toPrecision(7));
  const data = {
    app: 'Taller de Epiciclos', version: 1, figura: state.fig.name, M,
    union: cfg.join, nota: 'Coordenadas normalizadas: la figura entra en un cuadrado de lado 1, con y hacia abajo. lapiz = 0 en los tramos que no se dibujan.',
    muestras: { x: Array.from(S.x, r), y: Array.from(S.y, r), lapiz: Array.from(S.pen) },
    complejo: { c0: [r(A.c0[0]), r(A.c0[1])], terminos_n_re_im: A.byAmp.slice(0, 1024).map(t => [t.n, r(t.re), r(t.im)]) },
    series: {
      x: { a0: r(A.X0), terminos_k_a_b: A.xByFreq.slice(0, 512).map(t => [t.n, r(2 * t.re), r(-2 * t.im)]) },
      y: { c0: r(A.Y0), terminos_k_c_d: A.yByFreq.slice(0, 512).map(t => [t.n, r(2 * t.re), r(-2 * t.im)]) },
    },
  };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  setStatus('#exportStatus', await offerFile(blob, `epiciclos-${slug(state.fig.name)}.json`));
}

/* ============================================================
   Pestaña «Cómo funciona»
   ============================================================ */
let typeset = false;
async function openExplain() {
  drawMultiples();
  if (typeset) return;
  try { await ensureMathJax(); await window.MathJax.typesetPromise([$('#explain')]); typeset = true; } catch { /* queda el texto TeX */ }
}
function drawMultiples() {
  const box = $('#multiples'); if (!state.A || !box) return;
  const list = [1, 2, 4, 8, 16, 32, 64, 256];
  box.innerHTML = '';
  const ink = css('--ink'), ghost = css('--line'), accent = css('--accent');
  for (const N of list) {
    const fig = document.createElement('figure');
    const cv = document.createElement('canvas'); fig.appendChild(cv);
    const cap = document.createElement('figcaption'); cap.textContent = 'N = ' + N; fig.appendChild(cap);
    box.appendChild(fig);
    const { ctx, w, h } = sizeCanvas(cv);
    const bb = state.fig.bbox, s = 0.86 * Math.min(w, h) / Math.max(bb.maxX - bb.minX, bb.maxY - bb.minY);
    const cam = { s, ox: w / 2 - s * (bb.minX + bb.maxX) / 2, oy: h / 2 - s * (bb.minY + bb.maxY) / 2 };
    ctx.save(); ctx.translate(cam.ox, cam.oy); ctx.scale(s, s);
    ctx.fillStyle = ghost; if (state.ghost.anyClosed) ctx.fill(state.ghost.path, 'evenodd');
    ctx.restore();
    const key = cfg.mode + '|' + cfg.order + '|' + N;
    const c = curveFor(Math.min(N, Nmax()));
    const p = tracePath(c, M2 - 1, cam, [c.x[0], c.y[0]]);
    ctx.strokeStyle = N >= 256 ? accent : ink; ctx.lineWidth = 1.5; ctx.lineJoin = 'round'; ctx.stroke(p);
  }
}

/* ============================================================
   Arranque
   ============================================================ */
function init() {
  // pestañas
  const tabs = [['#tab-studio', '#studio'], ['#tab-explain', '#explain']];
  for (const [t, p] of tabs) $(t).addEventListener('click', () => {
    for (const [t2, p2] of tabs) { $(t2).setAttribute('aria-selected', String(t2 === t)); $(p2).hidden = p2 !== p; }
    if (p === '#explain') openExplain(); else { fitStage(); drawCharts(); }
    try { history.replaceState(null, '', p === '#explain' ? '#como-funciona' : '#estudio'); } catch { /* sin historial */ }
    if (window.parent !== window) { try { window.parent.postMessage({ fourier: 'ruta', ruta: p === '#explain' ? 'como-funciona' : 'estudio' }, '*'); } catch { /* sin portada */ } }
  });
  buildExamples();
  // temas
  const sw = $('#themeSw');
  const auto = document.createElement('button'); auto.className = 'sw'; auto.type = 'button'; auto.dataset.estilo = 'auto';
  auto.title = 'Papel con el tema claro, Noche con el oscuro';
  auto.innerHTML = `<i style="background:linear-gradient(135deg, ${THEMES.papel.bg} 50%, ${THEMES.noche.bg} 50%)"></i>Según el sitio`;
  sw.appendChild(auto);
  for (const [id, T] of Object.entries(THEMES)) {
    const b = document.createElement('button'); b.className = 'sw'; b.type = 'button'; b.dataset.estilo = id;
    b.innerHTML = `<i style="background:linear-gradient(135deg, ${T.bg} 55%, ${T.trace} 55%, ${T.trace} 70%, ${T.vignette} 70%)"></i>${T.label}`;
    sw.appendChild(b);
  }
  bindSeg('#themeSw', 'estilo', () => { updateFormula(); requestRender(true); redrawPad(); });
  bindSeg('#srcSeg', 'src', v => selectSource(v));
  bindSeg('#modeSeg', 'mode', () => { updateHints(); rebuildTerms(); });
  bindSeg('#scriptSeg', 'script', () => { updateHints(); rebuildTimeline(); updateExportInfo(); clock = 0; requestRender(true); });
  bindSeg('#camSeg', 'cam', () => { updateHints(); requestRender(true); });
  bindSeg('#fmtSeg', 'fmt', () => { fitStage(); updateExportInfo(); });
  bindSeg('#fpsSeg', 'fps', () => updateExportInfo());
  $('#nRange').addEventListener('input', e => { cfg.N = posToN(Number(e.target.value)); saveCfg(); rebuildTerms(); });
  $('#nQuick').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; cfg.N = b.dataset.n === 'max' ? Nmax() : Number(b.dataset.n); saveCfg(); rebuildTerms(); });
  $('#order').value = cfg.order; $('#order').addEventListener('change', e => { cfg.order = e.target.value; saveCfg(); rebuildTerms(); });
  $('#join').value = cfg.join; $('#join').addEventListener('change', e => { cfg.join = e.target.value; saveCfg(); if (state.fig) { state.figVersion++; rebuildLoop(); } });
  bindRange('#drawSec', 'drawSec', v => nf(v, 1) + ' s', () => { rebuildTimeline(); updateExportInfo(); requestRender(true); });
  bindRange('#stepSec', 'stepSec', v => nf(v, 1) + ' s', () => { rebuildTimeline(); updateExportInfo(); requestRender(true); });
  bindRange('#holdSec', 'holdSec', v => nf(v, 1) + ' s', () => { rebuildTimeline(); updateExportInfo(); requestRender(true); });
  bindRange('#zoom', 'zoom', v => v + '×', () => requestRender(true));
  bindRange('#minFrac', 'minFrac', v => nf(v, 1) + ' %', null);
  $('#minFrac').addEventListener('change', reloadSource);
  bindRange('#imgThr', 'imgThr', v => v + ' %', null);
  $('#imgThr').addEventListener('change', retraceImage);
  bindCheck('#imgInv', 'imgInv', retraceImage);
  for (const k of ['showCircles', 'showArms', 'showGhost', 'showFormula', 'showCounter', 'fadeEnd']) bindCheck('#' + k, k);
  bindText('#title', 'title'); bindText('#subtitle', 'subtitle'); bindText('#handle', 'handle');
  $('#txt').value = cfg.txt; $('#txtFont').value = cfg.txtFont;
  $('#txt').addEventListener('input', e => { cfg.txt = e.target.value; saveCfg(); });
  $('#txtFont').addEventListener('change', e => { cfg.txtFont = e.target.value; saveCfg(); });
  $('#txtGo').addEventListener('click', async () => {
    const t = cfg.txt.trim(); if (!t) { setStatus('#figStatus', 'Escribí algo para trazar.', true); return; }
    setStatus('#figStatus', 'Trazando «' + t + '»…');
    try { const polys = await polysFromText(t, cfg.txtFont); state.lastSource = { kind: 'text', polys, name: t }; setFigure({ polys }, t); $$('.ex').forEach(b => b.setAttribute('aria-pressed', 'false')); }
    catch (err) { setStatus('#figStatus', err.message, true); }
  });
  $('#txt').addEventListener('keydown', e => { if (e.key === 'Enter') $('#txtGo').click(); });
  $('#svgFile').addEventListener('change', e => { handleFile(e.target.files[0]); e.target.value = ''; });
  $('#imgFile').addEventListener('change', e => { handleFile(e.target.files[0]); e.target.value = ''; });
  $('#drawClear').addEventListener('click', () => { strokes = []; setDrawing(true); setStatus('#figStatus', ''); });
  $('#drawUse').addEventListener('click', () => {
    if (!strokes.length) { setStatus('#figStatus', 'Primero dibujá algo sobre la vista previa.', true); return; }
    const diag = Math.hypot(pad.clientWidth, pad.clientHeight);
    const polys = strokes.map(s => ({ pts: s.map(p => [p[0], p[1]]), closed: dist(s[0], s[s.length - 1]) < 0.04 * diag }));
    try {
      state.lastSource = { kind: 'drawing', polys }; setFigure({ polys }, 'Tu dibujo'); setDrawing(false);
      $$('.ex').forEach(b => b.setAttribute('aria-pressed', 'false')); clock = 0; setPlaying(true);
      setStatus('#figStatus', `Tu dibujo: ${state.fig.polys.length} ${state.fig.polys.length === 1 ? 'trazo' : 'trazos'}. Para dibujar otro, tocá Borrar.`);
    }
    catch (err) { setStatus('#figStatus', err.message, true); }
  });
  // arrastrar y soltar
  const stage = $('#stage');
  ['dragenter', 'dragover'].forEach(ev => stage.addEventListener(ev, e => { e.preventDefault(); stage.classList.add('dragging'); $('#dropmsg').hidden = false; }));
  ['dragleave', 'drop'].forEach(ev => stage.addEventListener(ev, e => { e.preventDefault(); stage.classList.remove('dragging'); $('#dropmsg').hidden = true; }));
  stage.addEventListener('drop', e => handleFile(e.dataTransfer.files[0]));
  // transporte
  $('#play').addEventListener('click', () => { if (drawing) return; setPlaying(!playing); });
  $('#restart').addEventListener('click', () => { clock = 0; requestRender(); });
  const scrub = $('#scrub');
  scrub.addEventListener('pointerdown', () => { scrubbing = true; });
  scrub.addEventListener('input', () => { clock = Number(scrub.value) / 1000 * state.tl.total; requestRender(); });
  scrub.addEventListener('change', () => { scrubbing = false; });
  addEventListener('pointerup', () => { scrubbing = false; });
  view.addEventListener('click', () => { if (!drawing) setPlaying(!playing); });
  // exportar
  $('#exportVideo').addEventListener('click', exportVideo);
  $('#exportPng').addEventListener('click', exportPng);
  $('#exportJson').addEventListener('click', exportJson);
  // tamaño y tema
  new ResizeObserver(() => fitStage()).observe($('#stage'));
  const cambioDeTema = () => {
    drawCharts(); if (!$('#explain').hidden) drawMultiples();
    if (cfg.estilo === 'auto') { updateFormula(); requestRender(true); redrawPad(); }
  };
  temaSistema.addEventListener('change', cambioDeTema);
  new MutationObserver(cambioDeTema).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(drawCharts, 120); });

  updateHints();
  setPlaying(playing);
  selectSource(cfg.src === 'dibujo' ? 'ejemplos' : cfg.src);
  if (cfg.src !== 'ejemplos') selectSource('ejemplos');
  fitStage();
  loadExample(cfg.example).then(() => {
    clock = playing ? 0.35 * state.tl.drawEnd : state.tl.total - 1e-3;
    requestRender(true);
  });
  document.fonts.ready.then(() => requestRender(true));
  ensureFonts().then(() => requestRender(true));
  ensureMathJax().then(() => updateFormula()).catch(() => null);
  if (location.hash === '#como-funciona') $('#tab-explain').click();
  // dentro de la portada: cambiar de pestaña cuando lo pide
  addEventListener('message', e => {
    const d = e.data;
    if (e.source !== window.parent || !d || d.fourier !== 'ir') return;
    if (d.ruta === 'como-funciona') $('#tab-explain').click(); else if (d.ruta === 'estudio') $('#tab-studio').click();
  });
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
