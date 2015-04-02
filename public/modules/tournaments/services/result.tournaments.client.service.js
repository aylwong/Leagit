'use strict';

//Tournaments service used for communicating with the tournaments REST endpoints
angular.module('tournament.results').factory('Tournament.Results', function() {

	var key = {};
	key.win = 'Win';
	key.tie = 'Tie';
	key.loss = 'Loss';
	key.tBD = 'TBD';

    	var results = [{ 'key' : key.tBD, 'name': 'TBD', 'competitors' : []
	  }, {
	    'key' : key.win, 'name' : 'Win', 'competitors' : []
	  }, {
	    'key' : key.tie, 'name' : 'Tie', 'competitors' : []
	  }, {
	    'key' : key.loss, 'name' : 'Loss', 'competitors' : []
	  }];

    	var selectResults = [{ 'key' : key.tBD, 'name': 'TBD', 'competitors' : [] 
	  }, {
	    'key' : key.win, 'name' : 'Win', 'competitors' : []
	  }, {
	    'key' : key.tie, 'name' : 'Tie', 'competitors' : []
	  }];

	var getResultWithKey = function(resultKey) {
	  var selectResult;
	  var results = selectResults.some(function(result) {
	    if(result.key === resultKey) {
	      selectResult = result;
	      return true;
	    }
	    return false;
	  });
	  return selectResult;
	};

    return  {
        results: results
	,selectResults: selectResults
	,getResultWithKey: getResultWithKey
	,key: key
        };
});
