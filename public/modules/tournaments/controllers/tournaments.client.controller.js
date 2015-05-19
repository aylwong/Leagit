'use strict';

angular.module('tournaments')
    .controller('TournamentsController', ['$scope', '$stateParams', '$location', '$q', 'Authentication', 'Tournaments', 'Competitors','TournamentResults','TournamentHelper','CoreHelper','CompetitorHelper','_service'
  ,function($scope, $stateParams, $location, $q, Authentication, Tournaments, Competitors, TResults,THelper,CHelper,CompetitorHelper,_s) {
  // add auth
  $scope.authentication = Authentication;

  // scope namespaces
  $scope.tournaments = {};
  $scope.tournaments.tournament={};
  $scope.competitors = {};
  $scope.view_state = {};

  // init start dates for tourney (not yet loaded)
  $scope.tournaments.tournament.start_date = new Date().toString();
  $scope.tournaments.tournament.end_date = new Date().addDays(1).toString();

  // temp available types (more detail later)
  $scope.tournaments.available_types = [{'id': 'Ad Hoc', 'name': 'Ad Hoc'
  }, {
    'id': 'Round Robin', 'name': 'Round Robin'
  }, {
    'id': 'Swiss', 'name': 'Swiss'
  }];

  $scope.tournaments.available_results = TResults.results;

  // available competitors for adding to matches?
  $scope.competitors.available_competitors = [];

  // available match competitors
  $scope.tournaments.match_competitors = [];
  $scope.tournaments.selected_competitors=[];
  $scope.tournaments.selectable_competitors=[];

  // HANDLERS

  // add match to the tournament
  $scope.add_new_match = function(new_match) {
    var match = THelper.createNewMatch(new_match,$scope.competitors.match_competitors);

    $scope.tournaments.tournament.matches.push(match);
  };

  // remove match from tournament, based on index
  $scope.remove_match = function (match) {
    THelper.removeMatchFromTournament(match,$scope.tournaments.tournament);

  };

  // view state
  // toggles for view (whether to show new match or not)
  $scope.view_state.show_new_match = true;

  $scope.toggle_new_match = function() {
    $scope.view_state.show_new_match = $scope.view_state.show_new_match !== true;
  };

  $scope.massCompetitorsAdded = function(allCompetitors,response) {
    CHelper.mergeArrays($scope.tournaments.selected_competitors, allCompetitors, CHelper.sameIdStrings);
    allCompetitors.forEach(function(sCompetitor) {
      CHelper.removeEntryFromList(sCompetitor, $scope.tournaments.selectable_competitors);
    });
  };

  $scope.getPublicViewLink = function(tournament) {
    var host = $location.host();
    var port = $location.port()===80 || $location.port() ===443 ? '': ':'.concat($location.port());
    var id='';
    if(tournament && CHelper.hasId(tournament)) {
      id = CHelper.getId(tournament);
    }
    var link = 'http://'.concat(host,port,'/tournaments/',id.toString(),'/public');
    return link;
  };

  // INIT
  // This is competitor INIT stuff:
  $scope.competitor_init = function(competitorIds) {
    // getting available competitors (defered until loaded?)
    var searchParameters = {};

    if(competitorIds) {
      searchParameters.ids = competitorIds.join();
    }

    // Get all competitors available for this Tournament
    var all_competitors = Competitors.query(searchParameters).$promise;

    // function - load competitors after initialisation.
    return all_competitors.then( function(list) {
      $scope.competitors.available_competitors = THelper.competitorsToSelectList(list);

      // Competitor list
      return list;
    });
  };


  // init multiple tournaments
  $scope.tournaments.init_tournaments = function(tournaments) {
    var tournaments_complete = $q.defer();

    // get tournaments
    $scope.tournaments.list = Tournaments.query();

    var competitors_loaded = $scope.competitor_init(); 
    var tournaments_loaded = $scope.tournaments.list.$promise;

    // when both list and competitors loaded, then 
    $q.all([competitors_loaded, tournaments_loaded]).then( function(values) {
      var available_competitors = values[0];
      // set value to competitors
      $scope.tournaments.list.forEach(function(tournament) {
	$scope.tournaments.loadCompetitorsIntoTournament(tournament,available_competitors);
      });
    });
  };

  // Load Competitors into Tournament
  // tournament.competitors is loaded into from competitors
  $scope.tournaments.loadCompetitorsIntoTournament = function(tournament, competitors) {
    // match competitors - this should be competitors that 
    var tournament_competitors = CHelper.idsToList(tournament.competitors,competitors);
 
    // filter to select list
    tournament.selected_competitors = THelper.competitorsToSelectList(tournament_competitors);
  
    angular.forEach(tournament.matches, function(val, key)  {
      // populate limited info of competitors to Match
      THelper.addCompetitorsToMatch(val,tournament.selected_competitors);
    });
  };

  // init tournament based on initial tournament
  // Test - Init a single Tournament
  $scope.tournaments.init_tournament = function(tournamentId,competitors_loaded) {
    var tournament_loaded =  Tournaments.get({
      tournamentId: $stateParams.tournamentId
    }).$promise;

    tournament_loaded.then(function(tournament) {
      $scope.tournaments.tournament=tournament;
    });

    $scope.competitors.match_competitors=[];
    var tournament_complete = $q.defer();

    // When both tournament and competitors are loaded, then combine competitors into tournament
    $q.all([competitors_loaded,tournament_loaded]).then(function(results) {
      var competitors = results[0];
      var tournament = results[1];

      $scope.tournaments.loadCompetitorsIntoTournament(tournament,competitors);
      // load tournaments into competitors list
      $scope.tournaments.selected_competitors = CHelper.idsToList(tournament.competitors,competitors);
      tournament.competitors_full = CHelper.idsToList(tournament.competitors,competitors);

      $scope.tournaments.selectable_competitors =CompetitorHelper.selectableCompetitors(competitors);

      // All competitors for matches starts unchecked 
      tournament_complete.resolve(tournament);
    });

    return tournament_complete.promise;
  };

  // CALLABLE FUNCTIONS
  // function create a new tournament
  $scope.create = function(tournament,bounceLink) {
    bounceLink = bounceLink ? bounceLink : createNextLink;

    // if no matches or competitors, return as empty array
    if(!tournament.matches) {
      tournament.matches = [];
    } 

    var selectedCompetitorsIds = CHelper.listToIds($scope.tournaments.selected_competitors);

    if(!selectedCompetitorsIds) {
      tournament.competitors = [];
    } else {
      tournament.competitors = selectedCompetitorsIds;
    } 

    var newTournament = new Tournaments({
      name: tournament.name
      ,start_date: tournament.start_date.toString()
      ,end_date: tournament.end_date.toString()
      ,type: tournament.type
      ,matches: tournament.matches
      ,competitors: tournament.competitors
      ,description: tournament.description
    });

    newTournament.$save(function(response) {
        bounceCreatedLocation([response._id]);
	    $location.url(CHelper.stringSubstitute(bounceLink,[response._id]));
      }, function(errorResponse) {
	    $scope.error = errorResponse.data.message;
    });
  };

  // function remove a tournament
  $scope.remove = function(tournament,bounceLink) {
    bounceLink = bounceLink ? bounceLink : 'tournaments';
    if (tournament) {
      tournament.$remove();

      for (var i in $scope.tournaments.list) {
        if ($scope.tournaments.list[i] === tournament) {
   	  $scope.tournaments.list.splice(i, 1);
	}
      }
    } else {
      $scope.tournaments.tournament.$remove(function() {
        $location.path(bounceLink);
      });
    }
  };

  // function 
  // update tournament.
  $scope.update = function(tournament, bounceLink) {
    // turns the selected competitors into a list of ids
    tournament.competitors=CHelper.listToIds($scope.tournaments.selected_competitors);

    // clean match competitors.
    angular.forEach($scope.tournaments.tournament.matches, function(value,key) {
      // turn selected competitors into list of ids
      value.competitors = THelper.getSelectedCompetitorsAsIds(value.competitors_list);
    });
			
    tournament.$update(function() {
      bounceLocation([tournament._id],$scope.nextButton);
    }, function(errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  };

  $scope.updateSpecial = function(tournament, bounceLink) {
    bounceLink = bounceLink ? bounceLink : 'tournaments/{0}';
    
    tournament.$update(function() {
      bounceLocation([tournament._id],$scope.nextButton);
    }, function(errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  };

  $scope.find = function() {
    $scope.tournaments.init_tournaments();
  };

  $scope.initTournamentList = function() {
    $scope.find();
  };

  $scope.initAddCompetitorsToTournament = function() {
    $scope.nextButton = loadNextButton($location.search());
    $scope.findOne();
  };

  $scope.initTournamentView = function() {
    $scope.showRemove = false;
    $scope.findOne();
    loadFullMatchCompetitorsForTournament($scope.tournaments.tournament_complete);
  };

  var loadFullMatchCompetitorsForTournament = function(tournamentLoadedPromise) {
    return tournamentLoadedPromise.then(function() {
      var tournament = $scope.tournaments.tournament;

      tournament.matches.forEach(function(match) {
        match.competitors = CHelper.idsToList(match.competitors,tournament.competitors_full);
      });
    });
  };

  $scope.initTournamentEdit = function() {
    $scope.nextButton = loadNextButton($location.search());
    $scope.findOne();
  };

  $scope.initTournamentCreate = function() {
    var competitorPromise = $scope.competitor_init();

    competitorPromise.then(function(competitors) {
     // filter competitors for archiving.
      $scope.tournaments.selectable_competitors =THelper.selectableCompetitors(competitors);
    });
  };

  $scope.initNextButtons = function( ) {
    $scope.nextButton = loadNextButton($location.search());
  };

  $scope.findOne = function() {
    // load all competitors - as competitors grows, will probably have to load after initial load of tournaments, and filter for competitors only of the tournament
    $scope.competitors.competitors_complete = $scope.competitor_init();
    $scope.tournaments.tournament = [];
    $scope.tournaments.tournament_complete = $scope.tournaments.init_tournament($scope.tournamentId,$scope.competitors.competitors_complete);
  };

  $scope.getBackButtonUrl = function(id) {
    var nextButton = $scope.nextButton;
    var path = $scope.nextButton.back.link;
    var next, back;
    var backUrlPart;
    if(nextButton.back.list.length>0) {
      var current = nextButton.back.list[nextButton.back.list.length-1];
      next = [current].concat(nextButton.next.list).join(',');
      if(nextButton.back.list.length>1) {
        back = nextButton.back.list.slice(0,nextButton.back.list.length-1).join(',');
      } else {
        back = null; 
      }
    } else {
      next = null;
      back = null;
    }
    var result;
    var paramsResultPart;
    if(back!== null) {
      paramsResultPart='?next='.concat(next,'&back=',back);
    }
    if(back===null && next === null) {
      paramsResultPart='';
    }

    result = '/#!'.concat(CHelper.stringSubstitute(path,[id]),paramsResultPart);
    return result;
  };

  var bounceCreatedLocation = function(ids) {
    var createNextLink = '/tournaments/{0}/addcompetitors';
    $location.search('next','createMatches,view');
    $location.search('back','edit,addCompetitors');
    $location.path(CHelper.stringSubstitute(createNextLink,ids));
  };

  var bounceBackLocation = function(ids,nextButton) {
    if(nextButton) {
      if(nextButton.back.list && nextButton.back.list[0]) {
        var currentNext = nextButton.back.list.splice(0,1);
        if(currentNext==='view' || nextButton.next.list.length===0) {
          $location.search('next', null);
          $location.search('back', null);
        } else {
          if(nextButton.next.list.length>0) {
            $location.search('next', nextButton.next.list.join(','));
          } else {
            $location.search('next', null);
          }
          nextButton.back.list.push(currentNext);
          $location.search('back',nextButton.back.list.join(','));
        }
      }

      if(nextButton.next.link) {
        $location.path(CHelper.stringSubstitute(nextButton.next.link,ids));
      }
    }
  };

  var bounceLocation = function(ids, nextButton) {
    if(nextButton) {
      if(nextButton.next.list && nextButton.next.list[0]) {
        var currentNext = nextButton.next.list.splice(0,1);
        if(currentNext==='view' || nextButton.next.list.length===0) {
          $location.search('next', null);
          $location.search('back', null);
        } else {
          if(nextButton.next.list.length>0) {
            $location.search('next', nextButton.next.list.join(','));
          } else {
            $location.search('next', null);
          }
          nextButton.back.list.push(currentNext);
          $location.search('back',nextButton.back.list.join(','));
        }
      }

      if(nextButton.next.link) {
        $location.path(CHelper.stringSubstitute(nextButton.next.link,ids));
      }
    }
  };

  var nextLinks = [
    {key: 'addCompetitors', text:'Add Competitors', link:'/tournaments/{0}/addcompetitors'}
    ,{key: 'createMatches', text:'Create Matches', link:'/tournaments/{0}/createtournamentmatches'}
    ,{key: 'view', text:'Done', link:'/tournaments/{0}',done:true}
    ,{key: 'edit', text:'Edit Tournament', link:'/tournaments/{0}/edit'}
    ];

  var createNextLink = '/tournaments/{0}/addcompetitors?next=createMatches,view&back=edit,addCompetitors';

  var loadNextButton = function(urlParams) {
    var nextButton = {next:{list:[]},back:{list:[]}};
    var useDefault = false;
    var nextLinkInfo, backLinkInfo;

    if($location.search().next) {
      var urlNext = $location.search().next;
      var nextArray = $location.search().next.split(',');
      nextButton.next.list = nextArray;

      if(nextArray[0]) {
        nextLinkInfo =_s.find(nextLinks,function(link) {
          return link.key === nextArray[0];
        });
      }
    }

    if(nextLinkInfo) {
      nextButton.next.text = nextLinkInfo.done ? 'Done': 'Next';
      nextButton.next.done = true;
      nextButton.next.link = nextLinkInfo.link;
    } else {
      nextButton.next.text = 'Update';
      nextButton.next.link = '/tournaments/{0}';
    }

    if($location.search().back) {
      var backArray = $location.search().back.split(',');
      nextButton.back.list = backArray;

      if(backArray.length>1) {
        backLinkInfo =_s.find(nextLinks,function(link) {
          return link.key === backArray[backArray.length-2];
        });
      } else if(backArray.length===1) {
        backLinkInfo =_s.find(nextLinks,function(link) {
          return link.key === backArray[0];
        });
        nextButton.back.first=true;
      }
    } 
    
    if (backLinkInfo) {
      nextButton.back.text = 'Back';
      nextButton.back.link = backLinkInfo.link;
    } else {
      nextButton.back.text = 'Back';
      nextButton.back.link = '/tournaments/{0}';
    }

    $scope.nextButton = nextButton;

    return nextButton;
  };
}
]);

