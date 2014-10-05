'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Location Schema
 */
var LocationSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		trim: true,
		required: 'Name cannot be blank'
	},
	address: { type: String, 
		trim: true,
		required: false
	},
	Description: { type: String 
	},
	// User that created
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Location', LocationSchema);
