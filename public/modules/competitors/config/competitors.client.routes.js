'use strict';

// Setting up route
angular.module('competitors').config(['$stateProvider',
	function($stateProvider) {
		// Competitors state routing
		$stateProvider.
		state('listCompetitors', {
			url: '/competitors',
			templateUrl: 'modules/competitors/views/list-competitors.client.view.html'
		}).
		state('createCompetitor', {
			url: '/competitors/create',
			templateUrl: 'modules/competitors/views/create-competitor.client.view.html'
		}).
		state('viewCompetitor', {
			url: '/competitors/:competitorId',
			templateUrl: 'modules/competitors/views/view-competitor.client.view.html'
		}).
		state('editCompetitor', {
			url: '/competitors/:competitorId/edit',
			templateUrl: 'modules/competitors/views/edit-competitor.client.view.html'
		});
	}
]);
