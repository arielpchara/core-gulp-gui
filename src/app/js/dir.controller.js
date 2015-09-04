var path = require('path');
var xml = require('xml2js');

module.exports = function (app) {

  var getMAnifest = function (dir,list) {
    var parser = new xml.Parser();
    var manifest = fs.readFileSync( path.join(dir,'manifest.xml') );
    if( manifest ){
      parser.parseString(manifest,function (err, parse) {
        list.push( parse.package.widgets[0].widget[0].$ );
      });
    }
  };

  var Widgets = function (directory, widgets) {
      try {
          fs.readdir(directory, function (err, files) {
            files.filter(function (file) {
                var widgetDir = path.join( directory , file );
                var stat = fs.statSync(widgetDir);
                if( stat.isDirectory() ){
                    getMAnifest(widgetDir,widgets);
                    return true;
                }
            });
          });
      } catch (err) {
          throw err;
      }
    };

  return app.controller('DirController',function ($scope) {
      $scope.directory = localStorage.widgetPath;
      $scope.widgets = localStorage.widgets;

      $scope.$watch('directory',function () {
        localStorage.widgetPath = $scope.directory;
        Widgets($scope.directory, $scope.widgets);
      });
      Widgets($scope.directory, $scope.widgets);
      // $scope.$watch('widgets',function () {
      //   console.log('widgets',$scope.widgets);
      // });
  });
};
