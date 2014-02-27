_ = require 'underscore'
window.App.controller 'TopController', (log, jing, events, pldHelper, $scope)->
	
	$apply = (fn)->
		if $scope.$$phase || $scope.$root.$$phase then fn() else $scope.$apply fn

	$scope.tops  = []
	$scope.child = {}

	jing.tops '0', (rs)-> $apply ->
		rs = rs[0].items
		_.each rs, (top)-> top.cover = jing.scover top.fid, 'chart'
		$scope.tops = rs

	$scope.nextMode = no

	$scope.loading = no

	$scope.nextModeClass = ()-> 'child' if $scope.nextMode

	$scope.next = (index)->
		$scope.nextMode = not $scope.nextMode
		if $scope.nextMode
			$scope.child = {}
			((id)->
				$scope.loading = yes
				jing.tops id, (rs)-> $apply ->
					$scope.child.title = rs[id].name
					$scope.child.items = []
					nodeids = []
					_.each rs[id].items, (o)-> nodeids.push o.next
					jing.tops nodeids.join(','), (rs)-> $apply ->
						_.each nodeids, (o)->
							$scope.child.items.push title: rs[o].name, items: rs[o].items
						$scope.loading = no
			)($scope.tops[index].next)

	$scope.ok = (o, q...)->
		jing.tops o.next, (rs)->
			rs   =  rs[o.next]
			rs.q =  q.join '-'
			rs.noFatch = yes
			pldHelper rs.items
			events.emit 'changeQ', rs