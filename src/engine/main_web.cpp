#include <emscripten/val.h>
#include <emscripten/bind.h>

#include <opencv2/core/mat.hpp>
#include <opencv2/imgcodecs.hpp>
#include <opencv2/opencv.hpp>

#include "fractal.h"

using namespace cv;
using namespace emscripten;

class Process {
  private:
    std::vector<unsigned char> buffer;
    Mat decoded;

  public:
    Process() : buffer{}, decoded{} {};

    val allocate(size_t size) {
        this->buffer.reserve(size);
        unsigned char* byteBuffer = this->buffer.data();
        return val(typed_memory_view(size, byteBuffer));
    }

    val randarr(int width, int height) {
        Mat img(width, height, CV_8UC4);
        randu(img, Scalar(0, 0, 0, 255), Scalar(255, 255, 255, 255));

        unsigned char* byteBuffer = img.data;
        return val(typed_memory_view(width * height * 4, byteBuffer));
    }

    val blackImage(int width, int height) {
        Mat image(width, height, CV_8UC4, Scalar(0, 0, 0));
        unsigned char* byteBuffer = image.data;
        return val(typed_memory_view(width * height * 4, byteBuffer));
    }

    val mand(int width, int height) {
        Fract fractal(width, height);
        double x1(-2.2), x2(1.2), y1(-1.7), y2(1.7);
        auto maxIterations(80);
        std::cout << "Generated" << std::endl;
        auto f = fractal.mandelbrot(x1, y1, x2, y2, maxIterations);
        unsigned char* byteBuffer = fractal.lastImage.data;
        return val(typed_memory_view(width * height * 4, byteBuffer));
    }

    Mat my_imdecode() {
        // this->decoded = imdecode(this->buffer, IMREAD_GRAYSCALE);
        return this->decoded;
    }
};

EMSCRIPTEN_BINDINGS(my_module) {
    class_<Mat>("Mat");
    class_<Point2d>("Point2d");

    class_<Fract>("Fract").constructor<int, int>()
        .function("mandelbrot", &Fract::mandelbrot);

    class_<Process>("Process")
        .constructor<>()
        .function("randarr", &Process::randarr)
        .function("blackImage", &Process::blackImage)
        .function("mand", &Process::mand)
        .function("imdecode", &Process::my_imdecode)
        .function("allocate", &Process::allocate);
    register_vector<int>("vector<int>");

    smart_ptr_trait<std::shared_ptr<std::vector<int>>>();
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
