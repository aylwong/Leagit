'use strict';

//General helpers for Lists and IDs service 
// Match helper functions to manipulate match objects
angular.module('core').factory('Core-Helper', ['$filter','_service', function($filter,_s) {

  // Filters a list on competitors
  var filterListOnSelected = function(list) {
    return $filter('filter')(list,{'selected':true});
  };

  /// Gets the Id for the value.
  var getId = function(value) {	
    if(value.id) {
      return value.id;
    } else if (value._id) {
      return value._id;
    } else {
      throw 'value does not have an Id property.';
    }
  };

  // get the Id as a string
  var getIdString = function(value) {
    return getId(value).toString();
  };

  // returns whether the two objects have the same Ids as strings
  var sameIdStrings = function(obj1, obj2) {
    return getId(obj1).toString() === getId(obj2).toString();
  };
	
  /// transform competitor objects to ids.
  /// competitors = list to transform
  /// returns a list of Ids
  var listToIds = function(list) {
    return  list.map(getId);
  };

  /// converts idList full of ids (strings) into full entries based on the fullList array
  var idsToList = function(idList, fullList)
  {
    var currentlySelected=false;
    var convertedList = idList.map(function(val) {
      var valueIndex = getIndexOfIdInList(val,fullList);
      if (valueIndex<0) {
	throw new Error('Id does not exist in full List');
      } else {
	return fullList[valueIndex];
      }
    });

    return convertedList;
  };

  /// returns the index of the first entry in the list that has id
  /// if none found, returns -1
  var getIndexOfIdInList = function(id, list) {
    var existingVal = -1;
    list.some( function (val,index) {
      if( getId(val).toString()===id.toString()) {
        existingVal=index;
        return true;
      } else {
        return false;
      }
    });

    return existingVal;
  };

  ///// get Entry in Array By Id
  //var getInArrayById = function(id, list) {
  //  var index = getIndexOfIdInList(id,list);
  //  if(index>=0) {
  //    return list[index];
  //  } else {
  //    return null;
  //  }
  //};

  // Finds the entry in Array with the specified Id
  // compares Ids as strings
  // returns entry, or undefined if element not in list.
  var getInArrayById = function(id,list) {
    var foundItem = _s.find(list,function(entry) {
      return id.toString() === getIdString(entry);
   });
    return foundItem;
  };

  // returns whether the val.toString exists in list
  // list is an array of toStringable ids
  // if list does not exist, will return false
  // val and lists must be 'toString' able.
  var valExistsInListAsString = function(val, list)
  {
    if(list && list.length>0)
    {
      return list.some(function(selectedValue) {
  	return selectedValue.toString() === val.toString();
      });
    } else {
      return false;
    }
  };

  // merge lists making sure they're unique
  var mergeArraysUnique = function(currentArray, mergeArray, compareFunction) {
    var fullArray = [].concat(currentArray,mergeArray);
    return _s.uniq(fullArray, compareFunction);
  };

  // merge lists using arbitrary compare function
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

  // Move Array Item from one to another array.
  var moveArrayItem = function(item,popArray,pushArray) {
    var itemIndex = popArray.indexOf(item);
    
    if(itemIndex>=0) {
      popArray.splice(itemIndex,1);
    }

    mergeArrays(pushArray, [item], sameIdStrings);
  };

  // remove all objects from child list if not in master list, based
  // on object ids
  var removeFromListIfNotInMasterList = function(childList,masterList) 
  {
    childList.forEach(function(competitor,index) {
      var competitorId = getId(competitor);
      var selected = masterList.some(function(comp) 
      {  
	return getId(comp) === competitorId;
      });
	
      if(!selected) {
	childList.splice(index,1);
      }
    });
  };

  // return functions that service will use
  return {
    listToIds: listToIds
    ,filterListOnSelected: filterListOnSelected
    ,idsToList: idsToList
    ,getInArrayById: getInArrayById
    ,mergeArrays: mergeArrays
    ,moveArrayItem: moveArrayItem
    ,getId: getId
    ,sameIdStrings: sameIdStrings
    ,removeFromListIfNotInMasterList: removeFromListIfNotInMasterList
    ,mergeArraysUnique: mergeArraysUnique 
  };
}]);