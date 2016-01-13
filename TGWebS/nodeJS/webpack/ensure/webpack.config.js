module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "[name].bundle.js",
        chunkFilename: "[name].chunk.js"
    }
};