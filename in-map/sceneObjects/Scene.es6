import THREE from 'three';

import {requestRendering} from 'in-map/stores/renderingStore';
import {setScene, clearScene} from 'in-map/stores/sceneStore';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import Camera from 'in-map/misc/OrthographicCamera';
import {frame$} from 'in-map/stores/renderingStore';
import {theme} from 'in-services/theme';


export default class Scene extends SceneObject {

  constructor(params) {
    super(params.id);

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

    this.handleAnimationFrames();

    this.addSubscriptions([
      frame$.throttle(1000).subscribe(() => this.shouldRenderScene = true)
    ]);

    window.addEventListener('resize', this.onWindowResizeHandler, false);
  }

  disposeEvents() {
    super.disposeEvents();

    window.removeEventListener('resize', this.onWindowResizeHandler, false);
  }

  handleAnimationFrames() {
    // break the browser update routine
    if (this.isDisposed) {
      return;
    }

    requestAnimationFrame(this.handleAnimationFrames);
    this.update();
  }

  update() {
    // update objects only if necessary
    this.camera.update();

    if (this.shouldRenderScene) {
      this.render();
    }
  }

  render() {
    console.log('render');
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

  onZoom() {}

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

  dispose() {
    // break the browser update routine
    this.isDisposed = true;

    clearScene();

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
