/**
 * To debug gruntfile:
 * node-debug $(which grunt) task
 */

module.exports = function(grunt) {
	
	global.grunt = grunt;

	// Project configuration.
	grunt.initConfig({
		mochaTest: {
			test: {
				options: {
					ui : 'bdd',
					reporter: 'spec',
				},
				//We require all our tests in the conf file, so we
				//can do some pre-test functions before they are run.
				src: ['./test/mocha.conf.js']
			}
		}
	});

	grunt.registerTask('doc','Documentation generation task',function(deferred){
		var done = this.async();
		var exec = require('child_process').exec, child;
		child = exec('jsdoc2md "src/*.js"', function (error, stdout, stderr) {
			//console.log('stdout: ' + stdout);
			//console.log('stderr: ' + stderr);
			if (error !== null) {
				grunt.log.error('Exec error: ' + error);
			}

			//Reformat documentation to reflect correct method naming.
			var str = stdout.replace(/new /g,'')
											.replace(/_public\./g,'');

			//Inject into markdown file	
			//Get README
			var fs = require('fs');
			var readme = fs.readFileSync("./README.md",{
				encoding : "utf-8"
			});

			readme = readme.replace(/<!--API-REF-->((?:.|[\r\n])*)<!--END-API-REF-->/m,
				'<!--API-REF-->\n'+str+'\n<!--END-API-REF-->');

			fs.writeFileSync("./README.md",readme);

			done();
		});
	});

	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.registerTask('test', [
		'mochaTest:test'
	]);
	
	grunt.registerTask('t', [
		'mochaTest:test'
	]);

	grunt.registerTask('test-travis', [
		'mochaTest:test'
	]);

	grunt.registerTask('default', [
		'doc'
	]);
};