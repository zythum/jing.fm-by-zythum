var fs        = require("fs")
var zip       = require("node-native-zip")
var process   = require('child_process');
var log       = console.log;

var appDir    = '../app'
var distDir   = '../dist'
var nwDir     = '../nw'
var nwName    = 'app.nw'
var sourceDir = appDir
var ignores   = [ '.DS_Store' ]

var archive   = new zip

archive.addFiles(files(sourceDir).map(function (filePath) {
		return {
			name: filePath.replace(sourceDir+'/', ''),
			path: filePath
		}
	}), 
	function (err) {
		if (err) return log('err while ziping', err)
		fs.writeFile(
			[nwDir, '/', nwName].join(''), 
			archive.toBuffer(),
			function (err) {
				if (err) return log('err while writing app.nw', err)
				log("Finished: app/app.nw");
				require('child_process').exec('open ../nw/app.nw')
			}
		)
	}
)

function files (root) {
	var result = [];
	fs.readdirSync(root).forEach(function(file) {
		var path = root + "/" + file
		var stat = fs.lstatSync(path)
		if (stat === undefined || ignores.indexOf(file) >= 0) return
		if ( !stat.isDirectory() ) result.push(path)
		else result = result.concat( files(path) )
	})
	return result
}