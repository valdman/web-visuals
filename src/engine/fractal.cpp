//#include <opencv2/core.hpp>
#include <fstream>
#include <iostream>
#include <vector>

#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc.hpp>

#include "fractal.h"

using namespace std;

string printRc(const cv::Rect& rc) {
    return cv::format("(%d,%d) %dx%d", rc.x, rc.y, rc.width, rc.height);
}

template <typename T>
void Fract::window<T>::zoom(const double window_ratio, const double x0,
                            const double x1, const double y0, const double y1) {
    double y = (x1 - x0) * window_ratio;
    this->reset(x0, x1, y0, y + y0);
    if (this->zoom_history.empty()) {
        zoom_history.emplace_back(0, x0, x1, y0, y1);
        return;
    }
    auto last_z = zoom_history.back();
    zoom_history.emplace_back(last_z.frame_number, x0, x1, y0, y1);
}

Fract::Complex Fract::scale(window<double>& fr, Fract::Complex c) {
    Fract::Complex aux(
        c.real() / (double)this->scr.width() * fr.width() + fr.x_min(),
        c.imag() / (double)this->scr.height() * fr.height() + fr.y_min());
    return aux;
}

int Fract::escape(
    Fract::Complex c, int iter_max,
    const std::function<Fract::Complex(Fract::Complex, Fract::Complex)>& func,
    double th) {
    Fract::Complex z(0);
    int iter = 0;

    while (abs(z) < th && iter < iter_max) {
        z = func(z, c);
        iter++;
    }
    return iter;
}

void Fract::getNumberIterations(
    window<double>& fract, int iter_max, std::vector<int>& colors,
    const std::function<Fract::Complex(Fract::Complex, Fract::Complex)>& func) {
    cout << "process " << iter_max << " iters" << endl;
    int k = 0, progress = -1;
    const double th = 2.0;
    for (int i = this->scr.y_min(); i < this->scr.y_max(); ++i) {
        for (int j = scr.x_min(); j < scr.x_max(); ++j) {
            Complex c((double)j, (double)i);
            c = scale(fract, c);
            colors[k] = escape(c, iter_max, func, th);
            k++;
        }
        if (progress < (int)(i * 100.0 / scr.y_max())) {
            progress = (int)(i * 100.0 / scr.y_max());
            // std::cout << progress << '%' << std::flush;
            // std::cout.flush();
        }
    }
}

cv::Mat Fract::computeFractal(
    window<double>& fract, int iter_max, std::vector<int>& colors,
    const std::function<Complex(Complex, Complex)>& func, bool smooth_color) {
    auto start = std::chrono::steady_clock::now();
    getNumberIterations(fract, iter_max, colors, func);
    auto end = std::chrono::steady_clock::now();
    std::cout << "time to generate "
              << " = "
              << std::chrono::duration<double, std::milli>(end - start).count()
              << " [ms]" << std::endl;
    return plot(colors, iter_max, smooth_color);
}

Fract::window<double> Fract::mandelbrot(int x1, int y1, int x2, int y2,
                                        const int max_iter) {
    window<double> fract(x1, x2, y1, y2);
    //! @attention the function used to calculate the fractal
    auto func = [](Complex z, Complex c) -> Complex {
        return Complex(cos(45), cos(30)) * z * z + c;
    };
    string histname_pr = "mandelbrot.fhistory";
    cv::Mat lastOut;
    for (int i = 0; i < 100; ++i) {
        bool smooth_color = true;
        std::vector<int> colors(scr.size());
        cv::Rect targetBbox;

        double curx1(fract.x_min()), curx2(fract.x_max()), cury1(fract.y_min()),
            cury2(fract.y_max());
        double newx1(fract.x_min()), newx2(fract.x_max()), newy1(fract.y_min()),
            newy2(fract.y_max());
        if (targetBbox.area() > 0) {
            double diff_x1_img_coords = targetBbox.x;
            double diff_x2_img_coords = targetBbox.x + targetBbox.width;
            double diff_y1_img_coords = targetBbox.y;
            double diff_y2_img_coords = targetBbox.y + targetBbox.height;
            double ratio_def_scr_w = fract.width() / scr.width();
            double ratio_def_scr_h = fract.height() / scr.height();
            newx1 = curx1 + diff_x1_img_coords * ratio_def_scr_w;
            newx2 = curx1 + diff_x2_img_coords * ratio_def_scr_w;
            newy1 = cury1 + diff_y1_img_coords * ratio_def_scr_h;
            newy2 = cury1 + diff_y2_img_coords * ratio_def_scr_h;
        }
        fract.zoom(1.0, newx1, newx2, newy1, newy2);
        cout << "HISTORY" << endl;
        std::vector<std::string> str_history;
        lastOut = computeFractal(fract, max_iter, colors, func, smooth_color);
    }
}

std::tuple<int, int, int> get_rgb_piecewise_linear(int n, int iter_max) {
    int N = 256; // colors per element
    int N3 = N * N * N;
    // map n on the 0..1 interval (real numbers)
    double t = (double)n / (double)iter_max;
    // expand n on the 0 .. 256^3 interval (integers)
    n = (int)(t * (double)N3);
    int b = n / (N * N);
    int nn = n - b * N * N;
    int r = nn / N;
    int g = nn - r * N;
    return std::tuple<int, int, int>(r, g, b);
}

std::tuple<int, int, int> get_rgb_smooth(int n, int iter_max) {
    // map n on the 0..1 interval
    double t = (double)n / (double)iter_max;
    // Use smooth polynomials for r, g, b
    // int b = (int)(4*(1-t)*255);
    // int r = (int)(15*(1-t)*(1-t)*t*t*255);
    // int g =  (int)(8.5*(1-t)*(1-t)*t*255);

    int r = (int)(4 * (1 - t * t) * t * 255);
    int g = (int)(15 * (1 - t) * (1 - t) * t * t * 255);
    // // int g = (int)(7*(1-t*t)*t*t*255);
    int b = (int)(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255);
    // // int b =  (int)(8.5*(1-t)*(1-t)*t*255);
    return std::tuple<int, int, int>(r, g, b);
}

cv::Mat Fract::plot(std::vector<int>& colors, int iter_max, bool smooth_color) {
    unsigned int width = scr.width(), height = scr.height();
    cv::Mat bitmap(width, height, CV_8UC3);
    int k = 0;
    std::tuple<int, int, int> rgb;
    for (int i = scr.y_min(); i < scr.y_max(); ++i) {
        for (int j = scr.x_min(); j < scr.x_max(); ++j) {
            int n = colors[k];
            if (!smooth_color) {
                rgb = get_rgb_piecewise_linear(n, iter_max);
            } else {
                rgb = get_rgb_smooth(n, iter_max);
            }
            // or revert indxs?
            cv::Scalar col_bgr{
                std::get<0>(rgb),
                std::get<1>(rgb),
                std::get<2>(rgb),
            };

            cv::circle(bitmap, {j, i}, 1, col_bgr, 1);
            k++;
        }
    }
    return bitmap;
}
