'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
	,Tournament = mongoose.model('Tournament')
	,Competitor = mongoose.model('Competitor')
	,Match = mongoose.model('Match')
	,User = mongoose.model('User')
	,errorService = require('../../app/services/errors.core')
	,MatchService = require('../../app/services/matches')
	,CompetitorsMiddlewareService = require('../../app/services/competitors.middleware')
	,TournamentsMiddlewareService = require('../../app/services/tournaments.middleware')
	,MatchesMiddlewareService = require('../../app/services/matches.middleware')
	,_ = require('lodash');

var matchService = MatchService.createService(Tournament);
var competitorsMiddlewareService = CompetitorsMiddlewareService.createService(Competitor);
var tournamentsMiddlewareService = TournamentsMiddlewareService.createService(Tournament);
var matchesMiddlewareService = MatchesMiddlewareService.createService(Tournament);

/**
 * Get the error message from error object
 */

// Error send
var sendError = errorService.sendError;

// Get Specified Tournament from any places it could be
// first check req.tournament.
// then check req.param
// then check req.query
var getTournamentId = matchService.getTournamentId;

// * Create a match, by finding tournament
// tournament to add to is in request (mid tier?)
exports.create = function(req, res)
{
	console.log('recieved create request');

	var newMatch = new Match(req.body);

	newMatch.user = req.user.id;

	var tournamentId = getTournamentId(req);
	var tournamentPromise =	matchService.getFullTournament(tournamentId);

	tournamentPromise.onReject(sendError(res));

	tournamentPromise.then(function(tournament) {
		matchService.addMatch(tournament, newMatch);
		matchService.saveTournament(tournament,function(err) {
		  if(err) {
			  sendError(res)(err);
			} else {
		    res.jsonp(newMatch);
		  }
	    });
	});
};

// * Show the current match
exports.read = function(req, res) {
	if(typeof req.tournament !== 'undefined') 
	{
	  res.jsonp(req.tournament);
	} else {
	      return res.send(400, { message: 'No result found'});
	}
};

// * Update a match
exports.update = function(req, res) {
	var match = req.match;

	// do not update user who created it.
	if(req.body.user) {
	  console.log('delete user');
	  delete req.body.user;
	}
	if(match.user) {

	  delete match.user;
	}

	var newMatch = _.extend(match,req.body);
	
	var tournamentPromise =	matchService.getFullTournament(req.tournament._id);

	tournamentPromise.onReject(sendError(res));

	tournamentPromise.then(function(tournament) {
		matchService.updateMatch(tournament, newMatch);
		matchService.saveTournament(tournament,function(err) {
		  if(err) {
			  sendError(res)(err);
			} else {
		    res.jsonp(newMatch);
		  }
	    });
	});
};

// * Delete a match
exports.delete = function(req, res) {
	var match = req.match;
	var tournamentPromise = matchService.getFullTournament(req.tournament._id);

	tournamentPromise.then(function(tournament) {
	  matchService.removeMatch(tournament,match);
	  matchService.saveTournament(tournament,function(err) {
	    if(err) {
	      sendError(res)(err);
	    } else {
	      res.jsonp(tournament.id);
	    }
	  });
	});
};

// * List of Match
exports.list = function(req, res) {
	var promise = matchService.findTournamentsForUser(req.user.id);
	promise.onReject(sendError(res));
	promise.then(function(tournament) {
		res.jsonp(tournament);
	});
};

// get list of Tournaments with Matches for competitor
exports.listByCompetitor = function(req, res) {
	var competitorId = req.competitor.id;
	var promise = matchService.getMatchesForCompetitor(competitorId);
	promise.onReject(sendError(res));
	promise.then(function(tournaments) {
	  res.jsonp(tournaments);
	});
};

// Get UserIds to search for Tournaments
//var getUserDisplayNamesForTournamentMatches = function(tournaments) {
//  return matchService.getUserDisplayNamesForTournamentMatches(tournaments,User);
//};

// replace userIds for tournament matches into user+displaynames
// function(tournaments, UserNames)
//var populateuserdisplaynamestotournamentmatches = matchService.populateUserDisplayNamesToTournamentMatches; 

/**
 * Tournament middleware
 */

exports.matchByID = function(req, res, next, id) {
	return matchesMiddlewareService.matchByIdWithUser(req,res,next,id,matchService,User);
};

exports.tournamentByID = tournamentsMiddlewareService.tournamentById;

exports.competitorByID = competitorsMiddlewareService.competitorById;

/**
 * Tournament authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tournament.user.toString() !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};

// Has Create Authorization based on TournamentID param
exports.hasCreateAuthorization = function(req, res, next) {
	console.log('auth');
	var tournamentId = getTournamentId(req);

	// get tournament user (double checking to make sure correct user
	var tournamentPromise = matchService.findTournamentUser(tournamentId);

	tournamentPromise.then(function(tournament) {

	  // Tournament ID to check.
	  if( !('id' in tournament) || tournament.user.id !== req.user.id) {
	    console.log('rejected!');
	    return res.send(403, {
	      message: 'User is not authorized'
	    });
	  }
	  console.log('auth success');
	  next();
	});
};

