import {locateFile} from '@/wasm';
import LoadFractalEngine, {Process} from '@/wasm/fractal';

const WIDTH = 800;
const HEIGHT = 600;

export default async function main(): Promise<void> {
    const module = await LoadFractalEngine({
        locateFile,
    });

    const processInstance = new module.Process();

    const canvas = <HTMLCanvasElement>document.getElementById('c');
    const ctx = canvas.getContext('2d');

    setInterval(() => {
        draw(processInstance, ctx);
    }, 1000 / 30);
    draw(processInstance, ctx);
}

function draw(processInstance: Process, ctx: CanvasRenderingContext2D) {
    const resultVector = processInstance.randarr(WIDTH, HEIGHT);
    const imageData = new Uint8ClampedArray(resultVector);

    const img = new ImageData(imageData, WIDTH, HEIGHT);
    ctx.putImageData(img, 0, 0);
}

main();
