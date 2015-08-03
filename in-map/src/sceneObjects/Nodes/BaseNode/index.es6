'use strict';

import THREE from 'three';

//components
import CollisionComponent from '../../../components/CollisionObjectComponent';
import ConnectionComponent from '../../../components/ConnectionComponent';

import {theme} from 'in-services/theme';
import eventBus from 'in-services/eventbus';
import {getIdString} from 'in-services/util/snapshots';
import {selectedSceneObject, currentTooltip} from '../../../stores/mapStore';
import {activeMetric} from 'in-services/stores/metrics';


import SceneObject from '../../SceneObject/index';
import Highlight from '../NodeHighlight';
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

  onHighlightEnter() {
    this.getComponent('connection').highlightChanged(true);

    this.setHighlight();
  }

  onHighlightLeave() {
    this.getComponent('connection').highlightChanged(false);

    this.clearHighlight();
  }

  onSelectedEnter() {this.selected(); }

  onSelectedLeave() {this.unSelected(); }

  onHiddenEnter() {
    super.onHiddenEnter();

    this.enableFragments(false);

    this.removeFromGlobalGeometry();
    this.stickyNote.hide();
    this.highlighting.hide();
  }

  onHiddenLeave() {
    super.onHiddenLeave();

    this.enableFragments(true);

    this.addToGlobalGeometry();
    this.stickyNote.show();
    this.highlighting.show();
  }


  selected() {
    this.getComponent('connection').selectionChanged(true);

    this.setHighlight();
    this.makeSolidGeometry();
  }

  unSelected() {
    this.getComponent('connection').selectionChanged(false);

    this.clearHighlight();
    this.makeSolidGeometry(false);
  }

  initComponents() {
    super.initComponents();
    this.components.collision = new CollisionComponent({
      sceneObject: this,
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      layer: 2
    });
    this.components.connection = new ConnectionComponent({sceneObject: this});
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
    this.changeStateProperty('active', isActive);
  }

  onSceneObjectSelected(obj) {
    const isThisSelected = (obj && obj.id === this.id) ?
      true : false;

    this.changeStateProperty('selected', isThisSelected);
  }

  render() {
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

    this.refreshMesh();
    this.refreshFragment();

    this.updateSolidGeometry();

    this.highlighting.refresh();
  }

  updateSolidGeometry() {
    if(this.isSelected() || this.getComponent('connection').isConnectedToSelected()) {
      this.makeSolidGeometry(true);
    }
  }

  positionChanged(x, y, z) {
    this.getComponent('collision').positionChanged(x, y, z);
    this.getComponent('connection').positionChanged();
    this.updateOfVisualComponents();
  }

  setHeight(height) {
    this.height = height;

    this.getComponent('collision').sizeChanged(1, height, 1);
    this.updateOfVisualComponents();
  }

  refreshMesh() {
    this.removeFromGlobalGeometry();
    this.addToGlobalGeometry();
  }

  refreshFragment() {
    const position = this.getComponent('position').getPosition();
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

  getDimension() {
    return {width: 1, depth: 1};
  }

  disposeStickyNote() {
    this.stickyNote.dispose();
    this.stickyNote = emptyStickyObject;
  }

  dispose() {
    super.dispose();

    this.removeFromGlobalGeometry();

    this.highlighting.dispose();

    this.disposeStickyNote();

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
