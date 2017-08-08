(function() {
  'use strict';

  angular.module('app.profileSettings')
      .controller('ProfileSettingsCtrl', ProfileSettingsCtrl);

  ProfileSettingsCtrl.$inject = [];

  function ProfileSettingsCtrl() {
    console.log('profileSettings');
  }
}());
