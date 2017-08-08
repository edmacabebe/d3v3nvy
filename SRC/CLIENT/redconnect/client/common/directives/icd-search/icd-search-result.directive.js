/**
 * Created by Zoilo Dela Cruz on 7/26/17.
 */
(function () {
  'use strict';

  angular.module('icd.searchresult', [])
      .directive('icdSearchResult', IcdSearchResultDirective)
      .controller('IcdSearchResultCtrl', IcdSearchResultCtrl);

  IcdSearchResultDirective.$inject = [];

  function IcdSearchResultDirective() {
    return {
      restrict: 'EA',
      controller: 'IcdSearchResultCtrl',
      controllerAs: '$ctrl',
      replace: true,
      scope: {

      },
      templateUrl: 'common/directives/icd-search/icd-search-result.html'
    };
  }

  IcdSearchResultCtrl.$inject = ['searchService', 'pubsubService'];

  function IcdSearchResultCtrl(searchService, pubsubService) {
    var ctrl = this;

    angular.extend(ctrl, {
      service: searchService,
      seeAll: seeAll
    });

    function seeAll (event) {
      pubsubService.publish('seeAll', [event]);
    }
  }
}());
