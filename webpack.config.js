const { debug } = require("console");
const path = require("path");
const webpack = require("webpack");
const fs = require("fs");

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter((x) => ['bin'].indexOf(x) === -1)
    .forEach((mod) => nodeModules[mod] = 'commonjs ' + mod)

module.exports = {
    mode: 'production',
    entry: './src/Runner.ts',
    target: "node",
    module: {
        rules: [{
            test: /\.ts?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },],
    },
    optimization: {
        minimize: true
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.ts', '.json'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    externals: nodeModules
}