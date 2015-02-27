'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Competitor = mongoose.model('Competitor'),
	Match = mongoose.model('Match'),
	Tournament = mongoose.model('Tournament'),
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
				message = 'Competitor already exists';
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

// Sends Error
var sendError = function(err) {
	return res.send(400, {
		message: getErrorMessage(err)
	});
};

/**
 * Create a competitor
 */
exports.create = function(req, res) {
	var competitor = new Competitor(req.body);

        // person that created tournament
	competitor.user = req.user;

        competitor.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(competitor);
		}
	});
};

/**
 * Show the current competitor
 */
exports.read = function(req, res) {
	res.jsonp(req.competitor);
};

/**
 * Update a competitor
 */
exports.update = function(req, res) {
	var competitor = req.competitor;

	competitor = _.extend(competitor, req.body);

	competitor.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(competitor);
		}
	});
};

/**
 * Delete a competitor
 */
exports.delete = function(req, res) {
	var competitor = req.competitor;

	competitor.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(competitor);
		}
	});
};

/**
 * List of Competitor
 */
exports.list = function(req, res) {

	Competitor.find().sort('-created').populate('user', 'displayName').exec()
	  .onReject(sendError)
	  .then(function(competitor) {
	    res.jsonp(competitor);
	  });
};

// Select Competitors, filtered on req
exports.selectList = function(req, res) {
	Competitor.find(req).sort('-created').populate('user', 'displayName').exec()
	  .onReject(sendError)
	  .then(function(competitor) {
	    res.jsonp(competitor);
	  });
};

// Get Competitors from a Tournament
exports.listByTournament = function(req, res) {
	var tournament = req.tournament;

	Tournament.find(req.tournament.id).exec()
	.onReject(sendError)
	.then( function(tournament) {
  	  Competitor.find(tournament.competitors).sort('-created').populate('user','displayName').exec()
	  .onReject(sendError)
	  .then(function(competitor) {
		
	    res.jsonp(competitor);
	  })
	;
	});
};

// Get Competitors from a Match
exports.listByMatch = function(req, res) {
	//var tournament = req.tournament;
	var match = req.match;
		
	Competitor.find(match.competitors).sort('-created').populate('user','displayName').exec(function(err,competitor) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(competitor);
		}
	  });
};

/**
 * Competitor middleware
 */
exports.competitorByID = function(req, res, next, id) {
	Competitor.findById(id).populate('user', 'displayName').exec(function(err, competitor) {
		if (err) return next(err);
		if (!competitor) return next(new Error('Failed to load competitor ' + id));
		req.competitor = competitor;
		next();
	});
};

exports.matchByID = function(req, res, next, id) {
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

/**
 * Competitor authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.competitor.user.id !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};
