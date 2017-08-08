/**
 * Created by Zoilo Dela Cruz on 7/20/17.
 */
(function () {
  'use strict';

  angular.module('app.wizard', [])
      .directive('wizard', wizardDirective)
      .controller('WizardController', WizardController);
  wizardDirective.$inject = [];
  function wizardDirective() {
    return {
      restrict: 'E',
      controller: 'WizardController',
      controllerAs: '$ctrl',
      replace: true,
      scope: {
        msg: '='
      },
      templateUrl: 'common/directives/wizard/wizard.html'
    };
  }

  WizardController.$inject = [];

  function WizardController() {
    var ctrl = this;
    angular.extend(ctrl, {
      sampleFunctin: sampleFunction

    });

    function sampleFunction() {

    }
  }

}());
