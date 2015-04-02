'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Competitor = mongoose.model('Competitor'),
	Match = mongoose.model('Match'),
	Tournament = mongoose.model('Tournament');
	

/**
 * Globals
 */
var user, match1, tournament;

/**
 * Unit tests
 */
describe('Match Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});


		user.save(function(err, product) {
		  match1 = new Match({  name:'Match Name'
				    ,start_date: '2015/02/01'
				    ,end_date: '2015/02/10'
				    ,location:'Test Location'
				    ,competitors:['competitorId1'
				      ,'competitorId2'
				      ,'competitorId3'
				      ]
				    ,results:[]
				    ,description: 'Test Description'
				    ,status:'Pending'
				  });
			tournament = new Tournament({
				name: 'Competitor Name',
				type: 'Ad Hoc',
				matches: [],
				competitors: [],
				description: 'Competitor Description',
				user: user
			});

			tournament.matches.push(match1);

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			should.exist(tournament.matches[0]);
			return tournament.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without title', function(done) {
			// set match name to '' to see if rejects (should)
			tournament.matches[0].name = '';

			return tournament.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});
	// TODO: Test make a match with matches, competitors, and no type
	afterEach(function(done) {
		Tournament.remove().exec();
		User.remove().exec();
		done();
	});
});
