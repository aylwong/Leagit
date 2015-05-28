'use strict';

(function() {

  describe('MatchResultsHelper.getCompetitorResult', function() {
		//Initialize global variables
		var MRHService, TResults;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('matches');
          inject(function(_MatchRoundsResultsHelper_,_TournamentResults_) {
    	    MRHService =_MatchRoundsResultsHelper_; 
            TResults = _TournamentResults_;
	      });
        });

		it('should get the result for the competitor in the match (win/loss)', function() {
            var comp1 = {
             id:'compId1'
             ,name:'comp1'
            };
            var comp2 = {
             id:'compId2'
             ,name:'comp2'
            };

            var match = {
              name:'match1'
              ,id:'matchId1'
              ,competitors:[comp1, comp2],
              results: [
                { key:TResults.key.win
                  ,competitors:[
                      'compId1'
                    ]
                }
                ,{ key:TResults.key.loss
                  ,competitors:[
                      'compId2'
                    ]
                }]
            };
            var comp1Result = MRHService.getCompetitorResult(match,comp1);
            var comp2Result = MRHService.getCompetitorResult(match,comp2);
            expect(comp1Result).toBe(TResults.key.win);
            expect(comp2Result).toBe(TResults.key.loss);
        });

		it('should get the result for the competitor in the match (tie)', function() {
            var comp1 = {
             id:'compId1'
             ,name:'comp1'
            };
            var comp2 = {
             id:'compId2'
             ,name:'comp2'
            };

            var match = {
              name:'match1'
              ,id:'matchId1'
              ,competitors:[comp1, comp2],
              results: [
                { key:TResults.key.tie
                  ,competitors:[
                      'compId1'
                      ,'compId2'
                    ]
                }]
            };
            var comp1Result = MRHService.getCompetitorResult(match,comp1);
            var comp2Result = MRHService.getCompetitorResult(match,comp2);
            expect(comp1Result).toBe(TResults.key.tie);
            expect(comp2Result).toBe(TResults.key.tie);
        });
		it('should get the result for the competitor in the match (none / tbd)', function() {
            var comp1 = {
             id:'compId1'
             ,name:'comp1'
            };
            var comp2 = {
             id:'compId2'
             ,name:'comp2'
            };

            var match = {
              name:'match1'
              ,id:'matchId1'
              ,competitors:[comp1, comp2],
              results: [
                { key:TResults.key.tBD
                  ,competitors:[
                      'compId1'
                    ]
                }]
            };
            var comp1Result = MRHService.getCompetitorResult(match,comp1);
            var comp2Result = MRHService.getCompetitorResult(match,comp2);
            expect(comp1Result).toBe(TResults.key.tBD);
            expect(comp2Result).toBe(TResults.key.tBD);
        });
  });

  describe('MatchResultsHelper.getCompetitorResultName', function() {
		//Initialize global variables
		var MRHService, TResults;
        var c1,c2,c3,m1,m2,m1ResultName, m2ResultName, m1c3ResultName;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('matches');
          inject(function(_MatchRoundsResultsHelper_,_TournamentResults_) {
    	    MRHService =_MatchRoundsResultsHelper_; 
            TResults = _TournamentResults_;
	      });
        });

        beforeEach(function() {
          c1 = {id:'c1', name:'comp1'};
          c2 = {id:'c2', name:'comp2'};
          c3 = {id:'c3', name:'comp3'};
          m1 = { id:'m1', name:'match1', competitors:[c1,c2,c3]
            ,results:[{key:TResults.key.win, competitors:['c1']}
                ,{key:TResults.key.loss,competitors:['c3']}]};
          m2 = { id:'m2', name:'match2', competitors:[c1,c2,c3]
            ,results:[{key:TResults.key.tie, competitors:['c1','c2']}]};
          m1ResultName='Win';
          m1c3ResultName='Loss';
          m2ResultName='Tie';
        });

		it('should get the result name for the competitor in the match (tie)', function() {
            var rName1 = MRHService.getCompetitorResultName(m1,c1);
            expect(rName1).toEqual(m1ResultName);
            var rName1c3 = MRHService.getCompetitorResultName(m1,c3);
            expect(rName1c3).toEqual(m1c3ResultName);
            var rName2 = MRHService.getCompetitorResultName(m2,c1);
            expect(rName2).toEqual(m2ResultName);
            });
    });

  describe('MatchResultsHelper.getMatchResultName', function() {
		//Initialize global variables
		var MRHService, TResults;
        var c1,c2,c3,m1,m2,m3,m1ResultName, m2ResultName, m3ResultName;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('matches');
          inject(function(_MatchRoundsResultsHelper_,_TournamentResults_) {
    	    MRHService =_MatchRoundsResultsHelper_; 
            TResults = _TournamentResults_;
	      });
        });

        beforeEach(function() {
          c1 = {id:'c1', name:'comp1'};
          c2 = {id:'c2', name:'comp2'};
          c3 = {id:'c3', name:'comp3'};
          m1 = { id:'m1', name:'match1', competitors:[c1,c2,c3]
            ,results:[
                {key:TResults.key.loss,competitors:['c3']}
                ,{key:TResults.key.win, competitors:['c1']}
                ]};
          m2 = { id:'m2', name:'match2', competitors:[c1,c2,c3]
            ,results:[{key:TResults.key.tie,competitors:['c2','c3']}
                ]};
          m3 = { id:'m3', name:'match3', competitors:[c1,c2,c3]
            ,results:[{key:TResults.key.tBD, competitors:['c1','c2']}]};
          m1ResultName='Win';
          m2ResultName='Tie';
          m3ResultName='TBD';
        });

		it('should return "win" if win exists)', function() {
            var rName1 = MRHService.getMatchResultName(m1);
            expect(rName1).toEqual(m1ResultName);
            });
		it('should return the first non-win result if no win exists if win exists)', function() {
            var rName2 = MRHService.getMatchResultName(m2);
            expect(rName2).toEqual(m2ResultName);
            });
		it('should return tBD if TBD', function() {
            var rName3 = MRHService.getMatchResultName(m3);
            expect(rName3).toEqual(m3ResultName);
            });
    });

  describe('MatchResultsHelper.getStrengthOfScheduleWins', function() {
	//Initialize global variables
	var MRHService, TResults;
    var c1,c2,c3,c4,c5,m1,m2,m3,m4,m5,matches;
    
    beforeEach(function() {
      module(ApplicationConfiguration.applicationModuleName);
      module('matches');
    
      inject(function(_MatchRoundsResultsHelper_,_TournamentResults_) {
        MRHService =_MatchRoundsResultsHelper_; 
        TResults = _TournamentResults_;
	  });
    });

    beforeEach(function() {
      c1 = {id:'c1', name:'comp1'};
      c2 = {id:'c2', name:'comp2'};
      c3 = {id:'c3', name:'comp3'};
      c4 = {id:'c4', name:'comp4'};
      c5 = {id:'c5', name:'comp5'};
      m1 = { id:'m1', name:'match1', competitors:[c1,c2]
        ,results:[{key:TResults.key.loss,competitors:['c2']}
          ,{key:TResults.key.win, competitors:['c1']}]};
      m2 = { id:'m2', name:'match2', competitors:[c1,c2]
        ,results:[{key:TResults.key.loss,competitors:['c1']}
          ,{key:TResults.key.win, competitors:['c2']}]};
      m3 = { id:'m3', name:'match3', competitors:[c3,c2]
        ,results:[{key:TResults.key.loss,competitors:['c3']}
          ,{key:TResults.key.win, competitors:['c2']}]};
      m4 = { id:'m4', name:'match4', competitors:[c3,c4]
        ,results:[{key:TResults.key.tBD, competitors:['c3','c4']}]};
      m5 = { id:'m5', name:'match5', competitors:[c3,c1]
        ,results:[{key:TResults.key.loss,competitors:['c3']}
          ,{key:TResults.key.win, competitors:['c1']}]};
      matches=[m1,m2,m3,m4,m5];
    });

	it('Strength for competitor with multiple matches', function() {
      var rName1 = MRHService.getStrengthOfScheduleWins(c1,matches);
      expect(rName1).toEqual(2);
    });
	it('Strength for competitor with tBD matches', function() {
      var rName2 = MRHService.getStrengthOfScheduleWins(c3,matches);
      expect(rName2).toEqual(4);
    });
	it('Strength for competitor with tBD matches only', function() {
      var rName3 = MRHService.getStrengthOfScheduleWins(c4,matches);
      expect(rName3).toEqual(0);
    });
	it('Strength for competitor with No matches', function() {
      var rName4 = MRHService.getStrengthOfScheduleWins(c5,matches);
      expect(rName4).toEqual(0);
    });
  });

  describe('MatchResultsHelper.getCompetitorWinsFromMatches', function() {
	//Initialize global variables
	var MRHService, TResults;
    var c1,c2,c3,c4,c5,m1,m2,m3,m4,m5,matches;
    
    beforeEach(function() {
      module(ApplicationConfiguration.applicationModuleName);
      module('matches');
    
      inject(function(_MatchRoundsResultsHelper_,_TournamentResults_) {
        MRHService =_MatchRoundsResultsHelper_; 
        TResults = _TournamentResults_;
	  });
    });

    beforeEach(function() {
      c1 = {id:'c1', name:'comp1'};
      c2 = {id:'c2', name:'comp2'};
      c3 = {id:'c3', name:'comp3'};
      c4 = {id:'c4', name:'comp4'};
      c5 = {id:'c5', name:'comp5'};
      m1 = { id:'m1', name:'match1', competitors:[c1,c2]
        ,results:[{key:TResults.key.loss,competitors:['c2']}
          ,{key:TResults.key.win, competitors:['c1']}]};
      m2 = { id:'m2', name:'match2', competitors:[c1,c2]
        ,results:[{key:TResults.key.loss,competitors:['c2']}
          ,{key:TResults.key.win, competitors:['c1']}]};
      m3 = { id:'m3', name:'match3', competitors:[c3,c2]
        ,results:[{key:TResults.key.loss,competitors:['c3']}
          ,{key:TResults.key.win, competitors:['c2']}]};
      m4 = { id:'m4', name:'match4', competitors:[c3,c4]
        ,results:[{key:TResults.key.tBD, competitors:['c3','c4']}]};
      m5 = { id:'m5', name:'match5', competitors:[c3,c1]
        ,results:[{key:TResults.key.loss,competitors:['c1']}
          ,{key:TResults.key.win, competitors:['c3']}]};
      matches=[m1,m2,m3,m4,m5];
    });

	it('Strength for competitor with multiple matches', function() {
      var rName1 = MRHService.getCompetitorWinsFromMatches(c1,matches);
      expect(rName1).toEqual(2);
    });
	it('Strength for competitor with tBD matches', function() {
      var rName2 = MRHService.getCompetitorWinsFromMatches(c3,matches);
      expect(rName2).toEqual(1);
    });
	it('Strength for competitor with tBD matches only', function() {
      var rName3 = MRHService.getCompetitorWinsFromMatches(c4,matches);
      expect(rName3).toEqual(0);
    });
	it('Strength for competitor with No matches', function() {
      var rName4 = MRHService.getCompetitorWinsFromMatches(c5,matches);
      expect(rName4).toEqual(0);
    });
  });

  describe('MatchResultsHelper.getCompetitorTiesFromMatches', function() {
	//Initialize global variables
	var MRHService, TResults;
    var c1,c2,c3,m1,m2,m3,matches;
    
    beforeEach(function() {
      module(ApplicationConfiguration.applicationModuleName);
      module('matches');
    
      inject(function(_MatchRoundsResultsHelper_,_TournamentResults_) {
        MRHService =_MatchRoundsResultsHelper_; 
        TResults = _TournamentResults_;
	  });
    });

    beforeEach(function() {
      c1 = {id:'c1', name:'comp1'};
      c2 = {id:'c2', name:'comp2'};
      c3 = {id:'c3', name:'comp3'};
      m1 = { id:'m1', name:'match1', competitors:[c1,c2]
        ,results:[{key:TResults.key.loss,competitors:['c2']}
          ,{key:TResults.key.win, competitors:['c1']}]};
      m2 = { id:'m2', name:'match2', competitors:[c1,c2]
        ,results:[{key:TResults.key.loss,competitors:['c1']}
          ,{key:TResults.key.tie, competitors:['c2']}]};
      m3 = { id:'m3', name:'match3', competitors:[c3,c2]
        ,results:[{key:TResults.key.tie,competitors:['c2','c3']}]};
      matches=[m1,m2,m3];
    });

	it('competitor with no ties', function() {
      var rName1 = MRHService.getCompetitorTiesFromMatches(c1,matches);
      expect(rName1).toEqual(0);
    });
    it('competitor with 1 tie', function() {
      var rName2 = MRHService.getCompetitorTiesFromMatches(c3,matches);
      expect(rName2).toEqual(1);
    });
	it('competitor with 2 ties', function() {
      var rName3 = MRHService.getCompetitorTiesFromMatches(c2,matches);
      expect(rName3).toEqual(2);
    });
  });

  describe('MatchResultsHelper.getCompetitorLossesFromMatches', function() {
	//Initialize global variables
	var MRHService, TResults;
    var c1,c2,c3,m1,m2,m3,matches;
    
    beforeEach(function() {
      module(ApplicationConfiguration.applicationModuleName);
      module('matches');
    
      inject(function(_MatchRoundsResultsHelper_,_TournamentResults_) {
        MRHService =_MatchRoundsResultsHelper_; 
        TResults = _TournamentResults_;
	  });
    });

    beforeEach(function() {
      c1 = {id:'c1', name:'comp1'};
      c2 = {id:'c2', name:'comp2'};
      c3 = {id:'c3', name:'comp3'};
      m1 = { id:'m1', name:'match1', competitors:[c1,c2]
        ,results:[{key:TResults.key.loss,competitors:['c2']}
          ,{key:TResults.key.win, competitors:['c1']}]};
      m2 = { id:'m2', name:'match2', competitors:[c1,c2]
        ,results:[{key:TResults.key.loss,competitors:['c1']}
          ,{key:TResults.key.win, competitors:['c2']}]};
      m3 = { id:'m3', name:'match3', competitors:[c3,c2]
        ,results:[{key:TResults.key.loss,competitors:['c2']}
          ,{key:TResults.key.win,competitors:['c3']}]};
      matches=[m1,m2,m3];
    });

	it('competitor with 2 losses', function() {
      var rName1 = MRHService.getCompetitorLossesFromMatches(c2,matches);
      expect(rName1).toEqual(2);
    });
    it('competitor with 1 loss', function() {
      var rName2 = MRHService.getCompetitorLossesFromMatches(c1,matches);
      expect(rName2).toEqual(1);
    });
	it('competitor with 0 losses', function() {
      var rName3 = MRHService.getCompetitorLossesFromMatches(c3,matches);
      expect(rName3).toEqual(0);
    });
  });

  describe('MatchResultsHelper.getCompetitorTBDFromMatches', function() {
	//Initialize global variables
	var MRHService, TResults;
    var c1,c2,c3,m1,m2,m3,matches;
    
    beforeEach(function() {
      module(ApplicationConfiguration.applicationModuleName);
      module('matches');
    
      inject(function(_MatchRoundsResultsHelper_,_TournamentResults_) {
        MRHService =_MatchRoundsResultsHelper_; 
        TResults = _TournamentResults_;
	  });
    });

    beforeEach(function() {
      c1 = {id:'c1', name:'comp1'};
      c2 = {id:'c2', name:'comp2'};
      c3 = {id:'c3', name:'comp3'};
      m1 = { id:'m1', name:'match1', competitors:[c1,c2]
        ,results:[{key:TResults.key.loss,competitors:['c2']}
          ,{key:TResults.key.win, competitors:['c1']}]};
      m2 = { id:'m2', name:'match2', competitors:[c1,c2]
        ,results:[{key:TResults.key.loss,competitors:['c1']}
          ,{key:TResults.key.tBD, competitors:['c2']}]};
      m3 = { id:'m3', name:'match3', competitors:[c3,c2]
        ,results:[{key:TResults.key.tBD,competitors:['c2','c3']}]};
      matches=[m1,m2,m3];
    });

	it('competitor with 2 tBD', function() {
      var rName1 = MRHService.getCompetitorTBDFromMatches(c2,matches);
      expect(rName1).toEqual(2);
    });
    it('competitor with 0 tBD', function() {
      var rName2 = MRHService.getCompetitorTBDFromMatches(c1,matches);
      expect(rName2).toEqual(0);
    });
	it('competitor with 1 tBD', function() {
      var rName3 = MRHService.getCompetitorTBDFromMatches(c3,matches);
      expect(rName3).toEqual(1);
    });
  });

  describe('MatchResultsHelper.getCompetitorGamesPlayedFromMatches', function() {
	//Initialize global variables
	var MRHService, TResults;
    var c1,c2,c3,m1,m2,m3,matches;
    
    beforeEach(function() {
      module(ApplicationConfiguration.applicationModuleName);
      module('matches');
    
      inject(function(_MatchRoundsResultsHelper_,_TournamentResults_) {
        MRHService =_MatchRoundsResultsHelper_; 
        TResults = _TournamentResults_;
	  });
    });

    beforeEach(function() {
      c1 = {id:'c1', name:'comp1'};
      c2 = {id:'c2', name:'comp2'};
      c3 = {id:'c3', name:'comp3'};
      m1 = { id:'m1', name:'match1', competitors:[c1,c2]
        ,results:[{key:TResults.key.loss,competitors:['c2']}
          ,{key:TResults.key.win, competitors:['c1']}]};
      m2 = { id:'m2', name:'match2', competitors:[c1,c2]
        ,results:[{key:TResults.key.loss,competitors:['c1']}
          ,{key:TResults.key.win, competitors:['c2']}]};
      m3 = { id:'m3', name:'match3', competitors:[c3,c2]
        ,results:[{key:TResults.key.tBD,competitors:['c2','c3']}]};
      matches=[m1,m2,m3];
    });

	it('competitor with 1 tBD', function() {
      var rName1= MRHService.getCompetitorGamesPlayedFromMatches(c1,matches);
      expect(rName1).toEqual(2);
    });
    it('competitor with 0 tBD, 2 games', function() {
      var rName2= MRHService.getCompetitorGamesPlayedFromMatches(c2,matches);
      expect(rName2).toEqual(2);
    });
	it('competitor with 0 tBD', function() {
      var rName3= MRHService.getCompetitorGamesPlayedFromMatches(c3,matches);
      expect(rName3).toEqual(0);
    });
  });

  describe('MatchResultsHelper.getCompetitorPointsFromMatches', function() {
	//Initialize global variables
	var MRHService, TResults;
    var c1,c2,c3,m1,m2,m3,m4,matches;
    
    beforeEach(function() {
      module(ApplicationConfiguration.applicationModuleName);
      module('matches');
    
      inject(function(_MatchRoundsResultsHelper_,_TournamentResults_) {
        MRHService =_MatchRoundsResultsHelper_; 
        TResults = _TournamentResults_;
	  });
    });

    beforeEach(function() {
      c1 = {id:'c1', name:'comp1'};
      c2 = {id:'c2', name:'comp2'};
      c3 = {id:'c3', name:'comp3'};
      m1 = { id:'m1', name:'match1', competitors:[c1,c2]
        ,results:[{key:TResults.key.loss,competitors:['c2'],points:[3]}
          ,{key:TResults.key.win, competitors:['c1'],points:[2]}]};
      m2 = { id:'m2', name:'match2', competitors:[c1,c2]
        ,results:[{key:TResults.key.loss,competitors:['c1'],points:[0]}
          ,{key:TResults.key.win, competitors:['c2'],points:[1]}]};
      m3 = { id:'m3', name:'match3', competitors:[c3,c2]
        ,results:[{key:TResults.key.tBD,competitors:['c2','c3']}]};
      m4 = { id:'m4', name:'match4', competitors:[c2,c3]
        ,results:[{key:TResults.key.loss,competitors:['c4'],points:[2]}
          ,{key:TResults.key.win, competitors:['c2']}]};
      matches=[m1,m2,m3,m4];
    });

	it('competitor with 1 tBD', function() {
      var rName1 = MRHService.getCompetitorPointsFromMatches(c1,matches);
      expect(rName1).toEqual([2]);
    });
    it('competitor with 0 tBD, 2 games', function() {
      var rName2 = MRHService.getCompetitorPointsFromMatches(c2,matches);
      expect(rName2).toEqual([4]);
    });
	it('no point matches', function() {
      var rName3 = MRHService.getCompetitorPointsFromMatches(c3,matches);
      expect(rName3).toEqual([0]);
    });
  });

  describe('MatchResultsHelper.getCompetitorResultsFromMatches', function() {
	//Initialize global variables
	var MRHService, TResults;
    var c1,c2,c3,m1,m2,m3,m4,r1,r2,r3,matches;
    
    beforeEach(function() {
      module(ApplicationConfiguration.applicationModuleName);
      module('matches');
    
      inject(function(_MatchRoundsResultsHelper_,_TournamentResults_) {
        MRHService =_MatchRoundsResultsHelper_; 
        TResults = _TournamentResults_;
	  });
    });

    beforeEach(function() {
      c1 = {id:'c1', name:'comp1'};
      c2 = {id:'c2', name:'comp2'};
      c3 = {id:'c3', name:'comp3'};
      m1 = { id:'m1', name:'match1', competitors:[c1,c2]
        ,results:[{key:TResults.key.loss,competitors:['c2']}
          ,{key:TResults.key.win, competitors:['c1']}]};
      m2 = { id:'m2', name:'match2', competitors:[c1,c2]
        ,results:[{key:TResults.key.loss,competitors:['c1']}
          ,{key:TResults.key.win, competitors:['c2']}]};
      m3 = { id:'m3', name:'match3', competitors:[c3,c2]
        ,results:[{key:TResults.key.tBD,competitors:['c2','c3']}]};
      r1 = [ {key:TResults.key.win, competitors:['c1']}
        ,{key:TResults.key.loss,competitors:['c1']}];
      r2 = [ {key:TResults.key.loss, competitors:['c2']}
        ,{key:TResults.key.win,competitors:['c2']}
        ,{key:TResults.key.tBD,competitors:['c2','c3']}];
      r3 = [{key:TResults.key.tBD,competitors:['c2','c3']}];
      matches=[m1,m2,m3];
    });

	it('competitor Results', function() {
      var rName1 = MRHService.getCompetitorResultsFromMatches(c1,matches);
      expect(rName1).toEqual(r1);
    });
    it('competitor Results', function() {
      var rName2 = MRHService.getCompetitorResultsFromMatches(c2,matches);
      expect(rName2).toEqual(r2);
    });
	it('no point matches', function() {
      var rName3 = MRHService.getCompetitorResultsFromMatches(c3,matches);
      expect(rName3).toEqual(r3);
    });
  });

})();
