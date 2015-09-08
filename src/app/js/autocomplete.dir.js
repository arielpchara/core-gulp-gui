//funciona somente dentro do NW
var path = require('path');

angular.module('autocompleteDir',[])
  .directive('autocomplereDir',function () {
    return  {
      link: function (scope, element, attr) {
        console.log(scope);
        element.on('keyup',function () {
          var srcpath = this.value;
          var input = this;
          var listPath = this.value.split(path.sep);
          console.log(listPath,path.sep);
          if( scope.directories.indexOf(listPath[ listPath.length-1 ]) >= 0 ||  scope.directories.length === 0 ){
            scope.directories = fs.readdirSync(srcpath);
            scope.directories = scope.directories.filter(function(file) {
              return fs.statSync(path.join(srcpath, file)).isDirectory();
            })
            .map(function(file) {
              console.log('map',path.join(srcpath, file));
              return path.join(srcpath, file);
            });
          }
          scope.$digest();
        });
      }
    };
  });
