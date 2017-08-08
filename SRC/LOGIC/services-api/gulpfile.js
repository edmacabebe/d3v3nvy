/*jshint node: true */

'use strict';

var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
//var fs = require('fs');
var fs = require('graceful-fs');
//var glob = require('glob');
var gulp = require('gulp');
var concat = require('gulp-concat');
var path = require('path');

/* jshint ignore:start */
var _ = require('lodash');
var $ = require('gulp-load-plugins')({
  lazy: true
});
var mocha = require('gulp-mocha');
/* jshint ignore:end */

var _s = require('underscore.string'),
  q = require('q'),
  spawn = require('child_process').spawn;

var encoding = {
  encoding: 'utf8'
};

var isProd = false;

/**
 * yargs variables can be passed in to alter the behavior, when present.
 * Example: gulp serve-dev
 *
 * --verbose  : Various tasks will produce more output to the console.
 * --nosync   : Don't launch the browser with browser-sync when serving code.
 * --debug  : Launch debugger with node-inspector.
 * --debug-brk: Launch debugger and break on 1st line with node-inspector.
 * --startServers: Will start servers for midway tests on the test task.
 * --ignoreErrors: Don't terminate build at vet or karma errors.
 */

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);


/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function() {
  log('Analyzing source with JSHint and JSCS');

  return gulp
    .src(config.alljs)
    .pipe($.if(args.verbose, $.print()))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish', {
      verbose: true
    }))
    .pipe($.if(!args.ignoreErrors, $.jshint.reporter('fail')))
    .pipe($.jscs())
    .pipe($.jscs.reporter())
    .pipe($.if(!args.ignoreErrors, $.jscs.reporter('fail')));
});

/**
 * Initialize config files for local environment
 */
gulp.task('init-local', function(done) {
  init('local', done);
});

/**
 * Initialize config files for dev environment
 */
gulp.task('init-dev', function(done) {
  init('dev', done);
});

/**
 * Initialize config files for prod environment
 */
gulp.task('init-prod', function(done) {
  init('prod', done);
});

function ecosystemMustExist(ecosystem, name) {
  if (!fs.existsSync(ecosystem)) {
    try {
      var configJSON = {
        'apps': [{
          'name': name,
          'script': './node-server/node-app.js',
          'watch': true,
          'restart_delay': 4000,
          'env': {
            'NODE_ENV': 'local'
          },
          'env_local': {
            'NODE_ENV': 'local'
          },
          'env_dev': {
            'NODE_ENV': 'dev'
          },
          'env_prod': {
            'NODE_ENV': 'prod'
          }
        }],
        'deploy': {}
      };

      var configString = JSON.stringify(configJSON, null, 2) + '\n';

      fs.writeFileSync(ecosystem, configString, encoding);
    } catch (e) {
      console.log('failed to write ecosystem.json: ' + e.message);
    }
  }
}

gulp.task('serve-local', ['vet', 'test'], function() {
  return serve('local' /*env*/ );
});
/**

/**
 * serve the dev environment
 * --debug-brk or --debug
 * --nosync
 * @return {Stream}
 */
gulp.task('serve-dev', function() {
  return serve('dev' /*env*/ );
});

/**
 * serve the prod environment
 * --debug-brk or --debug
 * --nosync
 * @return {Stream}
 */
gulp.task('serve-prod', function() {
  return serve('prod' /*env*/ );
});

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 * @return {Stream}
 */
gulp.task('bump', function() {
  var msg = 'Bumping versions';
  var type = args.type;
  var version = args.ver;
  var options = {};
  if (version) {
    options.version = version;
    msg += ' to ' + version;
  } else {
    options.type = type;
    msg += ' for a ' + type;
  }
  log(msg);

  return gulp
    .src(config.packages)
    .pipe($.print())
    .pipe($.bump(options))
    .pipe(gulp.dest(config.root))
    .pipe($.if(args.verbose, $.print()));
});

//TODO: Publish this to the bitbucket for webhosting or load on http servers
gulp.task('docs', function(done) {
  build(done);
});


gulp.task('rebuild', function (done){
  clean('./client/*');
  build(function (){
    done();
  });
});

function build(done){
  var cp = require('child_process');
  cp.exec('./node_modules/.bin/jsdoc -c jsdoc.conf.json', function(err) {
    if (err) {
      return console.log(err);
    }

    gulp.src([
      './client/css/baseline.css',
      './client/custom-styles.css'
    ])
      .pipe(concat('baseline.css'))
      .pipe(gulp.dest('./client/css'))
      .on('end', function() {
        done();
      });
  });
}

function rebuild(done){
  clean('./client/*', function () {
    done();
  });

}

