_      = require 'underscore'
events = require 'events'
window.App.factory 'Queue', (log)->

	class Queue

		constructor: (array)->
			@array = [].concat array or []
			@event = new events.EventEmitter

		pop: =>
			@event.emit 'pop', pop = @array.pop()
			return pop;

		push: (arrayOrItem)=>
			arrayOrItem = if window.angular.isArray(arrayOrItem) then arrayOrItem else [arrayOrItem]
			_.each arrayOrItem, (item)=> @array.push item
			@event.emit 'push', arrayOrItem

		get: (index)=> @array[index]

		empty: =>
			loop
				@array.pop()
				break if @size() is 0

		size: => @array.length
		length: => @array.length

	return Queue