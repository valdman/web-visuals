import {locateFile} from 'engines';
import LoadFractalEngine from 'engines/fractal';

export default async function main(): Promise<void> {
    const module = await LoadFractalEngine({
        locateFile,
    });
    const render = module.ccall('render', 'array', [], []);

    // // Get 2d drawing context
    // const canvas = <HTMLCanvasElement>document.getElementById('c');
    // const ctx = canvas.getContext('2d');

    const result = render();
    // const data = new Uint8ClampedArray(memory.buffer, pointer, width * height * 4);
    // const img = new ImageData(data, width, height);
    // ctx.putImageData(img, 0, 0);
    console.log(result);
}

main();
