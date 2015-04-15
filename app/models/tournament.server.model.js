'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/** 
 * Results?
 */

/**
 *  Result Schema
 */
var ResultSchema = new Schema({
	created: {
		type: Date,
		default: Date.now,
	}
	,key: {
		type: String
		,enum: ['Win', 'Loss', 'Tie', 'Other', 'TBD']
		,required: 'Result must have a key'
	}
	,name: {
		type: String
		,enum: ['Win', 'Loss', 'Tie', 'Other', 'TBD']
		,required: 'Result must have a name'
	}
	,points: { type: String, 
		Required: false
	}
	,description: { type: String,
		Required: false 
	}
	,competitors: [{ type: String }]
	,user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});


/**
 * Subdocument Matches Schema
 */
var MatchSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	}
	,name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	}
	,start_date: { type: String}
	,end_date: { type: String}
	,location: [{ type: String }]
	,competitors: [{ type: String }]
	,results: [ResultSchema]
	,description: { type: String }
	,status: { type: String, enum: ['Pending', 'In Game', 'Done', 'Cancelled'], default:'Pending' }
	,user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
	,round: {
		type: Number
	}
	,image: {
		type: String
		,trim:true
	}
	, links: [{ type: String }]
});

/**
 * Tournament Schema
 */
var TournamentSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	}
	,name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	}
	,start_date: { type: String, required: false }
	,end_date: { type: String, required: false }
	,type: { type: String, required: true, enum: ['Ad Hoc', 'Round Robin', 'Joust', 'Elimination', 'Soft Elimination'] }
	,viewable: {type: String
	  ,enum: ['Private', 'Public', 'Undisclosed']
	  }
	,matches: [MatchSchema]
	,competitors: [{
		type: Schema.ObjectId,
		ref: 'Competitor'}]
	,description: { type: String}
	,user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
	,image: {
		type: String
		,trim:true
	}
	, links: [{ type: String }]
});

mongoose.model('Tournament', TournamentSchema);
mongoose.model('Match', MatchSchema);

mongoose.model('Result', ResultSchema);
