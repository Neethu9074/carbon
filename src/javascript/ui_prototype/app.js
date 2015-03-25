'use strict';

import './app.less'

import THREE from 'three.js';
import '../lib/CSS3DRenderer';
import '../lib/Octree';

import * as colors from './colors';
import * as materials from './materials';
import * as geometries from './geometries';
import Ground from './sceneObjects/ground';
import Container from './sceneObjects/hostCube';
import HostDataProvider from './dataProvider/hostDataProvider';

import MouseControls from './controls/mouseCameraController';
import Layouter from './layouterContainer';

import rStats from '../lib/rStats';
import glStats from '../lib/rStats.extras';

import _ from 'lodash';

//logging
import {
  createLogger
}
from '../log';
const logger = createLogger('app.js');


class App {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    //first of all -> bind methods
    this.bindMethods();

    //time properties
    this.time = Date.now();
    this.deltaTime = 0;
    this.timeSinceStarted = 0;

    //zoom properties
    this.showHostDetailsDistance = 50;
    this.switchHostDetails = false;
    this.showHostDetails = false;

    //a collection to store all objects that need an update call on update
    this.updates = [];

    //setup 3D stuff
    this.setupOctree();
    this.setup3D();
    this.setup2D();

    this.controller = new MouseControls(this);
    this.layouter = new Layouter(200, 1000); //for 100x100 cubes
    //a collection to store all hosts
    this.hosts = [];

    if (__DEV__) {
      this.setupStats();
    }

    this.setupEvents();
    this.update();
  }

  setupOctree() {
    //setup octree
    this.octree = new THREE.Octree({
      // uncomment below to see the octree (may kill the fps)
      //scene: this.scene,
      // when undeferred = true, objects are inserted immediately
      // instead of being deferred until next octree.update() call
      // this may decrease performance as it forces a matrix update
      undeferred: true,
      // set the max depth of tree
      depthMax: Infinity,
      // max number of objects before nodes split or merge
      objectsThreshold: 8,
      // percent between 0 and 1 that nodes will overlap each other
      // helps insert objects that lie over more than one node
      overlapPct: 0
    });
  }

  addToOctree(obj) {
    this.octree.add(obj, { useFaces: false });
  }

  setup3D() {
    const width = this.width;
    const height = this.height;

    this.webGLRenderer = new THREE.WebGLRenderer();
    this.webGLRenderer.setClearColor(colors.renderClearColor, 1);
    this.webGLRenderer.setSize(width, height);

    //add webGLRenderer to dom element
    this.canvas.appendChild(this.webGLRenderer.domElement);

    this.scene = new THREE.Scene();

    //set the farplane as near as possible
    this.mainCamera = new THREE.PerspectiveCamera(30, width / height, 0.5, 1500);

    // add subtle ambient lighting
    const ambientLight = new THREE.AmbientLight(colors.ambientColor);
    this.scene.add(ambientLight);

    //a collection to store all sceneObjects
    this.sceneObjects3D = [];
    this.sceneObjects3D.push(new Ground(this));

    this.scene.add(geometries.globalHostContainer);
  }

  setup2D() {
    const width = this.width;
    const height = this.height;


    this.cssRenderer = new THREE.CSS3DRenderer();
    this.cssRenderer.setSize(width, height);

    const div = document.createElement('div');
    div.classList.add('webgl-canvas-overlay');
    div.appendChild(this.cssRenderer.domElement);
    this.canvas.appendChild(div);
  }

  setupStats() {
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
  }

//events
  setupEvents() {
    const doc = document;
    window.addEventListener('resize', this.onWindowResize, false);
    doc.getElementById('newHostButton').onclick = this.addRandomHost;
    doc.getElementById('newContainerButton').onclick = this.addRandomContainer;
    doc.getElementById('destroyCubeButton').onclick = this.removeCube;
    doc.getElementById('showWalkableButton').onclick = this.showWalkable;
    doc.getElementById('showInGrafanaButton').onclick = this.showInGrafana;
  }

  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.webGLRenderer.setSize(this.width, this.height);
    this.cssRenderer.setSize(this.width, this.height);

    this.mainCamera.aspect = this.width / this.height;
    this.mainCamera.updateProjectionMatrix();
  }

  addRandomHost() {
    return this.addHost( {
      id: 'UUID ' + Math.random(),
      cpu: { model: 'Test CPU', count: 2 },
      memory: {total: 1234567890},
      operatingSystem: {name: 'OS'} } );
  }

  addRandomContainer() {
    const object = this.clickedObject;
    object.addContainer( { id: 'id', pid: Math.random() } );
  }

  removeCube() {
    const object = this.clickedObject;
    if(object.dataProvider instanceof HostDataProvider) {
      _.remove(this.objects3D, obj => obj === object);
      _.remove(this.hosts, obj => obj === object);
      this.layouter.setFree(object.ID);
    }
    object.dispose();
  }

  showWalkable() {
    logger.error('NOT IMPLEMENTED YET');
  }

  showInGrafana() {
    const object = this.clickedObject;
    if (object instanceof Container) {
      const url = object.dataProvider.getDashboardUrl();
      window.open(url, '_blank');
    }
  }
