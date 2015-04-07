'use strict';
// This service includes functions to manipulate matches in addition to the match model.

var _ = require('lodash')
	,mongoose = require('mongoose')
	,Match = mongoose.model('Match');

// initialise function
exports.createService = function(tournamentModel) {

  var _Tournament = tournamentModel;

// SERVICE FUNCTIONS

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

// Add Match to Tournament
// returns index of just pushed match
var addMatch = function(tournament,match) {
	tournament.matches.push(match);
	return tournament.matches.indexOf(match);
};

// Save the Tournament
var saveTournament = function(tournament,resolve) {
  tournament.save(resolve);
};

//Gets the Full tournament
// Returns the promise for the full tournament.
var getFullTournament = function(tournamentId) {
	var tournamentPromise =	_Tournament.findById(tournamentId).exec();

	return tournamentPromise;
};

var getMatchById = function(id, resolve) {
	_Tournament.aggregate(
	  { $match:{'matches._id':mongoose.Types.ObjectId(id)}}
	  ,{$unwind:'$matches'}
	  ,{$match:{ 'matches._id':mongoose.Types.ObjectId(id)}}
	  ,{ $group: {_id: '$_id',name:{$first:'$name'},competitors: {$first:'$competitors'}, matches: {$push:'$matches'}, user:{$first:'$user'}}}
	  , resolve);
};

// get Matches for Competitor
// Returns a query object, aggregate
var getMatchesForCompetitor = function (competitorId,result) {
	return 	_Tournament.aggregate(
	  { $match:{'matches.competitors':competitorId}}
	  ,{$unwind:'$matches'}
	  ,{$match:{ 'matches.competitors':competitorId}}
	  ,{ $group: {_id: '$_id',name:{$first:'$name'}, matches: {$push:'$matches'}}}
	).exec(result);
};

// Find the tournament for User
// returns a promise for the tournament
var findTournamentsForUser = function(userId,result) {
	return	_Tournament.find({user: userId}).sort('-created').populate('user', 'displayName').exec(result);
} ;

// Find the Tournament by ID
// returns a promise for the tournament
var findTournamentById = function(tournamentId,result) {
	return _Tournament.findById(tournamentId).populate('user', 'displayName').exec(result);
};

// Finds a tournament user id, mostly for write permissions.
// returns a promise with the tournament and user.
var findTournamentUser = function(tournamentId,result) {
	return _Tournament.findById(tournamentId,{id: 1, name: 1, user: 1}).populate('user', 'displayName').exec(result);
};

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

// Get UserIds to search for Tournaments
var getUserDisplayNamesForTournamentMatches = function(tournaments,userModel) {
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
	// TODO: move this part of code to its own service
	return  userModel.find()
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

// Functions to use
return {
  findTournamentMatchIndex: findTournamentMatchIndex
  , getTournamentId: getTournamentId
  , getUserDisplayNamesForTournamentMatches: getUserDisplayNamesForTournamentMatches
  , populateUserDisplayNamesToTournamentMatches: populateUserDisplayNamesToTournamentMatches
  , updateMatch: updateMatch
  , removeMatch: removeMatch
  , addMatch: addMatch
  , saveTournament : saveTournament
  , getFullTournament: getFullTournament
  , getMatchById: getMatchById
  , getMatchesForCompetitor: getMatchesForCompetitor
  , findTournamentsForUser: findTournamentsForUser
  , findTournamentUser: findTournamentUser
  , findTournamentById: findTournamentById   };

};
