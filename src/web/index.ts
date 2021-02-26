import {locateFile} from 'engines';
import LoadFractalEngine from 'engines/fractal';

export default async function main(): Promise<void> {
    const module = await LoadFractalEngine({
        locateFile,
    });

    const processInstance = new module.Process();
    const resultVector = processInstance.fillarr();
    const size = resultVector.size();
    for (let index = 0; index < size; index++) {
        const element = resultVector.get(index);
        console.log(`v[${index}] `, element);
    }

    // // Get 2d drawing context
    // const canvas = <HTMLCanvasElement>document.getElementById('c');
    // const ctx = canvas.getContext('2d');

    // const data = new Uint8ClampedArray(memory.buffer, pointer, width * height * 4);
    // const img = new ImageData(data, width, height);
    // ctx.putImageData(img, 0, 0);
}

main();
