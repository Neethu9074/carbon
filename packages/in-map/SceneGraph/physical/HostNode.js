import { combineLatest } from '@instana/observables';

import LayerPlaceHolder from 'in-map/SceneGraph/physical/LayerPlaceholderNode';
import HostMetricNode from 'in-map/SceneGraph/physical/HostMetricNode';
import NodeSceneObject from 'in-map/sceneObjects/physical/Node';
import LayerNode from 'in-map/SceneGraph/physical/LayerNode';
import { emptyArray } from 'in-services/fixedObjects';
import { eventBus } from 'in-map/services/eventBus';
import { activeMetric$ } from 'in-stores/metric';
import Node from 'in-map/SceneGraph/Node';

const MAX_ZOOM_LEVEL = 300;

export default class HostNode extends Node {
  constructor(params) {
    super({ InstanceType: NodeSceneObject, params });

    this.metricNode = null;

    const activeMetricAndVisibilityChangedCallback = this.activeMetricAndVisibilityChanged.bind(this);

    this.addSubscriptions([
      combineLatest([
        activeMetric$,
        eventBus.on('zoomLevelChanged'),
        this.sceneObjectInstance.eventEmitter.on('isVisibleChanged' + this.sceneObjectInstance.id).distinct(),
        this.sceneObjectInstance.eventEmitter.on('isHighlighted'),
        this.sceneObjectInstance.eventEmitter.on('updateSignal')
      ])
        .debounce(100)
        .subscribe(activeMetricAndVisibilityChangedCallback)
    ]);
  }

  activeMetricAndVisibilityChanged([activeMetric, zoomLevel, isVisible, isHighlighted]) {
    if (!isHighlighted && (activeMetric || !isVisible)) {
      // clear current layer
      this.updateEntities(emptyArray);
      // if the user zoomed out to much we want to show a layer placeholder to indicate that the host has some inventory.
      // But only, if the host is not highlighted or even metrics are actice
    } else if (zoomLevel > MAX_ZOOM_LEVEL && !isHighlighted && !activeMetric) {
      this.addLayerPlaceholder();
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
            node: this.sceneObjectInstance,
            metadata: layer.metadata
          }
        };
      }
    }

    this.updateEntities(filteredLayer);
  }

  addLayerPlaceholder() {
    const includedIds = this.includedIds;
    const layers = this.entity.children;
    let hasEntities = false;

    for (let i = 0, length = layers.length; i < length; i++) {
      const layer = layers[i];
      if (includedIds.layerIds[layer.id]) {
        hasEntities = true;
        break;
      }
    }

    if (hasEntities) {
      this.updateEntities([
        {
          NodeType: LayerPlaceHolder,
          params: {
            id: 'abc123',
            defaultColor: '#dddddd',
            node: this.sceneObjectInstance
          }
        }
      ]);
    } else {
      this.updateEntities(emptyArray);
    }
  }

  update(oldParams, newParams) {
    this.includedIds = newParams.includedIds;
    this.entity = newParams.entity;

    this.sceneObjectInstance.eventEmitter.emit('updateSignal', true);
  }

  disposeMetricNode() {
    if (this.metricNode) {
      this.metricNode.dispose();
      this.metricNode = null;
    }
  }

  dispose() {
    this.disposeMetricNode();

    super.dispose();
  }
}
