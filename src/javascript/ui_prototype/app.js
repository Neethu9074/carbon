'use strict';

import THREE from 'three.js';

import colors from './colors';
import ground from './sceneObjects/ground';

import rStats from '../lib/rStats';
import glStats from '../lib/rStats.extras';

class App {
  constructor() {
    //first of all -> bind methods
    this.bindMethods();

    this.time = Date.now();
    this.deltaTime = 0;
    this.timeSinceStarted = 0;

    //setup 3D scene
    this.setup3D();

    if(__DEV__) {
      this.setupStats();
    }

    this.setupEvents();
    this.update();
  }

  setup3D() {
    this.canvas = document.getElementById('WebGL');

    var width = window.innerWidth;
    var height = window.innerHeight;

    this.webGLRenderer = new THREE.WebGLRenderer();
    this.webGLRenderer.setClearColor(colors.renderClearColor, 1);
    this.webGLRenderer.setSize(width, height);

    //add webGLRenderer to dom element
    this.canvas.appendChild(this.webGLRenderer.domElement);

    this.scene = new THREE.Scene();

    //set the farplane as near as possible
    this.mainCamera = new THREE.PerspectiveCamera(60, width / height, 0.5, 700);
    this.mainCamera.position.set(0, 10, 0);
    this.mainCamera.lookAt(new THREE.Vector3(0, 0, 0));

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(colors.ambientColor);
    this.scene.add(ambientLight);

    //a collection to store all sceneObjects
    this.sceneObjects3D = [];

    this.sceneObjects3D.push(new ground.Ground(this));

    var cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 1));
    cube.position.x = 0.5;
    cube.position.z = -0.5;
    this.scene.add(cube);
  }



  exports.App.prototype.setupStats = function() {
    var glS = new glStats.glStats();
    var tS = new glStats.threeStats(this.webGLRenderer);
    var rS = new rStats.rStats({
      values: {
        frame: {
          caption: 'Total frame time (ms)',
          over: 16
        },
        fps: {
          caption: 'Framerate (FPS)',
          below: 30
        },
        calls: {
          caption: 'Calls (three.js)',
          over: 3000
        },
        raf: {
          caption: 'Time since last rAF (ms)'
        },
        rstats: {
          caption: 'rStats update (ms)'
        }
      },
      groups: [{
        caption: 'Framerate',
        values: ['fps', 'raf']
      }, {
        caption: 'Frame Budget',
        values: ['frame', 'texture', 'setup', 'render']
      }],
      plugins: [
        tS,
        glS
      ]
    });

    this.glStats = glS;
    this.rStats = rS;
  };

  exports.App.prototype.setupEvents = function() {
    var doc = document;
    window.addEventListener('resize', this.onWindowResize, false);
    doc.getElementById('newHostButton').onclick = this.addHost;
    doc.getElementById('newContainerButton').onclick = this.addRandomContainer;
    doc.getElementById('destroyCubeButton').onclick = this.removeCube;
    doc.getElementById('showWalkableButton').onclick = this.showWalkable;
    doc.getElementById('stackContainerButton').onclick = this.stackContainer;
    doc.getElementById('showInGrafanaButton').onclick = this.showInGrafana;
  };

  exports.App.prototype.onWindowResize = function() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    this.webGLRenderer.setSize( width, height );

    this.mainCamera.aspect = width / height;
    this.mainCamera.updateProjectionMatrix();
  };

  exports.App.prototype.bindMethods = function() {
    this.update = this.update.bind(this);
    this.bindMethods = this.bindMethods.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
  };

  exports.App.prototype.update = function() {
    requestAnimationFrame(this.update);

    if(__DEV__) {
      var rS = this.rStats;
      rS('frame').start();
      this.glStats.start();
      rS('frame').start();
      rS('rAF').tick();
      rS('FPS').frame();
      rS('updates').start();
    }

    this.animate();

    if(__DEV__) {
      rS('updates').end();
      rS('render').start();
    }

    this.render();

    if(__DEV__) {
      rS('render').end();
      rS('frame').end();
      rS().update();
    }
  };

  exports.App.prototype.animate = function() {
    this.calculateDeltaTime();
  };

  exports.App.prototype.calculateDeltaTime = function() {
    var timeNow = Date.now();
    this.deltaTime = (timeNow - this.time) / 1000; //in ms
    this.time = timeNow;
    this.timeSinceStarted += this.deltaTime;
  };

  render = function() {
    this.webGLRenderer.render(this.scene, this.mainCamera);
  }
}
