import ProcessViewRenderTree from 'in-map/src/3DSceneObjects/process/ProcessViewRenderTree/ProcessViewRenderTree';
import FadeByDistanceSingleMeshFactory from 'in-map/src/SingleMeshFactory/FadeByDistanceSingleMeshFactory';
import SingleMeshGlyphPointsFactory from 'in-map/src/SingleMeshFactory/SingleMeshGlyphPointsFactory';
import SingleMeshDashedLineFactory from 'in-map/src/SingleMeshFactory/SingleMeshDashedLineFactory';
import NodeUnknownExitService from 'in-map/src/3DSceneObjects/process/NodeUnknownExitService';
import SingleMeshLineFactory from 'in-map/src/SingleMeshFactory/SingleMeshLineFactory';
import NodeUnknownService from 'in-map/src/3DSceneObjects/process/NodeUnknownService';
import {selectEntity, clearSelection} from 'in-map/src/stores/multiSelection';
import CameraController from 'in-map/src/controls/process/CameraController';
import {selectedSnapshotIdForHighlightingInMap} from 'in-map/src/mapStores';
import NodePhysical from 'in-map/src/3DSceneObjects/process/NodePhysical';
import GroundPlane from 'in-map/src/3DSceneObjects/process/GroundPlane';
import EdgeSpawner from 'in-map/src/3DSceneObjects/process/EdgeSpawner';
import NodeCluster from 'in-map/src/3DSceneObjects/process/NodeCluster';
import {edges, nodes} from 'in-map/src/stores/process/entitiesStores';
import Layouter from 'in-map/src/3DSceneObjects/process/Layouter';
import {focusEntityId$} from 'in-map/src/stores/focusEntity';
import {nodes$} from 'in-map/src/stores/process/nodesStore';
import BaseMap from 'in-map/src/3DSceneObjects/common/Map';
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
          if (entity.type === 'process') {
            const id = entity.entity.get('id');
            if (id.startsWith('unknown-service')) {
              if (entity.entity.get('outgoingConnections') === 0 &&
                  entity.entity.get('incomingConnections') !== 0) {
                    return new NodeUnknownExitService(params);
              }
              return new NodeUnknownService(params);
            }
            return new NodeCluster(params);
          }
          return new NodePhysical(params);
        });
        this.disposeOld(this.nodes, currentNodes);
      }),

      eventBus.on('openDashboard').subscribe(id => {
        if (id) {
          goToDashboard(id);

          // clear stream
          eventBus.emit('openDashboard', null);
        }
      }),

      focusEntityId$.skipFirst().subscribe(id => {
        // if there is no entity defined, center map
        if (!id) {
          this.centerMap();
        }
      }),

      eventBus.on('flyToEntity').subscribe(entity => this.controller.flyToObject(entity)),

      selectedSnapshotIdForHighlightingInMap.subscribe(id => id ?
        this.factories.fadeByDistanceSMF.lockOpacity(0.25) :
        this.factories.fadeByDistanceSMF.unlockOpacity()
      ),

      this.eventEmitter.on('onObjectClicked').subscribe(hittenOnes =>
        hittenOnes.hittenObject ?
          selectEntity(hittenOnes.hittenObject.parentSceneObject.id) :
          clearSelection()
      )
    ]);

    this.processViewRenderTree = new ProcessViewRenderTree();
  }

  init() {}

  setupFactories() {
    const factories = this.factories;

    factories.lineSMF = new SingleMeshLineFactory();

    factories.dashedLineSMF = new SingleMeshDashedLineFactory();

    factories.singleMeshGlyphPointsFactory = new SingleMeshGlyphPointsFactory();

    const fadeFactoryConfig = {
      renderOrder: 2,
      params: {
        minOpacity: 0.1,
        maxOpacity: 0.8
      }
    };
    factories.solidSMF = new FadeByDistanceSingleMeshFactory(fadeFactoryConfig);

    factories.fadeByDistanceSMF = new FadeByDistanceSingleMeshFactory(fadeFactoryConfig);
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

  centerMap() {
    // calculate the middle of the process view
    let minX = Number.MAX_VALUE;
    let minZ = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxZ = Number.MIN_VALUE;
    nodes$.once(currentNodes => {
      Object.keys(currentNodes).forEach(key => {
        const node = currentNodes[key];
        const pos = node.getComponent('position').getPosition();
        minX = Math.min(minX, pos.x);
        minZ = Math.min(minZ, pos.z);
        maxX = Math.max(maxX, pos.x);
        maxZ = Math.max(maxZ, pos.z);
      });
    });
    this.controller.flyToPosition(minX + (maxX - minX) / 2, minZ + (maxZ - minZ) / 2);
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
