'use strict';

import THREE from 'three';

//components
import CollisionComponent from '../../../components/CollisionObjectComponent';
import ConnectionComponent from '../../../components/ConnectionComponent';
import MeshComponent from '../../../components/MeshComponent';
import HighlightingComponent from '../../../components/HighlightingComponent';

import {theme} from 'in-services/theme';
import eventBus from 'in-services/eventbus';
import {getIdString} from 'in-services/util/snapshots';
import {selectedSceneObject, currentTooltip} from '../../../stores/mapStore';
import {activeMetric} from 'in-services/stores/metrics';


import SceneObject from '../../SceneObject/index';
import {cubeGeometry, defaultGeometryMaterial} from '../../geometries';

import CCP from '../../../SingleMeshFactory/ContentProvider/CubeContentProvider';
import PCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import CMCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import SCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';


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
    super({parent, id: getIdString(snapshot)});

    this.scene = this.scene;
    this.snapshot = snapshot;
    this.height = 1;

    this.tooltip = this.getTooltipSticky();

    this.stickyNote = emptyStickyObject;

    this.render();

    this.registerEvents();
  }

  onHighlightEnter() {
    //setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', true);

    //show all connections as grey lines
    this.getComponent('connection').highlightChanged(true);
  }

  onHighlightLeave() {
    //hide the border highlighting stuff
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', false);

    //hide the grey connection lines
    this.getComponent('connection').highlightChanged(false);
  }

  onSelectedEnter() {
    //setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', true);

    //surounds the node with a white hull
    this.showSolidMesh();

    //show all connections as white lines
    this.getComponent('connection').selectionChanged(true);
  }

  onSelectedLeave() {
    //setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', false);

    //dispose the white hull
    this.showSolidMesh(false);

    //hide the white connection lines
    this.getComponent('connection').selectionChanged(false);
  }

  onSelectedHighlightEnter() {
    //setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', true);

    //surounds the node with a white hull
    this.showSolidMesh();

    //show all connections as white lines
    this.getComponent('connection').selectionChanged(true);
  }

  onSelectedHighlightLeave() {
    //hide the border highlighting stuff
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', false);

    //dispose the white hull
    this.showSolidMesh(false);

    //hide the white connection lines
    this.getComponent('connection').selectionChanged(false);
  }

  onSelectedHighlightInactiveEnter() {}

  onSelectedHighlightInactiveLeave() {}

  onHighlightInactiveEnter() {}

  onHighlightInactiveLeave() {}


  onHiddenEnter() {
    super.onHiddenEnter();

    this.enableFragments(false);

    this.removeFromGlobalGeometry();
    this.stickyNote.hide();
  }

  onHiddenLeave() {
    super.onHiddenLeave();

    this.enableFragments(true);

    this.addToGlobalGeometry();
    this.stickyNote.show();
  }

  initComponents() {
    super.initComponents();

    const components = this.components;

    //add the collision component to handle the collision box
    components.collision = new CollisionComponent({
      sceneObject: this,
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      layer: 2
    });

    //add the connection component to handle all the visual connection lines
    components.connection = new ConnectionComponent({sceneObject: this});

    const pcm = new PCM({
      contentProvider: new SCM({
        contentProvider: new CCP()
      })
    });

    //add the mesh component to handle visual representation of the node
    components.mesh = new MeshComponent({
      sceneObject: this,
      contentProvider: new CMCM({contentProvider: pcm}),
      id: this.id + '_mesh',
      factory: this.scene.singleMeshFactory
    });

    //add the solidMesh component to handle the solid fill color of a node
    components.solidMesh = new MeshComponent({
      sceneObject: this,
      contentProvider: new CMCM({contentProvider: pcm}),
      id: this.id + '_solidMesh',
      factory: this.scene.highlightingSingleMeshFactory
    });
    components.solidMesh.stateMachine.changeStateProperty('active', false);

    //add the highlighting component to handle the highlighting of a node
    //this is different to solidMesh since the highlighting is like a mouseOver effect
    components.highlighting = new HighlightingComponent({sceneObject: this});
    components.highlighting.stateMachine.changeStateProperty('active', false);
  }

  registerEvents() {
    this.addSubscription(eventBus.on('endUpdate').subscribe((data) => {
      //update only if this node is visible
      if(!this.isHidden()) {
        this.update(data);
      }
    }));

    this.addSubscription(activeMetric.subscribe(metric => {
      this.onActiveMetric(metric);
    }));

    this.addSubscription(selectedSceneObject.subscribe(so => {
      this.onSceneObjectSelected(so);
    }));
  }

  onActiveMetric(metric) {
    const isActive = metric ? false : true;
    this.stateMachine.changeStateProperty('active', isActive);
  }

  onSceneObjectSelected(obj) {
    const isThisSelected = (obj && obj.id === this.id) ?
      true : false;

    this.stateMachine.changeStateProperty('selected', isThisSelected);
  }

  render() {
    this.addToGlobalGeometry();
  }

  showSolidMesh(solid=true) {
    this.getComponent('solidMesh').stateMachine.changeStateProperty('active', solid);
  }

  update() {
    this.updateScreenPosition();
  }

  addToGlobalGeometry() {throw new Error('NOT IMPLEMENTED'); }

  getTooltipSticky() {return emptyStickyObject; }

  onSnapshotUpdate() {throw new Error('NOT IMPLEMENTED'); }

  setHeight() {throw new Error('NOT IMPLEMENTED'); }

  getScreenAnchorPosition() {throw new Error('NOT IMPLEMENTED'); }

  updateStickyNotes() {
    this.stickyNote.update();
  }

  //is called via hover event
  onHighlight(highlighted) {
    super.onHighlight(highlighted);

    currentTooltip.emit(this.tooltip);
  }

  updateOfVisualComponents() {
    const anchor = this.getScreenAnchorPosition();
    super.setScreenPositionAnchor(anchor.x, anchor.y, anchor.z);

    this.refreshMesh();
    this.refreshFragment();
  }

  positionChanged(x, y, z) {
    this.getComponent('collision').positionChanged(x, y, z);
    this.getComponent('connection').positionChanged();
    this.getComponent('solidMesh').positionChanged(x, y, z);
    this.getComponent('mesh').positionChanged(x, y, z);
    this.getComponent('highlighting').positionChanged(x, y, z);
    this.updateOfVisualComponents();
  }

  setHeight(height) {
    this.height = height;

    this.getComponent('collision').sizeChanged(1, height, 1);
    this.getComponent('solidMesh').sizeChanged(1, height, 1);
    this.getComponent('mesh').sizeChanged(1, height, 1);
    this.getComponent('highlighting').sizeChanged(1, height, 1);
    this.updateOfVisualComponents();
  }

  refreshMesh() {
    this.removeFromGlobalGeometry();
    this.addToGlobalGeometry();
  }

  refreshFragment() {
    const color = this.calculateNodeColor();
    this.getComponent('mesh').colorChanged(color.r, color.g, color.b);
  }

  enableFragments(enable) {
    this.getComponent('mesh').stateMachine.changeStateProperty('active', enable);
  }

  removeFromGlobalGeometry() {}

  getWiredSnapshots() {throw new Error('NOT IMPLEMENTED'); }

  setWiredSnapshots() {throw new Error('NOT IMPLEMENTED'); }

  getDimension() {
    return {width: 1, depth: 1};
  }

  disposeStickyNote() {
    this.stickyNote.dispose();
    this.stickyNote = emptyStickyObject;
  }

  dispose() {
    //do that first to get connections deleted. they only dispose
    //themselves if both endpoints are not selected
    if(this.isSelected()) {
      selectedSceneObject.emit(null);
    }

    super.dispose();

    this.removeFromGlobalGeometry();
    this.disposeStickyNote();
  }

  calculateNodeColor() {
    const ok = new THREE.Color(theme.map.colors.default);
    return {r: ok.r, g: ok.g, b: ok.b};
  }

  calculatePower() {
    return 1;
  }
}
