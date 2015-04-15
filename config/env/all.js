'use strict';

module.exports = {
	app: {
		title: 'Leagit',
		description: 'League Organization App',
		keywords: 'League, Organization, App, Mean, Tournament'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
                                 'public/lib/foundation/css/foundation.css',
                                 'public/lib/foundation/css/normalize.css',
				 'public/lib/ngQuickDate/dist/ng-quick-date.css',
				 'public/lib/isteven-angular-multiselect/angular-multiselect.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js',  
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
                                'public/lib/jquery/dist/jquery.js',
                                'public/lib/foundation/js/foundation.js',
                                'public/lib/angular-foundation/mm-foundation.js',
                                'public/lib/ngQuickDate/dist/ng-quick-date.js',
                                'public/lib/sugar/release/sugar-full.development.js',
				'public/lib/isteven-angular-multiselect/angular-multi-select.js',
				'public/lib/lodash/lodash.js'

			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
