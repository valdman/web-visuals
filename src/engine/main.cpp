#include <iostream>
#include <emscripten.h>

#define EMSCRIPTEN_EXPORT extern "C" __attribute__((visibility("default")))

int* fillarr()
{
    int* arr = new int[4] {1, 4, 8, 8};
    for(int i=0; i<4; ++i) {
        arr[i] = arr[i] * 2;
    }
    return arr;
}

EMSCRIPTEN_EXPORT
EMSCRIPTEN_KEEPALIVE
int render(int a)
{
  std::cout << "salam" << a << std::endl;
  return 0;
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
