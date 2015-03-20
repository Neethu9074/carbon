'use strict';

import THREE from 'three.js';
import * as colors from './colors';
import * as textures from './textures';


export const groundMaterial = new THREE.MeshBasicMaterial({
	color: colors.groundColor,
	side: THREE.DoubleSide,
	map: textures.groundTexture,
	transparent: true,
	opacity: 1
});

export const cubeContainerMaterial = new THREE.MeshLambertMaterial({
	color: colors.lightBlue,
	map: textures.cubeContainerTexture
});

export const cubeHostMaterial = new THREE.MeshPhongMaterial({
	color: colors.midBlue,
	side: THREE.DoubleSide,
	transparent: true,
	opacity: 1,
	blending: THREE.NormalBlending,
	map: textures.cubeHostTexture,
	shininess: 5
});

export const collisonHighlightMaterial = new THREE.MeshBasicMaterial({
	color: colors.midBlue
});
