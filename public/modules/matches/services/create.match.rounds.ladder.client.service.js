'use strict';

//Matches service used for communicating with the tournaments REST endpoints
// Match helper functions to manipulate match objects
angular.module('match_rounds').factory('Create-Match-Rounds-Ladder', ['$filter', 'Core-Helper','Match-Helper','Tournament.Results','Create-Match-Rounds-Core','_service', function($filter,CHelper, MHelper, TResults,CMRoundsC,_s) {
  var updateMatchesBasedOnLadder = function(tournament) {
    if(!matchesAllHaveNumbers(tournament.matches))
    {
      throw new Error('Matches are Not Numbered');
    }
    
    var assignCompetitors;
    if (!tournament.matches || tournament.matches.length===0) {
      var finalMatches = createLadderMatches(tournament);
      tournament.matches = finalMatches;
    }

    // create matches
    assignCompetitorsToMatches(tournament);
  };

  var matchesAllHaveNumbers = function(matches) {
    var matchWithoutNumberExists = matches.some(function(match) {
      if(match.number) {
        return false;
      } else {
        return true;
      }
    });

    return !matchWithoutNumberExists;
  };

  var assignCompetitorsToMatches = function(tournament) {
    var matches = tournament.matches;
    var competitors = tournament.competitors_full;

    var matchWinProgressions = getMatchProgressions(tournament.matches, tournament.competitors.length);

    // Add competitors to InitialSpots.
    var wM0 = getStartingCompetitorMatchProgressions(matchWinProgressions);

    // Get competitors yet to be assigned
    var unassignedCompetitors = getUnassignedCompetitors(matches, competitors);

   addCompetitorsForStartingMatches(wM0, matches, unassignedCompetitors);

    // Check Matches with Results and advance them.
    advanceCompetitorsFromWonMatches(matches, matchWinProgressions, competitors);
  };

  // Get Starting Competitor Match Progressions
  var getStartingCompetitorMatchProgressions = function(matchProgressions) {
    var wM0 = matchProgressions.filter(function(wM) {
      return wM.comp1===0 || wM.comp2===0;
    });
    return wM0;
  };

  // Advance Competitors From Won Matches
  var advanceCompetitorsFromWonMatches = function(matches,matchWinProgressions, competitors) {
    var matchesWithWins = getMatchesWithWins(matches);
    matchesWithWins.forEach(function(match) {
      var matchChildNumber = getMatchProgressionChild(matchWinProgressions,match.number).number;
      var matchChild = getMatchWithNumber(matches,matchChildNumber);
      if (matchChild.competitors.length<2) {
        addCompetitorsToChildFromFinishedMatch(match, matchChild);
      }
    });
  };

  // Add Competitors from a Finished Match to a Child Match
  var addCompetitorsToChildFromFinishedMatch = function(match, matchChild) {
    // AdvanceResults
        var winningCompIds = getWinningCompetitors(match.results);
        var winningCompetitors = CHelper.idsToList(winningCompIds, match.competitors);
        if(winningCompetitors.length <= 0) {
          throw new Error('Ladders cannot have Ties.  Please Assign a competitor a Win');
        }
         // only use the top competitor
         var winningCompetitor = winningCompetitors[0];
        var matchChildAlreadyAdded = matchChild.competitors.some(function(comp) {
          return comp === winningCompetitor;
        });
          if(!matchChildAlreadyAdded) {
            matchChild.competitors.push(winningCompetitor);
          }
  };

  // Get Unassigned Competitors
  var getUnassignedCompetitors = function(matches, competitors) {
    var assignedCompetitors = CMRoundsC.getCompetitorsInMatches(matches);
    var unassignedCompetitors = competitors.filter(function(comp) {
       return !assignedCompetitors.some(function(aComp) {
          return aComp === comp;
       });
    });
    return unassignedCompetitors;
  };

  // Competitors for Starting matches
  var addCompetitorsForStartingMatches = function(matchProgressionsWithStartingMatches, matches, unassignedCompetitors) {
    matchProgressionsWithStartingMatches.forEach(function(wM) {
      var competitorsToAdd = 0;
      if (wM.comp1===0) { competitorsToAdd++; }
      if (wM.comp2===0) { competitorsToAdd++; }

      var match = getMatchWithNumber(matches,wM.number);
      if(match.competitors.length < competitorsToAdd) {
        var numLeftToAdd = competitorsToAdd - match.competitors.length; 
        match.competitors.push.apply(match.competitors, unassignedCompetitors.splice(0,numLeftToAdd));
      }
    });
  };

  var getTieingCompetitors = function(results) {
    return getCompetitorsWithKey(results,TResults.key.tie);
  };

  var getWinningCompetitors = function(results) {
    return getCompetitorsWithKey(results,TResults.key.win);
  };

  var getCompetitorsWithKey = function(results,resultKey) {
    var competitors = [];
    results.forEach(function(result) {
      if(result.key === resultKey) {
        competitors.push.apply(competitors, result.competitors);
      }
    });
    return competitors;
  };

  var getMatchProgressionChild = function(progressions,matchNumber) {
    return _s.find(progressions,function(progression) {
      return progression.comp1 === matchNumber || progression.comp2 === matchNumber;
    });
  };

  var getMatchesWithWins = function(matches) {
    var keys = [];
    keys.push(TResults.key.win);
    return getMatchesWithResultKeys(matches,keys);
  };

  var getMatchesWithResultKeys = function(matches,keys) {
    return matches.filter(function(match) {
      if(resultKeyInKeys(match.results,keys)) {
        return true;
      } else {
        return false;
      }
    });
  };

  var resultKeyInKeys = function(results,keys) {
    return results.some(function(result) {
      return keys.some(function(key) {
        return result.key === key;
      });
    });
  };

  var createRoundBasedOnLadder = function(tournament) {
    var finalMatches = [];
    return finalMatches;
  };

  // Match
  var createEmptyLadderMatch = function(round,name,matchNumber) {
    var match = MHelper.createEmptyMatch();
    match.round = round;
    match.name = name;
    match.number = matchNumber;

    return match;
  };

  var defaultMatchName = function(round, matchNumber) {
    return 'Match:'.concat(matchNumber,':',round);
  };

  // Get Next Round
  var createLadderMatches = function(tournament) {
    var finalMatches = [];
    var competitorNumber = tournament.competitors.length;

    // Start from the top and work down
    var numMatchesPerRound=1;
    var round=1;
    var matchNumberStart=-1;

    while(numMatchesPerRound * 2 <= competitorNumber) {
      var matches = createLadderMatchRound(numMatchesPerRound,round,matchNumberStart,true);
      finalMatches.push.apply(finalMatches,matches);
      matchNumberStart = matchNumberStart - numMatchesPerRound;
      
      if(numMatchesPerRound*2*2 >competitorNumber  ) {  
        break; 
      }

      numMatchesPerRound = numMatchesPerRound * 2;
      round = round + 1;
    }

    // ended on

    // create remainder matches.
    if(competitorNumber > numMatchesPerRound*2) {
      round = round + 1;
      numMatchesPerRound = competitorNumber - numMatchesPerRound*2;
      var remainderMatches = createLadderMatchRound(numMatchesPerRound,round,matchNumberStart,true);
      matchNumberStart = matchNumberStart - numMatchesPerRound;
      finalMatches.push.apply(finalMatches,remainderMatches);
    }

    reverseRoundAndNumberForMatches(finalMatches,matchNumberStart,round);

    return finalMatches;
  };

  // use log math to find the closest power of 2 less than the number.
  var closestPow2 = function(number) {
    return Math.pow(2,Math.floor(Math.log(number)/Math.log(2)));
  };

  var getMatchProgressions = function(allMatches, numCompetitors) {

    // split competitors into first 2 rounds.
    var numRoundOne = getNumRoundMatches(allMatches,1);
    var numRoundTwo;
    var currentRound = 1;
    var matchProgressions = [];

    // If prelim matches to fit in games
    if(numCompetitors > numRoundOne*2) {
      numRoundOne = getNumRoundMatches(allMatches,1);
      numRoundTwo = getNumRoundMatches(allMatches,2);
      var matchesRound1 = getRoundMatches(allMatches,1);
      var matchesRound2 = getRoundMatches(allMatches,2);

      matchesRound1 = _s.sortBy(matchesRound1,function(m) { return m.number; });
      matchesRound2 = _s.sortBy(matchesRound2,function(m) { return m.number; });

      matchesRound1.forEach(function(match) {
        var matchProgression = {number:match.number, comp1:0, comp2:0};
        matchProgressions.push(matchProgression);
      });
      var mProgressR2 = [];
      var r1Index = 0;
      var currentStep=numRoundTwo;
      var R2CompSpots = calculateR2CompSpots(numRoundOne, numRoundTwo*2);
      R2CompSpots = _s.sortBy(R2CompSpots,function(c) { return c;});
      R2CompSpots.forEach(function(spot) {
        var index = Math.floor(spot/2);
        var secondSpot = (spot % 2) === 1;
        var match = matchesRound2[index];
        var matchProgression = _s.find(matchProgressions, function(p) {
          return p.number === match.number;
        });

        if(!matchProgression) {
          matchProgression = {number:match.number};
          matchProgressions.push(matchProgression);
        }

        if(secondSpot) {
          matchProgression.comp2=matchesRound1[r1Index].number;
        } else {
          matchProgression.comp1=matchesRound1[r1Index].number;
        }

        r1Index++;
      });
      
      // add remaining progression spots.
      matchesRound2.forEach(function(match) {
        var number = match.number;

        var matchProgression = _s.find(matchProgressions,function(m) {
          return m.number === match.number;
        });

        if(!matchProgression) {
          matchProgression = {number:match.number, comp1:0, comp2:0};
          matchProgressions.push(matchProgression);
        } else {
          if(!matchProgression.comp1) {
            matchProgression.comp1 = 0;
          }
          if(!matchProgression.comp2) {
            matchProgression.comp2 = 0;
          }
        }
      });

      // Add progression spots for remaining Rounds.
      currentRound=2;
      var maxRound = CMRoundsC.getMaxRound(allMatches);



      while(currentRound < maxRound) {
        var prevRound=currentRound;
        currentRound++;
        var prevRoundMatches = getRoundMatches(allMatches,prevRound);
        prevRoundMatches = sortMatchesByNumber(prevRoundMatches);
        var currentRoundMatches = getRoundMatches(allMatches,currentRound);
        currentRoundMatches = sortMatchesByNumber(currentRoundMatches);

        createMatchProgressionsWithParentMatches(prevRoundMatches, currentRoundMatches, matchProgressions);
      }
    }
    return matchProgressions;
  };

  var createMatchProgressionsWithParentMatches = function(prevRoundMatches, currentRoundMatches, matchProgressions) {
        var prevIndex=0;
        currentRoundMatches.forEach(function(match) {
          var comp1Number = prevRoundMatches[prevIndex].number;
          prevIndex++;
          var comp2Number = prevRoundMatches[prevIndex].number;
          prevIndex++;
          var matchProgression = {number:match.number, comp1:comp1Number, comp2: comp2Number};
          matchProgressions.push(matchProgression);
        });
  };

  var sortMatchesByNumber = function(matches) {
    return _s.sortBy(matches, function(m) {
      return m.number;
    });
  };

  // Calculate the competitor spots to populate.
  var calculateR2CompSpots = function(numRoundOne,numR2CompSpots) {
      var currentStep=numR2CompSpots;
      var currentAssignedR1Matches=0;
      var r2CompSpots=[];
      var r2CompSpot=0;
      var maxCount = 0;
      var maxLoop = numR2CompSpots*numR2CompSpots;
      var shift=0;
      while(currentAssignedR1Matches<numRoundOne && maxCount<maxLoop ) {
         r2CompSpot=(r2CompSpot+currentStep) % numR2CompSpots;
         maxCount++;

        // If not already contained, add
        if(doesNotExistInList(r2CompSpot, r2CompSpots)) {
          r2CompSpots.push(r2CompSpot);
          currentAssignedR1Matches= currentAssignedR1Matches+1;
        }

        if(r2CompSpot<=0) {
          if(currentStep===2) {
            // if stepped enough times, then shift instead
            // shift 1 instead, to keep matches evenly spaced 
            // (since comp spots are paired)
            currentStep=numR2CompSpots;
            r2CompSpot=1;
          } else {
            // redo at a different step
          currentStep = currentStep/2;
          r2CompSpot = 0;
          }
        } else if (r2CompSpot<=1) {
          currentStep = currentStep/2;
          r2CompSpot = 1;
        }
      }
      return r2CompSpots;
  };

  var doesNotExistInList = function(selectEntry, list) {
    return !list.some(function(entry) {
          return entry === selectEntry;
    });
  };

  var getNumRoundMatches = function(matches, round) {
    var reduction = matches.reduce(function(reducedValue,currentElement) {
      if(currentElement.round === round) {
        return reducedValue + 1;
      } else {
        return reducedValue;
      }
    },0);

    return reduction;
  };

  var getRoundMatches = function(matches, round) {
    return matches.filter(function(match) {
      return match.round === round;  
    });
  };

  // Get Match With Number
  var getMatchWithNumber = function(matches,number) {
   return _s.find(matches,function(match) {
      return match.number === number;
    });
  };

  // Reverse Round & Number For Matches
  var reverseRoundAndNumberForMatches = function(matches,matchNumberStart,round) {
    var numMatches = matchNumberStart*(-1); 

    matches.forEach(function(match) {
      match.number = numMatches + match.number;
      match.round = round - match.round + 1;
      match.name = defaultMatchName(match.round, match.number);
    });
  };

  // Match Numbers
  var createLadderMatchRound = function(numberOfMatches,round,matchStartNumber,countDownParam) {
    var matchNumber = matchStartNumber;
    var countDown = countDownParam? countDownParam : true;
    var matches = [];
    
    for(var i = 0; i < numberOfMatches; i++) {
      var matchName = defaultMatchName(round,matchNumber);
      var match = createEmptyLadderMatch(round,matchName,matchNumber);
       
      if(countDown) {
        matchNumber = matchNumber - 1;
      } else {
        matchNumber = matchNumber + 1;
      }

      matches.push(match);
    }

    return matches;
  };

  return {
    createRoundBasedOnLadder: createRoundBasedOnLadder,
    updateMatchesBasedOnLadder: updateMatchesBasedOnLadder
  };
}]);
