import THREE from 'three';

import {setSelectedSnapshotId, clearSelectedSnapshotId} from 'in-stores/snapshot';
import TooltipHandler from 'in-map/src/2DSceneObjects/tooltips/TooltipHandler';
import {highlightedEntityId} from 'in-services/stores/highlightedEntityId';
import {mapStatisticsStore} from 'in-services/stores/mapStatistics';
import {hexToRGBNormalized} from 'in-services/formatters/color';
import {clearSelectedIncident} from 'in-stores/incident';
import {activeMetric} from 'in-services/stores/metrics';
import {clearSelectedEvent} from 'in-stores/events';
import {theme} from 'in-services/theme';
import eventBus from 'in-map/eventbus';

import './lib/Octree';

import MapHandler from './3DSceneObjects/common/MapHandler';
import * as Handler from './AdaptiveDetailHandler';
import {getMapStatistics} from './mapStatistics';
import * as time from './timeCalculations';
import * as stores from './mapStores';


let currentMetrics;

export default class Scene {

  constructor({parent, onPlusClicked, antialias}) {
    stores.currentScene.emit(this); // set this scene to store

    this.onPlusClicked = onPlusClicked;
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.antialias = antialias;
    this.parent = parent;

    if (__DEV__) {
      this.framesRendered = 0;
    }

    this.octrees = [];

    // this is the main scene for all scene objects like nodes or metrics
    this.scene = new THREE.Scene();

    this.setupCanvas();
    this.setupRenderer();
    this.mapHandler = new MapHandler({
      scene: this,
      height: this.height,
      width: this.width
    });
    this.mapHandler.subscribe();

    this.adaptiveDetailHandler = new Handler.AdaptiveDetailHandler(this);

    this.setupEvents();
    this.handleLostContext();

    this.update = this.update.bind(this);
    this.update(0);
  }

  createOctree() {
    return new THREE.Octree({
      // uncomment below to see the octree (may kill the fps)
      // scene: this.scene,
      // when undeferred = true, objects are inserted immediately
      // instead of being deferred until next octree.update() call
      // this may decrease performance as it forces a matrix update
      undeferred: false,
      // set the max depth of tree
      depthMax: 16,
      // max number of objects before nodes split or merge
      objectsThreshold: 16,
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
    const renderer = this.webGLRenderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this.antialias === 'browserAA' ? true : false
    });
    renderer.setSize(this.width, this.height);

    const clearColor = hexToRGBNormalized(theme.map.colors.clearColor);
    renderer.setClearColor(new THREE.Color(clearColor.r, clearColor.g, clearColor.b));

    // objects organize matrix updat by themselves
    renderer.autoUpdateObjects = false;
  }

  updateOctrees() {
    for (let i = this.octrees.length - 1; i >= 0; i--) {
      const octree = this.octrees[i];
      if (octree) {
        octree.update();
      }
    }
  }

  setupEvents() {
    this.tooltipHandler = new TooltipHandler();

    this.onWindowResizeHandler = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResizeHandler, false);

    this.subscriptions = [];

    this.subscriptions.push(activeMetric.subscribe(metric => {
      // if there is an active metric, deselect the current selected obj and show the metric pillars
      if (metric) {
        currentMetrics = metric.get('metrics');
        this.showMetrics();
        this.resetClicked();
      } else {
        currentMetrics = undefined;
        this.hideMetrics();
      }
    }));

    this.subscriptions.push(eventBus.on('onViewWillSwitch').subscribe(() => activeMetric.emit(null)));
    this.subscriptions.push(time.addTimeEventListener(this.updateOctrees.bind(this)));

    // if something is highlighted, change cursor to pointer
    this.subscriptions.push(highlightedEntityId.subscribe(highlightedId => {
      if (highlightedId) {
        this.parent.style.cursor = 'pointer';
      } else {
        this.parent.style.cursor = 'auto';
      }
    }));

