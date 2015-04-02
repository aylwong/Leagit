'use strict';

//Competitors service used for communicating with the competitors REST endpoints
angular.module('competitors').factory('CompetitorsSearch', ['$resource', function($resource) {
    return $resource('competitors/search', {
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
