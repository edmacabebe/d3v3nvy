(function() {
  'use strict';

  var app = angular.module('app.filters', []);

  app.filter('formatDate', [function() {
    return function(input) {
      if (input === 0) {
        return '';
      }
      else if (input) {
        var date = new Date(parseInt(input));

        var day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear();
        var reformatDay = (day < 10) ? '0' + day : day;
        var reformatMonth = (month < 10) ? '0' + month : month;
        var formattedDate =  reformatDay + '/' + reformatMonth + '/' + year;

        return formattedDate;
      }
    };
  }]);

  app.filter('trimValue', [function() {
    return function(input, trimFormat) {
      var trimmedValue;

      if (!input) {
        return '';
      }
      else {
        if (trimFormat === 'middle') {
          trimmedValue = input.split(' ').join('');
        }
        else {
          trimmedValue = input.trim();
        }
      }

      return trimmedValue;
    };
  }]);

  app.filter('statusFilter', [function() {
    return function(input) {
      if (typeof(input) === 'boolean') {
        var cleanValue = '';
        if (input === true) {
          cleanValue = 'Active';
        }
        else if (input === false) {
          cleanValue = 'Inactive';
        }

        return cleanValue;
      }
    };
  }]);
})();
