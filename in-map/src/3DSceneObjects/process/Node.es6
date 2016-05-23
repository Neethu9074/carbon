import THREE from 'three';

import StickyNote from 'in-map/src/2DSceneObjects/stickyNotes/process/Cluster';
import TooltipNode from 'in-map/src/2DSceneObjects/tooltips/process/Node';
import {getColorPool} from 'in-services/util/ColorGenerator';
import eventBus from 'in-map/eventbus';

import ConnectionsHandlerComponent from 'in-map/src/components/process/ConnectionsHandlerComponent';
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

    this.nodes = [];
    this.children = [];
    this.isExpanded = false;

    this.tooltip = new TooltipNode(this);
    this.label = new Label({
      id: this.id,
      parent: this,
      iconSize: 3
    });

    this.addSubscription(this.eventEmitter.on('positionChanged').subscribe(this.positionChanged.bind(this)));
  }

  onHighlightEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.getComponent('connectionsHandler').startAnimation();
  }

  onHighlightLeave() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.getComponent('connectionsHandler').stopAnimation();
  }

  onSelectedEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.getComponent('connectionsHandler').startAnimation();
  }

  onSelectedLeave() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.getComponent('connectionsHandler').stopAnimation();
  }

  onSelectedHighlightEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.getComponent('connectionsHandler').startAnimation();
  }

  onSelectedHighlightLeave() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.getComponent('connectionsHandler').stopAnimation();
  }


  initComponents() {
    super.initComponents();

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
      factory: this.scene.solidSMF
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
      factory: this.scene.solidSMF
    });
    components.topMesh.sizeChanged({x: 0.9, y: 0.9, z: 0.9});

    components.connectionsHandler = new ConnectionsHandlerComponent({sceneObject});
    components.connectionsHandler.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onSnapshotUpdated(snapshot) {
    this.components.mesh.colorChanged(getColorPool('processes').getColorRGB(snapshot.get('plugin')));
  }

  getTooltip() {
    return this.tooltip;
  }

  expand() {
    const nodeEntityMap = {};

    this.children.forEach(entity => {
      const newNode = new Node({
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

  positionChanged({newPosition}) {
    this.label.getComponent('position').setPosition(newPosition.x - 0.5, newPosition.y + 0.5, newPosition.z + 0.5);
    super.setScreenPositionAnchor(newPosition.x + 0.5, newPosition.y + 0.3, newPosition.z);
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

    try {
      this.tooltip.unMount();
      this.tooltip.dispose();
    } catch (er) {
      // the tooltip is already unmounted
      this.tooltip = null;
    }

    this.nodes = null;
    this.children = null;
    this.isExpanded = null;
  }
}
