'use strict';

import THREE from 'three';
import Tween from 'tween.js';

import './lib/Octree';

import {getAllNodes} from './mapStructureUtils';
import * as zoom from './zoom';
import backgroundPlane from './lib/backgroundPlane';
import PhysicalMap from './sceneObjects/PhysicalMap';
import Node from './sceneObjects/Nodes/Node/index';
import SingleMetricPillarFactory from './factories/SingleMetricPillarFactory';
import MultiMetricPillarFactory from './factories/MultiMetricPillarFactory';
import LineFactory from './factories/LineFactory';
import MouseCameraController from './controls/MouseCameraController_temp';
import SingleMeshFactory from './SingleMeshFactory/SingleMeshFactory';
// import SingleMeshMetricFactory from './SingleMeshFactory/SingleMeshMetricFactory';
import * as time from './timeCalculations';
import Tooltip from './sceneObjects/Tooltips/Connection/index';
import {allConnections} from './sceneObjects/Connection/index';
import {createLogger} from 'instalog';
import {select} from 'instana-ui-services/stores/selectedSnapshot';
import {activeMetric} from 'instana-ui-services/stores/metrics';
import {isIdEqual} from 'instana-ui-services/util/snapshots';
import eventBus from 'instana-ui-services/eventbus';

const logger = createLogger('ui-map.Group');
let currentMetrics;

const inverse = new THREE.Matrix4();
const getZoomClass = (level) => 'in-map--zoom-' + level;


export const scene = {};
export default class Scene {

  constructor({parent, pluginId}) {
    this.bindMethods();

    this.parent = parent;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.selectedSceneObject = undefined;
    this.pluginId = pluginId;

    this.octrees = [];

    this.setup3D();
    this.setupFactories();
    this.controller = new MouseCameraController({scene: this});
    this.setupEvents();

    this.update();

    scene.scene = this;
  }

  bindMethods() {
    this.onWindowResize = this.onWindowResize.bind(this);
    this.update = this.update.bind(this);
    this.updateMaterialsByZoomLevel =
      this.updateMaterialsByZoomLevel.bind(this);
  }

  setupEvents() {
    window.addEventListener('resize', this.onWindowResize, false);

    this.subscriptions = [eventBus.on('focus').subscribe(e => this.onFocus(e))];

    this.subscriptions.push(activeMetric.subscribe(metric => {
      if(!metric) {
        currentMetrics = undefined;
        // eventBus.emit('setHullsInactive', false);
        this.hullsAreInactive = false;
        this.updateMaterialsByZoomLevel(this.controller.zoomLevel);
        this.hideMetrics();
      } else {
        currentMetrics = metric.get('metrics');
        // eventBus.emit('setHullsInactive', true);
        this.singleMeshFactory.material.opacity = 0.4;
        this.singleMeshFactory.material.transparent = true;

        this.hullsAreInactive = true;
        this.showMetrics();
      }
    }));

    this.subscriptions.push(eventBus.on('setHullsInactive').subscribe((e) => {
      if(e) {
        this.singleMeshFactory.material.opacity = 0.4;
        this.singleMeshFactory.material.transparent = true;

        this.hullsAreInactive = true;

      //only set hulls to normal state if there is not active metric
    } else if(!currentMetrics || currentMetrics.size === 0) {
        this.hullsAreInactive = false;
        this.updateMaterialsByZoomLevel(this.controller.zoomLevel);
      }
    }));
  }

