var path        = require('path');
var webpack     = require('webpack');

var livereload  = require('webpack-livereload-plugin');

const BUILD_DIR = path.resolve(__dirname, 'public/assets/js');
const APP_DIR = path.resolve(__dirname, 'src/client');
const STYLE_DIR = path.resolve(__dirname, 'public/assets/styles');

module.exports = {
    entry: [APP_DIR + '/index.jsx'],
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test : /\.jsx?/,
                include : APP_DIR,
                loader : 'babel'
            },
            {
                test:/\.scss$/,
                include: APP_DIR,
                loaders: ['style', 'css', 'sass']
            },
            { test: /\.(woff|woff2)$/,  loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.ttf$/,    loader: "file-loader" },
            { test: /\.eot$/,    loader: "file-loader" },
            { test: /\.svg$/,    loader: "file-loader" }

        ]
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.scss']
    },
    plugins: [
        new livereload({
            appendScriptTag: true
        })
    ]
};
