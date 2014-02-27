(function() {
  var _,
    __slice = [].slice;

  _ = require('underscore');

  window.App.controller('TopController', function(log, jing, events, pldHelper, $scope) {
    var $apply;
    $apply = function(fn) {
      if ($scope.$$phase || $scope.$root.$$phase) {
        return fn();
      } else {
        return $scope.$apply(fn);
      }
    };
    $scope.tops = [];
    $scope.child = {};
    jing.tops('0', function(rs) {
      return $apply(function() {
        rs = rs[0].items;
        _.each(rs, function(top) {
          return top.cover = jing.scover(top.fid, 'chart');
        });
        return $scope.tops = rs;
      });
    });
    $scope.nextMode = false;
    $scope.loading = false;
    $scope.nextModeClass = function() {
      if ($scope.nextMode) {
        return 'child';
      }
    };
    $scope.next = function(index) {
      $scope.nextMode = !$scope.nextMode;
      if ($scope.nextMode) {
        $scope.child = {};
        return (function(id) {
          $scope.loading = true;
          return jing.tops(id, function(rs) {
            return $apply(function() {
              var nodeids;
              $scope.child.title = rs[id].name;
              $scope.child.items = [];
              nodeids = [];
              _.each(rs[id].items, function(o) {
                return nodeids.push(o.next);
              });
              return jing.tops(nodeids.join(','), function(rs) {
                return $apply(function() {
                  _.each(nodeids, function(o) {
                    return $scope.child.items.push({
                      title: rs[o].name,
                      items: rs[o].items
                    });
                  });
                  return $scope.loading = false;
                });
              });
            });
          });
        })($scope.tops[index].next);
      }
    };
    return $scope.ok = function() {
      var o, q;
      o = arguments[0], q = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return jing.tops(o.next, function(rs) {
        rs = rs[o.next];
        rs.q = q.join('-');
        rs.noFatch = true;
        pldHelper(rs.items);
        return events.emit('changeQ', rs);
      });
    };
  });

}).call(this);
