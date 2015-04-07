'use strict';
// This service includes functions to work with models and mongoose in general/

var _ = require('lodash')
	,mongoose = require('mongoose');

// initialise function
exports.createService = function(helperModel) {

// merge Id list so no duplicates
var mergeArrays = function(currentArray,mergeArray,compareFunction) {
	mergeArray.forEach(function(newEntry) {
	  var comparison = currentArray.some(function(oldEntry)
	    {
	      return compareFunction(newEntry,oldEntry);
	  });
	  if(comparison === false) {
	    currentArray.push(newEntry);
	  } 
	});
	return currentArray;
};

// merge Competitor Ids
var mergeIds = function(currentArray,mergeArray) {
	var compareFunction = function(oldEntry,newEntry) {
	  return oldEntry.toString() === newEntry.toString();
	};
	
	return mergeArrays(currentArray,mergeArray,compareFunction);
};

return {
  mergeArrays: mergeArrays
  ,mergeIds: mergeIds
   };

};
