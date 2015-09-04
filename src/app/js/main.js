var angular = require("angular");
// var $ = require("jquery");
var path = require('path');

// require("./autocomplete.dir.js");

var  app = angular.module('app',[]);

require("./dir.controller.js")(app);


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
