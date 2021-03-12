import {Complex} from '@/web/complex';

export declare function renderJulia(arg: {
    width: number;
    scale: number;
    maxIter: number;
    c: Complex;
    a: Complex;
}): HTMLCanvasElement;

export declare function renderMandelbrot(args: {
    width: number;
    scale: number;
    maxIter: number;
    c: Complex;
}): HTMLCanvasElement;
