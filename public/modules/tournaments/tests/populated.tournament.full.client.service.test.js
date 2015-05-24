'use strict';

(function() {
  describe('PopulatedTournament.loadPublicTournamentDetails', function() {
	//Initialize global variables
	var PTService;
    var $provide, $q, $rootScope; 
    var mockTournaments, mockPublicCompetitors;
    var tournamentResult, competitorsResult;

    // Load Service to test
    beforeEach(function() {
      module(ApplicationConfiguration.applicationModuleName);
    });

    // create mock objects and inject into service;
    beforeEach(function() {
      module('tournaments', function(_$provide_) {
        $provide = _$provide_;
        $provide.value('Tournaments',mockTournaments);
        $provide.value('PublicCompetitors',mockPublicCompetitors);
      });
    });

    beforeEach(function() {
      mockTournaments = {
        get: function() {
          var deferred = $q.defer();
          deferred.resolve(tournamentResult);
          return { $promise: deferred.promise };
        }
      };
      
      mockPublicCompetitors = {
        query: function() {
          var deferred = $q.defer();
          deferred.resolve(competitorsResult);
          return { $promise: deferred.promise };
        }
      };
    });

    beforeEach(function() {
      inject(function(_PopulatedTournament_,_$q_,_$rootScope_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
    	PTService =_PopulatedTournament_; 
      });
    });

	it('should loadPublicTournamentDetails based on ID, from Competitors & Tournament', function(done) {
      tournamentResult = {id:'t1'
        , competitors:['c1','c2','c3']
        , name:'Tournament1'
        , matches:[]};
 
      competitorsResult = [{id:'c1'
        ,name:'competitor1'
        ,email:'c1@email.com'}
        ,{id:'c2', name:'competitor2', email:'c1@email.com'}
        ,{id:'c3', name:'competitor3'}
      ];
      
      var finalResult = { tournament :{id:'t1'
        , competitors:['c1','c2','c3']
        , name:'Tournament1'
        , matches:[]
        , competitors_full:[
          {id:'c1', name:'competitor1', email:'c1@email.com'}
          ,{id:'c2', name:'competitor2', email:'c1@email.com'}
          ,{id:'c3',name:'competitor3'}
        ]}
        , competitors: [
          {id:'c1', name:'competitor1', email:'c1@email.com'}
          ,{id:'c2', name:'competitor2', email:'c1@email.com'}
          ,{id:'c3', name:'competitor3'}
        ]
      };
      
      var loadTournamentPromise = PTService.loadPublicTournamentDetails(1);

      loadTournamentPromise.then(function(results) {
          expect(results).toEqual(finalResult);
        },function(err) { done()})
      .catch(function(err) {
         expect(err).toBe(undefined);
        })
       .finally(done);
         $rootScope.$apply();
    });
  });
})();
