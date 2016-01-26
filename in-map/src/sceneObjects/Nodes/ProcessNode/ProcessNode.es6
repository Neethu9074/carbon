import THREE from 'three';

import {getColorPool} from 'in-services/util/ColorGenerator';

import ProcessConnectionsHandlerComponent from
  '../../../components/ConnectionsHandlerComponents/ProcessConnectionsHandlerComponent';
import HighlightingComponent from '../../../components/HighlightingComponents/ProcessGround';
import CollisionComponent from '../../../components/CollisionObjectComponent';
import MeshComponent from '../../../components/MeshComponent';

import {cubeGeometry, defaultGeometryMaterial} from '../../geometries';
import SceneObjectWithSnapshot from '../../SceneObjectWithSnapshot';
import {PROPERTY_VALUES} from '../../../StateMachine/StateMachine';
import ColouredPluginLabel from '../../Label/ColouredPluginLabel';

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

    this.label = new ColouredPluginLabel({
      id: this.id,
      parent: this,
      iconSize: 3,
      predicate: () => false
    });
  }

  onHighlightEnter() {
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
  }

  onHighlightLeave() {
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onSelectedHighlightEnter() {
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
  }

  onSelectedHighlightLeave() {
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
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

    components.connectionsHandler = new ProcessConnectionsHandlerComponent({sceneObject: this});
  }

  onSnapshotUpdated(snapshot) {
    const color = getColorPool('processes').getColorRGB(snapshot.get('plugin'));
    this.components.mesh.colorChanged(color.r, color.g, color.b);
  }

  setChildren() {}

  setOutgoingConnections(outgoingConnections) {
    this.outgoingConnections = outgoingConnections;
  }

  getOutgoingConnections() {
    return this.outgoingConnections;
  }

  setIncomingConnections(incomingConnections) {
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
    this.label.getComponent('position').setPosition(x - 0.5, y + 0.5, z + 0.5);
  }

  dispose() {
    super.dispose();

    this.label.dispose();
    this.label = null;
  }
}
