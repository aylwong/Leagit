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
	,_ = require('lodash');

var matchService = MatchService.createService(Tournament);

/**
 * Get the error message from error object
 */

// Error send
var sendError = errorService.sendError;

// Get Specified Tournament from any places it could be
// first check req.tournament.
// then check req.param
// then check req.query
var getTournamentId = function(req) {
	if(req.tournament) {
	  return req.tournament.id;
	  // tournament already recieved, no need to retrieve again.
	} else if(req.params.tournamentId) {
	  return req.params.tournamentId;
	} else if (req.query.tournamentId) {
	  return req.query.tournamentId;
	} else {
	  return null;
	}
};


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
	var promise = matchService.getMatchesforCompetitor(competitorId);
	promise.onReject(sendError(res));
	promise.then(function(tournaments) {
	  res.jsonp(tournaments);
	});
};

// Get UserIds to search for Tournaments
var getUserDisplayNamesForTournamentMatches = function(tournaments) {
	var ids = tournaments.map(function(tournament) {
	  var matchIds = tournament.matches.map(function(match) {
	    return mongoose.Types.ObjectId(match.user);
	  });
	  return matchIds;
	}).reduce(function(prevValue,curValue,index,array) {
	  return prevValue.concat(curValue);
	});

	if(ids.length<=0) {
	  ids=[];
	}


	// return Promise that gets users.
	return  User.find()
	  .where('_id').in(ids)
	  .select('id displayName')
	  .exec();

};

// replace userIds for tournament matches into user+displaynames
var populateUserDisplayNamesToTournamentMatches = function(tournaments,userNames) {
	var ids = tournaments.forEach(function(tournament) {
	  tournament.matches.forEach(function(match) {
	    // replace user with user.
	    userNames.some(function(currentValue,index) {
	      if(currentValue.id.toString()===match.user.toString())
		{
		  match.user = {id:currentValue.id, displayName:currentValue.displayName};
		  return true;
		} else {
		  return false;
		}
	    });
	  });
	});
};

/**
 * Tournament middleware
 */

exports.matchByID = function(req, res, next, id) {
	var promise = matchService.getMatchById(id
	  , function (err, tournaments) {
		// need to get 1 tournament, and 1 match
	      if (err || tournaments.length!==1 || tournaments[0].matches.length!==1) { 
	        return next(err);
	      } else {
	  	// if there is a match, return with its tournament.
		// get Usernames
		var userPromise = getUserDisplayNamesForTournamentMatches(tournaments);
		 userPromise
		.then(function(users) {
		  populateUserDisplayNamesToTournamentMatches(tournaments,users);
	        req.tournament = tournaments[0];
	        req.match=tournaments[0].matches[0];
	        next();
		}, function(err) {
		  return next(err);
		});
	      }
	  }
  	);
};

exports.tournamentByID = function(req, res, next, id) {
	matchService.findTournamentById(id
	  ,function(err, tournament) {
		if (err) return next(err);
		if (!tournament) return next(new Error('Failed to load tournament ' + id));
		req.tournament = tournament;
		next();
	});
};

exports.competitorByID = function(req, res, next, id) {
	Competitor.findById(id).populate('user', 'displayName').exec(function(err, competitor) {
		if (err) return next(err);
		if (!competitor) return next(new Error('Failed to load tournament ' + id));
		req.competitor = competitor;
		next();
	});
};

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

