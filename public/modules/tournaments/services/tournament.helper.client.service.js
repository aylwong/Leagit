'use strict';

//Matches service used for communicating with the tournaments REST endpoints
// Match helper functions to manipulate match objects
angular.module('tournaments').factory('TournamentHelper', ['$filter', function($filter) {
	var selectableCompetitors = function(competitors) {
	  return competitors.filter(function(element){
	    return element.archived==='Current' || element.archived==='current';
	  });
	};

// return functions that service will use
    return {
	selectableCompetitors: selectableCompetitors
	};
}]);
