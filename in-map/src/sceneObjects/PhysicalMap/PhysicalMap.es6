import THREE from 'three';
import _ from 'lodash';

import {getIcon} from 'in-sdk/snapshot';
import {hexToRGBNormalized} from 'in-services/converters';
import {viewStructure} from 'in-services/stores/view';
import {getFullSnapshot} from 'in-services/snapshots';
import eventBus from 'in-services/eventbus';
import theme from 'in-services/theme';
import {getZone} from 'in-sdk/zones';

import {getAllNodes, getAllGroups} from '../../mapStructureUtils';
import ConnectionGrid from '../../ConnectionGrid_Temp';
import * as time from '../../timeCalculations';
import groundTexturePath from './ground.png';
import SceneObject from '../SceneObject';
import Layouter from '../../layout';
import Group from '../Group';


export default class PhysicalMap extends SceneObject {

  constructor({parent}) {
    super({parent, id: 'physicalMap'});

    // the size of the map in world units (sizeXsize)
    this.size = 1000;

    this.groups = [];

    const pluginIds = [
      'com.instana.forge.infrastructure.database.elasticsearch.Elasticsearch',
      'com.instana.forge.infrastructure.os.host.Host',
      'com.instana.forge.infrastructure.os.process.Process',
      'com.instana.forge.infrastructure.application.jira.JiraApplication',
      'com.instana.forge.infrastructure.runtime.jvm.JvmRuntimePlatform',
      'com.instana.forge.infrastructure.virtualization.docker.Docker',
      'com.instana.forge.infrastructure.database.cassandra.Cassandra',
      'com.instana.forge.infrastructure.cache.redis.Redis',
      'com.instana.forge.infrastructure.database.mongodb.MongoDb',
      'com.instana.forge.infrastructure.database.mysql.MySqlDatabase',
      'com.instana.forge.infrastructure.application.container.tomcat.TomcatApplicationContainer',
      'com.instana.forge.infrastructure.runtime.nodejs.NodeJsRuntimePlatform'
    ];

    let x = 0;
    pluginIds.forEach(id => {
      const icon = getIcon(id);
      const image = document.createElement('img');
      image.src = icon;
      const texture = new THREE.Texture(image);
      texture.minFilter = THREE.LinearFilter;
      image.addEventListener( 'load', () => {
        texture.needsUpdate = true;
      });

      const mat = new THREE.MeshBasicMaterial({map: texture, transparent: true});
      const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1, 1, 1), mat);
      mesh.position.x = x++;
      mesh.position.z = 5;
      this.scene.addSceneObject(mesh);
      console.log(id, x);
    });

    this.createGroundGrid();
    this.registerEvents();
  }

  createGroundGrid() {
    const color = hexToRGBNormalized(theme.map.colors.groundDots);

    const geo = new THREE.PlaneBufferGeometry(this.size, this.size, 1, 1);
    const mat = new THREE.MeshBasicMaterial({
      map: this.getGroundTexture(),
      transparent: true,
      depthWrite: false,
      color: new THREE.Color(color.r, color.g, color.b)
    });

    const ground = this.ground = new THREE.Mesh(geo, mat);
    // turn the group around to make it visible. If we wouldn't be doing this,
    // then backface culling would make it invisible.
    ground.rotation.x = -90 * Math.PI / 180;
    ground.position.y = -0.02;

    // set static
    ground.matrixAutoUpdate = false;
    ground.rotationAutoUpdate = false;
    ground.updateMatrix();

    this.addSceneObject(ground);
  }

  getGroundTexture() {
    const quadsPerWorldUnit = 3;
    const repating = quadsPerWorldUnit * this.size;
    const texture = THREE.ImageUtils.loadTexture(
      groundTexturePath,
      THREE.UVMapping,
      () => { this.scene.renderScene(); });

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repating, repating);

    //set the ground anisotropy to the max because it's a huge ground always
    //seen and it needs to be as sharp as possible
    texture.anisotropy = this.scene.webGLRenderer.getMaxAnisotropy();

    this.groundtexture = texture;
    return texture;
  }

  handleTimeEventFunction() {
    //if the flag was set to recalculate the layouting
    if(this.refreshLayout) {
      this.applyLayout();
      eventBus.emit('layoutChanged');

      this.scene.renderScene();
      this.refreshLayout = false;
    }
  }

  registerEvents() {
    this.addSubscription(viewStructure.subscribe(structures => this.onInventoryUpdate(structures)));

    this.handleTimeEvent = this.handleTimeEventFunction.bind(this);
    time.addTimeEventListener({
      handleComponentTimeEvent: this.handleTimeEvent
    });
  }

  onInventoryUpdate(structures) {
    structures.forEach(triple => this.addNode(triple));

    this.removeVanishedNodes(structures);
    // this.removeAllUnknownNodesWithoutConnections();
  }

  applyLayout() {
    let numElementsOnMap = 0;
    this.groups.forEach(group => {
      group.children.forEach(() => {
        numElementsOnMap++;
      });
    });

    const maxNodesPerRow = Math.floor(Math.sqrt(numElementsOnMap / this.groups.length));
    const layouter = new Layouter({maxNodesPerRow});
    layouter.applyLayout(this);
  }

  removeVanishedNodes(structures) {
    // identify removed nodes: nodes that are not inside the snapshot update
    getAllNodes(this).forEach(node => {
      if (node.isUnknown) {
        return;
      }
      const snapshotExistsInUpdate = structures.some(triple => triple.node.get('id') === node.id);
      if (!snapshotExistsInUpdate) {
        node.dispose();
      }
    });
  }

  removeAllUnknownNodesWithoutConnections() {
    getAllNodes(this).forEach(node => {
      if (!node.isUnknown) {
        return;
      }

      const wired = node.getWiredSnapshots();
      if (wired.get('incoming').length === 0 && wired.get('outgoing').length === 0) {
        node.dispose();
      }
    });
  }

  addNode(triple) {
    if (!triple.group) {
      this.addNodeToGroup(triple, getZone());
    } else {
      getFullSnapshot(triple.group)
        .once(groupSnapshot => {
          const groupId = getZone(groupSnapshot);
          this.addNodeToGroup(triple, groupId);
        });
    }
  }

  addNodeToGroup(triple, groupId) {
    const group = this.getOrCreateGroup(groupId);

    // add the node to group (the group handles duplicates)
    const newNode = group.addNode({
      coordinates: triple.node,
      layer: triple.layers
    });

    if(!newNode) {
      return;
    }

    // if the group has switched delete the nodes in other groups than the current one
    this.removeNodeFromAllGroupsInsteadOf(groupId, newNode);
    this.refreshLayout = true;
  }

  getAllMapNodes() {
    return getAllNodes(this);
  }

  getOrCreateGroup(id) {
    // get find the group with id
    let group = _.find(getAllGroups(this), g => g.id === id);

    // if the nodes group doesn't exist, create it
    if (!group) {
      group = new Group({id, parent: this});
      this.groups.push(group);
    }

    return group;
  }

  // runs through all groups instead of the current one and searches for the
  // node added to the current one. if found -> delete it from old groups
  removeNodeFromAllGroupsInsteadOf(groupId, newNode) {
    const nodeId = newNode.id;
    getAllNodes(this).forEach(node => {
      if(node.id === nodeId && node.parent.id !== groupId) {
        node.dispose();
      }
    });
  }

  addUnknownNode(node) {
    //create zone and send the event back
    this.getOrCreateGroup('unmonitored').addUnknownNode(node);

    this.refreshLayout = true;
  }

  showWalkableGrid() {
    if(this.particles) {
      this.removeSceneObject(this.particles);
    }
    this.particles = ConnectionGrid.asVisualObject();
    this.addSceneObject(this.particles);
  }

  //is called from group if it has no nodes anymore
  removeChild(child) {
    _.remove(this.groups, group => group.id === child.id);
  }

  findNodeById(id) {
    const allNodes = getAllNodes(this);
    for (let i = 0; i < allNodes.length; i++) {
      const node = allNodes[i];
      if (node.id === id) {
        return node;
      }
    }
  }

  onZoom(zoomLevel) {
    const size = this.size;
    if(zoomLevel < 120) {
      this.groundtexture.repeat.set(3 * size, 3 * size);
    } else {
      this.groundtexture.repeat.set(size, size);
    }
  }

  dispose() {
    //disposing all subscriptions, so that no update is fired anymore
    super.dispose();

    time.removeTimeEventListener(this.handleTimeEvent);
    this.handleTimeEvent = null;

    //destory all known and unknown nodes
    getAllNodes(this).slice().forEach(node => node.dispose());

    //groups are disposing themselves if there is no cube inside anymore
    this.groups = [];

    //remove this ground from the parents scene
    this.removeSceneObject(this.ground);

    //clear three.js cache trough disposing
    this.ground.material.dispose();
    this.ground.geometry.dispose();
    this.ground = null;

    this.parent = null;
    this.size = null;
  }
}
