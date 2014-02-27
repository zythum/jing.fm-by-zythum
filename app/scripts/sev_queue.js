(function() {
  var events, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore');

  events = require('events');

  window.App.factory('Queue', function(log) {
    var Queue;
    Queue = (function() {
      function Queue(array) {
        this.length = __bind(this.length, this);
        this.size = __bind(this.size, this);
        this.empty = __bind(this.empty, this);
        this.get = __bind(this.get, this);
        this.push = __bind(this.push, this);
        this.pop = __bind(this.pop, this);
        this.array = [].concat(array || []);
        this.event = new events.EventEmitter;
      }

      Queue.prototype.pop = function() {
        var pop;
        this.event.emit('pop', pop = this.array.pop());
        return pop;
      };

      Queue.prototype.push = function(arrayOrItem) {
        var _this = this;
        arrayOrItem = window.angular.isArray(arrayOrItem) ? arrayOrItem : [arrayOrItem];
        _.each(arrayOrItem, function(item) {
          return _this.array.push(item);
        });
        return this.event.emit('push', arrayOrItem);
      };

      Queue.prototype.get = function(index) {
        return this.array[index];
      };

      Queue.prototype.empty = function() {
        var _results;
        _results = [];
        while (true) {
          this.array.pop();
          if (this.size() === 0) {
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      Queue.prototype.size = function() {
        return this.array.length;
      };

      Queue.prototype.length = function() {
        return this.array.length;
      };

      return Queue;

    })();
    return Queue;
  });

}).call(this);
