cmake_minimum_required(VERSION 3.12)
set( CMAKE_CXX_STANDARD 11 )
cmake_policy(SET CMP0015 NEW)

project(fractal-engine)

# OpenCV
set(OpenCV_DIR /Users/mghead/lib/opencv)
set(CMAKE_MODULE_PATH ${CMAKE_CURRENT_SOURCE_DIR}/cmake_modules/FindOpenCV.cmake)
message(AUTHOR_WARNING ${CMAKE_MODULE_PATH})
FIND_PACKAGE(OpenCV REQUIRED core highgui imgproc)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY engines/fractal)

target_link_libraries(fractal-engine ${OpenCV_LIBS})
add_executable(fractal-engine ${CMAKE_CURRENT_SOURCE_DIR}/main.cpp )


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

    set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} ${CMAKE_CURRENT_SOURCE_DIR}/cmake_modules/FindEmscripten.cmake )
endif()
