'use strict';

//Tournaments service used for communicating with the tournaments REST endpoints
angular.module('tournament.results').factory('Tournament.Results', function() {
    	var results = [{ 'id' : 'TBD', 'name': 'TBD', 'competitors' : []
			}, {
				'id' : 'Win', 'name' : 'Win', 'competitors' : []
			}, {
				'id' : 'Tie', 'name' : 'Tie', 'competitors' : []
			}, {
				'id' : 'Loss', 'name' : 'Loss', 'competitors' : []
			}];
    return  {
        results: results
        };
});
