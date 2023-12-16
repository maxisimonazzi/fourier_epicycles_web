"""
epiciclos_mpl.py: renderiza epiciclos de Fourier a MP4 con matplotlib.

Uso:
    python epiciclos_mpl.py figura.json --n 150
    python epiciclos_mpl.py figura.json --n 300 --segundos 15 --fps 30 --formato 9:16 -o reel.mp4
    python epiciclos_mpl.py --demo corazon --n 8          # sin JSON, figura de ejemplo

figura.json es el archivo que baja el Taller de Epiciclos con «Coeficientes (JSON)»:
trae 2048 puntos equiespaciados del contorno y la marca de lápiz arriba/abajo.
Requiere numpy, matplotlib y ffmpeg en el PATH.
"""
import argparse
import json

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import animation
from matplotlib.collections import LineCollection

FORMATOS = {"9:16": (1080, 1920), "4:5": (1080, 1350), "1:1": (1080, 1080), "16:9": (1920, 1080)}
FONDO, CIRCULO, BRAZO, TRAZO, GUIA, TEXTO, TENUE, ACENTO = (
    "#0b0d0e", "#aabeb44d", "#e6ece8e0", "#7fd1a0", "#a0c8b41a", "#eef1ee", "#9aa19c", "#7fd1a0")


def cargar_json(ruta):
    with open(ruta, encoding="utf-8") as f:
        d = json.load(f)
    m = d["muestras"]
    z = np.asarray(m["x"], float) + 1j * np.asarray(m["y"], float)
    return z, np.asarray(m["lapiz"], bool), d.get("figura", "figura")


def demo(nombre, M=2048):
    t = 2 * np.pi * np.arange(M) / M
    if nombre == "corazon":   # exactamente 8 términos: con --n 8 queda perfecto
        z = 16 * np.sin(t) ** 3 - 1j * (13 * np.cos(t) - 5 * np.cos(2 * t) - 2 * np.cos(3 * t) - np.cos(4 * t))
    elif nombre == "trebol":
        z = (1 + 0.5 * np.cos(3 * t)) * np.exp(1j * t)
    else:
        raise SystemExit(f"Demo desconocida: {nombre}. Opciones: corazon, trebol")
    centro = complex((z.real.min() + z.real.max()) / 2, (z.imag.min() + z.imag.max()) / 2)
    z = (z - centro) / max(np.ptp(z.real), np.ptp(z.imag))
    return z, np.ones(M, bool), nombre


def coeficientes(z):
    """c_n por FFT, ordenados de mayor a menor radio (sin c_0, que es el centro)."""
    M = len(z)
    c = np.fft.fft(z) / M
    n = np.fft.fftfreq(M, 1 / M).astype(int)
    orden = np.argsort(-np.abs(c))
    orden = orden[n[orden] != 0]
    return c[0], c[orden], n[orden]


