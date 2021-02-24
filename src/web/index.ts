import {WASI} from '@wasmer/wasi';
import wasiBindings from '@wasmer/wasi/lib/bindings/browser';
import {WasmFs} from '@wasmer/wasmfs';

import {lowerI64Imports} from '@wasmer/wasm-transformer';

const width = 640;
const height = 360;

const memSize = 256;
const memory = new WebAssembly.Memory({initial: memSize, maximum: memSize});

const wasmFs = new WasmFs();
const wasi = new WASI({
    args: [],
    env: {},
    bindings: {
        ...wasiBindings,
        fs: wasmFs.fs,
    },
});

async function loadWasm(path: string): Promise<WebAssembly.Instance> {
    // Instantiate the WebAssembly file
    const assemblyBytes = await fetch(path).then((response) => response.arrayBuffer());
    // Instantiate the WebAssembly file
    const wasmBytes = <Uint8Array> new Uint8Array(assemblyBytes).buffer;
    const loweredWasm = await lowerI64Imports(wasmBytes);

    const module = await WebAssembly.compile(loweredWasm);

    let wasiImports = null;
    try {
        wasiImports = wasi.getImports(module);
    // eslint-disable-next-line no-empty
    } finally {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {instance, module: instModule} = await WebAssembly.instantiate(assemblyBytes, {
        env: {putc_js(...args: any) {console.log(args);}},
        ...(wasiImports || {}),
    });

    // Start the WebAssembly WASI instance!
    wasi.start(instance);

    // Output what's inside of /dev/stdout!
    const stdout = await wasmFs.getStdOut();
    console.log(stdout);

    return instance;
}

interface WasmFunc {
    (...args: unknown[]): number;
}

export default async function main(): Promise<void> {
    // const instance = await LoadFractalEngine();
    const instance = await loadWasm('/engines/fractal/fractal-engine.wasm');
    const {render: renderFromWasm} = <Record<string, WasmFunc>>instance.exports;

    const stdout = await wasmFs.getStdOut();
    console.log(stdout);

    // Get 2d drawing context
    const canvas = <HTMLCanvasElement>document.getElementById('c');
    const ctx = canvas.getContext('2d');

    const pointer = renderFromWasm();
    const data = new Uint8ClampedArray(memory.buffer, pointer, width * height * 4);
    const img = new ImageData(data, width, height);
    ctx.putImageData(img, 0, 0);
}

main();
