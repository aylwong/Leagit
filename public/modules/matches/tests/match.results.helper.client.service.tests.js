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
            }
            var comp2 = {
             id:'compId2'
             ,name:'comp2'
            }

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
            }
            var comp2 = {
             id:'compId2'
             ,name:'comp2'
            }

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
            }
            var comp2 = {
             id:'compId2'
             ,name:'comp2'
            }

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
})();
