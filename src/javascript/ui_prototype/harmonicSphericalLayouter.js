'use strict';

import _ from 'lodash';


class HarmonicSphericalLayouter {

	constructor(maxElements) {
		this.maxElements = maxElements;

		this.freeFields = [{
			x: 0,
			y: 0
		}]; //startPosition => (0, 0)
		this.blocked = []; //stores blocked fields
		this.numCubes = 0;
	}

	getNext(ID) {
		if (this.numCubes >= this.maxElements) {
			return undefined;
		}

		let blocked = this.blocked;
		let freeFields = this.freeFields;

		freeFields.sort(this.distanceFunction);
		const next = freeFields[0];

		/* add the surounding fields if possible as new free fields
		     _________________
		    |__1__|__2__|__3__|
		    |__4__|_____|__5__|
		    |__6__|__7__|__8__|
		*/
		this.tryAdd({
			x: next.x - 1,
			y: next.y + 1
		}); //1
		this.tryAdd({
			x: next.x,
			y: next.y + 1
		}); //2
		this.tryAdd({
			x: next.x + 1,
			y: next.y + 1
		}); //3
		this.tryAdd({
			x: next.x - 1,
			y: next.y
		}); //4
		this.tryAdd({
			x: next.x + 1,
			y: next.y
		}); //5
		this.tryAdd({
			x: next.x - 1,
			y: next.y - 1
		}); //6
		this.tryAdd({
			x: next.x,
			y: next.y - 1
		}); //7
		this.tryAdd({
			x: next.x + 1,
			y: next.y - 1
		}); //8

		//remove taken xy from free fields
		_.remove(this.freeFields, i => (i.x === next.x && i.y === next.y));
		//and add to blocked
		blocked.push({
			x: next.x,
			y: next.y,
			ID: ID
		});

		this.numCubes++;
		return next;
	}

	matchFunction(a, b) {
		return a.x === b.x && a.y === b.y;
	}

	tryAdd(field) {
		const mf = this.matchFunction;
		//if the field is already blocked or just in freeFields -> ignore
		if (_.find(this.blocked, i => mf(i, field)) === undefined &&
			_.find(this.freeFields, i => mf(i, field)) === undefined) {
			this.freeFields.push(field);
		}
	}

	distanceFunction(a, b) {
		const aX = Math.pow(a.x, 2);
		const aY = Math.pow(a.y, 2);
		const distanceA = Math.sqrt(aX + aY);

		const bX = Math.pow(b.x, 2);
		const bY = Math.pow(b.y, 2);
		const distanceB = Math.sqrt(bX + bY);

		return distanceA - distanceB;
	}

	setFree(ID) {
		const match = _.find(this.blocked, item => item.ID === ID);
		if(match === undefined) {
			return;
		}

		_.remove(this.blocked, item => item.ID === ID);
		this.freeFields.push( { x: match.x, y: match.y } );
	}

	getFree() {
		return this.freeFields;
	}
}

export default HarmonicSphericalLayouter;
