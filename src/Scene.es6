'use strict';

import THREE from 'three.js';

import Colors from './Colors';
import PhysicalMap from './sceneObjects/PhysicalMap';


export default class Scene {

  constructor({parent}) {
    this.bindMethods();

    this.parent = parent;
		this.width = window.innerWidth;
		this.height = window.innerHeight;

    //time properties
		this.timeOfLastFrameUpdate = Date.now();
		this.deltaTime = 0;
		this.timeSinceFirstFrame = 0;

    this.setup3D();
    this.update();

    window.addEventListener('resize', this.onWindowResize, false);
  }

  addSceneObject(obj) {
    this.scene.add(obj);
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
    this.renderer.setClearColor(Colors.renderClearColor);

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

    const size = 10;
    const aspect = width / height;
    this.camera = new THREE.OrthographicCamera(
      -size / 2 * aspect,
      size / 2 * aspect,
      size / 2,
      -size / 2,
      0.5,
      2000);

    this.camera.position.set(-10, 10, 10);
    this.camera.lookAt(new THREE.Vector3());
  }

  onWindowResize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.renderer.setSize(this.width, this.height);

		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();
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

    this.calculateDeltaTime();
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
  }
}
