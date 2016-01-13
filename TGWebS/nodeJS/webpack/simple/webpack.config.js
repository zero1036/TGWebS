
var UglifyJsPlugin = require("../../node_modules/webpack/lib/optimize/UglifyJsPlugin");

module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    plugins: [
        //使用丑化js插件
        //new UglifyJsPlugin({
        //    compress: {
        //        warnings: false
        //    }
        //})
    ]
};