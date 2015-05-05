'use strict';

// Setting up route
angular.module('tournaments').config(['$stateProvider',
	function($stateProvider) {
		// Tournaments state routing
		$stateProvider.
		state('listTournaments', {
			url: '/tournaments',
			templateUrl: 'modules/tournaments/views/list.tournaments.client.view.html'
		}).
		state('createTournament', {
			url: '/tournaments/create',
			templateUrl: 'modules/tournaments/views/create.tournament.client.view.html'
		}).
		state('viewTournament', {
			url: '/tournaments/:tournamentId',
			templateUrl: 'modules/tournaments/views/view.tournament.client.view.html'
		}).
		state('adHocTournament', {
			url: '/tournaments/:tournamentId/adhoc',
			templateUrl: 'modules/tournaments/views/create.adhoc.tournament.client.view.html'
		}).
		state('viewTournamentByMatch', {
			url: '/tournaments/:tournamentId/viewbymatch',
			templateUrl: 'modules/tournaments/views/view.by.match.tournament.client.view.html'
		}).
		state('viewTournamentByCompetitor', {
			url: '/tournaments/:tournamentId/viewbycompetitor',
			templateUrl: 'modules/tournaments/views/view.by.competitor.tournament.client.view.html'
		}).
		state('editTournamentCompetitors', {
			url: '/tournaments/:tournamentId/addcompetitors',
			templateUrl: 'modules/tournaments/views/add.competitors.to.tournament.client.view.html'
		}).
        state('editTournamentToCompetitor', {
			url: '/tournaments/:tournamentId/stepedit',
			templateUrl: 'modules/tournaments/views/step.edit.tournament.client.view.html'
		}).
        state('createTournamentMatches', {
			url: '/tournaments/:tournamentId/createtournamentmatches',
			templateUrl: 'modules/tournaments/views/create.tournament.matches.client.view.html'
		}).
		state('editTournament', {
			url: '/tournaments/:tournamentId/edit',
			templateUrl: 'modules/tournaments/views/edit.tournament.client.view.html'
		});
	}
]);
