(function() {
  var _;

  _ = require('underscore');

  window.App.controller('StarController', function(log, jing, events, pldHelper, $scope) {
    var $apply, fetch, isFatching;
    $apply = function(fn) {
      if ($scope.$$phase || $scope.$root.$$phase) {
        return fn();
      } else {
        return $scope.$apply(fn);
      }
    };
    $scope.starSongs = [];
    $scope.st = 0;
    $scope.ps = 20;
    isFatching = false;
    fetch = function() {
      isFatching = true;
      return jing.starSongs({
        st: $scope.st,
        ps: $scope.ps
      }, function(rs) {
        return $apply(function() {
          $scope.st += rs.items.length;
          $scope.total = rs.total;
          _.each(rs.items, function(song) {
            song.cover = jing.scover(song.fid, 'song');
            return $scope.starSongs.push(song);
          });
          return isFatching = false;
        });
      });
    };
    fetch();
    $scope.fetch = function() {
      delete $scope.total;
      return fetch();
    };
    $scope.fetchText = function() {
      var last;
      if ($scope.total != null) {
        last = $scope.total - $scope.st;
        if (last > 1) {
          return 'More ' + last + ' song' + 's';
        }
      } else {
        return 'Loading...';
      }
    };
    $scope.cancelStar = function(index) {
      var unstar;
      unstar = $scope.starSongs.splice(index, 1);
      $scope.st -= 1;
      $scope.total -= 1;
      return jing.star(unstar[0].id, false);
    };
    return $scope.toStar = function() {
      return jing.usr(function(usr) {
        var q;
        q = '@' + usr.nick;
        return jing.fetch_pls({
          q: q,
          ps: 5,
          st: 0,
          tid: 0,
          ss: true
        }, function(rs) {
          if (rs.items.length > 0) {
            rs.q = q;
            rs.st = 5;
            pldHelper(rs.items);
            return events.emit('changeQ', rs);
          }
        });
      });
    };
  });

}).call(this);
