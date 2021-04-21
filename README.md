# Prerequisites
## Install Node JS
 1. Install `nvm` (https://github.com/nvm-sh/nvm#installing-and-updating)
 2. `nvm install latest && nvm use latest && nvm alias default latest`
 3. Test: `node -v`

## Install yarn (Do not use sudo 😁)
 `npx i -g yarn`

# Build
1. Enter repo directory
2. Install packages `yarn`
3. `yarn build:watch` to run build in watch mode
4. `yarn dev` to run and update dev http server

#### Scripts & Dependencies are listed in package.json
#### To debug server code use 'Attach to process' from ./.vscode/launch.json