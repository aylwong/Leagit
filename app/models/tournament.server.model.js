'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Subdocument Matches Schema
 */
var MatchSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	},
		start_date: { type: String},
		end_date: { type: String},
		location: [{ type: String }],
		competitors: [{ type: String }],
		results: { type: String },
		description: { type: String },
		status: { type: String, enum: ['Pending', 'In Game', 'Done', 'Cancelled'], default:'Pending' },
});

/**
 * Tournament Schema
 */
var TournamentSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	},
	start_date: { type: String, required: false },
	end_date: { type: String, required: false },
	type: { type: String, required: true, enum: ['Ad Hoc', 'Round Robin', 'Joust', 'Elimination', 'Soft Elimination'] },
	matches: [MatchSchema],
	competitors: [{
		type: Schema.ObjectId,
		ref: 'Competitor'}],
	description: { type: String},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Tournament', TournamentSchema);
mongoose.model('Match', MatchSchema);
