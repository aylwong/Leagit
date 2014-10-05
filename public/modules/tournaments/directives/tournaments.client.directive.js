/*'use strict';

angular.module('tournaments')
.controller('TournamentsController', ['$scope', '$stateParams', '$location','$filter', 'Authentication', 'Tournaments', 'Competitors',
	function($scope, $stateParams, $location, $filter, Authentication, Tournaments, Competitors) {
		$scope.authentication = Authentication;

		$scope.start_date= new Date().toString();
		$scope.end_date = new Date().addDays(1).toString();
		$scope.available_types = [{'id': 'Ad Hoc', 'name': 'Ad Hoc'
			}, {
				'id': 'Round Robin', 'name': 'Round Robin'
			}, {
				 'id': 'Joust', 'name': 'Joust'
			}, {
				 'id': 'Elmination', 'name': 'Elimination'
			}, {
				 'id': 'Soft Elimination', 'name': 'Soft Elimination'
			}];

		$scope.add_new_match = function() {
			var match = {};
			match.name = $scope.new_match.name;
			match.start_date = $scope.new_match.start_date;
			match.end_date = $scope.new_match.end_date;
			match.location = $scope.new_match.location;
			//match.competitors = $scope.new_match_competitors;
			match.results = $scope.new_match.results;
			match.description = $scope.new_match.description;
			match.status = 'Pending';
			$scope.tournament.matches.push(match);
		};

		$scope.remove_match = function(match) {
		  var index = $scope.tournament.matches.indexOf(match);

		  if ( index > -1) {
		    $scope.tournament.matches.splice(index,1);
		  }
		};

		$scope.show_new_match=true;
		$scope.toggle_new_match = function() {
		  $scope.show_new_match = $scope.show_new_match!==true;
		};

		$scope.available_competitors = [];
		$scope.match_competitors = [];
		$scope.all_competitors = Competitors.query();
		Competitors.query( function(list) {
			angular.forEach(list, function( val, key) {
				$scope.available_competitors.push({'name':val.name, 'id':val._id, 'selected':false});
				$scope.match_competitors.push({'name':val.name, 'id':val._id, 'selected':false});
});
		console.log($scope.available_competitors);
		angular.forEach($scope.tournament.competitors, function(val, key) {
			for(var i=0;i<$scope.available_competitors.length;i++)
			{
				if($scope.available_competitors[i].id===val) {	
					$scope.available_competitors[i].selected=true;
				}
			}
		});
		});

		$scope.selected_competitors= $scope.available_competitors;

		$scope.create = function() {
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

		$scope.update = function() {
			var tournament = $scope.tournament;

			 //Turn the competitors into a string.
			var selectedCompetitors = $filter('filter')($scope.available_competitors,{'selected':true});
			var selectedCompetitorIds = [];
			angular.forEach(selectedCompetitors, function(value, key) {
				selectedCompetitorIds.push(value.id);
});

			console.log(selectedCompetitorIds);
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
			$scope.tournament = Tournaments.get({
				tournamentId: $stateParams.tournamentId
			});
		};

	}
]);
*/
