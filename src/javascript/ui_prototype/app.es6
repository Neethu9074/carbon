'use strict';

import './app.less';

import THREE from 'three.js';
import '../lib/CSS3DRenderer';
import '../lib/Octree';

import colors from './colors';
import * as states from './cubeStates';
import * as materials from './materials';
import * as textures from './textures';
import Ground from './sceneObjects/ground';
import Hightlight from './sceneObjects/highlight';
import Connection from './sceneObjects/cubeConnection';
import Pathfinder from './gridPathfinder';
import Host from './sceneObjects/hostCube';
import HostDataProvider from './dataProvider/hostDataProvider';

import MouseControls from './controls/mouseCameraController';
import TouchControls from './controls/touchCameraController';
import Layouter from './harmonicSphericalLayouter';

import TWEEN from 'tween.js';
import RxEmitter from 'rxemitter';
import _ from 'lodash';

//logging
import logging from 'instalog';
const logger = logging.createLogger('app.es6');

let application;
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
		return (isMobile.android() || isMobile.blackBerry() || isMobile.iOS() ||
			isMobile.opera() || isMobile.windows());
	}
};

class App {
	constructor(canvas, clickHandler) {
		this.canvas = canvas;
		this.canvas.classList.add('in-map');
		this.clickHandler = clickHandler;

		this.width = window.innerWidth;
		this.height = window.innerHeight;

		//save global reference
		application = this;

		//first of all -> bind methods
		this.bindMethods();

		//create the event emitter
		this.emitter = new RxEmitter();

		//time properties
		this.time = Date.now();
		this.deltaTime = 0;
		this.timeSinceStarted = 0;

		//zoom properties
		this.showHostDetailsDistance = 50;
		this.hideHostsDistance = 400;
		this.switchHostDetails = false;
		this.showHostDetails = false;

		//setup 3D stuff
		this.setupOctree();
		this.setup3D();
		this.setup2D();

		if (isMobile.any()) {
      //the controller for the camera movement controlled by mouse and keys
      this.controller = new TouchControls();
    } else {
      //the controller for the camera movement controlled by touch gesture
      this.controller = new MouseControls();
    }
    logger.info('use', this.controller, 'as controller');

		//a spherical layouter with maxcubes = 2000
		this.layouter = new Layouter(2000);

		//the pathfinding wrapper
		this.pathFinder = new Pathfinder();

		//a collection to store all hosts
		this.hosts = [];

		this.setupEvents();
		this.update();
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

	addToOctree(obj) {
		this.octree.add(obj, {
			useFaces: false
		});
	}

	setup3D() {
		const width = this.width;
		const height = this.height;

		this.webGLRenderer = new THREE.WebGLRenderer();
		this.webGLRenderer.setClearColor(colors.renderClearColor, 1);
		this.webGLRenderer.setSize(width, height);

		//add webGLRenderer to dom element
		this.canvas.appendChild(this.webGLRenderer.domElement);

		this.scene = new THREE.Scene();

		//set the farplane as near as possible
		this.mainCamera = new THREE.PerspectiveCamera(
			30, //fov
			width / height, //aspect
			0.5, //near
			2000); //far

		// add subtle ambient lighting
		const ambientLight = new THREE.AmbientLight(colors.ambientColor);
		this.scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
		directionalLight.position.set(0, 1, 1);
		this.scene.add(directionalLight);

		//a collection to store all sceneObjects
		this.sceneObjects3D = [];
		this.sceneObjects3D.push(new Ground(this));
	}

	setup2D() {
		const width = this.width;
		const height = this.height;


		this.cssRenderer = new THREE.CSS3DRenderer();
		this.cssRenderer.setSize(width, height);

		const div = document.createElement('div');
		div.classList.add('webgl-canvas-overlay');
		div.appendChild(this.cssRenderer.domElement);
		this.canvas.appendChild(div);
	}

	isMobileDevice() {
		return isMobile.any();
	}

	//events
	setupEvents() {
		const doc = document;
		window.addEventListener('resize', this.onWindowResize, false);

		setOnClick('newHostButton', this.addRandomHost);
		setOnClick('newContainerButton', this.addRandomContainer);
		setOnClick('destroyCubeButton', this.removeCube);
		setOnClick('OffOnlineButton', this.toggleOffOnline);
		setOnClick('showInGrafanaButton', this.showInGrafana);
		setOnClick('switchStateButton', this.switchState);
		setOnClick('showWalkingGridButton', this.showWalkingGrid);

		function setOnClick(id, fn) {
			const button = doc.getElementById(id);
			if (button) {
				button.onclick = fn;
			}
		}
	}

	onWindowResize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.webGLRenderer.setSize(this.width, this.height);
		this.cssRenderer.setSize(this.width, this.height);

		this.mainCamera.aspect = this.width / this.height;
		this.mainCamera.updateProjectionMatrix();
	}

