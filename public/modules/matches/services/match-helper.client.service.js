'use strict';

//Matches service used for communicating with the tournaments REST endpoints
// Match helper functions to manipulate match objects
angular.module('matches').factory('Match-Helper', ['$filter', 'Core-Helper','Tournament.Results', function($filter,CHelper,TResults) {

  // match modification (split to new file)
  var createNewMatch = function(new_match,match_competitors) {
    var match = {};
    match.name = new_match.name;
    match.start_date = new_match.start_date;
    match.end_date = new_match.end_date;
    match.location = new_match.location;
		
    match.competitors = [];	
    match.results = new_match.results;
    match.description = new_match.description;
    match.status = 'Pending';
    match.competitor_list = getMatchCompetitorList(match, match_competitors);

    return match;
  };

  // creates an empty match
  var createEmptyMatch = function() {
    var match = {};
    match.name = '';
    match.start_date = new Date().toString();
    match.end_date = new Date().toString();
    match.location = '';
	 	
    match.competitors = [];	
    match.results = [];
    match.description = '';
    match.status = 'Pending';

    return match;
  };

  // copy match data from new_match to match;
  var copyMatchData = function(match,new_match) {
    match.name = new_match.name;
    match.start_date = new_match.start_date;
    match.end_date = new_match.end_date;
    match.location = new_match.location;
	
    match.competitors = new_match.competitors;	
    match.results = new_match.results;
    match.description = new_match.description;
    match.status = new_match.status;

    return match;
  };

  // removes the match from tournament (based on id)
  // (must be exact match, not just id)
  var removeMatchFromTournament = function(match,tournament) {
    var index = tournament.matches.indexOf(match);
  
    if ( index > -1) {
      tournament.matches.splice(index,1);
    }

    return tournament;
  };

  // add a new list of competitors
  // values: match, list of competitors
  var getMatchCompetitorList = function(val,match_competitors) {
    var new_match_competitors = [];
    for(var i=0; i<match_competitors.length; i++)
    {
      var competitor = match_competitors[i];
      var competitor_selected = false;

      // competitors already selected, pre-select
      for(var j=0; j<val.competitors.length; j++) {
        var current_competitor=val.competitors[j];
        if(current_competitor===CHelper.getId(competitor))
        {
	  competitor_selected = true;
	}
      }

      new_match_competitors.push({'name':competitor.name, 'id':CHelper.getId(competitor), 'selected':competitor_selected});
    }

    return new_match_competitors;
  };

  // Selects the competitors from the list and returns as a list of Ids
  var getSelectedCompetitorsAsIds = function(competitorsList) {
    var selectedCompetitors = CHelper.filterListOnSelected(competitorsList);
    return CHelper.listToIds(selectedCompetitors);
  };
  
  // Init match based on tournament.
  var initMatchSelectResult = function(match) {
    if(match.results && match.results[0] && match.results[0].key) {
      if(match.results[0].key === TResults.key.tBD) {
 	match.firstResult = TResults.getResultWithKey(TResults.key.tBD);
      } else if(match.results[0].key === TResults.key.tie) {
 	match.firstResult = TResults.getResultWithKey(TResults.key.tie);
      } else if(match.results[0].key === TResults.key.win) {
	match.firstResult = TResults.getResultWithKey(TResults.key.win);
      } else {
	match.firstResult = TResults.getResultWithKey(TResults.key.tBD);
      }
    } else {
      match.firstResult = TResults.getResultWithKey(TResults.key.tBD);
    }
  };

  var initMatchResultSelectLists = function(match) {
    match.competitor_winners = [];
    match.competitor_losers = [];
    match.results.forEach(function(result) {
      if(result.key === TResults.key.win) {
        match.competitor_winners = result.competitors;
      } 
      if(result.key === TResults.key.loss) {
        match.competitor_losers = result.competitors;
      }
    });
  };

  // Fill Results
  // first result 
  var fillResultsForMatch = function(match, results, winList, lossList) {
    if(results.key === TResults.key.tBD) {
      match.results = [{'key':TResults.key.tBD, 'name':'TBD', 'competitors':match.competitors.slice(0) }];
    } else if (results.key === TResults.key.tie) {
      match.results = [{'key':TResults.key.tie, 'name':'Tie', 'competitors':match.competitors.slice(0) }];
    } else if (results.key === TResults.key.win) {
      match.results = [{'key':TResults.key.win, 'name':'Win', 'competitors':winList},
  	{'key':'Loss', 'name':'Loss', 'competitors':lossList}];
    } else {
      match.results = [{'key':TResults.key.tBD, 'name':'TBD', 'competitors':match.competitors.slice(0) }];
    }
  };

  // helper function
  // add a new list of competitors
  var addCompetitorsToMatch = function(val, competitors) {
    var new_match_competitors = [];
    for(var i=0; i<competitors.length; i++)
    {
      var competitor = competitors[i];
      var competitor_selected = false;

	    // competitors already selected, pre-select
      for(var j=0; j<val.competitors.length; j++) {
	var current_competitor=val.competitors[j];
	if(current_competitor === competitor.id) {
	  competitor_selected = true;
	}
      }

      new_match_competitors.push({'name':competitor.name, 'id':competitor.id, 'selected':competitor_selected});
    }

    val.competitors_list = new_match_competitors;
  };

  return {
    createNewMatch: createNewMatch
    ,createEmptyMatch: createEmptyMatch
    ,copyMatchData: copyMatchData
    ,removeMatchFromTournament: removeMatchFromTournament
    ,getMatchCompetitorList: getMatchCompetitorList
    ,getSelectedCompetitorsAsIds: getSelectedCompetitorsAsIds
    ,initMatchSelectResult: initMatchSelectResult
    ,initMatchResultSelectLists: initMatchResultSelectLists
    ,fillResultsForMatch: fillResultsForMatch
    ,addCompetitorsToMatch: addCompetitorsToMatch
  };
}]);
