#include <emscripten.h>
#include <emscripten/bind.h>

using namespace emscripten;

#define HEIGHT 400
#define WIDTH 800

#define WASM_EXPORT extern "C" __attribute__((visibility( "default")))

int data[WIDTH * HEIGHT];
int red = (255 << 24) | 255;

WASM_EXPORT
EMSCRIPTEN_KEEPALIVE
int* render() {
   for (int y = 0; y < HEIGHT; y++) {
     int yw = y * WIDTH;
     for (int x = 0; x < WIDTH; x++) {
       data[yw + x] = red;
     }
   }
   return &data[0];
}

EMSCRIPTEN_BINDINGS(my_module) {
    function("render", &render, allow_raw_pointer<arg<0>>());
}
