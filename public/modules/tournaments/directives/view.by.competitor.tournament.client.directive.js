'use strict';

angular.module('tournaments').directive('viewByCompetitorTournament', [function() {
	return {
	  scope: {
	    tournament: '=tournament'
          }
	  ,restrict: 'E'
          ,templateUrl: 'modules/tournaments/views/view.by.competitor.tournament.client.template.html'
          ,replace: true
	  ,link: function(scope,element, attrs){
	  }
      ,controller: 'ViewByCompetitorTournamentController'
      ,controllerAs:'ctrl'

    	};
  }]
);
