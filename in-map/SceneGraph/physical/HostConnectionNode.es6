import Connection from 'in-map/sceneObjects/physical/Connection';
import Node from 'in-map/SceneGraph/Node';


export default class HostConnectionNode extends Node {

  constructor(params) {
    super({InstanceType: Connection, params});
  }
}
