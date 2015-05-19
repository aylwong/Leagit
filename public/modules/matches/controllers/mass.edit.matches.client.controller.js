'use strict';

angular.module('matches')
  .controller('MassEditMatchesController', ['$scope', 'TournamentResults','CoreHelper', 'MatchRoundsResultsHelper'
  ,function($scope, TResults, CHelper, MRHelper) {

  var ctrl = this;

  //function(match, competitor)
  $scope.getCompetitorResultName = function(match, competitor) {
    return MRHelper.getCompetitorResultName(match, competitor);
  };

  $scope.getCompetitorResultButtonColour = function(match, competitor) {
    var resultKey = MRHelper.getCompetitorResult(match, competitor);
    if(resultKey === TResults.key.win) {
      return 'winButton';
    } else if (resultKey === TResults.key.loss) {
        return 'lossButton';
    }  else {
        return '';
    }
  };
  $scope.getMatchResultName = function(match) {
    return MRHelper.getMatchResultName(match);
  };

  // Switch Result
  $scope.switchResult = function(match) {
    if (!match.results || match.results.length===0 || match.results[0].key === TResults.key.tBD) {
      match.results = [];
      if(match.competitors.length>0) {
        match.results.push(TResults.createResult(TResults.key.win, CHelper.listToIds(match.competitors.slice(0,1))));
      }
      if (match.competitors.length>1) {
        match.results.push(TResults.createResult(TResults.key.loss, CHelper.listToIds(match.competitors.slice(1))));
      }
    } else if(match.results[0].key === TResults.key.win) {
      match.results = [];
      match.results.push(TResults.createResult(TResults.key.tie, CHelper.listToIds(match.competitors)));
    } else if(match.results[0].key === TResults.key.tie) {
      match.results = [];
      match.results.push(TResults.createResult(TResults.key.tBD, CHelper.listToIds(match.competitors)));
    }
  };

  $scope.swapWinner = function(match,competitor) {
    var winResult = TResults.getResultFromResults(match.results,TResults.key.win);
    var lossResult = TResults.getResultFromResults(match.results,TResults.key.loss);

    if(winResult && lossResult) {
      var winCompetitors = winResult.competitors;
      var lossCompetitors = lossResult.competitors;
      winResult.competitors = lossCompetitors;
      lossResult.competitors = winCompetitors;
    }
  }; 
}
]);
