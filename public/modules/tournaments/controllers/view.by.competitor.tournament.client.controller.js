'use strict';

angular.module('tournaments')
    .controller('ViewByCompetitorTournamentController', ['$scope', '$stateParams', '$location','$filter', '$q', 'Authentication', 'Tournaments', 'Competitors','Tournament.Results','Tournament-Helper','Core-Helper','Competitor-Helper','Populated-Tournament','Match-Rounds-Results-Helper','_service'
  ,function($scope, $stateParams, $location, $filter, $q, Authentication, Tournaments, Competitors, TResults,THelper,CHelper,CompetitorHelper,PTournament,MRHelper,_s) {
  // add auth
  var ctrl = this;
  
  $scope.competitorResults=[];

    $scope.$watch('tournament',function(newVal, oldVal) {
      $scope.competitorResults = $scope.calculateCompetitorResults(newVal);
    });


  $scope.calculateCompetitorResults = function(tournament) {
    if(!tournament) {
      return [];
    }
    var competitorResults = [];
    var matches = tournament.matches;
    if(tournament && tournament.competitors_full) {
      tournament.competitors_full.forEach(function(competitor) {
        var competitorResult = {};
        competitorResult.competitor = competitor;
        competitorResult.gamesPlayed = MRHelper.getCompetitorGamesPlayedFromMatches(competitor,matches);
        competitorResult.wins = MRHelper.getCompetitorWinsFromMatches(competitor,matches);
        competitorResult.losses = MRHelper.getCompetitorLossesFromMatches(competitor, matches);
        competitorResult.ties = MRHelper.getCompetitorTiesFromMatches(competitor,matches);
        competitorResult.strengthOfSchedule = MRHelper.getStrengthOfScheduleWins(competitor,matches);
        competitorResult.points = {};
        competitorResult.points.value = MRHelper.getCompetitorPointsFromMatches(competitor,matches);

        if(Array.isArray(competitorResult.points.value)) {
            competitorResult.points.display = competitorResult.points.value.join(':');
        } else {
          competitorResult.points.display = competitorResult.points.value;
        }

        if(competitorResult.points.display==='') {
            competitorResult.points.display='-';
        }
        competitorResult.tbd = MRHelper.getCompetitorTBDFromMatches(competitor, matches);
        competitorResults.push(competitorResult);
      });
    }

    var rankedResults = sortByWinsThenStrengthOfSchedule(competitorResults,matches);
    assignRankToResultsByWinsThenStrengthOfSchedule(rankedResults);
    return rankedResults;
  };

  var assignRankToResultsByWinsThenStrengthOfSchedule = function(rankedResults) {
    rankedResults.forEach(function(rankedResult,index) {
      if(index>0 && rankedResult.wins === rankedResults[index-1].wins && rankedResult.strengthOfSchedule === rankedResults[index-1].strengthOfSchedule) {
        rankedResult.rank = rankedResults[index-1].rank;
      } else {
        rankedResult.rank = index+1;
      }
    });
  };

  var sortByWinsThenStrengthOfSchedule = function(results, matches) {
    return _s.sortByOrder(results
      ,['wins','strengthOfSchedule'],[false, false]);
  };

  $scope.getMatchResultName = function(match) {
    return MRHelper.getMatchResultName(match);
  };

  $scope.getCompetitorResultName = function(match, competitor) {
    return MRHelper.getCompetitorResultName(match, competitor);
  };

}
]);

