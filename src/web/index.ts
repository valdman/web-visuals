/* eslint-disable @typescript-eslint/no-unused-vars */
import {D3ZoomEvent, zoom, zoomIdentity, zoomTransform} from 'd3-zoom';
import {pointer, select} from 'd3-selection';
import {locateFile} from '@/wasm';
import LoadFractalEngine, {Process} from '@/wasm/fractal';
import {renderJulia, renderMandelbrot} from './mandelbrot';

const WIDTH = 1900;
const ITERATIONS = 500;

export default async function main(): Promise<void> {
    const module = await LoadFractalEngine({
        locateFile,
    });

    const processInstance = new module.Process();

    const canvas = <HTMLCanvasElement>document.getElementById('c');
    const ctx = canvas.getContext('2d');
    // const mandelbrotCanvas = renderJulia(WIDTH, 1.5, ITERATIONS, 0.285, 0, 120);
    const mandelbrotCanvas = renderMandelbrot(WIDTH, 1, ITERATIONS, 0, 0);
    ctx.drawImage(mandelbrotCanvas, 0, 0);

    let newZoom = 1;
    let animationFrame = 0;
    const zoomTarget = select(canvas);
    const zoomHandler = function (e: D3ZoomEvent<HTMLCanvasElement, unknown>) {
        const {k, x, y} = zoomTransform(zoomTarget.node());
        if (k != newZoom) {
            window.cancelAnimationFrame(animationFrame);
            newZoom = k;
        }
        animationFrame = window.requestAnimationFrame(function (timestamp) {
            const mouseXy = pointer(e, zoomTarget.node());

            const x_img_coords = (x / k) * 1.0;
            const y_img_coords = (y / k) * 1.0;
            const x_fract_coords = -x_img_coords / WIDTH;
            const y_fract_coords = y_img_coords / WIDTH;

            // transform.invert();
            renderJulia(WIDTH, k, ITERATIONS, x_fract_coords, y_fract_coords);
            ctx.drawImage(mandelbrotCanvas, 0, 0);
        });
    };

    zoomTarget
        .call(zoom, zoomIdentity)
        .call(zoom().on('zoom', zoomHandler))
        .on('click', function (e) {
            const mouseXy = pointer(e, zoomTarget.node());
            const {k, x, y} = zoomTransform(zoomTarget.node());
            console.log('Zoom state ', k, x, y);
            console.log('Mouse click ', mouseXy);
        });
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
