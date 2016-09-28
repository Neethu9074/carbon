import {on} from 'reactive-observables';

import {
  clear as clearRenderingStore,
  requestRendering,
  updatesEnabled$,
  frame$
} from 'in-map/stores/renderingStore';
import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import PhysicsServiceLocator from 'in-map/misc/serviceLocator/physics/PhysicsServiceLocator';
import {update as updateTime, getDeltaTime, reset as resetTime} from 'in-map/misc/time';
import createNullService from 'in-map/misc/serviceLocator/physics/PhysicsNullService';
import createPhysicsService from 'in-map/misc/serviceLocator/physics/PhysicsService';
import {setScene, clear as clearSceneStore} from 'in-map/stores/sceneStore';
import {clear as clearFactories} from 'in-map/stores/factoriesStore';
import {eventBus, createEventBus} from 'in-map/services/eventBus';
import {WebGLRenderer, Scene, Color} from 'in-map/3DLibProvider';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import {loadVREffectWrapper} from 'in-map/services/webVR';
import {isWebVRActive} from 'in-map/stores/webVRStore';
import {setDimensions} from 'in-map/stores/indexStore';
import {theme} from 'in-services/theme';


export default class MainScene extends SceneObject {

  constructor(params) {
    super(params);

    // clears the old one and fires up a new to remove all stored messages
    createEventBus();

    // init service locator
    PhysicsServiceLocator.provide(createPhysicsService());

    // reset the time and clear all listeners
    resetTime();

    this.isDisposed = false;
    this.canvas = params.canvas;
    this.shouldRenderScene = false;
    this.updateSceneObjects = true;
    this.antialias = params.antialias;
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

      on(window, 'resize').subscribe(this.onWindowResize.bind(this)),

      updatesEnabled$.subscribe(isEnabled => this.updateSceneObjects = isEnabled)
    ]);

    if (isWebVRActive) {
      this.addSubscription(
        eventBus.on('enterFullscreen').subscribe(shouldEnter => {
          if (shouldEnter) {
            this.renderTarget.isPresenting
              ? this.renderTarget.exitPresent()
              : this.renderTarget.requestPresent();
            eventBus.emit('enterFullscreen', false);
          }
        }));
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

    if (this.updateSceneObjects) {
      this.update(highResTimestamp);
    }
  }

  update(highResTimestamp) {
    updateTime(highResTimestamp);
    const dt = getDeltaTime();

    eventBus.emit('update', dt);

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
    const renderer = this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: this.antialias === 'browserAA' ? true : false
    });

    renderer.setSize(0, 0);
    renderer.setClearColor(new Color(theme.map.colors.clearColor), 1.0);

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

    setDimensions(width, height);

    this.canvas.setAttribute('width', width);
    this.canvas.setAttribute('height', height);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.renderer.setSize(width, height);

    // refresh to show the current state
    requestRendering();
  }

  // the GPU is a shared resource and as such there are times when it might be taken away from the app.
  // examples: another page does something that takes the GPU too long and the browser
  // or the OS decides to reset the GPU to get control back. the event is called >>webglcontextlost<<
  handleLostContext() {
    this.addSubscriptions([
      on(this.canvas, 'webglcontextlost').subscribe(event => event.preventDefault()),

      on(this.canvas, 'webglcontextrestored').subscribe(() => {
        // at the point that this method is called the browser has reset all state
        // to the default WebGL state and all previously allocated resources are invalid.
        // so you need to re-create textures, buffers, framebuffers, renderbuffers, shaders, programs
        // and setup your state (clearColor, blendFunc, depthFunc, etc...)
        // to make it short... reload the page
        window.location.reload();
      })
    ]);
  }

  dispose() {
    // break the browser update routine
    this.isDisposed = true;

    clearRenderingStore();
    clearSceneStore();
    clearFactories();

    PhysicsServiceLocator.provide(createNullService());

    this.updateSceneObjects = null;
    this.shouldRenderScene = null;
    this.renderTarget = null;
    this.antialias = null;
    this.renderer = null;
    this.canvas = null;
    this.scene = null;
  }
}
