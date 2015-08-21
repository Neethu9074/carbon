import THREE from 'three';
import _ from 'lodash';

import {viewStructure} from 'in-services/stores/view';
import {filters} from 'in-services/stores/mapFilters';
import eventBus from 'in-services/eventbus';
import {getZone} from 'in-sdk/zones';

import {getAllNodes, getAllGroups} from '../../mapStructureUtils';
import {selectedSceneObject} from '../../stores/mapStore';
import ConnectionGrid from '../../ConnectionGrid_Temp';
import * as time from '../../timeCalculations';
import groundTexturePath from './ground.png';
import SceneObject from '../SceneObject';
import Layouter from '../../layout';
import Group from '../Group';


export default class PhysicalMap extends SceneObject {

  constructor({parent}) {
    super({parent, id: 'physicalMap'});

    //the size of the map in world units (sizeXsize)
    this.size = 1000;

    this.groups = [];
    this.filterArray = [];

    this.createGroundGrid();
    this.registerEvents();

    // this.counter = 0;
    // for (let i = 0; i < 0; i++) {
    //   this.addNode(Immutable.fromJS({
    //     hostId: this.counter++,
    //     steadyId: 's',
    //     pluginId: 'com.instana.forge.infrastructure.os.OS',
    //     data: {
    //       hostname: this.hostId,
    //       'cpu.count': 4,
    //       'cpu.model': 'Intel',
    //       'os.version': 'v',
    //       'os.arch': '',
    //       'os.name': 'Linux',
    //       'memory.total': 2132456,
    //       'swap.total': ''
    //     }
    //   }));
    // }
  }

  createGroundGrid() {
    const geo = new THREE.PlaneBufferGeometry(this.size, this.size, 1, 1);
    const mat = new THREE.MeshBasicMaterial({
      map: this.getGroundTexture(),
      transparent: true,
      depthWrite: false,
      opacity: 0.5
    });

    const ground = this.ground = new THREE.Mesh(geo, mat);
    // turn the group around to make it visible. If we wouldn't be doing this,
    // then backface culling would make it invisible.
    ground.rotation.x = -90 * Math.PI / 180;
    ground.position.y = -0.02;

    //set static
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
    texture.anisotropy = this.scene.renderer.getMaxAnisotropy();

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

    this.addSubscription(filters.subscribe(filterArray => {
      this.filterArray = filterArray;
      this.filter();
    }));
  }

  onInventoryUpdate(structures) {
    structures.forEach(triple => this.addNode(triple));

    this.removeVanishedNodes(structures);
    this.removeAllUnknownNodesWithoutConnections();
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
    if(!triple.group) {
      return;
    }

    const callback = (groupId) => {
      const group = this.getOrCreateGroup(groupId);

      //add the node to group (the group handles duplicates)
      const newNode = group.addNode(triple.node);
      if(!newNode) {
        return;
      }

      // if the group has switched delete the nodes in other groups than the current one
      // this.removeNodeFromAllGroupsInsteadOf(groupId, triple.node);

      this.filterNode(newNode);

      this.refreshLayout = true;
    };

    getZone(triple.group, callback);
  }

  getAllMapNodes() {
    return getAllNodes(this);
  }

  getOrCreateGroup(groupId) {
    //get find the group with groupId
    let group = _.find(getAllGroups(this), g => g.id === groupId);

    //if the nodes group doesn't exist, create it
    if (!group) {
      group = new Group({parent: this, id: groupId});
      this.groups.push(group);
    }

    return group;
  }

  //runs through all groups instead of the current one and searches for the
  //node added to the current one. if found -> delete it from old groups
  removeNodeFromAllGroupsInsteadOf(groupId, node) {
    const nodeId = node.get('id');
    getAllNodes(this).forEach(n => {
      if(n.snapshot.get('id') === nodeId && n.parent.id !== groupId) {
        n.dispose();
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

  filter() {
    getAllNodes(this).forEach(node => {
      if (node.isUnknown) {
        return;
      }
      this.filterNode(node);
    });

    selectedSceneObject.emit({sceneObject: null});
    this.scene.renderScene();
  }

  filterNode(node) {
    let unmatchesOne = false;
    this.filterArray.forEach(filter => {
      if (!filter.get('predicate')(node.snapshot)) {
        unmatchesOne = true;
      }
    });
    if (!unmatchesOne) {
      node.show();
    } else {
      node.hide();
    }
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

    this.filters = [];
    this.parent = null;
    this.size = null;
  }
}
