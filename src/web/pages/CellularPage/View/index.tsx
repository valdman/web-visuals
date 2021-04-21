import React, {ReactElement, useState} from 'react';

import {enviromentSimulation} from '@/web/graphics/cellular/enviroment';
import {renderSceneKernel} from '@/web/graphics/cellular/scene';
import {initScene} from '@/web/models';

import {CellularGpuCanvas} from '../components/GpuCanvas';

export function View(): ReactElement {
    const [width] = useState(800);
    const [scene, setScene] = useState(initScene(width));

    function renderCanvas(): HTMLCanvasElement {
        const newScene = enviromentSimulation({scene, width});
        setScene(newScene);
        return renderSceneKernel({width, scene: newScene});
    }

    return <CellularGpuCanvas render={renderCanvas} width={width} />;
}
