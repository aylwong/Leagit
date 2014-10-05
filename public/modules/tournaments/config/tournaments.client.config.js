'use strict';

// Configuring the Tournaments module
angular.module('tournaments').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tournaments', 'tournaments');
		Menus.addMenuItem('topbar', 'New Tournament', 'tournaments/create');
	}
]);
