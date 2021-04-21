import React, {Component, createRef, ReactElement, RefObject} from 'react';
import {zoom, zoomIdentity, ZoomTransform, zoomTransform} from 'd3-zoom';
import {select, Selection} from 'd3-selection';

import {transformToComplexCoordinates} from '@/web/graphics/holomorph/coordinates';

type CanvasSelection = Selection<HTMLCanvasElement, unknown, HTMLElement, unknown>;

interface Props {
    width: number;
    render({k, x, y}: ZoomTransform): HTMLCanvasElement;
}

interface State {
    canvasRef: RefObject<HTMLCanvasElement>;
    currentZoom: ZoomTransform;
}

export class GpuCanvas extends Component<Props, State> {
    canvasSelection: CanvasSelection;

    draw(): void {
        const {render} = this.props;
        const {currentZoom} = this.state;

        const canvasSelection = this.canvasSelection;
        const canvas = canvasSelection.node();
        const ctx = canvas.getContext('2d');
        ctx.drawImage(render(currentZoom), 0, 0);
    }

    initD3(): void {
        if (!this.state.canvasRef || !this.state.canvasRef.current) {
            console.log('No node. sad.');
        }
        this.canvasSelection = select(this.state.canvasRef.current);
        this.canvasSelection.call(zoom, zoomIdentity);
        this.setState({currentZoom: zoomIdentity});
    }

    registerZoomCallback(): void {
        const canvasSelection = this.canvasSelection;

        if (!canvasSelection || !this.canvasSelection.node()) {
            console.log('No node to register zoom callback');
        }
        const canvas = canvasSelection.node();
        let newZoom = '';
        let animationFrame = 0;

        const zoomHandler = () => {
            const transform = zoomTransform(canvas);
            this.setState({currentZoom: transform});

            if (transform.toString() !== newZoom) {
                window.cancelAnimationFrame(animationFrame);
                newZoom = transform.toString();
            }
            animationFrame = window.requestAnimationFrame(() => {
                this.draw();
            });
        };
        canvasSelection.call(zoom().on('zoom', zoomHandler)).on('click', function () {
            const {k, x, y} = zoomTransform(canvas);
            console.log('Zoom state ', k, x, y);
            console.log('Center coords (complex): ', transformToComplexCoordinates(this.width, {k,  x,  y}));
        });
    }

    componentDidUpdate(prevProps: Props): void {
        const {render} = this.props;
        if (prevProps.render !== render) {
            this.registerZoomCallback();
            this.draw();
        }
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            canvasRef: createRef(),
            currentZoom: null,
        };
    }

    componentDidMount(): void {
        const {canvasRef} = this.state;
        const {render} = this.props;
        if (!canvasRef.current) {
            return;
        }
        const ctx = canvasRef.current.getContext('2d');
        ctx.drawImage(render(zoomIdentity), 0, 0);
        this.initD3();
        this.registerZoomCallback();
    }

    render(): ReactElement {
        const {width} = this.props;
        const {canvasRef} = this.state;

        return <canvas ref={canvasRef} width={width} height={width} style={{width, height: width}} />;
    }
}
