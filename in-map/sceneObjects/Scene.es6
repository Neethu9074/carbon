import THREE from 'three';

import {requestFrame, requestedFrame$} from 'in-map/stores/sceneStore';
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
  }

  initEvents() {
    super.initEvents();
    console.log('initEvents scene');
    this.handleAnimationFrames();

    requestedFrame$.throttle(5000).subscribe(frame => {
      this.update();
      this.render(frame);
    });
  }

  handleAnimationFrames() {
    // break the browser update routine
    if (this.isDisposed) {
      return;
    }

    requestAnimationFrame(this.handleAnimationFrames);
    requestFrame();
  }

  update() {
    console.log('update scene');
  }

  render(frame) {
    console.log('render frame', frame);
    this.renderer.render(this.scene, this.camera);
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
    this.camera = new THREE.OrthographicCamera(
      1, -1, 1, -1,
      0.1, // near
      2000 // far
    );
  }

  dispose() {
    this.isDisposed = true;

    console.log('dispose scene');

    this.renderer = null;
    this.camera = null;
    this.canvas = null;
    this.height = null;
    this.width = null;
    this.scene = null;
  }
}
