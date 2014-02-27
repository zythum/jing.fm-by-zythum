_ = require 'underscore'
window.App.controller 'StarController', (log, jing, events, pldHelper, $scope)->
	
	$apply = (fn)->
		if $scope.$$phase || $scope.$root.$$phase then fn() else $scope.$apply fn

	$scope.starSongs = []
	$scope.st = 0
	$scope.ps = 20

	isFatching = no

	fetch = ()->
		isFatching = yes
		jing.starSongs {st: $scope.st, ps: $scope.ps}, (rs)-> $apply ->
			$scope.st += rs.items.length
			$scope.total = rs.total
			_.each rs.items, (song)->
				song.cover = jing.scover song.fid, 'song'
				$scope.starSongs.push song

			isFatching = no

	fetch()

	$scope.fetch = ()->
		delete $scope.total
		fetch()

	$scope.fetchText = ()->
		if $scope.total?
			last = $scope.total - $scope.st
			return 'More ' + last + ' song' + 's' if last > 1
		else
			return 'Loading...'

	$scope.cancelStar = (index)->
		unstar = $scope.starSongs.splice(index, 1);
		$scope.st -= 1
		$scope.total -= 1
		jing.star unstar[0].id, no

	$scope.toStar = ()-> jing.usr (usr)-> 
		q = '@' + usr.nick
		jing.fetch_pls {q: q, ps:5, st:0, tid:0 ,ss: yes}, (rs)->
			if rs.items.length > 0
				rs.q  = q
				rs.st = 5
				pldHelper rs.items
				events.emit 'changeQ', rs
