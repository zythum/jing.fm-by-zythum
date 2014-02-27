(function() {
  var req, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  req = require('request');

  _ = require('underscore');

  window.App.factory('jing', function(log) {
    var JingCore;
    JingCore = (function() {
      function JingCore() {
        this.scover = __bind(this.scover, this);
        this.playData_end = __bind(this.playData_end, this);
        this.playData_href = __bind(this.playData_href, this);
        this.playData = __bind(this.playData, this);
        this.surl = __bind(this.surl, this);
        this.tops = __bind(this.tops, this);
        this.starSongs = __bind(this.starSongs, this);
        this.search = __bind(this.search, this);
        this.fetch_natural = __bind(this.fetch_natural, this);
        this.fetch_pop = __bind(this.fetch_pop, this);
        this.fetch_pls = __bind(this.fetch_pls, this);
        this.notLike = __bind(this.notLike, this);
        this.star = __bind(this.star, this);
        this.isStar = __bind(this.isStar, this);
        this.usr = __bind(this.usr, this);
        this.validates = __bind(this.validates, this);
        this.logout = __bind(this.logout, this);
        this.login = __bind(this.login, this);
        this.url = __bind(this.url, this);
        this.isLogin = false;
        this.token_headers = {};
        this.token_id;
        this._usr = {};
      }

      JingCore.prototype.url = function(path) {
        var urlBase;
        urlBase = 'http://jing.fm/api/v1';
        return [urlBase, path].join('/');
      };

      JingCore.prototype.login = function(email, pwd, cb, fcb) {
        var opts,
          _this = this;
        cb = cb || function() {};
        fcb = fcb || function() {};
        opts = {
          url: this.url('sessions/create'),
          form: {
            email: email,
            pwd: pwd
          },
          json: true
        };
        return req.post(opts, function(err, res, body) {
          if (err) {
            return log('login io error');
          }
          if (body.success === false) {
            return fcb(body.codemsg);
          } else {
            _this.isLogin = true;
            _.each(res.headers, function(value, key) {
              if (-1 < key.indexOf('jing')) {
                return _this.token_headers[key] = value;
              }
            });
            _this.token_id = body.result.usr.id;
            return cb(body.result);
          }
        });
      };

      JingCore.prototype.logout = function() {
        this.isLogin = false;
        this.token_headers = {};
        this.token_id;
        return this._usr = {};
      };

      JingCore.prototype.validates = function(cb) {
        var opts,
          _this = this;
        cb = cb || function() {};
        opts = {
          url: this.url('sessions/validates'),
          headers: this.token_headers,
          form: {
            i: ''
          },
          json: true
        };
        return req.post(opts, function(err, res, body) {
          if (err) {
            return log('login io error');
          }
          return cb(body.result);
        });
      };

      JingCore.prototype.usr = function(cb) {
        var _this = this;
        cb = cb || function() {};
        if (this._usr.id) {
          return cb(this._usr);
        } else {
          return this.validates(function(rs) {
            return cb(_.extend(_this._usr, rs.usr));
          });
        }
      };

      JingCore.prototype.isStar = function(tid, cb) {
        var _this = this;
        cb = cb || function() {};
        return this.usr(function(usr) {
          var opts;
          opts = {
            url: _this.url('music/fetch_track_infos'),
            headers: _this.token_headers,
            form: {
              uid: usr.id,
              tid: tid
            },
            json: true
          };
          return req.post(opts, function(err, res, body) {
            if (err) {
              return log('isStar error');
            }
            return cb(body.result.lvd === 'l');
          });
        });
      };

      JingCore.prototype.star = function(tid, bool, cb) {
        var _this = this;
        cb = cb || function() {};
        return this.usr(function(usr) {
          var opts;
          opts = {
            url: _this.url('music/post_love_song'),
            headers: _this.token_headers,
            form: {
              uid: usr.id,
              tid: tid,
              c: bool ? 2 : 1
            },
            json: true
          };
          return req.post(opts, function(err, res, body) {
            if (err) {
              return log('star error');
            }
            return cb(body.result);
          });
        });
      };

      JingCore.prototype.notLike = function(tid, bool) {
        var cb,
          _this = this;
        cb = cb || function() {};
        return this.usr(function(usr) {
          var opts;
          opts = {
            url: _this.url('music/post_hate_song'),
            headers: _this.token_headers,
            form: {
              uid: usr.id,
              tid: tid,
              c: bool ? 1 : 2
            },
            json: true
          };
          return req.post(opts, function(err, res, body) {
            if (err) {
              return log('star error');
            }
            return cb(body.result);
          });
        });
      };

      JingCore.prototype.fetch_pls = function(params, cb) {
        var _this = this;
        cb = cb || function() {};
        return this.usr(function(usr) {
          var opts;
          opts = {
            url: _this.url('search/jing/fetch_pls'),
            headers: _this.token_headers,
            form: _.extend(params, {
              u: usr.id,
              mt: ''
            }),
            json: true
          };
          return req.post(opts, function(err, res, body) {
            log(body);
            if (err) {
              return log('fetch_pls error');
            }
            return cb(body.result);
          });
        });
      };

      JingCore.prototype.fetch_pop = function(q, cb) {
        var _this = this;
        cb = cb || function() {};
        return this.usr(function(usr) {
          var opts;
          opts = {
            url: _this.url('badge/fetch_pop'),
            headers: _this.token_headers,
            form: {
              u: usr.id,
              q: q,
              ps: 8,
              st: 0
            },
            json: true
          };
          return req.post(opts, function(err, res, body) {
            if (err) {
              return log('fetch_pop error');
            }
            return cb(body.result);
          });
        });
      };

      JingCore.prototype.fetch_natural = function(cb) {
        var opts,
          _this = this;
        cb = cb || function() {};
        opts = {
          url: this.url('app/fetch_natural'),
          headers: this.token_headers,
          form: {
            ps: 8
          },
          json: true
        };
        return req.post(opts, function(err, res, body) {
          if (err) {
            return log('fetch_natural error');
          }
          return cb(body.result);
        });
      };

      JingCore.prototype.search = function(q, cb) {
        var _this = this;
        cb = cb || function() {};
        return this.usr(function(usr) {
          var opts;
          opts = {
            url: _this.url('search/ling/auto'),
            headers: _this.token_headers,
            form: {
              uid: usr.id,
              q: q,
              ps: 8,
              st: 0
            },
            json: true
          };
          return req.post(opts, function(err, res, body) {
            if (err) {
              return log('search error');
            }
            return cb(body.result);
          });
        });
      };

      JingCore.prototype.starSongs = function(params, cb) {
        var _this = this;
        cb = cb || function() {};
        return this.usr(function(usr) {
          var opts;
          opts = {
            url: _this.url('music/fetch_favorites'),
            headers: _this.token_headers,
            form: {
              uid: usr.id,
              ouid: usr.id,
              st: params.st,
              ps: params.ps
            },
            json: true
          };
          return req.post(opts, function(err, res, body) {
            if (err) {
              return log('starSongs error');
            }
            return cb(body.result);
          });
        });
      };

      JingCore.prototype.tops = function(nodeids, cb) {
        var _this = this;
        cb = cb || function() {};
        return this.usr(function(usr) {
          var opts;
          opts = {
            url: _this.url('chart/fetch'),
            headers: _this.token_headers,
            form: {
              uid: usr.id,
              nodeids: nodeids
            },
            json: true
          };
          return req.post(opts, function(err, res, body) {
            if (err) {
              return log('tops error');
            }
            return cb(body.result);
          });
        });
      };

      JingCore.prototype.surl = function(mid, cb) {
        var opts,
          _this = this;
        cb = cb || function() {};
        opts = {
          url: this.url('media/song/surl'),
          headers: this.token_headers,
          form: {
            mid: mid,
            type: 'NO',
            isp: 'CC'
          },
          json: true
        };
        return req.post(opts, function(err, res, body) {
          if (err) {
            return log('surl error');
          }
          return cb(body.result);
        });
      };

      JingCore.prototype.playData = function(q, tid, ct, cb) {
        var _this = this;
        cb = cb || function() {};
        return this.usr(function(usr) {
          var opts;
          opts = {
            url: _this.url('click/playdata/post'),
            headers: _this.token_headers,
            form: {
              uid: usr.id,
              cmbt: q,
              tid: tid,
              ct: ct
            },
            json: true
          };
          return req.post(opts, function(err, res, body) {
            if (err) {
              return log('playData error');
            }
            return cb(body.result);
          });
        });
      };

      JingCore.prototype.playData_href = function(tid, cb) {
        var _this = this;
        cb = cb || function() {};
        return this.usr(function(usr) {
          var opts;
          opts = {
            url: _this.url('music/post_half'),
            headers: _this.token_headers,
            form: {
              uid: usr.id,
              tid: tid
            },
            json: true
          };
          return req.post(opts, function(err, res, body) {
            if (err) {
              return log('playData_href error');
            }
            return cb(body.result);
          });
        });
      };

      JingCore.prototype.playData_end = function(tid, d, cb) {
        var _this = this;
        cb = cb || function() {};
        return this.usr(function(usr) {
          var opts;
          opts = {
            url: _this.url('click/playduration/post'),
            headers: _this.token_headers,
            form: {
              uid: usr.id,
              d: d
            },
            json: true
          };
          return req.post(opts, function(err, res, body) {
            if (err) {
              return log('playData_end error');
            }
            return cb(body.result);
          });
        });
      };

      JingCore.prototype.scover = function(fid, type) {
        if (type === 'badge') {
          return 'http://img.jing.fm/assets/jing/badges/100/' + fid + '.jpg';
        }
        type = {
          song: ['album/AM/', '/AM'],
          artist: ['artist/SM/', '/SM'],
          chart: ['chart/BN/', '/BN']
        }[type];
        return 'http://img.jing.fm/' + type[0] + [fid.substr(0, 4), fid.substr(4, 4), fid.substr(8, 2), fid.substr(10, 2)].join('/') + type[1] + fid;
      };

      return JingCore;

    })();
    return new JingCore;
  });

}).call(this);
