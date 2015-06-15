'use strict';

import _ from 'lodash';
import THREE from 'three';

import SceneObject from './SceneObject';
import Node from './Node';
import UnknownNode from './UnknownNode';
import {getIdString} from 'instana-ui-services/util/snapshots';
import {theme} from 'instana-ui-services/theme';
import {getColor} from 'instana-ui-sdk/zones';

//use global geometry to reduce object instances
const groupGeometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
const white = 0xFFFFFF;


export default class Group extends SceneObject {

  constructor({parent, id}) {
    super({parent});

    this.id = id;
    this.children = [];

    this.createGround();
  }

  createGround() {
    let color = getColor(this.id);
    if(!color) {
      color = white;
    }

    const mat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.10,
      color: color,
      depthWrite: false
    });

    this.ground = new THREE.Mesh(groupGeometry, mat);
    // turn the ground around to make it visible. If we wouldn't be doing this,
    // then backface culling would make it invisible.
    this.ground.rotation.x = -90 * Math.PI / 180;
    this.ground.renderOrder = 1;
    this.setStatic(this.ground);
    this.addSceneObject(this.ground);

    this.edge = new THREE.EdgesHelper(this.ground, color);
    this.setStatic(this.edge);
    this.addSceneObject(this.edge);
  }

  setStatic(obj) {
    obj.matrixAutoUpdate = false;
    obj.rotationAutoUpdate = false;
    obj.updateMatrix();
  }

  createLabel() {}

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

    this.ground.position.set(x, y, z);
    this.ground.updateMatrix();
    this.edge.updateMatrix();
  }

  setScale(scale) {
    this.ground.scale.copy(scale);
    this.ground.updateMatrix();
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

  disposeMesh(mesh) {
    if(mesh) {
      mesh.geometry.dispose();
      mesh.material.dispose();
      mesh = null;
    }
  }

  dispose() {
    this.removeSceneObject(this.ground);
    this.removeSceneObject(this.edge);

    this.children.forEach(node => node.dispose());

    super.dispose();

    this.disposeMesh(this.ground.label);
    this.disposeMesh(this.edge);
    this.disposeMesh(this.ground);

    this.id = null;
    this.children = [];
  }
}
