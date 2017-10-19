import { combineLatest } from 'reactive-observables';

import HostConnectionNode from 'in-map/SceneGraph/physical/HostConnectionNode';
import ConnectionHandlerNode from 'in-map/SceneGraph/ConnectionHandlerNode';
import HostMetricNode from 'in-map/SceneGraph/physical/HostMetricNode';
import NodeSceneObject from 'in-map/sceneObjects/physical/Node';
import LayerNode from 'in-map/SceneGraph/physical/LayerNode';
import { nodes } from 'in-map/stores/physical/nodesStore';
import { emptyArray } from 'in-services/fixedObjects';
import { eventBus } from 'in-map/services/eventBus';
import { activeMetric$ } from 'in-stores/metric';
import Node from 'in-map/SceneGraph/Node';

const MAX_ZOOM_LEVEL = 300;

export default class HostNode extends Node {
  constructor(params) {
    super({ InstanceType: NodeSceneObject, params });

    this.connectionNode = new ConnectionHandlerNode({
      params: {
        id: `connectionNodeFor${params.id}`
      },
      connectionNodeType: HostConnectionNode
    });

    this.metricNode = null;

    const highlightingChangedCallback = this.highlightingChanged.bind(this);
    const activeMetricAndVisibilityChangedCallback = this.activeMetricAndVisibilityChanged.bind(this);

    this.addSubscriptions([
      combineLatest([this.sceneObjectInstance.eventEmitter.on('isHighlighted').distinct(), nodes.stream]).subscribe(
        highlightingChangedCallback
      ),
      combineLatest([
        activeMetric$,
        eventBus.on('zoomLevelChanged'),
        this.sceneObjectInstance.eventEmitter.on('isVisibleChanged' + this.sceneObjectInstance.id).distinct(),
        this.sceneObjectInstance.eventEmitter.on('updateSignal')
      ])
        .debounce(100)
        .subscribe(activeMetricAndVisibilityChangedCallback)
    ]);
  }

  highlightingChanged([isHighlighted, _nodes]) {
    isHighlighted ? this.connectionNode.createConnections(this.entity, _nodes) : this.connectionNode.clearConnections();
  }

  activeMetricAndVisibilityChanged([activeMetric, zoomLevel, isVisible]) {
    if (activeMetric || !isVisible || zoomLevel > MAX_ZOOM_LEVEL) {
      // clear current layer
      this.updateEntities(emptyArray);
    } else {
      if (!activeMetric) {
        this.addLayer();
      }
    }
    if (activeMetric) {
      if (!this.metricNode) {
        this.metricNode = new HostMetricNode({
          id: `${this.params.id}_metric`,
          dashboardId: this.params.id,
          node: this.sceneObjectInstance
        });
      }
    } else {
      this.disposeMetricNode();
    }
  }

  addLayer() {
    const includedIds = this.includedIds;
    const layers = this.entity.children;

    const filteredLayer = [];
    let filteredLayerIndex = 0;
    for (let i = 0, length = layers.length; i < length; i++) {
      const layer = layers[i];
      if (includedIds.layerIds[layer.id]) {
        filteredLayer[filteredLayerIndex++] = {
          NodeType: LayerNode,
          params: {
            id: layer.id,
            entity: layer,
            node: this.sceneObjectInstance
          }
        };
      }
    }

    this.updateEntities(filteredLayer);
  }

  update(oldParams, newParams) {
    this.includedIds = newParams.includedIds;
    this.entity = newParams.entity;

    this.sceneObjectInstance.eventEmitter.emit('updateSignal', true);
    // // don't create layer if there are metrics shown. Layer are auto added after disabling maps metrics,
    // // so there is no need to handle this case here
    // if (!this.metricNode) {
    //   this.addLayer();
    // }
  }

  disposeMetricNode() {
    if (this.metricNode) {
      this.metricNode.dispose();
      this.metricNode = null;
    }
  }

  disposeConnectionNode() {
    if (this.connectionNode) {
      this.connectionNode.dispose();
      this.connectionNode = null;
    }
  }

  dispose() {
    this.disposeConnectionNode();
    this.disposeMetricNode();

    super.dispose();
  }
}
