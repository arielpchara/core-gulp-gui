var angular = require("angular");
var ngRoute = require("angular-route");

var app = angular.module('app',['ngRoute']);

require("./WidgetsController.js")(app);
require("./TasksController.js")(app);
require("./ConfigsController.js")(app);

require("./directives/webkitdirectory.js")(app);
