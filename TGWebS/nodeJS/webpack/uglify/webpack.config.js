
var UglifyJsPlugin = require("../../node_modules/webpack/lib/optimize/UglifyJsPlugin");

module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js",
    },
    plugins: [
        //使用丑化js插件
        new UglifyJsPlugin({
            compress: {
                warnings: false
            },
            mangle: {
                except: ['$scope', '$']
            }
        })
    ]
};