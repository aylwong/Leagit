'use strict';

//Matches service used for communicating with the tournaments REST endpoints
angular.module('matches').factory('Matches', ['$resource', function($resource) {
    return $resource('matches/:matchId', {
        matchId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
	create: {
	    method:'POST'
	}
    });
}]);
