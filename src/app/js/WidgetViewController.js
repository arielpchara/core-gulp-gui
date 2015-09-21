
module.exports = function(app) {

    app.controller('WidgetViewController', function($scope,$routeParams) {
        $scope.widget = app.db('widgets').find({folder:$routeParams.folder});
    });

    app.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/widget/:folder', {
                templateUrl: 'widget-view.html',
                controller: 'WidgetViewController'
            });
    });
};
