/* eslint-disable @typescript-eslint/no-unused-vars */
import {zoom, zoomIdentity, zoomTransform} from 'd3-zoom';
import {select, pointer} from 'd3-selection';
import {locateFile} from '@/wasm';
import LoadFractalEngine, {Process} from '@/wasm/fractal';
import {renderMandelbrot} from './mandelbrot';

const WIDTH = 1900;
const ITERATIONS = 200;

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

    let newZoom = 0;
    let animationFrame = 0;
    const zoomTarget = select(canvas);
    zoomTarget
        .call(zoom, zoomIdentity)
        .call(
            zoom().on('zoom.end', function (e) {
                const z = e.transform.k.toString();
                if (z != newZoom) {
                    window.cancelAnimationFrame(animationFrame);
                    newZoom = z;
                }
                animationFrame = window.requestAnimationFrame(function (timestamp) {
                    const transform = zoomTransform(zoomTarget.node());
                    console.log(x, y);
                    renderMandelbrot(
                        WIDTH,
                        transform.k,
                        ITERATIONS,
                        (3.4 * transform.x) / WIDTH,
                        (3.4 * transform.y) / WIDTH,
                    );
                    ctx.drawImage(mandelbrotCanvas, 0, 0);
                });
            }),
        );
    zoomTarget.on('click', function (e) {
        const xy = pointer(e, this);

        const transform = zoomTransform(zoomTarget.node());
        const xy1 = transform.invert(xy);

        console.log('Mouse:[', xy[0], xy[1], '] Zoomed:[', xy1[0], xy1[1], ']');
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
