module.exports = function(app) {

    app.controller('ConfigsController', function($scope) {

        var configs = app.db('configs');

        $scope.path = configs.get('path') || '';
        $scope.gulpfile = configs.get('gulpfile') || '';
        $scope.editor_exec = configs.get('editor_exec') || 'atom';
        $scope.terminal_exec = configs.get('terminal_exec') || 'start /D %cd% cmd';

        //"C:\Program Files\ConEmu\ConEmu64.exe" "/here" /dir "%cd%" /cmd {{Shells::cmd}}

        $scope.$watch('path',function () {
            configs.set('path',$scope.path);
        });

        $scope.$watch('gulpfile',function () {
            configs.set('gulpfile',$scope.gulpfile);
        });

        $scope.$watch('editor_exec',function () {
            configs.set('editor_exec',$scope.editor_exec);
        });

        $scope.$watch('terminal_exec',function () {
            configs.set('terminal_exec',$scope.terminal_exec);
        });

        $scope.$watchGroup(['path','editor_exec','terminal_exec','gulpfile'],function () {
            app.db.save();
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
