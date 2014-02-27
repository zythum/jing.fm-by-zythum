window.App.controller 'PlayerController', (log, jing, audio, Queue, pldHelper, events, $scope)->
	
	$scope.q             = null
	$scope.pld           = null
	$scope.playing       = no
	$scope.isHalf        = no
	$scope.isShowSetting = no
	$scope.settingMod    = 'search'
	st                   = 0
	ps                   = 5
	pld_index            = -1
	total                = null
	isFetch              = yes
	plds                 = new Queue

	settingModTplMap = 
		search:         'search.html'
		star:           'star.html'
		setting:        'setting.html'
		top:            'top.html'

	$apply = (fn)->
		if $scope.$$phase || $scope.$root.$$phase then fn() else $scope.$apply fn

	play = (pld)-> $apply ->
		$scope.isHalf = no
		$scope.pld    = pld
		((mid)->
			jing.surl mid, (url)-> if $scope.pld.mid is mid then audio.src = url
		)(pld.mid)
		

	fetch = (cb)-> $apply ->
		if not isFetch then return cb(plds)
		cb = cb or ->
		jing.fetch_pls {q:$scope.q, ps:ps, st:st, tid:0 ,ss: yes}, (rs)-> $apply ->
			$scope.st += rs.items.length
			total = rs.total
			plds.push pldHelper rs.items
			cb plds

	playNext = ->
		if plds.size() == 0
			return fetch playNext()
		if total - 1 is pld_index            then play plds.get pld_index = 0
		else if plds.size() - 1 is pld_index then fetch -> play plds.get pld_index += 1
		else                                      play plds.get pld_index += 1

		if total != plds.size() and plds.size() - pld_index < 2 then fetch()

	$scope.hide = ->
		events.emit 'hide'

	$scope.settingClass = ->
		'setting' if $scope.isShowSetting
	
	$scope.toggleSetting = (bool)->
		$scope.isShowSetting = bool
		$scope.settingMod = 'search'

	$scope.settingModTpl = ()-> 
		settingModTplMap[$scope.settingMod]

	$scope.setSettingMod = (mod)-> 
		$scope.settingMod = mod

	$scope.isSettingModToToggleClass = (mod)->
		'cur' if $scope.settingMod is mod

	$scope.playOrPauseIcon = -> 
		if $scope.playing then 'fa-pause' else 'fa-play'
	
	$scope.starOrnotIcon = ->
		if $scope.pld and $scope.pld.star then 'fa-star star' else 'fa-star-o'

	$scope.toogleStar = ->
		star = not $scope.pld.star
		jing.star $scope.pld.tid, star, -> $apply ->
			$scope.pld.star = star

	$scope.tooglePlay = ->
		if audio.paused then audio.play() else audio.pause()
	
	$scope.notLike = ->
		jing.notLike $scope.pld.tid, yes, $apply ->
			$scope.next()

	$scope.next = ->
		$scope.playing = !audio.paused		
		playNext()



	#初始化
	jing.validates (rs)-> $apply ->
		log rs
		$scope.q = rs.pld.cmbt
		play pldHelper rs.pld
		fetch()

	events.on 'changeQ', (q)->
		if q
			st        =  q.items.length
			pld_index = -1
			isFetch   = not q.noFatch
			total     = q.total
			$scope.q  = q.q

			plds.empty()
			plds.push q.items
			playNext()
			$scope.toggleSetting no
	
	$audio = window.angular.element audio
	$audio.on 'play',    -> $apply -> $scope.playing = !audio.paused
	$audio.on 'pause',   -> $apply -> $scope.playing = !audio.paused
	$audio.on 'canplay', -> audio.play()
	$audio.on 'ended',   -> 
		if isFetch then jing.playData_end $scope.pld.tid, audio.duration
		$apply -> $scope.next()
	$audio.on 'timeupdate', ->
		if isFetch
			if audio.currentTime % 30 is 0
				jing.playData $scope.q, $scope.pld.tid, audio.currentTime
			if audio.currentTime * 2 > audio.duration
				jing.playData_href $scope.pld.tid

		