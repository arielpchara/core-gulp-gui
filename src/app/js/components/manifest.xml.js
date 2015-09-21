var angular = require('angular');
var sql = _require('mssql');

angular.module('manifestXml',[])
    .factory('updateXMLonServer',function ($q) {
        var connection = new sql.Connection({
            server: "sql1.core.local\\SQL2008",
            user: "sa",
            password: "ezsql",
            database: "ezstore_pchara"
        }, function (err) {});

        return function (manifest) {
            var deferred = $q.defer();
            var request = new sql.Request(connection);
            try {
                fs.readFile(manifest,function (data) {
                    request.query("exec pSetWidgetFromXML '"+data+"'",function (err, recordset) {
                        if(err) deferred.reject('query/connection error '+err);
                        deferred.resolve(recordset);
                    });
                });
            } catch (err) {
                deferred.reject('readFile error '+err);
            }
            return deferred.promise;
        };

    });


module.exports = 'manifest.xml';
