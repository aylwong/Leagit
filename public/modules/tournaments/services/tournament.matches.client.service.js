'use strict';

//Tournaments service used for communicating with the tournaments REST endpoints
angular.module('tournaments').factory('Tournaments', ['$resource', function($resource) {
    return $resource('tournaments/:tournamentId', {
        tournamentId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
