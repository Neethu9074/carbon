import THREE from 'three';

import {setSelectedSnapshotId, clearSelectedSnapshotId} from 'in-stores/snapshot';
import {mapStatisticsStore} from 'in-services/stores/mapStatistics';
import {hexToRGBNormalized} from 'in-services/converters';

import {activeMetric} from 'in-services/stores/metrics';
import * as tracking from 'in-services/tracking';
import eventBus from 'in-services/eventbus';
import {theme} from 'in-services/theme';

import './lib/CanvasRenderer';
import './lib/EffectComposer';
import './lib/ShaderExtras';
import './lib/AsciiEffect';
import './lib/ShaderPass';
import './lib/RenderPass';
import './lib/Projector';
import './lib/Octree';

import SingleMeshPointsFactory from './SingleMeshFactory/SingleMeshPointsFactory';
import SingleMeshMetricFactory from './SingleMeshFactory/SingleMeshMetricFactory';
import SingleMeshLineFactory from './SingleMeshFactory/SingleMeshLineFactory';
import SingleMeshFactory from './SingleMeshFactory/SingleMeshFactory';
import MapHandler from './SceneObjects/Maps/MapHandler';
import * as Handler from './AdaptiveDetailHandler';
import {getMapStatistics} from './mapStatistics';
import TooltipHandler from './TooltipHandler';
import * as time from './timeCalculations';
import * as stores from './mapStores';
import * as zoom from './zoom';


const getZoomClass = (level) => 'in-map--zoom-' + level;

const maxNodeOpacity = 0.6;

let currentMetrics;


export default class Scene {

  constructor({parent, onPlusClicked, antialias}) {
    stores.currentScene.emit(this); // set this scene to store
    stores.aspectRatio.emit(window.innerWidth / window.innerHeight);

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
    this.setupFactories();

    this.setup3D();

    this.mapHandler = new MapHandler({
      scene: this,
      height: this.height,
      width: this.width
    });

    this.adaptiveDetailHandler = new Handler.AdaptiveDetailHandler(this);

    this.setupEvents();
    this.handleLostContext();

    this.update = this.update.bind(this);
    this.update(0);
  }

  setup3D() {
    this.setupCanvas();

    // needs the scene, camera and renderer so do it last
    this.setupRenderer();
    this.setupFXAARenderPass();

    // set this flag to force a render cycle
    this.shouldRenderScene = true;
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

  setupFXAARenderPass() {
    if (this.antialias !== 'FXAA') {
      return;
    }

    const height = this.height;
    const width = this.width;

    const renderTarget = this.renderTarget = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter
    });

    const effectFXAA = this.fxaaEffect = new THREE.ShaderPass(THREE.ShaderExtras.fxaa);
    effectFXAA.uniforms.resolution.value.set(1 / width, 1 / height);
    effectFXAA.renderToScreen = true;

    const composer = new THREE.EffectComposer(this.webGLRenderer, renderTarget);
    composer.addPass(new THREE.RenderPass(this.scene, this.mapHandler.getCurrentCamera()));
    composer.addPass(effectFXAA);

