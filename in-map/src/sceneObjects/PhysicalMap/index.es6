import THREE from 'three';
import _ from 'lodash';

import SnapshotConveyer from 'in-services/conveyer/SnapshotConveyer';
import {filters} from 'in-services/stores/mapFilters';
import {getIdString, isIdEqual} from 'in-services/util/snapshots';
import eventBus from 'in-services/eventbus';
import {create} from 'in-services/conveyer';
import {getZone} from 'in-sdk/zones';

import {getAllNodes, getAllGroups} from '../../mapStructureUtils';
import {selectedSceneObject} from '../../stores/mapStore';
import ConnectionGrid from '../../ConnectionGrid_Temp';
import SceneObject from '../SceneObject/index';
import groundTexturePath from './ground.png';
import Layouter from '../../layout';
import Group from '../Group/index';

let layoutCounter = 0;
const layoutingInterval = 60;


export default class PhysicalMap extends SceneObject {

  constructor({parent, pluginIds}) {
    super({parent, id: 'physicalMap_' + pluginIds.join('-')});

    //the size of the map in world units (sizeXsize)
    this.size = 1000;

    this.groups = [];
    this.filterArray = [];
    this.pluginIds = pluginIds;

    this.createGroundGrid();
    this.bindToDatasource();
    this.registerEvents();
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

  bindToDatasource() {
    this.pluginIds.forEach(pluginId => {
      const observable = create(SnapshotConveyer, {pluginId});
      this.addSubscription(observable.subscribe(data => this.onInventoryUpdate(data)));
    });
  }

  registerEvents() {
    this.addSubscription(eventBus.on('beginUpdate').subscribe(() =>{

      //throttle layouting calling
      if(layoutCounter++ % layoutingInterval) {

        //if the flag was set to recalculate the layouting
        if(this.refreshLayout) {
          this.applyLayout();
          eventBus.emit('layoutChanged');

          this.scene.renderScene();
          this.refreshLayout = false;
        }

        layoutCounter = 0;
      }
    }));

    this.addSubscription(filters.subscribe(filterArray => {
      this.filterArray = filterArray;
      this.filter();
    }));
  }

  onInventoryUpdate(snapshots) {
    snapshots.forEach(snapshot => this.addNode(snapshot));

    this.removeVanishedNodes(snapshots);
    this.removeAllUnknownNodesWithoutConnections();

    this.refreshLayout = true;
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

  removeVanishedNodes(snapshots) {
    // calculate the ids of each snapshot only once and save them to collection
    const snapshotIds = snapshots.map(snapshot => getIdString(snapshot));

    // identify removed nodes: nodes that are not inside the snapshot update
    getAllNodes(this)
      // only the monitored
      .filter(node => !node.isUnknown)
      // only the ones that are not in snapshots anymore
      .filter(node => {
        const foundSnapshot = snapshotIds.find(id => getIdString(node.snapshot) === id);
        return !foundSnapshot;
      }).forEach((node) => node.dispose());
  }

  removeAllUnknownNodesWithoutConnections() {
    // identify removed nodes: nodes that are not inside the snapshot update
    getAllNodes(this)
      //only the monitored
      .filter(node => node.isUnknown)
      //only the ones that are not in snapshots anymore
      .filter(node => {
        const wired = node.getWiredSnapshots();
        return (wired.get('outgoing').length === 0 &&
                wired.get('incoming').length === 0);
      })
      .forEach((node) => node.dispose());
  }

  addNode(snapshot) {
    const groupId = getZone(snapshot);
    const group = this.getOrCreateGroup(groupId);

    //add the node to group (the group handles duplicates)
    const newNode = group.addNode(snapshot);
    if(!newNode) {
      return;
    }

    //if the group has switched,
    //delete the nodes in other groups than the current one
    this.removeNodeFromAllGroupsInsteadOf(groupId, snapshot);

    this.filterNode(newNode);
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
    const nodes = getAllNodes(this)
      .filter(n => isIdEqual(n.snapshot, node));

    nodes.forEach(n => {
      if(n.parent.id !== groupId) {
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
    getAllNodes(this)
      .filter(node => !node.isUnknown)
      .forEach(node => this.filterNode(node));

    selectedSceneObject.emit({sceneObject: null});
    this.scene.renderScene();
  }

  filterNode(node) {
    let unmatchesOne = false;
    this.filterArray.forEach(filter => {
      if(!filter.get('predicate')(node.snapshot)) {
        unmatchesOne = true;
      }
    });
    if(!unmatchesOne) {
      node.show();
    } else {
      node.hide();
    }
  }

  //is called from group if it has no nodes anymore
  removeChild(child) {
    _.remove(this.groups, group => group.id === child.id);
  }

  findNodeBySnapshot(snapshot) {
    let match;

    getAllNodes(this).forEach(node => {
      if(isIdEqual(node.snapshot, snapshot)) {
        match = node;
      }
    });

    return match;
  }

  updateOfVisualComponents() {
    //the map has no visual representation but the ground
    //and this isn't changing
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
