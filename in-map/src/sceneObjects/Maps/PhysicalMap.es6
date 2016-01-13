import _ from 'lodash';

import {hexToRGBNormalized} from 'in-services/converters';
import {getIn} from 'in-services/settings';
import theme from 'in-services/theme';

import MouseCameraController from '../../controls/MouseCameraController';
import GroundPlaneWithGrid from '../GroundPlanes/GroundPlaneWithGrid';
import {getAllNodes, getAllGroups} from '../../mapStructureUtils';
import Layouter from '../../layout';
import BaseMap from './BaseMap';
import Group from '../Group';


export default class PhysicalMap extends BaseMap {

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

    this.addSubscription(getIn(['map', 'unmonitoredHosts']).subscribe(hideUnmonitoredHosts =>
      this.disableUnmonitoredHosts(hideUnmonitoredHosts)
    ));
  }

  getGroundPlane() {
    return new GroundPlaneWithGrid({
      parent: this,
      size: this.size
    });
  }

  getController(canvas) {
    return new MouseCameraController({
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
  addNode(groupEntity) {
    const group = this.getOrCreateGroup(groupEntity);
    const hosts = groupEntity.get('children');

    if (hosts.size > 0) {
      hosts.forEach(host => this.addHostToGroup(host, group));
    } else {
      group.dispose();
    }
  }

  getOrCreateGroup(groupEntity) {
    const groupId = groupEntity.get('id');
    let group = _.find(getAllGroups(this), g => g.id === groupId);

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

  onInventoryUpdated(inventory) {
    this.removeVanishedHosts(inventory);
    this.refreshLayout = true;
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

  disableUnmonitoredHosts(hide) {
    if (this.hideUnmonitoredHosts !== hide) {
      this.refreshLayout = true;
    }
    this.hideUnmonitoredHosts = hide;

    if (hide) {
      console.log('HIDE / DISPOSE / DISABLE / MAKETHEMGO ALL UNMONITORED NODES');
    }
  }

  dispose() {
    super.dispose();

    // groups are disposing themselves if there is no cube inside anymore
    this.groups = [];
  }
}