/**
 * Delete all files in a given path
 * @param  {Array}   files - array of paths to delete
 * @return {Stream}
 */
function clean(files, done) {

  log('Cleaning: ' + $.util.colors.blue(files));
  return del(files)
    .then(function(paths) {
      if (args.verbose) {
        log(paths.map(function(path) {
          path.replace(__dirname + '/', 'rm ');
        }));
      }
      done();
    });
}

/**
 * Error handlers for task and forces to stop the entire process
 */
function handleError(err) {
  log('Failed to build due to ', err);
  process.exit(1);
}

gulp.task('test', function () {
  process.env.NODE_ENV = 'local';
  return gulp.src(['test/**'], { read: false })
    .pipe(mocha({
      reporter: 'spec' // Values min, list, nyn, landing, progress and spec.
    })
      .on('error', handleError));
});

/**
 * Initialize config files for given env
 * @param   {String} env   The environment name (local, dev, prod)
 * @param  {Function} done - callback when complete
 */
//TODO: Need to fixed this and remove ML Configuration
function init(env, done) {
  if (fs.existsSync(env + '.json')) {
    log('NOTE: ' + env + '.json already exists, change manually if needed.');
    done();
  } else {
    //copy from slushfile - config gulp - with modifications to use config instead
    var inquirer = require('inquirer');

    run('./ml', [env, 'info', '--format=json']).then(function(output) {
      var localJson = fs.existsSync('local.json') ? JSON.parse(fs.readFileSync('local.json', 'utf8')) : {};

      var localAppName = localJson['app-name'];
      var localMlVersion = localJson['ml-version'];
      var localMlHost = localJson['ml-host'];
      var localMlAdminUser = localJson['ml-admin-user'];
      var localMlAppUser = localJson['ml-app-user'];
      var localMlAppPass = localJson['ml-app-pass'];
      var localMlHttpPort = localJson['ml-http-port'];
      var localMlXccPort = localJson['ml-xcc-port'];
      var localNodePort = localJson['node-port'] || 9070;
      var localGuestAccess = ['false', 'true'].indexOf(localJson['guest-access']);
      var localDisallowUpdates = ['false', 'true'].indexOf(localJson['disallow-updates']);
      var localAppUsersOnly = ['false', 'true'].indexOf(localJson['appusers-only']);

      var properties = JSON.parse(output).properties || {};

      var mlVersion = ['8', '7', '6', '5'].indexOf(localMlVersion || properties['ml.server-version'] || '8');
      var marklogicHost = properties['ml.' + env + '-server'] || localMlHost || 'localhost';
      var marklogicAdminUser = properties['ml.user'] || localMlAdminUser || 'admin';
      var appName = properties['ml.app-name'] || localAppName;
      var appUserName = properties['ml.default-user'] || localMlAppUser;
      var appUserPass = unescape(properties['ml.appuser-password']) || localMlAppPass;
      var appPort = localMlHttpPort || properties['ml.app-port'] || 8040;
      var xccPort = localMlXccPort || properties['ml.xcc-port'] || 8041;

      var prompts = [{
        type: 'list',
        name: 'mlVersion',
        message: 'MarkLogic version?',
        choices: ['8', '7', '6', '5'],
        default: mlVersion > 0 ? mlVersion : 0
      }, {
        type: 'input',
        name: 'marklogicHost',
        message: 'MarkLogic Host?',
        default: marklogicHost
      }, {
        type: 'input',
        name: 'marklogicAdminUser',
        message: 'MarkLogic Admin User?',
        default: marklogicAdminUser
      }, {
        type: 'input',
        name: 'marklogicAdminPass',
        message: 'Note: consider keeping the following blank, ' +
          'you will be asked to enter it at appropriate commands.\n? MarkLogic Admin Password?',
        default: ''
      }, {
        type: 'input',
        name: 'appPort',
        message: 'MarkLogic App/Rest port?',
        default: appPort
      }, {
        type: 'input',
        name: 'xccPort',
        message: 'XCC port?',
        default: xccPort,
        when: function(answers) {
          return answers.mlVersion < 8;
        }
      }, {
        type: 'input',
        name: 'nodePort',
        message: 'Node app port?',
        default: localNodePort
      }, {
        type: 'list',
        name: 'guestAccess',
        message: 'Allow anonymous users to search data?',
        choices: ['false', 'true'],
        default: localGuestAccess > 0 ? localGuestAccess : 0
      }, {
        type: 'list',
        name: 'disallowUpdates',
        message: 'Disallow proxying update requests?',
        choices: ['false', 'true'],
        default: localDisallowUpdates > 0 ? localDisallowUpdates : 0
      }, {
        type: 'list',
        name: 'appUsersOnly',
        message: 'Only allow access to users created for this app? Note: disallows admin users.',
        choices: ['false', 'true'],
        default: localAppUsersOnly > 0 ? localAppUsersOnly : 0
      }];

      if (typeof appName === 'undefined') {
        prompts.unshift({
          type: 'input',
          name: 'name',
          message: 'Name for the app?'
        });
      }

      inquirer.prompt(prompts, function(settings) {
        if (typeof appName === 'undefined') {
          settings.nameDashed = _s.slugify(settings.name);
        } else {
          settings.nameDashed = _s.slugify(appName);
        }

        try {
          var configJSON = {};
          configJSON['app-name'] = settings.nameDashed;
          configJSON['ml-version'] = settings.mlVersion;
          configJSON['ml-host'] = settings.marklogicHost;
          configJSON['ml-admin-user'] = settings.marklogicAdminUser;
          configJSON['ml-admin-pass'] = settings.marklogicAdminPass;
          configJSON['ml-app-user'] = appUserName || (settings.nameDashed + '-user');
          configJSON['ml-app-pass'] = appUserPass || '';
          configJSON['ml-http-port'] = settings.appPort;

          if (settings.mlVersion < 8) {
            configJSON['ml-xcc-port'] = settings.xccPort;
          }

          configJSON['node-port'] = settings.nodePort;
          configJSON['guest-access'] = settings.guestAccess;
          configJSON['disallow-updates'] = settings.disallowUpdates;
          configJSON['appusers-only'] = settings.appUsersOnly;

          var configString = JSON.stringify(configJSON, null, 2) + '\n';
          fs.writeFileSync(env + '.json', configString, encoding);
          log('Created ' + env + '.json.');

          if (fs.existsSync('deploy/' + env + '.properties')) {
            log('NOTE: deploy/' + env + '.properties already exists, change manually please!');
          } else {
            var envProperties = '#################################################################\n' +
              '# This file contains overrides to values in build.properties\n' +
              '# These only affect your local environment and should not be checked in\n' +
              '#################################################################\n' +
              '\n' +
              'server-version=' + settings.mlVersion + '\n' +
              '\n' +
              '#\n' +
              '# The ports used by your application\n' +
              '#\n' +
              'app-port=' + settings.appPort + '\n';
            if (settings.mlVersion < 8) {
              envProperties += 'xcc-port=' + settings.xccPort + '\n';
            } else {
              envProperties += '# Taking advantage of not needing a XCC Port for ML8\n' +
                'xcc-port=${app-port}\n' +
                'install-xcc=false\n';
            }

            envProperties += '\n' +
              '#\n' +
              '# the uris or IP addresses of your servers\n' +
              '# WARNING: if you are running these scripts on WINDOWS you may need to change localhost to 127.0.0.1\n' +
              '# There have been reported issues with dns resolution when localhost wasn\'t in the hosts file.\n' +
              '#\n' +
              env + '-server=' + settings.marklogicHost + '\n' +
              'content-forests-per-host=3\n' +
              '\n' +
              '#\n' +
              '# Admin username/password that will exist on the local/dev/prod servers\n' +
              '#\n' +
              'user=' + settings.marklogicAdminUser + '\n' +
              'password=' + settings.marklogicAdminPass + '\n';

            //fs.writeFileSync('deploy/' + env + '.properties', envProperties, encoding);
            log('Created deploy/' + env + '.properties.');
          }
          done();
        } catch (e) {
          log('Failed to write ' + env + ' config files: ' + e.message);
          done();
        }
      });
    });
  }
}
// bypass Roxy bug that causes special XML chars to get escaped as entities
function unescape(s) {
  return s.replace('&apos;', '\'').replace('&quot;', '"').replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&').replace('{{', '{').replace('}}', '}');
}

