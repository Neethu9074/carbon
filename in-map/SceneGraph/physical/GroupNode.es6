import HostNode from 'in-map/SceneGraph/physical/HostNode';
import Group from 'in-map/sceneObjects/physical/Group';
import Node from 'in-map/SceneGraph/Node';

export default class GroupNode extends Node {
  constructor(params) {
    super({ InstanceType: Group, params });
  }

  update(params) {
    const includedIds = params.includedIds;
    const entity = params.entity;

    this.updateEntities(
      entity.children.filter(entity => includedIds.hostIds[entity.id]).map(entity => {
        return {
          NodeType: HostNode,
          params: {
            id: entity.id,
            entity,
            group: this.sceneObjectInstance,
            includedIds
          }
        };
      })
    );
  }
}
