module.exports = function(app) {
    app.controller('ConfigsController', function($scope) {

        $scope.path = localStorage.config_path || '';
        $scope.gulpfile = localStorage.config_gulpfile || '';

        $scope.$watch('path',function () {
            localStorage.config_path = $scope.path;
        });

        $scope.$watch('gulpfile',function () {
            localStorage.config_gulpfile = $scope.gulpfile;
        });

        $scope.$on('webkitdirectory.change',function (e, path) {
            console.log(path);
            $scope.path = path;
            $scope.$digest();
        });

    });

    app.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/config', {
                templateUrl: 'configs.html',
                controller: 'ConfigsController'
            });
    });

};
