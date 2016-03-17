import remove from 'lodash/remove';

import CameraController from 'in-map/src/controls/physical/CameraController';
import {hexToRGBNormalized} from 'in-services/formatters/color';
import {find} from 'in-services/arrayUtils';
import theme from 'in-services/theme';

import {getAllNodes, getAllGroups} from './mapUtils';
import GroundPlane from './GroundPlane';
import BaseMap from '../common/Map';
import Layouter from './Layouter';
import Group from './Group';


export default class Map extends BaseMap {

  constructor({parent}) {
    super({parent, id: 'PhysicalMap'});

    const color = hexToRGBNormalized(theme.map.colors.groundDots);
    this.groundPlane.setColor(color);
  }

  init() {
    this.groups = [];
  }

  registerEvents() {
    super.registerEvents();
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

  onZoom(zoomLevel) {
    if (this.groundPlane) {
      this.groundPlane.onZoom(zoomLevel);
    }
  }

  // is called if new data is available and parsed in BaseMap
  addEntity(groupEntity) {
    const group = this.getOrCreateGroup(groupEntity);
    const hosts = groupEntity.get('children');

    hosts.forEach(host => this.addHostToGroup(host, group));
  }

  onInventoryUpdated(inventory) {
    super.onInventoryUpdated(inventory);
    this.removeVanishedHosts(inventory);
    this.layoutNeedsUpdate();
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

  applyLayout() {
    new Layouter().applyLayout(this);
  }

  dispose() {
    super.dispose();

    // groups are disposing themselves if there is no cube inside anymore
    this.groups = [];
  }
}
