'use strict';

//Competitors service used for communicating with the competitors REST endpoints
angular.module('competitors').factory('PublicCompetitors', ['$resource', function($resource) {
    return $resource('competitors/public/:competitorId', {
        competitorId: '@_id'
    }, {
    });
}]);
