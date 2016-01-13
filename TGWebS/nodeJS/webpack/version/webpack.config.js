
//所有代码块添加hash
module.exports = {
    entry: "./entry.js",
    output: {
        path: "assets/[hash]/",
        publicPath: "assets/[hash]/",
        filename: "bundle.js"
    }
};

////单个代码块添加hash
//module.exports = {
//    entry: "./entry.js",
//    output: {
//        path: "build/",
//        publicPath: "build/",
//        chunkFilename: "[id].[hash].bundle.js",
//        filename: "output.[hash].bundle.js",
//    }
//};