import {frame$, requestRendering, clear as clearRenderingStore} from 'in-map/stores/renderingStore';
import PhysicsServiceLocator from 'in-map/misc/serviceLocator/physics/PhysicsServiceLocator';
import createNullService from 'in-map/misc/serviceLocator/physics/PhysicsNullService';
import createPhysicsService from 'in-map/misc/serviceLocator/physics/PhysicsService';
import {setScene, clear as clearSceneStore} from 'in-map/stores/sceneStore';
import {clear as clearFactories} from 'in-map/stores/factoriesStore';
import {eventBus, createEventBus} from 'in-map/services/eventBus';
import {WebGLRenderer, Scene, Color} from 'in-map/3DLibProvider';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import Camera from 'in-map/misc/OrthographicCamera';
import * as time from 'in-map/misc/time';
import {theme} from 'in-services/theme';


export default class MainScene extends SceneObject {

  constructor(params) {
    super(params.id);

    // clears the old one and fires up a new to remove all stored messages
    createEventBus();

    // init service locator
    PhysicsServiceLocator.provide(createPhysicsService());

    // reset the time and clear all listeners
    time.reset();

    this.isDisposed = false;
    this.canvas = params.canvas;
    this.shouldRenderScene = false;
    this.antialias = params.antialias;
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

    this.addSubscription(frame$.subscribe(() => this.shouldRenderScene = true));

    window.addEventListener('resize', this.onWindowResizeHandler, false);
    this.handleLostContext();
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

    if (this.shouldRenderScene) {
      this.shouldRenderScene = false;

      eventBus.emit('willRenderObject', true);
      this.renderer.render(this.scene, this.camera.getRenderableCamera());
    }
  }

  setupRenderer() {
    const renderer = this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: this.antialias === 'browserAA' ? true : false
    });

    renderer.setSize(this.width, this.height);
    renderer.setClearColor(new Color(theme.map.colors.clearColor));

    // objects organize matrix updates by themselves
    renderer.autoUpdateObjects = false;
  }

  setupScene() {
    this.scene = new Scene();
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

  // the GPU is a shared resource and as such there are times when it might be taken away from the app.
  // examples: another page does something that takes the GPU too long and the browser
  // or the OS decides to reset the GPU to get control back. the event is called >>webglcontextlost<<
  handleLostContext() {
    const canvas = this.canvas;
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

  dispose() {
    // break the browser update routine
    this.isDisposed = true;

    clearRenderingStore();
    clearSceneStore();
    clearFactories();

    PhysicsServiceLocator.provide(createNullService());

    this.camera.dispose();
    this.camera = null;

    this.shouldRenderScene = null;
    this.antialias = null;
    this.renderer = null;
    this.canvas = null;
    this.height = null;
    this.width = null;
    this.scene = null;
  }
}
