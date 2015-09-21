var fs = _require('fs');
var path = _require('path');
var xml = require('xml2js');
var child_process = _require('child_process');
var _ = require('lodash');

module.exports = function(app) {

    require('./WidgetViewController.js')(app);

    app.factory('WidgetsDir', function($q) {
        return function(directory, cache) {
            var deferred = $q.defer();
            if ( !cache && app.db('widgets').size() > 0 ) {
                try {
                    deferred.resolve( app.db('widgets').toJSON() );
                    return deferred.promise;
                } catch (e) {}
            }

            // Reset nos widgets do cache
            app.db.object.widgets = [];
            app.db.save();

            try {
                var parser = new xml.Parser();
                var files = fs.readdirSync(directory);
                var getManifest = [];
                var widgets = app.db('widgets');
                files.forEach(function(name, i) {
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
                                            'gulpfile': false,
                                            'package':{}
                                        });
                                        try {
                                            widgetProps.gulpfile = fs.statSync( path.join(directory, name, 'gulpfile.js') ).isFile();
                                        } catch (e) {
                                            // console.error('gulpfile',e);
                                        }
                                        try {
                                            widgetProps.package = _require( path.join(directory, name, 'package.json') );
                                        } catch (e) {
                                            // console.error('package',e);
                                        }
                                        widgets.push(widgetProps);
                                        parseXmlDeferred.resolve( widgetProps );
                                    } catch (e) {
                                        // console.error('parametro inconsistente no manifest.xml' + name + '.', e);
                                        parseXmlDeferred.resolve(null);
                                    }
                                });
                            });
                            getManifest.push(parseXmlDeferred.promise);
                        }
                    } catch (err) {
                        // console.error('não foi possivel ler o manifesto do ' + name + '.\n', err);
                    }
                });
                $q.all(getManifest)
                    .catch(function (err) {
                        console.error(err);
                    })
                    .then(function(manifest) {
                        deferred.resolve(manifest.filter(function (w) {
                            return typeof w === 'object' && w !== null;
                        }));
                        app.db.save();
                    });
            } catch (err) {
                console.error('não foi possivel ler o diretório\n', err);
            }
            return deferred.promise;
        };
    });

    app.controller('WidgetsController', function($scope, $rootScope, WidgetsDir, $q, updateXMLonServer) {

        var configs = app.db('configs');

        $scope.term = '';
        $scope.regex = '';
        $scope.widgets = [];
        $scope.loading = false;

        $scope.terminal_exec = configs.get('terminal_exec');

        $scope.refresh = function(cache) {
            $scope.loading = true;
            WidgetsDir(configs.get('path'),cache).then(function(resp) {
                $scope.widgets = resp;
                $scope.loading = false;
            });
        };

        $scope.open = function (path,cmd) {
            $q(function (resolve, reject) {
                if ( cmd !== undefined ) {
                    reject(null);
                }else{
                    child_process.execFile(configs.get('editor_exec'),[path],{cwd:path},function (err) {
                        if (err) {
                            reject(err);
                        }
                    });
                }
            }).catch(function (err) {
                cmd = cmd || configs.get('editor_exec') || 'start /D %cd% cmd';
                // cmd = [cmd,path].join(' ');
                child_process.exec(cmd,{cwd:path},function (err) {
                    console.error(err);
                });
            });
        };

        $scope.updateXMLonServer = function (widget) {
            updateXMLonServer(widget);
        };

        $scope.filterTerm = function (widget) {
            if(!widget )
                return false;
            if( $scope.term.length === 0 )
                return true;

            var terms = $scope.term.split(' ');
            $scope.regex = _(terms).map(function (t) {
                return "(?=.*"+t+")";
            }).join('') + '.+';
            var regex = new RegExp( $scope.regex ,'gi');
            return regex.test(widget.plain);
        };
        $scope.refresh();

    });

    app.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .otherwise({
                templateUrl: 'widgets.html',
                controller: 'WidgetsController'
            });
    });

};
