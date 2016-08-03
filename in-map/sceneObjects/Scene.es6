import THREE from 'three';

import {requestRendering, clear as clearRenderingStore} from 'in-map/stores/renderingStore';
import {init as initPhysics, dispose as disposePhysics} from 'in-map/misc/Physics';
import {setSelectedSnapshotId, clearSelectedSnapshotId} from 'in-stores/snapshot';
import {setScene, clear as clearSceneStore} from 'in-map/stores/sceneStore';
import {eventBus, createEventBus} from 'in-map/services/eventBus';
import {clear as clearFactories} from 'in-map/misc/Factories';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import {clearSelectedIncident} from 'in-stores/incident';
import {clearSelectedEvent} from 'in-stores/events';
import Camera from 'in-map/misc/OrthographicCamera';
import {frame$} from 'in-map/stores/renderingStore';
import * as time from 'in-map/misc/time';
import {theme} from 'in-services/theme';


export default class Scene extends SceneObject {

  constructor(params) {
    super(params.id);

    // clears the old one and fires up a new to remove all stored messages
    createEventBus();
    initPhysics();

    // reset the time and clear all listeners
    time.reset();

    this.isDisposed = false;
    this.canvas = params.canvas;
    this.shouldRenderScene = false;
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;

    this.handleAnimationFrames = this.handleAnimationFrames.bind(this);
    this.onWindowResizeHandler = this.onWindowResize.bind(this);
  }

  init() {
    super.init();

    this.setupRenderer();
    this.setupScene();
    this.setupCamera();

    setScene(this);
  }

  initEvents() {
    super.initEvents();

    this.handleAnimationFrames(0);

    this.addSubscriptions([
      frame$.subscribe(() => this.shouldRenderScene = true)
    ]);

    window.addEventListener('resize', this.onWindowResizeHandler, false);
  }

  disposeEvents() {
    super.disposeEvents();

    window.removeEventListener('resize', this.onWindowResizeHandler, false);
  }

  handleAnimationFrames(highResTimestamp) {
    // break the browser update routine
    if (this.isDisposed) {
      return;
    }

    requestAnimationFrame(this.handleAnimationFrames);
    this.update(highResTimestamp);
  }

  update(highResTimestamp) {
    time.update(highResTimestamp);
    const dt = time.getDeltaTime();

    eventBus.emit('update', dt);
    this.camera.update();

    eventBus.emit('lateUpdate', dt);

    if (this.shouldRenderScene) {
      eventBus.emit('willRenderObject', true);
      this.render();
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera.getRenderableCamera());
    this.shouldRenderScene = false;
  }

  setupRenderer() {
    const renderer = this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });

    renderer.setSize(this.width, this.height);
    renderer.setClearColor(new THREE.Color(theme.map.colors.clearColor));

    // objects organize matrix updates by themselves
    renderer.autoUpdateObjects = false;
  }

  setupScene() {
    this.scene = new THREE.Scene();
  }

  setupCamera() {
    this.camera = new Camera(this.width, this.height);
  }

  onWindowResize() {
    const height = this.height = window.innerHeight;
    const width = this.width = window.innerWidth;

    this.canvas.height = height;
    this.canvas.width = width;

    this.renderer.setSize(width, height);

    this.camera.setSize(width, height);
    this.camera.setCameraFromSize();

    // refresh to show the current state
    requestRendering();
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

  dispose() {
    // break the browser update routine
    this.isDisposed = true;

    clearRenderingStore();
    clearSceneStore();
    clearFactories();
    disposePhysics();

    this.camera.dispose();
    this.camera = null;

    this.shouldRenderScene = null;
    this.renderer = null;
    this.canvas = null;
    this.height = null;
    this.width = null;
    this.scene = null;
  }
}
