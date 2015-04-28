'use strict';

angular.module('matches_edit').directive('massEditMatches', [function() {
	return {
	  scope: {
        match: '=match'
          }
	  ,restrict: 'E'
          ,templateUrl: 'modules/matches/views/mass.edit.matches.client.template.html'
          ,replace: true
	  ,link: function(scope,element, attrs){
	  }
	  ,controller: 'MassEditMatchesController'
	  ,controllerAs: 'ctrl'
    	};
  }]
);
