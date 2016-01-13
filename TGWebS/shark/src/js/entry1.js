require("!style!css!../css/base.css");
require("!style!css!../css/common.css");
require("./controllers/mainCtrl");
require("./controllers/loginCtrl");

//º”‘ÿangular app
var app = require("./com/app.js");

//≥ı ºªØangular
angular.bootstrap(document, ['cashApp']);
