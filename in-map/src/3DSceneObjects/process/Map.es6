import immutable from 'immutable';

import SingleMeshGlyphPointsFactory from 'in-map/src/SingleMeshFactory/SingleMeshGlyphPointsFactory';
import GraphToProcessViewHandler from 'in-map/src/3DSceneObjects/process/GraphToProcessViewHandler';
import SingleMeshLineFactory from 'in-map/src/SingleMeshFactory/SingleMeshLineFactory';
import SingleMeshFactory from 'in-map/src/SingleMeshFactory/SingleMeshFactory';
import CameraController from 'in-map/src/controls/process/CameraController';
import GroundPlane from 'in-map/src/3DSceneObjects/process/GroundPlane';
import Layouter from 'in-map/src/3DSceneObjects/process/Layouter';
import BaseMap from 'in-map/src/3DSceneObjects/common/Map';
import Node from 'in-map/src/3DSceneObjects/process/Node';
import Edge from 'in-map/src/3DSceneObjects/process/Edge';


export default class Map extends BaseMap {

  constructor({parent}) {
    super({parent, id: 'ProcessMap'});

    this.edges = {};
    this.nodes = {};
    this.layouter = new Layouter(this);
    this.graphToProcessViewAdapter = new GraphToProcessViewHandler(this);
  }

  init() {}

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

  createEdge(id, entity) {
    this.edges[id] = new Edge(entity, this);
  }

  createNode(id) {
    if (this.nodes[id]) {
      return;
    }
    this.nodes[id] = new Node({
      parent: this,
      entity: immutable.fromJS({
        id,
        plugin: 'node'
      })
    });
  }

  createSubNode(id, parentId) {
    if (!this.nodes[parentId]) {
      this.createNode(parentId);
    }
    this.nodes[parentId].addChild(immutable.fromJS({
      id,
      plugin: 'node'
    }));
  }

  removeEdge(id) {
    this.edges[id].dispose();
    delete this.edges[id];
  }

  removeNode(id) {
    this.nodes[id].dispose();
    delete this.nodes[id];
  }

  onZoom() {}

  getAllNodes() {
    const nodes = [];
    Object.keys(this.nodes).forEach(snapshotId => this.getNodes(this.nodes[snapshotId], nodes));
    return nodes;
  }

  getNodes(parent, nodes) {
    nodes.push(parent);
    parent.nodes.forEach(child => this.getNodes(child, nodes));
  }

  applyLayout() {}

  removeChild() {
    // not needed to implement this because nodes and connections are removed in different ways
    // this is done on other place here
  }

  dispose() {
    this.graphToProcessViewAdapter.dispose();

    this.layouter.dispose();
    this.layouter = null;

    Object.keys(this.edges).forEach(id => this.edges[id].dispose());
    this.edges = null;

    super.dispose();

    this.nodes = null;
  }
}
