(function() {
  window.App.controller('SettingController', function(log, jing, audio, events, store, $scope) {
    return $scope.logout = function() {
      var $audio;
      audio.src = '';
      $audio = window.angular.element(audio);
      $audio.off('play');
      $audio.off('pause');
      $audio.off('canplay');
      $audio.off('ended');
      $audio.off('timeupdate');
      jing.logout();
      store.remove('pwd');
      return events.emit('login', false);
    };
  });

}).call(this);
