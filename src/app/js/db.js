var low = _require('lowdb');
var path = _require('path');
var config = _require('./package.json').config;

module.exports = (function () {
    return low( path.join( global.process.env.USERPROFILE, config.filename ) );
})();
