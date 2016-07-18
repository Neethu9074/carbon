import ProcessViewRenderTree from 'in-map/src/3DSceneObjects/process/ProcessViewRenderTree/ProcessViewRenderTree';
import FadeByDistanceSingleMeshFactory from 'in-map/src/SingleMeshFactory/FadeByDistanceSingleMeshFactory';
import SingleMeshGlyphPointsFactory from 'in-map/src/SingleMeshFactory/SingleMeshGlyphPointsFactory';
import SingleMeshDashedLineFactory from 'in-map/src/SingleMeshFactory/SingleMeshDashedLineFactory';
import SingleMeshLineFactory from 'in-map/src/SingleMeshFactory/SingleMeshLineFactory';
import SingleMeshFactory from 'in-map/src/SingleMeshFactory/SingleMeshFactory';
import CameraController from 'in-map/src/controls/process/CameraController';
import NodePhysical from 'in-map/src/3DSceneObjects/process/NodePhysical';
import GroundPlane from 'in-map/src/3DSceneObjects/process/GroundPlane';
import EdgeSpawner from 'in-map/src/3DSceneObjects/process/EdgeSpawner';
import NodeCluster from 'in-map/src/3DSceneObjects/process/NodeCluster';
import {edges, nodes} from 'in-map/src/stores/process/entitiesStores';
import Layouter from 'in-map/src/3DSceneObjects/process/Layouter';
import BaseMap from 'in-map/src/3DSceneObjects/common/Map';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import {eventBus} from 'in-map/src/services/eventBus';
import {goToDashboard} from 'in-stores/navigation';


export default class Map extends BaseMap {

  constructor({parent}) {
    super({parent, id: 'ProcessMap'});

    this.edges = {};
    this.nodes = {};
    this.layouter = new Layouter();

    this.addSubscriptions([
      edges.entities$.subscribe(currentEdges => {
        this.ifNew(this.edges, currentEdges, entity => new EdgeSpawner(entity, this));
        this.disposeOld(this.edges, currentEdges);
      }),

      nodes.entities$.subscribe(currentNodes => {
        this.ifNew(this.nodes, currentNodes, entity => {
          const params = {
            parent: this,
            entity: entity.entity
          };
          return entity.type === 'process' ? new NodeCluster(params) : new NodePhysical(params);
        });
        this.disposeOld(this.nodes, currentNodes);
      }),

      eventBus.on('openDashboard').subscribe(id => {
        if (id) {
          setSelectedSnapshotId(id);
          goToDashboard();

          // clear stream
          eventBus.emit('openDashboard', null);
        }
      })
    ]);

    this.processViewRenderTree = new ProcessViewRenderTree();
  }

  init() {}

  setupFactories() {
    const factories = this.factories;

    factories.solidSMF = new SingleMeshFactory();
    factories.solidSMF.material.transparent = false;

    factories.lineSMF = new SingleMeshLineFactory();

    factories.dashedLineSMF = new SingleMeshDashedLineFactory();

    factories.singleMeshGlyphPointsFactory = new SingleMeshGlyphPointsFactory();

    factories.fadeByDistanceSMF = new FadeByDistanceSingleMeshFactory({
      renderOrder: 2,
      params: {
        minOpacity: 0.1,
        maxOpacity: 0.8
      }
    });
  }

  ifNew(oldMap, newMap, ifNewCallback) {
    Object.keys(newMap).forEach(key => {
      if (!oldMap[key]) {
        oldMap[key] = ifNewCallback(newMap[key]);
      }
    });
  }

  disposeOld(oldMap, newMap) {
    Object.keys(oldMap).forEach(key => {
      if (!newMap[key]) {
        oldMap[key].dispose();
        delete oldMap[key];
      }
    });
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

  onZoomLevel() {
    return this.controller.eventEmitter.on('onZoomLevelChange');
  }

  removeChild() {
    // not needed to implement this because nodes and connections are removed in different ways
    // this is done on other place here
  }

  dispose() {
    this.processViewRenderTree.dispose();
    edges.clear();
    nodes.clear();

    this.layouter.dispose();
    this.layouter = null;

    super.dispose();

    this.nodes = null;
    this.edges = null;
  }
}
