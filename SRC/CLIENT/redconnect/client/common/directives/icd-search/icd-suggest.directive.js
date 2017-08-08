/**
 * Created by Zoilo Dela Cruz on 7/25/17.
 */
(function () {
  'use strict';

  angular.module('icd.suggest', [])
      .directive('icdSuggest', IcdSuggestDirective)
      .controller('IcdSuggestCtrl', IcdSugestCtrl);

  IcdSuggestDirective.$inject = [];

  function IcdSuggestDirective() {
    return {
      restrict: 'EA',
      controller: 'IcdSuggestCtrl',
      controllerAs: '$ctrl',
      replace: true,
      scope: {
        suggests: '='
      },
      templateUrl: 'common/directives/icd-search/icd-suggest.html'
    };
  }

  IcdSugestCtrl.$inject = ['$scope', 'pubsubService'];

  function IcdSugestCtrl($scope, pubsubService) {
    var ctrl = this;
    ctrl.suggests = [];

    angular.extend(ctrl, {
      setSelected: setSelected
    });

    function setSelected(data) {
      $scope.searchStr = data;
      pubsubService.publish('suggestSelected', [data]);
    }

    function removeDoubleQuote(data) {
      var nData = [];
      data.forEach(function(suggestStr) {
        nData.push(suggestStr.replace(/[\\"]+/g, ''));
      });
      return nData;
    }

    $scope.$watch('suggests', function(data) {
      ctrl.suggests = removeDoubleQuote(data);
    });

  }
}());
