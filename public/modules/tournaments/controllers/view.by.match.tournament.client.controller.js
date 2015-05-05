'use strict';

angular.module('tournaments')
    .controller('ViewByMatchTournamentController', ['$scope','Match-Rounds-Results-Helper','_service'
  ,function($scope,MRHelper,_s) {
  // add auth
  var ctrl = this;

  $scope.getMatchResultName = function(match) {
    return MRHelper.getMatchResultName(match);
  };

  $scope.getCompetitorResultName = function(match, competitor) {
    return MRHelper.getCompetitorResultName(match, competitor);
  };

  $scope.sortedMatches = function(matches) {
    return _s.sortByOrder(matches,['round','name'],[false,false]);
  };

}
]);

