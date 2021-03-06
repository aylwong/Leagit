'use strict';

angular.module('matches_creator').directive('autoCreateMatches', [function() {
	return {
	  scope: {
	    tournament: '=tournament'
          }
	  ,restrict: 'E'
          ,templateUrl: 'modules/matches/views/auto.create.matches.client.template.html'
          ,replace: true
	  ,link: function(scope,element, attrs){
	  }
	  ,controller: 'AutoCreateMatchesController'
	  ,controllerAs: 'ctrl'
    	};
  }]
);
