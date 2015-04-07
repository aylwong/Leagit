'use strict';

angular.module('matches')
    .controller('MatchesController', ['$scope', '$stateParams', '$location','$filter', '$q', 'Authentication', 'Competitors','Tournament.Results','Tournaments','Matches','CompetitorMatches','Core-Helper', 'Match-Helper' 
      , function($scope, $stateParams, $location, $filter, $q, Authentication, Competitors, TResults,Tournaments,Matches,CompetitorMatches,CHelper,MHelper) {
	// add auth
	$scope.authentication = Authentication;

	$scope.matches={};
	$scope.matches.available_results = TResults.selectResults;

	$scope.tournamentId = [];

	// function 
//	$scope.add_new_match = function(new_match) {
//	  var match = {};
//	  match.name = new_match.name;
//	  match.start_date = new_match.start_date;
//	  match.end_date = new_match.end_date;
//	  match.location = new_match.location;
			
//	  match.competitors = [];

	  // Fill Results
//	  fillResultsForMatch(new_match,new_match.firstResult,new_match.competitor_winners,new_match.competitor_losers);
//	  match.results = new_match.results;
//	  match.description = new_match.description;
//	  match.status = 'Pending';
//	  addCompetitorsToMatch(match);

//	  $scope.tournament.matches.push(match);
//	};

	// modify match;
	$scope.update_match = function(modifiedMatch) {
	  var match = new Matches({_id:CHelper.getId(modifiedMatch)});

	  fillResultsForMatch(modifiedMatch,modifiedMatch.firstResult,modifiedMatch.competitor_winners,modifiedMatch.competitor_losers);

	// make the competitors the list of selected competitors;
	  modifiedMatch.competitors = CHelper.listToIds(modifiedMatch.selected_competitors);
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

	  // make the competitors the list of selected competitors;
	  newMatch.competitors = CHelper.listToIds(newMatch.selected_competitors);
	  fillResultsForMatch(newMatch,newMatch.firstResult,newMatch.competitor_winners,newMatch.competitor_losers);
	  MHelper.copyMatchData(match, newMatch);
	  console.log(match);
	  match.$create({tournamentId:$scope.tournament._id} , function() {
	      $location.path('tournaments/' + $scope.tournament._id);
	    }, function(errorResponse) {
		console.log(errorResponse);
	      $scope.error = errorResponse.data.message;
	  });
	};

	// available competitors for adding to matches?
	$scope.available_competitors = [];

	// available match competitors
	$scope.match_competitors = [];

	// Add competitor list (probably from tournament load
	// Init Competitors
	$scope.init_competitors = function(competitorIds) {

	  // load competitors based on tournamentId
	  var competitors_complete = $q.defer();
	  var competitorsString = competitorIds.join();

	  var competitorsQuery = Competitors.query( {ids:competitorsString}, function(comp) {
	  });
	  return competitorsQuery;
	};

	// init tournament based on initial tournament
	$scope.init_match = function(match, tournament) {
	  initMatchSelectResult(match);
	  initMatchResultSelectLists(match);

          $scope.match = match;
	  $scope.tournament=tournament;
	  $scope.match_competitors = tournament.competitors;
	};

	// Init match based on tournament.
	var initMatchSelectResult = function(match) {
	  if(match.results && match.results[0] && match.results[0].key) {
	    if(match.results[0].key === TResults.key.tBD) {
		match.firstResult = TResults.getResultWithKey('TBD');
	    } else if(match.results[0].key === TResults.key.tie) {
		match.firstResult = TResults.getResultWithKey('Tie');
	    } else if(match.results[0].key === TResults.key.win) {
		match.firstResult = TResults.getResultWithKey('Win');
	    } else {
		match.firstResult = TResults.getResultWithKey('TBD');
	    }
	  } else {
	    match.firstResult = TResults.getResultWithKey('TBD');
	  }
	};

	var initMatchResultSelectLists = function(match) {
	    match.competitor_winners = [];
	    match.competitor_losers = [];
	  match.results.forEach(function(result) {
	    if(result.key === TResults.key.win) {
	      match.competitor_winners = result.competitors;
	    } 
	    if(result.key === TResults.key.loss) {
	      match.competitor_losers = result.competitors
	    }
	  });
	};

	// Fill Results
	// first result 
	var fillResultsForMatch = function(match, results, winList, lossList) {
	  if(results.key === 'TBD') {
	    match.results = [{'key':'TBD', 'name':'TBD', 'competitors':match.competitors.slice(0) }];
	  } else if (results.key === 'Tie') {
	    match.results = [{'key':'Tie', 'name':'Tie', 'competitors':match.competitors.slice(0) }];

	  } else if (results.key === 'Win') {
	    match.results = [{'key':'Win', 'name':'Win', 'competitors':winList},
		{'key':'Loss', 'name':'Loss', 'competitors':lossList}];
	  } else {
	    match.results = [{'key':'TBD', 'name':'TBD', 'competitors':match.competitors.slice(0) }];
	  }
	};

	// changeResult
	$scope.matches.changeResult = function(firstResult) {

	  if(firstResult.key === 'TBD') {
	    // copy to new array;
	    //$scope.match.competitor_winner = $scope.match.selected_competitors.slice(0);
	    $scope.match.competitor_winners = [];
	    $scope.match.competitor_losers = [];
	  } else if (firstResult.key === 'Win') {
	    $scope.match.competitor_winners = $scope.match.selected_competitors.slice(0);
	  } else if (firstResult.key === 'Tie') {
	    $scope.match.competitor_winners = [];
	    $scope.match.competitor_losers = [];
	  } else {
	    $scope.match.competitor_winners = [];
	    $scope.match.competitor_losers = [];
	  }
	};


	$scope.matches.competitorUnselected = function(match) {
		match.competitor_winners.forEach(function(competitor,index) {
		  var competitorId = CHelper.getId(competitor);
		  var selected = match.selected_competitors.some(function(comp) 
		    {  return CHelper.getId(comp) ===competitorId;
		  });
		   if(!selected) {
			match.competitor_winners.splice(index,1);
		   }
		});
		match.competitor_losers.forEach(function(competitor,index) {
		  var competitorId = CHelper.getId(competitor);
		  var selected = match.selected_competitors.some(function(comp) 
		    {  return CHelper.getId(comp) ===competitorId;
		  });
		   if(!selected) {
			match.competitor_losers.splice(index,1);
		   }
		});
	};

	// A competitor was selected
	$scope.matches.competitorSelected = function(match) {
	  match.selected_competitors.forEach(function(competitor) {
	    var competitorId = CHelper.getId(competitor);
	    var winners = match.competitor_winners.filter(function(win) {
		   return CHelper.getId(win)===competitorId;
		});
		var losers = match.competitor_losers.filter(function(lose) {
		   return CHelper.getId(lose)===competitorId;
		});
		
		if(winners.length<=0 && losers.length<=0) {
		  if(match.firstResult.key===TResults.key.win) {
		  match.competitor_losers.push(competitor);
		  }
		} 
	  });

	};

	// helper function
	// add a new list of competitors
	var addCompetitorsToMatch = function(val) {
	  var new_match_competitors = [];

	  for(var i=0; i<$scope.match_competitors.length; i++)
	  {
	    var competitor = $scope.match_competitors[i];
	    var competitor_selected = false;

	    // competitors already selected, pre-select
	    for(var j=0; j<val.competitors.length; j++) {
	      var current_competitor=val.competitors[j];
	      if(current_competitor===competitor.id) {
		competitor_selected = true;
	      }
	    }

	    new_match_competitors.push({'name':competitor.name, 'id':competitor.id, 'selected':competitor_selected});
	  }

	  val.competitors_list = new_match_competitors;
	};

	// selected competitors is the current available ones.
	$scope.selected_competitors = $scope.available_competitors;

	// helper function
	// transform competitor objects to ids.
	var competitorsToIds = function(competitors) {
	  var selectedCompetitorIds = [];
	  angular.forEach(competitors, function(value, key) {
	    selectedCompetitorIds.push(value.id);
	  });

	  return selectedCompetitorIds;
	};

	// function 
	// load tournaments
	var loadTournaments = function() {
	  var tournaments = Matches.query();
	  return tournaments.$promise;
	};

	$scope.find = function() {
	  // find all match, perhaps filtered by tournament
	  var tournamentPromise= loadTournaments();

	  var competitorPromise =  tournamentPromise.then(function(tList) {
	      $scope.tournaments = tList;

	      var competitorList = [];
	      // convert list into a list of competitors to get.
	      tList.map(function(tournament) {
	   	competitorList = CHelper.mergeArrays(competitorList,tournament.competitors
		,function(comp1, comp2) {
			return comp1.toString()===comp2.toString();
		});
	      });

	      var competitorsQ = $scope.init_competitors(competitorList);
		return competitorsQ.$promise;
		// end
	    });

	  competitorPromise.then(function(competitors) {
	    $scope.tournaments.forEach(function(t) {
	      t.matches.forEach(function(match) {
	        match.competitor_list = CHelper.filterListOnSelected(MHelper.getMatchCompetitorList(match,competitors));
	      });
	    });
	  });
	};

	// find competitor matches
	$scope.findCompetitorMatches = function() {
	  $scope.matches = [];
	  CompetitorMatches.query({competitorId:$stateParams.competitorId},
	    function(val) {
	      $scope.tournaments = val;
	  });
	
	  Competitors.get({competitorId:$stateParams.competitorId},
	    function(val) {
	      $scope.competitor= val;
	  });
	};

	$scope.initEditMatch = function() {
	  var viewPromise = $scope.findOne();
	  viewPromise.then(function() {
	    $scope.$watch('match.selected_competitors' 
	      , function() {
		$scope.matches.competitorSelected($scope.match);
		$scope.matches.competitorUnselected($scope.match);
	    },true);
	  });
	}

	$scope.initViewMatch = function() {
	  var viewPromise = $scope.findOne();
	  viewPromise.then(function() {
	    $scope.match.selected_competitors;
	    $scope.match.results.forEach(function(result) {
	      var selected_competitors = CHelper.idsToList(result.competitors, $scope.match.selected_competitors);
	      result.competitors = selected_competitors;
	    });
	  });
	};

	$scope.findOne = function() {
	  $scope.tournamentId = {};

	  // find one match
	  var matchPromise = Matches.get({matchId:$stateParams.matchId
	  }).$promise;

	  var competitorPromise = matchPromise.then(function(tournament) {
	    $scope.tournamentId.tournamentId = CHelper.getId(tournament);

	    $scope.init_match(tournament.matches[0],tournament);

	    var competitorList =tournament.competitors;
	    return $scope.init_competitors(competitorList).$promise;
	  });

	  return competitorPromise.then(function(competitors) {
	    // Allow all competitors from Tournament (even archived ones)
	    $scope.match.selectable_competitors = competitors;
	    $scope.match.selected_competitors = CHelper.idsToList($scope.match.competitors,competitors);
	    $scope.match.competitor_winners = CHelper.idsToList($scope.match.competitor_winners,competitors);
	    $scope.match.competitor_losers = CHelper.idsToList($scope.match.competitor_losers,competitors);
	    $scope.match.competitor_list = $scope.match.selected_competitors;
	  });
	};
	
	$scope.findNew = function() {
	  var newEmptyMatch = MHelper.createEmptyMatch();
	  $scope.tournamentId = {};
	  $scope.tournamentId.tournamentId = $stateParams.tournamentId;
	
	  var matchPromise = Tournaments.get({tournamentId:$stateParams.tournamentId
	  }).$promise;

	  matchPromise.then(function(tournament) {
	    $scope.tournament=tournament;
	  });

	// same as FindOne except newEmptyMatch instead of foundMatch
	  var competitorPromise = matchPromise.then(function(tournament) {
	    $scope.init_match(newEmptyMatch,tournament);
	    var competitorList =tournament.competitors;
	    return $scope.init_competitors(competitorList).$promise;
	  });

	  var viewPromise = competitorPromise.then(function(competitors) {
	    var selectedCompetitors = MHelper.getMatchCompetitorList($scope.match,competitors);
	    $scope.match.selectable_competitors = selectedCompetitors;
	    $scope.match.selected_competitors = [];
	    $scope.match.competitor_winners = [];
	    $scope.match.competitor_losers = [];
	    $scope.match.competitor_list = CHelper.filterListOnSelected(selectedCompetitors);
	  });

	  viewPromise.then(function() {
	    $scope.$watch('match.selected_competitors' 
	      , function() {
		$scope.matches.competitorSelected($scope.match);
		$scope.matches.competitorUnselected($scope.match);
	    },true);
	  });

	};
  }
]);

