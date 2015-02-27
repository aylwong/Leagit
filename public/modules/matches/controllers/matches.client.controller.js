'use strict';

angular.module('matches')
    .controller('MatchesController', ['$scope', '$stateParams', '$location','$filter', '$q', 'Authentication', 'Competitors','Tournament.Results','Tournaments','Matches','CompetitorMatches'
      , function($scope, $stateParams, $location, $filter, $q, Authentication, Competitors, Tournament_Results,Tournaments,Matches,CompetitorMatches) {
		// add auth
	$scope.authentication = Authentication;

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
			//match.competitors = $scope.new_match.competitors;

			match.results = $scope.new_match.results;
			match.description = $scope.new_match.description;
			match.status = 'Pending';
			addCompetitorsToMatch(match);

			$scope.tournament.matches.push(match);

			// must populate match competitor list.
		};

		// function
		// remove match from tournament
		$scope.remove_match = function(match) {
		  var index = $scope.tournament.matches.indexOf(match);

		  if ( index > -1) {
		    $scope.tournament.matches.splice(index,1);
		  }
		};

		// available competitors for adding to matches?
		$scope.available_competitors = [];

		// available match competitors
		$scope.match_competitors = [];

		// Add competitor list (probably from tournament load

		// Init match based on tournament.

		// init tournament based on initial tournament
	       $scope.init_match = function(match, tournament) {
                 $scope.match = match;  //?
		 $scope.tournament=tournament;
		 $scope.match_competitors = tournament.competitors;

  		    // create copy of match competitors
		    angular.forEach($scope.tournament.matches, function(val, key)
		      {
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

		// function create a new match
		$scope.create = function() {
		    // create match
		};

		// function remove a match
		$scope.remove = function(match) {
		    // remove match
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
		// update match
		$scope.update = function() {
		  var match = $scope.match;

		  //Turn the competitors into a string.
		  var selectedCompetitors = $filter('filter')($scope.available_competitors,{'selected':true});

		  // clean match competitors.
		  angular.forEach($scope.matches, function(value,key) {
		    var selectedCompetitors = $filter('filter')(value.competitors_list,{'selected':true});
		    value.competitors = competitorsToIds(selectedCompetitors);

		    // for results.
			var curResult = value.results;
			value.results = [];
 			value.results.push(curResult);
		  });
		};

		$scope.find = function() {
		    // find all match, perhaps filtered by tournament
			$scope.tournaments = Matches.query();
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

		$scope.findOne = function() {
		    // find one match
			Matches.get({matchId:$stateParams.matchId
			}, function(val) {
			  $scope.init_match(val.matches[0], val);
			});
		};
	}
]);

