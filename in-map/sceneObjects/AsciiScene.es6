import { on } from 'reactive-observables';

import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import { clear as clearRenderingStore, requestRendering, frame$ } from 'in-map/stores/renderingStore';
import PhysicsServiceLocator from 'in-map/misc/serviceLocator/physics/PhysicsServiceLocator';
import { update as updateTime, getDeltaTime, reset as resetTime } from 'in-map/misc/time';
import createNullService from 'in-map/misc/serviceLocator/physics/PhysicsNullService';
import createPhysicsService from 'in-map/misc/serviceLocator/physics/PhysicsService';
import { setScene, clear as clearSceneStore } from 'in-map/stores/sceneStore';
import { clear as clearFactories } from 'in-map/stores/factoriesStore';
import { eventBus, createEventBus } from 'in-map/services/eventBus';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import { setDimensions } from 'in-map/stores/indexStore';
import { setCanvas } from 'in-map/stores/indexStore';
import { Scene } from 'in-map/3DLibProvider';
import theme from 'in-themes';

import CanvasRenderer from 'in-map/lib/CanvasRenderer.js';
import AsciiEffect from 'in-map/lib/AsciiEffect.js';

export default class AsciiScene extends SceneObject {
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
      on(window, 'resize').subscribe(this.onWindowResize.bind(this))
    ]);

    this.handleAnimationFrames(0);

    // send initial resize
    this.onWindowResize();
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
    let renderer;

    renderer = this.renderer = new CanvasRenderer({
      canvas: this.canvas
    });
    renderer.autoClearColor = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x010101);

    const effect = (this.asciiEffect = new AsciiEffect(renderer, undefined, {
      invert: true
    }));
    effect.setSize(window.innerWidth, window.innerHeight);

    const parent = document.getElementById('in-map');
    parent.removeChild(this.canvas);
    parent.appendChild(effect.domElement);

    setCanvas(effect.domElement);

    this.renderTarget = effect;

    requestRendering();
  }

  setupScene() {
    this.scene = new Scene();
  }

  onWindowResize() {
    const offset = theme.footer.height + theme.header.height;
    const height = window.innerHeight - offset;
    const width = window.innerWidth;
    const canvas = this.canvas;

    this.renderer.setSize(width, height);
    setDimensions(width, height);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    this.renderTarget.setSize(width, height);

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
