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
import {createLogger} from 'instalog';

const logger = createLogger('ui-map.Group');

const collisionGeometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1, 1, 1);


export default class Group extends SceneObject {

  constructor({parent, id}) {
    super({parent});

    this.id = id;
    this.children = [];
    this.size = {x: 1, y: 1, z: 1};

    this.stickyNote = new StickyNote(this);

    this.addSubscription(eventBus.on('endUpdate').subscribe(() => {
      this.update();
    }));

    this.addCollisionPlane();
  }

  addCollisionPlane() {
    const plane = this.collosionPlane = new THREE.Mesh(collisionGeometry);
    plane.rotation.x = -Math.PI / 2;
    plane.matrixAutoUpdate = false;
    plane.rotationAutoUpdate = false;

    plane.parentSceneObject = this;
  }

  update() {
    this.updateScreenPosition();

    if(this.isInView()) {
      this.stickyNote.update();
    } else {
      this.stickyNote.hide();
    }
  }

  addNode(snapshot, unknown=false) {
    const nodeId = getIdString(snapshot);

    //if there is no nodeId it's an unknown node
    if(nodeId) {
      //check if the node was already created and only needs an update
      let node = _.find(this.children, node => node.id === nodeId);

      //if the node was created in the past
      if(node) {
        node.onSnapshotUpdate(snapshot);
      } else if(unknown){
        this.children.push(new UnknownNode({parent: this, snapshot}));
      } else {
        this.children.push(new Node({parent: this, snapshot}));
      }
    }
  }

  addUnknownNode(node) {
    if(this.id === 'unmonitored') {
      this.addNode(node, true);
    } else {
      this.parent.addUnknownNode(node);
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

  onHighlight(highlighted) {
    logger.debug('highlight group', this.id, highlighted);
  }

  setPosition(x, y, z) {
    super.setPosition(x, y, z);
    super.setScreenPositionAnchor(x, y, z + this.size.z / 2);

    this.collosionPlane.position.set(x, y, z);
    this.refreshCollisionObject();

    this.refreshGroundGeometry();
  }

  setScale(x, y, z) {
    this.size = {x, y, z};

    const pos = this.getPosition();
    super.setScreenPositionAnchor(pos.x, pos.y, pos.z + z / 2);

    this.collosionPlane.scale.set(x, z, 1);
    this.refreshCollisionObject();

    this.refreshGroundGeometry();
  }

  refreshCollisionObject() {
    const plane = this.collosionPlane;
    plane.updateMatrix();
    plane.updateMatrixWorld();
    this.removeCollisionObject(plane);
    this.addCollisionObject(plane);
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
    this.getScene().lineFactory.removeFragment(this.id);

    this.removeCollisionObject(this.collosionPlane);

    super.dispose();

    this.stickyNote.dispose();
    this.stickyNote = null;

    this.id = null;
    this.children = [];
  }
}
