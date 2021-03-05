#include <opencv2/core/mat.hpp>
#include <opencv2/imgcodecs.hpp>
#include <opencv2/opencv.hpp>

#include "mandelbrot.cpp"

using namespace cv;

class Process {
  private:
    std::vector<unsigned char> buffer;
    Mat decoded;

  public:
    Process() : buffer{}, decoded{} {};

    Mat randarr(int width, int height) {
        Mat img(width, height, CV_8UC4);
        randu(img, Scalar(0, 0, 0, 255), Scalar(255, 255, 255, 255));

        return img;
    }

    Mat blackImage(int width, int height) {
        Mat image(width, height, CV_8UC4, Scalar(0, 0, 0));
        return image;
    }

    Mat mand(int width, int height) {
        auto I = generateImage(width, height);
        std::cout << "Generated" << std::endl;
        cvtColor(I, I, COLOR_GRAY2RGBA);
        std::cout << "Copied" << std::endl;
        return I;
    }
};

int main() {
    Process process{};
    imshow("Mandelbrot set", process.mand(800, 600));
    waitKey();
}