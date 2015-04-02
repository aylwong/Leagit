'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users')
	,competitors = require('../../app/controllers/competitors')
	,tournaments = require('../../app/controllers/tournaments')
	,matches = require('../../app/controllers/matches');

module.exports = function(app) {
	// User Routes
	app.route('/user/matches')
	  .get(matches.list);

	// Match Routes
	app.route('/matches')
		.get(matches.list)
		.post(users.requiresLogin,matches.hasCreateAuthorization,matches.create);

	app.route('/matches/:matchId')
		.get(matches.read)
		.put(users.requiresLogin, matches.hasAuthorization, matches.update)
		.delete(users.requiresLogin, matches.hasAuthorization, matches.delete);
	// TODO - route to competitors
	app.route('/matches/:matchId/competitors')
		.get(competitors.listByMatch);

	// app.route('/tournaments/:tournamentId/matches/') - see tournaments routes

	// Finish by binding the tournament middleware
	app.param('tournamentId', matches.tournamentByID);
	app.param('competitorId', matches.competitorByID);
	app.param('matchId',matches.matchByID);
};
