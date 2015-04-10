'use strict';

angular.module('competitors').controller('CompetitorCreateController', ['$scope', '$stateParams', '$location', 'Authentication', 'Competitors','Competitor-Helper',
function($scope, $stateParams, $location, Authentication, Competitors,CompHelper) {
	$scope.authentication = Authentication;
	var ctrl = this;
	ctrl.competitor_selected_list = $scope.competitor_selected_list;
	var blankCompetitor = {
	  name:''
	  ,email:''
	  ,description:''
	};

	var getNewCompetitor = function(competitorObj)
	{
	  var competitor = CompHelper.createNewCompetitor(competitorObj);

	  return competitor;
	};

	ctrl.competitor = CompHelper.createNewCompetitor(blankCompetitor);

	ctrl.create = function(new_competitor) {
	  var competitor = CompHelper.createNewCompetitor(new_competitor);

	  competitor.$save(function(competitor) {
	    $scope.competitor_selected_list.push(competitor);
	  }, function(errorResponse) {
	    ctrl.error = errorResponse.data.message;
	    $scope.error = errorResponse.data.message;
	  });

	  ctrl.competitor = CompHelper.createNewCompetitor(blankCompetitor);
	};
}]);
