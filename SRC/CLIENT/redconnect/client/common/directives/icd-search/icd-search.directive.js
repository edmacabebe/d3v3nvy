/**
 * Created by developer on 7/20/17.
 */
(function () {
  'use strict';

  angular.module('icd.search', [])
      .directive('icdSearch', IcdSearchDirective)
      .controller('IcdSearchCtrl', IcdSearchCtrl);

  IcdSearchDirective.$inject = [];

  function IcdSearchDirective() {
    return {
      restrict: 'EA',
      controller: 'IcdSearchCtrl',
      controllerAs: '$ctrl',
      replace: true,
      scope: {

      },
      templateUrl: 'common/directives/icd-search/icd-search.html'
    };
  }

  IcdSearchCtrl.$inject = ['$scope', 'searchService', 'pubsubService'];

  function IcdSearchCtrl($scope, searchService, pubsubService) {
    var ctrl = this;
    ctrl.result = [];
    ctrl.suggest = [];
    ctrl.content = [];
    ctrl.searchStr = '';

    angular.extend(ctrl, {
      searchFn: searchFn,
      suggestFn: suggestFn,
      service: searchService
    });

    //============== Public Functions ====================//
    function searchFn(event) {
      if (event.keyCode === 13 || event.type === 'click') {
        search(ctrl.searchStr, 10, 0, function(result) {
          console.log('ENTER ', result);
          isFullResultFn(true);
        });
      }
    }

    function suggestFn () {
      if (ctrl.searchStr !== '') {
        searchService.suggest(ctrl.searchStr).then(function () {
          ctrl.suggest = ctrl.service.suggestArr;
        });
      } else {
        ctrl.suggest = [];
      }
    }

    pubsubService.subscribe('suggestSelected', function (result) {
      console.log('result ==== ', result);
      ctrl.searchStr = result;
      search(ctrl.searchStr, 1, 0,function() {
        isFullResultFn(true);
      });
    });

    pubsubService.subscribe('seeAll', function(event) {
      searchFn(event);
    });

    //============== Private Functions ====================//
    function search(searchStr, pageLength, start, cb) {
      searchService.search(searchStr, pageLength, start).then(cb);
    }

    function isFullResultFn(isFull) {
      searchService.setViewResult(isFull);
    }

    $scope.$watch('$ctrl.searchStr', function(searchStr) {
      console.log(searchStr);
      suggestFn();
      search(ctrl.searchStr, 5, 0, function(result) {
        console.log(result);
        isFullResultFn(false);
      });
    });
  }
}());
