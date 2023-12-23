<div align="center">
  <h1>Fourier interactivo</h1>

  [![Estado](https://img.shields.io/badge/Estado-En_Desarrollo-orange?style=for-the-badge)]()
  [![HTML5](https://img.shields.io/badge/_-HTML5-E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
  [![JavaScript](https://img.shields.io/badge/_-JavaScript-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
  [![License](https://img.shields.io/badge/-MIT_LICENSE-yellow.svg?style=for-the-badge)](LICENSE)
</div>

Herramientas para ver cómo una señal periódica, o cualquier dibujo, se arma sumando senoidales que giran. Todo corre en el navegador: se abre `index.html` y listo, sin instalar nada.

Es la versión web de [fourier_epicycles_matplotlib](https://github.com/maxisimonazzi/fourier_epicycles_matplotlib) (Python + matplotlib), ampliada con un análisis completo de la señal y con dos herramientas de epiciclos para dibujos en el plano.

## Qué hay adentro

La portada presenta las tres herramientas y se navega con los botones de la barra superior. Están pensadas como un recorrido, de las señales al plano y del plano a cualquier dibujo:

| | Herramienta | Para qué sirve |
|---|---|---|
| 1 | **Series de Fourier** | **Laboratorio:** epiciclos, onda resultante, espectro y ondas componentes de una cuadrada, triangular, diente de sierra o senoidal rectificada, con hasta 200 armónicas y modo AC/DC. **Análisis:** valor medio, eficaz, factores de cresta, forma y rizado, espectros de amplitud, fase y potencia, teorema de Parseval y ancho de banda, THD, convergencia, fenómeno de Gibbs (con σ de Lanczos y Fejér), autocorrelación, simetrías y tabla de coeficientes. **Fundamentos:** la teoría detrás de todo lo anterior. |
| 2 | **Del círculo al SVG** | Tutorial en doce pasos: cómo se calculan los coeficientes de un dibujo hecho con epiciclos, en una cadena (números complejos) o en dos (ejes x e y), del círculo a un SVG cualquiera. |
| 3 | **Taller de epiciclos** | Una cadena de círculos dibuja la figura que elijas: ejemplos, un SVG, una imagen, un texto o un dibujo a mano. Exporta video (WebM o MP4, según el navegador), la imagen final en PNG y los coeficientes en JSON. |

## Cómo usarlo

- **En la computadora:** abrí `index.html` con doble clic. Funciona en Chrome, Edge, Firefox y Safari actuales.
- **Enlaces directos:** la dirección indica la herramienta y la pestaña. Por ejemplo, `index.html#series/analisis` abre el Análisis y `index.html#taller` abre el Taller.

Algunas partes se descargan de internet la primera vez: las fórmulas ([MathJax](https://www.mathjax.org/)), las tipografías (Google Fonts) y, en el Taller, el trazado de imágenes y textos ([d3-contour](https://github.com/d3/d3-contour)). Sin conexión lo demás funciona igual y las fórmulas se ven como texto TeX.

## Cómo está armado

- Cada herramienta es una página completa en su carpeta, con su HTML, su CSS y su JS. Se puede abrir sola.
- La portada abre cada herramienta dentro de la misma página, en un `iframe` que ocupa toda la ventana debajo de la barra. Así hay una sola barra de desplazamiento, y cada herramienta conserva su estado al cambiar de una a otra.
- Las herramientas le avisan a la portada en qué pestaña están (`postMessage`), para que la dirección se pueda recargar o compartir.
- No hay paso de compilación ni dependencias para instalar: los archivos se editan y se recarga la página.

## Verificar los cálculos

Con [Node.js](https://nodejs.org/) instalado, desde la raíz del repositorio:

```bash
node pruebas/verificar-nucleo.js
```

Compara el núcleo con valores exactos: la THD de cada señal, la potencia por Parseval, el error eficaz, el sobrepico de Gibbs (8,949 % del salto), las pendientes de los coeficientes, las simetrías y los coeficientes contra una FFT de la señal ideal.

## Video con Python (opcional)

El Taller exporta los coeficientes de cualquier figura en JSON. `python/epiciclos_mpl.py` los convierte en un video MP4 con matplotlib, con el mismo enfoque que [fourier_epicycles_matplotlib](https://github.com/maxisimonazzi/fourier_epicycles_matplotlib):

```bash
python python/epiciclos_mpl.py figura.json --n 150
python python/epiciclos_mpl.py --demo corazon --n 8
```

Necesita `numpy`, `matplotlib` y `ffmpeg` en el PATH.
