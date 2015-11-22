var webpack = require('webpack');

var path = require("path");

module.exports = {
    entry: {
        app: ['./src/js/entry1.js']
    },
    output: {
        path: path.resolve(__dirname, "./asset/"),
        publicPath: "/asset/",
        filename: "bundle.js",
        //sourceMapFilename: "[file].map"
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: "style!css"
        }, {
            test: /\.json$/,
            loader: 'json'
        }, ]
    },
    //devtool: 'source-map',
    plugins: [
        //使用丑化js插件
        new webpack.optimize.UglifyJsPlugin({
            //minimize: true,
            compress: {
                warnings: false
            },
            // mangle: false
            mangle: {
                except: ['angular', '$', 'exports', 'require']
            }
        }),
    ]
};
