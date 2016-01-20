import THREE from 'three';

import * as highlightedSnapshot from 'in-services/stores/highlightedSnapshot';

import HighlightingComponent from '../../../components/HighlightingComponents/Ground';
import CollisionComponent from '../../../components/CollisionObjectComponent';
import MeshComponent from '../../../components/MeshComponent';

import {cubeGeometry, defaultGeometryMaterial} from '../../geometries';
import SceneObjectWithSnapshot from '../../SceneObjectWithSnapshot';
import {PROPERTY_VALUES} from '../../../StateMachine/StateMachine';

import CMCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import CCP from '../../../SingleMeshFactory/ContentProvider/CylinderContentProvider';

export default class Node extends SceneObjectWithSnapshot {

  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});

    this.outgoingConnections = [];
    this.incomingConnections = [];
    this.nodes = [];
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


  initComponents() {
    super.initComponents();

    const components = this.components;

    // add the mesh component to handle visual representation of the node
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
    this.getComponent('mesh').colorChanged(Math.random(), Math.random(), Math.random());

    // add the collision component to handle the collision box
    components.collision = new CollisionComponent({
      sceneObject: this,
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      layer: 2
    });

    components.highlighting = new HighlightingComponent({sceneObject: this});
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
    this.getComponent('collision').positionChanged(x, y, z);
    this.getComponent('highlighting').positionChanged(x, y, z);
  }

  dispose() {
    super.dispose();
  }
}
