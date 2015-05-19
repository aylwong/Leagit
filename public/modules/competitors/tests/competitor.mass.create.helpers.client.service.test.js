'use strict';

(function() {

  describe('CompetitorMassCreateHelper.splitEmailList', function() {
		//Initialize global variables
		var CMCHService;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('competitors');
          inject(function(_CompetitorMassCreateHelper_) {
    	    CMCHService =_CompetitorMassCreateHelper_; 
	      });
        });

		it('split just names', function() {
            var emailList = 'Amy, Bob, Claire Dareson, Englebert';

            var list = CMCHService.splitEmailList(emailList);
            expect(list.length).toBe(4);
            var containsAmy = list.some(function(entry) {
                return entry.name==='Amy';
            });
            expect(containsAmy).toBe(true);
            var containsBob = list.some(function(entry) {
                return entry.name==='Bob';
            });
            expect(containsBob).toBe(true);
            var containsClaire = list.some(function(entry) {
                return entry.name==='Claire Dareson';
            });
            expect(containsClaire).toBe(true);
            var containsEnglebert = list.some(function(entry) {
                return entry.name==='Englebert';
            });
            expect(containsEnglebert).toBe(true);
        });
        
        it('split a single name', function() {
            var emailList = 'Amy';

            var list = CMCHService.splitEmailList(emailList);
            expect(list.length).toBe(1);
            expect(list[0].name).toBe('Amy');
        });

		it('split with quotes', function() {
            var emailList = 'Amy, "Bob, The Doctor", Claire Dareson';

            var list = CMCHService.splitEmailList(emailList);
            expect(list.length).toBe(3);
            var containsAmy = list.some(function(entry) {
                return entry.name==='Amy';
            });
            expect(containsAmy).toBe(true);
            var containsBob = list.some(function(entry) {
                return entry.name==='Bob, The Doctor';
            });
            expect(containsBob).toBe(true);
            var containsClaire = list.some(function(entry) {
                return entry.name==='Claire Dareson';
            });
        });
        
		it('split with emails', function() {
            var emailList = 'Amy <amy@email.com>, "Bob, The Doctor", Claire Dareson<claire@email.com>, "Englebert" <englebert@email.com>';

            var list = CMCHService.splitEmailList(emailList);
            expect(list.length).toBe(4);
            var containsAmy = list.some(function(entry) {
                return entry.name==='Amy' && entry.email==='amy@email.com';
            });
            expect(containsAmy).toBe(true);
            var containsBob = list.some(function(entry) {
                return entry.name==='Bob, The Doctor';
            });
            expect(containsBob).toBe(true);
            var containsClaire = list.some(function(entry) {
                return entry.name==='Claire Dareson' && entry.email==='claire@email.com';
            });
            expect(containsClaire).toBe(true);
            var containsEnglebert = list.some(function(entry) {
                return entry.name==='Englebert' && entry.email==='englebert@email.com';
            });
            expect(containsEnglebert).toBe(true);
        });

  });
})();
