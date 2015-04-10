'use strict';

//Matches service used for communicating with the tournaments REST endpoints
// Match helper functions to manipulate match objects
angular.module('tournaments').factory('Tournament-Helper', ['$filter', function($filter) {

	// match modification (split to new file)
	var createNewMatch = function(new_match,match_competitors) {
		var match = {};
		match.name = new_match.name;
		match.start_date = new_match.start_date;
		match.end_date = new_match.end_date;
		match.location = new_match.location;
			
		match.competitors = [];	
		match.results = [];
		match.results[0] = new_match.results;
		match.description = new_match.description;
		match.status = 'Pending';
		addCompetitorsToMatch(match, match_competitors);

		return match;
	};

	// Filters a list on competitors
	var filterListOnSelected = function(list) {
		return $filter('filter')(list,{'selected':true});
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
	var addCompetitorsToMatch = function(val,match_competitors) {
	  var new_match_competitors = [];

	  for(var i=0; i<match_competitors.length; i++)
	  {
	    var competitor = match_competitors[i];
	    var competitor_selected = false;

	    // competitors already selected, pre-select
		  for(var j=0; j<val.competitors.length; j++) {
		    var current_competitor=val.competitors[j];
		    if(current_competitor===getId(competitor))
		    {
		      competitor_selected = true;
		    }
		  }

	          new_match_competitors.push({'name':competitor.name, 'id':getId(competitor), 'selected':competitor_selected});
	        }

		val.competitors_list = new_match_competitors;
		val.currentCompetitors = function() {
		  return filterListOnSelected(this.competitors_list);
		};

		return val;
	};


	// COMPETITOR HELPERS
	
	/// Gets the Id for the value.
	var getId = function(value) {	
	  if(value.id) {
	    return value.id;
	  } else if (value._id) {
	    return value._id;
	  } else {
	    throw 'value does not have an Id property.';
	  }
	};
	
	/// transform competitor objects to ids.
	/// competitors = list to transform
	/// returns a list of Ids
	var listToIds = function(list) {
	  return  list.map(getId);
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
		  throw 'Id does not exist in full List';
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
	    if( getId(val).toString()===id.toString()) {
	      existingVal=index;
	      return true;
	    } else {
	      return false;
	    }
	  });
		
	  return existingVal;
	};

	/// get Entry in Array By Id
	var getInArrayById = function(id, list) {
	  var index = getIndexOfIdInList(id,list);
	  if(index>=0) {
	    return list[index];
	  } else {
	    return null;
	  }
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
	  var selectedCompetitors = filterListOnSelected(competitorsList);
	  return listToIds(selectedCompetitors);
	};

	var selectableCompetitors = function(competitors) {
	  return competitors.filter(function(element){
	    return element.archived==='Current';
	  });
	};

// return functions that service will use
    return {
	createNewMatch: createNewMatch
	,removeMatchFromTournament: removeMatchFromTournament
	,addCompetitorsToMatch: addCompetitorsToMatch
	,getSelectedCompetitorsAsIds: getSelectedCompetitorsAsIds
	,competitorsToSelectList: competitorsToSelectList
	,selectableCompetitors: selectableCompetitors
	};
}]);
