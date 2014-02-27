window.App.controller 'AppController', (log, gui, jing, events, $scope)->

	$apply = (fn)->
		if $scope.$$phase || $scope.$root.$$phase then fn() else $scope.$apply fn

	win = gui.Window.get()
	gui.App.on 'reopen', -> win.show()
	win.show()
	window.focus()

	$scope.title = 'JING.fm'
	$scope.isLogin = no
	$scope.modtpl  = -> (if $scope.isLogin then 'player' else 'login') + '.html'
	$scope.hide    = -> win.show no

	events.on 'hide', ()->
		win.show no

	events.on 'login', (isLogin)-> $apply ->
		$scope.isLogin = isLogin

	events.on 'title', (title, limit)-> $apply ->
		$scope.title = title

