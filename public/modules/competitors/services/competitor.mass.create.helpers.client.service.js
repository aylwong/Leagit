'use strict';

//Competitors service used for communicating with the competitors REST endpoints
angular.module('competitors').factory('CompetitorMassCreateHelper', ['CoreHelper','Competitors','_service', function(CHelper,Competitors,_s) {

// Examples of email chain:
//Amy Lim <amy.e.lim@gmail.com>, Alan Wong <alanyinglongwong@gmail.com>, Felix Lo <sedul.lo@gmail.com>, Idy Chiu <idy.chiu@gmail.com>, Jessica Li <jessi.li@gmail.com>, Brandon Andre <brandonkandre@gmail.com>

    // Splits a string that is delimited like an email list into names and emails.
  var splitEmailList = function (emailList) {
    var competitorList = [];
    var emailSplit = /(?:"([^"]+)")? ?<?(.*?@[^>,]+)>?,? ?/g;
    var emailEntries = emailList.split(emailSplit);
    var parseString = emailList;
    var quote='"';
    var split=',';
    var openEmail = '<';
    var closeEmail = '>';
    var atSign='@';
    var searchKeys = [];
    searchKeys.push({search:quote, index:-1});
    searchKeys.push({search:openEmail, index:-1});
    searchKeys.push({search:split, index:-1});

    var nextPerson={};
    var personList = [];
    while(parseString.length>0) {
      var nextKey = getFirstFoundKey(parseString,searchKeys);
      if (nextKey && nextKey.search === quote) {
        // look for next quote.
        var previousQuoteToken = parseString.substr(0,nextKey.index);
         parseString = parseString.substr(nextKey.index);
        var quoteToken = parseString.substr(0,quote.length);
         parseString = parseString.substr(quote.length);
        var endQuoteIndex = parseString.indexOf(quote);
        var nameToken = parseString.substr(0,endQuoteIndex);
         parseString = parseString.substr(endQuoteIndex);
         parseString = parseString.substr(quote.length);
        nextPerson.name = nameToken.trim();
      } else if (nextKey && nextKey.search === openEmail) {
        var previousOpenEmailToken = parseString.substr(0,nextKey.index);
         parseString = parseString.substr(nextKey.index);
        var openEmailToken = parseString.substr(0,openEmail.length);
         parseString = parseString.substr(openEmail.length);
        var closeEmailIndex = parseString.indexOf(closeEmail);
        var emailToken = parseString.substr(0,closeEmailIndex);
        parseString = parseString.substr(closeEmailIndex);
        if(previousOpenEmailToken.length>0 && !nextPerson.name) {
          nextPerson.name = previousOpenEmailToken.trim();
        }
        nextPerson.email = emailToken.trim();
      } else if (nextKey && nextKey.search === split) {
        // end Split
        var previousSplitToken = parseString.substr(0,nextKey.index);
         parseString = parseString.substr(nextKey.index);
        var splitToken = parseString.substr(0,split.length);
         parseString = parseString.substr(split.length);

        if(!nextPerson.name) {
          nextPerson.name = previousSplitToken.trim();
        }

        if (!nextPerson.email && nextPerson.name.indexOf(atSign)>=0) {
          nextPerson.email = nextPerson.name;
        }

        personList.push(nextPerson);
        nextPerson = {};
      } else {
        var currentToken = parseString;
         parseString = '';
        if(!nextPerson.name) {
          nextPerson.name = currentToken.trim();
        }

        if (!nextPerson.email && nextPerson.name.indexOf(atSign)>=0) {
          nextPerson.email = currentToken.trim();
        }

        personList.push(nextPerson);
        nextPerson = {};
      } 
    }

    return convertPersonListToMassCompetitorList(personList);
  };

  var convertPersonListToMassCompetitorList = function(personList) {
    return personList.map(function(person) {
      return {
        name:person.name
        , email: person.email
      };
    });
  };

  var getFirstFoundKey = function(searchString, keys) {
    var firstKey;

    keys.forEach(function(searchKey) {
      searchKey.index = searchString.indexOf(searchKey.search);
      if(searchKey.index !==-1 && (!firstKey || searchKey.index < firstKey.index)) {
        firstKey = searchKey;
      }
    });
    
    return firstKey;
  };

    return {
	  splitEmailList: splitEmailList
	};
}]);

