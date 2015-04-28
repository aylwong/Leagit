'use strict';
// This service includes functions to manipulate matches in addition to the match model.

var _ = require('lodash')
	,mongoose = require('mongoose')
	,Competitor = mongoose.model('Competitor')
	,Tournament = mongoose.model('Tournament')
	,HelperService = require('../../app/services/helper');

var helperService = HelperService.createService();

// initialise function
exports.createService = function(competitorModel) {

 var _Competitor = competitorModel;

  // Filter Queries
  // Filter as 'And' or 'Or' of params
  // possible params (single): tournamentId
  // possible params (comma delimited str): ids, tournaments, emails, names
  // possible regex params (match substring): name, email
  var competitorFilters = function(params, query) {
	var isAnd = true;
	var name, email, tournaments;
	var tournamentCompetitorIdsPromise;

	// Filter for Current.
	if(params.archived) {
	  query.where('archived').equals(params.archived);
	}

	// create a default Promise, if no other promises are needed
	var filteredPromise = new mongoose.Promise();
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
	     console.log('found tournament competitor Ids');
	      helperService.mergeArrays(competitorIds,tournamentCompetitorIds,function(cId,tCId){
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
	  var regXName = new RegExp(params.name,'i');
	  if(isAnd) {
	    query.where('name').regex(regXName);
	  } else {
	    orParams.push({'name':{$regex: regXName}});
	  }
	}
    if(params.names && params.names.length>0) {
	    var names = params.names.split(',');
	  if(isAnd) {
	    query.where('name').in(names);
	  } else {
	    orParams.push({'name':names});
	  }
    }

	if(params.email) {
	  var regXEmail = new RegExp(params.email,'i');
	  if(isAnd) {
	    query.where('email').regex(regXEmail);
	  } else {
	    orParams.push({'email':{$regex: regXEmail}});
	  }
	}

    if(params.emails && params.emails.length>0) {
	    var emails = params.emails.split(',');
	  if(isAnd) {
	    query.where('email').in(emails);
	  } else {
	    orParams.push({'email':emails});
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

// Finds the competitors for a list of tournaments
// Returns a promise that contains the competitorIds for the tournaments
// params: Tournaments an array of tournamentIds
// TODO: Clean
var findCompetitorIdsByTournaments = function(jsonTournamentIds) {
	console.log('find Competitor Ids by TOurnaments');
	console.log(jsonTournamentIds);
	var competitorPromise;

	var tournamentIds = jsonTournamentIds.map( function(tournamentId) {
	  return mongoose.Types.ObjectId(tournamentId);
	});

	// build query
 	var TournamentFind =Tournament.find();

	if(tournamentIds.length>0) {
	  TournamentFind.where('_id').in(tournamentIds);
	}

// TODO: error not getting caught. check this out.
	var competitorIdsPromise = TournamentFind.exec()
	  .then( function(tournamentList) {
	    var competitors = [];
	    tournamentList.forEach(function(tournament) {
	      competitors = helperService.mergeIds(competitors,tournament.competitors);
	    });

	    var competitorIds = competitors.map(function(competitor) {
	      return mongoose.Types.ObjectId(competitor);
	    });

	    return competitorIds;
	  });

	return competitorIdsPromise;
};

return {
  competitorFilters: competitorFilters
  ,findCompetitorIdsByTournaments: findCompetitorIdsByTournaments
  };

};
