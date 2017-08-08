(function () {
  'use strict';

  angular.module('app.alertmessage', [])
      .directive('alertMessage', alertMessageDirective)
      .controller('AlertMessageCtrl', AlertMessageCtrl);

  alertMessageDirective.$inject = [];
  function alertMessageDirective() {
    return {
      restrict: 'EA',
      controller: 'AlertMessageCtrl',
      controllerAs: '$ctrl',
      replace: true,
      scope: {
      },
      templateUrl: 'common/directives/toast-message/toast-message.html'
    };
  }

  AlertMessageCtrl.$inject = ['pubsubService'];

  function AlertMessageCtrl(pubsubService) {
    var ctrl = this;
    ctrl.isInformationToast = false;
    ctrl.message = '';

    angular.extend(ctrl, {
      pubsubService: pubsubService
    });

    pubsubService.subscribe('alertmessage', function(toastInfo) {
      ctrl.isInformationToast = true;
      ctrl.message = toastInfo.msg;
      ctrl.alertType = toastInfo.alertType;
      setTimeout(function() {
        ctrl.isInformationToast = !ctrl.isInformationToast;
      }, 100);
    });

  }

}());
