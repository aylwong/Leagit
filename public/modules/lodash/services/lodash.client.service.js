'use strict';

//General helpers for Lists and IDs service 
// Match helper functions to manipulate match objects
angular.module('lodash').factory('_service', ['$window', function($window) {
  return $window._;
}]);
