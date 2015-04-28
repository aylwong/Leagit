'use strict';

//Tournaments service used for communicating with the tournaments REST endpoints
angular.module('tournaments').factory('PublicTournaments', ['$resource', function($resource) {
    return $resource('tournaments/public/:tournamentId', {
        tournamentId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
