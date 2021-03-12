import React, {ReactElement, useState} from 'react';

import {GpuCanvas} from './components/GpuCanvas';

import {renderJulia} from '@/web/graphics';
import {transformToComplexCoordinates} from '@/web/graphics/coordinates';


export function View(): ReactElement {
    const [maxIter] = useState(150);
    const [width] = useState(900);

    function renderCanvas({k, x, y}: {k: number; x: number; y: number}): HTMLCanvasElement {
        const c = transformToComplexCoordinates(width, {k, x, y});

        return renderJulia({width, scale: k, c, a: [0.18, 0.59], maxIter});
    }

    return <GpuCanvas render={renderCanvas} width={900} />;
}
