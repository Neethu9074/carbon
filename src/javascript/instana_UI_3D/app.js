'use strict';

var THREE = require('three.js');
var colors = require('./colors');
var layouter = require('./layouter2D');
var ground = require('./ground');
var dS = require('./detailStates');
var host = require('./hostCube');
var baseCube = require('./baseCube');
var container = require('./containerCube');
var materials = require('./materials');
var geometries = require('./geometries');
var textures = require('./textures');
var math = require('./math');

//controls
var mControl = require('./controls/mouseCameraController');

//effects
var particles = require('./effects/risingParticles');

//extensions
require('./extensions/CSS3DRenderer');
require('./extensions/OculusRiftEffect');
require('./extensions/Octree');
var rStats = require('./extensions/rStats');
var glStats = require('./extensions/rStats.extras');


exports.Application = function Application() {
  this.canvas = document.getElementById('WebGL');
  this.sceneObjects3D = []; // all objects, added to the 3D scene
  this.layouter = new layouter.Layouter2D(50, 50);
  this.updateableObjects = []; //all objects needing an update every frame

  this.bindListeners();
  this.initialize();
  this.createStats();
  this.createOctree();

  this.mouseControl = new mControl.MouseControl(this);

  //zoom detail Level
  this.cloudDistance = 90;
  this.midDetailsDistance = 25;
  this.maxDetailsDistance = 10;
  this.zoomLevel = this.mouseControl.zoomLevel;
  this.detailState = dS.DETAILSTATE.MIN;

  this.walkableSystem = undefined;

  //events
  window.addEventListener('resize', this.onWindowResize, false);
  document.getElementById('newHostButton').onclick = this.addRandomCube;
  document.getElementById('newContainerButton').onclick = this.addRandomContainer;
  document.getElementById('destroyCubeButton').onclick = this.removeCube;
  document.getElementById('showWalkableButton').onclick = this.showWalkable;
  document.getElementById('stackContainerButton').onclick = this.stackContainer;
  document.getElementById('showInGrafanaButton').onclick = this.showInGrafana;

  this.animate();
};

// we need to make sure, that 'this' doesn't get lost.
// we also only want to do this once
exports.Application.prototype.bindListeners = function() {
  this.onWindowResize = this.onWindowResize.bind(this);
  this.calculateDeltaTime = this.calculateDeltaTime.bind(this);
  this.animate = this.animate.bind(this);
  this.render = this.render.bind(this);

  this.addRandomCube = this.addRandomCube.bind(this);
  this.removeCube = this.removeCube.bind(this);
  this.showWalkable = this.showWalkable.bind(this);
  this.addRandomContainer = this.addRandomContainer.bind(this);
  this.stackContainer = this.stackContainer.bind(this);
  this.showInGrafana =  this.showInGrafana.bind(this);
};

//events
exports.Application.prototype.onWindowResize = function() {
  var width = this.canvas.offsetWidth;
  var height = this.canvas.offsetHeight;
  var aspect = width / height;
  this.mainCamera.aspect = aspect;
  this.mainCamera.updateProjectionMatrix();

  this.mainRenderer.setSize(width, height);
  this.cssRenderer.setSize(width, height);

  this.oculusEffectMain.setSize(width, height);
};

exports.Application.prototype.addRandomCube = function() {
  var width = Math.ceil(Math.random() * 2);
  this.addHost(width, width);
};

exports.Application.prototype.addRandomContainer = function() {
  var cube = this.clickedObj;
  if (cube !== undefined) {
    if (cube instanceof baseCube.BaseCube) {
      cube.addContainer({
        id: 'dummy SW'
      });
    }
  }
};

exports.Application.prototype.removeCube = function() {
  var cube = this.clickedObj;
  if (cube !== undefined) {
    if (cube instanceof baseCube.BaseCube) {
      this.removeObject(cube);
    }
  }
};

exports.Application.prototype.stackContainer = function() {
  var cube = this.clickedObj;
  if (cube !== undefined) {
    if (cube instanceof container.ContainerCube) {
      cube.stackContainer({ id:'another one' });
    } else {
      console.log('cant stack on ', cube);
    }
  }
};

