/* eslint-disable @typescript-eslint/no-unused-vars */
import {GPU} from 'gpu.js';

import * as complex from '@/web/complex';
import {Complex} from '@/web/complex';
import * as colors from '@/web/graphics/colors';

const {add, complexNorm, mult} = complex;
const {getBaseRgb, hslToRgb, iterationToRGB, rgbSmooth, rgbSmoothBernshtein} = colors;

const gpu = new GPU();

const mandelbrotKernel = gpu.createKernel(mandelbrotKernelFunc).setGraphical(true);
const juliaKernel = gpu.createKernel(juliaKernelFunc).setGraphical(true);

mandelbrotKernel.addFunction(getBaseRgb);
mandelbrotKernel.addFunction(hslToRgb);
mandelbrotKernel.addFunction(rgbSmoothBernshtein);

mandelbrotKernel.addFunction(complexNorm);
mandelbrotKernel.addFunction(add);
mandelbrotKernel.addFunction(mult);

juliaKernel.addFunction(getBaseRgb);
juliaKernel.addFunction(hslToRgb);
juliaKernel.addFunction(rgbSmooth);
juliaKernel.addFunction(rgbSmoothBernshtein);

juliaKernel.addFunction(complexNorm);
juliaKernel.addFunction(add);
juliaKernel.addFunction(mult);

function juliaKernelFunc(
    scale: number,
    maxIter: number,
    centerR: number,
    centerI: number,
    attractorR: number,
    attractorI: number,
    hueOffset: number,
    size: number,
): void {
    const dr = (1 / scale) * (this.thread.x / size - 0.5);
    const di = (1 / scale) * (this.thread.y / size - 0.5);
    let z: Complex = add([centerR, centerI], [dr, di]);

    let smoothcolor = Math.exp(-complexNorm(z));

    let i = 0;
    while (i < maxIter) {
        z = add(mult(z, z), [attractorR, attractorI]);
        smoothcolor += Math.exp(-complexNorm(z));
        if (complexNorm(z) > 2) break;
        i++;
    }
    // const g = (i / maxIter) * 255.0;
    const [r, g, b] = rgbSmooth(i, smoothcolor);
    this.color(r, g, b);
}

function mandelbrotKernelFunc(scale: number, maxIter: number, center: Complex, size: number): void {
    const dr = (1 / scale) * (this.thread.x / size - 0.5);
    const di = (1 / scale) * (this.thread.y / size - 0.5);
    let z: Complex = [0, 0];
    const c: Complex = add(center, [dr, di]);

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

export function renderJulia({
    width,
    scale,
    maxIter,
    c,
    a,
}: {
    width: number;
    scale: number;
    maxIter: number;
    // Visual center
    c: Complex;
    // Point to inspect
    a: Complex;
}): HTMLCanvasElement {
    const [cr, ci] = c;
    const [ar, ai] = a;
    if (!juliaKernel.output || juliaKernel.output[0] !== width) {
        juliaKernel.setDynamicOutput(true).setOutput([width, width]);
    }
    (juliaKernel as typeof juliaKernelFunc)(scale, maxIter, cr, ci, ar, ai, 120, width);
    return juliaKernel.canvas;
}

export function renderMandelbrot({
    width,
    scale,
    maxIter,
    c,
}: {
    width: number;
    scale: number;
    maxIter: number;
    c: Complex;
}): HTMLCanvasElement {
    if (!mandelbrotKernel.output || mandelbrotKernel.output[0] !== width) {
        mandelbrotKernel.setDynamicOutput(true).setOutput([width, width]);
    }
    (mandelbrotKernel as typeof mandelbrotKernelFunc)(scale, maxIter, c, width);
    return mandelbrotKernel.canvas;
}
