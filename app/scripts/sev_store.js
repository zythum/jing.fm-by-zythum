(function() {
  window.App.factory('store', function() {
    var get, remove, set, storage;
    storage = window.localStorage;
    set = function(k, v) {
      return storage.setItem(k, v);
    };
    get = function(k) {
      return storage.getItem(k);
    };
    remove = function(k) {
      return storage.removeItem(k);
    };
    return {
      set: set,
      get: get,
      remove: remove
    };
  });

}).call(this);
