'use strict';

//Competitors service used for communicating with the competitors REST endpoints
angular.module('competitors').factory('Competitor-Helper', ['Core-Helper', function(CHelper) {

	var getCompetitorArchiveEnumerations = function() {
	  return ['Archived', 'Current'];
	};

	var selectableCompetitors = function(competitors) {
	  return competitors.filter(function(element){
	    return element.archived==='Current';
	  });
	};

    return {
	  getCompetitorArchiveEnumerations: getCompetitorArchiveEnumerations
	  ,selectableCompetitors: selectableCompetitors
	};
}]);