	addRandomHost() {
		/*eslint-disable max-len */
		const snapshot = {
			'hostId': 'alexs-mbp.local',
			'steadyId': 'MacOSX.10.10.2' + Math.random(),
			'pluginId': 'com.instana.forge.infrastructure.os.OS',
			'snapshot': {
				'os.arch': 'x86_64',
				'os.name': 'MacOSX',
				'os.version': '10.10.2',
				'memory.free.status': '{"score":0.0,"labels":["operating system instance"],"issues":["Free memory will go below zero in 120 seconds"],"solutions":["identify and eventually eliminate memory consuming processes","give this OS instance more memory"]}'
			}
		};
		/*eslint-enable max-len */
		return this.addHost(snapshot);
	}

	addRandomContainer() {
		const object = this.clickedObject;
		object.addContainer({
			id: 'id',
			pid: Math.random()
		});
	}

	removeCube() {
		const object = this.clickedObject;
		if (object.dataProvider instanceof HostDataProvider) {
			_.remove(this.objects3D, obj => obj === object);
			_.remove(this.hosts, obj => obj === object);
			this.layouter.setFree(object.ID);
		}
		object.dispose();
	}

	toggleOffOnline() {
		const object = this.clickedObject;
		if (object.online) {
			object.setOffline();
		} else {
			object.setOnline();
		}
	}

	showInGrafana() {
		const object = this.clickedObject;
		const url = object.dataProvider.getDashboardUrl();
		window.open(url, '_blank');
	}

	switchState() {
		const object = this.clickedObject;
		const state = object.state;

		if (state === states.ok) {
			object.setState(states.warning);
		} else if (state === states.warning) {
			object.setState(states.error);
		} else {
			object.setState(states.ok);
		}
	}

	showWalkingGrid() {
		const freeFields = this.pathFinder.getFreeFields();

		const geometry = new THREE.BufferGeometry();
		let geoPos = new Float32Array(freeFields.length * 3);

		let index = 0;
		for (let i = 0; i < freeFields.length; i++) {
			const position = freeFields[i];
			geoPos[index] = position.x;
			geoPos[index + 1] = 0.2;
			geoPos[index + 2] = -position.y;

			index += 3;
		}

		geometry.addAttribute('position', new THREE.BufferAttribute(geoPos, 3));

		const particleSystem = new THREE.PointCloud(geometry);
		this.scene.add(particleSystem);
	}

	onHostDestroyed() {
		logger.info('NOONE IS LISTENING TO onHostDestroyed(ID)');
	}

	onInventoryDestroyed() {
			logger.info('NOONE IS LISTENING TO onInventoryDestroyed(ID)');
		}
		//end events

	bindMethods() {
		this.update = this.update.bind(this);
		this.bindMethods = this.bindMethods.bind(this);
		this.onWindowResize = this.onWindowResize.bind(this);
		this.addRandomHost = this.addRandomHost.bind(this);
		this.addRandomContainer = this.addRandomContainer.bind(this);
		this.removeCube = this.removeCube.bind(this);
		this.toggleOffOnline = this.toggleOffOnline.bind(this);
		this.showInGrafana = this.showInGrafana.bind(this);
		this.animate = this.animate.bind(this);
		this.switchState = this.switchState.bind(this);
		this.showWalkingGrid = this.showWalkingGrid.bind(this);
	}

	update() {
		requestAnimationFrame(this.update);

		//fire event for updating stats
		this.emitter.emit('beginUpdate');

		//do all animation and deltaTime stuff
		this.animate();

		//update is done
		this.emitter.emit('endUpdate', {
			dt: this.deltaTime
		});

		//render the scene
		this.render();

		//render is ready, frame is done
		this.emitter.emit('endRender');
	}

