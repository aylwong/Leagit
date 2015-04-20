'use strict';

//Matches service used for communicating with the tournaments REST endpoints
// Match helper functions to manipulate match objects
angular.module('match_rounds').factory('Create-Match-Rounds-Core', ['$filter', 'Core-Helper','Match-Helper','Tournament.Results','_service'
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

  // returns if number is Odd
  var isOdd = function(num) { 
    return (num % 2) === 1;
  };

  var createDefaultNameFunction = function(round) {
    return function(matchNumber) {
      return 'Match:'.concat(round.toString(),'-',matchNumber.toString());
    };
  };

// Create Match Round with random pairings
  var createMatchRoundWithRandomPairing = function(competitors, round, matchNumber, nameFunction) {
//    var nameSuffix = nameSuffixArg? nameSuffixArg: '';
    matchNumber = matchNumber? matchNumber: 1;
    nameFunction = nameFunction? nameFunction: createDefaultNameFunction(round);

    var competitorsList = [].concat(competitors);
    var maxLoop = competitorsList.length;
    var matches = [];


    // If list would be odd, add a match.
    if(isOdd(competitorsList.length)) {
      var oddCompetitor = spliceRandomEntryFromList(competitorsList);
      var oddMatchName = nameFunction(matchNumber);
      var oddMatch = createMatchWith1Competitor(oddCompetitor,round,oddMatchName);

      matches.push(oddMatch);
      matchNumber = matchNumber+1;
    }

    // Pair off competitors
    for(var i=matchNumber; i<maxLoop+matchNumber && 0 < competitorsList.length; i++) {
      var competitor = spliceRandomEntryFromList(competitorsList);
      var matchName = nameFunction(i);
      var match = createMatchWith1Competitor(competitor,round,matchName);

      if(competitorsList.length>0) {
        match.competitors.push(spliceRandomEntryFromList(competitorsList));
      }

      matches.push(match);
    }
      
    return matches;
  };

  // Create Match with 1 Random Competitor
  var createMatchWith1RandomCompetitor = function(competitors, round, name) {
      var competitor = spliceRandomEntryFromList(competitors);
      return createMatchWith1Competitor(competitor,round,name);
  };

  // creat Match with 1 Competitor
  var createMatchWith1Competitor = function(competitor,round,name) {
    var match = MHelper.createEmptyMatch();
    match.round=round;
    match.name=name;
    match.competitors.push(competitor);
    return match;
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
    isOdd: isOdd
    ,createMatchWith1Competitor: createMatchWith1Competitor
    ,spliceRandomEntryFromList: spliceRandomEntryFromList
    ,getCompetitorMatchesFromMatches: getCompetitorMatchesFromMatches
    ,getCompetitorsInMatches: getCompetitorsInMatches
    ,removeEntryFromList: removeEntryFromList
    ,competitorInIdList: competitorInIdList
    ,getMaxRound: getMaxRound
    ,createMatchRoundWithRandomPairing: createMatchRoundWithRandomPairing
  };
}]);