exports.Application.prototype.showWalkable = function() {
  if (this.walkableSystem !== undefined) {
    this.scene.remove(this.walkableSystem);
  }

  var geo = new THREE.Geometry();
  var fields = this.layouter.getFreeWalkable();
  for (var i in fields) {
    var field = fields[i];
    geo.vertices.push(new THREE.Vector3(field.x, 0.1, -field.y));
  }
  var mat = new THREE.PointCloudMaterial({
    color: 0x00D66B,
    size: 1
  });

  this.walkableSystem = new THREE.PointCloud(geo, mat);
  this.scene.add(this.walkableSystem);
};

exports.Application.prototype.showInGrafana = function() {
  var cube = this.clickedObj;
  if (cube !== undefined) {
    if (cube instanceof container.ContainerCube) {
      var url = "/#/dashboard/file/" + btoa(cube.host + "___" + cube.tag + "___" + cube.entityId) + ".json";
      window.open(url,'_blank');
    } else if (cube instanceof host.HostCube){
      var url = "/#/dashboard/file/" + btoa(cube.name + "___com.instana.agent.host.discovery.Host___localhost") + ".json";
      window.open(url,'_blank');
    }
  }
};
//events end

exports.Application.prototype.addHost = function(width, height, metaData) {
  var xy = this.layouter.getNext(width, width);

  if (xy !== undefined) {
    var cube = new host.HostCube(this, xy.x, -xy.y, width, height, metaData);
    this.addObject(cube);

    //say the layouter, that the area should be blocked
    this.layouter.setBlocked(xy, width, width, cube.name);
    return cube;
  }
};

exports.Application.prototype.getHost = function(hostName) {
  return host.findByName(hostName);
};

exports.Application.prototype.changeHost = function(id, metaData) {
  var foundHost = this.getHost(id);
  if(foundHost !== undefined) {
    foundHost.changeMetadata(metaData);
  }
};

exports.Application.prototype.zoom = function(zoomLevel) {
  this.zoomLevel = zoomLevel;

  if(zoomLevel > this.cloudDistance) {
    for (var i = 0; i < this.sceneObjects3D.length; i++) {
      var item = this.sceneObjects3D[i];
      if(item instanceof host.HostCube) {
        this.scene2D.remove(item.cssObject);
      }
    }
    return;
  } else if (zoomLevel < this.cloudDistance && zoomLevel > 40) {
    for (var i = 0; i < this.sceneObjects3D.length; i++) {
      var item = this.sceneObjects3D[i];
      if(item instanceof host.HostCube) {
        this.scene2D.add(item.cssObject);
      }
    }
  }

  //report to registered zoom cubes
  var state = dS.DETAILSTATE.MIN;
  materials.highlightMaterial.visible = true;
  if (zoomLevel < this.midDetailsDistance) {
    state = dS.DETAILSTATE.MID;
    materials.highlightMaterial.visible = false;

    if (zoomLevel < this.maxDetailsDistance) {
      state = dS.DETAILSTATE.MAX;
    }
  }
  //if state changed
  if (state !== this.detailState) {
    this.detailState = state;
  }
};

exports.Application.prototype.initialize = function() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  this.time = Date.now();
  this.deltaTime = 0;
  this.timeSinceStarted = 0;

  this.renderCSS = true;

  this.createRenderer(width, height);
  this.setup3DScene(width, height);
  this.setup2DScene();
  this.setupEffects();
};

exports.Application.prototype.clickedOnObject = function(object) {
  this.clickedObj = object;
  if(object !== undefined) {
    this.clickedObj = this.clickedObj.parentCube
    this.setHighlightToPosition(this.clickedObj);
  } else {
    this.clearHighlight();
  }

  console.log('clicked on: ', this.clickedObj);
  //parse object info to infoBox or what ever
};

exports.Application.prototype.clearHighlight = function() {
  var highlight = this.highlight;
  if(highlight.particles !== undefined) {
    highlight.particles.dispose();
  }

  //get a copy!
  var children = highlight.children.slice();
  //clear all children from the highlight container
  for (var i = 0; i < children.length; i++) {
    highlight.remove(children[i]);
  }
}

exports.Application.prototype.setHighlightToPosition = function(object) {
  this.clearHighlight();

  var highlight = this.highlight;
  var cube = new THREE.Mesh(geometries.cube, materials.highlightMaterial);

  //scale + 0.01 to avoit z-fighting
  cube.scale.set(
    object.dimension.x + 0.01,
    object.dimension.y + 0.01,
    object.dimension.z + 0.01);

  cube.position.copy(object.position);
  cube.position.x += object.dimension.x / 2;
  cube.position.y += object.dimension.y / 2;
  cube.position.z -= object.dimension.z / 2;

  highlight.add(cube);
};

