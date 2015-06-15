'use strict';

import THREE from 'three';

import {theme} from 'instana-ui-services/theme';
import _ from 'lodash';
import eventBus from 'instana-ui-services/eventbus';
import {getIdString} from 'instana-ui-services/util/snapshots';
import {hexToRGBNormalized} from 'instana-ui-services/util/colors';

import * as app from '../Scene';
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
const highlightColor = hexToRGBNormalized(theme.map.colors.connection);

//if unavailable, the StickyNote-Metric / Layer will not be undefined but this
//to avoid all these if(available) {do something} stuff
const emptyStickyObject = {
  hide() {},
  update() {},
  updateWorldPos() {},
  render() {},
  dispose() {},
  show() {}
};


export default class BaseNode extends SceneObject {

  constructor({parent, snapshot}) {
    super({parent});

    this.scene = parent.getScene();
    this.id = getIdString(snapshot);
    this.snapshot = snapshot;
    this.connections = [];

    this.stickyNote = emptyStickyObject;
    this.render();

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

  highlight(value) {
    //if mouseover and not isSelected
    if(value && !this.isSelected) {
      this.setupExplicitHighLight();

    //if mouseoff and not isSelected
    } else if(!value && !this.isSelected) {
      this.clearExplicitHighlight();
    }
  }

  select() {
    this.setupExplicitHighLight();
    this.isSelected = true;
  }

  unSelect() {
    this.isSelected = false;
    this.clearExplicitHighlight();
  }

  //the explicit highlight is used for the primary isSelected or mouseover node
  setupExplicitHighLight() {
    this.isHighlighted = true;

    if(this.stickyNote === emptyStickyObject) {
      this.stickyNote = this.createStickyNote();
    }

    //add the fargment to the highlight factory
    //so that the material is not faded by camera distance
    this.scene.highlightSingleMeshFactory.addFragment(this.getNodeAsFragment());

    //show all connections of the node
    this.connections.forEach(c => c.highlight(true));

    this.renderScene();
  }

  clearExplicitHighlight() {
    this.isHighlighted = false;

    //remove the highlight from the factory
    this.scene.highlightSingleMeshFactory.removeFragment(this.id);

    //hide all connections
    this.connections.forEach(c => c.highlight(false));

    this.renderScene();
  }

  //the primary highlight is for nodes
  //which are connected with a primary isSelected node
  setupImplicitHighlight() {
    const pos = this.getPosition();
    const points = [
      {x: pos.x + 0.01, y: 0, z: pos.z - 0.01},
      {x: pos.x - 1.01, y: 0, z: pos.z - 0.01},

      {x: pos.x - 1.01, y: 0, z: pos.z - 0.01},
      {x: pos.x - 1.01, y: 0, z: pos.z + 1.01},

      {x: pos.x - 1.01, y: 0, z: pos.z + 1.01},
      {x: pos.x, y: 0, z: pos.z + 1.01},

      {x: pos.x + 0.01, y: 0, z: pos.z + 1.01},
      {x: pos.x + 0.01, y: 0, z: pos.z - 0.01}
    ];

    const factory = this.getScene().lineFactory;
    factory.addFragment({id: this.id, points, color: highlightColor});

    if(this.stickyNote === emptyStickyObject) {
      this.stickyNote = this.createStickyNote();
    }
  }

  clearImplicitHighlight() {
    //if this node is connected to a isSelected node
    if(_.find(this.connections, c => (c.from.isSelected || c.to.isSelected))) {
      return;
    }

    if(!this.isSelected) {
      this.disposeStickyNote();
    }

    //remove frame on the ground
    this.scene.lineFactory.removeFragment(this.id);
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
    const fragment = this.getNodeAsFragment();
    const scene = this.scene;

    //adding a existing fragment will penetrate an update
    scene.singleMeshFactory.addFragment(fragment);

    //if this fragment is isHighlighted -> update the hightlight geometry
    if(scene.lineFactory.getFragment(this.id)) {
      this.setupImplicitHighlight();
    }

    if(scene.highlightSingleMeshFactory.getFragment(this.id)) {
      scene.highlightSingleMeshFactory.addFragment(fragment);
    }
  }

  getNodeAsFragment() {
    const color = this.calculateNodeColor();
    const position = this.getPosition();
    const scale = this.cube.scale;

    return {
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
    };
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
    const con = new Connection({parent: this, from: this, to: otherNode});
    con.highlight(this.isHighlighted);
    /*eslint-enable no-new*/
  }

  //is called from Connection class when creating a new connection
  addConnection(connection) {
    this.connections.push(connection);
  }

  show() {
    super.show();
    this.enableFragments(true);
  }

  hide() {
    super.hide();
    this.enableFragments(false);
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

    //if this cube has no other connection -> clear highlight
    if(this.connections.length === 0) {
      this.clearImplicitHighlight();
    }
  }

  disposeStickyNote() {
    this.stickyNote.dispose();
    this.stickyNote = emptyStickyObject;
  }

  dispose() {
    this.clearConnections();

    this.clearExplicitHighlight();

    this.removeFromGlobalGeometry();

    this.scene.singleMeshFactory.removeFragment(this.id);
    this.scene.highlightSingleMeshFactory.removeFragment(this.id);

    this.removeSceneObject(this.cube);
    this.cube = null;

    this.disposeStickyNote();

    super.dispose();

    //this.scene = null;
    this.id = null;
  }

  calculateNodeColor() {
    const ok = new THREE.Color(theme.map.colors.default);
    return {r: ok.r, g: ok.g, b: ok.b};
  }

  calculatePower() {
    return 1;
  }
}
