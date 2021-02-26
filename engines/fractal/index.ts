// @ts-ignore
import LoadFractal from './fractal-engine.js';

import {ccall, cwrap, EmscriptenModule, EmscriptenModuleFactory} from 'engines';


export type FractalEngineModule = EmscriptenModule & {
    ccall: ccall;
    cwrap: typeof cwrap;
};

export default LoadFractal as EmscriptenModuleFactory<FractalEngineModule>;
