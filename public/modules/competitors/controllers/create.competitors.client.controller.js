'use strict';

angular.module('competitors').controller('CompetitorCreateController', ['$scope', '$stateParams', '$location', 'Authentication', 'Competitors',
function($scope, $stateParams, $location, Authentication, Competitors) {
	$scope.authentication = Authentication;
	var ctrl = this;
	ctrl.competitor_selected_list = $scope.competitor_selected_list;

	var getNewCompetitor = function(name,email,description)
	{
	  var competitor = new Competitors({
	    name:name
	    ,email:email
	    ,description:description
	  });

	  return competitor;
	};

	ctrl.competitor = getNewCompetitor('','','');

	ctrl.create = function(new_competitor) {
	  var competitor = new Competitors({
	    name: new_competitor.name
	    ,email: new_competitor.email
	    ,description: new_competitor.description
	  });

	  competitor.$save(function(competitor) {
	    $scope.competitor_selected_list.push(competitor);
	  }, function(errorResponse) {
	    ctrl.error = errorResponse.data.message;
	    $scope.error = errorResponse.data.message;
	  });

	  ctrl.competitor = getNewCompetitor('','','');
	};
}]);
