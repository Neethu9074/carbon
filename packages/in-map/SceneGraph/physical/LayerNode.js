/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import Layer from 'in-map/sceneObjects/physical/Layer';
import Node from 'in-map/SceneGraph/Node';

export default class LayerNode extends Node {
  constructor(params) {
    super({ InstanceType: Layer, params });
  }
}
