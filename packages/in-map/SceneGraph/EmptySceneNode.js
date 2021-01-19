/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import EmptyScene from 'in-map/sceneObjects/EmptyScene';
import Node from 'in-map/SceneGraph/Node';

export default class EmptySceneNode extends Node {
  constructor(params) {
    super({ InstanceType: EmptyScene, params });
  }
}
