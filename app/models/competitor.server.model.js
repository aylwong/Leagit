'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Competitor Schema
 */
var CompetitorSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	}
	,name: {
		type: String,
		trim: true,
		required: 'Name cannot be blank'
	}
	,email: { type: String, 
		trim: true,
	}
	,description: { type: String 
	}
	,archived: { type: String
	  ,enum: ['Removed', 'Archived', 'Current']
	  ,default:'Current'
	}
	,user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
	,image: {
		type: String
		,trim:true
	}
	,links: [{ type: String }]
});

mongoose.model('Competitor', CompetitorSchema);
