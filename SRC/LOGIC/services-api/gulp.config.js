/*jshint node: true */

'use strict';


module.exports = function() {
  var client = './client/';
  var server = './node-server/';
  var root = './';

  var config = {
    marklogic: {
      version: 8,
      host: 'localhost',
      httpPort: '30053',
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
     * Node settings
     */
    nodeServer: './node-server/node-app.js',
    defaultPort: '9070',
    /**
     * File paths
     */
    // all javascript that we want to vet
    alljs: [
      server + '**/*.js'
    ],
    client: client,
    html: client + '**/*.html',
    images: client + 'images/**/*.*',
    index: client + 'index.html',
    // app js, with no specs
    root: root,
    server: server,
    source: './client/',

    /**
     * browser sync
     */
    browserReloadDelay: 1000,

    /**
     * Bower and NPM files
     */
    packages: [
      './package.json'
    ]
  };
  return config;
};
