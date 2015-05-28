'use strict';

(function() {

  describe('CompetitorHelper.getCompetitorArchiveEnumerations', function() {
		//Initialize global variables
		var CHService;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('competitors');
          inject(function(_CompetitorHelper_) {
    	    CHService =_CompetitorHelper_; 
	      });
        });

		it('should return a list Competitor Enumerations to use', function() {
            var list = CHService.getCompetitorArchiveEnumerations();
            var containsArchived = list.some(function(entry) {
                return entry === 'Archived';
            });
            expect(containsArchived).toBe(true);
            var containsCurrent = list.some(function(entry) {
                return entry === 'Current';
            });
            expect(containsCurrent).toBe(true);
        });
  });
  describe('CompetitorHelper.selectableCompetitors', function() {
		//Initialize global variables
		var CHService;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('competitors');
          inject(function(_CompetitorHelper_) {
    	    CHService =_CompetitorHelper_; 
	      });
        });

		it('should return a list of selectable Competitors', function() {
            var comp1 = { id:'id1', name:'comp1', email:'comp1@email.com', archived:'Current'};
            var comp2 = { id:'id2', name:'comp2', email:'comp1@email.com', archived:'Current'};
            var comp3 = { id:'id3', name:'comp3', email:'comp1@email.com', archived:'Archived'};
           var competitors = [ comp1, comp2, comp3];
            var list = CHService.selectableCompetitors(competitors);
            var containsComp1 = list.some(function(entry) {
                return entry === comp1;
            });
            expect(containsComp1).toBe(true);
            var containsComp2 = list.some(function(entry) {
                return entry === comp2;
            });
            expect(containsComp2).toBe(true);
            var containsComp3 = list.some(function(entry) {
                return entry === comp3;
            });
            expect(containsComp3).toBe(false);
        });
    });
 describe('CompetitorHelper.createNewCompetitor', function() {
		//Initialize global variables
		var CHService;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('competitors');
          inject(function(_CompetitorHelper_) {
    	    CHService =_CompetitorHelper_; 
	      });
        });

		it('should be able to create a new (client-side) competitor', function() {
           var oldComp1 = {name:'name1', email:'email1', description:'description1', id:'id1'};
           var oldComp2 = {name:'name2', email:'email2'};
           var oldComp3 = {name:'name3', email:'email3', state:'state3', imageLink:'imageLink3', bob:'bob1'};
           var newComp1 = CHService.createNewCompetitor(oldComp1);
            expect(newComp1===oldComp1).toBe(false);
            expect(newComp1.name).toBe('name1');
            expect(newComp1.email).toBe('email1');
            expect(newComp1.description).toBe('description1');
            expect(newComp1.id).toBe(undefined);
           var newComp2 = CHService.createNewCompetitor(oldComp2);
           expect(newComp2===oldComp2).toBe(false);
            expect(newComp2.name).toBe('name2');
            expect(newComp2.email).toBe('email2');
            expect(newComp2.description).toBe(undefined);
            expect(newComp2.id).toBe(undefined);
           var newComp3 = CHService.createNewCompetitor(oldComp3);
           expect(newComp3===oldComp3).toBe(false);
            expect(newComp3.name).toBe('name3');
            expect(newComp3.email).toBe('email3');
            expect(newComp3.description).toBe(undefined);
            expect(newComp3.state).toBe('state3');
            expect(newComp3.imageLink).toBe('imageLink3');
            expect(newComp3.bob).toBe(undefined);
        });
    });

})();
