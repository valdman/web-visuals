import React, {ReactElement, useState} from 'react';
import Slider from 'react-slider';

import {GpuCanvas} from '../components/GpuCanvas';

import {Complex} from '@/web/complex';
import {renderMandelbrot} from '@/web/graphics';
import {transformToComplexCoordinates} from '@/web/graphics/coordinates';

import s from './index.css';

export function View(): ReactElement {
    const [maxIter, setMaxIter] = useState(150);
    const [width] = useState(900);

    function renderCanvas({k, x, y}: {k: number; x: number; y: number}): HTMLCanvasElement {
        const c = transformToComplexCoordinates(width, {k, x, y});
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const a: Complex = [0.18, 0.59];

        return renderMandelbrot({width, scale: k, c, maxIter});
    }

    return (
        <>
            <GpuCanvas render={renderCanvas} width={width} />
            <Slider
                thumbClassName={s.slider}
                onChange={(value) => setMaxIter(Number(value))}
                min={1}
                max={1000}
                value={maxIter}
            />
        </>
    );
}
