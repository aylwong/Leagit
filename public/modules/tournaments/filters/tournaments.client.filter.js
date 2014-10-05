'use strict';

angular.module('tournaments')
.filter('full_date', function() {
  return function(input) {
    var curDate = Date.create(input);
	return curDate.full();
  };
})
.filter('ISO_date', function() {
  return function(input) {
    var curDate = Date.create(input);
	return curDate.toISOString();
  };
})
.filter('short_date', function() {
  return function(input) {
    var curDate = Date.create(input);
	return curDate.short();
  };
})
.filter('format_date', function() {
  return function(input, format) {
    var curDate = Date.create(input);
	return curDate.format(format);
  };
});
