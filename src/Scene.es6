'use strict';

import THREE from 'three';
import Tween from 'tween.js'
import {isIdEqual, extractId} from 'instana-ui-services/util/snapshots';
import eventBus from 'instana-ui-services/eventbus';

import './lib/Octree';

import {getAllNodes} from './mapStructureUtils';
import * as zoom from './zoom';
import backgroundPlane from './lib/backgroundPlane';
import PhysicalMap from './sceneObjects/PhysicalMap';
import * as time from './timeCalculations';
import SingleMetricPillarFactory from './factories/SingleMetricPillarFactory';
import MultiMetricPillarFactory from './factories/MultiMetricPillarFactory';
import LineFactory from './factories/LineFactory';
import MouseCameraController from './controls/mouseCameraController';
import * as snapshotStore from 'instana-ui-services/stores/selectedSnapshot';
import SingleMeshFactory from './SingleMeshFactory/SingleMeshFactory';

import _ from 'lodash';

const frustum = new THREE.Frustum();
const projScreenMatrix = new THREE.Matrix4();
const inverse = new THREE.Matrix4();
const getZoomClass = (level) => 'in-map--zoom-' + level;
let currentMetrics;


export const scene = {};
export default class Scene {

  constructor({parent}) {
    this.bindMethods();

    this.parent = parent;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.selectedSceneObject = undefined;

    this.setupOctree();
    this.setup3D();
    this.setupFactories();

    this.setupController();

    this.setupEvents();

    this.update();

    window.addEventListener('resize', this.onWindowResize, false);
    scene.scene = this;
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
      eventBus.on('showMetrics').subscribe((e) => this.showMetrics(e)));

    this.subscriptions.push(
      eventBus.on('hideMetrics').subscribe((e) => this.hideMetrics(e)));

