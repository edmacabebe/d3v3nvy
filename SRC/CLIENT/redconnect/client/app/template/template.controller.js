(function () {
  'use strict';

  angular.module('app.template')
    .controller('TemplateCtrl', TemplateCtrl);

  TemplateCtrl.$inject = [];

  //NOTE: add $scope if needed
  function TemplateCtrl() {
    var ctrl = this;

    angular.extend(ctrl, {
    });
  }
}());