    this.composer = composer;
  }

  setupFactories() {
    const scene = this;

    this.singleMeshMetricFactory = new SingleMeshMetricFactory({scene});

    this.groundSingleMeshFactory = new SingleMeshFactory({scene});
    this.groundSingleMeshFactory.material.transparent = true;
    this.groundSingleMeshFactory.material.opacity = 0.3;

    this.highlightingSingleMeshFactory = new SingleMeshFactory({scene, renderOrder: 4});

    this.layerHighlightingSingleMeshFactory = new SingleMeshFactory({scene});

    this.singleMeshFactory = new SingleMeshFactory({scene, renderOrder: 3});

    this.solidSingleMeshFactory = new SingleMeshFactory({scene, renderOrder: 3});
    this.solidSingleMeshFactory.material.opacity = 0.3;

    this.layerSingleMeshFactory = new SingleMeshFactory({scene});
    this.layerSingleMeshFactory.material.opacity = 0.3;
    this.layerSingleMeshFactory.material.transparent = false;
    this.layerSingleMeshFactory.material.color = new THREE.Color(0.85, 0.85, 0.85);

    this.lineFactory = new SingleMeshLineFactory({scene});

    this.groundLineFactory = new SingleMeshLineFactory({scene});
    this.groundLineFactory.material.opacity = 0.9;
    this.groundLineFactory.material.transparent = true;

    this.logoFactories = {};

    this.baselineFactory = new SingleMeshLineFactory({scene});
    this.baselineFactory.material.transparent = true;

    this.metricUpdateInterval = setInterval(() => {
      if (currentMetrics) {
        this.updateMetricHeights();
      }
    }, 1000);
  }

  updateFactories() {
    Object.keys(this.logoFactories).forEach(key => this.logoFactories[key].rebuild());

    this.layerHighlightingSingleMeshFactory.rebuild();
    this.highlightingSingleMeshFactory.rebuild();
    this.groundSingleMeshFactory.rebuild();
    this.layerSingleMeshFactory.rebuild();
    this.singleMeshMetricFactory.rebuild();
    this.singleMeshFactory.rebuild();
    this.solidSingleMeshFactory.rebuild();
    this.baselineFactory.rebuild();
    this.lineFactory.rebuild();
    this.groundLineFactory.rebuild();

    for (let i = this.octrees.length - 1; i >= 0; i--) {
      const octree = this.octrees[i];
      if (octree) {
        octree.update();
      }
    }
  }

  getOrCreateLogoFactory(id, snapshot) {
    let factory = this.logoFactories[id];
    if (!factory) {
      factory = this.logoFactories[id] = new SingleMeshPointsFactory({
        id,
        snapshot,
        scene: this
      });
    }
    return factory;
  }

  setupEvents() {
    this.tooltipHandler = new TooltipHandler();

    this.onWindowResizeHandler = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResizeHandler, false);

    this.subscriptions = [];

    window.addEventListener('keydown', (e) => {
      const char = String.fromCharCode(e.keyCode);
      if (!this.secretWord) {
        this.secretWord = '';
      }
      this.secretWord += char;
      if (this.secretWord.toLowerCase().match(/instana/i) && !this.doneMagic) {
        this.webGLRenderer.autoClearColor = true;
        this.asciiEffect = new THREE.AsciiEffect(this.webGLRenderer);
        this.asciiEffect.setSize(this.width, this.height);

        this.parent.removeChild(this.canvas);
        this.parent.appendChild(this.asciiEffect.domElement);

        this.mapHandler.switchToAscii();

        this.renderScene();
        this.doneMagic = true;
      }
    }, false);

    this.subscriptions.push(activeMetric.subscribe(metric => {
      // if there is an active metric, deselect the current selected obj and show the metric pillars
      if (metric) {
        currentMetrics = metric.get('metrics');
        this.showMetrics();
        this.resetClicked();
        this.hideHulls();

      } else {
        currentMetrics = undefined;
        this.hideMetrics();
        this.showHulls();
      }
    }));

    this.subscriptions.push(eventBus.on('onViewWillSwitch').subscribe(() => activeMetric.emit(null)));
    this.subscriptions.push(time.addTimeEventListener(this.updateFactories.bind(this)));

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

  updateMetricHeights() {
    if (currentMetrics) {
      this.singleMeshMetricFactory.updateHeights();
    }
  }

  updateMaterialsByZoomLevel(zoomLevel) {
    const maxZoomIn = 60;
    const maxZoomOut = 250;

    // [1 - max out, 0 - max in]
    let normedZoomLevel = zoomLevel / (maxZoomOut - maxZoomIn);
    normedZoomLevel = Math.min(maxNodeOpacity, Math.max(0.1, normedZoomLevel));

    this.highlightingSingleMeshFactory.material.opacity = normedZoomLevel;

    // if there is no cube isSelected, fade all cubes by distance
    if (!this.hullsAreInactive) {
      this.singleMeshFactory.material.opacity = normedZoomLevel;
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
    const camera = this.mapHandler.getCurrentCamera();

    if (this.doneMagic) {
      this.asciiEffect.render(this.scene, camera);
    } else {
      if (this.antialias === 'FXAA') {
        this.composer.render();
      } else {
        this.webGLRenderer.render(this.scene, camera);
      }
    }

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

  hideHulls() {
    this.hullsAreInactive = true;
    this.singleMeshFactory.material.opacity = 0.3;
    this.layerSingleMeshFactory.material.transparent = true;
    this.layerSingleMeshFactory.material.depthWrite = false;
    this.baselineFactory.material.opacity = 0.3;
    this.solidSingleMeshFactory.material.transparent = true;
  }

  showHulls() {
    if (!currentMetrics) {
      this.hullsAreInactive = false;
      this.layerSingleMeshFactory.material.transparent = false;
      this.layerSingleMeshFactory.material.depthWrite = true;
      this.baselineFactory.material.opacity = 1;
      this.solidSingleMeshFactory.material.transparent = false;
      this.updateMaterialsByZoomLevel(this.mapHandler.getCurrentZoomLevel());
    }
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

    // set this to undefined will not trigger any factory to update heights
    this.activeMetricFactory = undefined;
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

    stores.aspectRatio.emit(width / height);

    this.canvas.height = height;
    this.canvas.width = width;

    if (this.fxaaEffect) {
      this.fxaaEffect.uniforms.resolution.value.set(1 / width, 1 / height);
      this.renderTarget.setSize(width, height);
      this.composer.setSize(width, height);
    }
    if (this.asciiEffect) {
      this.asciiEffect.setSize(width, height);
    }
    this.webGLRenderer.setSize(width, height);
    this.mapHandler.onWindowResize(width, height);

    // refresh to show the current state
    this.renderScene();
  }

  onZoom(event) {
    const zoomLevel = event.zoomLevel;

    // update the css design zoom distance
    this.updateZoomLevelInCss(zoomLevel);

    // update the opacity for the 3D elements
    this.updateMaterialsByZoomLevel(zoomLevel);

    if (this.mapHandler) {
      this.mapHandler.onZoom(zoomLevel);
    }

    // refresh to show the current state
    this.renderScene();
  }

  onObjectClicked(object, hoveredConnections) {
    if (object) {
      const sceneObject = object.parentSceneObject ? object.parentSceneObject : object;
      setSelectedSnapshotId(sceneObject.id);
    // dont reset the click if you clicken on connections
    } else if (hoveredConnections.length === 0) {
      this.resetClicked();
    } else {
      tracking.events.clickOnConnectionBetweenCubes();
    }
  }

  resetClicked() {
    clearSelectedSnapshotId();
  }

  // is called by map
  removeChild() {}

  clearStores() {
    clearSelectedSnapshotId();
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

    // make shure that there is no update incoming until disposing
    clearInterval(this.metricUpdateInterval);
    this.metricUpdateInterval = null;

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
