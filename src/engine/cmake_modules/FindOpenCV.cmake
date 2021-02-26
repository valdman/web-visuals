# Needed for opencv2/opencv.hpp
include_directories( ${OpenCV_SOURCE_DIR}/include )

# Needed by opencv.hpp for opencv2/opencv_modules.hpp
include_directories( ${OpenCV_BINARY_DIR} )

set(OpenCV_BIN_MODULES_PATH ${OpenCV_BINARY_DIR}/modules/*/include)
# Needed by opencv_modules.hpp for every module
file( GLOB OpenCV_INCLUDE_MODULES ${OpenCV_BIN_MODULES_PATH} )
include_directories( ${OpenCV_INCLUDE_MODULES} )

set(OpenCV_BIN_LIBS_PATH ${OpenCV_BINARY_DIR}/lib/*.a)
# Link to opencv.js precompiled libraries
file( GLOB OpenCV_LIBS ${OpenCV_BIN_LIBS_PATH} )

message(WARNING ${OpenCV_LIBS})
target_link_libraries(${OpenCV_LIBS})
