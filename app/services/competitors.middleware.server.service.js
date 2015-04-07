'use strict';
// This service includes functions to manipulate matches in addition to the match model.

var _ = require('lodash')
	,mongoose = require('mongoose')
	,Competitor = mongoose.model('Competitor')
	,Tournament = mongoose.model('Tournament')
	,HelperService = require('../../app/services/helper');

var helperService = HelperService.createService();

// initialise function
exports.createService = function(competitorModel) {

 var _Competitor = competitorModel;

  /**
  * Competitor middleware
  */
  var competitorById = function(req, res, next, id) {
    _Competitor.findById(id).populate('user', 'displayName').exec(function(err, competitor) {
      if (err) return next(err);
      if (!competitor) return next(new Error('Failed to load competitor ' + id));
      if(competitor.user.id!==req.user.id) {
	return next(new Error('User does not have access to competitor'));
      }
      req.competitor = competitor;
      next();
    });
  };

  return {
    competitorById: competitorById
  };
};
