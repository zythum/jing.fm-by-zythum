window.App.factory 'store', ()->
	storage = window.localStorage

	set    = (k, v)-> storage.setItem k, v
	get    = (k)-> storage.getItem k
	remove = (k)-> storage.removeItem k

	return set:set, get:get, remove:remove