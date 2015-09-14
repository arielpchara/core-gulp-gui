module.exports = function(app) {

    app.controller('ConfigsController', function($scope) {

        $scope.path = localStorage.config_path || '';
        $scope.gulpfile = localStorage.config_gulpfile || '';
        $scope.editor_exec = localStorage.config_editor_exec || 'atom';

        $scope.$watch('path',function () {
            localStorage.config_path = $scope.path;
        });

        $scope.$watch('gulpfile',function () {
            localStorage.config_gulpfile = $scope.gulpfile;
        });

        $scope.$watch('editor_exec',function () {
            localStorage.config_editor_exec = $scope.editor_exec;
        });

        $scope.$on('webkitdirectory.change',function (e, path) {
            $scope.path = path;
            $scope.$digest();
        });

        $scope.$on('fileselector.change',function (e, path) {
            $scope.editor_exec = path;
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
