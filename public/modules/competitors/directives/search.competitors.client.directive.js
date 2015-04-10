'use strict';

angular.module('competitor_searches').directive('competitorSearch', [function() {
	return {
	  scope: {
            competitor_list: '=list'
	    ,initial_parameters: '=?parameters'
          }
	  ,restrict: 'E'
          ,templateUrl: 'modules/competitors/views/search.competitors.client.template.html'
          ,replace: true
	  ,link: function(scope,element, attrs){
	  }
	  ,controller: 'CompetitorSearchesController'
	  ,controllerAs: 'ctrl'
    	};
  }]
);
