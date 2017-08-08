/*jshint node: true */

'use strict';

var rfgLibPath = "./rfg-gulp/";
var rfgTemplateCache = require(rfgLibPath + "rfg-angular-templatecache")();

module.exports = function() {
  var client = './client/';
  var server = './node-server/';
  var clientApp = client + 'app/';
  var clientCommon = client + 'common/';
  var report = './report/';
  var root = './';
  var specRunnerFile = 'specs.html';
  var temp = './.tmp/';
  var _ = require('lodash');
  var wiredep = require('wiredep');
  var bower = {
    json: require('./bower.json'),
    directory: './bower_components/',
    ignorePath: '..'
  };
  var getWiredepDefaultOptions = function() {
    return {
      bowerJson: bower.json,
      directory: bower.directory,
      ignorePath: bower.ignorePath,
      exclude: [ 'requirejs', 'angularjs', 'font-awesome.css' ]
    };
  };
  var bowerFiles = wiredep(_.merge(getWiredepDefaultOptions(), { devDependencies: true })).js;
  var nodeModules = 'node_modules';

  var config = {
    marklogic: {
      version: 8,
      host: 'localhost',
      httpPort: '30050',
      xccPort: '30051',
      managePort: '8002',
      sessionPort: '8005',
      sessionUser: 'IntegraCheck-session-user',
      sessionPassword: 'em9pbG86em9pbG8=', //TODO: change this for more secure password
      projectCode: 'RedConnect',
      user: 'admin',
      password: 'admin'
    },
    /**
     * File paths
     */
    // all javascript that we want to vet
    alljs: [
      clientApp + '**/*.js',
      clientCommon + '**/*.js'
    ],
    build: './dist/',
    client: client,
    css: temp + 'main.css',
    fonts: [
      bower.directory + 'font-awesome/fonts/**/*.*',
      bower.directory + 'bootstrap-sass/assets/fonts/**/*.*',
      client + 'font_lato/*.*',
      client + 'font-open-sans/*.*'
    ],
    /*tinymce: [
      bower.directory + 'tinymce-dist/!**!/!*'
    ],*/
    html: client + '**/*.html',
    htmltemplates: [clientApp + '**/*.html',clientCommon + '**/*.html'],
    images: client + 'images/**/*.*',
    staticdata: client + '**/*.json',
    index: client + 'index.html',
    // app js, with no specs
    js: [
      clientApp + '**/*.module.js',
      clientCommon + '**/*.module.js',
      clientCommon + '**/*.js',
      clientApp + '**/*.js',
      '!'+ clientApp +'**/*.spec.js',
      '!' + clientCommon + '**/*.spec.js'
    ],
    jsOrder: [
      '**/app.module.js',
      '**/app.service.js',
      '**/*.module.js',
      '**/*.js'
    ],
    sass: client + 'styles/**/*.scss',
    mainSass: client + 'styles/**/main.scss',
    report: report,
    root: root,
    server: server,
    source: './client/',
    stubsjs: [
      bower.directory + 'angular-mocks/angular-mocks.js',
      client + 'stubs/**/*.js'
    ],
    temp: temp,

    /**
     * optimized files
     */
    optimized: {
      app: 'app.js',
      lib: 'lib.js',
      ck: 'ck.js'
    },

    /**
     * plato
     */
    plato: {js: clientApp + '**/*.js'},

    /**
     * browser sync
     */
    browserReloadDelay: 1000,

    /**
     * template cache
     */
    templateCache: {
      file: 'templates.js',
      options: {
        module: 'app',
        root: 'app/',
        transformUrl : function(url){
          return rfgTemplateCache.urlTransform(url,'app/');
        }
      }
    },

    /**
     * Bower and NPM files
     */
    bower: bower,
    packages: [
      './package.json',
      './bower.json'
    ],

    /**
     * specs.html, our HTML spec runner
     */
    specRunner: client + specRunnerFile,
    specRunnerFile: specRunnerFile,

    /**
     * The sequence of the injections into specs.html:
     *  1 testlibraries
     *    mocha setup
     *  2 bower
     *  3 js
     *  4 spechelpers
     *  5 specs
     *  6 templates
     */
    testlibraries: [
      nodeModules + '/mocha/mocha.js',
      nodeModules + '/chai/chai.js',
      nodeModules + '/mocha-clean/index.js',
      nodeModules + '/sinon-chai/lib/sinon-chai.js'
    ],
    specHelpers: [client + '**/*.spec.js'],
    specs: [clientApp + '**/*.spec.js'],
    //serverIntegrationSpecs: [clientCommon + '**/*.spec.js'],
    serverIntegrationSpecs: [client + '/tests/server-integration/**/*.spec.js'],

    /**
     * Node settings
     */
    nodeServer: './node-server/node-app.js',
    defaultPort: '9070'
  };

  /**
   * wiredep and bower settings
   */
  config.getWiredepDefaultOptions = getWiredepDefaultOptions;

  /**
   * karma settings
   */
  config.getKarmaOptions = function() {
    var wiredep = require('wiredep');
    var bowerFiles = wiredep(_.merge(getWiredepDefaultOptions(), { devDependencies: true })).js;
    var options = {
      files: [].concat(
        bowerFiles,
        config.specHelpers,
        clientApp + '**/*.module.js',
        clientApp + '**/*.js',
        temp + config.templateCache.file,
        config.serverIntegrationSpecs
      ),
      exclude: [],
      coverage: {
        // dir: report + 'coverage',
        reporters: [
          // reporters not supporting the `file` property
          {type: 'html', subdir: 'report-html'},
          {type: 'lcov', subdir: 'report-lcov'},
          {type: 'text-summary'} //, subdir: '.', file: 'text-summary.txt'}
        ]
      },
      preprocessors: {}
    };
    options.preprocessors[clientApp + '**/!(*.spec)+(.js)'] = ['coverage'];
    return options;
  };

  return config;

};
