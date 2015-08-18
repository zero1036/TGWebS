var path = require("path");
var CommonsChunkPlugin = require("../node_modules/webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
    entry: {
        m1: './m1.js',
        m2: './m2.js'
    },
    output: {
        path: "build",
        filename: '[name].bundle.js'
    },
    plugins: [
        new CommonsChunkPlugin('common.js')
    ]
};
