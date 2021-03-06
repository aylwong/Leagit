'use strict';

angular.module('competitors').controller('CompetitorsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Competitors','CompetitorHelper'
  ,function($scope, $stateParams, $location, Authentication, Competitors, CompHelper) {
    $scope.authentication = Authentication;

    $scope.create = function() {
      var competitor = CompHelper.createNewCompetitor(this);

      competitor.$save(function(response) {
	    $location.path('competitors/' + response._id);
	  }, function(errorResponse) {
	    $scope.error = errorResponse.data.message;
	  });

	  this.name = '';
	  this.email = '';
	  this.description ='';
	  this.imageLink = '';
    };

    $scope.remove = function(competitor) {
      if (competitor) {
	competitor.$remove();

     	for (var i in $scope.competitors) {
	  if ($scope.competitors[i] === competitor) {
	    $scope.competitors.splice(i, 1);
	  }
        }
      } else {
	$scope.competitor.$remove(function() {
	  $location.path('competitors');
	});
      }
    };

    $scope.update = function() {
      var competitor = $scope.competitor;
      
      competitor.$update(function() {
	  $location.path('competitors/' + competitor._id);
	}, function(errorResponse) {
	  $scope.error = errorResponse.data.message;
	});
    };

    $scope.find = function() {
      $scope.competitors = Competitors.query();
    };

    $scope.findOne = function() {
      $scope.competitor = Competitors.get({
	competitorId: $stateParams.competitorId
      });
    };
  }
]);
