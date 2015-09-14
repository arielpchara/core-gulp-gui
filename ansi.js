var spawn = require('child_process').spawn;
var Convert = require('ansi-to-html');
var convert = new Convert();


var gulp = spawn('gulp', ['--color'], {cwd: process.cwd()});

gulp.stdout.on('data', function (data) {
  console.log('stdout: ' + convert.toHtml(data));
});
