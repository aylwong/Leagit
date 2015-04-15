'use strict';

//Matches service used for communicating with the tournaments REST endpoints
// Match helper functions to manipulate match objects
angular.module('match_rounds').factory('Create-Match-Rounds-Core', ['$filter', 'Core-Helper','Match-Helper','Tournament.Results', function($filter,CHelper, MHelper, TResults) {

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

  // Get max rounds
  var getMaxRound = function(tournament){
     var result = tournament.matches.reduce(
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

// Create Match Round with random pairings
  var createMatchRoundWithRandomPairing = function(competitors, round, nameSuffixArg) {
    var nameSuffix = nameSuffixArg? nameSuffixArg: '';
    var competitorsList = [].concat(competitors);
    var maxLoop = competitorsList.length;
    var matches = [];

    // Pair off competitors
    for(var i=0;i<maxLoop && 0 < competitorsList.length; i++) {
      var match = MHelper.createEmptyMatch();
      match.round=round;
      match.name="Match:".concat(match.round,"-",(i+1).toString(),nameSuffix);
      match.competitors.push(spliceRandomEntryFromList(competitorsList));

      if(competitorsList.length>0) {
        match.competitors.push(spliceRandomEntryFromList(competitorsList));
      }

      matches.push(match);
    }
      
    return matches;
  };

  // Splice 1 random entry from list
  // returns the object spliced;
  var spliceRandomEntryFromList = function(list) {
    if(list.length<1) throw new Error('list has no entries');

    var index = randomIntFromInterval(0,list.length-1);
    return list.splice(index,1)[0];
  };

  var randomIntFromInterval = function(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  };

  // Get list of competitors
  var getCompetitorsInMatches = function(matches) {
    var competitors = [];

    matches.forEach(function(match) {
      competitors = _s.union(competitors,match.competitors);
    });

    return competitors;
  };

  var removeEntryFromList = function(entry, list) {
    var index =  list.some(function(listItem) {
      return CHelper.sameIdStrings(listItem,entry);
    });
    return list.splice(index,1);
  };

  return {
    getCompetitorMatchesFromMatches: getCompetitorMatchesFromMatches
    ,getCompetitorsInMatches: getCompetitorsInMatches
    ,removeEntryFromList: removeEntryFromList
    ,competitorInIdList: competitorInIdList
    ,getMaxRound: getMaxRound
    ,createMatchRoundWithRandomPairing: createMatchRoundWithRandomPairing
  };
}]);
