'use strict';

//Matches service used for communicating with the tournaments REST endpoints
// Match helper functions to manipulate match objects
angular.module('matches').factory('Match-Rounds-Results-Helper', ['$filter', 'Core-Helper','Tournament.Results','Match-Rounds-Core-Helper','_service'
 ,function($filter,CHelper,TResults,MRoundsCoreH,_s) {


  var  getMatchResultName = function(match) {
      var result;
        if(match.results && match.results.length>0) {
          if(resultExists(match.results,TResults.key.win)) {
            return TResults.getName(TResults.key.win);
          } 
          return TResults.getName(match.results[0].key);
        } else {
          return TResults.getName(TResults.key.tBD);
        }
  };

  var resultExists = function(results,key) {
    return results.some(function(result) {
      return result.key === key;
    });
  };

  var getCompetitorResultName = function(match, competitor) {
    var result = _s.find(match.results,function(result) {
      var competitorId = CHelper.hasId(competitor) ? CHelper.getId(competitor) : competitor;
      return existsInList(result.competitors, competitorId);
    });
    if(!result) {
      return TResults.getName(TResults.key.tBD);
    } else {
      return result.name;
    }
  };

  var existsInList = function(list, item) {
    return list.some(function(entry) {
      return entry.toString() === item.toString();
    });
  };

   var getCompetitorGamesPlayedFromMatches = function(competitor,matches) {
     var compResults = getCompetitorResultsFromMatches(competitor, matches);
     return compResults.reduce(resultGamesPlayedReduceFunction,0);
   };

   var getCompetitorPointsFromMatches = function(competitor,matches) {
     var compResults = getCompetitorResultsFromMatches(competitor, matches);
     return compResults.reduce(resultPointsReduceFunction,0);

    };   

  // Get Competitr wins from list of matches
  var getCompetitorWinsFromMatches = function(competitor,matches) {
    var reduceFunction = resultWinsReduceFunction;

    // get Wins for result
    var compResults = getCompetitorResultsFromMatches(competitor, matches);
    var totalResult = compResults.reduce(reduceFunction,0);
    return totalResult;
  };

  var getCompetitorLossesFromMatches = function(competitor,matches) {
    var compResults = getCompetitorResultsFromMatches(competitor,matches);
    return compResults.reduce(resultLossesReduceFunction,0);
  };

  var getCompetitorTiesFromMatches = function(competitor,matches) {
    var compResults = getCompetitorResultsFromMatches(competitor,matches);
    return compResults.reduce(resultTiesReduceFunction,0);
  };

  var getCompetitorTBDFromMatches = function(competitor,matches) {
    var compResults = getCompetitorResultsFromMatches(competitor,matches);
    return compResults.reduce(resultTBDReduceFunction,0);
  };

  // Get Competitor Results From Matches
  var getCompetitorResultsFromMatches = function(competitor, matches) {
    var results = [];
    var competitorMatches = MRoundsCoreH.getCompetitorMatchesFromMatches(competitor, matches);

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
  var getNumberOfResultTypeFromResults = function (resultsTypeKey, results) {
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
      if(MRoundsCoreH.competitorInIdList(competitor,result)) {
	    results.push(result);
      }
    });
    return results;
  };

  // get Wins Reduce Function for Array.reduce
  var resultWinsReduceFunction = function(previousValue, currentValue) {
    return previousValue + get1IfResultHasKey(currentValue, TResults.key.win);
  };

  // get Loss Reduce Function for Array.reduce
  var resultLossesReduceFunction = function(previousValue, currentValue) {
    return previousValue + get1IfResultHasKey(currentValue, TResults.key.loss);
  };

  // get Tie Reduce Function for Array.reduce
  var resultTiesReduceFunction = function(previousValue, currentValue) {
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

  var resultGamesPlayedReduceFunction = function(previousValue, currentValue) {
    return previousValue + 1;
  };

  var resultPointsReduceFunction = function(previousValue, currentValue) {
    if (currentValue.points && Array.isArray(currentValue.points)) {
      return addArrayEntries(previousValue,currentValue.points);     
     } else if (!currentValue.points) {
        return previousValue;
     } else{
        return previousValue + currentValue.points;
     }
  };

  // Add The entries in two arrays into a new array that is the addition of both
  var addArrayEntries = function(result1, result2) {
    var longResult, shortResult, finalResult = [];

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
    var competitorMatches = MRoundsCoreH.getCompetitorMatchesFromMatches(competitor, matches);
    var otherCompetitors = MRoundsCoreH.getCompetitorsInMatches(competitorMatches);

    // remove the current competitor
    var competitorEntry = CHelper.removeEntryFromList(competitor,otherCompetitors);

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
    getStrengthOfScheduleWins: getStrengthOfScheduleWins
    ,getCompetitorWinsFromMatches: getCompetitorWinsFromMatches
    ,getCompetitorResultName: getCompetitorResultName
    ,getMatchResultName: getMatchResultName
    ,getCompetitorTiesFromMatches:getCompetitorTiesFromMatches
    ,getCompetitorLossesFromMatches:getCompetitorLossesFromMatches
    ,getCompetitorTBDFromMatches:getCompetitorTBDFromMatches
    ,getCompetitorGamesPlayedFromMatches:getCompetitorGamesPlayedFromMatches
    ,getCompetitorPointsFromMatches:getCompetitorPointsFromMatches
    ,getCompetitorResultsFromMatches: getCompetitorResultsFromMatches
  };
}]);
