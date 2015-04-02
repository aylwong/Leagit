'use strict';

angular.module('competitor_selects').controller('CompetitorSelectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Competitors', 'Core-Helper',
	function($scope, $stateParams, $location, Authentication, Competitors, CHelper) {
	var ctrl = this;

	ctrl.selectable_list = $scope.selectable_list;
	ctrl.selected_list = $scope.selected_list;

	  $scope.selectable_header = $scope.selectable_header || "Options";
	  $scope.selected_header=$scope.selected_header || "Selected";
	
	ctrl.selectSelectable = function(item) {
	  moveArrayItem(item, $scope.selectable_list, $scope.selected_list);
	};

	ctrl.unselectSelected = function(item) {
	  moveArrayItem(item, $scope.selected_list, $scope.selectable_list);
	};

	// move an entry from 1 array to another
	var moveArrayItem = function(item,popArray,pushArray) {
	  var itemIndex = popArray.indexOf(item);
	  if(itemIndex>=0) {
	    popArray.splice(itemIndex,1);
	  }
	  
	  // only push item item if item isn't already in the list.
	  CHelper.mergeArrays(pushArray,[item], CHelper.sameIdStrings);
	};
  }
]);
