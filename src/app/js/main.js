var angular = require("angular");

var ngRoute = require("angular-route");

var path = require('path');

var app = angular.module('app',['ngRoute']);

require("./WidgetsController.js")(app);
require("./TasksController.js")(app);
require("./ConfigsController.js")(app);

require("./routes.js")(app);


app.directive('webkitdirectory',function () {
  return {
    link: function (scope,ele) {
      ele.on('change',function (e) {
        scope.directory = this.value;//.match(/.*[\\\/]/gi)[0];
        localStorage.widgetPath = scope.directory;
        scope.$digest();
      });
    }
  };
});
