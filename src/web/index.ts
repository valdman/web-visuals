/* eslint-disable @typescript-eslint/no-unused-vars */
import {locateFile} from '@/wasm';
import LoadFractalEngine, {Process} from '@/wasm/fractal';
import {renderMandelbrot} from './mandelbrot';

const WIDTH = 800;
const HEIGHT = 600;

export default async function main(): Promise<void> {
    const module = await LoadFractalEngine({
        locateFile,
    });

    const processInstance = new module.Process();

    const canvas = <HTMLCanvasElement>document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const mandelbrotCanvas = renderMandelbrot(4096, 0.9, 250, 0.155, 0.583, 70);
    ctx.drawImage(mandelbrotCanvas, 0, 0);
}

function draw(processInstance: Process, ctx: CanvasRenderingContext2D) {
    const resultVector = processInstance.mand(WIDTH, HEIGHT);
    const imageData = new Uint8ClampedArray(grayscaleImageData(resultVector));

    const img = new ImageData(imageData, WIDTH, HEIGHT);
    ctx.putImageData(img, 0, 0);
}

function grayscaleImageData(imageData: number[]) {
    const data = imageData;
    for (let i = 0; i < data.length; i += 4) {
        const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
        data[i] = brightness;
        data[i + 1] = brightness;
        data[i + 2] = brightness;
    }
    return imageData;
}

main();
