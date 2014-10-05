'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 *  Result Schema
 */
var ResultSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	type: {
		type: String,
		enum: ['Win', 'Loss', 'Tie', 'Other']
	},
	points: { type: String, 
		Required: false
	},
	Description: { type: String 
	},
	// User that created
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Result', ResultSchema);
