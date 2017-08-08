(function () {
  'use strict';

  angular.module('app.create-directive', [])
      .directive('create', createDirective)
      .controller('CreateDirectiveController', CreateDirectiveController);
  createDirective.$inject = [];
  function createDirective() {
    return {
      restrict: 'E',
      controller: 'CreateDirectiveController',
      controllerAs: '$ctrl',
      replace: true,
      scope: {
        msg: '='
      },
      templateUrl: 'common/directives/create-profile/create-profile.html'
    };
  }

  CreateDirectiveController.$inject = [];

  function CreateDirectiveController() {
    var ctrl = this;
    angular.extend(ctrl, {
      sampleFunctin: sampleFunction

    });

    function sampleFunction() {

    }
  }

}());
