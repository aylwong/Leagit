'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	competitors = require('../../app/controllers/competitors'),
	tournaments = require('../../app/controllers/tournaments');


module.exports = function(app) {
	// Tournament Routes
	app.route('/tournaments')
		.get(tournaments.list)
		.post(users.requiresLogin, tournaments.create);
	
	app.route('/tournaments/:tournamentId')
		.get(tournaments.read)
		.put(users.requiresLogin, tournaments.hasAuthorization, tournaments.update)
	    .delete(users.requiresLogin, tournaments.hasAuthorization, tournaments.delete);

	// Finish by binding the tournament middleware
	app.param('tournamentId', tournaments.tournamentByID);
};
