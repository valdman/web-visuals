import {GPU} from 'gpu.js';

type RGBTuple = [number, number, number];
type HSLTuple = [number, number, number];

const gpu = new GPU();

gpu.addFunction(iterationToRGB);
gpu.addFunction(hslToRgb);
gpu.addFunction(getBaseRgb);
gpu.addFunction(rgbSmooth);
gpu.addFunction(complexNorm);

const render = gpu.createKernel(mandelbrotKernel).setGraphical(true);

function mandelbrotKernel(
    scale: number,
    maxIter: number,
    CR: number,
    CI: number,
    hueOffset: number,
    size: number,
): void {
    let ar = ((1 / scale) * (size / 2 - this.thread.x)) / (size / 2);
    let ai = ((1 / scale) * (size / 2 - this.thread.y)) / (size / 2);
    let i = 0;

    let smoothcolor = complexNorm(ar, ai);

    while (i < maxIter) {
        const t = ai * ar * 2;
        ar = ar * ar - ai * ai + CR;
        ai = t + CI;
        smoothcolor += Math.exp(-complexNorm(ar, ai));
        if (ar * ar + ai * ai > 1000) break;
        i++;
    }
    const [r, g, b] = rgbSmooth(i, smoothcolor);
    this.color(r, g, b);
}

function rgbSmooth(iterations: number, smoothcolor: number): RGBTuple {
    const r = 0.6 + 0.4 * Math.sin(smoothcolor * 0.1 + iterations * 0.63);
    const g = r * r;
    const b = r * g;
    return [r, g, b];
}

function complexNorm(r: number, i: number) {
    return Math.sqrt(r * r + i * i);
}

function iterationToRGB(iterations: number, maxIter: number, hueOffset: number): RGBTuple {
    if (iterations == maxIter) {
        return [0, 0, 0];
    }

    const h = (hueOffset + iterations) % 360;
    const s = 0.75;
    const l = 0.5;

    return hslToRgb([h, s, l]);
}

function hslToRgb(hsl: HSLTuple): RGBTuple {
    const [h, s, l] = hsl;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    const [r, g, b] = getBaseRgb(h, c, x);
    return [r + m, g + m, b + m];
}

function getBaseRgb(h: number, c: number, x: number): RGBTuple {
    if (h >= 0 && h < 60) {
        return [c, x, 0];
    }
    if (h >= 60 && h < 120) {
        return [x, c, 0];
    }
    if (h >= 120 && h < 180) {
        return [0, c, x];
    }
    if (h >= 180 && h < 240) {
        return [0, x, c];
    }
    if (h >= 240 && h < 300) {
        return [x, 0, c];
    }
    if (h >= 300 && h < 360) {
        return [c, 0, x];
    }
}

export function renderMandelbrot(
    width: number,
    scale: number,
    maxIter: number,
    cr: number,
    ci: number,
    hue_offset: number,
): HTMLCanvasElement {
    render.setOutput([width, width])(scale, maxIter, cr, ci, hue_offset, width);
    return render.canvas;
}
