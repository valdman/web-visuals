#include <cmath>
#include <complex>

int MAX_DEPTH = 80;

using cv::Mat;
using cv::Scalar;
using std::complex;

int mandelbrot(complex<double> point) {
    complex<double> z(0.0);
    int depth = 0;
    while (abs(z) <= 2 && (depth < MAX_DEPTH)) {
        z = z * z + point;
        depth += 1;
    }
    return depth;
}

complex<double> pixelToComplexPoint(int i, int j, int width, int height) {
    auto scale = 1;
    auto OxPixel = width / 2.0;
    auto OyPixel = height / 2.0;
    auto x = scale * (i - OxPixel);
    auto y = scale * (j - OyPixel);

    return complex<double>(x, y);
}

Mat generateImage(int width, int height) {
    Mat I(width, height, CV_8UC1, cv::Scalar(255));
    // accept only char type matrices
    CV_Assert(I.depth() == CV_8U);

    int channels = I.channels();

    int nRows = I.rows;
    int nCols = I.cols * channels;

    if (I.isContinuous()) {
        nCols *= nRows;
        nRows = 1;
    }

    int i, j;
    uchar* p;
    auto stopPrint = 80;
    for (i = 0; i < nRows; ++i) {
        p = I.ptr<uchar>(i);
        for (j = 0; j < nCols; ++j) {
            p[j] = mandelbrot(pixelToComplexPoint(i, j, width, height));
            if (--stopPrint > 0) {
                std::cout << static_cast<int>(p[j]) << std::endl;
            }
        }
    }
    return I;
}