//var path = require("path");
//module.exports = {
//    entry: {
//        //main: ['webpack/hot/dev-server', './entry']
//        app: ["./entry.js"]
//    },
//    output: {
//        path: path.resolve(__dirname, "build"),
//        publicPath: "/assets/",
//        filename: "bundle.js"
//    }
//};
var webpack = require('webpack');

var path = require("path");
module.exports = {
    entry: {
        //main: ['webpack/hot/dev-server', './entry']
        app: ['webpack-dev-server/client?http://192.168.0.20:3000',
        'webpack/hot/dev-server',
        './m2.js']
    },
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "/assets/",
        filename: "bundle.js",
        sourceMapFilename: "[file].map"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    //devtool: 'source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};