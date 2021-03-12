#!/bin/sh

cd dist
npx nodemon -x "reset; node --inspect=5898 ."
