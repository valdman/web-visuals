#include <iostream>
#include <ctime>
#include <vector>

#include <emscripten.h>
#include <emscripten/bind.h>

#define int_vector std::vector<int>

class Process {

  public:
    Process(){};

    int_vector fillarr(int size)
    {
        srand((unsigned) time(0));
        auto arr = int_vector{};

        for(int i=0; i < size; ++i) {
            arr.push_back((rand() % 255) + 1);
        }
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
    emscripten::smart_ptr_trait<std::shared_ptr<int_vector>>();

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
