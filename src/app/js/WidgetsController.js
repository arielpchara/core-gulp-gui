var fs = _require('fs');
var path = _require('path');
var xml = _require('xml2js');

module.exports = function(app) {

    app.factory('WidgetsDir', function($q) {
        return function(directory, cache) {
            cache = cache || false;
            var deferred = $q.defer();
            var cacheFilename = './cache/widgets.json';

            if (cache) {
                try {
                    fs.readFile(cacheFilename, function(err, file) {
                        deferred.resolve(file);
                    });
                    return deferred.promise;
                } catch (e) {}
            }

            try {
                var parser = new xml.Parser();
                var files = fs.readdirSync(directory);
                var getManifest = [];
                files.forEach(function(name) {
                    var manifest = path.join(directory, name, 'manifest.xml');
                    try {
                        if (fs.statSync(manifest).isFile()) {
                            var parseXmlDeferred = $q.defer();
                            fs.readFile(manifest, function(err, content) {
                                parser.parseString(content, function(err, parsed) {
                                    try {
                                        parseXmlDeferred.resolve(parsed.package.widgets[0].widget[0].$);
                                    } catch (e) {
                                        console.error('parametro inconsistente ' + name + '.\n', e);
                                        parseXmlDeferred.resolve(null);
                                    }
                                });
                            });
                            getManifest.push(parseXmlDeferred.promise);
                        }
                    } catch (err) {
                        console.error('não foi possivel ler o manifesto do ' + name + '.\n', err);
                    }
                });
                $q.all(getManifest)
                    .then(function(manifest) {
                        deferred.resolve(manifest);
                        fs.writeFile(cacheFilename, manifest);
                    });
            } catch (err) {
                console.error('não foi possivel ler o diretório\n', err);
            }
            return deferred.promise;
        };
    });

    app.controller('WidgetsController', ['$scope', 'WidgetsDir', function($scope, WidgetsDir) {

        $scope.widgets = [];

        $scope.refresh = function() {
            WidgetsDir(localStorage.config_path).then(function(resp) {
                $scope.widgets = resp;
            });
        };

        $scope.refresh();

    }]);

    app.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .otherwise({
                templateUrl: 'widgets.html',
                controller: 'WidgetsController'
            });
    });

};
