const memoryStates = new WeakMap();

const getEmptyMemoryState = (memory: WebAssembly.Memory) => ({
    object: memory,
    currentPosition: memory.buffer.byteLength,
});

export function syscall(instance: WebAssembly.Instance, n: number, args: number[]): number {
    const memory = <WebAssembly.Memory>instance.exports.memory;
    const memoryState = memoryStates.get(instance) || getEmptyMemoryState(memory);

    const cur = memoryState.currentPosition;
    const requested = args[1];

    switch (n) {
        default:
            console.log('Syscall ' + n + ' NYI.');
            break;
        case /* brk */ 45:
            return 0;
        case /* writev */ 146:
            // return instance.exports.writev_c(args[0], args[1], args[2]);
            return -1;
        case /* mmap2 */ 192:
            if (!memoryState) {
                memoryStates.set(instance, memoryState);
            }
            if (cur + requested > memory.buffer.byteLength) {
                const need = Math.ceil((cur + requested - memory.buffer.byteLength) / 65536);
                memory.grow(need);
            }
            memoryState.currentPosition += requested;
            return cur;
    }
}
