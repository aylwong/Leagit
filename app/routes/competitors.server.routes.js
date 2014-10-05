'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	competitors = require('../../app/controllers/competitors');

module.exports = function(app) {
	// Competitor Routes
	app.route('/competitors')
		.get(competitors.list)
		.post(users.requiresLogin, competitors.create);
	
	app.route('/competitors/:competitorId')
		.get(competitors.read)
		.put(users.requiresLogin, competitors.hasAuthorization, competitors.update)
	    .delete(users.requiresLogin, competitors.hasAuthorization, competitors.delete);

	// Finish by binding the competitor middleware
	app.param('competitorId', competitors.competitorByID);
};
