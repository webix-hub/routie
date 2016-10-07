var jsdom = require('mocha-jsdom')
var expect = require('chai').expect;
var fs = require("fs");

describe('routes navigation', function() {

	if (typeof module != "undefined"){
		jsdom({
			src: fs.readFileSync('./lib/routie.js', 'utf-8')
		})
	}

	beforeEach(function(done) {
		routie.removeAll();
		window.location.hash = '';
		setTimeout(done, 20);
	});


	it('Call routie.navigate to change hash', function(done) {
		//same as routie('nav-test');
		routie.navigate('nav-test');
		setTimeout(function() {
			expect(window.location.hash).to.equal('#nav-test');
			done();
		}, 20);
	});

	it('Pass in {silent: true} to not trigger route', function(done) {

		var called = 0;

		routie('silent-test', function() {
			called++;
		});

		routie.navigate('silent-test', { silent: true });

		setTimeout(function() {
			expect(called).to.equal(0);
			expect(window.location.hash).to.equal('#silent-test');
			done();
		}, 20);
	});
});
