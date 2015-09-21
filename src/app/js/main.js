var angular = require("angular");

require("angular-route");
require("angular-sanitize");

var ngFilters = require("./filters.js");

var manifestXml = require('./components/manifest.xml.js');

var app = angular.module('app', ['ngRoute', 'ngSanitize', ngFilters, manifestXml]);

// configs
app.config(function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(app):/);
});

app.db = require('./db.js');

require("./GulpController.js")(app);

require("./WidgetsController.js")(app);
require("./TasksController.js")(app);
require("./ConfigsController.js")(app);

require("./directives/webkitdirectory.js")(app);
