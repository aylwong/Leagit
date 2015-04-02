'use strict';

angular.module('core')
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
.filter('full_normal_date', function() {
  return function(input) {
    var curDate = Date.create(input);
      return curDate.format('{Mon} {d}, {yyyy} ({Dow}) {hh}:{mm} {tt}');
  };
})
.filter('format_date', function() {
  return function(input, format) {
    var curDate = Date.create(input);
	return curDate.format(format);
  };
});
