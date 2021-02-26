import {locateFile, Vector} from '@/wasm';
import LoadFractalEngine from '@/wasm/fractal';

const WIDTH = 800;
const HEIGHT = 600;

export default async function main(): Promise<void> {
    const module = await LoadFractalEngine({
        locateFile,
    });

    const processInstance = new module.Process();

    const canvas = <HTMLCanvasElement>document.getElementById('c');
    const ctx = canvas.getContext('2d');

    function* enumerateVector<T>(vector: Vector<T>): Generator<T> {
        const size = vector.size();

        for (let index = 0; index < size; index++) {
            const element = vector.get(index);
            yield element;
        }
    }

    setInterval(() => {
        const resultVector = processInstance.fillarr(WIDTH * HEIGHT * 4);
        const imageData = new Uint8ClampedArray(enumerateVector(resultVector));

        const img = new ImageData(imageData, WIDTH, HEIGHT);
        ctx.putImageData(img, 0, 0);
    }, 10);
}

main();
