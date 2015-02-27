'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	competitors = require('../../app/controllers/competitors'),
	tournaments = require('../../app/controllers/tournaments');

module.exports = function(app) {
	// User Routes Todo - remove?
	app.route('/user/tournaments/')
	  .get(tournaments.listByUser);
	// Get Competitors for a tournament
	app.route('/tournaments/:tournamentId/competitors')
		.get(competitors.listByTournament);
	// Tournament Routes
	app.route('/tournaments')
		.get(tournaments.listByUser)
		.post(users.requiresLogin, tournaments.create);
	// Matches for a tournament. currently an alias for tournaments/:ID
	app.route('/tournaments/:tournamentId/matches')
		.get(tournaments.read);
	app.route('/tournaments/:tournamentId')
		.get(tournaments.read)
		.put(users.requiresLogin, tournaments.hasAuthorization, tournaments.update)
	    .delete(users.requiresLogin, tournaments.hasAuthorization, tournaments.delete);

	// Finish by binding the tournament middleware
	app.param('tournamentId', tournaments.tournamentByID);
};
