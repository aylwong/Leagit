'use strict';

angular.module('matches')
  .controller('MatchesController', ['$scope', '$stateParams', '$location','$filter', '$q', 'Authentication', 'Competitors','Tournament.Results','Tournaments','Matches','CompetitorMatches','Core-Helper', 'Match-Helper','_service','Create-Match-Rounds-Core','Match-Rounds-Results-Helper'
  ,function($scope, $stateParams, $location, $filter, $q, Authentication, Competitors, TResults,Tournaments,Matches,CompetitorMatches,CHelper,MHelper,_s,CMRoundsCore,MRHelper) {
  // add auth
  $scope.authentication = Authentication;

  $scope.matches={};
  $scope.matches.available_results = TResults.selectResults;

  // modify match;
  $scope.update_match = function(modifiedMatch) {
    var match = new Matches({_id:CHelper.getId(modifiedMatch)});

    updateMatchFromSelectLists(modifiedMatch);
    MHelper.copyMatchData(match, modifiedMatch);

    match.$update(function() {
      $location.path('matches/' + match._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
    });
  };

  // function
  // remove match from tournament
  $scope.remove_match = function(removeMatch,bounceToTournament) {
    // should call delete.
    var match = new Matches({_id:CHelper.getId(removeMatch)});
    match.$remove(function(tournamentId) {
      $scope.success_message = 'successfully deleted';
      // go to parent?
      if(bounceToTournament) {
        $location.path('tournaments/' + $scope.tournament._id);
      } else if($scope.tournament) {
        var index = $scope.tournament.matches.indexOf(removeMatch);
        if ( index > -1) {
          $scope.tournament.matches.splice(index,1);
        }
      }
    }, function(errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  };

  // Create a New Match
  $scope.create_match = function(newMatch) {
    var match = new Matches({});
    updateMatchFromSelectLists(newMatch);
    MHelper.copyMatchData(match, newMatch);

    match.$create({tournamentId:$scope.tournament._id} , function() {
        $location.path('tournaments/' + $scope.tournament._id);
      }, function(errorResponse) {
	console.log(errorResponse);
	$scope.error = errorResponse.data.message;
    });
  };

  // changeResult
  $scope.matches.changeResult = function(firstResult) {
    if(firstResult.key === TResults.key.tBD) {
      $scope.match.competitor_winners = [];
      $scope.match.competitor_losers = [];
    } else if (firstResult.key === TResults.key.win) {
      $scope.match.competitor_winners = $scope.match.selected_competitors.slice(0);
    } else if (firstResult.key === TResults.key.tie) {
      $scope.match.competitor_winners = [];
      $scope.match.competitor_losers = [];
    } else {
      $scope.match.competitor_winners = [];
      $scope.match.competitor_losers = [];
    }
  };

  // List Matches
  $scope.initListMatches = function() {
    findAllMatches()
      .then(function(results) {
        loadListResultsIntoScope(results.tournaments, results.competitors);
    });
  };

  // Initialise competitor Matches
  $scope.initCompetitorMatches = function() {
    var competitorId = $stateParams.competitorId;
    findCompetitorMatches(competitorId)
      .then(function(results) {
  	loadListResultsIntoScope(results.tournaments,results.competitors);

	$scope.competitor = CHelper.getInArrayById(competitorId, results.competitors);
    });
  };


  //initialise edit match view
  $scope.initEditMatch = function() {
    var viewPromise = findOne($stateParams.matchId);
    viewPromise.then(function(results) {
      //Load results into scope (match, tournament, competitors)
      loadMatchResultsIntoScope(results);

      // load tournamentId for searching
      $scope.tournamentId = {tournamentId: CHelper.getId(results.tournament)};
      loadMatchSelectResultLists($scope.match);
      loadMatchEditSelectorLists($scope.match,results.competitors);
      watchMatchSelectionAndUpdateSelected('match.selected_competitors', $scope.match);
    });
  };

  //initialise view match view
  $scope.initViewMatch = function() {
    var viewPromise = findOne($stateParams.matchId);
    viewPromise.then(function(results) {
      //Load results into scope (match, tournament, competitors)
      loadMatchResultsIntoScope(results);

      // Load competitors into Results
      $scope.match.competitor_list = CHelper.idsToList($scope.match.competitors, results.competitors);
      loadCompetitorsIntoList($scope.match.results,results.competitors);
    });
  };

  // init create match
  $scope.initCreateMatch = function() {
    var newEmptyMatch = MHelper.createEmptyMatch();
    $scope.tournamentId = {tournamentId: $stateParams.tournamentId};

    var viewPromise = findTournament($stateParams.tournamentId)
      .then(function(results) {
        $scope.tournament = results.tournament;
        $scope.competitors = results.competitors;
        $scope.match=newEmptyMatch;

        var selectedCompetitors = MHelper.getMatchCompetitorList($scope.match,results.competitors);
        loadMatchCreateSelectorLists($scope.match, selectedCompetitors);
      })
      .then(function() {
        watchMatchSelectionAndUpdateSelected('match.selected_competitors', $scope.match);
    });
  };

  $scope.initViewMatchesByCompetitor = function () {
    var promise = $scope.initMatchDetailsOfTournament();
  };

  $scope.initViewMatchesOfTournament = function () {
    $scope.initMatchDetailsOfTournament();
  };

  $scope.getMatchResultName = function(match) {
    return MRHelper.getMatchResultName(match);
  };

  $scope.getCompetitorResultName = function(match, competitor) {
    return MRHelper.getCompetitorResultName(match, competitor);
  };

  $scope.initResolveMatchesForTournament = function () {
    var promise = $scope.initMatchDetailsOfTournament();
    promise.then(function() {
      
      $scope.tournament.matches = _s.sortByOrder($scope.tournament.matches,['round','name'],[false,true]);
    });
  };

  $scope.initCreateMassMatchesTournament = function () {
    var promise = $scope.initMatchDetailsOfTournament();
  };

  // Initialise a create Ad Hoc Tournament
  $scope.initMatchDetailsOfTournament = function() {
    var tournamentPromise = findTournament($stateParams.tournamentId);

    return tournamentPromise.then(function(results) {
      $scope.tournament = results.tournament;
      $scope.competitors = results.competitors;
	  $scope.tournament.competitors_full = CHelper.idsToList($scope.tournament.competitors, results.competitors);

	  $scope.tournament.matches.forEach(function(match) {
	    match.competitors_full = CHelper.idsToList(match.competitors, results.competitors);
	    match.competitors = CHelper.idsToList(match.competitors, results.competitors);
	  });
    });
  };

  // FIND Queries

  // Find Tournament.
  var findTournament = function(tournamentId) {
    var tournamentResult;
    var promise = Tournaments.get({ tournamentId: tournamentId}).$promise
      .then(function(tournament) {
        tournamentResult = tournament;
        var competitorList =tournament.competitors;

        return load_competitors(competitorList).$promise;
      })
      .then(function(competitors) {
        return({tournament: tournamentResult,competitors: competitors});
      });

    return promise;
  };

  // Load Tournament, Match, and Competitor data for Match from server
  var findOne = function(matchId) {
    var tournamentResult, matchResult, competitorsResult;
    // find one match
    var promise = Matches.get({matchId:matchId}).$promise
      .then(function(tournament) {
        tournamentResult = tournament;
        matchResult = tournament.matches[0];

        return load_competitors(tournament.competitors).$promise;
      })
      .then(function(competitors) {
        competitorsResult = competitors;
        // Allow all competitors from Tournament (even archived ones)
        return ({tournament:tournamentResult
   	  , match: matchResult
	  , competitors: competitorsResult});
      });

    return promise;
  };

  var findCompetitorMatches = function(competitorId) {
    var tournamentsResult;
    var promise = loadCompetitorMatches(competitorId).then(function(tList) {
      
//      var competitorPromise = loadCompetitorForMatches(tList);
  //    return competitorPromise;
      tournamentsResult = tList;

      var competitorsList = getCompetitorsFromMatches(tList);
      var competitorsPromise = load_competitors(competitorsList).$promise;

      return competitorsPromise;
    }).then(function(competitors) {
	return {tournaments:tournamentsResult,
	  competitors: competitors };
    });

    return promise;
  };

  //  Load Matches based on competitors
  var findAllMatches = function() {
    // find all match, perhaps filtered by tournament
    var tournamentsResult;
    var promise = loadTournaments().then(function(tList) {
      tournamentsResult = tList;

      var competitorsList = getCompetitorsFromTournaments(tList);
      var competitorsPromise = load_competitors(competitorsList).$promise;

      return competitorsPromise;
    })
    .then(function(competitors) {
      return {
        tournaments: tournamentsResult
        ,competitors: competitors
      };
    });

    return promise;
   };

  // function 
  // load all tournaments
  var loadTournaments = function() {
    var tournaments = Matches.query();
    return tournaments.$promise;
  };

  var loadCompetitorMatches = function(competitorId) {
    var tournaments = CompetitorMatches.query({competitorId: competitorId});
    return tournaments.$promise;
  };

  // Add competitor list (probably from tournament load
  var load_competitors = function(competitorIds) {
    // load competitors based on tournamentId
    var competitorsString = competitorIds.join();
    var competitorsQuery = Competitors.query( {ids:competitorsString});

    return competitorsQuery;
  };

  // Helper Functions
  // load Match Result Lists
  var loadMatchSelectResultLists = function(match) {
    MHelper.initMatchSelectResult(match);
    MHelper.initMatchResultSelectLists(match);
  };

  // A competitor was unselected
  var competitorUnselected = function(match) {
    CHelper.removeFromListIfNotInMasterList(match.competitor_winners, match.selected_competitors);
    CHelper.removeFromListIfNotInMasterList(match.competitor_losers, match.selected_competitors);
  };

  // A competitor was selected
  // Competitor selected for winners and losers
  var competitorSelected = function(match) {
    match.selected_competitors.forEach(function(competitor) {
      var competitorId = CHelper.getId(competitor);
      var winners = match.competitor_winners.filter(function(winner) {
        return CHelper.getId(winner) === competitorId;
      });

      var losers = match.competitor_losers.filter(function(loser) {
        return CHelper.getId(loser) === competitorId;
      });
		
      if(winners.length<=0 && losers.length<=0) {
        // If 'win' chosen, then push new competitor to losers list
        if(match.firstResult.key===TResults.key.win) {
  	  match.competitor_losers.push(competitor);
	}
      } 
    });
  };

  //Load into scopes
  var loadListResultsIntoScope = function(tournaments, competitors) {
    $scope.tournaments = tournaments;
    $scope.competitors = competitors;

    tournaments.forEach(function(t) {
      t.matches.forEach(function(match) {
        match.competitor_list = CHelper.filterListOnSelected(MHelper.getMatchCompetitorList(match,competitors));
      });
    });
  };

  // Get Competitor list from Tournaments
  var getCompetitorsFromMatches = function(tournamentList) {
    var tournamentsCompetitors = tournamentList.map(function(tournament) {
      var matchCompetitors = tournament.matches.map( function(match) {
        return match.competitors;
      });
      return  _s.union(matchCompetitors);
    });

     var competitorList =  _s.union(tournamentsCompetitors);
     return _s.uniq(competitorList); 
  };

  // Get Competitor list from Tournaments
  var getCompetitorsFromTournaments = function(tournamentList) {
    var competitorList = [];
    tournamentList.map(function(tournament) {
	console.log(tournament);
      competitorList = CHelper.mergeArrays(
         competitorList
        ,tournament.competitors
        ,function(comp1, comp2) {
  	  return comp1.toString()===comp2.toString();
      });
    });

    return competitorList;
  };

  // Load match, tournament & competitors into scope.
  var loadMatchResultsIntoScope = function(results) {
    $scope.match = results.match;
    $scope.tournament = results.tournament;
    $scope.competitors = results.competitors;
  };

  // Load Competitors Into List
  var loadCompetitorsIntoList = function(list,competitorList) {
    list.forEach(function(listEntry) {
      var selected_competitors = CHelper.idsToList(listEntry.competitors, competitorList);
      listEntry.competitors = selected_competitors;
    });
  };

  // Load the match lists for 
  var loadMatchEditSelectorLists = function(match, competitors) {
    match.selectable_competitors = competitors;
    match.selected_competitors = CHelper.idsToList(match.competitors,competitors);
    match.competitor_winners = CHelper.idsToList(match.competitor_winners,competitors);
    match.competitor_losers = CHelper.idsToList(match.competitor_losers,competitors);
    match.competitor_list = match.selected_competitors;
  };

  // create a watch on the match using the string scope selector
  var watchMatchSelectionAndUpdateSelected = function(scopeSelector,match) {
    $scope.$watch(
      scopeSelector
      ,function() {
        competitorSelected(match);
        competitorUnselected(match);
      }
      ,true);
  };

  // create the initial lists for the match used for selection.	
  var loadMatchCreateSelectorLists = function(match, competitors) {
    match.selectable_competitors = competitors;
    match.selected_competitors = [];
    match.competitor_winners = [];
    match.competitor_losers = [];
    match.competitor_list = CHelper.filterListOnSelected(competitors);
  };

  // Update Match from Select Lists
  var updateMatchFromSelectLists = function(match) {
    // load competitors into match, before loading results, so results can load from match competitors.
    match.competitors = CHelper.listToIds(match.selected_competitors);
    MHelper.fillResultsForMatch(match, match.firstResult, match.competitor_winners, match.competitor_losers);
  };
	
}
]);

