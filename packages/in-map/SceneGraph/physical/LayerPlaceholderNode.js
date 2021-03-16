/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import LayerPlaceHolder from 'in-map/sceneObjects/physical/LayerPlaceHolder';
import Node from 'in-map/SceneGraph/Node';

export default class LayerPlaceholderNode extends Node {
  constructor(params) {
    super({ InstanceType: LayerPlaceHolder, params });
  }
}
