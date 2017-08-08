/* jshint -W117, -W030 */
(function () {
  'use strict';

  describe('Controller: TemplateCtrl', function () {

    var controller;

    beforeEach(function() {
      bard.appModule('app.template');
      bard.inject('$controller', '$rootScope');
    });

    beforeEach(function () {
      controller = $controller('TemplateCtrl', {
        $scope: $rootScope.$new()
      });
      $rootScope.$apply();
    });

    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

  });
}());
