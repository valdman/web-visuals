// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import LoadFractal from 'wasm/fractal/fractal-engine.js';

import {ccall, cwrap, EmscriptenModule, EmscriptenModuleFactory, Vector} from '@/wasm';

declare class Process {
    constructor();
    fillarr(size: number): Vector<number>;
    salam(a: number): number;
}
export interface Bindings {
    Process: typeof Process;
}

export interface ExportRuntime {
    ccall: ccall;
    cwrap: typeof cwrap;
}

export type FractalEngineModule = EmscriptenModule & Bindings & ExportRuntime;

export default LoadFractal as EmscriptenModuleFactory<FractalEngineModule>;
