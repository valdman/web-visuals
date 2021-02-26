cmake_minimum_required(VERSION 3.12)
set( CMAKE_CXX_STANDARD 11 )
cmake_policy(SET CMP0015 NEW)

project(fractal-engine)

if(EMSCRIPTEN)
    set(EMSCRIPTEN_PREFIX "/Users/mghead/lib/emsdk/upstream/emscripten")

    set(EMCC_ONLY_FORCED_STDLIBS 1)
    set(CMAKE_EXECUTABLE_SUFFIX ".js")
    set(CMAKE_CXX_FLAGS "-std=c++11 \
        -fno-exceptions \
        -s ENVIRONMENT=\"web\" \
        -s MODULARIZE=1 \
        -s ASSERTIONS=1 \
        -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
        -s EXPORTED_FUNCTIONS=[] \
        -s EXTRA_EXPORTED_RUNTIME_METHODS=['ccall','cwrap'] \
        -s DEMANGLE_SUPPORT=1 \
        -s ALLOW_MEMORY_GROWTH=1 \
        --no-entry \
        --bind \
        -g4 \
        --source-map-base /engines/fractal/ \
        "
    )

    include(${CMAKE_CURRENT_SOURCE_DIR}/Toolchain-Emscripten.cmake)
endif()

set(CMAKE_VERBOSE_MAKEFILE on)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY engines/fractal)

# # Does not work
# # find_package( OpenCV REQUIRED PATHS third-party/opencv-4.1.0/build_wasm NO_DEFAULT_PATH)

# # Needed for opencv2/opencv.hpp
# include_directories(third-party/opencv-4.1.0/include )

# # Needed by opencv.hpp for opencv2/opencv_modules.hpp
# include_directories(third-party/opencv-4.1.0/build_wasm )

# # Needed by opencv_modules.hpp for every module
# file( GLOB opencv_include_modules "third-party/opencv-4.1.0/modules/*/include" )
# include_directories(${opencv_include_modules} )

# # Link to opencv.js precompiled libraries
# file( GLOB opencv_js "third-party/opencv-4.1.0/build_wasm/lib/*.a" )
# target_link_libraries(hello ${opencv_js})


add_executable(fractal-engine ${CMAKE_CURRENT_SOURCE_DIR}/main.cpp)