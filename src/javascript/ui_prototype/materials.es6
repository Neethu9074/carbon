'use strict';

import THREE from 'three.js';
import * as colors from './colors';
import * as textures from './textures';


export const groundMaterial = new THREE.MeshBasicMaterial({
	color: colors.groundColor,
	side: THREE.DoubleSide,
	map: textures.groundTexture,
	transparent: true,
	depthWrite: false,
	opacity: 1
});

export const cubeContainerMaterial = new THREE.MeshLambertMaterial({
	color: colors.lightBlue,
	map: textures.cubeContainerTexture
});

export const offlineMaterial = new THREE.ShaderMaterial({
	color: colors.ghostGrey
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

export const groundEffectMaterial = new THREE.MeshBasicMaterial({
	color: 0x888888,
	map: textures.groundEffectTexture,
	transparent: true,
	depthWrite: false
});

export const groundEffectMaterialError = new THREE.MeshBasicMaterial({
	color: colors.errorRed,
	map: textures.groundEffectTexture,
	transparent: true,
	depthWrite: false
});

export const groundEffectMaterialWarning = new THREE.MeshBasicMaterial({
	color: colors.warningYellow,
	map: textures.groundEffectTexture,
	transparent: true,
	depthWrite: false
});
