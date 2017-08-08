(function () {
  'use strict';

  angular.module('app.landing')
    .controller('LandingCtrl', LandingCtrl);

  LandingCtrl.$inject = ['loginService'];

  //NOTE: add $scope if needed
  function LandingCtrl(loginService) {
    var ctrl = this;

    angular.extend(ctrl, {
      search:search
    });

    function search() {
      loginService.search().then(function(result) {
        console.log('RESULT ', result);
      });
    }
  }
}());
