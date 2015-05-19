'use strict';

/**
 * Module dependencies.
 */
var should = require('should')
	, mongoose = require('mongoose')
	,competitors = require('../../app/services/competitors')
    ,User = mongoose.model('User')
    ,Competitor = mongoose.model('Competitor')
    ,Tournament = mongoose.model('Tournament');
	
/**
 * Globals
 */
var competitorService, TournamentModel, CompetitorModel, user;

/**
 * Unit tests
 */
describe('Competitor Service Unit Tests:', function() {
	beforeEach(function(done) {
		TournamentModel = Tournament;	       
        CompetitorModel=Competitor;
		competitorService = competitors.createService(CompetitorModel,TournamentModel);
	  user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
	  });

	  user.save(function() {
			done();
	  });

	});

    describe('createCompetitors',function() {
      it('can create multiple competitors and return them', function(done) {
        competitorService.createCompetitors([
          {name:'Comp1', email:'Comp1@email.com', user:user}
            ,{name:'Comp2', email:'Comp2@email.com', user:user}
            ,{name:'Comp3', email:'Comp3@email.com', user:user}
          ]).then(function(result) {
            (result.length===3).should.be.exactly(true);
            result.some(function(res) {
              return res.name==='Comp1' && res.email==='Comp1@email.com';
            }).should.be.exactly(true);
              
            result.some(function(res) {
              return res.name==='Comp2' && res.email==='Comp2@email.com';
            }).should.be.exactly(true);
            result.some(function(res) {
              return res.name==='Comp3' && res.email==='Comp3@email.com';
            }).should.be.exactly(true);
            done();
            })
          .onReject(function(err) {
            console.log('rejected');
            done(err);
          });
      });
    });

	describe('competitorFilters', function() {
      // Add to the correct filters to query
	  it('adds correct "or" filters', function(done) {
        competitorService.createCompetitors([
              {name:'Comp1', email:'Comp1@email.com', user:user}
              ,{name:'Comp2', email:'Comp2@email.com', user:user}
              ,{name:'Comp3', email:'Comp3@email.com', user:user}
            ]).then(function(result) {
                var query = Competitor.find();
                return competitorService.competitorFilters({email:'Comp1@email.com'},query);
            }).then(function(query2) {
              return query2.exec();
            }).then(function(result) {
                result.length.should.be.exactly(1);
                result[0].name.should.be.exactly('Comp1');
                done();
          }).onReject(function(err) {
            done(err);
          });
	  });
	  it('adds correct name filters', function(done) {
        competitorService.createCompetitors([
              {name:'Comp1', email:'Comp1@email.com', user:user}
              ,{name:'Comp2', email:'Comp2@email.com', user:user}
              ,{name:'Comp3', email:'Comp3@email.com', user:user}
            ]).then(function(result) {
                var query = Competitor.find();
                return competitorService.competitorFilters({email:'Comp1@email.com',name:'Comp2',or:'true'},query);
            }).then(function(query2) {
              return  query2.exec();
            }).then(function(result) {
              (result.length===2).should.be.exactly(true);
              result.some(function(res) {
                return res.name==='Comp2';
              }).should.be.exactly(true);
                result.some(function(res) {
                  return res.email==='Comp1@email.com';
                }).should.be.exactly(true);
              done();
            })
            .onReject(function(err) {
              done(err);
            });
	  });
	  it('adds correct tournament filters', function(done) {
        var tournCompetitors=[];
        var tournament;
        competitorService.createCompetitors([
              {name:'Comp1', email:'Comp1@email.com', user:user}
              ,{name:'Comp2', email:'Comp2@email.com', user:user}
              ,{name:'Comp3', email:'Comp3@email.com', user:user}
        ]).then(function(result) {
            tournCompetitors.push(result[0]);

            tournament = new Tournament({
            competitors:tournCompetitors
            , name:'Tourn1'
            ,user:user
            ,type:'Swiss'
            });
            return tournament.save();
        }).then(function() {
                var query = Competitor.find();
                return competitorService.competitorFilters({tournamentId:tournament._id},query);
            }).then(function(query2) {
              return  query2.exec();
            }).then(function(result) {
              (result.length===1).should.be.exactly(true);
              (result[0].name===tournCompetitors[0].name).should.be.exactly(true);
              done();
            })
            .onReject(function(err) {
              done(err);
            });

	  });
	});

	describe('searchForDuplicateFilters', function() {
		it('adds correct email filters', function(done) {
        competitorService.createCompetitors([
              {name:'Comp1', email:'Comp1@email.com', user:user}
              ,{name:'Comp2', email:'Comp2@email.com', user:user}
              ,{name:'Comp3', email:'Comp3@email.com', user:user}
            ]).then(function(result) {
                var query = Competitor.find();
                return competitorService.searchForDuplicateFilters([{email:'Comp1@email.com'},{email:'Comp2@email.com',name:'Comp2'}],query);
            }).then(function(query2) {
              return query2.exec();
            }).then(function(result) {
                result.length.should.be.exactly(2);
                result.some(function(res) {
                    return res.email==='Comp2@email.com';
                }).should.be.exactly(true);
                result.some(function(res) {
                    return res.email==='Comp1@email.com';
                }).should.be.exactly(true);
                done();
          }).onReject(function(err) {
            done(err);
          });
		});
		it('adds correct name filters', function(done) {
          competitorService.createCompetitors([
              {name:'Comp1', email:'Comp1@email.com', user:user}
              ,{name:'Comp2', email:'Comp2@email.com', user:user}
              ,{name:'Comp3', email:'Comp3@email.com', user:user}
            ]).then(function(result) {
                var query = Competitor.find();
                return competitorService.searchForDuplicateFilters([{name:'Comp1'},{name:'Comp2'}],query);
            }).then(function(query2) {
              return query2.exec();
            }).then(function(result) {
                result.length.should.be.exactly(2);
                result.some(function(res) {
                    return res.name==='Comp2';
                }).should.be.exactly(true);
                result.some(function(res) {
                    return res.email==='Comp1@email.com';
                }).should.be.exactly(true);
                done();
          }).onReject(function(err) {
            done(err);
          });

		});
		it('adds correct email & name filters', function(done) {
          competitorService.createCompetitors([
              {name:'Comp1', email:'Comp1@email.com', user:user}
              ,{name:'Comp2', email:'Comp2@email.com', user:user}
              ,{name:'Comp3', email:'Comp3@email.com', user:user}
            ]).then(function(result) {
                var query = Competitor.find();
                return competitorService.searchForDuplicateFilters([{name:'Comp1'},{email:'Comp3@email.com', name:'Comp3'}],query);
            }).then(function(query2) {
              return query2.exec();
            }).then(function(result) {
                result.length.should.be.exactly(2);
                result.some(function(res) {
                    return res.name==='Comp3';
                }).should.be.exactly(true);
                result.some(function(res) {
                    return res.email==='Comp1@email.com';
                }).should.be.exactly(true);
                done();
          }).onReject(function(err) {
            done(err);
          });

		});
	});

	describe('findCompetitorDuplicates', function() {
        it('separates duplicates into found and not found', function(done) {
            var competitorList = [
             {name:'C1', email:'C1@email.com'}
             ,{name:'C2', email:'C2@email.com'}
             ,{name:'C3', email:'C3@email.com'}
            ];
            var foundEntriesList = [
             {id:'id1', name:'C1', email:'C1@email.com'}
             ,{id:'id2', name:'C2', email:'C2@email.com'}
            ];

            var results = competitorService.findCompetitorDuplicates(competitorList, foundEntriesList);
            results.alreadyCreated.length.should.be.exactly(2);
            results.notCreated.length.should.be.exactly(1);
            results.alreadyCreated.some(function(res) {
              return res.id==='id1';
            }).should.be.exactly(true);
            results.alreadyCreated.some(function(res) {
              return res.id==='id2';
            }).should.be.exactly(true);
            results.notCreated.some(function(res) {
              return res.name==='C3';
            }).should.be.exactly(true);
            done();
        });
        it('separates named duplicates into found & Not found', function(done) {
         var competitorList = [
             {name:'C1'}
             ,{ email:'C2@email.com'}
             ,{name:'C3'}
             ,{name:'C4'}
            ];
            var foundEntriesList = [
             {id:'id1', name:'C1', email:''}
             ,{id:'id3', name:'C3'}
             ,{id:'id2', name:'C2', email:'C2@email.com'}
            ];

            var results = competitorService.findCompetitorDuplicates(competitorList, foundEntriesList);
            results.alreadyCreated.length.should.be.exactly(3);
            results.notCreated.length.should.be.exactly(1);
            results.alreadyCreated.some(function(res) {
              return res.id==='id1';
            }).should.be.exactly(true);
            results.alreadyCreated.some(function(res) {
              return res.id==='id2';
            }).should.be.exactly(true);
            results.alreadyCreated.some(function(res) {
              return res.id==='id3';
            }).should.be.exactly(true);
            results.notCreated.some(function(res) {
              return res.name==='C4';
            }).should.be.exactly(true);
            done();
        });
    });

	afterEach(function(done) {
        Tournament.remove().exec();
        Competitor.remove().exec();
        User.remove().exec();
		done();
	});
});
