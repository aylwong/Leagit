'use strict';

(function() {
  describe('TournamentResults.createResult', function() {
	//Initialize global variables
	var TRService;

    // Load Service to test
    beforeEach(function() {
      module(ApplicationConfiguration.applicationModuleName);
      module('tournaments', function() {
      });
    });

    beforeEach(function() {
      inject(function(_TournamentResults_) {
    	TRService =_TournamentResults_; 
      });
    });

	it('returns results', function() {
        var comp1 = [
          {id:'id1', name:'name1'}
          ,{id:'id2', name:'name2'}
          ,{id:'id3', name:'name3'}
        ];
        var res1 = {key:'res1', name:'results1', competitors:comp1};
      
      var result = TRService.createResult(TRService.key.win,comp1);

      expect(result).toEqual({key:TRService.key.win, name:'Win', competitors: comp1} );
    });
  });

  describe('TournamentResults.getResultWithKey', function() {
	//Initialize global variables
	var TRService;

    // Load Service to test
    beforeEach(function() {
      module(ApplicationConfiguration.applicationModuleName);
      module('tournaments', function() {
      });
    });

    beforeEach(function() {
      inject(function(_TournamentResults_) {
    	TRService =_TournamentResults_; 
      });
    });

	it('returns results', function() {
        var comp1 = [
          {id:'id1', name:'name1'}
          ,{id:'id2', name:'name2'}
          ,{id:'id3', name:'name3'}
        ];
      var resultKey = TRService.key.win;
      var result = TRService.getResultWithKey(resultKey);

      expect(result).toEqual({key:'Win', name:'Win', competitors: []} );
    });
  });

  describe('TournamentResults.getResultFromResults', function() {
	//Initialize global variables
	var TRService;

    // Load Service to test
    beforeEach(function() {
      module(ApplicationConfiguration.applicationModuleName);
      module('tournaments', function() {
      });
    });

    beforeEach(function() {
      inject(function(_TournamentResults_) {
    	TRService =_TournamentResults_; 
      });
    });

	it('returns results', function() {
      var r1=  {key:'Win', name:'Win', competitors:[]};
      var r2 = {key:'Tie', name:'Tie', competitors:[]};
      var r3 = {key:'Loss', name:'Loss', competitors:[]};
      var r4 = {key:'TBD', name:'TBD', competitors:[]};
      var results = [r1, r2, r3, r4];

      var entry1 = TRService.getResultFromResults(results,TRService.key.win);
      expect(entry1).toEqual(r1);
      var entry2 = TRService.getResultFromResults(results,TRService.key.tie);
      expect(entry2).toEqual(r2);
      var entry3 = TRService.getResultFromResults(results,TRService.key.loss);
      expect(entry3).toEqual(r3);
      var entry4 = TRService.getResultFromResults(results,TRService.key.tBD);
      expect(entry4).toEqual(r4);
    });
  });

  describe('TournamentResults.getName', function() {
	//Initialize global variables
	var TRService;

    // Load Service to test
    beforeEach(function() {
      module(ApplicationConfiguration.applicationModuleName);
      module('tournaments', function() {
      });
    });

    beforeEach(function() {
      inject(function(_TournamentResults_) {
    	TRService =_TournamentResults_; 
      });
    });

	it('returns results', function() {
      var entry1 = TRService.getName('Win');
      expect(entry1).toEqual('Win');

      var entry2 = TRService.getName('Tie');
      expect(entry2).toEqual('Tie');

      var entry3 = TRService.getName('Loss');
      expect(entry3).toEqual('Loss');

      var entry4 = TRService.getName('TBD');
      expect(entry4).toEqual('TBD');

      var entry5 = TRService.getName('Something Else');
      expect(entry5).toEqual('Unknown');
    });
});

})();
