import React, {createRef, ReactElement, useEffect, useState} from 'react';
import {zoom, zoomIdentity, ZoomTransform, zoomTransform} from 'd3-zoom';
import {pointer, select, Selection} from 'd3-selection';

type CanvasSelection = Selection<HTMLCanvasElement, unknown, HTMLElement, unknown>;

interface Props {
    width: number;
    render({k, x, y}: ZoomTransform): HTMLCanvasElement;
}

export function GpuCanvas({width, render}: Props): ReactElement {
    const canvasRef = createRef<HTMLCanvasElement>();
    const [canvasSelection, setCanvasSelection] = useState<CanvasSelection>();

    useEffect(() => {
        if (!canvasSelection) {
            return;
        }
        initD3({canvasSelection, width, render});
    }, [canvasSelection, width, render]);

    useEffect(() => {
        const selection = select<HTMLCanvasElement, unknown>(canvasRef.current);
        setCanvasSelection(selection);
        const ctx = canvasSelection.node().getContext('2d');
        ctx.drawImage(render(zoomIdentity), 0, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <canvas ref={canvasRef} width={width} height={width} style={{width: 900, height: 900}} />;
}

function initD3({canvasSelection, render}: {canvasSelection: CanvasSelection} & Props) {
    let newZoom = '';
    let animationFrame = 0;

    const zoomHandler = function () {
        const transform = zoomTransform(canvasSelection.node());
        // const {k, x, y} = transform;
        if (transform.toString() !== newZoom) {
            window.cancelAnimationFrame(animationFrame);
            newZoom = transform.toString();
        }
        animationFrame = window.requestAnimationFrame(function () {
            const ctx = canvasSelection.node().getContext('2d');
            ctx.drawImage(render(transform), 0, 0);
        });
    };

    canvasSelection.call(zoom().on('zoom', zoomHandler)).on('click', function (e) {
        const mouseXy = pointer(e, canvasSelection.node());
        const {k, x, y} = zoomTransform(canvasSelection.node());
        console.log('Zoom state ', k, x, y);
        console.log('Mouse click ', mouseXy);
    });
}
