'use strict';

angular.module('tournaments')
    .controller('TournamentsController', ['$scope', '$stateParams', '$location','$filter', '$q', 'Authentication', 'Tournaments', 'Competitors','Tournament.Results',
					  function($scope, $stateParams, $location, $filter, $q, Authentication, Tournaments, Competitors, Tournament_Results) {
		// add auth
		$scope.authentication = Authentication;

		// init start dates for tourney (not yet loaded)
		$scope.start_date = new Date().toString();
		$scope.end_date = new Date().addDays(1).toString();

		// temp available types (more detail later)
		$scope.available_types = [{'id': 'Ad Hoc', 'name': 'Ad Hoc'
			}, {
				'id': 'Round Robin', 'name': 'Round Robin'
			}, {
				 'id': 'Joust', 'name': 'Joust'
			}, {
				 'id': 'Elimination', 'name': 'Elimination'
			}, {
				 'id': 'Soft Elimination', 'name': 'Soft Elimination'
			}];

	      $scope.results = Tournament_Results.results;

		// function 
		// to add new match, using new match added (move to separate file?)
		$scope.add_new_match = function() {
			var match = {};
			match.name = $scope.new_match.name;
			match.start_date = $scope.new_match.start_date;
			match.end_date = $scope.new_match.end_date;
			match.location = $scope.new_match.location;
			
			match.competitors = [];	

			match.results = $scope.new_match.results;
			match.description = $scope.new_match.description;
			match.status = 'Pending';
			addCompetitorsToMatch(match);

			$scope.tournament.matches.push(match);
		};

		// function
		// remove match from tournament
		$scope.remove_match = function(match) {
		  var index = $scope.tournament.matches.indexOf(match);

		  if ( index > -1) {
		    $scope.tournament.matches.splice(index,1);
		  }
		};

		// view state
		// toggles for view (whether to show new match or not
		$scope.show_new_match = true;
		$scope.toggle_new_match = function() {
		  $scope.show_new_match = $scope.show_new_match !== true;
		};

		// available competitors for adding to matches?
		$scope.available_competitors = [];

		// available match competitors
		$scope.match_competitors = [];

		// promise to load all competitors
		$scope.all_competitors_promise = Competitors.query().$promise;

		// getting available competitors (defered until loaded?)
		$scope.available_competitors_complete = $q.defer(); 

		// function - after competitors are loaded, load available competitors (subset)
		$scope.all_competitors_promise.then( function(list) {
		  $scope.all_competitors = list;

		  angular.forEach(list, function( val, key) {
		    $scope.available_competitors.push({'name':val.name, 'id':val._id, 'selected':false});
		    });
			$scope.available_competitors_complete.resolve();
		});

		// init tournament based on initial tournament
                // Test - Init Tournament
		$scope.init_tournament = function(tournament) {
		  $scope.tournament=tournament;
		  $scope.match_competitors=[];

		  $scope.available_competitors_complete.promise.then( function() {
		    // select available competitors for individual tournament
		    angular.forEach($scope.tournament.competitors, function(val, key) {
		      for(var i=0;i<$scope.available_competitors.length;i++)
		      {
		        var available_competitor = $scope.available_competitors[i];
		        if(available_competitor.id===val) {
		   	  $scope.available_competitors[i].selected=true;
		          $scope.match_competitors.push({'name':available_competitor.name, 'id':available_competitor.id, 'selected':false});
		          }
		      }
		    });

  		    // create copy of match competitors
		    angular.forEach($scope.tournament.matches, function(val, key)  {
		      // move into a helper function, so it can be used to 
		      // populate on creation of a new match.
		      addCompetitorsToMatch(val);

		      // transform result to a single result (temporary)
		      if (val.results.length >0) {
			angular.forEach($scope.results, function(resVal, resKey) {
			  if(resVal.id===val.results[0].name) {
			    var currentCompetitors = val.results[0].competitors;
			    resVal.competitors=currentCompetitors;
			    val.results[0] = resVal;
			  }
                        });

			val.results = val.results[0];
		      }
		    }); 
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
			    if(current_competitor===competitor.id)
			    {
			      competitor_selected = true;
			    }
			  }

		          new_match_competitors.push({'name':competitor.name, 'id':competitor.id, 'selected':competitor_selected});
		        }

			val.competitors_list = new_match_competitors;
		};

		// selected competitors is the current available ones.
		$scope.selected_competitors = $scope.available_competitors;

		// function create a new tournament
		$scope.create = function() {

		  angular.forEach(this.matches, function(value, key) {
			value.results = [value.results];
		});

		  var tournament = new Tournaments({
		    name: this.name,
		    start_date: this.start_date,
		    end_date: this.end_date,
		    type: this.type,
		    matches: this.matches,
		    competitors: this.competitors,
		    description: this.description,
		  });
		  tournament.$save(function(response) {
		      $location.path('tournaments/' + response._id);
		    }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
		  });
  		  
		  this.name = '';
		  this.start_date = $scope.start_date;
		  this.end_date = $scope.end_date;
		  this.type = 'Ad Hoc';
		  this.matches = [];
		  this.competitors = [];
		  this.description ='';
		};

		// function remove a tournament
		$scope.remove = function(tournament) {
		  if (tournament) {
		    tournament.$remove();
  		    for (var i in $scope.tournaments) {
		      if ($scope.tournaments[i] === tournament) {
			$scope.tournaments.splice(i, 1);
		      }
		    }
		  } else {
		    $scope.tournament.$remove(function() {
		      $location.path('tournaments');
		    });
		  }
		};

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
		// update tournament.
		$scope.update = function() {
		  var tournament = $scope.tournament;

		  //Turn the competitors into a string.
		  var selectedCompetitors = $filter('filter')($scope.available_competitors,{'selected':true});

		  var selectedCompetitorIds = competitorsToIds(selectedCompetitors);
		  // clean match competitors.
		  angular.forEach($scope.tournament.matches, function(value,key) {
		    var selectedCompetitors = $filter('filter')(value.competitors_list,{'selected':true});
		    value.competitors = competitorsToIds(selectedCompetitors);

		    // for results.
			var curResult = value.results;
			value.results = [];
 			value.results.push(curResult);
		  });

		console.log('matches');
		console.log(tournament.matches);
		  
		  tournament.competitors=selectedCompetitorIds;	
			
		  tournament.$update(function() {
		      $location.path('tournaments/' + tournament._id);
		    }, function(errorResponse) {
		      $scope.error = errorResponse.data.message;
		  });
		};

		$scope.find = function() {
			$scope.tournaments = Tournaments.query();
		};

		$scope.findOne = function() {
			$scope.tournament = [];
			Tournaments.get({
				tournamentId: $stateParams.tournamentId
			}, function(val) { 
			  $scope.init_tournament(val);
			});
		};
	}
]);

