(function () {
  'use strict';

  angular.module('app.modal', [])
      .directive('mdoal', modalDirective)
      .controller('ModalController', ModalController);
  modalDirective.$inject = [];
  function modalDirective() {
    return {
      restrict: 'E',
      controller: 'ModalController',
      controllerAs: '$ctrl',
      replace: true,
      scope: {
        msg: '='
      },
      templateUrl: 'common/directives/wizard/wizard.html'
    };
  }

  ModalController.$inject = [];

  function ModalController() {
    var ctrl = this;
    angular.extend(ctrl, {
      sampleFunctin: sampleFunction

    });

    function sampleFunction() {

    }
  }

}());
