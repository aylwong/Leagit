'use strict';

//Competitors service used for communicating with the competitors REST endpoints
angular.module('competitors').factory('MassCompetitors', ['$resource', function($resource) {
    return $resource('competitors/mass/:competitorId', {
        competitorId: '@_id'
    }, {
        massCreate: {
            method: 'POST'
            ,url:'competitors/mass/'
        }
    });
}]);
