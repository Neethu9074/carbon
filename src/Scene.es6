'use strict';

import THREE from 'three';
import Tween from 'tween.js'
import {isIdEqual} from 'instana-ui-services/util/snapshots';
import eventBus from 'instana-ui-services/eventbus';

import './lib/Octree';

import * as zoom from './zoom';
import colors from './colors';
import mobileChecker from './mobileChecker';
import PhysicalMap from './sceneObjects/PhysicalMap';
import * as time from './timeCalculations';
import Host from './sceneObjects/Host';
import EventEmitter from 'eventemitter3';
import HostFactory from './factories/HostFactory';
import SingleMetricPillarFactory from './factories/SingleMetricPillarFactory';
import MultiMetricPillarFactory from './factories/MultiMetricPillarFactory';
import ProcessFactory from './factories/ProcessFactory';
import LineFactory from './factories/LineFactory';
import ZoneFactory from './factories/ZoneFactory';
import MouseCameraController from './controls/mouseCameraController';
import TouchCameraController from './controls/touchCameraController';

import _ from 'lodash';

const frustum = new THREE.Frustum();
const projScreenMatrix = new THREE.Matrix4();
const inverse = new THREE.Matrix4();
const getZoomClass = (level) => 'in-map--zoom-' + level;


export default class Scene {

  constructor({parent}) {
    this.bindMethods();

    this.parent = parent;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.emitter = new EventEmitter();
    this.setupEvents();

    this.setupFactories();
    this.setupOctree();
    this.setup3D();

    this.setupController();

    this.update();

    window.addEventListener('resize', this.onWindowResize, false);
  }

  bindMethods() {
    this.onWindowResize = this.onWindowResize.bind(this);
    this.update = this.update.bind(this);
    this.updateMaterialsByZoomLevel =
      this.updateMaterialsByZoomLevel.bind(this);
  }

  setupEvents() {
    this.subscriptions = [eventBus.on('focus').subscribe(e =>this.onFocus(e))];
    this.subscriptions.push(
      eventBus.on('updateMetricHostEventName').subscribe(e =>
        this.onUpdateHostMetricValue(e))
    );

    this.subscriptions.push(
      eventBus.on('showMetricsOn').subscribe(() => {this.showMetrics = true; })
    );

    this.subscriptions.push(
      eventBus.on('showMetricsOff').subscribe(() => {
        this.showMetrics = false;
      })
    );
  }

  setupFactories() {
    this.hostFactory = new HostFactory({scene: this});
    this.singleMetricFactory = new SingleMetricPillarFactory({scene: this});
    this.lineFactory = new LineFactory({scene: this});
    this.zoneFactory = new ZoneFactory({scene: this});
    this.cubeFactory = new ProcessFactory({scene: this});
    this.numTiles = 5;
    this.multiMetricFactory = new MultiMetricPillarFactory({
      scene: this,
      numTiles: this.numTiles
    });

    setInterval(() => {
      if(this.showMetrics) {
        this.updateMetricHeights();
      }
    }, 1000);
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
      antialias: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(colors.renderClearColor);
    this.renderer.shadowMapEnabled = false;

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

    this.camera.position.set(-0.8, 1, 1);
    this.camera.lookAt(new THREE.Vector3());
    this.camera.projection = new THREE.Matrix4();
    this.camera.updateMatrix();
    this.camera.matrixAutoUpdate = false;
  }

  setupController() {
    if (mobileChecker.any()) {
      this.controller = new TouchCameraController({scene: this});
    } else {
      this.controller = new MouseCameraController({scene: this});
    }

    //call zoom to trigger camera movemnt to the right position
    this.controller.zoom(-1);
  }

  update() {
    if (this.disposed) {
      return;
    }

    requestAnimationFrame(this.update);

    //fire event for updating stats
    this.emitter.emit('beginUpdate');

    time.update();
    Tween.update();
    this.controller.update();

    //don't render scene if it is not needed
    if(!this.shouldRenderScene && !this.animationInProgress) {
      return;
    }

    this.updateCamera();

    //update is done
    this.emitter.emit('endUpdate', {scene: this});

    //inline render since it's only called here
    this.renderer.render(this.scene, this.camera);
    this.shouldRenderScene = false;

    this.emitter.emit('endRender', {scene: this});
  }