	animate() {
		this.calculateDeltaTime();
		const dt = this.deltaTime;

		this.controller.update(dt);
		TWEEN.update();

		//update global texture offsets
		textures.groundEffectTexture.offset.y = 0.25 * -this.timeSinceStarted;
		this.octree.update();

		const distance = this.controller.zoomLevel;
		/*if(distance >= this.hideHostsDistance) {
		  //logger.debug('hide hosts', distance);
      //return;
		}*/

		if (distance <= this.showHostDetailsDistance) {
			this.showHostDetails = true;

			//the opacity of the hosts cubes is increasing while zooming in
			//[1, 0]
			const opacity = distance / this.showHostDetailsDistance;
			//set material for all hosts by manipulating the global shared mat
			materials.cubeHostMaterial.opacity = opacity;

			if (!this.switchHostDetails) {
				//switch on
				this.switchHostDetails = true;
				materials.cubeHostMaterial.transparent = true;

				_.forEach(this.hosts, host => {
					this.hideHost(host);
				});
			}

		} else {
			this.showHostDetails = false;

			if (this.switchHostDetails) {
				//switch off
				this.switchHostDetails = false;

				//when zooming out make hosts not transparent anymore.
				//furthermore set opacity to 1 to avoid gaps if FPS is low
				materials.cubeHostMaterial.transparent = false;
				materials.cubeHostMaterial.opacity = 1;

				_.forEach(this.hosts, host => {
					this.showHost(host);
				});
			}
		}
	}

	showHost(host) {
		if (host.online) {
			host.hide();
			this.scene.add(host.content2D);
			this.scene.add(host.cube);
		}
	}

	hideHost(host) {
		if (host.online) {
			host.show();
			this.scene.remove(host.content2D);
			this.scene.remove(host.cube);
		}
	}

	calculateDeltaTime() {
		const timeNow = Date.now();
		this.deltaTime = (timeNow - this.time) / 1000; //in ms
		this.time = timeNow;
		this.timeSinceStarted += this.deltaTime;
	}

	render() {
		this.webGLRenderer.render(this.scene, this.mainCamera);
		this.cssRenderer.render(this.scene, this.mainCamera);
	}

	findObjectInOctree(raycaster) {
		raycaster.far = Math.min(250, raycaster.far); //[0, 200]

		const useOctree = true;

		if (useOctree) {
			const octree2Objects = this.octree.search(
				raycaster.ray.origin,
				raycaster.ray.far,
				true, //true -> organized by objects
				raycaster.ray.direction);

			const intersections = raycaster
        .intersectOctreeObjects(octree2Objects);
			if (intersections.length > 0) {
				for (let i = 0; i < intersections.length; i++) {
					const intersect = intersections[i].object;
					//return nearest enabled hit
					if (intersect.collisionEnabled) {
						return intersect;
					}
				}
			}
			return undefined;

		} else {
			const toBeTested = [];
			this.scene.traverse(function(object) {
				if (object.collisionEnabled === true) {
					toBeTested.push(object);
				}
			});

			let i = raycaster.intersectObjects(toBeTested);
			if (i.length > 0) {
				return i[0].object;
			}
		}
	}

	clickedOnObject(object) {
		this.clickedObject = object;
		logger.info('clicked on: ', object);
		this.addHighlightOnObj(object);

		if (object instanceof Host && this.clickHandler !== undefined) {
			this.clickHandler({
				snapshot: object.dataProvider.metaData
			});
		}
	}

	addHighlightOnObj() {
		if (this.hightlight !== undefined) {
			this.hightlight.dispose();
		}
		//this.hightlight = new Hightlight(this, this.clickedObject);
	}

	addHost(metaData) {
		try {
			const hostId = metaData.get('hostId');
			//get new position if possible
			const newPos2D = this.layouter.getNext(hostId);
			const pos = new THREE.Vector3(newPos2D.x, 0, -newPos2D.y);
			const host = new Host(pos, new HostDataProvider(metaData));

			this.sceneObjects3D.push(host);
			this.hosts.push(host);
			this.scene.add(host.cube);

			if (!this.showHostDetails) {
				this.showHost(host);
			} else {
				this.hideHost(host);
			}

			if (this.lastAddedHost !== undefined) {
				const c = new Connection(this.lastAddedHost, host);
				this.sceneObjects3D.push(c);
			}
			this.lastAddedHost = host;

			return host;

		} catch (e) {
			logger.error(e);
			return undefined;
		}
	}

	getHost(ID) {
		return _.find(this.hosts, host => host.ID === ID);
	}
}

//returns the active application as a global object
export function getApplication() {
	return application;
}

export default App;
