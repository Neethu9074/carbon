import { on } from 'reactive-observables';

import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import { clear as clearRenderingStore, requestRendering, frame$ } from 'in-map/stores/renderingStore';
import PhysicsServiceLocator from 'in-map/misc/serviceLocator/physics/PhysicsServiceLocator';
import { update as updateTime, getDeltaTime, reset as resetTime } from 'in-map/misc/time';
import createNullService from 'in-map/misc/serviceLocator/physics/PhysicsNullService';
import createPhysicsService from 'in-map/misc/serviceLocator/physics/PhysicsService';
import { setScene, clear as clearSceneStore } from 'in-map/stores/sceneStore';
import { contextIsLost, contextIsAvailable } from 'in-map/services/webGL';
import { clear as clearFactories } from 'in-map/stores/factoriesStore';
import { eventBus, createEventBus } from 'in-map/services/eventBus';
import { WebGLRenderer, Scene } from 'in-map/3DLibProvider';
import { loadVREffectWrapper } from 'in-map/services/webVR';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import { isWebVRActive } from 'in-map/stores/webVRStore';
import { setDimensions } from 'in-map/stores/indexStore';
import theme from 'in-services/theme';

export default class MainScene extends SceneObject {
  constructor(params) {
    super(params);

    // clears the old one and fires up a new to remove all stored messages
    createEventBus();

    contextIsAvailable();

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

    this.addSubscriptions([
      frame$.subscribe(() => this.shouldRenderScene = true),
      on(window, 'resize').subscribe(this.onWindowResize.bind(this))
    ]);

    if (isWebVRActive) {
      this.addSubscription(
        eventBus.on('enterFullscreen').subscribe(shouldEnter => {
          if (shouldEnter) {
            this.renderTarget.isPresenting ? this.renderTarget.exitPresent() : this.renderTarget.requestPresent();
            eventBus.emit('enterFullscreen', false);
          }
        })
      );
    }

    this.handleLostContext();
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
    const renderer = (this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      context: this.webGlContext,
      antialias: this.antialias === 'browserAA' ? true : false
    }));

    renderer.setSize(0, 0);
    renderer.setClearColor(0x445b63, 1.0);

    // objects organize matrix updates by themselves
    renderer.autoUpdateObjects = false;

    if (isWebVRActive) {
      const VREffectClass = loadVREffectWrapper();
      this.renderTarget = new VREffectClass(renderer);
    } else {
      this.renderTarget = renderer;
    }
  }

  setupScene() {
    this.scene = new Scene();
  }

  onWindowResize() {
    const offset = isWebVRActive ? 0 : theme.header.height + theme.footer.height;
    const height = window.innerHeight - offset;
    const width = window.innerWidth;

    const canvas = this.canvas;
    const ratio = isWebVRActive ? window.devicePixelRatio || 1 : 1;

    this.renderer.setSize(width * ratio, height * ratio);
    setDimensions(width * ratio, height * ratio);
    canvas.setAttribute('width', width * ratio);
    canvas.setAttribute('height', height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // refresh to show the current state
    requestRendering();
  }

  // the GPU is a shared resource and as such there are times when it might be taken away from the app.
  // examples: another page does something that takes the GPU too long and the browser
  // or the OS decides to reset the GPU to get control back. the event is called >>webglcontextlost<<
  handleLostContext() {
    this.addSubscriptions([
      on(this.canvas, 'webglcontextlost').subscribe(event => {
        event.preventDefault();
        contextIsLost();
      }),
      on(this.canvas, 'webglcontextrestored').subscribe(() => {
        // at the point that this method is called the browser has reset all state
        // to the default WebGL state and all previously allocated resources are invalid.
        // so you need to re-create textures, buffers, framebuffers, renderbuffers, shaders, programs
        // and setup your state (clearColor, blendFunc, depthFunc, etc...)
        // to make it short... reload the page
        contextIsAvailable();
        window.location.reload();
      })
    ]);
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
    contextIsAvailable();

    this.shouldRenderScene = null;
    this.renderTarget = null;
    this.antialias = null;
    this.renderer = null;
    this.canvas = null;
    this.scene = null;
  }
}
