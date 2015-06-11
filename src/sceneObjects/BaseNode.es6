'use strict';

import THREE from 'three';

import {theme} from 'instana-ui-services/theme';
import _ from 'lodash';
import eventBus from 'instana-ui-services/eventbus';
import {getIdString} from 'instana-ui-services/util/snapshots';

import Connection from './Connection';
import SceneObject from './SceneObject';

/*eslint-disable max-len*/
import CCP from '../SingleMeshFactory/ContentProvider/CubeContentProvider';
import PCM from '../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import CMCM from '../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import SCM from '../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
/*eslint-enable max-len*/

//the basic geometry is a uniformed cube, where the pivot point is at the corner
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
for (let i = 0; i < cubeGeometry.vertices.length; i++) {
  cubeGeometry.vertices[i].x -= 0.5;
  cubeGeometry.vertices[i].y += 0.5;
  cubeGeometry.vertices[i].z += 0.5;
}
//global cube material to reduce object creation
const cubeMaterial = new THREE.MeshBasicMaterial();


export default class BaseNode extends SceneObject {

  constructor({parent, snapshot}) {
    super({parent});

    this.scene = parent.getScene();
    this.id = getIdString(snapshot);
    this.snapshot = snapshot;
    this.connections = [];

    this.render();
    this.stickyNote = this.createStickyNote();

    this.registerEvents();
  }

  render() {
    //the cube needs a mesh to calculate the inside/outside viewfrustum check
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.cube.matrixAutoUpdate = false;
    this.cube.rotationAutoUpdate = false;

    //set this flag to add this obj to octree and not to scene!
    this.cube.useOnlyForCollisionDetection = true;
    this.cube.parentSceneObject = this;

    this.addSceneObject(this.cube);
    this.addToGlobalGeometry();
  }

  addToGlobalGeometry() {throw new Error('NOT IMPLEMENTED'); }

  registerEvents() {
    this.addSubscription(eventBus.on('endUpdate').subscribe((data) => {
      //update only if this node is visible
      if(!this.hidden) {
        this.update(data);
      }
    }));
  }

  createStickyNote() {throw new Error('NOT IMPLEMENTED'); }

  update() {throw new Error('NOT IMPLEMENTED'); }

  onSnapshotUpdate() {throw new Error('NOT IMPLEMENTED'); }

  setHeight() {throw new Error('NOT IMPLEMENTED'); }

  updateStickyNotes() {
    this.stickyNote.update();
  }

  setPosition(x, y, z) {
    const pos = this.getPosition();
    if(pos.x === x && pos.y === y && pos.z === z) {
      return;
    }

    super.setPosition(x, y, z);
    this.cube.position.set(x, y, z);

    this.refreshMesh();
    this.refreshFragment();
  }

  refreshMesh() {
    this.cube.updateMatrix();
    this.cube.updateMatrixWorld();

    this.stickyNote.updateWorldPos();

    this.removeFromGlobalGeometry();
    this.addToGlobalGeometry();
  }

  refreshFragment() {
    //adding a existing fragment will penetrate an update
    const color = this.calculateHealthColor();
    const position = this.getPosition();
    const scale = this.cube.scale;
    this.scene.singleMeshFactory.addFragment({
      id: this.id,
      contentProvider: new CMCM({
        contentProvider: new PCM({
          contentProvider: new SCM({
            contentProvider: new CCP(),
            x: scale.x, y: scale.y, z: scale.z
          }),
          x: position.x - 0.5, y: position.y, z: position.z + 0.5
        }),
        r: color.r, g: color.g, b: color.b
      })
    });
  }

  getDimension() {
    return {width: 1, depth: 1};
  }

  //connects this node with another one. the connection is stored in a
  //connections collection
  connectWith(otherNode) {
    //don't setup a new connection if it's still alive
    if(this.connections.indexOf(otherNode) >= 0) {
      return;
    }

    /*eslint-disable no-new*/
    new Connection({parent: this, from: this, to: otherNode});
    /*eslint-enable no-new*/
  }

  //is called from Connection class when creating a new connection
  addConnection(connection) {
    this.connections.push(connection);
  }

  show() {
    super.show();
    this.enableFragments(true);
    this.connections.forEach(c => c.show());
  }

  hide() {
    super.hide();
    this.enableFragments(false);
    this.connections.forEach(c => c.hide());
  }

  enableFragments(enable) {
    if(enable) {
      this.refreshFragment();
    } else {
      this.scene.singleMeshFactory.removeFragment(this.id);
    }
  }

  removeFromGlobalGeometry() {throw new Error('NOT IMPLEMENTED'); }

  clearConnections() {
    this.connections.forEach(c => c.dispose());
    this.connections = [];
  }

  //is called from Connection class on disposing
  removeConnection(connection) {
    _.remove(this.connections, con => con.id === connection.id);
  }

  dispose() {
    this.clearConnections();

    this.removeFromGlobalGeometry();
    this.scene.singleMeshFactory.removeFragment(this.id);
    this.removeSceneObject(this.cube);
    this.cube = null;

    this.stickyNote.dispose();

    super.dispose();

    this.scene = null;
    this.id = null;
  }

  calculateHealthColor() {
    const ok = new THREE.Color(theme.map.colors.default);
    return {r: ok.r, g: ok.g, b: ok.b};
  }

  calculatePower() {
    return 1;
  }
}
