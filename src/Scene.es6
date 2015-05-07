'use strict';

import THREE from 'three';
import TWEEN from 'tween.js'
import {isIdEqual} from 'instana-ui-services/util/snapshots';

import './lib/Octree';

import * as zoom from './zoom';
import colors from './colors';
import PhysicalMap from './sceneObjects/PhysicalMap';
import Host from './sceneObjects/Host';
import EventEmitter from 'eventemitter3';
import HostCubeFactory from './factories/HostCubeFactory';
import HostMetricCubeFactory from './factories/HostMetricCubeFactory';
import LineFactory from './factories/LineFactory';
import ZoneFactory from './factories/ZoneFactory';
import PlaneFactory from './factories/PlaneFactory';
import MouseCameraController from './controls/mouseCameraController';
import TouchCameraController from './controls/touchCameraController';

import _ from 'lodash';

const frustum = new THREE.Frustum();
const projScreenMatrix = new THREE.Matrix4();
const getZoomClass = (level) => 'in-map--zoom-' + level;
const isMobile = {
  android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  blackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  windows: function() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
    return (isMobile.android() || isMobile.blackBerry() ||
      isMobile.iOS() || isMobile.opera() || isMobile.windows());
  }
};


export default class Scene {

  constructor({parent}) {
    this.bindMethods();

    this.parent = parent;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    //time properties
    this.timeOfLastFrameUpdate = Date.now();
    this.deltaTime = 0;
    this.timeSinceFirstFrame = 0;

    this.emitter = new EventEmitter();

    //stores all objects which should be clickable
    this.collisionObjects = [];

    this.setupFactories();
    this.setupOctree();
    this.setup3D();

    this.setupController();

    this.update();

    window.addEventListener('resize', this.onWindowResize, false);
  }

  getScene() {
    return this;
  }

  renderScene() {
    this.shouldRenderScene = true;
  }

  startAnimation() {
    this.animationInProgress = true;
  }

  stopAnimation() {
    this.animationInProgress = false;
  }

  setupController() {
    if (isMobile.any()) {
      this.controller = new TouchCameraController({scene: this});
    } else {
      this.controller = new MouseCameraController({scene: this});
    }

    //call zoom to trigger camera movemnt to the right position
    this.controller.zoom(-1);
  }

  addSceneObject(obj) {
    if (obj.useOnlyForCollisionDetection) {
      this.octree.add(obj, {
        useFaces: false
      });
    } else {
      this.scene.add(obj);
    }
  }

  removeSceneObject(obj) {
    this.scene.remove(obj);

    if (obj.collisionObject !== undefined) {
      this.octree.remove(obj.collisionObject);
    }
  }

  bindMethods() {
    this.onWindowResize = this.onWindowResize.bind(this);
    this.update = this.update.bind(this);
    this.updateMaterialsByZoomLevel =
      this.updateMaterialsByZoomLevel.bind(this);
  }

  setupOctree() {
    //setup octree
    this.octree = new THREE.Octree({
      // uncomment below to see the octree (may kill the fps)
      //scene: this.scene,
      // when undeferred = true, objects are inserted immediately
      // instead of being deferred until next octree.update() call
      // this may decrease performance as it forces a matrix update
      undeferred: false,
      // set the max depth of tree
      depthMax: Infinity,
      // max number of objects before nodes split or merge
      objectsThreshold: 8,
      // percent between 0 and 1 that nodes will overlap each other
      // helps insert objects that lie over more than one node
      overlapPct: 0
    });
  }

  setupFactories() {
    this.hostFactory = new HostCubeFactory({scene: this});
    this.hostMetricFactory = new HostMetricCubeFactory({scene: this});
    this.lineFactory = new LineFactory({scene: this});
    this.zoneFactory = new ZoneFactory({scene: this});
    this.planeFactory = new PlaneFactory({scene: this});

    //setInterval(this.updateHeights.bind(this), 1000);
  }

  updateHeights() {
    this.hostMetricFactory.updateHeights();

    //render scene to show the update
    this.renderScene();
  }

  setup3D() {
    const width = this.width;
    const height = this.height;

    this.setupRenderer(width, height);
    this.setupCamera(width, height);

    this.scene = new THREE.Scene();
    this.map = new PhysicalMap({scene: this});

    this.shouldRenderScene = true;
    this.animationInProgress = false;
  }

