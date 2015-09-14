var fs = _require('fs');
var path = _require('path');
var xml = _require('xml2js');
var child_process = _require('child_process');
var _ = require('lodash');

module.exports = function(app) {

    app.factory('WidgetsDir', function($q) {
        return function(directory, cache) {
            cache = cache || false;
            var deferred = $q.defer();
            var cacheFilename = './cache/widgets.json';

            // if (cache) {
            //     try {
            //         fs.readFile(cacheFilename, function(err, file) {
            //             deferred.resolve(file);
            //         });
            //         return deferred.promise;
            //     } catch (e) {}
            // }

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
                                        var plain = _.values(parsed.package.widgets[0].widget[0].$).join(' ');
                                        var widgetProps = angular.extend(parsed.package.widgets[0].widget[0].$,{
                                            'path': path.join(directory, name),
                                            'plain': plain,
                                            'gulpfile': false
                                        });
                                        try {
                                            var gulpfile = path.join(directory, name, 'gulpfile.js');
                                            if( fs.statSync(gulpfile).isFile() ){
                                                widgetProps.gulpfile = gulpfile;
                                            }
                                        } catch (e) {}
                                        parseXmlDeferred.resolve( widgetProps );
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
                        // fs.writeFile(cacheFilename, manifest);
                    });
            } catch (err) {
                console.error('não foi possivel ler o diretório\n', err);
            }
            return deferred.promise;
        };
    });

    app.controller('WidgetsController', ['$scope', 'WidgetsDir', '$q', function($scope, WidgetsDir, $q) {

        $scope.widgets = [];

        $scope.refresh = function() {
            WidgetsDir(localStorage.config_path).then(function(resp) {
                $scope.widgets = resp;
            });
        };

        $scope.open = function (path,cmd) {
            $q(function (resolve, reject) {
                if ( cmd !== undefined ) {
                    reject(null);
                }else{
                    child_process.execFile(localStorage.config_editor_exec,[path],{cwd:path},function (err) {
                        if (err) {
                            reject(err);
                        }
                    });
                }
            }).catch(function (err) {
                cmd = cmd || localStorage.config_editor_exec+" %cd%" || 'start /D %cd% cmd';
                // cmd = [cmd,path].join(' ');
                child_process.exec(cmd,{cwd:path},function (err) {
                    console.error(err);
                });
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
