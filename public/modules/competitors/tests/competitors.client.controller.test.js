'use strict';

(function() {
	// Competitors Controller Spec
	describe('CompetitorsController', function() {
		// Initialize global variables
		var CompetitorsController,
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
			CompetitorsController = $controller('CompetitorsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one competitor object fetched from XHR', inject(function(Competitors) {
			// Create sample competitor using the Competitors service
			var sampleCompetitor = new Competitors({
				name: 'Competitor Name',
				email: 'test@email.com',
				description: 'Test Competitor'
			});

			// Create a sample competitor array that includes the new competitor
			var sampleCompetitors = [sampleCompetitor];

			// Set GET response
			$httpBackend.expectGET('competitors').respond(sampleCompetitors);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.competitors).toEqualData(sampleCompetitors);
		}));

		it('$scope.findOne() should create an array with one article object fetched from XHR using a articleId URL parameter', inject(function(Competitors) {
			// Define a sample competitor object
			var sampleCompetitor = new Competitors({
				name: 'Competitor Name',
				email: 'test@email.com',
				description: 'Test Competitor'
			});

			// Set the URL parameter
			$stateParams.competitorId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/competitors\/([0-9a-fA-F]{24})$/).respond(sampleCompetitor);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.competitor).toEqualData(sampleCompetitor);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Competitors) {
			// Create a sample competitor object
			var sampleCompetitorPostData = new Competitors({
				name: 'Competitor Name',
				email: 'test@email.com',
				description:'Test Competitor'
			});

			// Create a sample article response
			var sampleCompetitorResponse = new Competitors({
				_id: '525cf20451979dea2c000001',
				name: 'Competitor Name',
				email: 'test@email.com',
				description: 'Test Competitor'
			});

			// Fixture mock form input values
			scope.name = 'Competitor Name';
			scope.email = 'test@email.com';
			scope.description = 'Test Competitor';

			// Set POST response
			$httpBackend.expectPOST('competitors', sampleCompetitorPostData).respond(sampleCompetitorResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');
			expect(scope.email).toEqual('');

			// Test URL redirection after the competitor was created
			expect($location.path()).toBe('/competitors/' + sampleCompetitorResponse._id);
		}));

		it('$scope.update() should update a valid competitor', inject(function(Competitors) {
			// Define a sample competitor put data
			var sampleCompetitorPutData = new Competitors({
				_id: '525cf20451979dea2c000001',
				name: 'Competitor Name',
				email: 'test@email.com',
				description: 'Test Competitor'
			});

			// Mock competitor in scope
			scope.competitor = sampleCompetitorPutData;

			// Set PUT response
			$httpBackend.expectPUT(/competitors\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/competitors/' + sampleCompetitorPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid competitorId and remove the competitor from the scope', inject(function(Competitors) {
			// Create new competitor object
			var sampleCompetitor = new Competitors({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new competitors array and include the competitor
			scope.competitors = [sampleCompetitor];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/competitors\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCompetitor);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.competitors.length).toBe(0);
		}));
	});
}());
