import {remove} from 'lodash';
import THREE from 'three';

import FadeByDistanceSingleMeshFactory from 'in-map/src/SingleMeshFactory/FadeByDistanceSingleMeshFactory';
import SingleMeshGlyphPointsFactory from 'in-map/src/SingleMeshFactory/SingleMeshGlyphPointsFactory';
import SingleMeshMetricFactory from 'in-map/src/SingleMeshFactory/SingleMeshMetricFactory';
import SingleMeshLineFactory from 'in-map/src/SingleMeshFactory/SingleMeshLineFactory';
import {getAllNodes, getAllGroups} from 'in-map/src/3DSceneObjects/physical/mapUtils';
import SingleMeshFactory from 'in-map/src/SingleMeshFactory/SingleMeshFactory';
import physicalViewStructure$ from 'in-map/src/stores/physical/viewStructure';
import CameraController from 'in-map/src/controls/physical/CameraController';
import GroundPlane from 'in-map/src/3DSceneObjects/physical/GroundPlane';
import Layouter from 'in-map/src/3DSceneObjects/physical/Layouter';
import Group from 'in-map/src/3DSceneObjects/physical/Group';
import {focusEntityId$} from 'in-map/src/stores/focusEntity';
import BaseMap from 'in-map/src/3DSceneObjects/common/Map';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import {activeMetric} from 'in-services/stores/metrics';
import {lastQueryChangeTime$} from 'in-stores/search';
import {eventBus} from 'in-map/src/services/eventBus';
import * as snapshotStore from 'in-stores/snapshot';
import {goToDashboard} from 'in-stores/navigation';
import {find} from 'in-services/arrayUtils';


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
    this.lastQueryChangeTime = 0;
    this.layouter = new Layouter();
  }

  setupFactories() {
    const factories = this.factories;

    factories.singleMeshMetricFactory = new SingleMeshMetricFactory();

    factories.groundSMF = new SingleMeshFactory();
    factories.groundSMF.material.transparent = true;
    factories.groundSMF.material.opacity = 0.3;

    factories.highlightingSMF = new FadeByDistanceSingleMeshFactory({renderOrder: 3});

    factories.fadeByDistanceSMF = new FadeByDistanceSingleMeshFactory({renderOrder: 3});

    factories.solidSMF = new SingleMeshFactory({renderOrder: 3});
    factories.solidSMF.material.opacity = 0.3;

    factories.layerSMF = new SingleMeshFactory();
    factories.layerSMF.material.opacity = 0.3;
    factories.layerSMF.material.transparent = false;
    factories.layerSMF.material.color = new THREE.Color(0.85, 0.85, 0.85);

    factories.lineSMF = new SingleMeshLineFactory();

    factories.singleMeshGlyphPointsFactory = new SingleMeshGlyphPointsFactory();

    factories.baselineSMF = new SingleMeshLineFactory();
    factories.baselineSMF.material.transparent = true;
  }

  registerEvents() {
    super.registerEvents();

    this.addSubscriptions([
      lastQueryChangeTime$.subscribe(lastQueryChangeTime => this.lastQueryChangeTime = lastQueryChangeTime),

      physicalViewStructure$.subscribe((structure) => {
        this.onInventoryUpdate(structure);

        if (this.lastQueryChangeTime + TIME_BETWEEN_FILTER_UPDATE_AND_AUTO_CENTER > Date.now()) {
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

      focusEntityId$.skipFirst().subscribe(id => {
        // if there is no entity defined, center map
        if (!id) {
          this.centerMap();
        }
      }),

      eventBus.on('openDashboard').subscribe(id => {
        if (id) {
          setSelectedSnapshotId(id);
          goToDashboard();

          // clear stream
          eventBus.emit('openDashboard', null);
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
  addGroup(groupEntity, includedIds) {
    const group = this.getOrCreateGroup(groupEntity);
    const hosts = groupEntity.get('children');

    hosts.forEach(host => {
      if (!includedIds || includedIds.hostIds[host.get('id')]) {
        this.addHost(host, group, includedIds);
      }
    });
  }

  onInventoryUpdate({viewStructure, includedIds}) {
    const groups = viewStructure.get('children');
    groups.forEach(group => {
      if (!includedIds || includedIds.groupIds[group.get('id')]) {
        this.addGroup(group, includedIds);
      }
    });

    this.removeVanishedHosts(groups, includedIds);
    this.layoutNeedsUpdate();
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

  addHost(hostEntity, group, includedIds) {
    // add the node to group (the group handles duplicates)
    const newNode = group.addNode(hostEntity, includedIds);

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
  removeVanishedHosts(inventory, includedIds) {
    const currentHostIds = {};
    inventory.forEach(group => {
      const hosts = group.get('children');
      hosts.forEach(host => currentHostIds[host.get('id')] = host);
    });

    this.getAllNodes().forEach(node => {
      if (!currentHostIds[node.id] ||
         (includedIds && !includedIds.hostIds[node.id])) {
        node.dispose();
      } else if (includedIds) {
        node.checkLayer(currentHostIds[node.id], includedIds);
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
    const width = this.layouter.currentDimensions.x;
    const height = this.layouter.currentDimensions.y;
    this.controller.flyToPosition(
      width / 2, -(height / 2) * (height / width)
    );
  }

  applyLayout() {
    this.layouter.applyLayout(this);
  }

  dispose() {
    // make shure that there is no update incoming until disposing
    clearInterval(this.metricUpdateInterval);
    this.metricUpdateInterval = null;

    // destory all known and unknown nodes
    this.getAllNodes(this).slice().forEach(node => node.dispose());

    super.dispose();

    this.activeMetric = null;

    // groups are disposing themselves if there is no cube inside anymore
    this.groups = [];
  }
}
