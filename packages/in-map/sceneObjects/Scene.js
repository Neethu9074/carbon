/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import { clear as clearRenderingStore, requestRendering, frame$ } from 'in-map/stores/renderingStore';
import PhysicsServiceLocator from 'in-map/misc/serviceLocator/physics/PhysicsServiceLocator';
import { update as updateTime, getDeltaTime, reset as resetTime } from 'in-map/misc/time';
import createNullService from 'in-map/misc/serviceLocator/physics/PhysicsNullService';
import createPhysicsService from 'in-map/misc/serviceLocator/physics/PhysicsService';
import { setScene, clear as clearSceneStore } from 'in-map/stores/sceneStore';
import { clear as clearFactories } from 'in-map/stores/factoriesStore';
import { eventBus, createEventBus } from 'in-map/services/eventBus';
import { WebGLRenderer, Scene } from 'in-map/3DLibProvider';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import { setDimensions } from 'in-map/stores/indexStore';
import { debouncedResize$ } from 'in-services/browser';

export default class MainScene extends SceneObject {
  constructor(params) {
    super(params);

    // clears the old one and fires up a new to remove all stored messages
    createEventBus();

    // init service locator
    PhysicsServiceLocator.provide(createPhysicsService());

    // reset the time and clear all listeners
    resetTime();

    const chromeVersion = this.getChromeVersion();
    this.enableContinousRenderingEach30Frame = chromeVersion && chromeVersion >= 53 && chromeVersion <= 54;
    this.frameCounter = 0;

    this.isDisposed = false;
    this.canvas = params.canvas;
    this.shouldRenderScene = false;
    this.antialias = params.antialias;
    this.webGlContext = params.webGlContext;
    this.handleAnimationFrames = this.handleAnimationFrames.bind(this);
  }

  init() {
    super.init();

    this.setupRenderer();
    this.setupScene();

    setScene(this);
  }

  initEvents() {
    super.initEvents();

    const shouldRenderSceneCallback = () => (this.shouldRenderScene = true);
    this.addSubscriptions([
      frame$.subscribe(shouldRenderSceneCallback),
      debouncedResize$.subscribe(() => this.onResize())
    ]);

    this.handleAnimationFrames(0);
    this.onResize();
  }

  handleAnimationFrames(highResTimestamp) {
    // break the browser update routine
    if (this.isDisposed) {
      return;
    }

    // recall this to keep the update loop
    requestAnimationFrame(this.handleAnimationFrames);

    this.update(highResTimestamp);
  }

  update(highResTimestamp) {
    updateTime(highResTimestamp);
    const dt = getDeltaTime();

    eventBus.emit('update', dt);

    if (this.enableContinousRenderingEach30Frame) {
      this.frameCounter++;
      if (this.frameCounter >= 30) {
        this.frameCounter = 0;
        requestRendering();
      }
    }

    if (this.shouldRenderScene) {
      this.shouldRenderScene = false;

      eventBus.emit('willRenderObject', true);

      const camera = CameraControllerServiceLocator.getRenderableCamera();
      if (camera) {
        this.renderTarget.render(this.scene, camera);
      }
    }
  }

  setupRenderer() {
    const renderer = (this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      context: this.webGlContext,
      antialias: this.antialias === 'browserAA' ? true : false
    }));

    renderer.setClearColor(0x445b63, 1.0);

    // objects organize matrix updates by themselves
    renderer.autoUpdateObjects = false;
    this.renderTarget = renderer;
  }

  setupScene() {
    this.scene = new Scene();
  }

  onResize() {
    const canvas = this.canvas;
    const height = window.innerHeight - 150;
    const width = document.body.clientWidth - 72;

    this.renderer.setSize(width, height);
    setDimensions(width, height);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // refresh to show the current state
    requestRendering();
  }

  getChromeVersion() {
    const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    return raw ? parseInt(raw[2], 10) : false;
  }

  dispose() {
    super.dispose();

    // break the browser update routine
    this.isDisposed = true;

    clearRenderingStore();
    clearSceneStore();
    clearFactories();

    PhysicsServiceLocator.provide(createNullService());

    this.shouldRenderScene = null;
    this.renderTarget = null;
    this.antialias = null;
    this.renderer = null;
    this.canvas = null;
    this.scene = null;
  }
}
