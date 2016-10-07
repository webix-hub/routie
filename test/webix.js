var jsdom = require('mocha-jsdom')
var expect = require('chai').expect;
var fs = require("fs");

describe('routie webix', function(){
 
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


	it('route can be blocked', function(done){
		routie('name1', function() {
			return false;
		});

		window.location.hash = '#name1';

		setTimeout(function(){
			expect(window.location.hash).to.equal("");
			done();
		}, 20);
	});

	it('hash reverts to last one on blocking', function(done){
		routie('name1', function(){ });
		routie('name2', function(){
			return false;
		});

		routie('name1');

		setTimeout(function(){
			routie('name2');
			setTimeout(function(){
				expect(window.location.hash).to.equal("#name1");
				done();
			}, 50)
		}, 50);
	});

	it('hash reverting doesnt trigger route second time', function(done){
		var count = 0;
		routie('name1', function() {
			count+=10;
		});
		routie('name2', function() {
			count+=1;
			return false;
		});

		routie('name1');
		setTimeout(function(){
			routie('name2');
			setTimeout(function(){
				expect(count).to.equal(11);
				done();
			}, 20)
		}, 20);
	});

})