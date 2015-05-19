'use strict';

(function() {
	// Matches Controller Spec
	describe('MatchesController', function() {
		// Initialize global variables
		var MatchesController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Competitors controller.
			MatchesController = $controller('MatchesController', {
				$scope: scope
			});
		}));

//		it('$scope.findOne() should create an array with at least one match object fetched from XHR', inject(function(Matches) {
//			// Create sample match using the Matches service
//
//			// Todo: Fill in match with real info
//			var sampleMatch = new Matches({
//				name: 'Tournament Name',
//				start_date: '2014/01/01@00:01',
//				end_date: '2014/01/01@00:01',
//				competitors: [],
//				description: 'Test Competitor'
//			});
//
//			// Create a sample matches array that includes the new tournament
//			var sampleMatches = [sampleMatch];
//
//			// Set GET response
//			$httpBackend.expectGET('matches').respond(sampleMatches);
//
//			// Run controller functionality
//			scope.findOne();
//			$httpBackend.flush();
//
//			// Test scope value
//			//expect(scope.matches).toEqualData(sampleMatches);
//		}));
	});
}());
