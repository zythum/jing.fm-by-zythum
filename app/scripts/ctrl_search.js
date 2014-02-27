(function() {
  var _;

  _ = require('underscore');

  window.App.controller('SearchController', function(log, jing, events, pldHelper, $scope, $element) {
    var $apply, getSearch;
    $apply = function(fn) {
      if ($scope.$$phase || $scope.$root.$$phase) {
        return fn();
      } else {
        return $scope.$apply(fn);
      }
    };
    getSearch = function() {
      var arr;
      arr = $scope.q.split('+');
      arr = _.filter(arr, function(item) {
        return item.length > 0;
      });
      return arr.join('+');
    };
    $scope.q = '';
    $scope.search = '';
    $scope.list = [];
    $scope.curIndex = -1;
    $scope.$watch('search', function(value) {
      if (value.length === 0) {
        return jing.fetch_natural(function(rs) {
          if ($scope.search === value) {
            _.each(rs.items, function(item) {
              item.cover = jing.scover(item.fid, 'song');
              return item.n = item.sw;
            });
            return $apply(function() {
              return $scope.list = rs.items;
            });
          }
        });
      } else {
        return jing.search(value, function(rs) {
          if ($scope.search === value) {
            _.each(rs, function(item) {
              return item.cover = jing.scover(item.fid, item.t);
            });
            return $apply(function() {
              return $scope.list = rs;
            });
          }
        });
      }
    });
    $scope.$watch('q', function(value) {
      $scope.curIndex = -1;
      value = value.split('+');
      value = value[value.length - 1];
      return $scope.search = value.trim();
    });
    $scope.curChange = function(e) {
      switch (e.which) {
        case 40:
          if ($scope.curIndex < $scope.list.length - 1) {
            $scope.curIndex += 1;
          }
          return e.preventDefault();
        case 38:
          if ($scope.curIndex > -1) {
            $scope.curIndex -= 1;
          }
          return e.preventDefault();
        case 13:
          if ($scope.curIndex !== -1) {
            $scope.addSearch($scope.list[$scope.curIndex].n);
            return $scope.curIndex = -1;
          }
      }
    };
    $scope.curClass = function(index) {
      if (index === $scope.curIndex) {
        return 'cur';
      }
    };
    $scope.addSearch = function(q) {
      var arr;
      arr = $scope.q.split('+');
      arr.pop();
      arr.push(q);
      arr = _.filter(arr, function(item) {
        return item.length > 0;
      });
      $scope.q = arr.join('+') + '+';
      return $scope.toSearch();
    };
    return $scope.toSearch = function() {
      var q;
      q = getSearch();
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
    };
  });

}).call(this);
