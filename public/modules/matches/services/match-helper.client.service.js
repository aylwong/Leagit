'use strict';

//Matches service used for communicating with the tournaments REST endpoints
// Match helper functions to manipulate match objects
angular.module('matches').factory('Match-Helper', ['$filter', 'Core-Helper', function($filter,CHelper) {

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
	}

	// copy match data from new_match to match;
	var copyMatchData = function(match,new_match) {
		match.name = new_match.name;
		match.start_date = new_match.start_date;
		match.end_date = new_match.end_date;
		match.location = new_match.location;
			
		match.competitors = new_match.competitors;	
		match.results = new_match.competitors;
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
	  return tournament
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
	
	/// Transforms competitors array to select list ([{key, name, selected}]).
	/// selected = current array of ids that is selected
	var competitorsToSelectList = function(competitors, selected)
	{
	  var currentlySelected = false;

	  var selectList = competitors.map(function(val) {
		currentlySelected = valExistsInListAsString(val._id,selected);
	    return {'name':val.name, 'id':val._id, 'selected':currentlySelected};
	  });
	  
	  return selectList;
	};

	/// converts idList full of ids (strings) into full entries based on the fullList array
	var idsToList = function(idList, fullList)
	{
	  var currentlySelected=false;
	
	  var convertedList = idList.map(function(val) {
	       var valueIndex = getIndexOfIdInList(val,fullList);
		if (valueIndex<0) {
		  throw "Id does not exist in full List";
		} else {
		  return fullList[valueIndex];
		}
	  });
	  return convertedList;
	};

	/// returns the index of the first entry in the list that has id
	/// if none found, returns -1
	var getIndexOfIdInList = function(id, list)
	{
	  var existingVal = -1;
	  list.some( function (val,index) {
	    if( CHelper.getId(val).toString()===id.toString()) {
	      existingVal=index;
	      return true;
	    } else {
	      return false;
	    }
	  });
		
	  return existingVal;
	};

	// returns whether the val.toString exists in list
	// list is an array of toStringable ids
	// if list does not exist, will return false
	// val and lists must be 'toString' able.
	var valExistsInListAsString = function(val, list)
	{
	    if(list && list.length>0)
	    {
		return list.some(function(selectedValue) {
		  return selectedValue.toString() === val.toString();
		});
	    } else {
	      return false;
	    }
	};

	// Selects the competitors from the list and returns as a list of Ids
	var getSelectedCompetitorsAsIds = function(competitorsList) {
	  var selectedCompetitors = CHelper.filterListOnSelected(competitorsList);
	  return CHelper.listToIds(selectedCompetitors);
	};

// return functions that service will use
    return {
	createNewMatch: createNewMatch
	,createEmptyMatch: createEmptyMatch
	,copyMatchData: copyMatchData
	,removeMatchFromTournament: removeMatchFromTournament
	,getMatchCompetitorList: getMatchCompetitorList
	,getSelectedCompetitorsAsIds: getSelectedCompetitorsAsIds
	,competitorsToSelectList: competitorsToSelectList
	};
}]);
