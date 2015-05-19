'use strict';

angular.module('competitor_selects').controller('CompetitorSelectsController', ['$scope', 'CoreHelper',
	function($scope, CHelper) {
	var ctrl = this;

	ctrl.selectable_list = $scope.selectable_list;
	ctrl.selected_list = $scope.selected_list;

	  ctrl.selectable_header = $scope.selectable_header || 'Options' ;
	  ctrl.selected_header=$scope.selected_header || 'Selected';

	// selected selectable Array (1st Array)	
	ctrl.selectSelectable = function(item) {
	  CHelper.moveArrayItem(item, $scope.selectable_list, $scope.selected_list);
	};

	// selected from already selected Array (2nd Array)
	ctrl.unselectSelected = function(item) {
	  CHelper.moveArrayItem(item, $scope.selected_list, $scope.selectable_list);
	};

  }
]);
