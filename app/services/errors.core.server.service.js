'use strict';

/**
 * Module dependencies.
 */
//var example = require('example')

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Match already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	if(message==='') {
		message = 'Something went wrong (and no error code)';
	}

	return message;
};

exports.getErrorMessage = getErrorMessage;

// Error send
// creates a function that sends the error code using the passed in res
exports.sendError = function(res) {
	return function(err) {
	  console.log(err); 
		res.send(400, {
		message: getErrorMessage(err)
		});
	};
};
