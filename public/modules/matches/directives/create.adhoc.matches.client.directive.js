'use strict';

angular.module('matches_creator').directive('createAdHocMatches', [function() {
	return {
	  scope: {
	    tournament: '=tournament'
          }
	  ,restrict: 'E'
          ,templateUrl: 'modules/matches/views/create.adhoc.matches.client.template.html'
          ,replace: true
	  ,link: function(scope,element, attrs){
	  }
	  ,controller: 'CreateAdHocMatchesController'
	  ,controllerAs: 'ctrl'
    	};
  }]
);
