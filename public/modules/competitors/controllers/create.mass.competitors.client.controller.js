'use strict';

angular.module('competitors').controller('CompetitorsMassCreateController', ['$scope', '$stateParams', '$location', 'Authentication', 'Competitors','Competitor-Helper','Competitor-Mass-Create-Helper','Mass-Competitors'
 ,function($scope, $stateParams, $location, Authentication, Competitors,CompHelper,CMassCreateHelper, MCompetitors) {

    var ctrl = this;

    $scope.createMassCompetitors = function(text) {
      var competitors = CMassCreateHelper.splitEmailList(text);
      var mCompetitors = new MCompetitors({competitors:competitors});
      mCompetitors.$massCreate(function(response) {
          $scope.createdMassCompetitors = response.competitors;

          if($scope.bounce && $scope.bounce === true) {
	        $location.path('competitors');
          } else {
            console.log(response);
            ctrl.message = 'competitors created:'.concat(response.competitors.length,', competitors existing:',response.existingCompetitors.length);
          }
	    }, function(errorResponse) {
	      ctrl.error = errorResponse.data.message;
	  });
    };

}]);
