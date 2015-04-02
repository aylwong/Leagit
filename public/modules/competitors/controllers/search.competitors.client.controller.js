'use strict';

angular.module('competitor_searches').controller('CompetitorSearchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Competitors', 'Core-Helper','CompetitorsSearch',

	function($scope, $stateParams, $location, Authentication, Competitors, CHelper,CompetitorsSearch) {
	
	var ctrl = this;

	ctrl.competitors_list=[{name:'example t1'}];

	ctrl.searchTerm = "";
	ctrl.byEmailToo = false;
	ctrl.orSearch = false;
	
	ctrl.initialParams = $scope.initial_parameters;	

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
	  if(ctrl.initialParams) {
	    angular.extend(params,ctrl.initialParams);
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
	}
  }
]);
