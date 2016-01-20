import THREE from 'three';

import * as highlightedSnapshot from 'in-services/stores/highlightedSnapshot';

import HighlightingComponent from '../../../components/HighlightingComponents/ProcessGround';
import CollisionComponent from '../../../components/CollisionObjectComponent';
import MeshComponent from '../../../components/MeshComponent';

import {cubeGeometry, defaultGeometryMaterial} from '../../geometries';
import SceneObjectWithSnapshot from '../../SceneObjectWithSnapshot';
import {PROPERTY_VALUES} from '../../../StateMachine/StateMachine';
import Label from '../../Label';

import CMCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import CPCP from '../../../SingleMeshFactory/ContentProvider/CylinderPlaneContentProvider';
import CCP from '../../../SingleMeshFactory/ContentProvider/CylinderContentProvider';

export default class Node extends SceneObjectWithSnapshot {

  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});

    this.outgoingConnections = [];
    this.incomingConnections = [];
    this.nodes = [];

    this.label = new Label({
      id: this.id,
      parent: this,
      iconSize: 3,
      color: this.color,
      predicate: () => false
    });
  }

  onHighlightEnter() {
    highlightedSnapshot.setHighlightedEntityId(this.id);
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
  }

  onHighlightLeave() {
    highlightedSnapshot.clearHighlightedEntityId();
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onSelectedHighlightEnter() {
    highlightedSnapshot.setHighlightedEntityId(this.id);
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
  }

  onSelectedHighlightLeave() {
    highlightedSnapshot.clearHighlightedEntityId();
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }


  init() {
    this.color = { r: Math.random(), g: Math.random(), b: Math.random() };
    this.components.mesh.colorChanged(this.color.r, this.color.g, this.color.b);
  }

  initComponents() {
    super.initComponents();

    const components = this.components;

    // add the mesh component to handle visual representation of the entity
    components.mesh = new MeshComponent({
      sceneObject: this,
      contentProvider: new CMCM({
        contentProvider: new PCM({
          contentProvider: new SCM({
            contentProvider: new CCP()
          })
        })
      }),
      factory: this.scene.solidSingleMeshFactory
    });

    // add the collision component to handle the collision box
    components.collision = new CollisionComponent({
      sceneObject: this,
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      layer: 2
    });

    components.highlighting = new HighlightingComponent({sceneObject: this});

    // the topping of the cylinder
    components.topMesh = new MeshComponent({
      sceneObject: this,
      contentProvider: new CMCM({
        contentProvider: new PCM({
          contentProvider: new SCM({
            contentProvider: new CPCP()
          })
        })
      }),
      factory: this.scene.solidSingleMeshFactory
    });
    components.topMesh.sizeChanged(0.9, 0.9, 0.9);
  }

  onSnapshotUpdated() {}

  setChildren(entities) {
    console.log('children', entities.size);
  }

  setOutgoingConnections(outgoingConnections) {
    console.log('out', outgoingConnections.size);
    this.outgoingConnections = outgoingConnections;
  }

  getOutgoingConnections() {
    return this.outgoingConnections;
  }

  setIncomingConnections(incomingConnections) {
    console.log('in', incomingConnections.size);
    this.incomingConnections = incomingConnections;
  }

  getIncomingConnections() {
    return this.incomingConnections;
  }


  positionChanged(x, y, z) {
    this.getComponent('mesh').positionChanged(x, y, z);
     // avoid z fighting, so use height + 0.01
    this.getComponent('topMesh').positionChanged(x, y + 0.51, z);
    this.getComponent('collision').positionChanged(x, y, z);
    this.getComponent('highlighting').positionChanged(x, y, z);
    this.label.getComponent('position').setPosition(x - 0.1, y + 0.05, z);
  }

  dispose() {
    super.dispose();

    this.label.dispose();
    this.label = null;
  }
}
