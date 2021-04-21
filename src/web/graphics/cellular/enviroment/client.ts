/* eslint-disable @typescript-eslint/no-unused-vars */
import {GPU} from 'gpu.js';
import {EmptyCell, SandCell, Scene, SceneCell, SolidCell} from '@/web/models';

const gpu = new GPU();

export function enviromentSimulation({
    scene,
    width,
}: {
    scene: Scene;
    width: number;
}): Scene {
    if (!enviromentSimulationKernel.output || enviromentSimulationKernel.output[0] !== width) {
        enviromentSimulationKernel.setDynamicOutput(true).setOutput([width, width]);
    }
    interface ConvolutionKernelFunc {
        (src: Scene, width: number): Scene;
    }
    return (<ConvolutionKernelFunc>enviromentSimulationKernel)(scene, width);
}

const enviromentSimulationKernel = gpu.createKernel(enviromentSimulationFunc);

function enviromentSimulationFunc(src: Scene, width: number): SceneCell {
    const height = width;

    const {x, y}: {x: number; y: number} = this.thread;

    const cellState = src[y][x];
    const emptyCell: EmptyCell = 1;
    const solidCell: SolidCell = 2;
    const sandCell: SandCell = 3;
    let resultState: SceneCell = cellState;

    const downCell = src[y - 1][x];
    const upCell = src[y + 1][x];

    const leftUpCell = src[y + 1][x - 1];
    const leftCell = src[y][x - 1];

    const rightCell = src[y][x + 1];
    const rightUpCell = src[y + 1][x + 1];

    if (cellState === sandCell) {
        if (downCell === emptyCell) {
            resultState = emptyCell;
        }
        if (downCell === solidCell || downCell === sandCell) {
            resultState = sandCell;
        }
    }
    if (cellState === emptyCell) {
        if (upCell === sandCell) {
            resultState = sandCell;
        }

        if(rightUpCell === sandCell && (leftCell === sandCell || rightCell === sandCell)) {
            resultState = sandCell;
        }

        if(leftUpCell === sandCell && (rightCell === sandCell || leftCell === sandCell)) {
            resultState = sandCell;
        }
    }

    return resultState;
}