    this.subscriptions.push(snapshotStore.selectedSnapshot.subscribe(
    (snapshot) => {
      if(!snapshot) {
        this.onSnapshotCleared();
      } else {
        this.onSnapshotSelected(snapshot);
      }
    }));
  }

  setupFactories() {
    this.singleMeshFactory
      = new SingleMeshFactory({scene: this, renderOrder: 3});
    this.groundSingleMeshFactory
      = new SingleMeshFactory({scene: this, renderOrder: 2});

    this.highlightingSingleMeshFactory
      = new SingleMeshFactory({scene: this, renderOrder: 4});

    this.singleMetricFactory = new SingleMetricPillarFactory({scene: this});
    this.lineFactory = new LineFactory({scene: this});
    this.numTiles = 5;
    this.multiMetricFactory = new MultiMetricPillarFactory({
      scene: this,
      numTiles: this.numTiles
    });

    setInterval(() => {
      this.updateMetricHeights();
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

    //this is the main scene for all scene objects like nodes or metrics
    this.scene = new THREE.Scene();

    //this is a scene just for the background rect to create a gradient instead
    //of a solid color
    this.backgroundScene = new THREE.Scene();
    this.backgroundScene.add(backgroundPlane);

    this.map = new PhysicalMap({scene: this});

    //set this flag to force a render cycle
    this.shouldRenderScene = true;

    //set this flag to keep the render cycle alive
    this.animationInProgress = false;
  }

  setupRenderer(width, height) {
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(width, height);

    //since the app doesn't use any shadows, set this flag to shorten internal
    //three.js code
    this.renderer.shadowMapEnabled = false;

    //don't need to clear the buffer because it's filled with a gradient
    this.renderer.autoClearColor = false;

    //add webGLRenderer to dom element
    this.parent.appendChild(this.renderer.domElement);
  }

  setupCamera(width, height) {
    //a multiplicator for a homogenious viewport * aspect
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
    //set static
    this.camera.matrixAutoUpdate = false;
    this.camera.rotationAutoUpdate = false;
    this.camera.updateMatrix();

    //this is a camera just for the background scene to render
    this.backgroundCamera = new THREE.OrthographicCamera(
      1, -1, 1, -1,
      0.1, //near
      10 //far
    );
    //set static
    this.backgroundCamera.matrixAutoUpdate = false;
    this.backgroundCamera.rotationAutoUpdate = false;
  }

  setupController() {
    this.controller = new MouseCameraController({scene: this});

    //call zoom to trigger camera movemnt to the right position
    this.controller.zoom(-300);
  }

  update() {
    //break the requestAnimationFrame loop if disposed
    if (this.disposed) {
      return;
    }

    requestAnimationFrame(this.update);

    //fire event for updating stats
    eventBus.emit('beginUpdate');

    time.update();
    Tween.update();
    this.controller.update();

    //don't render scene if it is not needed
    if(!this.shouldRenderScene && !this.animationInProgress) {
      return;
    }

    this.updateCamera();

    //updating is done
    eventBus.emit('endUpdate', {scene: this});

    this.render();
    this.shouldRenderScene = false;

    //rendering is done
    eventBus.emit('endRender', {scene: this});
  }

  render() {
    //first render the background
    const renderer = this.renderer;
    renderer.render(this.backgroundScene, this.backgroundCamera);

    //after rendering the background, render the hole scene
    renderer.render(this.scene, this.camera);
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
    //if there is an active metric to be rendered, update the heights
    if(this.activeMetricFactory) {
      this.activeMetricFactory.updateHeights();
      eventBus.emit('upateMetricHeights');
    }
  }

  hideMetricFactoryMesh() {
    if(this.activeMetricFactory) {
      this.activeMetricFactory.material.visible = false;
    }
  }

  showMetrics(e) {
    //if there is an active metric, dispose it first
    this.hideMetricFactoryMesh();

    currentMetrics = e ? e.metrics : currentMetrics;

    //check if there are multiple metrics to be rendered
    this.activeMetricFactory = currentMetrics.length > 1 ?
      this.multiMetricFactory : this.singleMetricFactory;

    this.activeMetricFactory.material.visible = true;
    this.renderScene();
  }

  hideMetrics(e) {
    this.hideMetricFactoryMesh();

    if(e && e.hiddenByZoom) {
      this.hideMetricsOnZoomOut = true;
    } else {
      this.hideMetricsOnZoomOut = false;
    }

    //set this to undefined will not trigger any factory to update heights
    this.activeMetricFactory = undefined;

    this.renderScene();
  }

  updateMaterialsByZoomLevel(zoomLevel) {
    //TODO: set this values globally
    const maxZoomIn = 60;
    const maxZoomOut = 250;

    //[1 - max out, 0 - max in]
    let normedZoomLevel = zoomLevel / (maxZoomOut - maxZoomIn);
    normedZoomLevel = Math.min(1, Math.max(0.1, normedZoomLevel));

    this.highlightingSingleMeshFactory.material.opacity = normedZoomLevel;
    this.highlightingSingleMeshFactory.material.transparent =
      (zoomLevel < maxZoomOut);

    //if there is no cube isSelected, fade all cubes by distance
    if(!this.selectedSceneObject) {
      this.singleMeshFactory.material.opacity = normedZoomLevel;
      this.singleMeshFactory.material.transparent = (zoomLevel < maxZoomOut);

      this.groundSingleMeshFactory.material.opacity = normedZoomLevel;
      this.groundSingleMeshFactory.material.transparent =
        (zoomLevel < maxZoomOut);
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
    //we start in the middle and go totalWidth / 2 to the left
    const camSizeHalf = this.cameraSize / 2;
    const aspect = this.width / this.height;

    this.camera.left = -camSizeHalf * aspect;
    this.camera.right = camSizeHalf * aspect;
    this.camera.top = camSizeHalf;
    this.camera.bottom = -camSizeHalf;

    //projection matrix is updated in update loop
  }

  findObjectByRay(raycaster) {
    raycaster.far = Math.min(2500, raycaster.far); //[0, 2500]
    const ray = raycaster.ray;

    const octree2Objects = this.octree.search(
      ray.origin,
      ray.far,
      true, //true -> organized by objects
      ray.direction);

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

  //checks if the object is inside the view frustum
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
    return eventBus.on(event, cb);
  }

  onZoom(event) {
    const zoomLevel = event.zoomLevel;
    if(zoomLevel > 250) {
      //this.renderHtmlStuff = false;

      //if there is an active metric, disable metrics.
      //activeMetricFactory is disposed on hideMetrics
      if(this.activeMetricFactory) {
        this.hideMetricsOnZoomOut = true;
        eventBus.emit('hideMetrics', {hiddenByZoom: true});
      }
    } else {
      //if the metrics where hidden by zooming, resume them if the zoom
      //has reached the right level again
      if(this.hideMetricsOnZoomOut) {
        this.hideMetricsOnZoomOut = false;
        eventBus.emit('resumeMetrics');

        //call method without arguments will use the last added metrics
        this.showMetrics();
      }
      this.renderHtmlStuff = true;
    }

    //update the css design zoom distance
    this.updateZoomLevelInCss(zoomLevel);

    //update the opacity for the 3D elements
    this.updateMaterialsByZoomLevel(zoomLevel);
    this.map.onZoom(zoomLevel);
    this.renderScene();
  }

  onObjectClicked(object, fireExternalEvent = true) {
    if(fireExternalEvent) {
      //get the parent scene object, e.g. a node
      const node = object.parentSceneObject;

      //only click on known objects
      if(node && !node.isUnknown){

        //unselect selected objects
        if(node.isSelected) {
          snapshotStore.clear();
        } else {
          snapshotStore.select(node.snapshot);
        }
      }
    }
  }

  //is called from snapshotstore event
  onSnapshotSelected(snapshot) {
    const object = this.map.findNodeBySnapshot(snapshot);
    if(!object) {
      return;
    }

    this.onSnapshotCleared();

    this.singleMeshFactory.material.opacity = 0.25;
    this.singleMeshFactory.material.transparent = true;

    this.groundSingleMeshFactory.material.opacity = 0.25;
    this.groundSingleMeshFactory.material.transparent = true;

    this.setSelectedObject(object);
  }

  //is called if the snapshotstore emits null
  onSnapshotCleared() {
    if(this.selectedSceneObject) {
      this.selectedSceneObject.unSelect();
    }

    this.selectedSceneObject = undefined;
    this.updateMaterialsByZoomLevel(this.controller.zoomLevel);
  }

  setSelectedObject(object) {
    //save the new object and select it
    this.selectedSceneObject = object;
    this.controller.flyToObject(object.cube);
  }

  onFocus(event) {
    this.forEachNode((node) => {
      if (isIdEqual(node.snapshot, event.snapshot)) {
        if(event.zoom) {
          const zoomSpeed = this.controller.zoomSpeed;
          const camSpeed = this.controller.cameraSpeed;
          this.controller.zoomSpeed = 5;
          this.controller.cameraSpeed = 4;
          this.controller.setZoomLevel(200);
          setTimeout(() => {
            this.onObjectClicked(node.cube, false);
            setTimeout(() => {
              this.controller.setZoomLevel(50);
              setTimeout(() => {
                this.controller.zoomSpeed = zoomSpeed;
                this.controller.cameraSpeed = camSpeed;
              }, 1000);
            }, 600);
          }, 10);
        } else {
          this.onObjectClicked(node.cube, false);
        }
      }
    });
  }

  forEachNode(func) {
    getAllNodes(this.map).forEach(node => {
      func(node);
    });
  }

  //set this flag if the update loop should be stoped
  dispose() {
    this.subscriptions.forEach(sub => sub.dispose());
    this.disposed = true;
  }
}
