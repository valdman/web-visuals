import {locateFile} from 'engines';
import LoadFractalEngine from 'engines/fractal';

export default async function main(): Promise<void> {
    const module = await LoadFractalEngine({
        locateFile,
    });

    const getResultPtr = module.cwrap('fillarr', 'number', []);
    const len = 5;
    const resultPtr = getResultPtr();
    console.log('resultPtr: ', resultPtr);
    const result = new Uint8Array(module.HEAPU8.subarray(resultPtr, resultPtr + len), resultPtr, 5);
    console.log(result);

    // // Get 2d drawing context
    // const canvas = <HTMLCanvasElement>document.getElementById('c');
    // const ctx = canvas.getContext('2d');

    // const data = new Uint8ClampedArray(memory.buffer, pointer, width * height * 4);
    // const img = new ImageData(data, width, height);
    // ctx.putImageData(img, 0, 0);
}

main();
