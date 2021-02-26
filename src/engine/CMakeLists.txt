cmake_minimum_required(VERSION 3.12)
set( CMAKE_CXX_STANDARD 11 )
cmake_policy(SET CMP0015 NEW)

# cmake -DCMAKE_BUILD_TYPE=Release
project(fractal-engine)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY engines/fractal)

# OpenCV
set(OpenCV_SOURCE_DIR /Users/mghead/lib/opencv)
if(EMSCRIPTEN)
    set(OpenCV_BINARY_DIR /Users/mghead/bin/opencv/build_wasm)
else()
    set(OpenCV_BINARY_DIR /Users/mghead/lib/opencv/build_native)
endif()

# include( ${CMAKE_CURRENT_SOURCE_DIR}/cmake_modules/FindOpenCV.cmake )

# Emscripten compiler conf
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

    include( ${CMAKE_CURRENT_SOURCE_DIR}/cmake_modules/FindEmscripten.cmake )
endif()

add_executable(fractal-engine ${CMAKE_CURRENT_SOURCE_DIR}/main.cpp)
