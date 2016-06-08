import immutable from 'immutable';

import SingleMeshGlyphPointsFactory from 'in-map/src/SingleMeshFactory/SingleMeshGlyphPointsFactory';
import SingleMeshLineFactory from 'in-map/src/SingleMeshFactory/SingleMeshLineFactory';
import SingleMeshFactory from 'in-map/src/SingleMeshFactory/SingleMeshFactory';
import CameraController from 'in-map/src/controls/process/CameraController';
import GroundPlane from 'in-map/src/3DSceneObjects/process/GroundPlane';
import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import Connection from 'in-map/src/3DSceneObjects/process/Connection';
import Layouter from 'in-map/src/3DSceneObjects/process/Layouter';
import BaseMap from 'in-map/src/3DSceneObjects/common/Map';
import Node from 'in-map/src/3DSceneObjects/process/Node';
import {viewStructure} from 'in-stores/view';


export default class Map extends BaseMap {

  constructor({parent}) {
    super({parent, id: 'ProcessMap'});

    this.layouter = new Layouter();
  }

  init() {
    // maps node id => node instance
    this.nodes = {};

    // maps edge id => edge instance
    this.connections = {};
  }

  registerEvents() {
    super.registerEvents();

    this.addSubscription(viewStructure.subscribe(structures => this.onInventoryUpdate(structures)));
  }

  setupFactories() {
    const factories = this.factories;
    const scene = this.parent;

    factories.solidSMF = new SingleMeshFactory({scene});
    factories.solidSMF.material.transparent = false;
    factories.solidSMF.material.opacity = 0.3;

    factories.lineSMF = new SingleMeshLineFactory({scene});

    factories.singleMeshGlyphPointsFactory = new SingleMeshGlyphPointsFactory({scene});
  }

  getGroundPlane() {
    return new GroundPlane({
      parent: this,
      size: this.size
    });
  }

  getController(canvas) {
    return new CameraController({
      canvas,
      scene: this.scene,
      camera: this.camera
    });
  }

  onInventoryUpdate(edges) {
    this.processEdgeModifications(edges);
  }

  processEdgeModifications(edgeModifications) {
    // maps node id => node instance used to remove unused nodes from the graph
    const modifiedNodes = {};

    edgeModifications.forEach(edgeModification => {
      const edgeId = edgeModification.get('id');
      const fromNode = this.getOrCreateNode(edgeModification.get('from'));
      modifiedNodes[fromNode.id] = fromNode;
      const toNode = this.getOrCreateNode(edgeModification.get('to'));
      modifiedNodes[toNode.id] = toNode;

      if (edgeModification.get('type') === 'add') {
        // nothing to do, we already know about this edge
        if (this.connections[edgeId]) {
          return;
        }

        this.connections[edgeId] = new Connection({
          parent: this,
          entity: immutable.fromJS({
            id: edgeId,
            plugin: 'connection'
          }),
          sourceNode: fromNode,
          destinationNode: toNode,
          direction: DIRECTIONS.OUT
        });

        fromNode.increaseEdgeCount();
        toNode.increaseEdgeCount();
      } else {
        const edge = this.connections[edgeId];

        // nothing to do, we never knew about this edge
        if (!edge) {
          return;
        }

        this.connections[edgeId] = undefined;
        edge.dispose();

        fromNode.decreaseEdgeCount();
        toNode.decreaseEdgeCount();
      }
    });

    this.removeUnusedNodes();
    this.layoutNeedsUpdate();
  }

  removeUnusedNodes() {
    Object.keys(this.nodes).forEach(snapshotId => {
      const node = this.nodes[snapshotId];

      if (node.getEdgeCount() === 0) {
        this.nodes[snapshotId] = undefined;
        node.dispose();
      }
    });
  }

  getOrCreateNode(snapshotId) {
    let existingNode = this.nodes[snapshotId];
    if (existingNode) {
      return existingNode;
    }

    existingNode = this.nodes[snapshotId] = new Node({
      parent: this, entity: immutable.fromJS({
        id: snapshotId,
        plugin: 'node'
      })
    });
    return existingNode;
  }

  onZoom() {}

  forEachConnection(callback) {
    return Object.keys(this.connections).forEach(id => callback(this.connections[id]));
  }

  getAllNodes() {
    const nodes = [];
    Object.keys(this.nodes).forEach(snapshotId => this.getNodes(this.nodes[snapshotId], nodes));
    return nodes;
  }

  getNodes(parent, nodes) {
    nodes.push(parent);
    parent.nodes.forEach(child => this.getNodes(child, nodes));
  }

  applyLayout() {
    this.layouter.applyLayout(this);
  }

  removeChild() {
    // not needed to implement this because nodes and connections are removed in different ways
    // this is done on other place here
  }

  dispose() {
    super.dispose();

    this.forEachConnection(connection => connection.dispose());
    this.connections = null;

    this.layouter = null;
    this.nodes = null;
  }
}