exports.Application.prototype.setup3DScene = function(width, height) {
  this.scene = new THREE.Scene();
  //this.scene.fog = new THREE.Fog(colors.fogColor, 100, 500);

  //set the farplane as near as possible
  this.mainCamera = new THREE.PerspectiveCamera(60, width / height, 0.5, 700);
  this.mainCamera.position.set(-2, 5, 2.5);
  this.mainCamera.lookAt(new THREE.Vector3(0, 0, 0));

  // add subtle ambient lighting
  var ambientLight = new THREE.AmbientLight(colors.ambientColor);
  this.scene.add(ambientLight);

  //setup occulus rift effect
  this.oculusEffectMain = new THREE.OculusRiftEffect(this.mainRenderer, {
    worldScale: 1
  });
  this.oculusEffectMain.setSize(window.innerWidth, window.innerHeight);

  //add the ground
  this.addObject(new ground.Ground(this));

  //add the global objects for host and container cubes, they will not be added
  //via addObject(new Server());
  this.scene.add(host.globalMeshObjectForServerContainer);

  this.highlight = new THREE.Mesh();
  this.scene.add(this.highlight);
};

exports.Application.prototype.setup2DScene = function() {
  this.scene2D = new THREE.Scene();
};

exports.Application.prototype.createRenderer = function(width, height) {
  this.mainRenderer = new THREE.WebGLRenderer({
    antialias: false
  });
  this.mainRenderer.setClearColor(colors.fogColor, 1);
  this.mainRenderer.setSize(width, height);

  //add mainRenderer to dom element
  this.canvas.appendChild(this.mainRenderer.domElement);

  //3D CSS
  this.cssRenderer = new THREE.CSS3DRenderer();
  this.cssRenderer.setSize(width, height);
  document.getElementById('GLCanvasOverlay')
    .appendChild(this.cssRenderer.domElement);
};

exports.Application.prototype.setupEffects = function() {
  var positions = [];

  for (var x = 0; x < 300; x += 15) {
    for (var y = 0; y < 300; y += 15) {
      positions.push([x, y]);
    }
  }

  var effect = new particles.RisingParticles(this, positions);
  this.addObject(effect);

  //add clouds
  this.clouds = new THREE.Object3D();
  var geo = new THREE.PlaneBufferGeometry(1, 1, 1, 1);

  for (var i = 0; i < 10; i++) {
    var plane = new THREE.Mesh(geo, materials.cloudMaterialLight);
    plane.rotation.x = -90 * math.DegToRad;

    plane.position.y = 60 + Math.random() * 10;
    plane.position.x = Math.random() * 500 - 150;
    plane.position.z = Math.random() * -500 + 150;

    plane.scale.multiplyScalar(Math.random() * 400 + 300);
    plane.velocity = Math.random() * 2 - 1;

    this.clouds.add(plane);
  }

  for (var i = 0; i < 100; i++) {
    var plane = new THREE.Mesh(geo, materials.cloudMaterialMid);
    plane.rotation.x = -90 * math.DegToRad;

    plane.position.y = 60 + Math.random() * 10;
    plane.position.x = Math.random() * 500 - 150;
    plane.position.z = Math.random() * -500 + 150;

    plane.scale.multiplyScalar(Math.random() * 150 + 50);
    plane.velocity = Math.random() * 5 - 2.5;

    this.clouds.add(plane);
  }

  for (var i = 0; i < 50; i++) {
    var plane = new THREE.Mesh(geo, materials.cloudMaterialHeavy);
    plane.rotation.x = -90 * math.DegToRad;

    plane.position.y = 60 + Math.random() * 10;
    plane.position.x = Math.random() * 500 - 150;
    plane.position.z = Math.random() * -500 + 150;

    plane.scale.multiplyScalar(Math.random() * 150 + 50);
    plane.velocity = Math.random() * 5 - 2.5;

    this.clouds.add(plane);
  }

  this.scene.add(this.clouds);
};

