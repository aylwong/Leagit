'use strict';
// This service includes functions to manipulate matches in addition to the match model.

var _ = require('lodash')
	,mongoose = require('mongoose')
	,Competitor = mongoose.model('Competitor')
	,Tournament = mongoose.model('Tournament')
	,HelperService = require('../../app/services/helper');

var helperService = HelperService.createService();

// initialise function
exports.createService = function(tournamentModel) {

  var _Tournament = tournamentModel;

  var matchById = function(req, res, next, id) {
    Tournament.aggregate(
      { $match:{'matches._id':mongoose.Types.ObjectId(id)}}
      ,{$unwind:'$matches'}
      ,{$match:{ 'matches._id':mongoose.Types.ObjectId(id)}}
      ,{ $group: {_id: '$_id',name:{$first:'$name'},competitors: {$first:'$competitors'}, matches: {$push:'$matches'}}}
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

//Get Match Id but include User Name.
// need match service and User Model to get user.
var matchByIdWithUser = function(req, res, next, id, matchService, userModel) {
	var promise = matchService.getMatchById(id
	  , function (err, tournaments) {
		// need to get 1 tournament, and 1 match
	      if (err || tournaments.length!==1 || tournaments[0].matches.length!==1) { 
	        return next(err);
	      } else {
	  	// if there is a match, return with its tournament.
		// get Usernames
		var userPromise = matchService.getUserDisplayNamesForTournamentMatches(tournaments,userModel);
		 userPromise
		.then(function(users) {
		  matchService.populateUserDisplayNamesToTournamentMatches(tournaments,users);
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

  return {
    matchById: matchById
    ,matchByIdWithUser: matchByIdWithUser
  };
};
