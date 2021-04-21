import path from 'path';
import dotenv from 'dotenv';
import yargs from 'yargs';
import {Configuration, ContextReplacementPlugin, DefinePlugin, ProvidePlugin} from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const dotenvConfig = dotenv.config({
    path: path.join(__dirname, '.env'),
}).parsed;
const env = {
    ...process.env,
    ...dotenvConfig,
};

const mode = <'production' | 'development'>(yargs.argv.mode || 'production');

const isProduction = String(mode).toUpperCase() !== 'DEVELOPMENT';

function getRules({target}: {target: 'client' | 'server'}) {
    const isBrowser = target !== 'server';

    // It enables modeule resolution with 'index.desktop', 'index.touch', 'client', 'server' for .ts(x) and .css
    const platformFilenames = [target, 'index'];

    return [
        isBrowser && {
            // Removes controllers from client bundle
            test: /controller.ts$/,
            use: 'null-loader',
        },
        !isBrowser && {
            // Removes epics from server bundle
            test: /epics/,
            use: 'null-loader',
        },
        {
            test: /\.tsx?$/,
            use: [
                {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.json',
                    },
                },
            ],
            resolve: {
                mainFiles: platformFilenames,
            },
        },
        {
            test: /\.svg$/,
            use: '@svgr/webpack',
        },
        {
            test: /\.(png|jpe?g|gif|ico)$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name]-[hash].[ext]',
                        outputPath: '/images',
                        publicPath: '/static/images',
                    },
                },
            ],
        },
        {
            test: /\.css$/,
            resolve: {
                mainFiles: platformFilenames,
            },
            use: [
                isBrowser && MiniCssExtractPlugin.loader,
                {
                    loader: '@teamsupercell/typings-for-css-modules-loader',
                    options: {
                        formatter: 'prettier',
                        disableLocalsExport: true,
                    },
                },
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            exportOnlyLocals: !isBrowser,
                            localIdentName: '[local]--[hash:base64:5]',
                            localIdentContext: path.resolve(__dirname, 'src'),
                        },
                        importLoaders: 1,
                        sourceMap: true,
                    },
                },
            ].filter(Boolean),
        },
    ].filter(Boolean);
}

const commonSettings: Configuration = {
    mode,
    devtool: isProduction ? false : 'source-map',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/'),
            wasm: path.resolve(__dirname, 'build_wasm/engines/'),
        },
        extensions: ['.tsx', '.ts', '.js', '.css'],
        fallback: [
            {
                name: 'path',
                alias: require.resolve('path-browserify'),
            },
        ],
    },
};

const serverConfig: Configuration = {
    ...commonSettings,
    name: 'server',
    entry: './src/web/server/index.ts',
    target: 'node14',
    module: {
        rules: getRules({target: 'server'}),
    },
    plugins: [
        new DefinePlugin({
            // # Hack to avoid warnings in 'formidable' peer dependency
            'global.GENTLY': false,
            'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
            'process.env.PORT': JSON.stringify(env.PORT),
            'process.env.SESSION_SECRET': JSON.stringify(env.SESSION_SECRET),
        }),
        new ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/web/assets',
                    to: 'assets',
                },
            ],
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new ContextReplacementPlugin(/^\.$/, function (context: any): void {
            if (/\/node_modules\/express\/lib/.test(context.context)) {
                //ensure we're only doing this for modules we know about
                context.regExp = /this_should_never_exist/;
                for (const d of context.dependencies) {
                    if (d.critical) d.critical = false;
                }
            }
        }),
    ],
    node: {
        __dirname: false,
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
};

const cliConfig: Configuration = {
    ...commonSettings,
    name: 'cli',
    entry: {
        mandelbrot: './src/cli/mandelbrot.ts',
    },
    target: 'node14',
    module: {
        rules: getRules({target: 'server'}),
    },
    plugins: [
        new ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    node: {
        __dirname: false,
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist', 'cli'),
    },
};

const webappConfig: Configuration = {
    ...commonSettings,
    name: 'webapp',
    target: ['web', 'es2020'],
    entry: {
        MandelbrotPage: './src/web/pages/MandelbrotPage/index.ts',
    },
    module: {
        rules: getRules({target: 'client'}),
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/web/index.html',
                    to: '.',
                },
                {
                    from: 'build_wasm/engines/**/*',
                    filter(resourcePath: string) {
                        const copyExtenstions = ['.wasm', '.wasm.map'];
                        return copyExtenstions.some((ext) => resourcePath.endsWith(ext));
                    },
                    to: 'static/[name].[ext]',
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new NodePolyfillPlugin(),
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist', 'webapp'),
    },
};

export default [cliConfig, serverConfig, webappConfig];
