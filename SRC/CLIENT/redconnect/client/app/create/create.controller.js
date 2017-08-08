(function() {
  'use strict';

  angular.module('app.create')
      .controller('CreateCtrl', CreateCtrl);

  CreateCtrl.$inject = ['pubsubService'];

  function CreateCtrl(pubsubService) {
    var ctrl = this;

    angular.extend(ctrl, {
      alertMessage: alertMessage
    });

    function alertMessage() {
      console.log('alertHere');
      var toastInfo = {msg:'Hello Benedick', alertType:'danger-toast'};
      pubsubService.publish('alertmessage', [toastInfo]);
    }

  }
}());
