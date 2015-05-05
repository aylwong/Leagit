'use strict';

angular.module('tournaments').directive('viewByMatchTournament', [function() {
	return {
	  scope: {
	    tournament: '=tournament'
          }
	  ,restrict: 'E'
          ,templateUrl: 'modules/tournaments/views/view.by.match.tournament.client.template.html'
          ,replace: true
	  ,link: function(scope,element, attrs){
	  }
      ,controller: 'ViewByMatchTournamentController'
      ,controllerAs:'ctrl'
    	};
  }]
);