  updateCamera() {
    const camera = this.camera;
    const camProjectionMat = camera.projectionMatrix;

    //updateMatrix is called in controller before
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();

    //sets inverse to camera.matrixWorld^-1
    inverse.getInverse(camera.matrixWorld);

    //sets the projection matrix
    camera.projection.multiplyMatrices(camProjectionMat, inverse);

    //calculte view frustum
    projScreenMatrix.multiplyMatrices(camProjectionMat, inverse);
    frustum.setFromMatrix(projScreenMatrix);
  }

  updateMetricHeights() {
    this.emitter.emit('upateMetricHeights');

    //TODO: switch between if single or multi is active
    this.singleMetricFactory.updateHeights();
    this.multiMetricFactory.updateHeights();
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
    //this.lineFactory.material.visible = (zoomLevel <= 200);

    this.updateHostColors(zoomLevel, maxZoomOut);
  }

  updateHostColors(zoomLevel, maxZoomOut) {
    if(zoomLevel > maxZoomOut) {
      this.hostFactory.material.transparent = false;
      //this.hostFactory.grayAllHosts(false);
    } else {
      this.hostFactory.material.transparent = true;
      //this.hostFactory.grayAllHosts(true);
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
    const camSizeHalf = this.cameraSize / 2;
    const aspect = this.width / this.height;
    this.camera.left = -camSizeHalf * aspect;
    this.camera.right = camSizeHalf * aspect;
    this.camera.top = camSizeHalf;
    this.camera.bottom = -camSizeHalf;

    this.camera.updateProjectionMatrix();
  }

  findObjectByRay(raycaster) {
    raycaster.far = Math.min(2500, raycaster.far); //[0, 2500]

    const octree2Objects = this.octree.search(
      raycaster.ray.origin,
      raycaster.ray.far,
      true, //true -> organized by objects
      raycaster.ray.direction);

    const intersections = raycaster.intersectOctreeObjects(octree2Objects);
    if (intersections.length > 0) {
      //the array is sorted by distance
      return intersections[0].object;
    }
    return undefined;
  }

  //set this flag if the scene needs to be redrawn
  renderScene() {
    this.shouldRenderScene = true;
  }

  //set this flag if a animation is in progress so the render loop
  //keeps updated
  startAnimation() {
    this.animationInProgress = true;
  }

  //set this flag if your animations has finished and the render loop
  //could be paused
  stopAnimation() {
    this.animationInProgress = false;
  }

  getScene() {
    return this;
  }

  addSceneObject(obj) {
    //if the object is only used for collision detection ->
    //add it to the octree and not to scene
    if (obj.useOnlyForCollisionDetection) {
      this.octree.add(obj, {useFaces: false});
      this.octree.update();
    } else {
      this.scene.add(obj);
    }
  }

  removeSceneObject(obj) {
    if (obj.useOnlyForCollisionDetection) {
      this.octree.remove(obj);
    } else {
      this.scene.remove(obj);
    }
  }

  getWorldPosition() {
    return new THREE.Vector3();
  }

  objectIsVisible(object) {
    return frustum.intersectsObject(object);
  }

  getHtmlContainer() {
    return this.parent;
  }

  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.renderer.setSize(this.width, this.height);

    this.setCameraFromSize();
    this.renderScene();
  }

  on(event, cb) {
    return this.emitter.on(event, cb);
  }

  onZoom(event) {
    const zoomLevel = event.zoomLevel;
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

  onObjectClicked(object) {
    this.controller.flyToObject(object);
  }

  onFocus(event) {
    this.forEachHost((host) => {
      if (isIdEqual(host.snapshot, event.snapshot)) {
        if(event.zoom) {
          const zoomSpeed = this.controller.zoomSpeed;
          const camSpeed = this.controller.cameraSpeed;
          this.controller.zoomSpeed = 5;
          this.controller.cameraSpeed = 4;
          this.controller.setZoomLevel(200);
          setTimeout(() => {
            this.onObjectClicked(host.cube);
            setTimeout(() => {
              this.controller.setZoomLevel(50);
              setTimeout(() => {
                this.controller.zoomSpeed = zoomSpeed;
                this.controller.cameraSpeed = camSpeed;
              }, 1000);
            }, 600);
          }, 10);
        } else {
          this.onObjectClicked(host.cube);
        }
      }
    });
  }

  forEachHost(func) {
    //search each zone for the given host id
    this.map.zones.forEach(zone => {
      zone.hosts.forEach(host => {
        func(host);
      });
    });
  }

  //set this flag if the update loop should be stoped
  dispose() {
    this.subscriptions.forEach(sub => sub.dispose());
    this.disposed = true;
  }
}
