'use strict';

import THREE from 'three.js';

import * as geometries from '../geometries';
import * as materials from '../materials';

import AbstractMeshCreationFactory from './abstractMeshCreationFactory';

//singleton
let instance;
export function getInstance() {
	if (!instance) {
    instance = new TagFactory();
  }
  return instance;
}


class TagFactory extends AbstractMeshCreationFactory {

	constructor() {
		super();
	}

	//abstract addFragment method has to be implemented
	addFragment() {
		throw 'NOT IMPLEMENTED EXCEPTION';
	}

	//abstract rebuild method has to be implemented
	rebuild() {
		throw 'NOT IMPLEMENTED EXCEPTION';
	}
}

export default TagFactory;
