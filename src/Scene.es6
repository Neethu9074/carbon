'use strict';

import THREE from 'three';

import './lib/Octree';

import colors from './colors';
import PhysicalMap from './sceneObjects/PhysicalMap';
import Host from './sceneObjects/Host';
import RxEmitter from 'rxemitter';
import HostCubeFactory from './factories/HostCubeFactory';
import LineFactory from './factories/LineFactory';
import GroundFactory from './factories/PlaneFactory';
import MouseCameraController from './controls/mouseCameraController';
import TouchCameraController from './controls/touchCameraController';

const getZoomClass = (level) => 'in-map--zoom-' + level;
const isMobile = {
  android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  blackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  windows: function() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
    return (isMobile.android() || isMobile.blackBerry() ||
    isMobile.iOS() || isMobile.opera() || isMobile.windows());
  }
};


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

		this.emitter = new RxEmitter();

		//stores all objects which should be clickable
		this.collisionObjects = [];

		this.setupFactories();
		this.setupOctree();
		this.setup3D();

		this.setupController();

		this.update();

		window.addEventListener('resize', this.onWindowResize, false);
	}

	getScene() {
		return this;
	}

	setupController() {
    if(isMobile.any()) {
      this.controller = new TouchCameraController({scene: this});
    } else {
      this.controller = new MouseCameraController({scene: this});
    }

		//call zoom to trigger camera movemnt to the right position
		this.controller.zoom(-1);
	}

	addSceneObject(obj) {
		this.scene.add(obj);

		if (obj.collisionObject !== undefined) {
			this.octree.add(obj.collisionObject, {
				useFaces: false
			});
		}
	}

	removeSceneObject(obj) {
		this.scene.remove(obj);

		if (obj.collisionObject !== undefined) {
			this.octree.remove(obj.collisionObject);
		}
	}

	bindMethods() {
		this.onWindowResize = this.onWindowResize.bind(this);
		this.update = this.update.bind(this);
		this.updateMaterialsByZoomLevel =
			this.updateMaterialsByZoomLevel.bind(this);
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

	setupFactories() {
		this.hostFactory = new HostCubeFactory({
			scene: this
		});
		this.lineFactory = new LineFactory({
			scene: this
		});
		this.groundFactory = new GroundFactory({
			scene: this
		});
	}

	setup3D() {
		const width = this.width;
		const height = this.height;

		this.setupRenderer(width, height);
		this.setupCamera(width, height);

		this.scene = new THREE.Scene();
		this.map = new PhysicalMap({
			scene: this
		});
	}

	setupRenderer(width, height) {
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(width, height);
		this.renderer.setClearColor(colors.renderClearColor);

		//add webGLRenderer to dom element
		this.parent.appendChild(this.renderer.domElement);
	}

	setupCamera(width, height) {
		this.cameraSize = 30;

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
		this.camera.updateMatrix();
		this.camera.matrixAutoUpdate = false;
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
		if (this.disposed) {
			return;
		}
		requestAnimationFrame(this.update);

		//fire event for updating stats
		this.emitter.emit('beginUpdate');

		this.calculateDeltaTime();
		this.octree.update();
		this.controller.update(this.deltaTime);
		this.updateCamera();

		//update is done
		this.emitter.emit('endUpdate', {
			scene: this
		});

		this.render();
	}

	updateCamera() {
		const camera = this.camera;
		//updateMatrix is called in controller before
		camera.updateMatrixWorld();
		camera.updateProjectionMatrix();

		camera.projection = new THREE.Matrix4();
		const inverse = new THREE.Matrix4().getInverse(camera.matrixWorld);
		camera.projection.multiplyMatrices(camera.projectionMatrix, inverse);
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
		const zoomLevel = event.zoomLevel;
		this.cameraSize = zoomLevel / 10;
		this.setCameraFromSize();

		//update the css design zoom distance
		this.updateZoomLevelInCss(zoomLevel);

		//update the opacity for the 3D elements
		this.updateMaterialsByZoomLevel(zoomLevel);
	}

	updateMaterialsByZoomLevel(zoomLevel) {
		if (this.controller === undefined) {
			return;
		}
		const maxZoomIn = 25;
		const maxZoomOut = 100;

		//[1 - max out, 0 - max in]
		let normedZoomLevel = zoomLevel / (maxZoomOut - maxZoomIn);
		normedZoomLevel = Math.min(1, Math.max(0.1, normedZoomLevel));
		this.hostFactory.material.opacity = normedZoomLevel;
	}

	updateZoomLevelInCss(zoomLevel) {
		const parentClasses = this.parent.classList;
		[100, 50, 25].forEach(level => {
			parentClasses.remove(getZoomClass(level));
		});

		let zoomLevelAccordingToDesign;
		if (zoomLevel < 70) {
			zoomLevelAccordingToDesign = 100;
		} else if (zoomLevel <= 100) {
			zoomLevelAccordingToDesign = 50;
		} else {
			zoomLevelAccordingToDesign = 25;
		}
		parentClasses.add(getZoomClass(zoomLevelAccordingToDesign));
	}

	setCameraFromSize() {
		const aspect = this.width / this.height;
		this.camera.left = -this.cameraSize / 2 * aspect;
		this.camera.right = this.cameraSize / 2 * aspect;
		this.camera.top = this.cameraSize / 2;
		this.camera.bottom = -this.cameraSize / 2;

		this.camera.updateProjectionMatrix();
	}

	findObjectByRay(raycaster) {
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

	clickedOnObject(object) {
		this.controller.flyToObject(object);
	}
}
