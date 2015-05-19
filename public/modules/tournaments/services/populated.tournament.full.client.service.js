'use strict';

angular.module('tournaments')
  .factory('PopulatedTournament', ['$q', 'Competitors','TournamentResults','Tournaments','Matches','CoreHelper', 'MatchHelper','_service','PublicCompetitors'
  ,function( $q, Competitors, TResults,Tournaments,Matches,CHelper,MHelper,_s,PublicCompetitors) {
// Load Tournament with competitors loaded, and loaded into matches.
// Todo: load into rounds as well?

  var loadPublicTournamentDetails = function(tournamentId) {
    return loadTournamentDetails(tournamentId,PublicCompetitors);
  };

  var loadTournamentDetails = function(tournamentId,competitorService) {
  // Initialise a create Ad Hoc Tournament
    competitorService = competitorService? competitorService: Competitors;

    var tournamentPromise = findTournament(tournamentId,competitorService);

    return tournamentPromise.then(function(results) {
      var new_result = {};
      new_result.tournament = results.tournament;
      new_result.competitors = results.competitors;

	  new_result.tournament.competitors_full = CHelper.idsToList(new_result.tournament.competitors, results.competitors);

	  new_result.tournament.matches.forEach(function(match) {
	    match.competitors_full = CHelper.idsToList(match.competitors, results.competitors);
	    match.competitors = CHelper.idsToList(match.competitors, results.competitors);
        match.results.forEach(function(result) {
          result.competitors_full = CHelper.idsToList(result.competitors, results.competitors);
        });
	  });

      return new_result;
    });
  };

  // Find Tournament.
  var findTournament = function(tournamentId, competitorService) {
    var tournamentResult;
    var promise = Tournaments.get({ tournamentId: tournamentId}).$promise
      .then(function(tournament) {
        tournamentResult = tournament;
        var competitorList =tournament.competitors;

        return load_competitors(competitorList,competitorService).$promise;
      })
      .then(function(competitors) {
        return({tournament: tournamentResult,competitors: competitors});
      });

    return promise;
  };

  // Add competitor list (probably from tournament load
  var load_competitors = function(competitorIds, competitorService) {
    // load competitors based on tournamentId
    var competitorsString = competitorIds.join();
    var competitorsQuery = competitorService.query( {ids:competitorsString});

    return competitorsQuery;
  };

  // Helper Functions
  // load Match Result Lists
  var loadMatchSelectResultLists = function(match) {
    MHelper.initMatchSelectResult(match);
    MHelper.initMatchResultSelectLists(match);
  };

  return {
    loadTournamentDetails: loadTournamentDetails
    ,loadPublicTournamentDetails: loadPublicTournamentDetails
  };
}
]);

