'use strict';

angular.module('competitors').directive('competitorsMassCreate', [function() {
	return {
	  scope: {
            createdMassCompetitors: '=createdcompetitors'
            ,bounce: '=?bounce'
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
