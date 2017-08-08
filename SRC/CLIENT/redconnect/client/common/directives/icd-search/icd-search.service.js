/**
 * Created by Zoilo Dela Cruz on 7/20/17.
 */
(function () {
  'use strict';

  angular.module('icd.search')
      .factory('searchService', SearchService);

  SearchService.$inject = ['$http'];

  function SearchService($http) {

    var service = {
      suggestArr: [],
      contentHeader: [],
      data: {},
      viewResult: false,
      searchStr: {},
      pageLength: 10,
      start: 0
    };

    function setValues (searchStr, pageLength, start) {
      service.searchStr = (searchStr !== null) && (searchStr !== '') ?
          searchStr : service.searchStr;

      service.pageLength = pageLength ? pageLength : service.pageLength;
      service.start = start !== null ? start : service.start;

      return service;
    }

    function errorHandler(err) {
      console.log('Error here ', err);
      return err;
    }

    function setContentHeader(results) {
      service.contentHeader = []; //resets value
      results.forEach(function(data) {
        service.contentHeader.push(data.extracted.content[0].header);
      });
    }

    function replaceContent(data, matchkey, index, childKey) {
      if (data) {
        var obj = data.extracted.content;
        var matches = data.matches[index]['match-text'];
        var fullValue = '';

        for (var l = 0; l < matches.length; l++) {
          if (typeof matches[l] === 'object') {
            fullValue = fullValue + ' ' + '<em class="highlight">' + matches[l].highlight + '</em>';
          } else {
            fullValue = fullValue + ' ' + matches[l];
          }
        }

        //console.log(fullValue);
        if (childKey) {
          obj[0].header[childKey][matchkey] = fullValue.trim();
        } else {
          obj[0].header[matchkey] = fullValue.trim();
        }

      }

    }

    function getMatchKey(data, callback) {
      (function () {
        data.forEach(function(res) {
          for (var l = 0; l < res.matches.length; l++) {
            //====== Get Match key in root
            var str = res.matches[l].path;
            var re = /\((.*?)\)/g;
            var found = str.match(re);
            var matchKey = found[1].replace(/((\("|"\)))/g, '');
            res.matches[l].keyMatch = matchKey;

            //Check and get if match key is in sub-object or child
            var childReg = /\)(.*?)\(/g;
            var foundXPath = str.match(childReg);
            var cleanFoundXPath = foundXPath[0].replace(/\(|\)/g, '');
            var childkeys = cleanFoundXPath.split('/');
            var childKey = null;
            var currKey = childkeys.length - 2;

            if (childkeys.length >= 4) {
              childKey = childkeys[currKey];
            }
            replaceContent(res, matchKey, l, childKey);
          }

        });
        return callback(data);
      })();
    }

    function setResult(response) {
      if (response.status === 200) {
        var data = response.data;
        service.data = data;
        //setContentHeader(data.results);
        getMatchKey(data.results, function() {
          console.log('Done ');
          setContentHeader(data.results);
        });
        return response;
      }
    }

    function setSuggest(response) {
      //console.log(response);
      if (response.status >= 200 && response.status < 205) {
        var data = response.data;
        if (data.suggestions.length > 0) {
          service.suggestArr = data.suggestions;
        } else {
          service.suggestArr = [];
        }
      }
    }

    function setViewResult(view) {
      service.viewResult = view;
    }

    function search(searchStr, pageLength, start) {
      var nParams = setValues(searchStr, pageLength, start);
      return $http.post('/v1/search?format=' +
          'json&options=profile&pageLength=' + nParams.pageLength +
          '&q=' + nParams.searchStr + '&start=' + nParams.start, {
      }).then(setResult, errorHandler);
    }

    function suggest(searchStr) {
      return $http.get('/v1/resources/icd-suggest?rs:q=' + searchStr +
          '&rs:o=profile&limit=' + 5, {
      }).then(function(response) {
        console.log('SUGGEST ', response);
        setSuggest(response);
        return response;
      }, errorHandler);
    }

    function setDocument(response) {
      console.log('Get Document Response ', response);
      return response;
    }

    function getDocument(uri) {
      return $http.get('/v1/documents?uri=' + uri)
          .then(setDocument, errorHandler);
    }

    angular.extend(service, {
      search: search,
      suggest: suggest,
      setResult: setResult,
      setViewResult: setViewResult,
      getDocument: getDocument
    });

    return service;
  }
}());
