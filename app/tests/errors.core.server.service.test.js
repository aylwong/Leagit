'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    errorService = require('../../app/services/errors.core');
	
/**
 * Globals
 */
var user, match1, tournament;

/**
 * Unit tests
 */
describe('Core Error Service Unit Tests:', function() {
	beforeEach(function(done) {
	// whatever things you need to insantiate
			done();
		});

	describe('getErrorMessage', function() {
		it('should return a message based on an error code', function(done) {
			var err = {};
			err.code = 11000;

			var result = errorService.getErrorMessage(err);
			(result.length>0).should.be.exactly(true);
			done();
		});

		it('should return a generic message if no error code', function(done) {
			var err = {};

			var result = errorService.getErrorMessage(err);
			(result.length>0).should.be.exactly(true);
			done();
		});
	});

	describe('sendError', function() {
		it('should return a message based on an error code', function(done) {
			var err = {};
			var res = {};
			res.send = function(code, errorArray) {
				res.code=code;
				res.errorArray = errorArray;
			};

			var errorFunc = errorService.sendError(res);
			errorFunc(err);
			(res.code===400).should.be.exactly(true);
			(res.errorArray.message.length>0).should.be.exactly(true);
			done();
		});
	});

	// TODO: Test make a match with matches, competitors, and no type
	afterEach(function(done) {
		done();
	});
});
