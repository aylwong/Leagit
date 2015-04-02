'use strict';

angular.module('competitors').directive('competitorCreate', [function() {
	return {
	  scope: {
            competitor_selected_list: '=selected'
          }
	  ,restrict: 'E'
          ,templateUrl: 'modules/competitors/views/create.competitor.client.template.html'
          ,replace: true
	  ,link: function(scope,element, attrs){
	  }
	  ,controller: 'CompetitorCreateController'
	  ,controllerAs: 'ctrl'
    	};
  }]
);
