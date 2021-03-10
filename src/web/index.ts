import {zoom, zoomIdentity, zoomTransform} from 'd3-zoom';
import {pointer, select} from 'd3-selection';

import {renderJulia} from './mandelbrot';

const WIDTH = 1900;
const ITERATIONS = 500;

export default async function main(): Promise<void> {
    const canvas = <HTMLCanvasElement>document.getElementById('c');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(renderJulia(WIDTH, 1, ITERATIONS, 0, 0), 0, 0);

    let newZoom = 1;
    let animationFrame = 0;
    const zoomTarget = select(canvas);

    const zoomHandler = function () {
        const {k, x, y} = zoomTransform(zoomTarget.node());
        if (k != newZoom) {
            window.cancelAnimationFrame(animationFrame);
            newZoom = k;
        }
        animationFrame = window.requestAnimationFrame(function () {
            const x_img_coords = (x / k) * 1.0;
            const y_img_coords = (y / k) * 1.0;
            const x_fract_coords = -x_img_coords / WIDTH;
            const y_fract_coords = y_img_coords / WIDTH;

            const frameCanvas = renderJulia(WIDTH, k, ITERATIONS, x_fract_coords, y_fract_coords);
            ctx.drawImage(frameCanvas, 0, 0);
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

main();