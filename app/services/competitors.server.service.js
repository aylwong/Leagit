'use strict';
// This service includes functions to manipulate matches in addition to the match model.

var _ = require('lodash')
	,mongoose = require('mongoose')
	,Competitor = mongoose.model('Competitor')
	,Tournament = mongoose.model('Tournament')
	,HelperService = require('../../app/services/helper');

var helperService = HelperService.createService();

// initialise function
exports.createService = function(competitorModel, tournamentModel) {

 var _Competitor = competitorModel ? competitorModel: Competitor;
 var _Tournament = tournamentModel? tournamentModel: Tournament;

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
	      competitors = helperService.mergeIds(competitors,tournament.competitors);
	    });

	    var competitorIds = competitors.map(function(competitor) {
	      return mongoose.Types.ObjectId(competitor);
	    });

	    return competitorIds;
	  });

	return competitorIdsPromise;
};

  // strip and put into service.
var competitorEmailsToParamsList = function(newCompetitors) {

  var filteredEmails = _.filter(newCompetitors,function(n) {
      return n && n.email && n.email.length>0;
  });
  var emailsParam = filteredEmails.map(function(comp) {
        return comp.email;  
  }).join(',');

      return emailsParam;
};

  // competitor Names to Params List
var competitorNamesToParamsList = function(newCompetitors) {

    var filteredNames = _.filter(newCompetitors,function(n) {
      return n && n.name && n.name.length>0;
      });
    var namesParam = filteredNames.map(function(comp) {
        return comp.name;  
      }).join(',');

      return namesParam;
};

// filter emails if have them. If not, add name to list.
var competitorToNamesAndEmailsList = function(newCompetitors) {
    var results = {};
    var filteredNames = newCompetitors.reduce(function(previousValue,currentValue) {
        if(currentValue.email && currentValue.email!=='') {
          previousValue.emails= !previousValue.emails ? currentValue.email : previousValue.emails.concat(',',currentValue.email);
        } else if (currentValue.name && currentValue.name!=='') {
          previousValue.names= !previousValue.names ? currentValue.name: previousValue.names.concat(',',currentValue.name);
        }

        return previousValue;
    },results);

    return results;
};


// Create filters based on email, and name.
// If has email, match on email. If no email, match on name.
var searchForDuplicateFilters = function(competitors,query) {
  var searchParams = {};
  var competitorSearchParams= competitorToNamesAndEmailsList(competitors);
    if(competitorSearchParams.emails) {
      searchParams.emails = competitorSearchParams.emails;
    }
    if(competitorSearchParams.names) {
      searchParams.names = competitorSearchParams.names;
    }
    if(competitorSearchParams.names && competitorSearchParams.emails) {
      searchParams.or = 'true';
    }

//    console.log(searchParams);
  var dupPromise;
  if(!searchParams.emails && !searchParams.names) {
    dupPromise = new mongoose.Promise();
    dupPromise.fulfill(query);
  } else {
    dupPromise = competitorFilters(searchParams,query)
	  .then(function(query){
        return query;
    });
  }
  return dupPromise;
};

// execte query for competitor, returning user and Display name, from a promise that returns a query to execute
// returns a promise with the query result;
var execCompetitorQueryPromise = function(queryPromise) {
  return queryPromise.then(function(query) {
        return query.sort('-created').populate('user','displayName').exec();
    });
};

var findCompetitorDuplicates = function(newCompetitors, foundEntries) {
    // Assign already created
      var alreadyCreated = foundEntries;
    // Filter out entries from competitors to insert for those already created
      var filteredNewCompetitors = _.filter(newCompetitors,function(comp) {
        return !alreadyCreated.some(function(c) {
          if(comp.email) {
            return c.email === comp.email;
          } else if (comp.name) {
            return c.name === comp.name && (c.email==='' || !c.email);
          }
        });
      });
        return {alreadyCreated:alreadyCreated, notCreated:filteredNewCompetitors};
};
 // });

 // return dupSearchPromise;
//};

// create multiple competitors from an array, returning an array of the created Competitors
var createCompetitors = function(filteredNewCompetitors) {
    var competitorsCreatedPromise = new mongoose.Promise();
    if (filteredNewCompetitors.length===0) {
      competitorsCreatedPromise.fulfill([]);
    } else {
      var createdPromise = Competitor.create(filteredNewCompetitors,function(err,competitors) {
        if (err) {
          throw new Error(err);
        } else {
          var insertedDocs = [];
          for (var i=1; i<arguments.length; ++i) {
            insertedDocs.push(arguments[i]);
          }
          competitorsCreatedPromise.fulfill(insertedDocs);
	    }
      });
    }
    
    return competitorsCreatedPromise;
};

return {
  competitorFilters: competitorFilters
  ,execCompetitorQueryPromise: execCompetitorQueryPromise
  ,searchForDuplicateFilters: searchForDuplicateFilters
  ,findCompetitorDuplicates: findCompetitorDuplicates
  ,createCompetitors: createCompetitors
  ,findCompetitorIdsByTournaments: findCompetitorIdsByTournaments
  };

};
