'use strict';

// Configuring the Competitors module
angular.module('competitors').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Competitors', 'competitors');
	}
]);
