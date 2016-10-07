var jsdom = require('mocha-jsdom')
var expect = require('chai').expect;
var fs = require("fs");


describe('named routes', function() {

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

	it('Allow for named routes', function() {
		routie('namedRoute name/', function() {});
		expect(routie.lookup('namedRoute')).to.equal('name/');
	});

	it('Routes should still work the same', function(done) {
		routie('namedRoute url/name2/', done);
		routie('url/name2/');

	});

	it('Allow for named routes with params', function() {
		routie({
			'namedRoute name2/:param': function() { }
		});

		expect(routie.lookup('namedRoute', { param: 'test' })).to.equal('name2/test');
	});

	it('Allow for named routes with optional params', function() {
		routie({
			'namedRoute name2/:param?': function() { }
		});

		expect(routie.lookup('namedRoute')).to.equal('name2/');
	});

	it('Allow for named routes with optional params', function() {
		routie({
			'namedRoute name2/:param?': function() { }
		});

		expect(routie.lookup('namedRoute', { param: 'test' })).to.equal('name2/test');
	});

	it('Error if param not passed in', function() {
		routie({
			'namedRoute name2/:param': function() { }
		});

		expect(function() {
			routie.lookup('namedRoute');
		}).to.throw();
	});

	it('This contains named route', function(done) {
		routie('namedRoute test/:param', function() {
			expect(this.name).to.equal('namedRoute');
			expect(this.params.param).to.equal('bob');
			done();
		});
		routie('test/bob');
	});
});