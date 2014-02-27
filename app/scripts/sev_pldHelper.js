(function() {
  var _;

  _ = require('underscore');

  window.App.factory('pldHelper', function(log, jing) {
    var helper;
    helper = function(pld) {
      pld.cover = jing.scover(pld.fid, 'song');
      return pld;
    };
    return function(pldOrPlds) {
      if (window.angular.isArray(pldOrPlds)) {
        _.each(pldOrPlds, function(pld) {
          return helper(pld);
        });
      } else {
        helper(pldOrPlds);
      }
      return pldOrPlds;
    };
  });

}).call(this);
