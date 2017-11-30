import NodeMetric from 'in-map/sceneObjects/physical/NodeMetric';
import Node from 'in-map/SceneGraph/Node';

export default class HostMetricNode extends Node {
  constructor(params) {
    super({ InstanceType: NodeMetric, params });
  }
}
