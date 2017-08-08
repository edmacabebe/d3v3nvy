'use strict';

module.exports = function() {

  var services = {};


  var config = {

    templateCache : {
      urlTransform : [{
        root : "common",
        child : ["directives"]
      }]
    }

    //ToDo other configuration

  };

  services = {

    urlTransform : function(url,root) {

      var conf = config.templateCache.urlTransform;

      conf.map(function(e) {
        var matched = url.match(new RegExp(e.child.join("|")));
        if(matched) {
          url = url.replace(root + matched[0],e.root + "/" + matched[0]);
        }
      });
      return url;
      
    }

    //ToDo other builders

  };

  return services;

};
