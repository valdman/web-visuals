import fs from 'fs';
import {renderMandelbrot} from '@/web/graphics/holomorph';

async function main() {
    const imgCanvas = renderMandelbrot({width: 2048, scale: Math.pow(10, 2), maxIter: 1000, c: [0.19, 0.58]});
    const data = imgCanvas.toDataURL();

    fs.writeFileSync('tmp/myfile.png', Buffer.from(data, 'base64'));
}

main();
