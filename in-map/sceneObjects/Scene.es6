import THREE from 'three';

import {setScene, clearScene} from 'in-map/stores/sceneStore';
import Camera from 'in-map/sceneObjects/OrthographicCamera';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import {frame$} from 'in-map/stores/renderingStore';
import {theme} from 'in-services/theme';


export default class Scene extends SceneObject {

  constructor(params) {
    super(params.id);

    this.canvas = params.canvas;
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
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

    this.addSubscription(frame$.throttle(1000).subscribe(frame => this.update(frame)));
  }

  update(frame) {
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
    clearScene();

    this.camera.dispose();
    this.camera = null;

    this.renderer = null;
    this.canvas = null;
    this.height = null;
    this.width = null;
    this.scene = null;
  }
}