  setupRenderer(width, height) {
    this.renderer = new THREE.WebGLRenderer({
      precision: 'highp',
      antialias: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(colors.renderClearColor);

    //add webGLRenderer to dom element
    this.parent.appendChild(this.renderer.domElement);
  }

  setupCamera(width, height) {
    this.cameraSize = 30;

    const aspect = width / height;
    const left = -this.cameraSize / 2 * aspect;
    const top = this.cameraSize / 2;
    this.camera = new THREE.OrthographicCamera(
      left, -left, top, -top,
      0.1, //near
      2000 //far
    );

    this.camera.position.set(-1, 1, 1);
    this.camera.lookAt(new THREE.Vector3());
    this.camera.updateMatrix();
    this.camera.matrixAutoUpdate = false;
  }

  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.renderer.setSize(this.width, this.height);

    const aspect = this.width / this.height;
    this.camera.left = -this.cameraSize / 2 * aspect;
    this.camera.right = this.cameraSize / 2 * aspect;
    this.camera.updateProjectionMatrix();
    this.renderScene();
  }

  getWorldPosition() {
    return new THREE.Vector3();
  }

  calculateDeltaTime() {
    const timeNow = Date.now();
    this.deltaTime = (timeNow - this.timeOfLastFrameUpdate) / 1000; //in ms
    this.timeOfLastFrameUpdate = timeNow;
    this.timeSinceFirstFrame += this.deltaTime;
  }

  update() {
    if (this.disposed) {
      return;
    }

    requestAnimationFrame(this.update);

    //fire event for updating stats
    this.emitter.emit('beginUpdate');

    this.calculateDeltaTime();
    this.controller.update(this.deltaTime);
    TWEEN.update();

    //don't render scene if it is not needed
    if(!this.shouldRenderScene && !this.animationInProgress) {
      return;
    }

    this.updateCamera();

    //update is done
    this.emitter.emit('endUpdate', {scene: this});

    this.render();
    this.octree.update();
    this.shouldRenderScene = false;

    this.emitter.emit('endRender', {scene: this});
  }

  updateCamera() {
    const camera = this.camera;
    //updateMatrix is called in controller before
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();

    camera.projection = new THREE.Matrix4();
    const inverse = new THREE.Matrix4().getInverse(camera.matrixWorld);
    camera.projection
      .multiplyMatrices(camera.projectionMatrix, inverse);

    //calculte view frustum
    projScreenMatrix.multiplyMatrices(camera.projectionMatrix, inverse);
    frustum.setFromMatrix(projScreenMatrix);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  objectIsVisible(object) {
    return frustum.intersectsObject(object);
  }

  dispose() {
    this.disposed = true;
  }

  getHtmlContainer() {
    return this.parent;
  }

  on(event, cb) {
    return this.emitter.on(event, cb);
  }

  onZoom(event) {
    const zoomLevel = event.zoomLevel;
    this.cameraSize = zoomLevel / 10;
    this.setCameraFromSize();

    if(zoomLevel > 250) {
      this.renderHtmlStuff = false;
    } else {
      this.renderHtmlStuff = true;
    }

    //update the css design zoom distance
    this.updateZoomLevelInCss(zoomLevel);

    //update the opacity for the 3D elements
    this.updateMaterialsByZoomLevel(zoomLevel);
    this.map.onZoom(zoomLevel);
    this.renderScene();
  }

  updateMaterialsByZoomLevel(zoomLevel) {
    if (this.controller === undefined) {
      return;
    }
    const maxZoomIn = 25;
    const maxZoomOut = 150;

    //[1 - max out, 0 - max in]
    let normedZoomLevel = zoomLevel / (maxZoomOut - maxZoomIn);
    normedZoomLevel = Math.min(1, Math.max(0.1, normedZoomLevel));

    this.hostFactory.material.opacity = normedZoomLevel;
    this.lineFactory.material.visible = (zoomLevel <= 250);
    this.hostMetricFactory.material.visible = (zoomLevel <= 130);

    this.updateHostColors(zoomLevel, maxZoomOut);
  }

  updateHostColors(zoomLevel, maxZoomOut) {
    if(zoomLevel > maxZoomOut) {
      this.hostFactory.material.transparent = false;
      this.hostFactory.grayAllHosts(false);
    } else {
      this.hostFactory.material.transparent = true;
      this.hostFactory.grayAllHosts(true);
    }
  }

  updateZoomLevelInCss(zoomUnits) {
    const parentClasses = this.parent.classList;

    zoom.zoomLevelsInDesign.forEach(level => {
      parentClasses.remove(getZoomClass(level));
    });
    parentClasses.add(getZoomClass(zoom.getZoomLevel(zoomUnits)));
  }

  setCameraFromSize() {
    const aspect = this.width / this.height;
    this.camera.left = -this.cameraSize / 2 * aspect;
    this.camera.right = this.cameraSize / 2 * aspect;
    this.camera.top = this.cameraSize / 2;
    this.camera.bottom = -this.cameraSize / 2;

    this.camera.updateProjectionMatrix();
  }

  findObjectByRay(raycaster) {
    raycaster.far = Math.min(2500, raycaster.far); //[0, 2500]

    const octree2Objects = this.octree.search(
      raycaster.ray.origin,
      raycaster.ray.far,
      true, //true -> organized by objects
      raycaster.ray.direction);

    const intersections = raycaster
      .intersectOctreeObjects(octree2Objects);
    if (intersections.length > 0) {
      return intersections[0].object;
    }
    return undefined;
  }

  clickedOnObject(object) {
    this.controller.flyToObject(object);
    this.controller.setZoomLevel(100);
  }

  focus(snapshotId) {
    this.map.zones.forEach(zone => {
      zone.hosts.forEach(host => {
        if (isIdEqual(host.snapshot, snapshotId)) {
          this.clickedOnObject(host.cube);
          return;
        }
      });
    });
  }
}
