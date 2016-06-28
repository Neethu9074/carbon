import {remove} from 'lodash';
import THREE from 'three';

import FadeByDistanceSingleMeshFactory from 'in-map/src/SingleMeshFactory/FadeByDistanceSingleMeshFactory';
import SingleMeshGlyphPointsFactory from 'in-map/src/SingleMeshFactory/SingleMeshGlyphPointsFactory';
import SingleMeshMetricFactory from 'in-map/src/SingleMeshFactory/SingleMeshMetricFactory';
import SingleMeshLineFactory from 'in-map/src/SingleMeshFactory/SingleMeshLineFactory';
import {getAllNodes, getAllGroups} from 'in-map/src/3DSceneObjects/physical/mapUtils';
import SingleMeshFactory from 'in-map/src/SingleMeshFactory/SingleMeshFactory';
import CameraController from 'in-map/src/controls/physical/CameraController';
import GroundPlane from 'in-map/src/3DSceneObjects/physical/GroundPlane';
import Layouter from 'in-map/src/3DSceneObjects/physical/Layouter';
import Group from 'in-map/src/3DSceneObjects/physical/Group';
import {focusEntityId$} from 'in-map/src/stores/focusEntity';
import BaseMap from 'in-map/src/3DSceneObjects/common/Map';
import {lastFilterChangeTime$} from 'in-stores/filtering';
import {activeMetric} from 'in-services/stores/metrics';
import * as snapshotStore from 'in-stores/snapshot';
import {viewStructure} from 'in-stores/view';
import {find} from 'in-services/arrayUtils';
import eventBus from 'in-map/src/eventbus';


// The time between a filter change and automatic center alignment of the camera.
// Meaning: When a new view structure is received in less than TIME_BETWEEN_FILTER_UPDATE_AND_AUTO_CENTER
// millis, the map is automatically centered. This is used to make sure that
// the user is always presented with the data that matches is query.
const TIME_BETWEEN_FILTER_UPDATE_AND_AUTO_CENTER = 1000;


export default class Map extends BaseMap {

  constructor({parent}) {
    super({parent, id: 'PhysicalMap'});
  }

  init() {
    this.activeMetric = null;
    this.groups = [];
    this.lastFilterChangeTime = 0;
    this.layouter = new Layouter();
  }

  setupFactories() {
    const factories = this.factories;
    const scene = this.parent;

    factories.singleMeshMetricFactory = new SingleMeshMetricFactory({scene});

    factories.groundSMF = new SingleMeshFactory({scene});
    factories.groundSMF.material.transparent = true;
    factories.groundSMF.material.opacity = 0.3;

    factories.highlightingSMF = new FadeByDistanceSingleMeshFactory({scene, renderOrder: 3});

    factories.fadeByDistanceSMF = new FadeByDistanceSingleMeshFactory({scene, renderOrder: 3});

    factories.solidSMF = new SingleMeshFactory({scene, renderOrder: 3});
    factories.solidSMF.material.opacity = 0.3;

    factories.layerSMF = new SingleMeshFactory({scene});
    factories.layerSMF.material.opacity = 0.3;
    factories.layerSMF.material.transparent = false;
    factories.layerSMF.material.color = new THREE.Color(0.85, 0.85, 0.85);

    factories.lineSMF = new SingleMeshLineFactory({scene});

    factories.singleMeshGlyphPointsFactory = new SingleMeshGlyphPointsFactory({scene});

    factories.baselineSMF = new SingleMeshLineFactory({scene});
    factories.baselineSMF.material.transparent = true;
  }

  registerEvents() {
    super.registerEvents();

    this.addSubscriptions([
      lastFilterChangeTime$.subscribe(lastFilterChangeTime => this.lastFilterChangeTime = lastFilterChangeTime),

      viewStructure.subscribe(structures => {
        this.onInventoryUpdate(structures);

        if (this.lastFilterChangeTime + TIME_BETWEEN_FILTER_UPDATE_AND_AUTO_CENTER > Date.now()) {
          setTimeout(() => this.centerMap(), 100);
        }
      }),

      eventBus.on('flyToEntity').subscribe(entity => this.controller.flyToObject(entity)),

      activeMetric.subscribe(metric => {
        if (metric) {
          this.activeMetric = metric.get('metrics');
          this.hideHulls();
        } else {
          this.activeMetric = null;
          this.showHulls();
        }
      }),

      snapshotStore.selectedSnapshotId.subscribe(selectedId => selectedId ? this.hideHulls() : this.showHulls()),

      focusEntityId$.subscribe(id => {
        // if there is no entity defined, center map
        if (!id) {
          this.centerMap();
        }
      })
    ]);

    this.metricUpdateInterval = setInterval(() => {
      if (this.activeMetric) {
        this.factories.singleMeshMetricFactory.updateHeights();
      }
    }, 1000);
  }

