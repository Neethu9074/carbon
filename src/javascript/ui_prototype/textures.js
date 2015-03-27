'use strict';

import THREE from 'three.js';

import gridTexturePath from '../../images/grid.png';
import cubeTexturePath from '../../images/cube.png';
import containerTexturePath from '../../images/softwareCube.png';
import grundEffectTexturePath from '../../images/groundEffect.png';


//the repeated texture for the ground
export const groundTexture = ( function() {
	var texture = THREE.ImageUtils.loadTexture('bundle/' + gridTexturePath);
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(50, 50);
	texture.anisotropy = 16;
	return texture;
})();

//the texture for all server cubes
export const cubeHostTexture = ( function() {
	var texture = THREE.ImageUtils.loadTexture('bundle/' + cubeTexturePath);
	texture.anisotropy = 4;
	return texture;
})();

//the texture for all software cubes
export const cubeContainerTexture = ( function() {
	var texture = THREE.ImageUtils.loadTexture('bundle/' + containerTexturePath);
	texture.anisotropy = 4;
	return texture;
})();

//the texture for all software cubes
export const groundEffectTexture = ( function() {
	var texture = THREE.ImageUtils.loadTexture('bundle/' + grundEffectTexturePath);
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	return texture;
})();
