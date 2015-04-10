'use strict';

//Competitors service used for communicating with the competitors REST endpoints
angular.module('competitors').factory('Competitor-Helper', ['Core-Helper','Competitors', function(CHelper,Competitors) {

	var getCompetitorArchiveEnumerations = function() {
	  return ['Archived', 'Current'];
	};

	var selectableCompetitors = function(competitors) {
	  return competitors.filter(function(element){
	    return element.archived==='Current';
	  });
	};

  // Add only the parameters that should exist for a new competitor
  var createNewCompetitor = function(object) {
    var competitor = new Competitors({
      name: object.name
      ,email: object.email
      ,description: object.description
    });

	// if not included, defaults to Current
    if(object.state) {
	competitor.state = object.state;
    }

    if(object.imageLink) {
      competitor.imageLink = object.imageLink;
    }

    return competitor;
  };

    return {
	  getCompetitorArchiveEnumerations: getCompetitorArchiveEnumerations
	  ,selectableCompetitors: selectableCompetitors
	  ,createNewCompetitor: createNewCompetitor
	};
}]);
