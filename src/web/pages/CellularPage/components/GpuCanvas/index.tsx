import React, {Component, createRef, ReactElement, RefObject} from 'react';
import {select, Selection} from 'd3-selection';

type CanvasSelection = Selection<HTMLCanvasElement, unknown, HTMLElement, unknown>;

interface Props {
    width: number;
    render(): HTMLCanvasElement;
}

interface State {
    canvasRef: RefObject<HTMLCanvasElement>;
}

export class GpuCanvas extends Component<Props, State> {
    canvasSelection: CanvasSelection;

    draw(): void {
        const {render} = this.props;

        const canvasSelection = this.canvasSelection;
        const canvas = canvasSelection.node();
        const ctx = canvas.getContext('2d');
        ctx.drawImage(render(), 0, 0);
    }

    initD3(): void {
        if (!this.state.canvasRef || !this.state.canvasRef.current) {
            console.log('No node. sad.');
        }
        this.canvasSelection = select(this.state.canvasRef.current);
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            canvasRef: createRef(),
        };
    }

    drawRepeatedly(): void {
        this.draw();
        window.requestAnimationFrame(() => this.drawRepeatedly());
    }

    componentDidMount(): void {
        const {canvasRef} = this.state;
        if (!canvasRef.current) {
            return;
        }
        this.initD3();

        window.requestAnimationFrame(() => this.drawRepeatedly());
    }

    render(): ReactElement {
        const {width} = this.props;
        const {canvasRef} = this.state;

        return <canvas ref={canvasRef} width={width} height={width} style={{width, height: width}} />;
    }
}
