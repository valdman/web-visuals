import path from 'path';
import yargs from 'yargs';
import {Configuration} from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const mode = <'production' | 'development'>(yargs.argv.mode || 'production');

const isProduction = String(mode).toUpperCase() !== 'DEVELOPMENT';

function getRules({target}: {target: 'client' | 'server'}) {
    const isBrowser = target !== 'server';

    // It enables modeule resolution with 'index.desktop', 'index.touch', 'client', 'server' for .ts(x) and .css
    const platformFilenames = ['index'];

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
        {
            test: /\.wasm$/,
            use: 'wasm-loader',
        },
    ].filter(Boolean);
}

const commonSettings: Configuration = {
    mode,
    devtool: isProduction ? false : 'source-map',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/'),
            engines: path.resolve(__dirname, 'engines/'),
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

const webappConfig: Configuration = {
    ...commonSettings,
    name: 'webapp',
    target: ['web', 'es2020'],
    entry: './src/web/index.ts',
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
                    from: 'engines',
                    to: '.',
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

export default [webappConfig];
