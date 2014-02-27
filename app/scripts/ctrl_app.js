(function() {
  window.App.controller('AppController', function(log, gui, jing, events, $scope) {
    var $apply, win;
    $apply = function(fn) {
      if ($scope.$$phase || $scope.$root.$$phase) {
        return fn();
      } else {
        return $scope.$apply(fn);
      }
    };
    win = gui.Window.get();
    gui.App.on('reopen', function() {
      return win.show();
    });
    win.show();
    window.focus();
    $scope.title = 'JING.fm';
    $scope.isLogin = false;
    $scope.modtpl = function() {
      return ($scope.isLogin ? 'player' : 'login') + '.html';
    };
    $scope.hide = function() {
      return win.show(false);
    };
    events.on('hide', function() {
      return win.show(false);
    });
    events.on('login', function(isLogin) {
      return $apply(function() {
        return $scope.isLogin = isLogin;
      });
    });
    return events.on('title', function(title, limit) {
      return $apply(function() {
        return $scope.title = title;
      });
    });
  });

}).call(this);
