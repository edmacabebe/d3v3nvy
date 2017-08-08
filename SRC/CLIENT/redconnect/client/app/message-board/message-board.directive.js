(function () {

  'use strict';

  angular.module('app.messageBoard')
    .directive('messageBoard', MessageBoardDirective)
    .controller('MessageBoardController', MessageBoardController);

  function MessageBoardDirective() {
    return {
      restrict: 'E',
      controller: 'MessageBoardController',
      controllerAs: '$ctrl',
      replace: true,
      scope: {
        msg: '='
      },
      templateUrl: 'app/message-board/message-board.html'
    };
  }

  MessageBoardController.$inject = [];

  function MessageBoardController() {
    var ctrl = this;
    angular.extend(ctrl, {
      isObject: isObject,
      collapseRaw: collapseRaw,
      expandRaw: expandRaw
    });

    function isObject(item) {
      return _.isObject(item);// jshint ignore:line
    }

    function collapseRaw() {
      ctrl.showRaw = false;
    }

    function expandRaw() {
      ctrl.showRaw = true;
    }
  }

}());
