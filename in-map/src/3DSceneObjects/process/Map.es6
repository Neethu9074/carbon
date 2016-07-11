import immutable from 'immutable';

import ProcessViewRenderTree from 'in-map/src/3DSceneObjects/process/ProcessViewRenderTree/ProcessViewRenderTree';
import SingleMeshGlyphPointsFactory from 'in-map/src/SingleMeshFactory/SingleMeshGlyphPointsFactory';
import SingleMeshDashedLineFactory from 'in-map/src/SingleMeshFactory/SingleMeshDashedLineFactory';
import {init as initPhysicalNodeCallback} from 'in-map/src/stores/process/processNodes';
import {init as initProcessNodeCallback} from 'in-map/src/stores/process/physicalNodes';
import SingleMeshLineFactory from 'in-map/src/SingleMeshFactory/SingleMeshLineFactory';
import SingleMeshFactory from 'in-map/src/SingleMeshFactory/SingleMeshFactory';
import CameraController from 'in-map/src/controls/process/CameraController';
import NodePhysical from 'in-map/src/3DSceneObjects/process/NodePhysical';
import GroundPlane from 'in-map/src/3DSceneObjects/process/GroundPlane';
import EdgeSpawner from 'in-map/src/3DSceneObjects/process/EdgeSpawner';
import NodeCluster from 'in-map/src/3DSceneObjects/process/NodeCluster';
import Layouter from 'in-map/src/3DSceneObjects/process/Layouter';
import {edges$} from 'in-map/src/stores/process/edgesIdsStore';
import BaseMap from 'in-map/src/3DSceneObjects/common/Map';


export default class Map extends BaseMap {

  constructor({parent}) {
    super({parent, id: 'ProcessMap'});

    this.edges = {};
    this.nodes = {};
    this.layouter = new Layouter();

    initProcessNodeCallback(this);
    initPhysicalNodeCallback(this);

    edges$.subscribe(currentEdges => {
      Object.keys(currentEdges).forEach(key => {
        if (!this.edges[key]) {
          this.edges[key] = new EdgeSpawner(currentEdges[key], this);
        }
      });
      Object.keys(this.edges).forEach(key => {
        if (!currentEdges[key]) {
          this.edges[key].dispose();
          delete this.edges[key];
        }
      });
    });

    this.processViewRenderTree = new ProcessViewRenderTree();
  }

  init() {}

  setupFactories() {
    const factories = this.factories;

    factories.transparentSMF = new SingleMeshFactory();
    factories.transparentSMF.material.transparent = true;
    factories.transparentSMF.material.opacity = 0.8;

    factories.solidSMF = new SingleMeshFactory();
    factories.solidSMF.material.transparent = false;

    factories.lineSMF = new SingleMeshLineFactory();

    factories.dashedLineSMF = new SingleMeshDashedLineFactory();

    factories.singleMeshGlyphPointsFactory = new SingleMeshGlyphPointsFactory();
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

  addProcessNode(id) {
    this.nodes[id] = new NodeCluster({
      parent: this,
      entity: immutable.fromJS({
        id
      })
    });
  }

  removeProcessNode(id) {
    this.nodes[id].dispose();
    delete this.nodes[id];
  }

  addPhysicalNode(id) {
    this.nodes[id] = new NodePhysical({
      parent: this,
      entity: immutable.fromJS({
        id
      })
    });
  }

  removePhysicalNode(id) {
    this.nodes[id].dispose();
    delete this.nodes[id];
  }

  onZoomLevel() {
    return this.controller.eventEmitter.on('onZoomLevelChange');
  }

  removeChild() {
    // not needed to implement this because nodes and connections are removed in different ways
    // this is done on other place here
  }

  dispose() {
    this.processViewRenderTree.dispose();

    this.layouter.dispose();
    this.layouter = null;

    Object.keys(this.edges).forEach(id => this.edges[id].dispose());
    this.edges = null;

    super.dispose();

    this.nodes = null;
  }
}
