_ = require 'underscore'

window.App.controller 'SearchController', (log, jing, events, pldHelper, $scope, $element)->
	
	$apply = (fn)->
		if $scope.$$phase || $scope.$root.$$phase then fn() else $scope.$apply fn
	
	getSearch = ->
		arr = $scope.q.split '+'
		arr = _.filter arr, (item)->item.length > 0
		arr.join('+')

	$scope.q = '';
	$scope.search = '';
	$scope.list = [];
	$scope.curIndex = -1;

	$scope.$watch 'search', (value)->
		if value.length is 0
			jing.fetch_natural (rs)->
				if $scope.search is value 
					_.each rs.items, (item)-> 
						item.cover = jing.scover item.fid, 'song'
						item.n     = item.sw
					$apply -> $scope.list = rs.items
		else
			jing.search value, (rs)->
				if $scope.search is value 
					_.each rs, (item)-> item.cover = jing.scover item.fid, item.t
					$apply -> $scope.list = rs

	$scope.$watch 'q', (value)->
		$scope.curIndex = -1;
		value = value.split '+'
		value = value[value.length-1]
		$scope.search = value.trim()
	
	$scope.curChange = (e)->
		switch (e.which)
			#down
			when 40 
				$scope.curIndex+= 1 if $scope.curIndex < $scope.list.length - 1
				e.preventDefault()
			#up
			when 38
				$scope.curIndex-= 1 if $scope.curIndex > -1
				e.preventDefault()
			#enter
			when 13
				if $scope.curIndex != -1
					$scope.addSearch $scope.list[$scope.curIndex].n
					$scope.curIndex = -1


	$scope.curClass = (index)->
		'cur' if index is $scope.curIndex

	$scope.addSearch = (q)-> 
		arr = $scope.q.split '+'
		arr.pop()
		arr.push q
		arr = _.filter arr, (item)-> item.length > 0
		$scope.q = arr.join('+') + '+'
		$scope.toSearch()
		# $element[0].querySelector('[ng-model=q]').focus()


	$scope.toSearch = ()->
		q = getSearch()
		jing.fetch_pls {q: q, ps:5, st:0, tid:0 ,ss: yes}, (rs)->
			if rs.items.length > 0
				rs.q  = q
				rs.st = 5
				pldHelper rs.items
				events.emit 'changeQ', rs
