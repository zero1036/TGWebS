require("!style!css!../css/base.css");
require("!style!css!../css/common.css");
require("./controllers/mainCtrl");
require("./controllers/loginCtrl");

//����angular app
var app = require("./com/app.js");

//��ʼ��angular
angular.bootstrap(document, ['cashApp']);
