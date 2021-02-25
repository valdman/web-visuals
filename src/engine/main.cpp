// #include <iostream>

#include <array>
#include <emscripten.h>

#define EMSCRIPTEN_EXPORT extern "C" __attribute__((visibility("default")))

std::array<int, 5> fillarr()
{
    std::array<int, 5> arr2 {1, 4, 8, 8};
    for(int i=0; i<5; ++i) {
        arr2[i] = arr2[i] * 2;
    }
    return arr2;
}

EMSCRIPTEN_EXPORT
EMSCRIPTEN_KEEPALIVE
std::array<int, 5> render()
{
  return fillarr();
}

// /* External function that is implemented in JavaScript. */
// EMSCRIPTEN_EXPORT
// void putc_js(char c);

// /* Basic implementation of the writev sys call. */ 
// EMSCRIPTEN_KEEPALIVE
// size_t writev_c(int fd, const struct iovec *iov, int iovcnt) {
//   size_t cnt = 0;
//   for (int i = 0; i < iovcnt; i++) {
//     for (int j = 0; j < iov[i].iov_len; j++) {
//       putc_js(((char *)iov[i].iov_base)[j]);
//     }
//     cnt += iov[i].iov_len;
//   }
//   return cnt;
// }
