(function() {
  window.App.controller('LoginController', function(log, jing, audio, gui, store, events, $scope) {
    var email, pwd;
    $scope.loading = false;
    $scope.error = false;
    $scope.submit = function() {
      $scope.error = false;
      $scope.loading = true;
      return jing.login($scope.email, $scope.password, function() {
        store.set('email', $scope.email);
        store.set('pwd', $scope.password);
        events.emit('login', true);
        return $scope.$apply(function() {
          return $scope.loading = false;
        });
      }, function(msg) {
        return $scope.$apply(function() {
          $scope.loading = false;
          return $scope.error = msg;
        });
      });
    };
    $scope.open = function(href) {
      return gui.Shell.openExternal(href);
    };
    email = store.get('email');
    pwd = store.get('pwd');
    if (email) {
      $scope.email = email;
      if (pwd) {
        $scope.password = pwd;
        return $scope.submit();
      }
    }
  });

}).call(this);
