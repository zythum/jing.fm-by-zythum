(function() {
  window.App.controller('PlayerController', function(log, jing, audio, Queue, pldHelper, events, $scope) {
    var $apply, $audio, fetch, isFetch, play, playNext, pld_index, plds, ps, settingModTplMap, st, total;
    $scope.q = null;
    $scope.pld = null;
    $scope.playing = false;
    $scope.isHalf = false;
    $scope.isShowSetting = false;
    $scope.settingMod = 'search';
    st = 0;
    ps = 5;
    pld_index = -1;
    total = null;
    isFetch = true;
    plds = new Queue;
    settingModTplMap = {
      search: 'search.html',
      star: 'star.html',
      setting: 'setting.html',
      top: 'top.html'
    };
    $apply = function(fn) {
      if ($scope.$$phase || $scope.$root.$$phase) {
        return fn();
      } else {
        return $scope.$apply(fn);
      }
    };
    play = function(pld) {
      return $apply(function() {
        $scope.isHalf = false;
        $scope.pld = pld;
        return (function(mid) {
          return jing.surl(mid, function(url) {
            if ($scope.pld.mid === mid) {
              return audio.src = url;
            }
          });
        })(pld.mid);
      });
    };
    fetch = function(cb) {
      return $apply(function() {
        if (!isFetch) {
          return cb(plds);
        }
        cb = cb || function() {};
        return jing.fetch_pls({
          q: $scope.q,
          ps: ps,
          st: st,
          tid: 0,
          ss: true
        }, function(rs) {
          return $apply(function() {
            $scope.st += rs.items.length;
            total = rs.total;
            plds.push(pldHelper(rs.items));
            return cb(plds);
          });
        });
      });
    };
    playNext = function() {
      if (plds.size() === 0) {
        return fetch(playNext());
      }
      if (total - 1 === pld_index) {
        play(plds.get(pld_index = 0));
      } else if (plds.size() - 1 === pld_index) {
        fetch(function() {
          return play(plds.get(pld_index += 1));
        });
      } else {
        play(plds.get(pld_index += 1));
      }
      if (total !== plds.size() && plds.size() - pld_index < 2) {
        return fetch();
      }
    };
    $scope.hide = function() {
      return events.emit('hide');
    };
    $scope.settingClass = function() {
      if ($scope.isShowSetting) {
        return 'setting';
      }
    };
    $scope.toggleSetting = function(bool) {
      $scope.isShowSetting = bool;
      return $scope.settingMod = 'search';
    };
    $scope.settingModTpl = function() {
      return settingModTplMap[$scope.settingMod];
    };
    $scope.setSettingMod = function(mod) {
      return $scope.settingMod = mod;
    };
    $scope.isSettingModToToggleClass = function(mod) {
      if ($scope.settingMod === mod) {
        return 'cur';
      }
    };
    $scope.playOrPauseIcon = function() {
      if ($scope.playing) {
        return 'fa-pause';
      } else {
        return 'fa-play';
      }
    };
    $scope.starOrnotIcon = function() {
      if ($scope.pld && $scope.pld.star) {
        return 'fa-star star';
      } else {
        return 'fa-star-o';
      }
    };
    $scope.toogleStar = function() {
      var star;
      star = !$scope.pld.star;
      return jing.star($scope.pld.tid, star, function() {
        return $apply(function() {
          return $scope.pld.star = star;
        });
      });
    };
    $scope.tooglePlay = function() {
      if (audio.paused) {
        return audio.play();
      } else {
        return audio.pause();
      }
    };
    $scope.notLike = function() {
      return jing.notLike($scope.pld.tid, true, $apply(function() {
        return $scope.next();
      }));
    };
    $scope.next = function() {
      $scope.playing = !audio.paused;
      return playNext();
    };
    jing.validates(function(rs) {
      return $apply(function() {
        log(rs);
        $scope.q = rs.pld.cmbt;
        play(pldHelper(rs.pld));
        return fetch();
      });
    });
    events.on('changeQ', function(q) {
      if (q) {
        st = q.items.length;
        pld_index = -1;
        isFetch = !q.noFatch;
        total = q.total;
        $scope.q = q.q;
        plds.empty();
        plds.push(q.items);
        playNext();
        return $scope.toggleSetting(false);
      }
    });
    $audio = window.angular.element(audio);
    $audio.on('play', function() {
      return $apply(function() {
        return $scope.playing = !audio.paused;
      });
    });
    $audio.on('pause', function() {
      return $apply(function() {
        return $scope.playing = !audio.paused;
      });
    });
    $audio.on('canplay', function() {
      return audio.play();
    });
    $audio.on('ended', function() {
      if (isFetch) {
        jing.playData_end($scope.pld.tid, audio.duration);
      }
      return $apply(function() {
        return $scope.next();
      });
    });
    return $audio.on('timeupdate', function() {
      if (isFetch) {
        if (audio.currentTime % 30 === 0) {
          jing.playData($scope.q, $scope.pld.tid, audio.currentTime);
        }
        if (audio.currentTime * 2 > audio.duration) {
          return jing.playData_href($scope.pld.tid);
        }
      }
    });
  });

}).call(this);