    if (__DEV__) {
      setInterval(() => mapStatisticsStore.emit(getMapStatistics(this)), 1000);
    }
  }

  // the GPU is a shared resource and as such there are times when it might be taken away from the app.
  // examples: another page does something that takes the GPU too long and the browser
  // or the OS decides to reset the GPU to get control back. the event is called >>webglcontextlost<<
  handleLostContext() {
    const canvas = this.webGLRenderer.domElement;
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
    // break the requestAnimationFrame loop if disposed
    if (this.disposed) {
      return;
    }

    requestAnimationFrame(this.update);

    // fire event for updating stats
    eventBus.emit('beginUpdate', highResTimestamp);

    time.update(highResTimestamp);

    this.mapHandler.update();

    // don't render scene if it is not needed
    if (!this.shouldRenderScene && !currentMetrics) {
      return;
    }

    if (currentMetrics) {
      eventBus.emit('updateTween', highResTimestamp);
    }

    this.mapHandler.updateCamera();
    eventBus.emit('endUpdate', {scene: this});

    this.render();
  }

  render() {
    const camera = this.mapHandler.getCurrentCamera();

    this.webGLRenderer.render(this.scene, camera);

    // reset the flag to disable rendering if there is no update
    this.shouldRenderScene = false;

    if (__DEV__) {
      this.framesRendered++;
    }
  }

  // set this flag if the scene needs to be redrawn
  renderScene() {
    this.shouldRenderScene = true;
  }

  showMetrics() {
    this.renderScene();
  }

  hideMetrics(e) {
    if (e && e.hiddenByZoom) {
      this.hideMetricsOnZoomOut = true;
    } else {
      this.hideMetricsOnZoomOut = false;
    }

    this.renderScene();
  }

  findObjectByRay(raycaster) {
    raycaster.far = Math.min(2500, raycaster.far); // [0, 2500]
    const ray = raycaster.ray;

    // iterate all octrees backwards from the highest layer to the lowest
    for (let i = this.octrees.length - 1; i >= 0; i--) {
      const octree = this.octrees[i];

      // because there can be an octree on layer 7 and 5 but not on 6, check it's presence
      if (!octree) {
        continue;
      }

      const octree2Objects = octree.search(
        ray.origin,
        ray.far,
        true, // true -> organized by objects
        ray.direction)
        .filter(object => object.object.isEnabled);

      const intersections = raycaster.intersectOctreeObjects(octree2Objects);
      if (intersections.length > 0) {
        return intersections.sort((i1, i2) => i1.distance - i2.distance)[0].object;
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
    if (!obj) {
      return;
    }

    let octree = this.octrees[layer];
    if (!octree) {
      octree = this.octrees[layer] = this.createOctree();
    }
    octree.add(obj, {useFaces: false});
  }

  removeCollisionObject(obj, layer = 0) {
    const octree = this.octrees[layer];
    if (octree) {
      octree.remove(obj);
    }
  }

  getHtmlContainer() {
    return this.parent;
  }

  onWindowResize() {
    const height = this.height = window.innerHeight;
    const width = this.width = window.innerWidth;

    this.canvas.height = height;
    this.canvas.width = width;

    this.webGLRenderer.setSize(width, height);
    this.mapHandler.onWindowResize(width, height);

    // refresh to show the current state
    this.renderScene();
  }

  onZoom(event) {
    const zoomLevel = event.zoomLevel;

    if (this.mapHandler) {
      this.mapHandler.onZoom(zoomLevel);
    }

    // refresh to show the current state
    this.renderScene();
  }

  onObjectClicked({hittenObject, hoveredConnections}) {
    if (hittenObject) {
      const parentSceneObject = hittenObject.parentSceneObject;
      const sceneObject = parentSceneObject ? parentSceneObject : hittenObject;
      setSelectedSnapshotId(sceneObject.id);
    // dont reset the click if you clicken on connections
    } else if (hoveredConnections.length === 0) {
      this.resetClicked();
    } else {
      setSelectedSnapshotId(hoveredConnections[0].id);
    }
  }

  resetClicked() {
    clearSelectedSnapshotId();
    clearSelectedIncident();
    clearSelectedEvent();
  }

  // is called by map
  removeChild() {}

  clearStores() {
    clearSelectedSnapshotId();
    clearSelectedIncident();
    clearSelectedEvent();
    stores.longClickedSceneObject.emit(null);
    stores.currentTooltip.emit(null);
    stores.cursorPosition.emit(null);
    stores.currentScene.emit(null);
  }

  // set this flag if the update loop should be stoped
  dispose() {
    this.disposed = true;

    this.adaptiveDetailHandler.dispose();

    this.tooltipHandler.dispose();

    // reset the time and clear all listeners
    time.reset();

    // dispose all subscriptions
    this.subscriptions.forEach(sub => sub.dispose());

    // destory the map which will destroy all groups and nodes
    this.mapHandler.dispose();

    // remove the canvas and clear the parent div
    window.removeEventListener('resize', this.onWindowResizeHandler, false);
    window.removeEventListener('keydown', this.onWindowResizeHandler, false);

    try {
      this.parent.removeChild(this.canvas);
    } finally {
      this.canvas = null;
    }

    this.clearStores();
  }
}
