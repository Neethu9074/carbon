import THREE from 'three';

import {theme} from 'in-services/theme';
import eventBus from 'in-services/eventbus';
import {activeMetric} from 'in-services/stores/metrics';

import HighlightingComponent from '../../../components/HighlightingComponent';
import CollisionComponent from '../../../components/CollisionObjectComponent';
import ConnectionComponent from '../../../components/ConnectionComponent';
import MeshComponent from '../../../components/MeshComponent';

import {selectedSceneObject, currentTooltip} from '../../../stores/mapStore';
import {cubeGeometry, defaultGeometryMaterial} from '../../geometries';
import SceneObject from '../../SceneObject/index';

import CMCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import CCP from '../../../SingleMeshFactory/ContentProvider/CubeContentProvider';


//if unavailable, the StickyNote-Metric / Layer will not be undefined but this
//to avoid all these if(available) {do something} stuff
const emptyStickyObject = {
  isEmpty: true,
  hide() {}, show() {}, update() {}, updateWorldPos() {}, render() {},
  dispose() {}, setInactive() {}, switchToMetric() {}, switchToIcon() {}
};

export default class BaseNode extends SceneObject {

  constructor({parent, snapshot}) {
    super({parent, id: snapshot.get('id')});

    this.scene = this.scene;
    this.snapshot = snapshot;
    this.height = 1;

    this.tooltip = this.getTooltipSticky();
    this.stickyNote = emptyStickyObject;

    this.registerEvents();
  }

  onHighlightEnter() {
    this.highlight();

    //show all connections as grey lines
    this.getComponent('connection').highlightChanged(true);
  }

  onHighlightLeave() {
    this.highlight(false);

    //hide the grey connection lines
    this.getComponent('connection').highlightChanged(false);
  }

  onSelectedEnter() {
    this.highlight();

    //show all connections as white lines
    this.getComponent('connection').selectionChanged(true);
  }

  onSelectedLeave() {
    this.highlight(false);

    //hide the white connection lines
    this.getComponent('connection').selectionChanged(false);
  }

  onSelectedHighlightEnter() {
    this.highlight();

    //show all connections as white lines
    this.getComponent('connection').selectionChanged(true);
  }

  onSelectedHighlightLeave() {
    this.highlight(false);

    //hide the white connection lines
    this.getComponent('connection').selectionChanged(false);
  }

  onHiddenEnter() {
    //disables all components
    super.onHiddenEnter();

    this.stickyNote.hide();
  }

  onHiddenLeave() {
    //enables all components
    super.onHiddenLeave();

    this.highlight(false);

    this.stickyNote.show();
  }

  onIndirectHighlightEnter() {
    this.highlight();
  }

  onIndirectHighlightLeave() {
    this.highlight(false);
  }

  onInactiveEnter() {
    super.onInactiveEnter();

    this.getComponent('mesh').stateMachine.changeStateProperty('active', true);
  }

  onInactiveLeave() {
    super.onInactiveLeave();

    this.highlight(false);
  }

  onSelectedHighlightInactiveEnter() {}
  onSelectedHighlightInactiveLeave() {}
  onHighlightInactiveEnter() {}
  onHighlightInactiveLeave() {}


  highlight(solid=true) {
    this.getComponent('solidMesh').stateMachine.changeStateProperty('active', solid);
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', solid);
  }


  initComponents() {
    super.initComponents();

    const id = this.id;
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
      id: id + '_mesh',
      sceneObject: this,
      contentProvider: new CMCM({contentProvider: pcm}),
      factory: this.scene.singleMeshFactory
    });
    const color = this.calculateNodeColor();
    this.getComponent('mesh').colorChanged(color.r, color.g, color.b);

    //add the solidMesh component to handle the solid fill color of a node
    components.solidMesh = new MeshComponent({
      id: id + '_solidMesh',
      sceneObject: this,
      contentProvider: new CMCM({contentProvider: pcm}),
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

    this.addSubscription(eventBus.on('layoutChanged').subscribe(() => {
      if(this.isSelected()) {
        const connectionComponent = this.getComponent('connection');
        connectionComponent.selectionChanged(false);
        connectionComponent.setupConnections();
        connectionComponent.selectionChanged(true);
      }
    }));

    this.addSubscription(activeMetric.subscribe(metric => {
      this.onActiveMetric(metric);
    }));

    this.addSubscription(selectedSceneObject.subscribe(event => {
      if(event) {
        this.onSceneObjectSelected(event.sceneObject);
      }
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

  update() {
    this.updateScreenPosition();
  }

  getTooltipSticky() {return emptyStickyObject; }

  onSnapshotUpdate() {throw new Error('NOT IMPLEMENTED'); }

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

  getWiredSnapshots() {throw new Error('NOT IMPLEMENTED'); }

  setWiredSnapshots() {throw new Error('NOT IMPLEMENTED'); }

  dispose() {
    // do that first to get connections deleted. they only dispose
    // themselves if both endpoints are not selected
    if(this.isSelected()) {
      selectedSceneObject.emit({sceneObject: null});
    }

    // dispose subscriptions so that no update fires anymore
    super.dispose();

    this.stickyNote.dispose();
    this.stickyNote = null;

    try {
      this.tooltip.unMount();
    } catch(er) {
      // the tooltip is already unmounted
      this.tooltip = null;
    }

    this.snapshot = null;
  }

  calculateNodeColor() {
    const ok = new THREE.Color(theme.map.colors.default);
    return {r: ok.r, g: ok.g, b: ok.b};
  }

  calculatePower() {
    return 1;
  }
}
