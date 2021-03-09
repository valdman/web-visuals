#ifndef FRACT__H
#define FRACT__H

#include <complex>
#include <tuple>

#include <chrono>
#include <functional>
#include <string>
#include <vector>

#include <opencv2/core.hpp>

class Fract {
  private:
    typedef std::complex<double> Complex;

    struct ZoomFrameHist {
        ZoomFrameHist(const int frame_number_, const double x1_,
                      const double x2_, const double y1_, const double y2_)
            : x1(x1_), x2(x2_), y1(y1_), y2(y2_), frame_number(frame_number_) {}
        int frame_number;
        double x1, x2, y1, y2;
        std::string info2file() const {
            return cv::format("%.15f %.15f %.15f %.15f", x1, x2, y1, y2);
        }
        std::string info() const {
            return cv::format(
                "frame::%d\nx1(%.15f),\nx2(%.15f),\ny1(%.15f),\ny2(%.15f);",
                frame_number, x1, x2, y1, y2);
        }
    };

    template <typename T> class window {
        T _x_min, _x_max, _y_min, _y_max;

      public:
        window(T x_min, T x_max, T y_min, T y_max)
            : _x_min(x_min), _x_max(x_max), _y_min(y_min), _y_max(y_max) {}
        T size() const { return (width() * height()); }
        T width() const { return (_x_max - _x_min); }
        T height() const { return (_y_max - _y_min); }
        T x_min() const { return _x_min; }
        void x_min(T x_min) { _x_min = x_min; }
        T x_max() const { return _x_max; }
        void x_max(T x_max) { _x_max = x_max; }
        T y_min() const { return _y_min; }
        void y_min(T y_min) { _y_min = y_min; }
        T y_max() const { return _y_max; }
        void y_max(T y_max) { _y_max = y_max; }
        //! @brief reset window at new place
        void reset(T x_min, T x_max, T y_min, T y_max) {
            _x_min = x_min;
            _x_max = x_max;
            _y_min = y_min;
            _y_max = y_max;
        }
        cv::Rect rc() const {
            return cv::Rect(this->x_min(), this->y_min(), this->width(),
                            this->height());
        }
        std::vector<ZoomFrameHist> zoom_history;
        void zoom(const double window_ratio, const double x0, const double x1,
                  const double y0, const double y1);
    };

    const window<int> scr;
    const int outimg_w;
    const int outimg_h;

  public:
    Fract(const int outimg_w = 1200, const int outimg_h = 1200)
        : outimg_w(outimg_w), outimg_h(outimg_h),
          scr(0, outimg_w, 0, outimg_h){};

    cv::Mat lastImage;

    //! @brief loop over each pixel from our image and check
    //         if the points associated with this pixel escape to infinity
    void getNumberIterations(
        window<double>& fract, int iter_max, std::vector<int>& colors,
        const std::function<std::complex<double>(std::complex<double>,
                                                 std::complex<double>)>& func);

    //! @brief check if a point is in the set or escapes to infinity,
    //         return the number if iterations
    static int escape(Fract::Complex c, int iter_max,
                      const std::function<Fract::Complex(Fract::Complex,
                                                         Fract::Complex)>& func,
                      double th = 2.0);

    //! @brief convert a pixel coordinate to the complex domain
    //! @todo rewrite as tempate T indeed of Complex
    Complex scale(window<double>& fr, Fract::Complex c);

    cv::Mat computeFractal(
        window<double>& fract, int iter_max, std::vector<int>& colors,
        const std::function<std::complex<double>(std::complex<double>,
                                                 std::complex<double>)>& func,
        bool smooth_color);

    window<double> mandelbrot(int x1, int y1, int x2, int y2,
                              const int max_iter = 500);

    cv::Mat plot(std::vector<int>& colors, int iter_max, bool smooth_color);
};

#endif // FRACT__H