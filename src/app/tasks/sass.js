var _ = require('lodash');
var path = require('path');

var sass = function(params) {
    var self = this;

    params = _.assign({
        widget: '',
        srcFiles: ['*.scss'],
        watchFiles: ['**/*.scss'],
        dest: 'Styles',
        plugin: {},
        src: 'src'
    }, params);

    var basedir = path.join(params.widget, params.src, params.dest);
    var srcFiles = params.srcFiles.map(function(file) {
        return path.join(basedir, file);
    });
    var watchFiles = params.srcFiles.map(function(file) {
        return path.join(basedir, file);
    });
    var dest = path.join(params.widget, params.dest);

    return {
        task: function() {
            gulp.src()
                .pipe(debug())
                .pipe(sass(params.plugin))
                .on('error', gutil.log)
                .pipe(gulp.dest(dest));
        },
        watch: watchFiles
    };
};

module.exports = sass;
