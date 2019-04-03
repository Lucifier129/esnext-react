'use strict';

var Fastclick = require('fastclick');
module.exports = function injectTapEventPlugin() {
	var supportTouch = ('ontouchstart' in document);
	if (supportTouch) {
		Fastclick.attach(document.body);
	}
};