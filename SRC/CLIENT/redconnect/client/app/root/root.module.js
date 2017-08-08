(function () {
  'use strict';

  angular.module('app.root', [
    // inject dependencies
    'app.login',
    'app.messageBoard',
    'app.route',
    'app.user',
    'ui.router',
    'app.alertmessage',
    'app.create-directive',

    // child states
    'app.create',
    'app.updateProfile',
    'app.detail',
    'app.landing',
    'app.search',
    'app.user',
    'app.template',
    'app.breadcrumb',
    'app.profileSettings'
  ]);
}());
