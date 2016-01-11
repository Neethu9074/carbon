import _ from 'lodash';

import {hexToRGBNormalized} from 'in-services/converters';
import {getIn} from 'in-services/settings';
import {getLabel} from 'in-sdk/snapshot';
import theme from 'in-services/theme';

import MouseCameraController from '../../controls/MouseCameraController';
import GroundPlaneWithGrid from '../GroundPlanes/GroundPlaneWithGrid';
import {getAllNodes, getAllGroups} from '../../mapStructureUtils';
import Layouter from '../../layout';
import BaseMap from './BaseMap';
import Group from '../Group';

const NAME_OF_UNDEFINED_ZONE = 'undefined zone';


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
  addNode(triple) {
    this.addNodeToGroup(triple,
                        getLabel(triple.group) || NAME_OF_UNDEFINED_ZONE);
  }

  addNodeToGroup(triple, groupId) {
    const group = this.getOrCreateGroup(triple.group, groupId);

    // add the node to group (the group handles duplicates)
    const newNode = group.addNode({
      connections: triple.connections,
      coordinates: triple.node,
      layer: triple.layers
    });

    // if the group has switched delete the nodes in other groups than the current one
    this.removeNodeFromAllGroupsInsteadOf(groupId, newNode);
    this.refreshLayout = true;
  }

  getOrCreateGroup(coordinates, id) {
    // get find the group with id
    let group = _.find(getAllGroups(this), g => g.id === id);

    // if the nodes group doesn't exist, create it
    if (!group) {
      group = new Group({id, parent: this, coordinates});
      this.groups.push(group);
    }

    return group;
  }

  // runs through all groups instead of the current one and searches for the
  // node added to the current one. if found -> delete it from old groups
  removeNodeFromAllGroupsInsteadOf(groupId, newNode) {
    const nodeId = newNode.id;
    this.getAllNodes().slice().forEach(node => {
      if (node.id === nodeId && node.parent.id !== groupId) {
        node.dispose();
      }
    });
  }

  onInventoryUpdated(structures) {
    this.removeVanishedNodes(structures);
    this.refreshLayout = true;
  }

  removeVanishedNodes(structures) {
    // identify removed nodes: nodes that are not inside the snapshot update
    this.getAllNodes().forEach(node => {
      if (node.isUnknown) {
        return;
      }
      const snapshotExistsInUpdate = structures.some(triple => triple.node.get('id') === node.id);
      if (!snapshotExistsInUpdate) {
        node.dispose();
      }
    });
  }

  addUnknownNode(node) {
    if (this.hideUnmonitoredHosts) {
      return;
    }

    // create zone and send the event back
    this.getOrCreateGroup(undefined, 'unmonitored').addUnknownNode(node);
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
      const unmonitoredGroup = this.getOrCreateGroup(undefined, 'unmonitored');
      if (unmonitoredGroup) {
        unmonitoredGroup.dispose();
      }
    }
  }

  dispose() {
    super.dispose();

    // groups are disposing themselves if there is no cube inside anymore
    this.groups = [];
  }
}
