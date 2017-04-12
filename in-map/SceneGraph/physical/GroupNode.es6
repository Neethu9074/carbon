import HostNode from 'in-map/SceneGraph/physical/HostNode';
import Group from 'in-map/sceneObjects/physical/Group';
import Node from 'in-map/SceneGraph/Node';


export default class GroupNode extends Node {

  constructor(params) {
    super({InstanceType: Group, params});
  }

  update(oldParams, newParams) {
    const includedIds = newParams.includedIds;
    const nodes = newParams.entity.children;

    const filteredNodes = [];
    let filteredNodesIndex = 0;
    for (let i = 0, length = nodes.length; i < length; i++) {
      const node = nodes[i];
      if (includedIds.hostIds[node.id]) {
        filteredNodes[filteredNodesIndex++] = {
          NodeType: HostNode,
          params: {
            id: node.id,
            entity: node,
            group: this.sceneObjectInstance,
            includedIds
          }
        };
      }
    }

    this.updateEntities(filteredNodes);
  }
}
