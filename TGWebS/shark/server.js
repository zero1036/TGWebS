﻿var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.debug.config');
var net = require('./server.config');

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true
}).listen(net.port, net.ip, function (err, result) {
    if (err) console.log(err);
    console.log('Listening at ' + net.ip);
});