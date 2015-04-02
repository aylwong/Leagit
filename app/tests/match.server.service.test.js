'use strict';

/**
 * Module dependencies.
 */
var should = require('should')
	, mongoose = require('mongoose')
	,matches = require('../../app/services/matches');
	
/**
 * Globals
 */
var matchService, TournamentModel;

/**
 * Unit tests
 */
describe('Match Service Unit Tests:', function() {
	beforeEach(function(done) {
		TournamentModel = {};	       

		matchService = matches.createService(TournamentModel);

		done();
	});

	describe('findTournamentMatchIndex', function() {
		it('finds the correct index', function(done) {
			// set match name to '' to see if rejects (should)
			var match01 = {_id:'match1'};
			var match02 = {_id:'match2'};
			var match03 = {_id:'match3'};
	
			var tournament={};
			tournament.matches=[match01, match02, match03];

			var result = matchService.findTournamentMatchIndex(tournament,match02);
			(result===1).should.be.exactly(true);
				done();
		});
		it('finds -1 if no index', function(done) {
			// set match name to '' to see if rejects (should)
			var match01 = {_id:'match1'};
			var match02 = {_id:'match2'};
			var match03 = {_id:'match3'};
			var match04 = {_id:'match4'};
	
			var tournament={};
			tournament.matches=[match01, match02, match03];

			var result = matchService.findTournamentMatchIndex(tournament,match04);
			(result===-1).should.be.exactly(true);
				done();
		});
	});

	describe('updateMatch', function() {
		it('updates the Match based on the id', function(done) {
			// set match name to '' to see if rejects (should)
			var match01 = {_id:'match1', name:'name1', loc:'loc1'};
			var match02 = {_id:'match2', name:'name2', loc:'loc2'};
			var match03 = {_id:'match3', name:'name3', loc:'loc3'};
			var match04 = {_id:'match4', name:'name4', loc:'loc4'};
			var newMatch = {_id:'match2',	name:'newname'};
			var tournament={};
			tournament.matches=[match01, match02, match03];

			var res = matchService.updateMatch(tournament,newMatch);
			tournament.matches[1].name.should.be.exactly('newname');
			tournament.matches[1].loc.should.be.exactly('loc2');
			done();
		});
	});

	describe('removeMatch', function() {
		it('removes the Match based on the id', function(done) {
			// set match name to '' to see if rejects (should)
			var match01 = {_id:'match1', name:'name1', loc:'loc1'};
			var match02 = {_id:'match2', name:'name2', loc:'loc2'};
			var match03 = {_id:'match3', name:'name3', loc:'loc3'};
			var match04 = {_id:'match4', name:'name4', loc:'loc4'};
			var newMatch = {_id:'match2',	name:'newname'};
			var tournament={};
			tournament.matches=[match01, match02, match03];

			var res = matchService.removeMatch(tournament,newMatch);
			tournament.matches.length.should.be.exactly(2);
			tournament.matches[0].loc.should.not.be.exactly('loc2');
			tournament.matches[1].loc.should.not.be.exactly('loc2');
			tournament.matches[0]._id.should.not.be.exactly('match2');
			tournament.matches[1]._id.should.not.be.exactly('match2');
			done();
		});
	});

	// TODO: Test make a match with matches, competitors, and no type
	afterEach(function(done) {

		done();
	});
});