//end events

  bindMethods() {
    this.update = this.update.bind(this);
    this.bindMethods = this.bindMethods.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.addRandomHost = this.addRandomHost.bind(this);
    this.addRandomContainer = this.addRandomContainer.bind(this);
    this.removeCube = this.removeCube.bind(this);
    this.showWalkable = this.showWalkable.bind(this);
    this.showInGrafana = this.showInGrafana.bind(this);
    this.animate = this.animate.bind(this);
  }

  update() {
    requestAnimationFrame(this.update);

    if (__DEV__) {
      var rS = this.rStats;
      rS('frame').start();
      this.glStats.start();
      rS('frame').start();
      rS('rAF').tick();
      rS('FPS').frame();
      rS('updates').start();
    }

    this.animate();

    if (__DEV__) {
      rS('updates').end();
      rS('render').start();
    }

    this.render();

    if (__DEV__) {
      rS('render').end();
      rS('frame').end();
      rS().update();
    }
  }

  animate() {
    this.calculateDeltaTime();
    const dt = this.deltaTime;

    this.controller.update(dt);

    _.forEach(this.updates, obj => {
      obj.update(dt);
    });


    const distance = this.controller.zoomLevel;
    if(distance <= this.showHostDetailsDistance) {
      this.showHostDetails = true;

      const opacity = distance / this.showHostDetailsDistance;
      materials.cubeHostMaterial.opacity = opacity;

      if(!this.switchHostDetails) {
        //switch on
        this.switchHostDetails = true;
        materials.cubeHostMaterial.transparent = true;

        _.forEach(this.hosts, host => {
          this.hideHost(host);
        });
      }

    } else {
      this.showHostDetails = false;

      if(this.switchHostDetails) {
        //switch off
        this.switchHostDetails = false;
        materials.cubeHostMaterial.transparent = false;
        materials.cubeHostMaterial.opacity = 1;

        _.forEach(this.hosts, host => {
          this.showHost(host);
        });
      }
    }
  }

  showHost(host) {
    host.hide();
    this.scene.add(host.content2D);
    this.scene.add(host.cube);
  }

  hideHost(host) {
    host.show();
    this.scene.remove(host.content2D);
    this.scene.remove(host.cube);
  }

  calculateDeltaTime() {
    const timeNow = Date.now();
    this.deltaTime = (timeNow - this.time) / 1000; //in ms
    this.time = timeNow;
    this.timeSinceStarted += this.deltaTime;
  }

  render() {
    this.webGLRenderer.render(this.scene, this.mainCamera);
    this.cssRenderer.render(this.scene, this.mainCamera);
  }

  findObjectInOctree(raycaster) {

    raycaster.far = Math.min(250, raycaster.far); //[0, 200]
    var toBeTested = [];
    this.scene.traverse (function (object)
    {
      if(object.collisionEnabled === true) {
        toBeTested.push(object);
      }
    });

    var i = raycaster.intersectObjects(toBeTested);
    if (i.length > 0) {
      return i[0].object;
    }
    return;




    this.octree.update();


    //search all candidates where ray cutting quadrants of the octree
    const octree2Objects = this.octree.search(
      raycaster.ray.origin,
      raycaster.ray.far,
      true, //true -> organized by objects
      raycaster.ray.direction);

    const intersections = raycaster.intersectOctreeObjects(octree2Objects);
    if (intersections.length > 0) {
      for (let i = 0; i < intersections.length; i++) {
        const intersect = intersections[i].object;
        //return nearest enabled hit
        if(intersect.collisionEnabled) {
          return intersect;
        }
      }
    }
    return undefined;
  }

  clickedOnObject(object) {
    this.clickedObject = object;
    logger.info('clicked on: ', this.clickedObject);
  }

  addHost(metaData) {
    try {
      //get new position if possible
      const newPos2D = this.layouter.getNext();
      //and block it with the uuid
      this.layouter.setBlocked(newPos2D, metaData.id);

      const pos = new THREE.Vector3(newPos2D.x * 20, 0, -newPos2D.y * 20);
      const dim = new THREE.Vector3(20, 4, 20);
      const host = new Container(this, pos, dim, new HostDataProvider(metaData));

      this.sceneObjects3D.push(host);
      this.hosts.push(host);
      this.scene.add(host.cube);

      if(!this.showHostDetails) {
        this.showHost(host);
      } else {
        this.hideHost(host);
      }

      return host;

    } catch (e) {
      logger.error(e);
      return undefined;
    }
  }

  getHost(ID) {
    return _.find(this.hosts, host => host.ID === ID);
  }
}

export default App;
