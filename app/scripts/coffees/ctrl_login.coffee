window.App.controller 'LoginController', (log, jing, audio, gui, store, events, $scope)->
	$scope.loading = no
	$scope.error   = no
	$scope.submit = ->
		$scope.error   = no
		$scope.loading = yes
		jing.login $scope.email, $scope.password, ->
			store.set 'email', $scope.email
			store.set 'pwd',   $scope.password
			events.emit 'login', yes
			$scope.$apply -> 
				$scope.loading = no
		,(msg)->
			$scope.$apply -> 
				$scope.loading = no
				$scope.error   = msg

	$scope.open = (href)->
		 gui.Shell.openExternal(href);


	email = store.get 'email'
	pwd   = store.get 'pwd'

	if email
		$scope.email    = email
		if pwd
			$scope.password = pwd
			$scope.submit()