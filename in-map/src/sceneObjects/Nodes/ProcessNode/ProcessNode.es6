import THREE from 'three';

import {getColorPool} from 'in-services/util/ColorGenerator';
import eventBus from 'in-services/eventbus';

import ProcessConnectionsHandlerComponent from
  '../../../components/ConnectionsHandlerComponents/ProcessConnectionsHandlerComponent';
import HighlightingComponent from '../../../components/HighlightingComponents/ProcessGround';
import CollisionComponent from '../../../components/CollisionObjectComponent';
import MeshComponent from '../../../components/MeshComponent';

import {PROPERTIES, PROPERTY_VALUES} from '../../../StateMachine/StateMachine';
import {cubeGeometry, defaultGeometryMaterial} from '../../geometries';
import SceneObjectWithSnapshot from '../../SceneObjectWithSnapshot';
import ColouredPluginLabel from '../../Label/ColouredPluginLabel';
import StickyNote from '../../../StickyNotes/ProcessCluster';

import CMCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import CPCP from '../../../SingleMeshFactory/ContentProvider/CylinderPlaneContentProvider';
import CCP from '../../../SingleMeshFactory/ContentProvider/CylinderContentProvider';


export default class ProcessNode extends SceneObjectWithSnapshot {

  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});

    this.nodes = [];
    this.children = [];
    this.isExpanded = false;

    this.label = new ColouredPluginLabel({
      id: this.id,
      parent: this,
      iconSize: 3
    });
  }

  onHighlightEnter() {
    this.getComponent('highlighting').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.getComponent('connectionsHandler').startAnimation();
  }

  onHighlightLeave() {
    this.getComponent('highlighting').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.getComponent('connectionsHandler').stopAnimation();
  }

  onSelectedEnter() {
    this.getComponent('highlighting').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.getComponent('connectionsHandler').startAnimation();
  }

  onSelectedLeave() {
    this.getComponent('highlighting').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.getComponent('connectionsHandler').stopAnimation();
  }

  onSelectedHighlightEnter() {
    this.getComponent('highlighting').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.getComponent('connectionsHandler').startAnimation();
  }

  onSelectedHighlightLeave() {
    this.getComponent('highlighting').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.getComponent('connectionsHandler').stopAnimation();
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
    components.connectionsHandler.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onSnapshotUpdated(snapshot) {
    const color = getColorPool('processes').getColorRGB(snapshot.get('plugin'));
    this.components.mesh.colorChanged(color.r, color.g, color.b);
  }

  expand() {
    const nodeEntityMap = {};

    this.children.forEach(entity => {
      const newNode = new ProcessNode({
        parent: this,
        entity
      });
      this.nodes.push(newNode);

      // store the nodes in a temp map to get access to the entity object later
      // entity is immutable so use it as key
      nodeEntityMap[entity.get('id')] = {
        sceneNode: newNode,
        entity
      };
    });

    // first create all nodes after that the connections!
    Object.keys(nodeEntityMap).forEach((id) => {
      const entity = nodeEntityMap[id].entity;
      const sceneNode = nodeEntityMap[id].sceneNode;

      sceneNode.setChildren(entity.get('children'));
      const connectionsHandler = sceneNode.getComponent('connectionsHandler');
      connectionsHandler.setOutgoingConnections(entity.get('outgoingConnections'));
      connectionsHandler.setIncomingConnections(entity.get('incomingConnections'));
    });

    this.layoutNeedsUpdate();
  }

  collapse() {
    this.nodes.forEach(node => node.dispose());
    this.nodes = [];

    this.layoutNeedsUpdate();
  }

  layoutNeedsUpdate() {
    this.parent.layoutNeedsUpdate();
  }

  setChildren(entities) {
    this.children = entities;

    if (entities.size > 0) {
      if (!this.stickyNote) {
        this.stickyNote = new StickyNote(this);
        this.addSubscription(eventBus.on('endUpdate').subscribe(() => this.update()));
      }
      this.stickyNote.setNumChildren(entities.size);
    }


    // TODO: if expanded, add to scene
  }

  positionChanged(x, y, z) {
     // avoid z fighting, so use height + 0.01
    this.getComponent('topMesh').positionChanged(x, y + 0.51, z);
    this.getComponent('mesh').positionChanged(x, y, z);
    this.getComponent('collision').positionChanged(x, y, z);
    this.getComponent('highlighting').positionChanged(x, y, z);
    this.label.getComponent('position').setPosition(x - 0.5, y + 0.5, z + 0.5);

    super.setScreenPositionAnchor(x + 0.5, y + 0.3, z);
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
    super.dispose();

    this.label.dispose();
    this.label = null;

    if (this.stickyNote) {
      this.stickyNote.dispose();
      this.stickyNote = null;
    }

    this.nodes = null;
    this.children = null;
    this.isExpanded = null;
  }
}
