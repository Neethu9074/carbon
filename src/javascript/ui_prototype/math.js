'use strict';

export const DegToRad = Math.PI / 180;
export const RadToDeg = 180 / Math.PI;

export function guid() {
	// then to call it, plus stitch in '4' in the third group
	var guidTemp = (s4() + s4() + '-' + s4() + '-4' + s4().substr(0, 3) + '-' +
		s4() + '-' + s4() + s4() + s4()).toLowerCase();

	return guidTemp;
}

function s4() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
