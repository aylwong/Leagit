'use strict';

angular.module('tournaments')
    .controller('TournamentsController', ['$scope', '$stateParams', '$location','$filter', '$q', 'Authentication', 'Tournaments', 'Competitors','Tournament.Results','Tournament-Helper','Core-Helper','Competitor-Helper',
					  function($scope, $stateParams, $location, $filter, $q, Authentication, Tournaments, Competitors, TResults,THelper,CHelper,CompetitorHelper) {
	// add auth
	$scope.authentication = Authentication;

	// scope namespaces
	$scope.tournaments = {};
	$scope.tournaments.tournament={};
	$scope.competitors = {};
	$scope.view_state = {};

	// init start dates for tourney (not yet loaded)
	$scope.tournaments.tournament.start_date = new Date().toString();
	$scope.tournaments.tournament.end_date = new Date().addDays(1).toString();

	// temp available types (more detail later)
	$scope.tournaments.available_types = [{'id': 'Ad Hoc', 'name': 'Ad Hoc'
		}, {
			'id': 'Round Robin', 'name': 'Round Robin'
		}, {
			 'id': 'Joust', 'name': 'Joust'
		}, {
			 'id': 'Elimination', 'name': 'Elimination'
		}, {
			 'id': 'Soft Elimination', 'name': 'Soft Elimination'
		}];

	$scope.tournaments.available_results = TResults.results;

	// available competitors for adding to matches?
	$scope.competitors.available_competitors = [];

	// available match competitors
	$scope.tournaments.match_competitors = [];
	$scope.tournaments.selected_competitors=[];
	$scope.tournaments.selectable_competitors=[];

	// HANDLERS

	// add match to the tournament
	$scope.add_new_match = function(new_match) {
	  var match = THelper.createNewMatch(new_match,$scope.competitors.match_competitors);

	  $scope.tournaments.tournament.matches.push(match);
	};

	// remove match from tournament, based on index
	$scope.remove_match = function (match) {
	  THelper.removeMatchFromTournament(match,$scope.tournaments.tournament);
	};

	// view state
	// toggles for view (whether to show new match or not)
	$scope.view_state.show_new_match = true;

	$scope.toggle_new_match = function() {
	  $scope.view_state.show_new_match = $scope.view_state.show_new_match !== true;
	};

	// INIT

	// This is competitor INIT stuff:
	$scope.competitor_init = function(competitorIds) {
	  // getting available competitors (defered until loaded?)
	  var searchParameters = {};

	  if(competitorIds) {
	    searchParameters.ids = competitorIds.join();
	  }

	  // Get all competitors available for this Tournament
	  var all_competitors = Competitors.query(searchParameters).$promise;

	  // function - load competitors after initialisation.
  	  return all_competitors.then( function(list) {
	
	    $scope.competitors.available_competitors = THelper.competitorsToSelectList(list);

	    // Competitor list
	    return list;
	  });
	};

	// init multiple tournaments
	$scope.tournaments.init_tournaments = function(tournaments) {

	  var tournaments_complete = $q.defer();

	  // get tournaments
	  $scope.tournaments.list = Tournaments.query();

	  var competitors_loaded = $scope.competitor_init(); 
	  var tournaments_loaded = $scope.tournaments.list.$promise;

	  // when both list and competitors loaded, then 
	  $q.all([competitors_loaded, tournaments_loaded]).then( function(values) {
	    var available_competitors = values[0];
	    // set value to competitors
	    $scope.tournaments.list.forEach(function(tournament) {
		$scope.tournaments.loadCompetitorsIntoTournament(tournament,available_competitors);
	    });
	  });
	};

	// Load Competitors into Tournament
	// tournament.competitors is loaded into from competitors
	$scope.tournaments.loadCompetitorsIntoTournament = function(tournament, competitors) {
	  // match competitors - this should be competitors that 
	  var tournament_competitors = CHelper.idsToList(tournament.competitors,competitors);
 
	  // filter to select list
	  tournament.selected_competitors = THelper.competitorsToSelectList(tournament_competitors);

	  angular.forEach(tournament.matches, function(val, key)  {
	    // populate limited info of competitors to Match
	    THelper.addCompetitorsToMatch(val,tournament.selected_competitors);

	  });
	};

	// init tournament based on initial tournament
        // Test - Init Tournament
	$scope.tournaments.init_tournament = function(tournamentId,competitors_loaded) {
	  var tournament_loaded =  Tournaments.get({
	    tournamentId: $stateParams.tournamentId
	  }).$promise;

	  tournament_loaded.then(function(tournament) {
	    $scope.tournaments.tournament=tournament;
	  });

	  $scope.competitors.match_competitors=[];
	  var tournament_complete = $q.defer();

	// When both tournament and competitors are loaded, then combine competitors into tournament
	  $q.all([competitors_loaded,tournament_loaded]).then(function(results) {
	    var competitors = results[0];
	    var tournament = results[1];

	    $scope.tournaments.loadCompetitorsIntoTournament(tournament,competitors);
	    // load tournaments into competitors list
	    $scope.tournaments.selected_competitors = CHelper.idsToList(tournament.competitors,competitors);

	    $scope.tournaments.selectable_competitors =CompetitorHelper.selectableCompetitors(competitors);

	    // All competitors for matches starts unchecked 
	    tournament_complete.resolve();
	  });

	  return tournament_complete.promise;
	};

	// CALLABLE FUNCTIONS
	// function create a new tournament
	$scope.create = function() {
  	  // turn match results into arrays with results

	  var tournament = $scope.tournaments.tournament;

	  // if no matches or competitors, return as empty array
	  if(!tournament.matches) {
	    tournament.matches = [];
	  } 

	  var selectedCompetitorsIds = CHelper.listToIds($scope.tournaments.selected_competitors);

	  if(!selectedCompetitorsIds) {
	    tournament.competitors = [];
	  } else {
	    tournament.competitors = selectedCompetitorsIds;
	  } 

	  var newTournament = new Tournaments({
	     name: tournament.name
	    ,start_date: tournament.start_date.toString()
	    ,end_date: tournament.end_date.toString()
	    ,type: tournament.type
	    ,matches: tournament.matches
	    ,competitors: tournament.competitors
	    ,description: tournament.description
	  });

	  newTournament.$save(function(response) {
	      $location.path('tournaments/' + response._id);
	    }, function(errorResponse) {
			$scope.error = errorResponse.data.message;
	  });
	};

	// function remove a tournament
	$scope.remove = function(tournament) {
	  if (tournament) {
	    tournament.$remove();

  	    for (var i in $scope.tournaments.list) {
	      if ($scope.tournaments.list[i] === tournament) {
		$scope.tournaments.list.splice(i, 1);
	      }
	    }
	  } else {
	    $scope.tournaments.tournament.$remove(function() {
	      $location.path('tournaments');
	    });
	  }
	};

	// function 
	// update tournament.
	$scope.update = function() {
	  var tournament = $scope.tournaments.tournament;

	// turns the selected competitors into a list of ids
	  tournament.competitors=CHelper.listToIds($scope.tournaments.selected_competitors);

	  // clean match competitors.
	  angular.forEach($scope.tournaments.tournament.matches, function(value,key) {
	    // turn selected competitors into list of ids
	    value.competitors = THelper.getSelectedCompetitorsAsIds(value.competitors_list);
	  });

			
	  tournament.$update(function() {
	      $location.path('tournaments/' + tournament._id);
	    }, function(errorResponse) {
	      $scope.error = errorResponse.data.message;
	  });
	};

	$scope.initTournamentList = function() {
	  $scope.find();
	};

	$scope.find = function() {
		$scope.tournaments.init_tournaments();
	};

	$scope.initTournamentView = function() {
		$scope.findOne();
	};

	$scope.initTournamentEdit = function() {
		$scope.findOne();
	};

	$scope.initTournamentCreate = function() {
	  var competitorPromise = $scope.competitor_init();

	  competitorPromise.then(function(competitors) {
	   // filter competitors for archiving.
	    $scope.tournaments.selectable_competitors =THelper.selectableCompetitors(competitors);
	  });
	};

	$scope.findOne = function() {
	  // load all competitors - as competitors grows, will probably have to load after initial load of tournaments, and filter for competitors only of the tournament
	  $scope.competitors.competitors_complete = $scope.competitor_init();
	  $scope.tournaments.tournament = [];
	  $scope.tournaments.tournament_complete = $scope.tournaments.init_tournament($scope.tournamentId,$scope.competitors.competitors_complete);
	};
  }
]);

