var cp = _require('child_process');
var fs = _require('fs');
var path = _require('path');



module.exports = function(app) {

    app.controller('GulpController', function($scope, $sce) {
        
        var gulpfile = $scope.gulpfile = {
            name: path.join('.',localStorage.config_path,localStorage.config_gulpfile),
            tasks: []
        };

        fs.readFile( gulpfile.name , function (err, data) {
            if (err) throw err;

            gulpfile.tasks = data.toString().match(/((task\(\')(\w+))(?=\')/gi).map(function (task) {
                return task.replace(/(task\(\')/gi,'');
            });

            $scope.$digest();
        });

        $scope.logs = [];

        $scope.path = localStorage.config_path;


        $scope.run = function (task, obj) {
            task = task || '';
            console.log(obj);
            var gulp = cp.exec( ['gulp --color',task].join(' ') , {
                cwd: $scope.path
            });

            gulp.on('error', function(err) {
                console.error(err);
            });

            gulp.stdout.on('data', function(data) {
                console.log(data);
            });
        };

    });


    app.config(function($routeProvider) {
        $routeProvider
            .when('/gulp', {
                templateUrl: 'gulp.html',
                controller: 'GulpController'
            });
    });

};
