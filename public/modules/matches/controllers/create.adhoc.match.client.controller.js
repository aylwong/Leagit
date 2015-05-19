'use strict';

angular.module('matches')
  .controller('CreateAdHocMatchesController', ['$scope', '$stateParams', 'Authentication', 'Competitors','TournamentResults','Tournaments','Matches','CoreHelper', 'MatchHelper','_service','CreateMatchRoundsCore','CreateMatchRoundsResult', 'CreateMatchRoundsLadder','CreateMatchRoundsRoundRobin'
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
  
}
]);