/**
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src   glob pattern for source files
 * @param   {String} label   The label name
 * @param   {Array} order   glob pattern for sort order of the files
 * @return  {Stream}
 */
function inject(src, label, order) {
  var options = {
    read: false
  };
  if (label) {
    options.name = 'inject:' + label;
  }

  return $.inject(orderSrc(src, order), options);
}

/**
 * Order a stream
 * @param   {Stream} src   The gulp.src stream
 * @param   {Array} order Glob array pattern
 * @return  {Stream} The ordered stream
 */
function orderSrc(src, order) {
  return gulp
    .src(src)
    .pipe($.if(order, $.order(order)));
}

/**
 * serve the code
 * --debug-brk or --debug
 * --nosync
 * @param  {String} env - local | dev | prod
 * @param  {Boolean} specRunner - server spec runner html
 * @return {Stream}
 */
function serve(env, specRunner) {
  var debugMode = '--debug';
  var nodeOptions = getNodeOptions(env);

  nodeOptions.nodeArgs = (args.debug || args.debugBrk) ? [debugMode + '=5858'] : [];

  if (args.verbose) {
    log(nodeOptions);
  }

  return $.nodemon(nodeOptions)
    .on('restart', ['docs'], function(ev) {
      log('*** nodemon restarted');
      log('files changed:\n' + ev);
      setTimeout(function() {
        browserSync.notify('reloading now ...');
        browserSync.reload({
          stream: false
        });
      }, config.browserReloadDelay);
    })
    .on('start', function() {
      log('*** nodemon started');
      startBrowserSync(env, null);
    })
    .on('crash', function() {
      log('*** nodemon crashed: script crashed for some reason');
    })
    .on('exit', function() {
      log('*** nodemon exited cleanly');
    });
}

