'use strict';

//Matches service used for communicating with the tournaments REST endpoints
// Match helper functions to manipulate match objects
angular.module('match_rounds').factory('CreateMatchRoundsRoundRobin', ['$filter', 'CoreHelper','MatchHelper','TournamentResults','CreateMatchRoundsCore','_service', function($filter,CHelper, MHelper, TResults,CMRoundsC,_s) {

  // Get Next Round
  var createRoundsBasedOnRoundRobin = function(tournament,startRound) {
    var competitors = randomizeOrderOfList(tournament.competitors_full);
    var matches = tournament.matches;
    startRound = startRound ? startRound : 1;
    var numberOfRounds = competitors.length-1;
    var dummyCompetitor = {name:'Dummy', isDummy:true, number:-1, id:-1};
    if (CMRoundsC.isOdd(competitors.length)) {
      competitors.push(dummyCompetitor);
    }
    var numMatches = competitors.length/2;
    var competitorList1 = competitors.slice(0,numMatches);
    var competitorList2 = competitors.slice(numMatches);
    for(var round=startRound; round<numberOfRounds+startRound; round++) {
      for(var matchIndex = 0; matchIndex<numMatches;matchIndex++) {
        var matchCompetitors = filterDummyCompetitors([
            competitorList1[matchIndex]
            ,competitorList2[matchIndex]
          ]);
        var match = CMRoundsC.createMatchWithCompetitors(matchCompetitors
            ,round
            ,'Match:'.concat(round.toString(),'-',matchIndex+1));
            
        matches.push(match);
      }
      shiftCompetitorLists(competitorList1, competitorList2);
    }
  };

  var filterDummyCompetitors = function(competitors) {
    return competitors.filter(function(comp) {
        return !(comp.isDummy && comp.isDummy===true);
    });
  };

  var shiftCompetitorLists = function(competitorList1, competitorList2) {
    // remove 1st entry from competitorList2
    var comp2Move = competitorList2.splice(0,1)[0];
    //splice into competitorList1 as second entry.
      competitorList1.splice(1,0,comp2Move);
    // remove last entry form competitorList1
      var comp1Move = competitorList1.pop();
    // splice into competitorList2 as last entry.
      competitorList2.push(comp1Move);
  };

  var randomizeOrderOfList = function(list) {
    var originalList = [].concat(list);
    var randList = [];
    var maxLength = originalList.length;
    while(maxLength>0) {
      randList.push(CMRoundsC.spliceRandomEntryFromList(originalList));
      maxLength--;
    }
    return randList;
  };

  return {
    createRoundsBasedOnRoundRobin: createRoundsBasedOnRoundRobin
  };
}]);
