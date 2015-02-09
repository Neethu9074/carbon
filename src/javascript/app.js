'use strict';

var THREE = require('three.js');
var colors = require('./colors');
var mControl = require('./controls/mouseControl');
var cube = require('./cube');

exports.Application = function Application() {
	this.container = document.getElementById('WebGLContainer');
	this.sceneObjects = []; // all objects, added to the scene
	this.collisionObjects = []; //all collision objects for coll-checking
	this.debug = true;

	this.bindListeners();
	this.stats();
	this.initializeScene();

	this.mouseControl = new mControl.MouseControl(this);
	window.addEventListener('resize', this.onWindowResize, false);

	document.getElementById('newCubeButton').onclick = this.addRandomCube;

	this.animate();
};

exports.Application.prototype.addRandomCube = function() {
	var x = Math.floor(Math.random() * 11);
	var y = Math.floor(Math.random() * 11);
	this.addObject(new cube.Cube(x, y, 1, 1, 0.2));
};

// we need to make sure, that 'this' doesn't get lost.
// we also only want to do this once
exports.Application.prototype.bindListeners = function() {
	this.onWindowResize = this.onWindowResize.bind(this);
	this.calculateDeltaTime = this.calculateDeltaTime.bind(this);
	this.animate = this.animate.bind(this);
	this.render = this.render.bind(this);
	this.addRandomCube = this.addRandomCube.bind(this);
};

exports.Application.prototype.initializeScene = function() {
	var width = window.innerWidth;
	var height = window.innerHeight;

	this.time = Date.now();
	this.deltaTime = 0;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.Fog(colors.fogColor, 2, 20);

	this.createCamera(width, height);
	this.createLights();

	this.renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	this.renderer.setClearColor(colors.fogColor, 1);
	this.renderer.setSize(width, height);

	//add renderer to dom element
	this.container.appendChild(this.renderer.domElement);
};

exports.Application.prototype.addObject = function(obj) {
	//getMesh is defined in superclass SceneObject
	//each object has to set this.setMesh(some mesh or other scene object)
	//to get added to the scene
	var mesh = obj.getMesh();
	var collisionMesh = obj.getCollisionMesh();
	if (collisionMesh !== undefined) {
		this.collisionObjects.push(collisionMesh);
	}
	if (mesh !== undefined) {
		//TODO check whether the objects are inserted into other collections
		this.scene.add(mesh);
		this.sceneObjects.push(obj);
	}
};

exports.Application.prototype.createLights = function() {
	// add subtle ambient lighting
	var ambientLight = new THREE.AmbientLight(colors.ambientColor);
	this.scene.add(ambientLight);

	var directionalLight = new THREE.DirectionalLight(0x00ffff, 0.8);
	directionalLight.position.set(1, 1, -1);
	this.scene.add(directionalLight);
};

exports.Application.prototype.createCamera = function(width, height) {
	//set the farplane as near as possible
	this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 20);
	this.camera.position.set(-3, 3, 3);
	this.camera.lookAt(new THREE.Vector3(0, 0, 0));
	//pos: -3,3,3 -> lookAt 0,0,0 means 45 degrees looking angle to the center

	this.cameraTransform = new THREE.Object3D();
	//the angle must be the same as camera y angle
	//to get the right transformation when moving
	this.cameraTransform.rotateOnAxis(
		new THREE.Vector3(0, 1, 0), this.camera.rotation.y);

	if (this.debug) {
		this.cameraTransform.add(new THREE.AxisHelper(0.1));
	}

	this.scene.add(this.cameraTransform);
};

exports.Application.prototype.onWindowResize = function() {
	var width = this.container.offsetWidth;
	var height = this.container.offsetHeight;
	var aspect = width / height;
	this.camera.aspect = aspect;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize(width, height);
};

exports.Application.prototype.stats = function() {
	//TODO replace with webpack config
	this.stats = new Stats();
	this.stats.domElement.style.position = 'absolute';
	this.container.appendChild(this.stats.domElement);
};

exports.Application.prototype.render = function() {
	this.renderer.render(this.scene, this.camera);
};

exports.Application.prototype.animate = function() {
	this.calculateDeltaTime();
	this.stats.update();
	this.mouseControl.update(this.deltaTime);

	this.render();

	requestAnimationFrame(this.animate);
};

exports.Application.prototype.calculateDeltaTime = function() {
	var timeNow = Date.now();
	this.deltaTime = (timeNow - this.time) / 1000;
	this.time = timeNow;
};