def main():
    ap = argparse.ArgumentParser(description="Epiciclos de Fourier a MP4 con matplotlib")
    ap.add_argument("json", nargs="?", help="JSON exportado por el Taller de Epiciclos")
    ap.add_argument("--demo", choices=["corazon", "trebol"], help="usar una figura de ejemplo")
    ap.add_argument("--n", type=int, default=150, help="cantidad de círculos")
    ap.add_argument("--segundos", type=float, default=12, help="duración del dibujo")
    ap.add_argument("--pausa", type=float, default=2, help="segundos finales con el dibujo completo")
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--formato", choices=FORMATOS, default="9:16")
    ap.add_argument("--titulo", default="Dibujar con círculos")
    ap.add_argument("--firma", default="@tu.pagina")
    ap.add_argument("-o", "--salida", default=None)
    a = ap.parse_args()

    if a.json:
        z, lapiz, nombre = cargar_json(a.json)
    elif a.demo:
        z, lapiz, nombre = demo(a.demo)
    else:
        ap.error("pasá un JSON o usá --demo")

    c0, c, n = coeficientes(z)
    c, n = c[:a.n], n[:a.n]
    K = 4000                                           # resolución del trazo
    tt = np.arange(K + 1) / K
    curva = c0 + (c[:, None] * np.exp(2j * np.pi * n[:, None] * tt)).sum(axis=0)
    baja = lapiz[np.minimum(np.arange(K + 1) * len(z) // K, len(z) - 1)]
    tx, ty = curva.real.copy(), curva.imag.copy()
    tx[~baja], ty[~baja] = np.nan, np.nan               # NaN corta la línea donde el lápiz va levantado

    W, H = FORMATOS[a.formato]
    fig = plt.figure(figsize=(W / 100, H / 100), dpi=100, facecolor=FONDO)
    alto_util = 0.56 if a.formato == "9:16" else 0.66  # franja central, libre de textos
    ax = fig.add_axes([0.06, 0.5 - alto_util / 2 - 0.02, 0.88, alto_util])
    ax.set_facecolor(FONDO)
    ax.set_aspect("equal")
    ax.axis("off")
    r1 = np.abs(c[0])
    xs = np.r_[z.real, c0.real - r1, c0.real + r1]
    ys = np.r_[z.imag, c0.imag - r1, c0.imag + r1]
    mx, my = 0.06 * np.ptp(xs), 0.06 * np.ptp(ys)
    ax.set_xlim(xs.min() - mx, xs.max() + mx)
    ax.set_ylim(ys.max() + my, ys.min() - my)         # y hacia abajo, como en el SVG

    plt.rcParams.update({"mathtext.fontset": "cm"})
    fig.text(0.5, 0.905, a.titulo, ha="center", color=TEXTO, fontsize=34, family="sans-serif", weight="bold")
    fig.text(0.5, 0.865, r"$z_N(t)=c_0+\sum_{n\in K_N}\, c_n\,e^{2\pi i\,n t}$", ha="center", color=TENUE, fontsize=26)
    fig.text(0.5, 0.17, f"N = {a.n}", ha="center", color=ACENTO, fontsize=44, family="sans-serif", weight="bold")
    fig.text(0.5, 0.145, "círculos", ha="center", color=TENUE, fontsize=15)
    fig.text(0.5, 0.115, a.firma, ha="center", color=TENUE, fontsize=14)

    gx, gy = z.real.copy(), z.imag.copy()
    gx[~lapiz], gy[~lapiz] = np.nan, np.nan
    ax.plot(np.r_[gx, gx[0]], np.r_[gy, gy[0]], color=GUIA, lw=6, solid_capstyle="round")  # silueta guía
    trazo, = ax.plot([], [], color=TRAZO, lw=2.6, solid_capstyle="round")
    brazos, = ax.plot([], [], color=BRAZO, lw=1.4)
    circulos = LineCollection([], colors=CIRCULO, linewidths=1.1)
    ax.add_collection(circulos)
    punta, = ax.plot([], [], "o", color="white", ms=5)
    unidad = np.exp(2j * np.pi * np.linspace(0, 1, 72))
    radios = np.abs(c)
    visibles = radios > 0.002                          # no vale la pena dibujar círculos de menos de un píxel

    cuadros_dibujo = int(a.segundos * a.fps)
    total = cuadros_dibujo + int(a.pausa * a.fps)

    def cuadro(f):
        t = min(f / cuadros_dibujo, 1.0)
        centros = np.r_[c0, c0 + np.cumsum(c * np.exp(2j * np.pi * n * t))]
        k = int(t * K)
        trazo.set_data(tx[:k + 1], ty[:k + 1])
        alfa = 1.0 if f < cuadros_dibujo else max(0.0, 1 - (f - cuadros_dibujo) / (0.8 * a.fps))
        brazos.set_data(centros.real, centros.imag)
        brazos.set_alpha(alfa)
        cc = centros[:-1][visibles]
        segs = cc[:, None] + radios[visibles][:, None] * unidad[None, :]
        circulos.set_segments(np.stack([segs.real, segs.imag], axis=-1))
        circulos.set_alpha(alfa)
        punta.set_data([centros[-1].real], [centros[-1].imag])
        return trazo, brazos, circulos, punta

    salida = a.salida or f"epiciclos-{nombre}-N{a.n}.mp4"
    anim = animation.FuncAnimation(fig, cuadro, frames=total, interval=1000 / a.fps, blit=False)
    escritor = animation.FFMpegWriter(fps=a.fps, codec="libx264", bitrate=9000,
                                      extra_args=["-pix_fmt", "yuv420p", "-movflags", "+faststart"])
    print(f"Renderizando {total} cuadros de {W}x{H} en {salida}")
    anim.save(salida, writer=escritor, dpi=100, savefig_kwargs={"facecolor": FONDO},
              progress_callback=lambda i, n: print(f"\r  cuadro {i + 1}/{n}", end="") if i % 15 == 0 else None)
    print("\nListo.")


if __name__ == "__main__":
    main()
