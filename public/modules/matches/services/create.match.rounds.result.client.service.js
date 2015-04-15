'use strict';

//Matches service used for communicating with the tournaments REST endpoints
// Match helper functions to manipulate match objects
angular.module('match_rounds').factory('Create-Match-Rounds-Result', ['$filter', 'Core-Helper','Match-Helper','Tournament.Results','Create-Match-Rounds-Core', function($filter,CHelper, MHelper, TResults,CMRoundsC) {

  // Get Next Round
  var createRoundBasedOnWins = function(tournament,round) {
    var nextRound = round? round: CMRoundsC.getMaxRound(tournament)+1;
    
    // Get competitors.
    var competitors = tournament.competitors_full;
    var competitorWinsList = getListOfCompetitorListsGroupedByWins(competitors,tournament.matches);

    var finalMatches = [];
    competitorWinsList.forEach(function(competitorsWithSameWins,index) {
      var roundMatches = CMRoundsC.createMatchRoundWithRandomPairing(competitorsWithSameWins
        ,nextRound
        , '-'.concat(index.toString(),'wins') );

      // Add Matches to tournament
      finalMatches.push.apply(finalMatches,roundMatches);
    });

    return finalMatches;
  };

  // Gets an array of competitors grouped by wins
  // The index of the array is the number of wins.
  var getListOfCompetitorListsGroupedByWins = function(competitors, matches)  {
    var competitorWinsList = [];

    competitors.forEach(function(competitor) {
      var competitorWins = getCompetitorWinsFromMatches(competitor,matches);
      if(competitorWinsList[competitorWins]) {
        competitorWinsList[competitorWins].push(competitor);
      } else {
        competitorWinsList[competitorWins] = [];
        competitorWinsList[competitorWins].push(competitor);
      }
    });

    return competitorWinsList;
  };

  // Get Competitr wins from list of matches
  var getCompetitorWinsFromMatches = function(competitor,matches) {
    var reduceFunction = resultWinsReduceFunction;

    // get Wins for result
    var compResults = getCompetitorResultsFromMatches(competitor, matches);
    var totalResult = compResults.reduce(reduceFunction,0);
    return totalResult;
  };

  // Get Competitor Results From Matches
  var getCompetitorResultsFromMatches = function(competitor, matches) {
    var results = [];
    var competitorMatches = CMRoundsC.getCompetitorMatchesFromMatches(competitor, matches);

    competitorMatches.forEach(function(match) {
	results = results.concat(getCompetitorResultsFromMatch(competitor,match));
    });

    return results;
  };

  // Get Number of wins from result lists
  var getNumberOfWinsFromResults = function(results) {
    return getNumberOfResultTypeFromResults(TResults.key.win,results);
  };

  // Get Number of losses from result lists
  var getNumberOfLossesFromResults = function(results) {
    return getNumberOfResultTypeFromResults(TResults.key.loss,results);
  };

  // Get Number of ties from result lists
  var getNumberOfTiesFromResults = function(results) {
    return getNumberOfResultTypeFromResults(TResults.key.tie,results);
  };

  // Calculate Total with result based on result Function
  var calculateResultTotal = function(resultFunction,results) {
    var resultsValue = results.reduce(function(previousValue, currentElement) {
        return resultFunction(currentElement, previousValue);
    },0);
  };

  // Get Number of wins from results
  var getNumberOfWinsFromResults = function (resultsTypeKey, results) {
    calculateResultTotal(function(currentElement,previousValue) {
      if(currentElement.key === resultsTypeKey) {
        return previousValue+1;
      } else {
 	return previousValue;
      }
    },results);
  };

  // Get the Competitor Results from match 
  var getCompetitorResultsFromMatch = function(competitor, match) {
    var results = [];
    match.results.forEach(function(result) {
      if(CMRoundsC.competitorInIdList(competitor,result)) {
	results.push(result);
      };
    });
    return results;
  };

  // get Wins Reduce Function for Array.reduce
  var resultWinsReduceFunction = function(previousValue, currentValue) {
    return previousValue + get1IfResultHasKey(currentValue, TResults.key.win);
  };

  // get Loss Reduce Function for Array.reduce
  var resultLossReduceFunction = function(previousValue, currentValue) {
    return previousValue + get1IfResultHasKey(currentValue, TResults.key.loss);
  };

  // get Tie Reduce Function for Array.reduce
  var resultTieReduceFunction = function(previousValue, currentValue) {
    return previousValue + get1IfResultHasKey(currentValue, TResults.key.tie);
  };

  // get TBD Reduce Function for Array.reduce
  var resultTBDReduceFunction = function(previousValue, currentValue) {
    return previousValue + get1IfResultHasKey(currentValue, TResults.key.tBD);
  };

  // Previous Value
  // return 1 if result is of desired type, otherwise 0
  var get1IfResultHasKey = function(currentValue, resultTypeKey) {
    if(currentValue.key === resultTypeKey) {
	  return 1;
    } else {
	  return  0;
    }
  };

  // Get Points Reduce Function
  var resultPointsReduceFunction = function(previousValue, currentValue) {
    var reducePoint = previousValue.split(',');
    var currentPoint = currentValue.split(',');
    return addArrayEntries(reducePoint, currentPoint).join(',');
  };

  // Add The entries in two arrays into a new array that is the addition of both
  var addArrayEntries = function(result1, result2) {
    var longerResult, shortResult, finalResult = [];

    if(result1.length > result2.length) {
      longResult = result1;
      shortResult = result2;
    } else {
      longResult = result2;
      shortResult = result1;
    }

    longResult.forEach(function(currentValue,index,array) {
      if(shortResult.length > index+1) {
        finalResult[index] = longResult[index] + shortResult[index];
      } else {
	finalResult[index] = longResult[index];
      }
    });

    return finalResult;
  };

  // GET Strength of Schedule for player
  var getStrengthOfScheduleWins = function(competitor, matches) {
    var reduceFunction = resultWinsReduceFunction;
    var competitorMatches = CMRoundsC.getCompetitorMatchesFromMatches(competitor, matches);
    var otherCompetitors = CMRoundsC.getCompetitorsInMatches(competitorMatches);

    // remove the current competitor
    var competitorEntry = CMRoundsC.removeEntryFromList(competitor,otherCompetitors);

    var finalResult = 0;
    var competitorsWithWins = [];

    // Get wins of competitors.
    otherCompetitors.forEach(function(oComp) {
      var totalResult = getCompetitorWinsFromMatches(oComp,matches);
      competitorsWithWins.push({competitor:oComp, result:totalResult});
      finalResult=totalResult+finalResult;
    });

    return finalResult;
  };

  return {
    createRoundBasedOnWins:createRoundBasedOnWins
  };
}]);
