import EmptyScene from 'in-map/sceneObjects/EmptyScene';
import Node from 'in-map/SceneGraph/Node';

export default class EmptySceneNode extends Node {
  constructor(params) {
    super({ InstanceType: EmptyScene, params });
  }
}
