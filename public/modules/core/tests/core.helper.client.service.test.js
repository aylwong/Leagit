'use strict';

(function() {

	describe('CoreHelper.getId', function() {
		//Initialize global variables
		var CoreHelperService;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('core');
          inject(function(_CoreHelper_) {
    	    CoreHelperService =_CoreHelper_; 
	      });
        });

		it('should throw an error if does not have an id', function() {
            expect(angular.isFunction(CoreHelperService.getId)).toBe(true);
            
            var entry = {id:'id1', name:'testName', type:'test'};
            var entryW_ = {_id:'id2', name:'testName', type:'test'};
            var result = CoreHelperService.getId(entry);
            var resultW_ = CoreHelperService.getId(entryW_);
            expect(result).toBe('id1');
            expect(resultW_).toBe('id2');
        });
		it('should throw an error if does not have an id', function() {
            expect(angular.isFunction(CoreHelperService.getId)).toBe(true);
            var entry = { name:'bob', type:'test'};
            expect( function() { CoreHelperService.listToIds(entry);}).toThrow();
        });
    });

	describe('CoreHelper.hasId', function() {
		//Initialize global variables
		var CoreHelperService;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('core');
          inject(function(_CoreHelper_) {
    	    CoreHelperService =_CoreHelper_; 
	      });
        });

		it('should return false if no Id', function() {
            expect(CoreHelperService.hasId(12315)).toBe(false);
            expect(CoreHelperService.hasId({name:'12315', email:'none'})).toBe(false);
        });

		it('should throw true if has id', function() {
            expect(CoreHelperService.hasId({id:'id1', name:'test'})).toBe(true);
            expect(CoreHelperService.hasId({_id:'id2', name:'test'})).toBe(true);
        });
    });

	describe('CoreHelper.listToIds', function() {
		//Initialize global variables
		var scope,
			CoreHelperService;

		// Load the main application module
		beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('core');
          inject(function(_CoreHelper_) {
    	    CoreHelperService =_CoreHelper_; 
	      });
        });

		it('.listToIds should be able to convert list to Ids', function() {
            var testFunction = function() {};
            expect(angular.isFunction(CoreHelperService.listToIds)).toBe(true);
            var list = [
            {id:'id1', name:'name1'}
            ,{id:'id2', name:'name2'}
            ,{id:'id3', name:'name3'}
            ];
            var ids = CoreHelperService.listToIds(list);
			expect(ids[0]).toBe('id1');
			expect(ids[1]).toBe('id2');
			expect(ids[2]).toBe('id3');
		});

		it('.listToIds should be able to convert list to Ids with mix of ._id and .id', function() {
            var testFunction = function() {};
            expect(angular.isFunction(CoreHelperService.listToIds)).toBe(true);
            var list = [
            {_id:'id1', name:'name1'}
            ,{_id:'id2', name:'name2'}
            ,{id:'id3', name:'name3'}
            ];
            var ids = CoreHelperService.listToIds(list);
			expect(ids[0]).toBe('id1');
			expect(ids[1]).toBe('id2');
			expect(ids[2]).toBe('id3');
		});

		it('should throw an error if does not have an id', function() {
            var testFunction = function() {};
            expect(angular.isFunction(CoreHelperService.listToIds)).toBe(true);
            var list = [
            {id:'id1', name:'name1'}
            ,{id:'id2', name:'name2'}
            ,{ name:'name3'}
            ];
            expect( function(){ CoreHelperService.listToIds(list); }).toThrow();
		});
	});


	describe('CoreHelper.idsToList', function() {
		//Initialize global variables
		var CHService;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('core');
          inject(function(_CoreHelper_) {
    	    CHService =_CoreHelper_; 
	      });
        });

		it('should convert ids to List', function() {
            var ids = ['id1', 'id2', 'id4'];
           var id1 = {id:'id1', name:'name1'};
            var id2 = {id:'id2', name:'name2'};
            var id3 = {id:'id3', name:'name3'};
            var id4 = {id:'id4', name:'name4'};
            var list = [id1, id2, id3, id4];

            var newList = CHService.idsToList(ids,list);
            expect(newList.length).toBe(3);
            var id1Exists = newList.some(function(n) {
                return n === id1;
            });
            expect(id1Exists).toBe(true);
            var id2Exists = newList.some(function(n) {
                return n===id2;
            });
            expect(id2Exists).toBe(true);
            var id4Exists = newList.some(function(n) {
                return n===id4;
            });
            expect(id4Exists).toBe(true);
        });
    });

	describe('CoreHelper.sameIdStrings', function() {
		//Initialize global variables
		var CHService;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('core');
          inject(function(_CoreHelper_) {
    	    CHService =_CoreHelper_; 
	      });
        });

		it('should return true if object ids converted to strings are the same', function() {

            var entry1 = {id:'id1', name:'id1Name'};
            var entry1Id = 'id1';
            var entry1W_ = {_id:'id1', name:'id1_Name'};
            var entry2 = {id:'id2', name:'id2Name'};
            expect(CHService.sameIdStrings(entry1,entry1W_)).toBe(true);

            expect(function() {CHService.sameIdStrings(entry1,entry1Id);}).toThrow();
            expect(CHService.sameIdStrings(entry1,entry2)).toBe(false);
            expect(CHService.sameIdStrings(entry1W_,entry2)).toBe(false);
        });
    });
	describe('CoreHelper.getInArrayById', function() {
		//Initialize global variables
		var scope,
			CHService;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('core');
          inject(function(_CoreHelper_) {
    	    CHService =_CoreHelper_; 
	      });
        });

		it('should get In Array By Id', function() {
            var idEntry={id:'id1', name:'id1Name'};
            var idEntryW_={_id:'id1', name:'id1Name'};
            var list = [
            {id:'id2', name:'id2Name'}
            ,idEntry
            ,{id:'id3', name:'id3Name'}
            ];
            var listW_ = [
            {_id:'id2', name:'id2Name'}
            ,idEntryW_
            ,{_id:'id3', name:'id3Name'}
            ];
            var id = 'id1';

            expect(CHService.getInArrayById(id,list)).toBe(idEntry);
            expect(CHService.getInArrayById(id,listW_)).toBe(idEntryW_);
        });
    });
	describe('CoreHelper.mergeArrays', function() {
		//Initialize global variables
		var CHService;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('core');
          inject(function(_CoreHelper_) {
    	    CHService =_CoreHelper_; 
	      });
        });

		it('should merge Arrays to include entries of both', function() {
            var compareFunction = function(newEntry, oldEntry) {
                return newEntry.id === oldEntry.id;
            };
            var id1 = {id:'id1', name:'name1'};
            var id2 = {id:'id2', name:'name3'};
            var id3 = {id:'id3', name:'name3'};
            var id1Alt = {id:'id1', name:'name1'};
            var id4 = {id:'id4', name:'name2'};
            var id5 = {id:'id5', name:'name5'};
            var list1 = [id1, id2, id3];
            var list2 = [id1Alt, id4,id5];
            var resList = CHService.mergeArrays(list1,list2,compareFunction);
            expect(resList.length).toBe(5);
            var includes1 = resList.some(function(res) {
                return res === id1;
            });
            expect(includes1).toBe(true);
            var includes2 = resList.some(function(res) {
                return res === id2;
            });
            expect(includes2).toBe(true);
            var includes3 = resList.some(function(res) {
                return res === id3;
            });
            expect(includes3).toBe(true);
            var includes4 = resList.some(function(res) {
                return res === id4;
            });
            expect(includes4).toBe(true);
            var includes5 = resList.some(function(res) {
                return res === id5;
            });
            expect(includes5).toBe(true);
            var includes1Alt = resList.some(function(res) {
                return res === id1Alt;
            });
            expect(includes1Alt).toBe(false);
        });
    });
	describe('CoreHelper.moveArrayItem', function() {
		//Initialize global variables
		var CHService;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('core');
          inject(function(_CoreHelper_) {
    	    CHService =_CoreHelper_; 
	      });
        });

		it('should move the item from first array to other', function() {            var id1 = {id:'id1', name:'name1'};
            var id2 = {id:'id2', name:'name3'};
            var id3 = {id:'id3', name:'name3'};
            var id4 = {id:'id4', name:'name2'};
            var id5 = {id:'id5', name:'name5'};
            var id6 = {id:'id6', name:'name1'};
            var list1 = [id1, id2, id3];
            var list2 = [id6, id4,id5];
            CHService.moveArrayItem(id1,list1,list2);
            expect(list1.length).toBe(2);
            expect(list2.length).toBe(4);
            var id1InList1 = list1.some(function(entry) {
                return entry===id1;
            });
            expect(id1InList1).toBe(false);
            var id1InList2 = list2.some(function(entry) {
                return entry===id1;
            });
            expect(id1InList2).toBe(true);
        });
		it('should not push item to second array if item is in second array with id', function() {            
            var id1 = {id:'id1', name:'name1'};
            var id2 = {id:'id2', name:'name3'};
            var id3 = {id:'id3', name:'name3'};
            var id1Alt = {id:'id1', name:'name1'};
            var id4 = {id:'id4', name:'name2'};
            var id5 = {id:'id5', name:'name5'};
            var list1 = [id1, id2, id3];
            var list2 = [id1Alt, id4,id5];
            CHService.moveArrayItem(id1,list1,list2);
            expect(list1.length).toBe(2);
            expect(list2.length).toBe(3);
            var id1InList1 = list1.some(function(entry) {
                return entry===id1;
            });
            expect(id1InList1).toBe(false);
            var id1InList2 = list1.some(function(entry) {
                return entry===id1;
            });
            expect(id1InList2).toBe(false);
        });
    });
	describe('CoreHelper.filterListOnSelected', function() {
		//Initialize global variables
		var CHService;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('core');
          inject(function(_CoreHelper_) {
    	    CHService =_CoreHelper_; 
	      });
        });

		it('filter list for selected being true', function() {
            var id1= {id:'id1',selected:true};
            var id2= {id:'id2',selected:false};
            var id3= {id:'id3',selected:true};
            var list = [id1,id2,id3];
            var list2 = CHService.filterListOnSelected(list);
            expect(list2.length).toBe(2);
            var id1InList = list2.some(function(entry) {
                return entry===id1;
            });
            expect(id1InList).toBe(true);
            var id2InList = list2.some(function(entry) {
                return entry===id2;
            });
            expect(id2InList).toBe(false);
            var id3InList = list2.some(function(entry) {
                return entry===id3;
            });
            expect(id3InList).toBe(true);
        });
    });
	describe('CoreHelper.removeFromListIfNotInMasterList', function() {
		//Initialize global variables
		var CHService;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('core');
          inject(function(_CoreHelper_) {
    	    CHService =_CoreHelper_; 
	      });
        });

		it('should remove From List if Not in Other list', function() {
            var id1= {id:'id1',selected:true, name:'name1'};
            var id2= {id:'id2',selected:false, name:'name3'};
            var id3= {id:'id3',selected:true, name:'name4'};
            var childList = [id1,id2,id3];
            var masterList = [id1,id3];
            CHService.removeFromListIfNotInMasterList(childList, masterList);
            expect(childList.length).toBe(2);
            var id1InList = childList.some(function(entry) {
                return entry===id1;
            });
            expect(id1InList).toBe(true);
            var id2InList = childList.some(function(entry) {
                return entry===id2;
            });
            expect(id2InList).toBe(false);
            var id3InList = childList.some(function(entry) {
                return entry===id3;
            });
            expect(id3InList).toBe(true);

        });
    });
	describe('CoreHelper.mergeArraysUnique', function() {
		//Initialize global variables
		var CHService;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('core');
          inject(function(_CoreHelper_) {
    	    CHService =_CoreHelper_; 
	      });
        });

		it('should return false if no Id', function() {
            var compareFunction = function(entry) {
                return entry.id ;
            };
            var id1 = {id:'id1', name:'name1'};
            var id2 = {id:'id2', name:'name3'};
            var id3 = {id:'id3', name:'name3'};
            var id1Alt = {id:'id1', name:'name1'};
            var id4 = {id:'id4', name:'name2'};
            var id5 = {id:'id5', name:'name5'};
            var list1 = [id1, id2, id3];
            var list2 = [id1Alt, id4,id5];
            var resList = CHService.mergeArraysUnique(list1,list2,compareFunction);
            expect(resList.length).toBe(5);
            var id1Version;
            var includes1 = resList.some(function(res) {
                if(res===id1 || res===id1Alt) {
                    id1Version=res;
                    return true;
                } else {
                    return false;
                }
            });
            expect(includes1).toBe(true);
            var includes2 = resList.some(function(res) {
                return res === id2;
            });
            expect(includes2).toBe(true);
            var includes3 = resList.some(function(res) {
                return res === id3;
            });
            expect(includes3).toBe(true);
            var includes4 = resList.some(function(res) {
                return res === id4;
            });
            expect(includes4).toBe(true);
            var includes5 = resList.some(function(res) {
                return res === id5;
            });
            expect(includes5).toBe(true);
            var includes1Other = resList.some(function(res) {
                return (res === id1 || res===id1Alt) && res !==id1Version;
            });
            expect(includes1Other).toBe(false);
        });
    });
	describe('CoreHelper.removeEntryFromList', function() {
		//Initialize global variables
		var CHService;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('core');
          inject(function(_CoreHelper_) {
            CHService =_CoreHelper_; 
	      });
        });

		it('should remove Entry From List by Id', function() {
          var id1= {id:'id1',selected:true, name:'name1'};
          var id1Alt= {id:'id1',selected:false, name:'name1Alt'};
            var id2= {id:'id2',selected:false, name:'name3'};
            var id3= {id:'id3',selected:true, name:'name4'};
            var list = [id1,id2,id3];
            var entry = CHService.removeEntryFromList(id1Alt,list);
            expect(list.length).toBe(2);
            expect(entry.length).toBe(1);
            expect(entry[0]).toBe(id1);
            var id1InList = list.some(function(entry) {
                return entry===id1;
            });
            expect(id1InList).toBe(false);
        });

        it('should remove Entry From List by Id', function() {
          var id1= {id:'id1',selected:true, name:'name1'};
            var id2= {id:'id2',selected:false, name:'name3'};
            var id3= {id:'id3',selected:true, name:'name4'};
          var id4= {id:'id4',selected:false, name:'name1Alt'};
            var list = [id1,id2,id3];
            var entry = CHService.removeEntryFromList(id4,list);
            expect(list.length).toBe(3);
            expect(entry.length).toBe(0);
        });

    });
	describe('CoreHelper.stringSubstitute', function() {
		//Initialize global variables
		var CHService;
        beforeEach(function() {
          module(ApplicationConfiguration.applicationModuleName);
          module('core');
          inject(function(_CoreHelper_) {
    	    CHService =_CoreHelper_; 
	      });
        });

		it('should substitute strings', function() {
            var str3 = 'This {0} Should be {1}, and {2}';
            var str0 = 'This is Awesome';
            var substituteValues = ['String', 'Great', 'Amazing']
            var strResult = 'This String Should be Great, and Amazing';
            var res0 = CHService.stringSubstitute(str0,substituteValues);
            expect(res0).toBe(str0);
            var res3 = CHService.stringSubstitute(str3,substituteValues);
            expect(res3).toBe(strResult);
        });
    });
})();
