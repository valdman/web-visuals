import {syscall} from './syscall';

const width = 640;
const height = 360;

const memSize = 256;
const memory = new WebAssembly.Memory({initial: memSize, maximum: memSize});

async function loadWasm(path: string): Promise<WebAssembly.Instance> {
    let putJsStringBuffer = '';

    // Handler for system calls of any arity
    function syscallInstance(syscallCode: number, ...args: number[]) {
        return syscall(instance, syscallCode, args);
    }

    const assemblyBytes = await fetch(path).then((response) => response.arrayBuffer());

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {instance, module} = await WebAssembly.instantiate(assemblyBytes, {
        env: {
            __syscall0: syscallInstance,
            __syscall1: syscallInstance,
            __syscall2: syscallInstance,
            __syscall3: syscallInstance,
            __syscall4: syscallInstance,
            __syscall5: syscallInstance,
            __syscall6: syscallInstance,
            putc_js: function (charCode: number) {
                const c = String.fromCharCode(charCode);
                if (c == '\n') {
                    console.log(putJsStringBuffer);
                    putJsStringBuffer = '';
                } else {
                    putJsStringBuffer += c;
                }
            },
        },
    });

    return instance;
}

interface WasmFunc {
    (...args: unknown[]): number;
}

export default async function main(): Promise<void> {
    const instance = await loadWasm('/fractal-engine.wasm');
    const {render: renderFromWasm} = <Record<string, unknown>>instance.exports;

    // Get 2d drawing context
    const canvas = <HTMLCanvasElement>document.getElementById('c');
    const ctx = canvas.getContext('2d');

    const pointer = (<WasmFunc>renderFromWasm)();
    const data = new Uint8ClampedArray(memory.buffer, pointer, width * height * 4);
    const img = new ImageData(data, width, height);
    ctx.putImageData(img, 0, 0);
}

main();
