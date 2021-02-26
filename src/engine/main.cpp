#include <iostream>
#include <vector>

#include <emscripten.h>
#include <emscripten/bind.h>

#define EMSCRIPTEN_EXPORT extern "C" __attribute__((visibility("default")))

EMSCRIPTEN_EXPORT
EMSCRIPTEN_KEEPALIVE
std::shared_ptr<std::vector<int>> fillarr()
{
    std::vector<int> arr{1, 4, 8, 8};
    for(int i=0; i<4; ++i) {
        arr[i] = arr[i] * 2;
    }
    auto ptr = std::make_shared<std::vector<int>>(arr);
    std::cout << ptr << std::endl;
    return ptr;
}

EMSCRIPTEN_EXPORT
EMSCRIPTEN_KEEPALIVE
int render(int a)
{
  std::cout << "salam" << a << std::endl;
  return 0;
}

// EMSCRIPTEN_BINDINGS(better_smart_pointers) {
//     class_<C>("C")
//         .smart_ptr_constructor("C", &std::make_shared<C>)
//         ;
// }

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
