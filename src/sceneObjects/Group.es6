'use strict';

import _ from 'lodash';
import THREE from 'three';

import SceneObject from './SceneObject';
import Node from './Node';
import UnknownNode from './UnknownNode';
import StickyNote from './StickyNote/Ground';

import eventBus from 'instana-ui-services/eventbus';
import {getIdString} from 'instana-ui-services/util/snapshots';
import {getColor} from 'instana-ui-sdk/zones';
import {hexToRGBNormalized} from 'instana-ui-services/converters';


export default class Group extends SceneObject {

  constructor({parent, id}) {
    super({parent});

    this.id = id;
    this.children = [];
    this.size = {x: 1, y: 1, z: 1};

    this.stickyNote = new StickyNote(this);

    this.addSubscription(eventBus.on('endUpdate').subscribe(() => {
      this.stickyNote.update();
    }));
  }

  addNode({snapshot, unknown=false}) {
    const nodeId = getIdString(snapshot);

    //if there is no nodeId it's an unknown node
    if(nodeId) {
      //check if the node was already created and only needs an update
      let node = _.find(this.children, node => node.id === nodeId);

      //if the node was created in the past
      if(node) {
        node.onSnapshotUpdate(snapshot);
      } else if(unknown) {
        this.children.push(
          new UnknownNode({parent: this, snapshot}));
      } else {
        this.children.push(new Node({parent: this, snapshot}));
      }
    }
  }

  addGroup(group) {
    if(this.children.indexOf(child => child.id === group.id) >= 0) {
      return;
    }

    this.children.push(group);
  }

  getDimension() {
    let width = 1;
    let depth = 1;

    this.children.forEach(child => {
      const w = child.getDimension().width;
      if(w > width) {
        width = w;
      }
    });

    width += 2;

    this.children.forEach(child => {
      depth += 1 + child.getDimension().depth;
    });

    return {width, depth};
  }

  setPosition(x, y, z) {
    super.setPosition(x, y, z);
    this.refreshGroundGeometry();
  }

  setScale(x, y, z) {
    this.size = {x, y, z};
    this.refreshGroundGeometry();
  }

  refreshGroundGeometry() {
    const color = hexToRGBNormalized(getColor(this.id) || 0xFFFFFF);
    const lineFactory = this.getScene().lineFactory;
    const size = this.size;
    const pos = this.getPosition();
    const sizeXHalf = size.x / 2;
    const sizeZHalf = size.z / 2;
    const posX = pos.x;
    const posZ = pos.z;

    const points = [
      {x: posX - sizeXHalf, y: 0, z: posZ - sizeZHalf},
      {x: posX + sizeXHalf, y: 0, z: posZ - sizeZHalf},

      {x: posX + sizeXHalf, y: 0, z: posZ - sizeZHalf},
      {x: posX + sizeXHalf, y: 0, z: posZ + sizeZHalf},

      {x: posX + sizeXHalf, y: 0, z: posZ + sizeZHalf},
      {x: posX - sizeXHalf, y: 0, z: posZ + sizeZHalf},

      {x: posX - sizeXHalf, y: 0, z: posZ + sizeZHalf},
      {x: posX - sizeXHalf, y: 0, z: posZ - sizeZHalf}
    ];

    lineFactory.removeFragment(this.id);
    lineFactory.addFragment({id: this.id, points, color});
  }

  removeChild(child) {
    _.remove(this.children, node => node.id === child.id);

    //destroy this group if there are no children anymore
    if(this.children.length === 0) {
      //remove this from parents groups collection
      this.parent.removeChild(this);

      this.dispose();
    }
  }

  dispose() {
    this.children.forEach(node => node.dispose());

    super.dispose();

    this.stickyNote.dispose();
    this.stickyNote = null;

    this.id = null;
    this.children = [];
  }
}
