'use strict';

angular.module('matches')
  .controller('CreateAdHocMatchesController', ['$scope', '$stateParams', 'Authentication', 'Competitors','Tournament.Results','Tournaments','Matches','Core-Helper', 'Match-Helper','_service','Create-Match-Rounds-Core','Create-Match-Rounds-Result'
  ,function($scope, $stateParams, Authentication, Competitors, TResults,Tournaments,Matches,CHelper,MHelper,_s,CMRoundsCore, CMRoundsResult) {

  var ctrl = this;

  ctrl.tournament = $scope.tournament;

  $scope.createRandomAdHocMatches = function(tournament) {

    var nextRound = CMRoundsCore.getMaxRound(tournament)+1;
    var roundMatches = CMRoundsCore.createMatchRoundWithRandomPairing(tournament.competitors_full, nextRound);

    // Add Matches to tournament
    tournament.matches.push.apply(tournament.matches,roundMatches);
  };

  $scope.createNextRoundBasedOnWins = function(tournament) {
    var nextRound = CMRoundsCore.getMaxRound(tournament)+1;
    var roundMatches = CMRoundsResult.createRoundBasedOnWins(tournament,nextRound);

    // Add Matches to tournament
    tournament.matches.push.apply(tournament.matches,roundMatches);
  }

  $scope.createMatches = function(tournament) {

  };

  $scope.createStartRound = function(tournament) {
    // If tournament
    CMRoundsCore.createMatchRoundWithRandomPairing($scope.tournament.competitors_full,1);
  };

  $scope.createNextRound = function(tournament) {
    var maxRound = CMRoundsCore.getMaxRound(tournament);
    CMRoundsCore.createMatchRoundWithRandomPairing($scope.tournament.competitors_full,maxRound+1);
  }; 
  
}
]);