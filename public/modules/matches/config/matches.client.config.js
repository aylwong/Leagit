'use strict';

// Configuring the Matches module
angular.module('matches').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Matches', 'matches');
	}
]);
