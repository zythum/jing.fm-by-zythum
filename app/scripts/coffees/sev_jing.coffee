req = require 'request'
_   = require 'underscore'

window.App.factory 'jing', (log)->
	class JingCore
		constructor: ->
			@isLogin = no
			@token_headers = {}
			@token_id
			@_usr = {}
		#处理拼装url请求地址
		url: (path)=>
			urlBase = 'http://jing.fm/api/v1'
			[ urlBase, path ].join '/'
		#登陆操作
		login: (email, pwd, cb, fcb)=>
			cb  = cb or ->
			fcb = fcb or ->
			opts = 
				url: @url 'sessions/create'
				form:
					email: email
					pwd: pwd
				json: yes

			req.post opts, (err, res, body)=>
				if err then	return log 'login io error'
				if body.success is no
					fcb body.codemsg
				else
					@isLogin = yes
					_.each res.headers, (value, key)=>
						if -1 < key.indexOf 'jing'
							@token_headers[key] = value

					@token_id = body.result.usr.id
					cb body.result
		
		#登出
		logout: ()=>
			@isLogin = no
			@token_headers = {}
			@token_id
			@_usr = {}

		#获取个人信息/设置，以及上次播放信息
		validates: (cb)=>
			cb = cb or ->
			opts = 			
				url: @url 'sessions/validates'
				headers: @token_headers
				form:
					i: ''
				json: yes
			req.post opts, (err, res, body)=>
				if err then return log 'login io error'
				cb(body.result)
		#获取个人信息
		usr: (cb)=>
			cb = cb or ->
			if @_usr.id
				cb(@_usr)
			else
				@validates (rs)=> cb _.extend @_usr, rs.usr
		#是否加星
		isStar: (tid, cb)=>
			cb = cb or ->
			@usr (usr)=>
				opts = 
					url: @url 'music/fetch_track_infos'
					headers: @token_headers
					form:
						uid: usr.id
						tid: tid
					json: yes
				req.post opts, (err, res, body)=>
					if err then return log 'isStar error'
					cb body.result.lvd is 'l'
		#加星
		star: (tid, bool, cb)=>
			cb = cb or ->
			@usr (usr)=>
				opts = 
					url: @url 'music/post_love_song'
					headers: @token_headers
					form:
						uid: usr.id
						tid: tid
						c:   if bool then 2 else 1
					json: yes
				req.post opts, (err, res, body)=>
					if err then return log 'star error'
					cb body.result
		
		notLike: (tid, bool)=>
			cb = cb or ->
			@usr (usr)=>
				opts = 
					url: @url 'music/post_hate_song'
					headers: @token_headers
					form:
						uid: usr.id
						tid: tid
						c:   if bool then 1 else 2
					json: yes
				req.post opts, (err, res, body)=>
					if err then return log 'star error'
					cb body.result

		#获取播放歌曲
		fetch_pls: (params, cb)=>
			cb = cb or ->
			@usr (usr)=>
				opts = 
					url:  @url 'search/jing/fetch_pls'
					headers: @token_headers
					form: _.extend params, u: usr.id, mt: ''
					json: yes
				req.post opts, (err, res, body)=>
					log body
					if err then return log 'fetch_pls error'
					cb body.result
		#获取推荐
		fetch_pop: (q, cb)=>
			cb = cb or ->
			@usr (usr)=>
				opts = 
					url:  @url 'badge/fetch_pop'
					headers: @token_headers
					form:
						u:   usr.id
						q:   q
						ps:  8
						st:  0
					json: yes
				req.post opts, (err, res, body)=>
					if err then return log 'fetch_pop error'
					cb body.result

		#获取推荐 这个更好！
		fetch_natural: (cb)=>
			cb = cb or ->
			opts = 
				url:  @url 'app/fetch_natural'
				headers: @token_headers
				form:
					ps:  8
				json: yes
			req.post opts, (err, res, body)=>
				if err then return log 'fetch_natural error'
				cb body.result

		#获取输入联想
		search: (q, cb)=>
			cb = cb or ->
			@usr (usr)=>
				opts = 
					url:  @url 'search/ling/auto'
					headers: @token_headers
					form:
						uid: usr.id
						q:   q
						ps:  8
						st:  0
					json: yes
				req.post opts, (err, res, body)=>
					if err then return log 'search error'
					cb body.result
		
		#获取加星的歌曲
		starSongs: (params, cb)=>
			cb = cb or ->
			@usr (usr)=>
				opts = 
					url:  @url 'music/fetch_favorites'
					headers: @token_headers
					form: 
						uid:  usr.id
						ouid: usr.id
						st:   params.st
						ps:   params.ps
					json: yes
				req.post opts, (err, res, body)=>
					if err then return log 'starSongs error'
					cb body.result
		
		#获取榜单列表
		tops: (nodeids, cb)=>
			cb = cb or ->
			@usr (usr)=>
				opts = 
					url:  @url 'chart/fetch'
					headers: @token_headers
					form: 
						uid:      usr.id
						nodeids: nodeids
					json: yes
				req.post opts, (err, res, body)=>
					if err then return log 'tops error'
					cb body.result

		#获取歌曲的绝对地址
		surl: (mid, cb)=>
			cb = cb or ->
			opts = 
				url: @url 'media/song/surl'
				headers: @token_headers
				form: 
					mid:  mid
					type: 'NO'
					isp:  'CC'
				json: yes
			req.post opts, (err, res, body)=>
				if err then return log 'surl error'
				cb body.result
		
		#提交状态参数
		playData: (q, tid, ct, cb)=>
			cb = cb or ->
			@usr (usr)=>
				opts = 
					url:  @url 'click/playdata/post'
					headers: @token_headers
					form: 
						uid:  usr.id
						cmbt: q
						tid:  tid
						ct:   ct 
					json: yes
				req.post opts, (err, res, body)=>
					if err then return log 'playData error'
					cb body.result

		#提交状态参数
		playData_href: (tid, cb)=>
			cb = cb or ->
			@usr (usr)=>
				opts = 
					url:  @url 'music/post_half'
					headers: @token_headers
					form: 
						uid:  usr.id
						tid:  tid
					json: yes
				req.post opts, (err, res, body)=>
					if err then return log 'playData_href error'
					cb body.result

		#提交状态参数
		playData_end: (tid, d, cb)=>
			cb = cb or ->
			@usr (usr)=>
				opts = 
					url:  @url 'click/playduration/post'
					headers: @token_headers
					form: 
						uid:  usr.id
						d:    d
					json: yes
				req.post opts, (err, res, body)=>
					if err then return log 'playData_end error'
					cb body.result

		#获取图片绝对地址
		scover: (fid, type)=>
			if type is 'badge'
          		return 'http://img.jing.fm/assets/jing/badges/100/' + fid + '.jpg'
			
			type = {
				song:   ['album/AM/',  '/AM']
				artist: ['artist/SM/', '/SM']
				chart:  ['chart/BN/',  '/BN']
			}[type]
			
			return 'http://img.jing.fm/' + type[0] + [fid.substr(0, 4), fid.substr(4, 4), fid.substr(8, 2), fid.substr(10, 2)].join('/') + type[1] + fid

	new JingCore
