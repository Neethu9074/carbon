import THREE from 'three';

import * as highlightedSnapshot from 'in-services/stores/highlightedSnapshot';
import * as selectedSnapshot from 'in-services/stores/selectedSnapshot';
import {mapStatisticsStore} from 'in-services/stores/mapStatistics';
import {activeMetric} from 'in-services/stores/metrics';
import * as tracking from 'in-services/tracking';
import eventBus from 'in-services/eventbus';

import './lib/Octree';

// import SingleMeshMetricFactory from './SingleMeshFactory/SingleMeshMetricFactory';
import SingleMeshLineFactory from './SingleMeshFactory/SingleMeshLineFactory';
import SingleMetricPillarFactory from './factories/SingleMetricPillarFactory';
import MultiMetricPillarFactory from './factories/MultiMetricPillarFactory';
import MouseCameraController from './controls/MouseCameraController_temp';
import SingleMeshFactory from './SingleMeshFactory/SingleMeshFactory';
import {getBackgroundPlane} from './lib/backgroundPlane';
import PhysicalMap from './sceneObjects/PhysicalMap';
import * as Handler from './AdaptiveDetailHandler';
import {getMapStatistics} from './mapStatistics';
import * as stores from './stores/mapStore';
import * as time from './timeCalculations';
import * as zoom from './zoom';

const inverse = new THREE.Matrix4();
const getZoomClass = (level) => 'in-map--zoom-' + level;

let currentMetrics;


export default class Scene {

  constructor({parent, pluginIds, onPlusClicked, antialias}) {
    stores.currentScene.emit(this); // set this scene to store

    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.antialias = antialias;
    this.parent = parent;
    this.pluginIds = pluginIds;
    this.onPlusClicked = onPlusClicked;

    if(__DEV__) {
      this.framesRendered = 0;
    }

    this.octrees = [];

    //this is the main scene for all scene objects like nodes or metrics
    this.scene = new THREE.Scene();
    this.setupFactories();
    this.setup3D();
    this.controller = new MouseCameraController({scene: this});

    this.adaptiveDetailHandler = new Handler.AdaptiveDetailHandler(this);

    this.setupEvents();
    this.handleLostContext();

    this.update(0);
  }

  setup3D() {
    const height = this.height;
    const width = this.width;

    this.setupCanvas();
    this.setupRenderer();
    this.setupCamera(width, height);

    this.backgroundPlane = getBackgroundPlane();

    // this is a scene just for the background rect to create a gradient instead of a solid color
    this.backgroundScene = new THREE.Scene();
    this.backgroundScene.add(this.backgroundPlane);

    this.map = new PhysicalMap({
      pluginIds: this.pluginIds,
      parent: this
    });

    // set this flag to force a render cycle
    this.shouldRenderScene = true;
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

  setupCanvas() {
    const canvas = this.canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    this.parent.appendChild(canvas);
  }

  setupRenderer() {
    const renderer = this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this.antialias
    });
    renderer.setSize(this.width, this.height);

    // don't need to clear the buffer because it's filled with a gradient
    renderer.autoClearColor = false;

