'use strict';

var THREE = require('three.js');
var colors = require('./colors');
var mControl = require('./controls/mouseControl');
var cube = require('./cube');
var gc = require('./groundSpaceControl2D');
var ground = require('./ground');
var zoom = require('./zoomLevel');

exports.Application = function Application() {
  this.container = document.getElementById('GLCanvas');
  this.sceneObjects3D = []; // all objects, added to the 3D scene
  this.collisionObjects = []; //all collision objects for coll-checking
  this.groundControl = new gc.GroundSpaceControl2D(100, 100);

  this.bindListeners();
  this.stats();
  this.initializeScene();

  //controller
  this.zoomIndex = 2;
  this.zoomLevel = zoom.zoomLevel[this.zoomIndex];
  this.mouseControl = new mControl.MouseControl(this);

  //events
  window.addEventListener('resize', this.onWindowResize, false);
  document.getElementById('newCubeButton').onclick = this.addRandomCube;

  this.animate();
};

//direction is 1 or -1, so the zoomIndex will be 0, 1, 2, ..., max array langth
exports.Application.prototype.zoom = function(direction) {
  this.zoomIndex -= direction;
  this.zoomIndex = Math.max(0,
    Math.min(this.zoomIndex, zoom.zoomLevel.length - 1));

  //set the new zoom Level
  this.zoomLevel = zoom.zoomLevel[this.zoomIndex];
};

exports.Application.prototype.addRandomCube = function() {
  var width = Math.floor(Math.random() * 3) + 1;
  var height = Math.floor(Math.random() * 3) + 1;
  var xy = this.groundControl.getNearestFreeField(width, height);
  this.addObject(new cube.Cube(xy.x, xy.y, width, height, 0.2));
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

  this.setup3DScene(width, height);
  this.setup2DScene(width, height);

  this.addObject(new ground.Ground(this));
};

exports.Application.prototype.setup2DScene = function(width, height) {

};

exports.Application.prototype.setup3DScene = function(width, height) {
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
    this.sceneObjects3D.push(obj);
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
  this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 20);
  this.camera.position.set(-3, 5, 3);
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  //pos: -3,3,3 -> lookAt 0,0,0 means 45 degrees looking angle to the center

  this.cameraTransform = new THREE.Object3D();
  //the angle must be the same as camera y angle
  //to get the right transformation when moving
  this.cameraTransform.rotateOnAxis(
    new THREE.Vector3(0, 1, 0), this.camera.rotation.y);

  // a debug axis to see, where camera is transformed with
  this.cameraTransform.add(new THREE.AxisHelper(0.1));

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

	//update LOD objects
	var cam = this.camera;
  this.scene.updateMatrixWorld();
  this.scene.traverse(function(object) {
    if (object instanceof THREE.LOD) {
      object.update(cam);
    }
  });

	//render the scene when all animations are updated
  this.render();

	//call this again
  requestAnimationFrame(this.animate);
};

exports.Application.prototype.calculateDeltaTime = function() {
  var timeNow = Date.now();
  this.deltaTime = (timeNow - this.time) / 1000;
  this.time = timeNow;
};
