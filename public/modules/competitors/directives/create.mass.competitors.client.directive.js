'use strict';

angular.module('competitors').directive('competitorsMassCreate', [function() {
	return {
	  scope: {
            created_mass_competitors: '=?createdcompetitors'
            ,bounce: '=?bounce'
            ,bounce_link: '=?bouncelink'
            ,created_callback: '=?createdcallback'
          }
	  ,restrict: 'E'
          ,templateUrl: 'modules/competitors/views/create.mass.competitors.client.template.html'
          ,replace: true
	  ,link: function(scope,element, attrs){
	  }
	  ,controller: 'CompetitorsMassCreateController'
	  ,controllerAs: 'ctrl'
    	};
  }]
);
