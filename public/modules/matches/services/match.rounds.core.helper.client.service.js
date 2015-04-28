'use strict';

//Matches service used for communicating with the tournaments REST endpoints
// Match helper functions to manipulate match objects
angular.module('match_rounds').factory('Match-Rounds-Core-Helper', ['$filter', 'Core-Helper','Match-Helper','Tournament.Results','_service'
, function($filter,CHelper, MHelper, TResults,_s) {

  // Get list of matches for competitor
  var getCompetitorMatchesFromMatches = function(competitor, listOfMatches) {
    var matches = [];
    listOfMatches.forEach(function(match) {
      if(competitorInList(competitor,match)) {
	 matches.push(match);
      }
    });
    return matches;
  };

  // Get matches
  var competitorInList = function(competitor,list) {
    var result = list.competitors.some(function(newCompetitor) {
      return CHelper.sameIdStrings(newCompetitor,competitor);
    });

    return result;
  };

  // Get matches from an Id List
  var competitorInIdList = function(competitor,list) {
    var result = list.competitors.some(function(newCompetitor) {
      return CHelper.getId(competitor).toString() === newCompetitor.toString();
    });

    return result;
  };

  // Get max round of a set of Matches
  var getMaxRound = function(matches){
     var result = matches.reduce(
    function(previousValue, currentValue) {
      if(!currentValue.round || previousValue>currentValue.round) {
     	return previousValue;
      } else {
	return currentValue.round;
      }
    }
    ,0);

    return result;
  };

  // returns if number is Odd
  var isOdd = function(num) { 
    return (num % 2) === 1;
  };

  var createDefaultNameFunction = function(round) {
    return function(matchNumber) {
      return 'Match:'.concat(round.toString(),'-',matchNumber.toString());
    };
  };

  // Get list of competitors
  var getCompetitorsInMatches = function(matches) {
    var competitors = [];

    matches.forEach(function(match) {
      competitors = _s.union(competitors,match.competitors);
    });

    return competitors;
  };

  return {
    isOdd: isOdd
    ,getCompetitorMatchesFromMatches: getCompetitorMatchesFromMatches
    ,getCompetitorsInMatches: getCompetitorsInMatches
    ,competitorInIdList: competitorInIdList
    ,getMaxRound: getMaxRound
  };
}]);
