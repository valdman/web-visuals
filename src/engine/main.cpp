#include <stdio.h>
#include <sys/uio.h>

#include <emscripten.h>

#define EMSCRIPTEN_EXPORT extern "C" __attribute__((visibility("default")))

EMSCRIPTEN_EXPORT
EMSCRIPTEN_KEEPALIVE
int render(void) {
  printf("Hello World\n");
  return 1488;
}

/* External function that is implemented in JavaScript. */
EMSCRIPTEN_EXPORT
void putc_js(char c);

/* Basic implementation of the writev sys call. */ 
EMSCRIPTEN_KEEPALIVE
size_t writev_c(int fd, const struct iovec *iov, int iovcnt) {
  size_t cnt = 0;
  for (int i = 0; i < iovcnt; i++) {
    for (int j = 0; j < iov[i].iov_len; j++) {
      putc_js(((char *)iov[i].iov_base)[j]);
    }
    cnt += iov[i].iov_len;
  }
  return cnt;
}
