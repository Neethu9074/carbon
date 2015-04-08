'use strict';

import THREE from 'three.js';

import gridTexturePath from '../../images/grid.png';
import cubeTexturePath from '../../images/cube.png';
import containerTexturePath from '../../images/softwareCube.png';
import groundEffectTexturePath from '../../images/groundEffect.png';


//the repeated texture for the ground
export const groundTexture = ( function() {
	const texture = THREE.ImageUtils.loadTexture(gridTexturePath);
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(50, 50);
	texture.anisotropy = 16;
	return texture;
})();

//the texture for all server cubes
export const cubeHostTexture = ( function() {
	const texture = THREE.ImageUtils.loadTexture(cubeTexturePath);
	texture.anisotropy = 4;
	return texture;
})();

//the texture for all software cubes
export const cubeContainerTexture = ( function() {
	const texture = THREE.ImageUtils.loadTexture(containerTexturePath);
	texture.anisotropy = 4;
	return texture;
})();

//the texture for all software cubes
export const groundEffectTexture = ( function() {
	const texture = THREE.ImageUtils.loadTexture(groundEffectTexturePath);
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	return texture;
})();
