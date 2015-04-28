'use strict';

//Competitors service used for communicating with the competitors REST endpoints
angular.module('competitors').factory('Competitors', ['$resource', function($resource) {
    return $resource('competitors/:competitorId', {
        competitorId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
        ,massCreate: {
            method: 'POST'
            ,isArray:true
            ,url:'competitors/mass/'
        }

    });
}]);
