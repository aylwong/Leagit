'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	competitors = require('../../app/controllers/competitors'),
	tournaments = require('../../app/controllers/tournaments'),
	matches = require('../../app/controllers/matches');
module.exports = function(app) {
	// Competitor Routes
	app.route('/competitors')
		.get(competitors.list)
		.post(users.requiresLogin, competitors.create);

	app.route('/competitors/search')
		.get(competitors.currentList);
	// TODO: possibly remove archive enumerations
	app.route('/competitors/archiveenumerations')
		.get(competitors.archiveEnumerations);

	app.route('/competitors/:competitorId/tournaments')
		.get(tournaments.listByCompetitor);
	app.route('/competitors/:competitorId/matches')
		.get(matches.listByCompetitor);
	app.route('/competitors/:competitorId')
		.get(competitors.read)
		.put(users.requiresLogin, competitors.hasAuthorization, competitors.update)
	    .delete(users.requiresLogin, competitors.hasAuthorization, competitors.delete);

	// Finish by binding the competitor middleware
	app.param('competitorId', competitors.competitorByID);
};
