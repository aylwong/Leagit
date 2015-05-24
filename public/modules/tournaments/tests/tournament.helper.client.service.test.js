'use strict';

(function() {
  describe('TournamentHelper.selectableCompetitors', function() {
	//Initialize global variables
	var THService;

    // Load Service to test
    beforeEach(function() {
      module(ApplicationConfiguration.applicationModuleName);
      module('tournaments', function() {
      });
    });

    beforeEach(function() {
      inject(function(_TournamentHelper_) {
    	THService =_TournamentHelper_; 
      });
    });

	it('get selectable Competitors', function() {
        var c1 = {name:'comp1', id:'c1'};
        var c2 = {name:'comp1', id:'c2', archived:'Archived'};
        var c3 = {name:'comp2', id:'c3', archived:'current'};
        var c4 = {name:'comp2', id:'c4', archived:'Current'};
      var competitors = [c1, c2, c3, c4];
      
      var match = THService.selectableCompetitors(competitors);

      expect(match).toEqual([c3,c4]);
    });
  });
})();