/**
 * Determine whether the enviornment requires dev mode'
 * @param {String} env - local | dev | prod
 * @return {Boolean} - true if env==='local'
 */
function isDevMode(env) {
  return env === 'local';
}

function getNodeOptions(env) {
  var envJson;
  var envFile = './' + env + '.json';
  try {
    envJson = require(envFile);
  } catch (e) {
    envJson = {};
    log('Couldn\'t find ' + envFile + '; you can create this file to override properties - ' +
      '`gulp init-local` creates local.json which can be modified for other environments as well');
  }
  var port = args['app-port'] || process.env.PORT || envJson['node-port'] || config.defaultPort;
  return {
    script: config.nodeServer,
    delayTime: 1,
    env: {
      'PORT': port,
      'NODE_ENV': env,
      'APP_PORT': port,
      'ML_HOST': args['ml-host'] || process.env.ML_HOST || envJson['ml-host'] || config.marklogic.host,
      'ML_APP_USER': args['ml-app-user'] || process.env.ML_APP_USER || envJson['ml-app-user'] || config.marklogic.user,
      'ML_APP_PASS': args['ml-app-pass'] || process.env.ML_APP_PASS || envJson['ml-app-pass'] || config.marklogic.password,
      'ML_PORT': args['ml-http-port'] || process.env.ML_PORT || envJson['ml-http-port'] || config.marklogic.httpPort,
      'ML_XCC_PORT': args['ml-xcc-port'] || process.env.ML_XCC_PORT || envJson['ml-xcc-port'] || config.marklogic.xccPort,
      'ML_VERSION': args['ml-version'] || process.env.ML_VERSION || envJson['ml-version'] || config.marklogic.version
    },
    watch: [config.server]
  };
}

/**
 * Start BrowserSync
 * --nosync will avoid browserSync
 */
function startBrowserSync(env, specRunner) {
  var nodeOptions = getNodeOptions(env);

  if (args.nosync || browserSync.active) {
    return;
  }

  log('Starting BrowserSync on port ' + nodeOptions.env.APP_PORT);

  var options = {
    proxy: 'localhost:' + nodeOptions.env.APP_PORT,
    //port: 3001,
    files: isDevMode(env) ? [
      config.client + '**/*.*'
    ] : [],
    ghostMode: { // these are the defaults t,f,t,t
      clicks: true,
      location: false,
      forms: true,
      scroll: true
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: 'gulp-patterns',
    notify: true,
    reloadDelay: 0, //1000
    ui: false
  };
  if (specRunner) {
    options.startPath = config.specRunnerFile;
  }

  browserSync(options);
}


/**
 * Format a number as a percentage
 * @param  {Number} num     Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {String}       Formatted perentage
 */
function formatPercent(num, precision) {
  return (num * 100).toFixed(precision);
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
  if (typeof(msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.blue(msg));
  }
}

/**
 * Show OS level notification using node-notifier
 */
function notify(options) {
  var notifier = require('node-notifier');
  var notifyOptions = {
    sound: 'Bottle',
    contentImage: path.join(__dirname, 'gulp.png'),
    icon: path.join(__dirname, 'gulp.png')
  };
  _.assign(notifyOptions, options);
  notifier.notify(notifyOptions);
}

function run(cmd, args, verbose) {
  var d = q.defer();
  var output = '';

  console.log('Spawning ' + cmd + ' ' + args.join(' '));
  var child = spawn(cmd, args, {
    stdio: [
      0, // Use parents stdin for child
      'pipe', // Pipe child's stdout to parent (default)
      'pipe' // Pipe child's stderr to parent (default)
    ]
  });

  child.on('close', function() {
    console.log('done running ' + cmd);
    d.resolve(output);
  });

  child.stdout.on('data', function(chunk) {
    if (verbose) {
      console.log(chunk.toString());
    }
    output += chunk.toString();
  });

  child.stderr.on('data', function(data) {
    console.log(data.toString());
  });

  return d.promise;
}

module.exports = gulp;
