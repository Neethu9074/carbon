import Connection from 'in-map/sceneObjects/logical/Connection';
import Node from 'in-map/SceneGraph/Node';


export default class ServiceConnectionNode extends Node {

  constructor(params) {
    super({InstanceType: Connection, params});
  }
}
