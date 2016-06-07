import SingleMeshGlyphPointsFactory from 'in-map/src/SingleMeshFactory/SingleMeshGlyphPointsFactory';
import SingleMeshLineFactory from 'in-map/src/SingleMeshFactory/SingleMeshLineFactory';
import SingleMeshFactory from 'in-map/src/SingleMeshFactory/SingleMeshFactory';
import CameraController from 'in-map/src/controls/process/CameraController';
import GroundPlane from 'in-map/src/3DSceneObjects/process/GroundPlane';
import Layouter from 'in-map/src/3DSceneObjects/process/Layouter';
import BaseMap from 'in-map/src/3DSceneObjects/common/Map';
import Node from 'in-map/src/3DSceneObjects/process/Node';
import {find} from 'in-services/arrayUtils';


export default class Map extends BaseMap {

  constructor({parent}) {
    super({parent, id: 'ProcessMap'});

    this.layouter = new Layouter();
  }

  init() {
    this.nodes = [];
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

  onZoom() {}

  addEntity(entity) {
    // if the entity is no cluster and does not have any connections, noone wants to see it on the process map
    if (entity.get('children').size === 0 &&
        entity.get('outgoingConnections').size === 0 &&
        entity.get('incomingConnections').size === 0) {
      return;
    }

    const entityId = entity.get('id');
    let match = find(this.nodes, n => n.id === entityId);

    if (!match) {
      match = new Node({parent: this, entity});
      this.nodes.push(match);
    }
  }

  getAllNodes() {
    const nodes = [];
    this.nodes.forEach(child => this.getNodes(child, nodes));
    return nodes;
  }

  getNodes(parent, nodes) {
    nodes.push(parent);
    parent.nodes.forEach(child => this.getNodes(child, nodes));
  }

  applyLayout() {
    // refresh all connections before layouting!
    this.getAllNodes().forEach(node => node.getComponent('connectionsHandler').checkForUpdate());

    this.layouter.applyLayout(this);
  }

  removeChild() {}

  dispose() {
    super.dispose();

    this.layouter = null;
  }
}
