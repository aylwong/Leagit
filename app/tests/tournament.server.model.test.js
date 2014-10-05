'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Competitor = mongoose.model('Competitor'),
	Tournament = mongoose.model('Tournament');

/**
 * Globals
 */
var user, tournament;

/**
 * Unit tests
 */
describe('Tournament Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() {
			tournament = new Tournament({
				name: 'Competitor Name',
				type: 'Ad Hoc',
				matches: [],
				competitors: [],
				description: 'Competitor Description',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return tournament.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without title', function(done) {
			tournament.name = '';

			return tournament.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});
	// TODO: Test make a tournament with matches, competitors, and no type
	afterEach(function(done) {
		Tournament.remove().exec();
		User.remove().exec();
		done();
	});
});
