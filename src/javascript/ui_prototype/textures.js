'use strict';

import THREE from 'three.js';

import gridTexturePath from '../../images/grid.png';
import cubeTexturePath from '../../images/cube.png';
import containerTexturePath from '../../images/softwareCube.png';

import lavaTileTexturePath from '../../images/ghost.jpg';
import cloudTexturePath from '../../images/cloud.png';


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

export const ghostTexture1 = ( function() {
	var texture = THREE.ImageUtils.loadTexture('bundle/' + lavaTileTexturePath);
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(2, 2);
	return texture;
})();

export const ghostTexture2 = ( function() {
	var texture = THREE.ImageUtils.loadTexture('bundle/' + cloudTexturePath);
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(2, 2);
	return texture;
})();
