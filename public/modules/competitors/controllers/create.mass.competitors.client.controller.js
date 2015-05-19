'use strict';

angular.module('competitors').controller('CompetitorsMassCreateController', ['$scope', '$location', 'CompetitorMassCreateHelper','MassCompetitors'
 ,function($scope, $location, CMassCreateHelper, MCompetitors) {

    var ctrl = this;

    $scope.createMassCompetitors = function(text) {
      var competitors = CMassCreateHelper.splitEmailList(text);
      var mCompetitors = new MCompetitors({competitors:competitors});
      mCompetitors.$massCreate(function(response) {
          var allCompetitors = response.competitors.concat(response.existingCompetitors);
          $scope.created_mass_competitors = allCompetitors;
          if($scope.created_callback) {
            $scope.created_callback(allCompetitors,response);
          }

          if($scope.bounce && $scope.bounce === true) {
            var bounceLink = $scope.bounce_link ? $scope.bounce_link: 'competitors';
	        $location.path(bounceLink);
          } else {
            ctrl.message = 'competitors created:'.concat(response.competitors.length,', competitors existing:',response.existingCompetitors.length);
          }
	    }, function(errorResponse) {
	      ctrl.error = errorResponse.data.message;
	  });
    };

}]);
