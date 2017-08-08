/**
 * Created by Zoilo Dela Cruz on 7/26/17.
 */
(function () {
  'use strict';

  angular.module('icd.searchtable', [])
      .directive('icdSearchTable', IcdSearchTableDirective)
      .controller('IcdSearchTableCtrl', IcdSearchTableCtrl);

  IcdSearchTableDirective.$inject = [];

  function IcdSearchTableDirective() {
    return {
      restrict: 'EA',
      controller: 'IcdSearchTableCtrl',
      controllerAs: '$ctrl',
      replace: true,
      scope: {

      },
      templateUrl: 'common/directives/icd-search/icd-search-result-table.html'
    };
  }

  IcdSearchTableCtrl.$inject = ['searchService'];

  function IcdSearchTableCtrl(searchService) {
    var ctrl = this;
    ctrl.pageLength = 10;
    ctrl.totalResults = searchService.data.total;

    angular.extend(ctrl, {
      service: searchService,
      updateProfile: updateProfile
    });

    function updateProfile(uri) {
      searchService.getDocument(uri).then(function(data) {
        console.log('searchTable ', data);
      });
    }
  }
}());
