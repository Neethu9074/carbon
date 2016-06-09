import THREE from 'three';

import {
  voteUp,
  voteDown,
  addNode,
  removeNode
} from 'in-map/src/3DSceneObjects/process/processViewStores';
import StickyNote from 'in-map/src/2DSceneObjects/stickyNotes/process/Cluster';
import TooltipNode from 'in-map/src/2DSceneObjects/tooltips/process/Node';
import {getColorPool} from 'in-services/util/ColorGenerator';
import eventBus from 'in-map/eventbus';

import HighlightingComponent from 'in-map/src/components/process/HighlightingComponent';
import CollisionComponent from 'in-map/src/components/common/CollisionObjectComponent';
import TopMeshComponent from 'in-map/src/components/process/TopMeshComponent';
import MeshComponent from 'in-map/src/components/common/MeshComponent';

import CMCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import CPCP from 'in-map/src/SingleMeshFactory/ContentProvider/CylinderPlaneContentProvider';
import CCP from 'in-map/src/SingleMeshFactory/ContentProvider/CylinderContentProvider';

import {cubeGeometry, defaultGeometryMaterial} from 'in-map/src/3DSceneObjects/common/geometries';
import SceneObjectWithSnapshot from 'in-map/src/3DSceneObjects/common/SceneObjectWithSnapshot';
import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';
import Label from 'in-map/src/3DSceneObjects/process/Label';


export default class Node extends SceneObjectWithSnapshot {

  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});

    this.isExpanded = false;
    this.edgeCount = 0;

    this.tooltip = new TooltipNode(this);
    this.label = new Label({
      id: this.id,
      parent: this,
      iconSize: 2
    });

    this.addSubscription(this.eventEmitter.on('positionChanged').subscribe(this.positionChanged.bind(this)));

    addNode(this);
  }

  onHighlightEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onHighlightLeave() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onSelectedEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onSelectedLeave() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onSelectedHighlightEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onSelectedHighlightLeave() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }


  initComponents() {
    super.initComponents();

    const factory = this.getFactory('solidSMF');
    const components = this.components;
    const sceneObject = this;

    // add the mesh component to handle visual representation of the entity
    components.mesh = new MeshComponent({
      sceneObject,
      contentProvider: new CMCM({
        contentProvider: new PCM({
          contentProvider: new SCM({
            contentProvider: new CCP()
          })
        })
      }),
      factory
    });

    // add the collision component to handle the collision box
    components.collision = new CollisionComponent({
      sceneObject,
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      layer: 2
    });

    components.highlight = new HighlightingComponent({sceneObject: this});

    // the topping of the cylinder
    components.topMesh = new TopMeshComponent({
      sceneObject,
      contentProvider: new CMCM({
        contentProvider: new PCM({
          contentProvider: new SCM({
            contentProvider: new CPCP()
          })
        })
      }),
      factory
    });
    components.topMesh.sizeChanged({x: 0.9, y: 0.9, z: 0.9});
  }

  onSnapshotUpdated(snapshot) {
    this.components.mesh.colorChanged(getColorPool('processes').getColorRGB(snapshot.get('plugin')));
  }

  increaseEdgeCount() {
    this.edgeCount++;
  }

  decreaseEdgeCount() {
    this.edgeCount--;
  }

  getEdgeCount() {
    return this.edgeCount;
  }

  getTooltip() {
    return this.tooltip;
  }

  expand() {
    Object.keys(this.childIds).forEach(id => voteUp(id));
  }

  collapse() {
    Object.keys(this.childIds).forEach(id => voteDown(id));
  }

  setChildIds(childIds) {
    this.childIds = childIds;
    const numChildren = Object.keys(childIds).length;
    if (numChildren === 0) {
      return;
    }

    if (!this.stickyNote) {
      this.stickyNote = new StickyNote(this);
      this.addSubscription(eventBus.on('endUpdate').subscribe(() => this.update()));
    }
    this.stickyNote.setNumChildren(numChildren);

    // TODO: if expanded, add to scene
  }

  positionChanged(newPosition) {
    this.label.getComponent('position').setPosition(newPosition.x - 0.5, newPosition.y + 0.5, newPosition.z + 0.5);
    super.setScreenPositionAnchor(newPosition.x + 0.25, newPosition.y + 0.3, newPosition.z);
  }

  update() {
    this.updateScreenPosition();

    if (this.isInView()) {
      this.stickyNote.update();
    } else {
      this.stickyNote.hide();
    }
  }

  dispose() {
    removeNode(this);

    super.dispose();

    this.label.dispose();
    this.label = null;

    if (this.stickyNote) {
      this.stickyNote.dispose();
      this.stickyNote = null;
    }

    try {
      this.tooltip.unMount();
      this.tooltip.dispose();
    } catch (er) {
      // the tooltip is already unmounted
      this.tooltip = null;
    }

    this.children = null;
    this.isExpanded = null;
  }
}
