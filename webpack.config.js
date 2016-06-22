var webpack     = require('webpack');
var livereload  = require('webpack-livereload-plugin');
var path        = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public/assets/js');
const APP_DIR = path.resolve(__dirname, 'src/client');

var config = {
    entry: APP_DIR + '/index.jsx',
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
            }
        ]
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    plugins: [
        new livereload({appendScriptTag: true})
    ]
};

module.exports = config;
