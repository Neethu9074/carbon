'use strict';

exports.DegToRad = Math.PI / 180;

exports.guid = function() {
	// then to call it, plus stitch in '4' in the third group
	var guid = (s4() + s4() + '-' + s4() + '-4' + s4().substr(0, 3) + '-' +
		s4() + '-' + s4() + s4() + s4()).toLowerCase();

	return guid;
};

function s4() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
