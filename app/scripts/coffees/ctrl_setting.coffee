window.App.controller 'SettingController', (log, jing, audio, events, store, $scope)->
	
	$scope.logout = ->
		audio.src = ''
		$audio = window.angular.element audio
		$audio.off 'play' 		
		$audio.off 'pause' 		
		$audio.off 'canplay' 		
		$audio.off 'ended'
		$audio.off 'timeupdate'	

		jing.logout()
		store.remove 'pwd'
		events.emit 'login', no