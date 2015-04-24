'use strict';

import THREE from 'three';

import colors from './colors';
import PhysicalMap from './sceneObjects/PhysicalMap';
import RxEmitter from 'rxemitter';
import MouseCameraController from './controls/mouseCameraController';
import TouchCameraController from './controls/touchCameraController';


export default class Scene {

  constructor({parent}) {
    this.bindMethods();

    this.parent = parent;
		this.width = window.innerWidth;
		this.height = window.innerHeight;
    this.cameraSize = 30;

    //time properties
		this.timeOfLastFrameUpdate = Date.now();
		this.deltaTime = 0;
		this.timeSinceFirstFrame = 0;

		this.emitter = new RxEmitter();

    this.setup3D();

    //controls
    this.controller = new MouseCameraController({scene: this});
    //this.controller = new TouchCameraController({scene: this});
    this.controller.zoom(0);

    this.update();

    window.addEventListener('resize', this.onWindowResize, false);
  }

  addSceneObject(obj) {
    this.scene.add(obj);
  }

  removeSceneObject(obj) {
    this.scene.remove(obj);
  }

  bindMethods() {
		this.onWindowResize = this.onWindowResize.bind(this);
    this.update = this.update.bind(this);
	}

  setup3D() {
    const width = this.width;
    const height = this.height;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(colors.renderClearColor);

    //add webGLRenderer to dom element
    this.parent.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.map = new PhysicalMap({scene: this});

    /*
    //set the farplane as near as possible
    this.camera = new THREE.PerspectiveCamera(
      30, //fov
      width / height, //aspect
      0.5, //near
      2000); //far
    */

    const aspect = width / height;
    const left = -this.cameraSize / 2 * aspect;
    const top = this.cameraSize / 2;
    this.camera = new THREE.OrthographicCamera(
      left, -left, top, -top,
      0.1, //near
      5000 //far
    );

    this.camera.position.set(-1, 1, 1);
    this.camera.lookAt(new THREE.Vector3());
  }

  onWindowResize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.renderer.setSize(this.width, this.height);

		const aspect = this.width / this.height;
    this.camera.left = -this.cameraSize / 2 * aspect;
    this.camera.right = this.cameraSize / 2 * aspect;
		this.camera.updateProjectionMatrix();
	}

  getWorldPosition() {
    return new THREE.Vector3();
  }

	calculateDeltaTime() {
		const timeNow = Date.now();
		this.deltaTime = (timeNow - this.timeOfLastFrameUpdate) / 1000; //in ms
		this.timeOfLastFrameUpdate = timeNow;
		this.timeSinceFirstFrame += this.deltaTime;
	}

  update() {
    if(this.disposed){
      return;
    }
    requestAnimationFrame(this.update);

    //fire event for updating stats
		this.emitter.emit('beginUpdate');

    this.calculateDeltaTime();
    this.controller.update(this.deltaTime);

    //update is done
		this.emitter.emit('endUpdate', {scene: this });

    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
  }

  getHtmlContainer() {
    return this.parent;
  }

  on(event) {
    return this.emitter.on(event);
  }

  onZoom(event) {
    this.emitter.emit('zoom', event);

    const zoomLevel = event.zoomLevel;
    this.cameraSize = zoomLevel / 10;
    const aspect = this.width / this.height;
    this.camera.left = -this.cameraSize / 2 * aspect;
    this.camera.right = this.cameraSize / 2 * aspect;
    this.camera.top = this.cameraSize / 2;
    this.camera.bottom = -this.cameraSize / 2;
		this.camera.updateProjectionMatrix();
  }
}
