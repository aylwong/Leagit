'use strict';

angular.module('competitor_selects').directive('competitorSelects', [function() {
	return {
	  scope: {
	    selectable_list: '=selectable'
	    ,selected_list: '=selected'
	    ,selectable_header: '=?selectableheader'
	    ,selected_header: '=?selectedheader'
          }
	  ,restrict: 'E'
          ,templateUrl: 'modules/competitors/views/select.competitors.client.template.html'
          ,replace: true
	  ,link: function(scope,element, attrs){
	  }
	  ,controller: 'CompetitorSelectsController'
	  ,controllerAs: 'ctrl'
    	};
  }]
);
