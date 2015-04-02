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

// create function that returns the error to res
var sendError = function(res) {
	return function(err) {
	  res.send(400, {
	    message: getErrorMessage(err)
	  });
	  throw err;
	};
};

// TODO: Possibly Remove?
var findByIds = function(ids) {
  	  return Competitor.find({user: req.user.id})
	   .where('_id')
	   .in(ids).sort('-created').populate('user','displayName').exec();
};

// Enumerations
exports.archiveEnumerations = function(req,res) {
	// get Enumerations;
	var enumerations = ['Archived', 'Current'];
	res.jsonp(enumerations);
}

// merge Id list so no duplicates
var mergeArrays = function(currentArray,mergeArray,compareFunction) {
	mergeArray.forEach(function(newEntry) {
	  var comparison = currentArray.some(function(oldEntry)
	    {
	      return compareFunction(newEntry,oldEntry);
	  });
	  if(comparison === false) {
	    currentArray.push(newEntry);
	  } 
	});
	return currentArray;
};

// merge Competitor Ids
var mergeCompetitorIds = function(currentArray,mergeArray) {
	var compareFunction = function(oldEntry,newEntry) {
	  return oldEntry.toString() === newEntry.toString();
	};
	
	return mergeArrays(currentArray,mergeArray,compareFunction);
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

// Finds the competitors for a list of tournaments
// Returns a promise that contains the competitorIds for the tournaments
// params: Tournaments an array of tournamentIds
var findCompetitorIdsByTournaments = function(jsonTournamentIds) {
	var competitorPromise;

	var tournamentIds = jsonTournamentIds.map( function(tournamentId) {
	  return mongoose.Types.ObjectId(tournamentId);
	});

	// build query
 	var TournamentFind =Tournament.find();

	if(tournamentIds.length>0) {
	  TournamentFind.where('_id').in(tournamentIds);
	}

	var competitorIdsPromise = TournamentFind.exec()
	  .then( function(tournamentList) {
	    var competitors = [];
	    tournamentList.forEach(function(tournament) {
	      competitors = mergeCompetitorIds(competitors,tournament.competitors);
	    });

	    var competitorIds = competitors.map(function(competitor) {
	      return mongoose.Types.ObjectId(competitor);
	    });

	    return competitorIds;
	  });

	return competitorIdsPromise;
}

// find By Tournaments
// TODO: Possibly remove? 
var findByTournaments = function(tournaments) {
	var competitorIdsPromise = findCompetitorIdsByTournaments(tournaments);
	
	return findByIds(competitorIdsPromise);
};

exports.currentList = function(req, res) {
	
	req.query.archived='Current';
	
	exports.list(req,res);
};

/**
 * List of Competitor
 */
exports.list = function(req, res) {
	var findPromise; 
	var query = Competitor.find()
	  .where('user').equals(req.user.id);

	// apply filter, then run query
	competitorFilters(req.query,query).then(function(query){
	  findPromise = query.sort('-created').populate('user', 'displayName').exec();

	  findPromise.onReject(sendError(res))
	    .then(function(competitors) {
	      res.json(competitors);
	    });
	});
};

// Filter Queries
var competitorFilters = function(params, query) {
	var isAnd = true;
	var name, email, tournaments;
	var tournamentCompetitorIdsPromise;


	// Filter for Current.
	if(params.archived) {
	  query.where('archived').equals(params.archived);
	}

	// create a default Promise, if no other promises are needed
	var filteredPromise = new mongoose.Promise;
	  filteredPromise.resolve();
	var competitorIds = [];

	var orParams = [];

	if(params.or && params.or === 'true') {
	  isAnd = false;
	}

	// Add Params from competitors
	if(params.ids) {
	  var competitorList = params.ids.split(',');
	  competitorIds = competitorList.map(function(competitor) {
	      return mongoose.Types.ObjectId(competitor);
	  });
	}

	// Add Params from tournaments
	if(params.tournaments || params.tournamentId) {
	  tournaments = [];

	  if(params.tournaments) {
	    tournaments = params.tournaments.split(',');
	  }

	  if(params.tournamentId) {
	    tournaments.push(params.tournamentId);
	  } 

	  filteredPromise = findCompetitorIdsByTournaments(tournaments).then( function(tournamentCompetitorIds) {
	      mergeArrays(competitorIds,tournamentCompetitorIds,function(cId,tCId){
		  return cId.toString() === tCId.toString();
		});
		 return competitorIds;
	  });
	}

	filteredPromise = filteredPromise.then(function() {
	  if(competitorIds.length>0) {
	    if(isAnd) {
		query.where('_id').in(competitorIds);
	    } else { 
		orParams.push({'_id':competitorIds});
	    }
	  }
	});

	if(params.name) {
	  var name = new RegExp(params.name,'i');
	  if(isAnd) {
	    query.where('name').regex(name);
	  } else {
	    orParams.push({'name':{$regex: name}});
	  }
	}

	if(params.email) {
	  var email = new RegExp(params.email,'i');
	  if(isAnd) {
	    query.where('email').regex(email);
	  } else {
	    orParams.push({'email':{$regex: email}});
	  }
	}

	// or 
	if(isAnd) {
	  return filteredPromise.then(function() {
	    return query;
	  });
	} else {
	  return filteredPromise.then(function() {
	    return query.or(orParams);
	  });
	}
};

// Get Competitors from a Tournament
exports.listByTournament = function(req, res) {
	// if has tournament attached to req.
	// query with tournaments as tournament
	if(req.tournament.id) {	
		req.query.tournaments = req.tournament.id.toString();
	}
	
	exports.listByTournaments(req,res);
};

exports.listByTournaments = function(req,res) {
	exports.list(req,res);
};


// Get Competitors from a Match
exports.listByMatch = function(req, res) {
	//var tournament = req.tournament;
	var match = req.match;
	Competitor.find(match.competitors)
	  .where('user').equals(req.user.id)
	  .sort('-created').populate('user','displayName').exec(function(err,competitor) {
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
	        if(competitor.user.id!==req.user.id) {
		  return next(new Error('User does not have access to competitor'));
		}
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
