'use strict';

angular.module('competitor_searches').controller('CompetitorSearchesController', ['$scope', 'CompetitorsSearch',

	function($scope, CompetitorsSearch) {
	
	var ctrl = this;

	ctrl.competitors_list=[{name:''}];
	ctrl.searchTerm = '';
	ctrl.byEmailToo = false;
	ctrl.orSearch = false;
	
	ctrl.search = function(searchText) {

	  var searchParams = createInitialParams(searchText);
	  var competitors = CompetitorsSearch.query(searchParams);

	  competitors.$promise.then(function(competitors) {
	    // the scope of the competitor
	    $scope.competitor_list = competitors;
	  });
	};

	var createInitialParams = function(searchText) {
	  var params = {};

	  // Add entry to params
	  if($scope.initial_parameters) {
	   angular.extend(params,$scope.initial_parameters);	
	  }

	  // Merge. 
	  params.name = searchText;

	  if(params.or===false) {
	    params.or = ctrl.orSearch.toString();
	  }

	  if(ctrl.byEmail === true) {
	    params.email = searchText;
	  }

	  return params;
	};
  }
]);
