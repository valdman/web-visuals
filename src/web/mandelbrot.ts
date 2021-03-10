/* eslint-disable @typescript-eslint/no-unused-vars */
import {GPU} from 'gpu.js';
import {add, Complex, mult} from './complex';

type RGBTuple = [number, number, number];
type HSLTuple = [number, number, number];

const gpu = new GPU();

const mandelbrotKernel = gpu.createKernel(mandelbrotKernelFunc).setGraphical(true);
const juliaKernel = gpu.createKernel(juliaKernelFunc).setGraphical(true);

mandelbrotKernel.addFunction(getBaseRgb);
mandelbrotKernel.addFunction(hslToRgb);
mandelbrotKernel.addFunction(iterationToRGB);
mandelbrotKernel.addFunction(rgbSmoothBernshtein);

mandelbrotKernel.addFunction(complexNorm);
mandelbrotKernel.addFunction(add);
mandelbrotKernel.addFunction(mult);

juliaKernel.addFunction(getBaseRgb);
juliaKernel.addFunction(hslToRgb);
juliaKernel.addFunction(iterationToRGB);
juliaKernel.addFunction(rgbSmooth);
juliaKernel.addFunction(rgbSmoothBernshtein);

juliaKernel.addFunction(complexNorm);
juliaKernel.addFunction(add);
juliaKernel.addFunction(mult);

function juliaKernelFunc(
    scale: number,
    maxIter: number,
    CR: number,
    CI: number,
    hueOffset: number,
    size: number,
): void {
    const c: Complex = [CR, CI];

    const ar = ((1 / scale) * (size / 2 - this.thread.x)) / (size / 2);
    const ai = ((1 / scale) * (size / 2 - this.thread.y)) / (size / 2);
    let z: Complex = [ar, ai];

    let smoothcolor = Math.exp(-complexNorm(z));

    let i = 0;
    while (i < maxIter) {
        z = add(mult(z, z), c);
        smoothcolor += Math.exp(-complexNorm(z));
        if (complexNorm(z) > 2) break;
        i++;
    }
    // const g = (i / maxIter) * 255.0;
    const [r, g, b] = rgbSmooth(i, smoothcolor);
    this.color(r, g, b);
}

function mandelbrotKernelFunc(scale: number, maxIter: number, CR: number, CI: number, size: number): void {
    const defaultCoordinateWidth = 1;
    const dr = (defaultCoordinateWidth / scale) * (this.thread.x / size - 0.5);
    const di = (defaultCoordinateWidth / scale) * (this.thread.y / size - 0.5);
    let z: Complex = [0, 0];
    const c: Complex = add([CR, CI], [dr, di]);

    let i = 0;
    while (i < maxIter) {
        z = add(mult(z, z), c);
        if (complexNorm(z) > 2) break;
        i++;
    }
    // const g = (i / maxIter) * 255.0;
    const [r, g, b] = rgbSmoothBernshtein(i, maxIter);
    this.color(r, g, b);
}

function rgbSmooth(iterations: number, smoothcolor: number): RGBTuple {
    const r = 0.6 + 0.4 * Math.sin(smoothcolor * 0.1 + iterations * 0.63);
    const g = r * r;
    const b = r * g;
    return [r, g, b];
}

function rgbSmoothBernshtein(iterations: number, maxIter: number): RGBTuple {
    const t = (iterations / maxIter) * 1.0;
    const r = 15 * (1 - t) * (1 - t) * t * t * 255;
    const g = 7 * (1 - t) * t * t * 255;
    const b = 9 * (1 - t) * t * t * 255;
    return [r, g, b];
}

function complexNorm(z: Complex) {
    const [r, i] = z;
    return Math.sqrt(r * r + i * i);
}

function iterationToRGB(iterations: number, maxIter: number, hueOffset: number): RGBTuple {
    if (iterations == maxIter) {
        return [0, 0, 0];
    }

    const h = (hueOffset + iterations) % 360;
    const s = 0.7;
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

export function renderJulia(width: number, scale: number, maxIter: number, cr: number, ci: number): HTMLCanvasElement {
    if (!juliaKernel.output || juliaKernel.output[0] !== width) {
        juliaKernel.setDynamicOutput(true).setOutput([width, width]);
    }
    juliaKernel(scale, maxIter, cr, ci, 120, width);
    return juliaKernel.canvas;
}

export function renderMandelbrot(
    width: number,
    scale: number,
    maxIter: number,
    cr: number,
    ci: number,
): HTMLCanvasElement {
    if (!mandelbrotKernel.output || mandelbrotKernel.output[0] !== width) {
        mandelbrotKernel.setDynamicOutput(true).setOutput([width, width]);
    }
    mandelbrotKernel(scale, maxIter, cr, ci, width);
    return mandelbrotKernel.canvas;
}
