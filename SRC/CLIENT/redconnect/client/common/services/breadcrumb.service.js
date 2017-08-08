(function () {
  'use strict';

  angular.module('app.breadcrumb')
    .factory('breadcrumbService', BreadcrumbService);

  BreadcrumbService.$inject = ['$state'];
  function BreadcrumbService($state) {

    var service = {};

    function navigateTo (navStr) {
      $state.go(navStr);
    }

    var nList = [
      {'title': 'HOME', 'isSelected': true, 'state': 'root.landing'},
      {'title': 'CREATE PROFILE', 'isSelected': false, 'state': 'root.create'},
      {'title': 'PROFILE SETTINGS', 'isSelected': false, 'state': 'root.profileSettings'}
    ];

    function navList () {
      return nList;
    }

    function navSelect(current) {
      nList.forEach(function (data, index) {
        if (current === index) {
          data.isSelected = true;
          $state.go(data.state);
        } else {
          data.isSelected = false;
        }
      });
    }

    angular.extend(service, {
      navigateTo: navigateTo,
      navList: navList,
      navSelect: navSelect
    });

    return service;
  }
}());
