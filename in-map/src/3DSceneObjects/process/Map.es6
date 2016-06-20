import SingleMeshGlyphPointsFactory from 'in-map/src/SingleMeshFactory/SingleMeshGlyphPointsFactory';
import GraphToProcessViewHandler from 'in-map/src/3DSceneObjects/process/GraphToProcessViewHandler';
import SingleMeshLineFactory from 'in-map/src/SingleMeshFactory/SingleMeshLineFactory';
import SingleMeshFactory from 'in-map/src/SingleMeshFactory/SingleMeshFactory';
import CameraController from 'in-map/src/controls/process/CameraController';
import GroundPlane from 'in-map/src/3DSceneObjects/process/GroundPlane';
import EdgeSpawner from 'in-map/src/3DSceneObjects/process/EdgeSpawner';
import NodeSpawner from 'in-map/src/3DSceneObjects/process/NodeSpawner';
import Layouter from 'in-map/src/3DSceneObjects/process/Layouter';
import BaseMap from 'in-map/src/3DSceneObjects/common/Map';


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

    factories.transparentSMF = new SingleMeshFactory({scene});
    factories.transparentSMF.material.transparent = true;
    factories.transparentSMF.material.opacity = 0.8;

    factories.solidSMF = new SingleMeshFactory({scene});
    factories.solidSMF.material.transparent = false;

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
      camera: this.camera,
      map: this
    });
  }

  createEdge(id, entity) {
    this.edges[id] = new EdgeSpawner(entity, this);
  }

  createNode(id) {
    if (this.nodes[id]) {
      return this.nodes[id];
    }
    const newNode = new NodeSpawner(id, this);
    this.nodes[id] = newNode;
    return newNode;
  }

  createSubNode(id, parentIds) {
    this.nodes[id] = new NodeSpawner(id, this, parentIds);
    parentIds.forEach(parentId => this.createNode(parentId).addChild(id));
  }

  removeEdge(id) {
    this.edges[id].dispose();
    delete this.edges[id];
  }

  removeNode(id) {
    this.nodes[id].dispose();
    delete this.nodes[id];
  }

  getAllNodes() {
    return Object.keys(this.nodes).map(snapshotId => this.nodes[snapshotId]);
  }

  onZoomLevel() {
    return this.controller.eventEmitter.on('onZoomLevelChange');
  }

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
