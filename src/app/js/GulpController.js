var spawn = _require('child_process').spawn;
var Convert = _require('ansi-to-html');
var convert = new Convert();

module.exports = function(app) {

  app.controller('GulpController', function($scope) {

    $scope.process = [];
console.log(__dirname);
    var gulp = spawn('gulp', ['--color'], {cwd:__dirname})
      .on('error', function( err, out, e ){
        console.log(err);
      });

      console.log(gulp.stdout);

    gulp.stdout.on('data', function (data) {
      console.log(data);
      $scope.process.push(convert.toHtml(data));
      console.log('stdout: ' + convert.toHtml(data));
    });


  });

};