exports.Application.prototype.addObject = function(obj) {
  this.sceneObjects3D.push(obj);

  var collisionMesh = obj.getCollisionMesh();
  if (collisionMesh !== undefined) {
    this.octree.add(collisionMesh, {
      useFaces: false
    });
    this.octree.update();
  }

  var mesh = obj.getMesh();
  if (mesh !== undefined) {
    this.scene.add(mesh);
  }
  //store all objects which needs an update on update
  if (obj.needsUpdate) {
    this.updateableObjects.push(obj);
  }
};

exports.Application.prototype.removeObject = function(obj) {
  this.sceneObjects3D = this.sceneObjects3D.filter(item => item !== obj);

  //getMesh is defined in superclass SceneObject
  //each object has to set this.setMesh(some mesh or other scene object)
  //to get added to the scene
  var collisionMesh = obj.getCollisionMesh();
  if (collisionMesh !== undefined) {
    this.octree.remove(collisionMesh);
    this.octree.update();
  }

  var mesh = obj.getMesh();
  if (mesh !== undefined) {
    this.scene.remove(mesh);
  }

  //store all objects which needs an update on update
  if (obj.needsUpdate) {
    this.updateableObjects = this.updateableObjects.filter(item => item !==
      obj);
  }

  if (obj instanceof baseCube.BaseCube) {
    obj.dispose();

    //delete highlight when the deleted cube is the highlighted one
    if (obj === this.clickedObj) {
      this.clickedObj = undefined;
      this.clearHighlight();
    }
  }
};

exports.Application.prototype.createStats = function() {
  var glS = new glStats.glStats();
  var tS = new glStats.threeStats(this.mainRenderer);
  var rS = new rStats.rStats({
    values: {
      frame: {
        caption: 'Total frame time (ms)',
        over: 16
      },
      fps: {
        caption: 'Framerate (FPS)',
        below: 30
      },
      calls: {
        caption: 'Calls (three.js)',
        over: 3000
      },
      raf: {
        caption: 'Time since last rAF (ms)'
      },
      rstats: {
        caption: 'rStats update (ms)'
      }
    },
    groups: [{
      caption: 'Framerate',
      values: ['fps', 'raf']
    }, {
      caption: 'Frame Budget',
      values: ['frame', 'texture', 'setup', 'render']
    }],
    plugins: [
      tS,
      glS
    ]
  });

  this.glStats = glS;
  this.rStats = rS;
};

exports.Application.prototype.createOctree = function() {
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
};

exports.Application.prototype.findObject = function(raycaster) {
  raycaster.far = Math.min(125, raycaster.far); //[0, 125]

  //search all candidates where ray cutting quadrants of the octree
  var octreeObjects = this.octree.search(
    raycaster.ray.origin,
    raycaster.ray.far,
    true, //true -> organized by objects
    raycaster.ray.direction);

  var intersections = raycaster.intersectOctreeObjects(octreeObjects);
  if (intersections.length > 0) {
    return intersections[0].object; //first hit
  }
  return undefined;
};

exports.Application.prototype.render = function() {
  this.mainRenderer.render(this.scene, this.mainCamera);
  this.cssRenderer.render(this.scene2D, this.mainCamera);
  //this.oculusEffectMain.render( this.scene, this.mainCamera );
};

exports.Application.prototype.animate = function() {

  var rS = this.rStats;

  rS('frame').start();
  this.glStats.start();
  rS('frame').start();
  rS('rAF').tick();
  rS('FPS').frame();
  rS('updates').start();

  //call this again
  requestAnimationFrame(this.animate);
  //calculate time the last frame needed to be updated/rendered
  this.calculateDeltaTime();

  //update the controls
  this.mouseControl.update(this.deltaTime);

  host.update(this);

  //update all registered objects (don't use for in)
  for (var i = 0; i < this.updateableObjects.length; i++) {
    this.updateableObjects[i].update();
  }

  for (var i = 0; i < this.clouds.children.length; i++) {
    var cloud = this.clouds.children[i];
    cloud.rotation.z += cloud.velocity * math.DegToRad * this.deltaTime;
  }

  rS('updates').end();
  rS('render').start();

  //Perform render
  //render the scene when all animations are updated
  this.render();

  rS('render').end();
  rS('frame').end();
  rS().update();

};

exports.Application.prototype.calculateDeltaTime = function() {
  var timeNow = Date.now();
  this.deltaTime = (timeNow - this.time) / 1000; //in ms
  this.time = timeNow;
  this.timeSinceStarted += this.deltaTime;
};
