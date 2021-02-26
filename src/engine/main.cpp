#include <iostream>
#include <vector>

#include <emscripten.h>
#include <emscripten/bind.h>

#define intVector std::vector<int>

class Process {

  public:
    Process(){};

    intVector fillarr()
    {
        auto arr = intVector{1, 4, 8, 8};
        for(int i=0; i<4; ++i) {
            arr[i] = arr[i] * 2;
        }
        std::cout << &arr << std::endl;
        return arr;
    }

    int salam(int a)
    {
      std::cout << "salam " << a << std::endl;
      return 0;
    }
};

EMSCRIPTEN_BINDINGS(main) {
    emscripten::register_vector<int>("vector<int>");
    emscripten::smart_ptr_trait<std::shared_ptr<intVector>>();

    emscripten::class_<Process>("Process")
      .constructor<>()
      .function("fillarr", &Process::fillarr)
      .function("salam", &Process::salam);
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
