import { combineLatest } from 'reactive-observables';

import HostConnectionNode from 'in-map/SceneGraph/physical/HostConnectionNode';
import ConnectionHandlerNode from 'in-map/SceneGraph/ConnectionHandlerNode';
import HostMetricNode from 'in-map/SceneGraph/physical/HostMetricNode';
import NodeSceneObject from 'in-map/sceneObjects/physical/Node';
import LayerNode from 'in-map/SceneGraph/physical/LayerNode';
import { nodes } from 'in-map/stores/physical/nodesStore';
import { activeMetric$ } from 'in-stores/metric';
import Node from 'in-map/SceneGraph/Node';

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

    this.addSubscriptions([
      combineLatest([this.sceneObjectInstance.eventEmitter.on('isHighlighted').distinct(), nodes.stream]).subscribe(
        ([isHighlighted, _nodes]) =>
          isHighlighted
            ? this.connectionNode.createConnections(this.entity, _nodes)
            : this.connectionNode.clearConnections()
      ),
      activeMetric$.subscribe(activeMetric => {
        if (activeMetric) {
          // clear current layer
          this.updateEntities([]);

          if (!this.metricNode) {
            this.metricNode = new HostMetricNode({
              id: `${params.id}_metric`,
              dashboardId: params.id,
              node: this.sceneObjectInstance
            });
          }
        } else {
          this.disposeMetricNode();
          this.addLayer();
        }
      })
    ]);
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
    this.addLayer();
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
