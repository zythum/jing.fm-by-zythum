(function() {
  var events;

  events = require('events');

  window.App.factory('events', function() {
    return new events.EventEmitter;
  });

}).call(this);