  setupFactories() {
    this.singleMeshFactory
      = new SingleMeshFactory({scene: this, renderOrder: 3});

    // this.singleMeshMetricFactory = new SingleMeshMetricFactory({scene: this});

    this.groundSingleMeshFactory
      = new SingleMeshFactory({scene: this, renderOrder: 2});
    this.groundSingleMeshFactory.material.transparent = true;
    this.groundSingleMeshFactory.material.opacity = 0.4;

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

  createOctree() {
    return new THREE.Octree({
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

    this.map = new PhysicalMap({
      scene: this,
      pluginId: this.pluginId
    });

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
  }

  updateNodeWidthOnScreen() {
    //size of the view frustum in worldunits
    const camSize = this.cameraSize;
    //each node has width = 1 in worldunits
    const nodeSize = 1;
    const aspect = nodeSize / camSize;
    const nodeSizeInPixel = aspect * this.width;

    if(this.nodeSizeInPixel !== nodeSizeInPixel) {
      this.nodeSizeInPixel = nodeSizeInPixel;
      eventBus.emit('nodeSizeChanged', nodeSizeInPixel);
      this.renderScene();
    }
  }

  updateMetricHeights() {
    // this.singleMeshMetricFactory.updateHeights();

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

  showMetrics() {
    //if there is an active metric, dispose it first
    this.hideMetricFactoryMesh();

    //check if there are multiple metrics to be rendered
    this.activeMetricFactory = currentMetrics.size > 1 ?
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
    if(!this.hullsAreInactive) {
      this.singleMeshFactory.material.opacity = normedZoomLevel;
      this.singleMeshFactory.material.transparent = (zoomLevel < maxZoomOut);
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

    //nodes size only changes at camSize or canvas changes
    this.updateNodeWidthOnScreen();

    //projection matrix is updated in update loop
  }

  findObjectByRay(raycaster) {
    raycaster.far = Math.min(2500, raycaster.far); //[0, 2500]
    const ray = raycaster.ray;

    //iterate all octrees backwards from the highest layer to the lowest
    for (let i = this.octrees.length - 1; i >= 0; i--) {
      const octree = this.octrees[i];
      if(!octree) {
        continue;
      }
      const octree2Objects = octree.search(
        ray.origin,
        ray.far,
        true, //true -> organized by objects
        ray.direction);

      const intersections = raycaster.intersectOctreeObjects(octree2Objects);
      if (intersections.length > 0) {
        //the array is sorted by distance
        return intersections[0].object;
      }
    }

    return undefined;
  }

  handleHoveredConnetions(raycaster) {
    const hovered = [];

    //get all mouseover connections
    allConnections.forEach(connection => {
      if(connection.intersects(raycaster)) {
        hovered.push(connection);
      }
    });

    //highlight all connections that are hovered, unhighlight the rest
    allConnections.forEach(connection => {
      if(hovered.indexOf(connection) >= 0) {
        connection.highlight(true);
      } else {
        connection.highlight(false);
      }
    });

    if(hovered.length > 0) {
      if(this.connectionTooltip) {
        this.connectionTooltip.setHovered(hovered);
      } else {
        this.connectionTooltip = new Tooltip(this, hovered);
      }
    } else {
      if(this.connectionTooltip) {
        this.connectionTooltip.dispose();
        this.connectionTooltip = null;
      }
    }
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
    this.scene.add(obj);
  }

  removeSceneObject(obj) {
    this.scene.remove(obj);
  }

  addCollisionObject(obj, layer=0) {
    let octree = this.octrees[layer];
    if(!octree) {
      this.octrees[layer] = octree = this.createOctree();
    }

    octree.add(obj, {useFaces: false});
    octree.update();
  }

  removeCollisionObject(obj, layer=0) {
    const octree = this.octrees[layer];
    if(octree) {
      octree.remove(obj);
      octree.rebuild();
    }
  }

  getWorldPosition() {
    return new THREE.Vector3();
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
      //if there is an active metric, disable metrics.
      //activeMetricFactory is disposed on hideMetrics
      if(this.activeMetricFactory) {
        this.hideMetricsOnZoomOut = true;
        this.hideMetrics({hiddenByZoom: true});
      }
    //if the metrics where hidden by zooming, resume them if the zoom
    //has reached the right level again
    } else if(this.hideMetricsOnZoomOut) {
      this.hideMetricsOnZoomOut = false;
      eventBus.emit('resumeMetrics');

      //call method without arguments will use the last added metrics
      this.showMetrics();
    }

    //update the css design zoom distance
    this.updateZoomLevelInCss(zoomLevel);

    //update the opacity for the 3D elements
    this.updateMaterialsByZoomLevel(zoomLevel);
    this.map.onZoom(zoomLevel);
    this.renderScene();
  }

  onObjectClicked(object, fireExternalEvent = true) {
    //get the parent scene object, e.g. a node
    const sceneObject = object.parentSceneObject;

    if(fireExternalEvent && sceneObject) {
      //only click on known nodes
      if(sceneObject instanceof Node) {
        //unselect selected objects
        if(sceneObject.isSelected) {
          sceneObject.unSelect(true);
        } else {
          select(sceneObject.snapshot);
        }
      } else {
        logger.debug('you hit an unknown object', sceneObject.id);
      }
    }
  }

  //is called if the snapshotStore emits null
  clearSelectedObject() {
    if(this.selectedSceneObject) {
      this.selectedSceneObject.unSelect();
    }

    this.selectedSceneObject = undefined;
    this.updateMaterialsByZoomLevel(this.controller.zoomLevel);

    eventBus.emit('setHullsInactive', false);

    //set all stickies to opacity: 1
    this.forEachNode((node) => {
      node.stickyNote.setInactive(false);
    });
  }

  setSelectedObject(object) {
    this.clearSelectedObject();

    //save the new object and select it
    this.selectedSceneObject = object;
    this.controller.flyToObject(object.cube);

    eventBus.emit('setHullsInactive', true);

    //set selected and wired to opacity: 1
    const allNodes = getAllNodes(this.map);
    allNodes.forEach((node) => {
      if(node !== object) {
        node.stickyNote.setInactive(true);
      }
    });

    allNodes.forEach((node) => {
      if(node === object) {
        node.stickyNote.setInactive(false);
        node.setWiredStickiesActive();
      }
    });
  }

  isAnySnapshotSelected() {
    return this.selectedSceneObject;
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
