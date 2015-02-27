'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Tournament = mongoose.model('Tournament'),
	Competitor = mongoose.model('Competitor'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Match already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

// Finds the index of the match for the tournament matches, based on Id
// If it doesn't find it, it returns -1
var findTournamentMatchIndex = function(tournament, match) {
	for(var i=0;i<tournament.matches.length;i++)
	{
  	  if(tournament.matches[i]._id.toString() === match._id.toString())
	  {
	    return i;
	  }
	}

	return -1;
};

// Updates the match in the tournament
// Returns the index of the updated match, or -1 if no match found.
var updateMatch = function(tournament,match) {
	var matchIndex = findTournamentMatchIndex(tournament,match);

	if(matchIndex>=0)
	{
	  _.extend(tournament.matches[matchIndex], match);
	}

	return matchIndex;
};


// Remove the match in the tournament
var removeMatch = function(tournament,match) {
	var matchIndex = findTournamentMatchIndex(tournament,match);
	if(matchIndex>=0) {
		tournament.matches.splice(matchIndex,1);
	}

	// -1 means failed to remove	
	return matchIndex;
};

// Error send
var sendError = function(err) {
	return res.send(400, {
		message: getErrorMessage(err)
	});
}

// Save the Tournament
var saveTournament = function(tournament,res) {
  tournament.save(function(err) {
	if (err) {
	  return res.send(400, {
	    message: getErrorMessage(err)
	  });
	} else {
	  res.jsonp(tournament);
	}
  });
};

//Gets the Full tournament
// Returns the promise for the full tournament.
var getFullTournament = function(tournamentId) {
	var tournamentPromise =	Tournament.findById(tournamentId).exec();
	tournamentPromise.onReject(sendError);

	return tournamentPromise;
};

// * Create a match, by finding tournament
// tournament to add to is in request (mid tier?)
exports.create = function(req, res)
{
	var match = req.body;
	var tournamentPromise = getFullTournament(req.tournament._id);

	tournamentPromise.then( function(tournament) {
		tournament.matches.push(match);
		saveTournament(tournament,res);
	});
}

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
	var newMatch = _.extend(match,req.body);
	
	var tournamentPromise =	getFullTournament(req.tournament._id);
	
	tournamentPromise.then(function(tournament) {
		updateMatch(tournament, newMatch);
		saveTournament(tournament,res);
	});
};

// * Delete a tournament
exports.delete = function(req, res) {
	var match = req.match;
	var tournamentPromise = getFullTournament(req.tournament._id);

	tournamentPromise.then(function(tournament) {
		removeMatch(tournament,match);
		saveTournament(tournament,res);
	});
};

// * List of Match
exports.list = function(req, res) {
	Tournament.find({user: req.user.id}).sort('-created').populate('user', 'displayName').exec(function(err, tournament) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tournament);
		}
	});
};

// get list of Tournaments with Matches for competitor
exports.listByCompetitor = function(req, res) {
	var competitorId = req.competitor.id;

	Tournament.aggregate(
	  { $match:{'matches.competitors':competitorId}}
	  ,{$unwind:'$matches'}
	  ,{$match:{ 'matches.competitors':competitorId}}
	  ,{ $group: {_id: '$_id',name:{$first:'$name'}, matches: {$push:'$matches'}}}
	  , function (err, tournaments) {
	    if (err) { 
	      return res.send(400, { message: getErrorMessage(err)});
	    } else {
	      res.jsonp(tournaments);
	    }
	  }
	);
};

/**
 * Tournament middleware
 */

exports.matchByID = function(req, res, next, id) {
	Tournament.aggregate(
	  { $match:{'matches._id':mongoose.Types.ObjectId(id)}}
	  ,{$unwind:'$matches'}
	  ,{$match:{ 'matches._id':mongoose.Types.ObjectId(id)}}
	  ,{ $group: {_id: '$_id',name:{$first:'$name'},competitors: {$first:'$competitors'}, matches: {$push:'$matches'}, user:{$first:'$user'}}}
	  , function (err, tournaments) {
		// need to get 1 tournament, and 1 match
	    if (err || tournaments.length!==1 || tournaments[0].matches.length!==1) { 
	      return next(err);
	    } else {
		// if there is a match, return with its tournament.
	      req.tournament = tournaments[0];
	      req.match=tournaments[0].matches[0];
	      next();
	    }
	  }
  	);
};

exports.tournamentByID = function(req, res, next, id) {
	Tournament.findById(id).populate('user', 'displayName').exec(function(err, tournament) {
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
