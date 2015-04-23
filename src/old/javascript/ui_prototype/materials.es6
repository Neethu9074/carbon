'use strict';

import THREE from 'three';
import colors from './colors';
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
	color: colors.lightColor,
	map: textures.cubeContainerTexture
});

export const offlineMaterial = new THREE.ShaderMaterial({
	color: colors.ambientColor
});

export const cubeHostMaterial = new THREE.MeshPhongMaterial({
	color: colors.midColor,
	side: THREE.DoubleSide,
	transparent: true,
	opacity: 1,
	blending: THREE.NormalBlending,
	map: textures.cubeHostTexture,
	shininess: 5
});

export const collisonHighlightMaterial = new THREE.MeshLambertMaterial({
	color: colors.midColor
});

export const groundEffectMaterial = new THREE.MeshBasicMaterial({
	color: 0x888888,
	map: textures.groundEffectTexture,
	transparent: true,
	depthWrite: false
});

export const groundEffectMaterialError = new THREE.MeshBasicMaterial({
	color: colors.error,
	map: textures.groundEffectTexture,
	transparent: true,
	depthWrite: false
});

export const groundEffectMaterialWarning = new THREE.MeshBasicMaterial({
	color: colors.warning,
	map: textures.groundEffectTexture,
	transparent: true,
	depthWrite: false
});
