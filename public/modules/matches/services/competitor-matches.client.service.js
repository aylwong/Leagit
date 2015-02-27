'use strict';

//Competitors service used for communicating with the competitors REST endpoints
angular.module('matches').factory('CompetitorMatches', ['$resource', function($resource) {
    return $resource('competitors/:competitorId/matches'
	, { competitorId: '@_id'}
	, {
	  'query': {method: 'GET', isArray: true}
    	}
    );
}]);
