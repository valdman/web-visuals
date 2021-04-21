/* eslint-disable @typescript-eslint/no-unused-vars */
import {GPU} from 'gpu.js';
import {EmptyCell, Scene, SceneCell, SolidCell} from '@/web/models';

const gpu = new GPU();

export function renderSceneKernel({scene, width}: {scene: Scene; width: number}): HTMLCanvasElement {
    if (!renderSceneKernelFunc.output || renderSceneKernelFunc.output[0] !== width) {
        renderSceneKernelFunc.setDynamicOutput(true).setOutput([width, width]);
    }
    (renderSceneKernelFunc as typeof renderScene)(scene, width);
    return renderSceneKernelFunc.canvas;
}

const renderSceneKernelFunc = gpu.createKernel(renderScene).setGraphical(true);
renderSceneKernelFunc.addFunction(getColorFromCell);

function renderScene(src: Scene, width: number): void {
    const {x, y}: {x: number; y: number} = this.thread;
    const cell = src[y][x];
    const [r, g, b, a] = getColorFromCell(cell);

    this.color(r, g, b, a);
}

function getColorFromCell(cell: SceneCell): [number, number, number, number] {
    if (cell === 1) {
        return [0, 0, 0, 1];
    }
    if (cell === 2) {
        return [120, 0, 0, 1];
    }
    if (cell === 3) {
        return [0, 120, 0, 1];
    }
}
