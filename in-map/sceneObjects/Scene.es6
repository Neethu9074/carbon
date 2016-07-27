import THREE from 'three';

import {setScene, clearScene, requestFrame, requestedFrame$} from 'in-map/stores/sceneStore';
import Camera from 'in-map/sceneObjects/OrthographicCamera';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import {theme} from 'in-services/theme';


export default class Scene extends SceneObject {

  constructor(params) {
    super(params);

    this.isDisposed = false;
    this.canvas = params.canvas;
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;

    this.handleAnimationFrames = this.handleAnimationFrames.bind(this);

    console.log('create scene');
  }

  init() {
    super.init();

    console.log('init scene');
    this.setupRenderer();
    this.setupScene();
    this.setupCamera();

    setScene(this);
  }

  initEvents() {
    super.initEvents();
    console.log('initEvents scene');
    this.handleAnimationFrames();

    requestedFrame$.throttle(5000).subscribe(frame => this.update(frame));
  }

  handleAnimationFrames() {
    // break the browser update routine
    if (this.isDisposed) {
      return;
    }

    requestAnimationFrame(this.handleAnimationFrames);
    requestFrame();
  }

  update(frame) {
    console.log('update scene');

    // update objects only if necessary
    this.camera.update();

    this.render(frame);
  }

  render(frame) {
    console.log('render frame', frame);
    this.renderer.render(this.scene, this.camera.getRenderableCamera());
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

  dispose() {
    // break the browser update routine
    this.isDisposed = true;

    clearScene();

    console.log('dispose scene');

    this.camera.dispose();
    this.camera = null;

    this.renderer = null;
    this.canvas = null;
    this.height = null;
    this.width = null;
    this.scene = null;
  }
}
