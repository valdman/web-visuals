// @ts-ignore
import LoadFractal from './fractal-engine.js';

import {ccall, cwrap, EmscriptenModule, EmscriptenModuleFactory, Vector} from 'engines';

declare class Process {
    constructor();
    fillarr(): Vector<number>;
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
