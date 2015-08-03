'use strict';

import THREE from 'three';

import {theme} from 'in-services/theme';
import _ from 'lodash';
import eventBus from 'in-services/eventbus';
import {getIdString} from 'in-services/util/snapshots';
import {selectedSceneObject, currentTooltip} from '../../../stores/mapStore';
import {activeMetric} from 'in-services/stores/metrics';
import {level, zoomLevel} from 'in-services/stores/zoomLevel';

import Connection from '../../Connection/index';
import SceneObject from '../../SceneObject/index';
import Highlight from '../NodeHighlight';
import {cubeGeometry} from '../../geometries';

import CCP from '../../../SingleMeshFactory/ContentProvider/CubeContentProvider';
import PCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import CMCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import SCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';

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

    this.scene = this.scene;
    this.id = getIdString(snapshot);
    this.snapshot = snapshot;
    this.height = 1;

    this.tooltip = this.getTooltipSticky();

    this.connections = [];
    this.incomingConnections = [];

    this.geometryProvider = new CMCM({
      contentProvider: new PCM({
        contentProvider: new SCM({
          contentProvider: new CCP()
        })
      })
    });

    this.stickyNote = emptyStickyObject;

    this.render();

    //the highlighting object which handles the highlighting stuff
    this.highlighting = new Highlight({client: this});

    this.registerEvents();
  }

  onInitialEnter() {}

  onInitialLeave() {}

  onHighlightEnter() {
    this.setHighlight();

    this.setupConnections();
    this.forEachConnection((c) => c.changeStateProperty('mouseOver', true));
  }

  onHighlightLeave() {
    this.clearHighlight();

    this.forEachConnection((c) => c.changeStateProperty('mouseOver', false));
  }

  onSelectedEnter() {this.selected(); }

  onSelectedLeave() {this.unSelected(); }

  onInactiveEnter() {}

  onInactiveLeave() {}

  onHiddenEnter() {
    this.enableFragments(false);

    this.removeCollisionObject(this.cube, 2);
    this.removeFromGlobalGeometry();
    this.stickyNote.hide();
    this.highlighting.hide();
  }

  onHiddenLeave() {
    this.enableFragments(true);

    this.addCollisionObject(this.cube, 2);
    this.addToGlobalGeometry();
    this.stickyNote.show();
    this.highlighting.show();
  }


  selected() {
    this.forEachConnection((c) => {c.show(); c.select(); });

    this.setHighlight();
    this.makeSolidGeometry();
  }

  unSelected() {
    this.forEachConnection((c) => {c.unSelect(); c.hide(); });

    this.clearHighlight();
    this.makeSolidGeometry(false);
  }

  registerEvents() {
    this.addSubscription(eventBus.on('endUpdate').subscribe((data) => {
      //update only if this node is visible
      if(!this.isHidden()) {
        this.update(data);
      }
    }));

    this.addSubscription(zoomLevel.subscribe(zL => {
      this.zoomLevel = zL;
      if(zL === level.nearest) {
        this.removeCollisionObject(this.cube, 2);
      } else {
        this.addCollisionObject(this.cube, 2);
      }
    }));

    this.addSubscription(activeMetric.subscribe(metric => {
      this.onActiveMetric(metric);
    }));

    this.addSubscription(selectedSceneObject.subscribe(so => {
      this.onSceneObjectSelected(so);
    }));
  }

  addCollisionObject(object, layer) {
    //only add the collision object if the object is active, visible and not
    //near the screen
    if(!this.isHidden() && this.isActive() && this.zoomLevel !== level.nearest) {
      super.addCollisionObject(object, layer);
    }
  }

  onActiveMetric(metric) {
    const isActive = metric ? false : true;
    this.changeStateProperty('active', isActive);
  }

  onSceneObjectSelected(obj) {
    const isThisSelected = (obj && obj.id === this.id) ?
      true : false;

    this.changeStateProperty('selected', isThisSelected);
  }

  render() {
    //the cube needs a mesh to calculate the inside/outside viewfrustum check
    const cube = this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.matrixAutoUpdate = false;
    cube.rotationAutoUpdate = false;
    cube.parentSceneObject = this;

    this.addCollisionObject(cube, 2);
    this.addToGlobalGeometry();
  }

  makeSolidGeometry(solid=true) {
    if(solid && this.fragment) {
      this.scene.highlightingSingleMeshFactory.addFragment(this.fragment);
    } else {
      this.scene.highlightingSingleMeshFactory.removeFragment(this.id);
    }
  }

  update() {
    this.updateScreenPosition();
  }

  addToGlobalGeometry() {throw new Error('NOT IMPLEMENTED'); }

  getTooltipSticky() {return emptyStickyObject; }

  onSnapshotUpdate() {throw new Error('NOT IMPLEMENTED'); }

  setHeight() {throw new Error('NOT IMPLEMENTED'); }

  collectConnections() {throw new Error('NOT IMPLEMENTED'); }

  getScreenAnchorPosition() {throw new Error('NOT IMPLEMENTED'); }

  updateStickyNotes() {
    this.stickyNote.update();
  }

  //is called via hover event
  onHighlight(highlighted) {
    super.onHighlight(highlighted);

    currentTooltip.emit(this.tooltip);
  }

  setHighlight() {
    this.highlighting.onMouseOver();
    this.stickyNote.onHighlight(true);
  }

  clearHighlight() {
    this.highlighting.onMouseOff();
    this.stickyNote.onHighlight(false);
  }

  updateOfVisualComponents() {
    const anchor = this.getScreenAnchorPosition();
    super.setScreenPositionAnchor(anchor.x, anchor.y, anchor.z);

    const pos = this.getPosition();
    const cube = this.cube;
    cube.position.set(pos.x, pos.y, pos.z);

    this.refreshMesh();
    this.refreshFragment();

    this.removeCollisionObject(cube, 2);
    this.addCollisionObject(cube, 2);

    this.updateSolidGeometry();

    this.highlighting.refresh();
  }

  updateSolidGeometry() {
    if(this.isSelected() || this.isConnectedToSelected()) {
      this.makeSolidGeometry(true);
    }
  }

  setPosition(x, y, z) {
    const pos = this.getPosition();
    if(pos.x === x && pos.y === y && pos.z === z) {
      return;
    }

    super.setPosition(x, y, z);

    this.forEachConnection(c => c.updateOfVisualComponents());
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
    const position = this.getPosition();
    if(!position) {
      return undefined;
    }

    const color = this.calculateNodeColor();
    const pcm = this.geometryProvider.contentProvider;
    const scm = pcm.contentProvider;

    pcm.position = {x: position.x - 0.5, y: position.y, z: position.z + 0.5};
    scm.scale = {x: 1, y: this.height, z: 1};
    this.geometryProvider.color = {r: color.r, g: color.g, b: color.b};

    const fragment = this.fragment = {
      id: this.id,
      contentProvider: this.geometryProvider
    };

    const scene = this.scene;

    const highlightingFragment = scene.highlightingSingleMeshFactory.getFragment(this.id);
    if(highlightingFragment) {
      this.makeSolidGeometry();
    }

    //adding a existing fragment will penetrate an update
    scene.singleMeshFactory.addFragment(fragment);
    scene.renderScene();
  }

  enableFragments(enable) {
    if(enable) {
      this.refreshFragment();
    } else {
      this.scene.singleMeshFactory.removeFragment(this.id);
    }
  }

  removeFromGlobalGeometry() {
    const id = this.id;
    this.scene.highlightingSingleMeshFactory.removeFragment(id);
    this.scene.singleMeshFactory.removeFragment(id);
    this.scene.lineFactory.removeFragment(id);
  }

  getWiredSnapshots() {throw new Error('NOT IMPLEMENTED'); }

  setWiredSnapshots() {throw new Error('NOT IMPLEMENTED'); }

  setupConnections() {
    const wiredSnapshots = this.getWiredSnapshots();

    if(!wiredSnapshots) {
      return;
    }

    this.clearConnections();

    this.setConnectionsWithDirection(wiredSnapshots.get('outgoing'), 'out');
    this.setConnectionsWithDirection(wiredSnapshots.get('incoming'), 'in');

    this.updateOnWiredSnapshots = false;
  }

  setConnectionsWithDirection(connections, direction) {
    connections.forEach(otherSnapshot => {
      const other = this.findNodeBySnapshot(otherSnapshot);
      if(other) {
        this.connectWith(other, direction);
      }
    });
  }

  forEachConnection(fn) {
    this.getAllConnections().forEach(c => fn(c));
  }

  isConnectedToSelected() {
    let is = false;

    this.forEachConnection((c) => {
      if(c.isSelected()) {
        is = true;
        return;
      }
    });
    return is;
  }

  getAllConnections() {
    return this.connections.concat(this.incomingConnections);
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

  clearConnections() {
    this.getAllConnections().slice().forEach(c => {
      if(!c.isSelected()) {
        c.dispose();
      }
    });
  }

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
    new Connection({from: this, to: otherNode, direction});
    /*eslint-enable no-new*/
  }

  disposeStickyNote() {
    this.stickyNote.dispose();
    this.stickyNote = emptyStickyObject;
  }

  dispose() {
    super.dispose();

    this.clearConnections();
    this.removeFromGlobalGeometry();

    this.highlighting.dispose();

    this.removeCollisionObject(this.cube, 2);

    this.disposeStickyNote();

    this.cube = null;
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
