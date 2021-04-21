import React, {ReactElement, useState} from 'react';

import {convolutionKernel} from '@/web/graphics/enviromentSimulation';
import {renderSceneKernel} from '@/web/graphics/scene';
import {initScene} from '@/web/models';

import {GpuCanvas} from '../components/GpuCanvas';

export function View(): ReactElement {
    const [width] = useState(800);
    const [scene, setScene] = useState(initScene(width));

    function renderCanvas(): HTMLCanvasElement {
        const newScene = convolutionKernel({scene, width, kernelRadius: 1});
        setScene(newScene);
        return renderSceneKernel({width, scene: newScene});
    }

    return <GpuCanvas render={renderCanvas} width={width} />;
}
