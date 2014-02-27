(function() {
  window.App.factory('log', function() {
    return function(msg) {
      return console.log(msg);
    };
  });

}).call(this);
