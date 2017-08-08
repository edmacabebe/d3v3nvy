/**
 * Created by Zoilo Dela Cruz on 7/27/17.
 */
(function () {
  'use strict';

  angular.module('icd.pagination', [])
      .directive('icdPagination', IcdPaginationDirective)
      .controller('IcdPaginationCtrl', IcdPaginationCtrl);

  IcdPaginationDirective.$inject = [];

  function IcdPaginationDirective() {
    return {
      restrict: 'EA',
      controller: 'IcdPaginationCtrl',
      controllerAs: '$ctrl',
      replace: true,
      scope: {

      },
      templateUrl: 'common/directives/icd-search/icd-pagination.html'
    };
  }

  IcdPaginationCtrl.$inject = ['searchService'];

  function IcdPaginationCtrl(searchService) {
    var ctrl = this;
    ctrl.total = searchService.data.total;
    ctrl.pageLength = searchService.pageLength;
    ctrl.start = searchService.data.start;
    ctrl.pages = Math.ceil(ctrl.total / ctrl.pageLength);
    ctrl.pagesArr = [];
    ctrl.maxTab = 5;
    ctrl.currActive = 0; //default
    ctrl.firstTab = 0;
    ctrl.lastTab = 0;
    ctrl.totalTabs = Math.floor(ctrl.pages / ctrl.maxTab);
    ctrl.currentTabs = [];

    angular.extend(ctrl, {
      service: searchService,
      nextFn: nextFn,
      previousFn: previousFn,
      pageSelected: pageSelected,
      leftEllipsis: leftEllipsis,
      rightEllipsis: rightEllipsis
    });

    // ======================== Public functions ================= //

    function setIndex (curr) {
      var index =  ctrl.currActive + (curr);
      if (index <= 0) {
        index = 0;
      }

      if (index >= ctrl.pages) {
        index = ctrl.pages - 1;
      }
      ctrl.currActive = index;
      return index;
    }

    function nextFn() {
      var index = setIndex(+1);
      pageSelected(index);
      setPagesContent().setMaxTab(+1, setActiveTab);
    }

    function previousFn() {
      var index = setIndex(-1);
      pageSelected(index);
      setPagesContent().setMaxTab(-1, setActiveTab);
    }

    function pageSelected(index) {
      ctrl.currActive = index;
      if (ctrl.currActive < 0 || ctrl.currActive >= ctrl.pages) {
        console.log('REACHED LIMITS ', ctrl.currActive);
      } else {
        searchService.search(null, null, (ctrl.pageLength * ctrl.currActive) + 1)
            .then(function (result) {
          console.log('pagination ', result);
          ctrl.pagesArr[ctrl.currActive].content = searchService.data.results;
        });
      }
    }

    function leftEllipsis () {
      var limitDown = (ctrl.currActive - (ctrl.maxTab - 1)) <= 0 ?
          0 : (ctrl.currActive - (ctrl.maxTab - 1));
      var limitUp = limitDown === 0 ? limitDown + ctrl.maxTab : ctrl.currActive + 1;
      for (limitDown; limitDown <= limitUp; limitDown++) {
        ctrl.pagesArr[limitDown].isVisible = true;
      }

      for ((limitUp - 1); limitUp < ctrl.pages; limitUp++) {
        ctrl.pagesArr[limitUp].isVisible = false;
      }
      setActiveTab();
    }

    function rightEllipsis () {
      var arr = (ctrl.currActive + ctrl.maxTab) > ctrl.pages ?
          (ctrl.pages - ctrl.maxTab) : ctrl.currActive;
      for (var a = 0; a < arr; a++) {
        ctrl.pagesArr[a].isVisible = false;
      }
      setPagesContent().setInitialTab(ctrl.currActive);
    }
    // ======================== Private Functions ================= //
    function setActiveTab() {
      var arr = [];
      ctrl.pagesArr.forEach(function(data) {
        if (data.isVisible) {
          arr.push(data.pageKey);
        }
      });
      ctrl.currentTabs = arr;
      return ctrl.currentTabs;
    }

    function setPagesContent() {

      function setPage() {
        ctrl.pagesArr = [];
        for (var a = 0; ctrl.pages > a; a++) {
          ctrl.pagesArr.push({pageKey: (a + 1), content:[], isVisible: false});
        }

        //Set initial values on first load
        pageSelected(0);
        setInitialTab(0);
        setMaxTab(0);

      }

      function setInitialTab(index) {

        ctrl.firstTab = index;
        ctrl.lastTab = ctrl.pages > (ctrl.firstTab + ctrl.maxTab) ?
            (ctrl.firstTab + ctrl.maxTab) : ctrl.pages;

        for (var a = ctrl.firstTab; ctrl.lastTab > a; a++) {
          ctrl.pagesArr[a].isVisible = true;
        }
        setActiveTab();
      }

      function setMaxTab(curr, callback) {
        if (!ctrl.pagesArr[ctrl.currActive].isVisible) {
          ctrl.pagesArr[ctrl.currActive].isVisible = true;
          if (curr < 0) {
            var end = (ctrl.currActive + ctrl.maxTab);
            ctrl.pagesArr[end].isVisible = false;
            callback();
          } else {
            var start = (ctrl.currActive - ctrl.maxTab);
            ctrl.pagesArr[start].isVisible = false;
            callback();
          }
        }
      }

      return {
        setPage:setPage,
        setMaxTab: setMaxTab,
        setInitialTab: setInitialTab
      };

    }

    function init() {
      setPagesContent().setPage(function() {
        pageSelected(0); // initial or default page
      });
    }

    init();
  }
}());
