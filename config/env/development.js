'use strict';

module.exports = {
	db: 'mongodb://localhost/leagit-dev',
	app: {
		title: 'TOURNme Beta - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1575501486053857',
		clientSecret: process.env.FACEBOOK_SECRET || '04213ef2d073a16c5dbd361721efdf79',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: 'http://localhost:3000/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/linkedin/callback'
	}
};
