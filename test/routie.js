var jsdom = require('mocha-jsdom')
var expect = require('chai').expect;
var fs = require("fs");

describe('routie basics', function(){
 
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


	it('Can be initialized in non-conflict mode', function(){
		var r = routie.noConflict();
		expect(typeof window.routie).to.equal('undefined');
		window.routie = r;
	})

	it('Trigger empty routie when url has not hash', function(done){
		window.location.hash = '';
		//should be called right away since there is no hash
		routie('', function() {
			done();
		});
	})

	it('Trigger route by its name', function(done){
		routie('test', function() {
			done();
		});
		window.location.hash = '#test';
	})

	it('Accepts an object', function(done) {
		routie({
			'test2': function(){ done(); }
		});
		window.location.hash = '#test2';
	});

	it('Calls the same route more than once', function(done) {
		var runCount = 0;
		routie('test8', function() {
			runCount++;
		});
		routie('test8', function() {
			expect(runCount).to.equal(1);
			done();
		});
		window.location.hash = '#test8';
	});

	it('Navigate to hash', function(done) {
		routie('#test3')
		setTimeout(function(){
			expect(window.location.hash).to.equal('#test3');
			done();
		}, 20);
	});

	it('Removes route', function(done) {
		var check = false;
		var test9 = function() {
			check = true;
		};

		routie('test9', test9);
		routie.remove('test9', test9);

		window.location.hash = '#test9';

		setTimeout(function(){
			expect(check).to.equal(false);
			done();
		}, 20);
	});

	it('Removes all routes', function(done) {
		var check = false;
		var test9 = function() {
			check = true;
		};
		var test20 = function() {
			check = true;
		};

		routie('test9', test9);
		routie('test20', test20);
		routie.removeAll();

		window.location.hash = '#test9';

		setTimeout(function() {
			window.location.hash = 'test20';
		}, 20);
		setTimeout(function() {
			expect(check).to.equal(false);
			done();
		}, 40);
	});

	it('Regex support', function(done) {

		routie('test4/:name', function(name) {
			expect(name).to.equal('bob');
			expect(this.params.name).to.equal('bob');
			done();
		});

		routie('test4/bob');
	});

	it('Optional param support', function(done) {
		routie('test5/:name?', function(name) {
			expect(name).to.equal(undefined);
			expect(this.params.name).to.equal(undefined);
			done();
		});

		routie('test5/');
	});

	it('Wildcard', function(done) {
		routie('test7/*', function() {
			done();
		});
		routie('test7/123/123asd');
	});

	it('Catch all', function(done) {
		routie('*', function() {
			done();
		});
		routie('test6');
	});

	it('This set with data about the route', function(done) {
		routie('test', function() {
			expect(this.path).to.equal('test');
			done();
		});
		routie('test');
	});

	it('Double fire bug', function(done) {
		var called = 0;
		routie({
			'splash1': function() {
				routie('splash2');
			},
			'splash2': function() {
				called++;
			}
		});

		routie('splash1');

		setTimeout(function() {
			expect(called).to.equal(1);
			done();
		}, 100);
	});

	it('Only first route is run', function(done) {
		var count = 0;
		routie({
			'test*': function() {
				count++;
			},
			'test10': function() {
				count++;
			}
		});

		routie('test10');

		setTimeout(function() {
			expect(count).to.equal(1);
			done();
		}, 100);
	});

	it('Fallback not called if something else matches', function(done) {
		var count = 0;
		routie({
			'': function() {
				//root
			},
			'test11': function() {
				count++;
			},
			'*': function() {
				count++;
			}
		});

		routie('test11');

		setTimeout(function() {
			expect(count).to.equal(1);
			done();
		}, 100);
	});

	it('Fallback called if nothing else matches', function(done) {
		var count = 0;
		routie({
			'': function() {
				//root
			},
			'test11': function() {
				count++;
			},
			'*': function() {
				count++;
			}
		});

		routie('test12');

		setTimeout(function() {
			expect(count).to.equal(1);
			done();
		}, 100);
	});

})