var path = require("path");
var CommonsChunkPlugin = require("../../node_modules/webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
    entry: {
        entry1: './content/js/entry/entry1.js'
    },
    output: {
        path: "./content/js/build",
        filename: '[name].bundle.js'
    },
    plugins: [
        new CommonsChunkPlugin('common.js')
    ]
};
