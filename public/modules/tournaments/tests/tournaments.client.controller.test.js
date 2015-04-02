'use strict';

(function() {
	// Tournaments Controller Spec
	describe('TournamentsController', function() {
		// Initialize global variables
		var TournamentsController,
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
			TournamentsController = $controller('TournamentsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one tournament object fetched from XHR', inject(function(Tournaments) {
			// Create sample tournament using the Tournaments service
			var sampleTournament = new Tournaments({
				name: 'Tournament Name',
				start_date: '2014/01/01@00:01',
				end_date: '2014/01/01@00:01',
				type: 'Ad Hoc',
				matches: [],
				competitors: [],
				description: 'Test Tournament'
			});

			// Create a sample tournament array that includes the new tournament
			var sampleTournaments = [sampleTournament];

			// Set GET response
			$httpBackend.expectGET('tournaments').respond(sampleTournaments);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tournaments).toEqualData(sampleTournaments);
		}));

		it('$scope.findOne() should create an array with one article object fetched from XHR using a articleId URL parameter', inject(function(Tournaments) {
			// Define a sample tournamentr object
			var sampleTournament = new Tournaments({
				name: 'Tournament Name',
				start_date: '2014/01/01@00:01',
				end_date: '2014/01/01@00:01',
				type: 'Ad Hoc',
				matches: [],
				competitors: [],
				description: 'Test Tournament'
			});

			// Set the URL parameter
			$stateParams.articleId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tournaments\/([0-9a-fA-F]{24})$/).respond(sampleTournament);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.article).toEqualData(sampleTournament);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tournaments) {
			// Create a sample tournament object
			var sampleTournamentPostData = new Tournaments({
				name: 'Tournament Name',
				start_date: '2014/01/01@00:01',
				end_date: '2014/01/01@00:01',
				type: 'Ad Hoc',
				matches: [],
				competitors: [],
				description:'Test Tournament'
			});

			// Create a sample article response
			var sampleTournamentResponse = new Tournaments({
				_id: '525cf20451979dea2c000001',
				name: 'Tournament Name',
				start_date: '2014/01/01@00:01',
				end_date: '2014/01/01@00:01',
				type: 'Ad Hoc',
				matches: [],
				competitors: [],
				description: 'Test Tournament'
			});

			// Fixture mock form input values
			scope.name = 'Tournament Name';
			scope.start_date = '2014/01/01@00:01';
			scope.end_date = '2014/01/01@00:01';
			scope.type = 'Ad Hoc';
			scope.matches = [];
			scope.competitors = [];
			scope.description = 'Test Tournament';

			// Set POST response
			$httpBackend.expectPOST('tournaments', sampleTournamentPostData).respond(sampleTournamentResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the tournament was created
			expect($location.path()).toBe('/tournaments/' + sampleTournamentResponse._id);
		}));

		it('$scope.update() should update a valid tournament', inject(function(Tournaments) {
		    // Update update tests

			// Define a sample tournament put data
			var sampleTournamentPutData = new Tournaments({
				_id: '525cf20451979dea2c000001',
				name: 'Tournament Name',
				start_date: '2014/01/01@00:01',
				end_date: '2014/01/01@00:01',
				type: 'Ad Hoc',
				matches: [],
				competitors: [],
				description: 'Test Tournament'
			});

			// Mock tournament in scope
			scope.tournament = sampleTournamentPutData;

			// Set PUT response
			$httpBackend.expectPUT(/tournaments\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tournaments/' + sampleTournamentPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tournamentId and remove the tournament from the scope', inject(function(Tournaments) {
			// Create new tournament object
			var sampleTournament = new Tournaments({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new tournaments array and include the tournament
			scope.tournaments = [sampleTournament];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tournaments\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTournament);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tournaments.length).toBe(0);
		}));
	});
}());
