/**
 * @class IntegraCheck Database API
 * @classdesc base search controller class; the prototype for an angular search controller
 *
 * Note: this is just a sample documentation build by jsDocs
 *
 * <pre class="prettyprint">
 *   (function() {
 *     'use strict';
 *
 *     angular.module('app').controller('SearchCtrl', SearchCtrl);
 *
 *     SearchCtrl.$inject = ['$scope', '$location', 'MLSearchFactory'];
 *
 *     // inherit from MLSearchController
 *     var superCtrl = RedConnect.prototype;
 *     SearchCtrl.prototype = Object.create(superCtrl);
 *
 *     function SearchCtrl($scope, $location, searchFactory) {
 *       var ctrl = this;
 *       var mlSearch = searchFactory.newContext();
 *
 *       MLSearchController.call(ctrl, $scope, $location, mlSearch);
 *
 *       // override a superCtrl method
 *       ctrl.updateSearchResults = function updateSearchResults(data) {
 *         superCtrl.updateSearchResults.apply(ctrl, arguments);
 *         console.log('updated search results');
 *       }
 *
 *       ctrl.init();
 *     }
 *   })();
 * </pre>
 *
 * @param {Object} $scope - child controller's scope
 * @param {Object} $location - angular's $location service
 * @param {MLSearchContext} mlSearch - child controller's searchContext
 *
 * @prop {Object} $scope - child controller's scope
 * @prop {Object} $location - angular's $location service
 * @prop {MLSearchContext} mlSearch - child controller's searchContext
 * @prop {Boolean} searchPending - signifies whether a search is in progress
 * @prop {Number} page - the current results page
 * @prop {String} qtext - the current query text
 * @prop {Object} response - the search response object
 */

/*jshint node:true*/
'use strict';

var fs = require('fs');
var express = require('express');
//var helmet = require('helmet');
var expressSession = require('express-session');
var app = express();
var logger = require('morgan');
var four0four = require('./utils/404')();
var options = require('./utils/options')();
var http = require('http');
var https = require('https');
var passport = require('passport');
var authHelper = require('./utils/auth-helper');
var port = options.appPort;
var environment = options.env;
var cors = require('cors');

app.use(cors());

authHelper.init();

// Making this middle-tier slightly more secure: https://www.npmjs.com/package/helmet#how-it-works
/*app.use(helmet({
  csp: { // enable and configure
    directives: {
      defaultSrc: ['"self"']
    },
    setAllHeaders: true
  },
  dnsPrefetchControl: true, // just enable, with whatever defaults
  xssFilter: { // enabled by default, but override defaults
    setOnOldIE: true
  },
  noCache: false // make sure it is disabled
}));*/

app.use(expressSession({
  name: 'integracheck',
  secret: 'e50cf267-a205-4ed0-a07a-417fddd9b22b',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));

app.use('/v1', require('./proxy'));
app.use('/api', require('./routes'));

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

switch (environment) {
  case 'prod':
  case 'dev':
    console.log('** DIST **');
    app.use(express.static('./client/'));
    // Any invalid calls for templateUrls are under app/* and should return 404
    app.use('/app/*', function(req, res, next) {
      four0four.send404(req, res);
    });
    // Any deep link calls should return index.html
    //app.use('/*', express.static('./client/index.html'));
    break;
  default:
    console.log('** UI **');
    app.use(express.static('./client/'));

    // Any invalid calls for templateUrls are under app/* and should return 404
    app.use('/app/*', function(req, res, next) {
      four0four.send404(req, res);
    });
    // Any deep link calls should return index.html
    app.use('/*', express.static('./client/index.html'));
    break;
}

var server = null;
if (options.nodeJsCertificate) {
  // Docs on how to create self signed certificates
  // https://devcenter.heroku.com/articles/ssl-certificate-self#prerequisites
  console.log('Starting the server in HTTPS');
  console.log('Node Certificate ' + options.nodeJsCertificate);
  console.log('Node JS key ' + options.nodeJsPrivateKey);
  var privateKey = fs.readFileSync(options.nodeJsPrivateKey, 'utf8');
  var certificate = fs.readFileSync(options.nodeJsCertificate, 'utf8');
  var credentials = {
    key: privateKey,
    cert: certificate
  };
  server = https.createServer(credentials, app);
} else {
  console.log('Starting the server in HTTP');
  server = http.createServer(app);
}

server.listen(port, function() {
  console.log('Express server listening on port ' + port);
  console.log('env = ' + app.get('env') +
    '\n__dirname = ' + __dirname +
    '\nprocess.cwd = ' + process.cwd());
});

server.timeout = 0;

module.exports = app;
