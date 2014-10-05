'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
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

/**
 * Create a tourament
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

          // TODO: populate competitors, matches
	Competitor.find().sort('-created').populate('user', 'displayName').exec(function(err, competitor) {
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
