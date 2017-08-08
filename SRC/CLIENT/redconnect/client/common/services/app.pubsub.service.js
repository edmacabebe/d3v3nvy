/**
 * Created by Zoilo Dela Cruz on 7/26/17.
 */
(function () {
  'use strict';

  angular.module('app.pubsub', []);

  angular.module('app.pubsub')
      .factory('pubsubService', function () {
        var cache = {};
        var subscribe = function (topic, callback) {
          if (!cache[topic]) {
            cache[topic] = [];
          }
          cache[topic].push(callback);
          return [topic, callback];
        };

        /*jshint expr:true */
        var publish = function (topic, args) {
          cache[topic] && angular.forEach(cache[topic],
              function (callback) {
                callback.apply(null, args || []);
              });
        };
        var unsubscribe = function (topic) {
          var t = topic[0];
          if (cache[t]) {
            for (var x = 0; x < cache[t].length; x++) {
              if (cache[t][x] === topic[1]) {
                cache[t].splice(x, 1);
              }
            }
          }
        };
        var service = {
          publish: publish,
          subscribe: subscribe,
          unsubscribe: unsubscribe
        };
        return service;
      });
}());