  getGroundPlane() {
    return new GroundPlane({
      parent: this,
      size: this.size
    });
  }

  getController(canvas) {
    return new CameraController({
      scene: this.scene,
      map: this,
      canvas
    });
  }

  // is called if new data is available and parsed in BaseMap
  addEntity(groupEntity) {
    const group = this.getOrCreateGroup(groupEntity);
    const hosts = groupEntity.get('children');

    hosts.forEach(host => this.addHostToGroup(host, group));
  }

  onInventoryUpdate(rootNode) {
    const inventory = rootNode.get('children');
    inventory.forEach(entity => this.addEntity(entity));

    this.onInventoryUpdated(inventory);

    this.removeVanishedHosts(inventory);
    this.layoutNeedsUpdate();
  }

  onInventoryUpdated(inventory) {
    const allNodes = this.getAllNodes();

    // add connections later because all nodes need to be there
    inventory.forEach(entity => {
      const entityId = entity.get('id');
      const matchedNode = find(allNodes, n => n.id === entityId);

      if (matchedNode) {
        matchedNode.setChildren(entity.get('children'));

        const connectionsHandler = matchedNode.getComponent('connectionsHandler');
        connectionsHandler.setOutgoingConnections(entity.get('outgoingConnections'));
        connectionsHandler.setIncomingConnections(entity.get('incomingConnections'));
      }
    });
  }

  hideHulls() {
    const factories = this.factories;
    factories.layerSMF.material.transparent = true;
    factories.layerSMF.material.depthWrite = false;
    factories.baselineSMF.material.opacity = 0.3;
    factories.solidSMF.material.transparent = true;
  }

  showHulls() {
    if (!this.activeMetric) {
      const factories = this.factories;
      factories.layerSMF.material.transparent = false;
      factories.layerSMF.material.depthWrite = true;
      factories.baselineSMF.material.opacity = 1;
      factories.solidSMF.material.transparent = false;
    }
  }

  getOrCreateGroup(groupEntity) {
    const groupId = groupEntity.get('id');
    let group = find(getAllGroups(this), g => g.id === groupId);

    // if the nodes group doesn't exist, create it
    if (!group) {
      group = new Group({parent: this, entity: groupEntity});
      this.groups.push(group);
    }

    return group;
  }

  addHostToGroup(hostEntity, group) {
    // add the node to group (the group handles duplicates)
    const newNode = group.addNode(hostEntity);

    // if the group has switched delete the nodes in other groups than the current one
    this.removeNodeFromAllGroupsInsteadOf(group, newNode);
    this.refreshLayout = true;
  }

  // runs through all groups instead of the current one and searches for the
  // node added to the current one. if found -> delete it from old groups
  removeNodeFromAllGroupsInsteadOf(group, newNode) {
    const nodeId = newNode.id;
    this.getAllNodes().slice().forEach(node => {
      if (node.id === nodeId && node.parent.id !== group.id) {
        node.dispose();
      }
    });
  }

  // checks if there are nodes on the map which are not inside the inventory anymore and delete them
  removeVanishedHosts(inventory) {
    const currentHostIds = [];
    inventory.forEach(group => {
      const hosts = group.get('children');
      hosts.forEach(host => currentHostIds.push(host.get('id')));
    });

    this.getAllNodes().forEach(node => {
      const index = currentHostIds.indexOf(node.id);
      if (index < 0) {
        node.dispose();
      }
    });
  }

  getAllNodes() {
    return getAllNodes(this);
  }

  // is called from group if it has no nodes anymore
  removeChild(child) {
    remove(this.groups, group => group.id === child.id);
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

  centerMap() {
    this.controller.flyToPosition(this.layouter.currentDimensions.x / 2, -this.layouter.currentDimensions.y / 2);
  }

  applyLayout() {
    this.layouter.applyLayout(this);
  }

  dispose() {
    // make shure that there is no update incoming until disposing
    clearInterval(this.metricUpdateInterval);
    this.metricUpdateInterval = null;

    super.dispose();

    this.activeMetric = null;

    // groups are disposing themselves if there is no cube inside anymore
    this.groups = [];
  }
}
