var angular = require('angular');
var name = 'progress';

angular.module(name, [])
    .directive('progress', function() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                scope.$on('progress', function(e, p) {
                    console.log(p);
                    element.css('width', p+'%');
                    scope.$digest();
                });
            }
        };
    })
    .directive('progressValue', function() {
        return {
            restrict: 'E',
            link: function(scope, element) {
                scope.$on('progress', function(e, p) {
                    element.html(Math.ceil(p)+'%');
                    scope.$digest();
                });
            }
        };
    });

module.exports = name;
