'use strict';

import THREE from 'three';

import {theme} from 'instana-ui-services/theme';
import _ from 'lodash';
import eventBus from 'instana-ui-services/eventbus';
import {getIdString} from 'instana-ui-services/util/snapshots';

import {setupStates} from './States/index';
import Connection from '../../Connection/index';
import SceneObject from '../../SceneObject';
import Highlight from '../NodeHighlight';

/*eslint-disable max-len*/
import CCP from '../../../SingleMeshFactory/ContentProvider/CubeContentProvider';
import PCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import CMCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import SCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
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

//if unavailable, the StickyNote-Metric / Layer will not be undefined but this
//to avoid all these if(available) {do something} stuff
const emptyStickyObject = {
  isEmpty: true,
  hide() {},
  show() {},
  update() {},
  updateWorldPos() {},
  render() {},
  dispose() {},
  onHighlight() {},
  setInactive() {},
  switchToMetric() {},
  switchToIcon() {}
};

export default class BaseNode extends SceneObject {

  constructor({parent, snapshot}) {
    super({parent});

    this.scene = parent.getScene();
    this.id = getIdString(snapshot);
    this.snapshot = snapshot;
    this.height = 1;

    this.connections = [];
    this.incomingConnections = [];

    this.stickyNote = emptyStickyObject;

    this.render();

    //the highlighting object which handles the highlighting stuff
    this.highlighting = new Highlight({client: this});

    this.registerEvents();
  }

  initStates() {
    return setupStates(this);
  }

  render() {
    //the cube needs a mesh to calculate the inside/outside viewfrustum check
    const cube = this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.matrixAutoUpdate = false;
    cube.rotationAutoUpdate = false;
    cube.parentSceneObject = this;

    this.addCollisionObject(cube, 1);
    this.addToGlobalGeometry();
  }

  registerEvents() {
    this.addSubscription(eventBus.on('endUpdate').subscribe((data) => {
      //update only if this node is visible
      if(!this.hidden) {
        this.update(data);
      }
    }));
  }

  update() {
    this.updateScreenPosition();
  }

  addToGlobalGeometry() {throw new Error('NOT IMPLEMENTED'); }

  getTooltipSticky() {return emptyStickyObject; }

  onSnapshotUpdate() {throw new Error('NOT IMPLEMENTED'); }

  setHeight() {throw new Error('NOT IMPLEMENTED'); }

  collectConnections() {throw new Error('NOT IMPLEMENTED'); }

  containsWired() {throw new Error('NOT IMPLEMENTED'); }

  getScreenAnchorPosition() {throw new Error('NOT IMPLEMENTED'); }

  updateStickyNotes() {
    this.stickyNote.update();
  }

  //is called via hover event
  onHighlight(highlighted) {
    this.changeStateProperty('mouseOver', highlighted);

    if(highlighted) {
      this.showTooltip();
    } else {
      this.hideTooltip();
    }
  }

  showTooltip() {
    this.hideTooltip();
    this.tooltip = this.getTooltipSticky();
  }

  hideTooltip() {
    if(this.tooltip) {
      this.tooltip.dispose();
      this.tooltip = undefined;
    }
  }

  setHighlight() {
    this.highlighting.onMouseOver();
    this.stickyNote.onHighlight(true);
  }

  clearHighlight() {
    this.highlighting.onMouseOff();
    this.stickyNote.onHighlight(false);
  }

  selectNode() {
    this.scene.setSelectedObject(this);
    this.connections.forEach(c => c.select());
    this.setHighlight();
  }

  clearNode() {
    this.scene.clearSelectedObject();
    this.connections.forEach(c => c.unSelect());
    this.clearHighlight();
  }

  //is called via scene when the user pressed on a node
  select() {
    if(this.stateProperties.selected === true) {
      return;
    }
    this.changeStateProperty('selected', true);
  }

  //is called when the user hits the node again or the selection was cleared
  //by another way
  unSelect() {
    if(this.stateProperties.selected === false) {
      return;
    }
    this.changeStateProperty('selected', false);
  }

  updateOfVisualComponents() {
    const pos = this.getPosition();

    const anchor = this.getScreenAnchorPosition();
    super.setScreenPositionAnchor(anchor.x, anchor.y, anchor.z);

    this.cube.position.set(pos.x, pos.y, pos.z);

    this.refreshMesh();
    this.refreshFragment();

    this.highlighting.refresh();
  }

  setPosition(x, y, z) {
    const pos = this.getPosition();
    if(pos.x === x && pos.y === y && pos.z === z) {
      return;
    }

    super.setPosition(x, y, z);
    this.updateOfVisualComponents();
  }

  setHeight(height) {
    this.height = height;

    this.updateOfVisualComponents();
  }

  refreshMesh() {
    this.cube.updateMatrix();
    this.cube.updateMatrixWorld();

    this.removeFromGlobalGeometry();
    this.addToGlobalGeometry();
  }

  refreshFragment() {
    const fragment = this.getNodeAsFragment();
    const scene = this.scene;

    //adding a existing fragment will penetrate an update
    scene.singleMeshFactory.addFragment(fragment);
    scene.renderScene();
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

  enableFragments(enable) {
    if(enable) {
      this.refreshFragment();
    } else {
      this.scene.singleMeshFactory.removeFragment(this.id);
    }
  }

  removeFromGlobalGeometry() {throw new Error('NOT IMPLEMENTED'); }

  getWiredSnapshots() {throw new Error('NOT IMPLEMENTED'); }

  setWiredSnapshots() {throw new Error('NOT IMPLEMENTED'); }

  getDimension() {
    return {width: 1, depth: 1};
  }

  //connects this node with another one. the connection is stored in a
  //connections collection
  connectWith(otherNode, direction) {
    //don't setup a new connection if it's still alive
    if(this.connections.indexOf(otherNode) >= 0) {
      return;
    }

    /*eslint-disable no-new*/
    new Connection({parent: this, from: this, to: otherNode, direction});
    /*eslint-enable no-new*/
  }

  show() {
    super.show();
    this.enableFragments(true);

    this.addCollisionObject(this.cube, 1);
  }

  hide() {
    super.hide();
    this.enableFragments(false);

    this.removeCollisionObject(this.cube, 1);
  }

  clearConnections() {
    this.connections.slice().forEach(c => c.dispose());
    this.connections = [];
  }

  //is called from Connection class when creating a new connection
  addConnection(connection) {
    this.connections.push(connection);
  }

  addIncomingConnection(connection) {
    this.incomingConnections.push(connection);
  }

  //is called from Connection class on disposing
  removeConnection(connection) {
    _.remove(this.connections, con => con.id === connection.id);
  }

  //is called from Connection class on disposing
  removeIncomingConnection(connection) {
    _.remove(this.incomingConnections, con => con.id === connection.id);
  }

  disposeStickyNote() {
    this.stickyNote.dispose();
    this.stickyNote = emptyStickyObject;
    this.hideTooltip();
  }

  dispose() {
    this.clearConnections();

    this.removeFromGlobalGeometry();

    this.scene.singleMeshFactory.removeFragment(this.id);
    this.scene.lineFactory.removeFragment(this.id);

    this.highlighting.dispose();

    this.changeStateProperty('mouseOver', false);
    this.changeStateProperty('selected', false);

    this.removeCollisionObject(this.cube, 2);
    this.cube = null;

    this.disposeStickyNote();

    super.dispose();

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
