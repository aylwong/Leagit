'use strict';

angular.module('matches')
  .controller('AutoCreateMatchesController', ['$scope', '$stateParams', 'Authentication', 'Competitors','Tournament.Results','Tournaments','Matches','Core-Helper', 'Match-Helper','_service','Create-Match-Rounds-Core','Create-Match-Rounds-Result', 'Create-Match-Rounds-Ladder','Create-Match-Rounds-Round-Robin'
  ,function($scope, $stateParams, Authentication, Competitors, TResults,Tournaments,Matches,CHelper,MHelper,_s,CMRoundsCore, CMRoundsResult,CMRoundsLadder,CMRoundsRoundRobin) {

  var ctrl = this;

  ctrl.tournament = $scope.tournament;

  $scope.createRandomAdHocMatches = function(tournament) {
    var nextRound = CMRoundsCore.getMaxRound(tournament.matches)+1;
    var roundMatches = CMRoundsCore.createMatchRoundWithRandomPairing(tournament.competitors_full, nextRound);

    // Add Matches to tournament
    tournament.matches.push.apply(tournament.matches,roundMatches);
  };

  $scope.createNextRoundBasedOnWins = function(tournament) {
    var nextRound = CMRoundsCore.getMaxRound(tournament.matches)+1;
    var roundMatches = CMRoundsResult.createRoundBasedOnWins(tournament,nextRound);

    // Add Matches to tournament
    tournament.matches.push.apply(tournament.matches,roundMatches);
  };

  $scope.updateMatchesBasedOnLadder = function(tournament) {
    var roundMatches = CMRoundsLadder.updateMatchesBasedOnLadder(tournament);
  };

  $scope.createRoundsBasedOnRoundRobin = function(tournament) {
    var roundMatches = CMRoundsRoundRobin.createRoundsBasedOnRoundRobin(tournament);
  };

  $scope.createMatches = function(tournament) {

  };

  $scope.createStartRound = function(tournament) {
    // If tournament
    CMRoundsCore.createMatchRoundWithRandomPairing($scope.tournament.competitors_full,1);
  };

  $scope.createNextRound = function(tournament) {
    var maxRound = CMRoundsCore.getMaxRound(tournament.matches);
    CMRoundsCore.createMatchRoundWithRandomPairing($scope.tournament.competitors_full,maxRound+1);
  }; 

  $scope.removeRound = function(tournament, round) {
    CMRoundsCore.removeRoundFromMatches(tournament,round);
  };

  $scope.removeMaxRound = function(tournament) {
    var maxRound = CMRoundsCore.getMaxRound(tournament.matches);
    $scope.removeRound(tournament,maxRound);
  };

}
]);
