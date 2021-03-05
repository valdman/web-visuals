cmake_minimum_required(VERSION 3.12)
set( CMAKE_CXX_STANDARD 11 )
cmake_policy(SET CMP0015 NEW)

# cmake -DCMAKE_BUILD_TYPE=Release
project(fractal-engine)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY engines/fractal)
if(EMSCRIPTEN)
    add_executable(fractal-engine ${CMAKE_CURRENT_SOURCE_DIR}/main_web.cpp)
else()
    add_executable(fractal-engine ${CMAKE_CURRENT_SOURCE_DIR}/main_native.cpp)
endif(EMSCRIPTEN)

# OpenCV
if(EMSCRIPTEN)
    # Does not work
    # find_package( OpenCV REQUIRED PATHS third-party/opencv-4.1.0/build_wasm NO_DEFAULT_PATH)

    include_directories(/usr/local/include/opencv4)
    include_directories(/Users/mghead/bin/opencv/build_wasm)
    file(GLOB opencv_js "/Users/mghead/bin/opencv/build_wasm/lib/*.a")
    target_link_libraries(fractal-engine ${opencv_js})

else()
    set(OpenCV_DIR /usr/local/lib/cmake/opencv4)
    include_directories(/usr/local/include/opencv4)
    include_directories(/Users/mghead/bin/opencv/build_native)
    file(GLOB opencv_js "/Users/mghead/bin/opencv/build_native/lib/*.a")
    target_link_libraries(fractal-engine ${opencv_js})
endif(EMSCRIPTEN)

# Emscripten
if(EMSCRIPTEN)
    set(EMSCRIPTEN_PREFIX "/Users/mghead/lib/emsdk/upstream/emscripten")

    set(EMCC_ONLY_FORCED_STDLIBS 1)
    set(CMAKE_EXECUTABLE_SUFFIX ".js")
    set(CMAKE_CXX_FLAGS "-std=c++11 \
        -fexceptions \
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
        --source-map-base /static/ \
        "
    )

    include( ${CMAKE_CURRENT_SOURCE_DIR}/cmake_modules/FindEmscripten.cmake )
endif(EMSCRIPTEN)
