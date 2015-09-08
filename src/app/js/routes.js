module.exports = function(app) {

    app.config(function($routeProvider,$locationProvider) {

      $routeProvider
      .when('/tasks', {
        templateUrl: 'tasks.html',
        controller: 'TasksController'
      })
      .when('/config', {
        templateUrl: 'configs.html',
        controller: 'ConfigsController'
      })
      .otherwise({
        templateUrl: 'widgets.html',
        controller: 'WidgetsController'
      });

      // configure html5 to get links working on jsfiddle
    //   $locationProvider.html5Mode({
    //       enabled: true,
    //       requireBase: false
    //   });

    });


};
