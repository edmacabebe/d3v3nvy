/**
 * Created by Zoilo Dela Cruz on 8/7/17.
 */
(function() {
  'use strict';

  angular.module('app.updateProfile')
      .controller('UpdateProfileCtrl', UpdateProfileCtrl);

  UpdateProfileCtrl.$inject = ['searchService'];

  function UpdateProfileCtrl(searchService) {
    var ctrl = this;

    angular.extend(ctrl, {
      searchService: searchService,
      updateFn: updateFn
    });

    function updateFn() {
      console.log('update profile');
    }
  }
}());
