/**
 * @class RedConnectRootController
 * @classdesc base search controller class; the prototype for an angular search controller
 *
 * Note: this is just a sample documentation build by jsDocs
 *
 * <pre class="prettyprint">
 *   (function() {
 *     'use strict';
 *
 *     angular.module('app').controller('SearchCtrl', SearchCtrl);
 *
 *     SearchCtrl.$inject = ['$scope', '$location', 'MLSearchFactory'];
 *
 *     // inherit from MLSearchController
 *     var superCtrl = MLSearchController.prototype;
 *     SearchCtrl.prototype = Object.create(superCtrl);
 *
 *     function SearchCtrl($scope, $location, searchFactory) {
 *       var ctrl = this;
 *       var mlSearch = searchFactory.newContext();
 *
 *       MLSearchController.call(ctrl, $scope, $location, mlSearch);
 *
 *       // override a superCtrl method
 *       ctrl.updateSearchResults = function updateSearchResults(data) {
 *         superCtrl.updateSearchResults.apply(ctrl, arguments);
 *         console.log('updated search results');
 *       }
 *
 *       ctrl.init();
 *     }
 *   })();
 * </pre>
 *
 * @param {Object} $scope - child controller's scope
 * @param {Object} $location - angular's $location service
 * @param {MLSearchContext} mlSearch - child controller's searchContext
 *
 * @prop {Object} $scope - child controller's scope
 * @prop {Object} $location - angular's $location service
 * @prop {MLSearchContext} mlSearch - child controller's searchContext
 * @prop {Boolean} searchPending - signifies whether a search is in progress
 * @prop {Number} page - the current results page
 * @prop {String} qtext - the current query text
 * @prop {Object} response - the search response object
 */
(function () {
  'use strict';

  angular.module('app.root')
    .controller('RootCtrl', RootCtrl);

  RootCtrl.$inject = ['messageBoardService', 'userService', 'loginService', '$scope',
    '$state', 'appConfig', 'breadcrumbService'];

  function RootCtrl(messageBoardService, userService, loginService, $scope,
    $state, appConfig, breadcrumbService) {

    var rootCtrl = this;
    rootCtrl.currentYear = new Date().getUTCFullYear();
    rootCtrl.messageBoardService = messageBoardService;
    rootCtrl.loginService = loginService;
    rootCtrl.breadcrumbService = breadcrumbService;
    rootCtrl.navTo = breadcrumbService.navSelect;
    angular.extend(rootCtrl, appConfig);

    init();

    $scope.$watch(userService.currentUser, function(newValue) {
      rootCtrl.currentUser = newValue;
      console.log(rootCtrl.currentUser);
      if (rootCtrl.currentUser) {
        $state.go('root.landing');
      } else {
        $state.go('root.login');
      }
    });

    $scope.$watch(function() {
      return $state.current.name;
    }, function(newValue) {
      rootCtrl.currentState = newValue;
    });

    function init() {
      rootCtrl.currentUser = userService.currentUser();
      rootCtrl.navList = breadcrumbService.navList();
      console.log('nav ', rootCtrl.navList);
    }
  }
}());
