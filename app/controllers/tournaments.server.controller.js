'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
	,Tournament = mongoose.model('Tournament')
	,TournamentsMiddlewareService = require('../../app/services/tournaments.middleware')
	,_ = require('lodash');

var tournamentsMiddlewareService = TournamentsMiddlewareService.createService(Tournament);

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Tournament already exists';
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

/**
 * Create a tournament
 */
exports.create = function(req, res) {
	var tournament = new Tournament(req.body);

        // person that created tournament
	tournament.user = req.user;

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

/**
 * Show the current tournament
 */
exports.read = function(req, res) {
	res.jsonp(req.tournament);
};

/**
 * Update a tournament
 */
exports.update = function(req, res) {
	var tournament = req.tournament;
	tournament = _.extend(tournament, req.body);

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

/**
 * Delete a tournament
 */
exports.delete = function(req, res) {
	var tournament = req.tournament;

	tournament.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tournament);
		}
	});
};

/**
 * List of Tournament
 */
exports.list = function(req, res) {

          // TODO: populate tournaments, matches
	Tournament.find().sort('-created').populate('user', 'displayName').exec(function(err, tournaments) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tournaments);
		}
	});
};

// get list of Tournaments for user
exports.listByUser = function(req, res) {
	Tournament.find({user: req.user.id } ).sort('-created').populate('user', 'displayName').exec( function(err, tournaments) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tournaments);
		}
	});
};

// get list of Tournaments for user
exports.listByCompetitor = function(req, res) {
	console.log(req.competitor.id);
	Tournament.find({competitors: req.competitor.id } ).sort('-created').populate('user', 'displayName').exec( function(err, tournaments) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tournaments);
		}
	});
};

// Get Competitors that have a competitor list.
// Get Competitors that have a competitor list.
// TODO: remove?
exports.competitorList = function(req, res) {
	var competitorId = req.competitor.id;

	Tournament.aggregate(
	  { $match:{'matches.competitors':competitorId}}
	  ,{$unwind:'$matches'}
	  ,{$match:{ 'matches.competitors':competitorId}}
	  ,{ $group: {_id: '$_id', matches: {$push:'$matches'}}}
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
exports.tournamentByID = tournamentsMiddlewareService.tournamentById;

//exports.tournamentByID = function(req, res, next, id) {
  //            // TODO: populate competitor, match
//	Tournament.findById(id).populate('user', 'displayName').exec(function(err, tournament) {
//		if (err) return next(err);
//		if (!tournament) return next(new Error('Failed to load tournament ' + id));
//		req.tournament = tournament;
//		console.log(req.tournament.user);
//		next();
//	});
//};

/**
 * Tournament authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tournament.user.id !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};
