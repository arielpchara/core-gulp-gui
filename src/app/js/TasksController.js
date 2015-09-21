
module.exports = function(app) {
    app.controller('TasksController', function($scope) {});

    app.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/tasks', {
                templateUrl: 'tasks.html',
                controller: 'TasksController'
            })
            .when('/tasks/new', {
                templateUrl: 'tasks-form.html',
                controller: 'TasksController'
            });
    });
};
