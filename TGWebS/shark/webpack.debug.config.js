var webpack = require('webpack');
var net = require('./server.config');
var url = "http://" + net.ip + ":" + net.port;

var path = require("path");
module.exports = {
    entry: {
        app: [
            'webpack-dev-server/client?' + url,
            'webpack/hot/dev-server',
            './src/js/entry1.js'
        ]
    },
    output: {
        path: path.resolve(__dirname, "./asset/"),
        publicPath: "/asset/",
        filename: "bundle.js",
        sourceMapFilename: "[file].map"
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
    devtool: 'source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};