    // objects organize matrix updat by themselves
    renderer.autoUpdateObjects = false;
  }

  setupCamera(width, height) {
    //a multiplicator for a homogenious viewport * aspect
    this.cameraSize = 30;

    const aspect = width / height;
    const left = -this.cameraSize / 2 * aspect;
    const top = this.cameraSize / 2;
    const camera = this.camera = new THREE.OrthographicCamera(
      left, -left, top, -top,
      0.1, // near
      2000 // far
    );

    camera.position.set(-0.8, 1, 1);
    camera.lookAt(new THREE.Vector3());
    camera.projection = new THREE.Matrix4();
    // set static
    camera.rotationAutoUpdate = false;
    camera.matrixAutoUpdate = false;
    camera.updateMatrix();

    // this is a camera just for the background scene to render
    const bgCamera = this.backgroundCamera = new THREE.OrthographicCamera(
      1, -1, 1, -1,
      0.1, // near
      10 // far
    );

    // set static
    bgCamera.rotationAutoUpdate = false;
    bgCamera.matrixAutoUpdate = false;
  }

  setupFactories() {
    // this.singleMeshMetricFactory = new SingleMeshMetricFactory({scene});

    const scene = this;

    this.groundSingleMeshFactory = new SingleMeshFactory({scene});
    this.groundSingleMeshFactory.material.transparent = true;
    this.groundSingleMeshFactory.material.opacity = 0.2;

    this.highlightingSingleMeshFactory = new SingleMeshFactory({scene, renderOrder: 4});
    this.layerHighlightingSingleMeshFactory = new SingleMeshFactory({scene});
    this.singleMeshFactory = new SingleMeshFactory({scene, renderOrder: 3});
    this.singleMetricFactory = new SingleMetricPillarFactory({scene});

    this.layerSingleMeshFactory = new SingleMeshFactory({scene});
    this.layerSingleMeshFactory.material.transparent = true;
    this.layerSingleMeshFactory.material.opacity = 0.9;

    this.lineFactory = new SingleMeshLineFactory({scene});

    this.baselineFactory = new SingleMeshLineFactory({scene});
    this.baselineFactory.material.transparent = true;

    this.numTiles = 5;
    this.multiMetricFactory = new MultiMetricPillarFactory({scene, numTiles: this.numTiles});

    this.metricUpdateInterval = setInterval(() => {
      if(currentMetrics) {
        this.updateMetricHeights();
      }
    }, 1000);

    const updateFactories = () => {
      this.layerHighlightingSingleMeshFactory.rebuild();
      this.highlightingSingleMeshFactory.rebuild();
      this.groundSingleMeshFactory.rebuild();
      this.layerSingleMeshFactory.rebuild();
      this.singleMeshFactory.rebuild();
      this.baselineFactory.rebuild();
      this.lineFactory.rebuild();
    };

    time.addTimeEventListener({
      handleComponentTimeEvent: updateFactories.bind(this)
    });
  }

  setupEvents() {
    this.onWindowResizeHandler = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResizeHandler, false);

    this.subscriptions = [];

    this.subscriptions.push(stores.currentTooltip.subscribe(tooltip => {
      if(this.tooltip === tooltip) {
        return;
      }

      if(this.tooltip) {
        this.tooltip.unMount();
      }
      this.tooltip = tooltip;
      if(tooltip) {
        tooltip.mount();
      }
    }));

    this.subscriptions.push(activeMetric.subscribe(metric => {
      //if there is an active metric, deselect the current selected obj and
      //show the metric pillars
      if(metric) {
        currentMetrics = metric.get('metrics');
        this.showMetrics();
        stores.selectedSceneObject.emit({sceneObject: null});
        this.hideHulls();

      } else {
        currentMetrics = undefined;
        this.hideMetrics();
        this.showHulls();
      }
    }));

    this.subscriptions.push(
      selectedSnapshot.selectedSnapshot.subscribe(selected => {
        //if the store was cleared and this client is selected -> unselect it
        if(!selected) {
          stores.selectedSceneObject.emit({sceneObject: null});
        }
      })
    );

    this.subscriptions.push(stores.selectedSceneObject.subscribe(event => {
      const sceneObject = event.sceneObject;
      //clear the selectedSnapshot store if there was a click into nowhere
      //or on a sceneObject without a snapshot or unknown sceneObject
      if(sceneObject) {
        if(!event.calledByMap) {
          this.controller.flyToObject(sceneObject);
        }
        this.hideHulls();
      } else {
        this.showHulls();
      }
    }));

    if(__DEV__) {
      setInterval(() => mapStatisticsStore.emit(getMapStatistics(this)), 1000);
    }
  }

  // the GPU is a shared resource and as such there are times when it might be taken away from the app.
  // examples: another page does something that takes the GPU too long and the browser
  // or the OS decides to reset the GPU to get control back. the event is called >>webglcontextlost<<
  handleLostContext() {
    const canvas = this.renderer.domElement;
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
    }, false);

    canvas.addEventListener('webglcontextrestored', () => {
      // at the point that this method is called the browser has reset all state
      // to the default WebGL state and all previously allocated resources are invalid.
      // so you need to re-create textures, buffers, framebuffers, renderbuffers, shaders, programs
      // and setup your state (clearColor, blendFunc, depthFunc, etc...)
      // to make it short... reload the page
      window.location.reload();
    }, false);
  }


  update(highResTimestamp) {
    //break the requestAnimationFrame loop if disposed
    if (this.disposed) {
      return;
    }

    requestAnimationFrame(this.update.bind(this));

    //fire event for updating stats
    eventBus.emit('beginUpdate', highResTimestamp);

    time.update(highResTimestamp);
    this.controller.update();

    //don't render scene if it is not needed
    if(!this.shouldRenderScene && !currentMetrics) {
      return;
    }

    if(currentMetrics) {
      eventBus.emit('updateTween', highResTimestamp);
    }

    this.updateCamera();
    eventBus.emit('endUpdate', {scene: this});

    this.render();
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
    const nodeSizeInPixel = aspect * 1500;

    if(this.nodeSizeInPixel !== nodeSizeInPixel) {
      this.nodeSizeInPixel = nodeSizeInPixel;
      stores.iconSize.emit(nodeSizeInPixel);
      this.renderScene();
    }
  }

  updateMetricHeights() {
    // this.singleMeshMetricFactory.updateHeights();

    if(currentMetrics) {
      eventBus.emit('upateMetricHeights');
      if(currentMetrics.size === 1) {
        this.singleMetricFactory.updateHeights();
      } else {
        this.multiMetricFactory.updateHeights();
      }
    }
  }

  updateMaterialsByZoomLevel(zoomLevel) {
    const maxZoomIn = 60;
    const maxZoomOut = 250;

    //[1 - max out, 0 - max in]
    let normedZoomLevel = zoomLevel / (maxZoomOut - maxZoomIn);
    normedZoomLevel = Math.min(0.9, Math.max(0.1, normedZoomLevel));

    this.highlightingSingleMeshFactory.material.opacity = normedZoomLevel;

    //if there is no cube isSelected, fade all cubes by distance
    if(!this.hullsAreInactive) {
      this.singleMeshFactory.material.opacity = normedZoomLevel;

      // this.singleMeshFactory.material.transparent = (zoomLevel < maxZoomOut);
    }
  }

  updateZoomLevelInCss(zoomUnits) {
    const parentClasses = this.parent.classList;

    zoom.zoomLevelsInDesign.forEach(level => {
      parentClasses.remove(getZoomClass(level));
    });
    parentClasses.add(getZoomClass(zoom.getZoomLevel(zoomUnits)));
  }


  render() {
    //first render the background
    const renderer = this.renderer;
    renderer.render(this.backgroundScene, this.backgroundCamera);

    //after rendering the background, render the hole scene
    renderer.render(this.scene, this.camera);

    //reset the flag to disable rendering if there is no update
    this.shouldRenderScene = false;

    if(__DEV__) {
      this.framesRendered++;
    }
  }

  //set this flag if the scene needs to be redrawn
  renderScene() {
    this.shouldRenderScene = true;
  }


  hideHulls() {
    this.hullsAreInactive = true;
    this.singleMeshFactory.material.opacity = 0.2;
    this.layerSingleMeshFactory.material.opacity = 0.2;
    this.baselineFactory.material.opacity = 0.2;
  }

  showHulls() {
    if(!currentMetrics) {
      this.hullsAreInactive = false;
      this.layerSingleMeshFactory.material.opacity = 0.9;
      this.baselineFactory.material.opacity = 1;
      this.updateMaterialsByZoomLevel(this.controller.zoomLevel);
    }
  }

  showMetrics() {
    this.renderScene();
  }

  hideMetrics(e) {
    if(e && e.hiddenByZoom) {
      this.hideMetricsOnZoomOut = true;
    } else {
      this.hideMetricsOnZoomOut = false;
    }

    //set this to undefined will not trigger any factory to update heights
    this.activeMetricFactory = undefined;

    this.renderScene();
  }

  setCameraFromSize() {
    //we start in the middle and go totalWidth / 2 to the left
    const camSizeHalf = this.cameraSize / 2;
    const aspect = this.width / this.height;

    this.camera.left = -camSizeHalf * aspect;
    this.camera.right = camSizeHalf * aspect;
    this.camera.bottom = -camSizeHalf;
    this.camera.top = camSizeHalf;

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

      //because there can be an octree on layer 7 and 5 but not on 6, check it's presence
      if(!octree) {
        continue;
      }

      const octree2Objects = octree.search(
        ray.origin,
        ray.far,
        true, //true -> organized by objects
        ray.direction)
        .filter(object => object.object.isEnabled);

      const intersections = raycaster.intersectOctreeObjects(octree2Objects);
      if (intersections.length > 0) {
        //the array is sorted by distance desc so take last item
        return intersections[intersections.length - 1].object;
      }
    }

    return undefined;
  }

  addSceneObject(obj) {
    this.scene.add(obj);
  }

  removeSceneObject(obj) {
    this.scene.remove(obj);
  }

  addCollisionObject(obj, layer = 0) {
    if(!obj) {
      return;
    }

    let octree = this.octrees[layer];
    if(!octree) {
      octree = this.octrees[layer] = this.createOctree();
    }
    octree.add(obj, {useFaces: false});
    octree.update();
  }

  removeCollisionObject(obj, layer = 0) {
    const octree = this.octrees[layer];
    if(octree) {
      octree.remove(obj);
      octree.rebuild();
    }
  }

  getHtmlContainer() {
    return this.parent;
  }

  onWindowResize() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.renderer.setSize(this.width, this.height);
    this.setCameraFromSize();

    // refresh to show the current state
    this.renderScene();
  }

  onZoom(event) {
    const zoomLevel = event.zoomLevel;

    // update the css design zoom distance
    this.updateZoomLevelInCss(zoomLevel);

    // update the opacity for the 3D elements
    this.updateMaterialsByZoomLevel(zoomLevel);
    this.map.onZoom(zoomLevel);

    // refresh to show the current state
    this.renderScene();
  }

  onObjectClicked(object, hoveredConnections) {
    if(object) {
      const sceneObject = object.parentSceneObject ? object.parentSceneObject : object;
      // only clear the store if there is no snapshot available or the object is unknown
      if(!sceneObject.snapshot || sceneObject.isUnknown) {
        selectedSnapshot.clear();
      }

      stores.selectedSceneObject.emit({sceneObject, calledByMap: true});

    // dont reset the click if you clicken on connections
    } else if(hoveredConnections.length === 0) {
      this.resetClicked();
    } else {
      tracking.trackEvent(tracking.events.clickOnConnectionBetweenCubes);
    }
  }

  resetClicked() {
    stores.selectedSceneObject.emit({sceneObject: null});
    highlightedSnapshot.clear();
    selectedSnapshot.clear();
  }

  //is called by map
  removeChild() {}

  clearStores() {
    stores.longClickedSceneObject.emit(null);
    stores.selectedSceneObject.emit(null);
    stores.currentTooltip.emit(null);
    stores.cursorPosition.emit(null);
    stores.currentScene.emit(null);
    stores.iconSize.emit(null);
    selectedSnapshot.clear();
  }

  //set this flag if the update loop should be stoped
  dispose() {
    this.disposed = true;

    this.adaptiveDetailHandler.dispose();

    //reset the time and clear all listeners
    time.reset();

    //make shure that there is no update incoming until disposing
    clearInterval(this.metricUpdateInterval);
    this.metricUpdateInterval = null;

    //dispose all subscriptions
    this.subscriptions.forEach(sub => sub.dispose());

    //destory the map which will destroy all groups and nodes
    this.map.dispose();

    //remove the gradient background from scene
    this.backgroundScene.remove(this.backgroundPlane);

    //dispose the background plane to get rid of WebGL context
    this.backgroundPlane.geometry.dispose();
    this.backgroundPlane.material.dispose();

    //remove the canvas and clear the parent div
    window.removeEventListener('resize', this.onWindowResizeHandler, false);
    this.parent.removeChild(this.canvas);
    this.canvas = null;

    this.clearStores();
  }
}
