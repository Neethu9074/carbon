'use strict';

var THREE = require('three.js');
var colors = require('./colors');
var math = require('./math');
var mControl = require('./controls/mouseControl');

exports.Application = function Application() {
	this.container = document.getElementById('WebGLContainer');
	this.sceneObjects = [];
	this.debug = true;

	this.bindListeners();
	this.stats();
	this.initializeScene();

	this.mouseControl = new mControl.MouseControl(this);
	window.addEventListener('resize', this.onWindowResize, false);

	this.animate();
};

// we need to make sure, that 'this' doesn't get lost. We also only want to do this once
exports.Application.prototype.bindListeners = function() {
	this.onWindowResize = this.onWindowResize.bind(this);
	this.calculateDeltaTime = this.calculateDeltaTime.bind(this);
	this.animate = this.animate.bind(this);
	this.render = this.render.bind(this);
};

exports.Application.prototype.initializeScene = function() {
	var width = window.innerWidth;
	var height = window.innerHeight;

	this.time = Date.now();
	this.deltaTime = 0;

	this.scene = new THREE.Scene();

	this.createCamera(width, height);
	this.createLights();

	this.renderer = new THREE.WebGLRenderer({
		antialias: false
	});
	this.renderer.setClearColor(0x000000, 1);
	this.renderer.setSize(width, height);
	this.container.appendChild(this.renderer.domElement);

	if (this.debug) {
		var object = new THREE.AxisHelper(10);
		object.position.set(0, 0, 0);
		this.scene.add(object);
	}
};

exports.Application.prototype.addObject = function(obj) {
	var mesh = obj.getMesh();
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
};

exports.Application.prototype.createCamera = function(width, height) {
	this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 100);
	this.camera.position.set(-3, 3, 3);
	this.camera.lookAt(new THREE.Vector3(0, 0, 0));

	this.cameraTransform = new THREE.Object3D();
	this.cameraTransform.rotateOnAxis(
		new THREE.Vector3(0, 1, 0), -45 * math.DegToRad);

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
