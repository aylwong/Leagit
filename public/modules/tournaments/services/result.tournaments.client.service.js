'use strict';

//Tournaments service used for communicating with the tournaments REST endpoints
angular.module('tournament.results').factory('TournamentResults', ['_service', function(_s) {

    var key = {};
	key.win = 'Win';
	key.tie = 'Tie';
	key.loss = 'Loss';
	key.tBD = 'TBD';

	// return whether key exists
	var keyExists = function(resultKey) {
	  for(var keyEntry in key)
	  {
	    if(keyEntry === resultKey) {
	      return keyEntry;
	    }
	  }
	};

	// Get Name
	var getName = function(resultKey) {
	  if(resultKey === key.win) {
	    return 'Win';
	  } else if(resultKey === key.tie) {
	    return 'Tie';
	  } else if(resultKey === key.loss) {
	    return 'Loss';
	  } else if(resultKey === key.tBD) {
	    return 'TBD';
	  } else {
	    return 'Unknown';
	  }
	};

	var createResult = function(resultKey, competitorList) {
	  return {
	   'key': resultKey
	    ,'name': getName(resultKey)
	    ,'competitors':competitorList
	  };
	};

   var results = [ createResult(key.tBD, [])
     ,createResult(key.win, [])
     ,createResult(key.tie, [])
	 ,createResult(key.loss, [])];

    var selectResults = [
	  createResult(key.tBD,[])
	  ,createResult(key.win,[])
	  ,createResult(key.tie,[])];

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

    var getResultFromResults = function(results, resultKey) {
      return _s.find(results,function(result) {
        return result.key === resultKey;
      });
    };

    return  {
        results: results
	,selectResults: selectResults
	,getResultWithKey: getResultWithKey
    ,getResultFromResults: getResultFromResults
	,key: key
    ,getName: getName
    ,createResult: createResult
        };
}]);
