'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
	,Competitor = mongoose.model('Competitor')
	,Match = mongoose.model('Match')
	,Tournament = mongoose.model('Tournament')
	,errorService = require('../../app/services/errors.core')
	,CompetitorService = require('../../app/services/competitors')
	,HelperService = require('../../app/services/helper')
	,CompetitorsMiddlewareService = require('../../app/services/competitors.middleware')
	,MatchesMiddlewareService = require('../../app/services/matches.middleware')
	,Matches
	,_ = require('lodash');

var competitorService = CompetitorService.createService(Competitor);
var helperService = HelperService.createService();
var competitorsMiddlewareService = CompetitorsMiddlewareService.createService(Competitor);
var matchesMiddlewareService = MatchesMiddlewareService.createService(Tournament);

/**
 * Get the error message from error object
 */

var sendError = errorService.sendError;

// Enumerations
exports.archiveEnumerations = function(req,res) {
	// get Enumerations;
	var enumerations = ['Archived', 'Current'];
	res.jsonp(enumerations);
};

// merge Id list so no duplicates
var mergeArrays = helperService.mergeArrays;

// merge Competitor Ids
var mergeIds = helperService.mergeIds;

/**
 * Create a competitor
 */
exports.create = function(req, res) {
	var competitor = new Competitor(req.body);

    // person that created tournament
	competitor.user = req.user;

        competitor.save(function(err) {
		if (err) {
		   sendError(res)(err);
		} else {
			res.jsonp(competitor);
		}
	});
};

exports.massCreate = function(req,res) {
  var competitor = new Competitor();
  console.log('mass create');
  var nc = req.body.competitors;
  var alreadyCreated = [];
  var newCompetitors =  nc.map(function(comp) {
    return {
      name: comp.name
      ,email: comp.email
      ,user:req.user
    };
  });

  var baseFindQuery = Competitor.find().where('user').equals(req.user.id);
  var findPromise = competitorService.execCompetitorQueryPromise(competitorService.searchForDuplicateFilters(newCompetitors,baseFindQuery));
  findPromise.then(function(foundEntries) {
    return competitorService.findCompetitorDuplicates(newCompetitors,foundEntries);
  })
   .onReject(sendError(res))
  .then(function(results) {
     alreadyCreated = results.alreadyCreated;
     var filteredNewCompetitors = results.notCreated;
    if (filteredNewCompetitors.length > 513) {
      throw new Error('Too many competitors');
    }

  //  return competitorsCreatedPromise;
    return competitorService.createCompetitors(filteredNewCompetitors);
  })
  .then(function(insertedDocs) {
    res.jsonp({competitors:insertedDocs
      ,existingCompetitors:alreadyCreated});
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
		  sendError(res)(err);
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
		  sendError(res)(err);
		} else {
			res.jsonp(competitor);
		}
	});
};

// Finds the competitors for a list of tournaments
// Returns a promise that contains the competitorIds for the tournaments
// params: Tournaments an array of tournamentIds
var findCompetitorIdsByTournaments = competitorService.findCompetitorIdsByTournaments;

// get the current list convenience function
exports.currentList = function(req, res) {
	req.query.archived='Current';
	exports.list(req,res);
};


/// Get Public List for competitors (just names)
exports.publicList = function(req,res) {
	var findPromise; 
	var query = Competitor.find({},'name _id');

	// apply filter, then run query
	competitorService.competitorFilters(req.query,query)
	  .onReject(sendError(res))
	  .then(function(query){
	  findPromise = query.sort('-created').populate('user', 'displayName').exec();

	  findPromise.onReject(sendError(res))
	    .then(function(competitors) {
	      res.json(competitors);
	    });
	});
};


/**
 * List of Competitor
 */
exports.list = function(req, res) {
	var findPromise; 
	var query = Competitor.find()
	  .where('user').equals(req.user.id);

	// apply filter, then run query
	competitorService.competitorFilters(req.query,query)
	  .onReject(sendError(res))
	  .then(function(query){
	  findPromise = query.sort('-created').populate('user', 'displayName').exec();

	  findPromise.onReject(sendError(res))
	    .then(function(competitors) {
	      res.json(competitors);
	    });
	});
};

// Get Competitors from a Tournament
exports.listByTournament = function(req, res) {
	// if has tournament attached to req, query with this id.
  if(req.tournament.id) {	
    req.query.tournaments = req.tournament.id.toString();
  }	

  exports.listByTournaments(req,res);
};

// TODO: remove list by tournaments, use normal list instead.
exports.listByTournaments = function(req,res) {
	exports.list(req,res);
};

// Get Competitors from a Match
exports.listByMatch = function(req, res) {
	var match = req.match;
	Competitor.find(match.competitors)
	  .where('user').equals(req.user.id)
	  .sort('-created').populate('user','displayName').exec(function(err,competitor) {
		if (err) {
		  sendError(res)(err);
		} else {
			res.jsonp(competitor);
		}
	  });
};

/**
 * Competitor middleware
 */
exports.competitorByID = competitorsMiddlewareService.competitorById;

exports.matchByID = matchesMiddlewareService.matchesById;

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
