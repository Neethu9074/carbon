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

  constructor({parent, id, groupIndex}) {
    super({parent});

    this.id = id;
    this.groupIndex = groupIndex;
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

  createLabel() {
    const label = this.getGroupLabel(this.id);
    label.updateMatrix();
    label.matrixAutoUpdate = false;
    this.ground.add(label);
    this.ground.label = label;
  }

  /* the group label is a plane with a transparent texture on it.
  * the texture is created via a canvas which is filled with a text and
  * then transformed into a texture.
  */
  getGroupLabel(text) {
    const canvas = document.createElement('canvas');
    let color = getColor(this.id);
    color = color === undefined ? '#FFFFFF' : color;

    canvas.width = 600;
    canvas.height = 100;
    const context = canvas.getContext('2d');

    context.fillStyle = color;
    context.font = '100px ' + theme.common.fontFamily;
    context.fillText(text, 0, 95);

    // use canvas content as a texture
    const texture = new THREE.Texture(canvas);

    //set the minFilter, because the textures size is not power of 2
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });
    return new THREE.Mesh(groupGeometry, mat);
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
        this.children.push(new UnknownNode({parent: this, snapshot}));
      } else {
        this.children.push(new Node({parent: this, snapshot}));
      }
    }
  }

  setPosition(x, y, z) {
    super.setPosition(x, y, z);

    this.ground.position.set(x, y, z);
    this.ground.updateMatrix();
    this.edge.updateMatrix();
  }

  setScale(scale) {
    this.ground.scale.copy(scale);

    if(this.ground.children.length > 0) {
      const scaleX = 1 / scale.x * 3;
      const scaleY = 1 / scale.y * 0.5;
      const scaleZ = 1 / scale.z;
      this.ground.updateMatrix();
      this.edge.updateMatrix();

      const label = this.ground.label;
      if(label) {
        label.position.set(-0.5 + scaleX / 2, -0.5 + scaleY / 2, 0.05);
        label.scale.set(scaleX, scaleY, scaleZ);
        label.updateMatrix();
      }
    }
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
    this.groupIndex = null;
  }
}
