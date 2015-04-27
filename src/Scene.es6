'use strict';

import THREE from 'three';

import './lib/Octree';

import colors from './colors';
import PhysicalMap from './sceneObjects/PhysicalMap';
import Host from './sceneObjects/Host';
import RxEmitter from 'rxemitter';
import HostCubeFactory from './factories/HostCubeFactory';
import LineFactory from './factories/LineFactory';
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

    //stores all objects which should be clickable
    this.collisionObjects = [];

    this.hostFactory = new HostCubeFactory({scene: this});
    this.lineFactory = new LineFactory({scene: this});

    this.setupOctree();
    this.setup3D();

    //controls
    this.controller = new MouseCameraController({scene: this});
    //this.controller = new TouchCameraController({scene: this});
    this.controller.zoom(0);

    this.update();

    window.addEventListener('resize', this.onWindowResize, false);
  }

  addSceneObject(obj) {
    if(obj instanceof Host) {
      this.hostFactory.addFragment({
        id: obj.id,
        pos: obj.position,
        dim: obj.dimension
      });
      this.lineFactory.addFragment({
        id: obj.id,
        pos: obj.position,
        dim: obj.dimension
      });
    } else {
      this.scene.add(obj);
    }

    if(obj.collisionObject !== undefined) {
      this.octree.add(obj.collisionObject, {
        useFaces: false
      });
    }
  }

  removeSceneObject(obj) {
    this.scene.remove(obj);

    if(obj.collisionObject !== undefined) {
      this.octree.remove(obj.collisionObject);
    }
  }

  bindMethods() {
		this.onWindowResize = this.onWindowResize.bind(this);
    this.update = this.update.bind(this);
	}

  setupOctree() {
    //setup octree
    this.octree = new THREE.Octree({
      // uncomment below to see the octree (may kill the fps)
      //scene: this.scene,
      // when undeferred = true, objects are inserted immediately
      // instead of being deferred until next octree.update() call
      // this may decrease performance as it forces a matrix update
      undeferred: true,
      // set the max depth of tree
      depthMax: Infinity,
      // max number of objects before nodes split or merge
      objectsThreshold: 8,
      // percent between 0 and 1 that nodes will overlap each other
      // helps insert objects that lie over more than one node
      overlapPct: 0
    });
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
    this.octree.update();
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

  findObjectByRay(raycaster){
    raycaster.far = Math.min(2500, raycaster.far); //[0, 250]

		const octree2Objects = this.octree.search(
      raycaster.ray.origin,
      raycaster.ray.far,
      true, //true -> organized by objects
      raycaster.ray.direction);

		const intersections = raycaster
      .intersectOctreeObjects(octree2Objects);
		if (intersections.length > 0) {
			return intersections[0].object;
		}
		return undefined;
  }

  clickedOnObject(/*obj*/) {
    //TODO something with the clicked obj
  }
}
