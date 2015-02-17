'use strict';

var THREE = require('three.js');
var sceneObj = require('../sceneObject');

var vertexShader = require('../shader/risingParticlesVertexShader');
var fragmentShader = require('../shader/risingParticlesFragmentShader');

exports.RisingParticles = function RisingParticles(positions) {
	this.init();

	this.uniforms = {
		amplitude: {
			type: 'f',
			value: 1.0
		}
	};
  var pointCloud = createPointCloud(this.uniforms, positions);

  this.setMesh(pointCloud);
  this.registerForUpdate();
};

//inherence from SceneObject
exports.RisingParticles.prototype = new sceneObj.SceneObject();
exports.RisingParticles.prototype.constructor = exports.RisingParticles;

function createPointCloud(uniforms, positions){
	var geometry = new THREE.BufferGeometry();
	var geoPos = new Float32Array( positions.length * 3 );

	var index = 0;
	for (var i = 0; i < positions.length; i++) {
		var position = positions[i];
		geoPos[ index ] = position[0];
		geoPos[ index + 1 ] = Math.random() * 10;
		geoPos[ index + 2 ] = -position[1];

		index += 3;
	}

	geometry.addAttribute( 'position', new THREE.BufferAttribute(geoPos, 3));

	var material = createMaterial(uniforms);
	var particleSystem = new THREE.PointCloud( geometry, material );
	particleSystem.position.set(-2.5, 0, 2.5);
	return particleSystem;
}

function createMaterial(uniforms){
	var shaderMaterial =
		new THREE.ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: uniforms,
			transparent: true
		});

	return shaderMaterial;
}

exports.RisingParticles.prototype.update = function(app){
  var dTime = app.deltaTime;
	var maxHeight = 5;
	var uniforms = this.uniforms;

	uniforms.amplitude.value += 1 * dTime;
	if(uniforms.amplitude.value > maxHeight){
		uniforms.amplitude.value = 0;
	}
};
