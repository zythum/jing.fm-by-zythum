_ = require 'underscore'

window.App.factory 'pldHelper', (log, jing)->
	
	helper = (pld)->
		pld.cover = jing.scover pld.fid, 'song'
		return pld

	return (pldOrPlds)->
		if window.angular.isArray(pldOrPlds)
			_.each pldOrPlds, (pld)-> helper(pld)
		else helper(pldOrPlds)

		return pldOrPlds
