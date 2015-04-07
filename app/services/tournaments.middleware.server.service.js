'use strict';
// This service includes functions to manipulate matches in addition to the match model.

var _ = require('lodash')
	,mongoose = require('mongoose')
	,Competitor = mongoose.model('Competitor')
	,Tournament = mongoose.model('Tournament')
	,HelperService = require('../../app/services/helper');

var helperService = HelperService.createService();

// initialise function
exports.createService = function(tournamentModel) {

 var _Tournament = tournamentModel;

  var tournamentById = function(req, res, next, id) {
    Tournament.findById(id).populate('user', 'displayName').exec(function(err,tournament) {
      if (err) return next(err);
      if (!tournament) return next(new Error('Failed to load Tournament ' + id));
      req.tournament = tournament;
      next();
    });
  };

  return {
    tournamentById: tournamentById
  };
};
