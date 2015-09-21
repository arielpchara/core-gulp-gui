
var ngFilters = angular.module('ngFilters',['ng']);

ngFilters.filter('default',function () {
    return function (input, value) {
        if( value && input === "" ){
            return value;
        }
        return input;
    };
});

module.exports = 'ngFilters';
