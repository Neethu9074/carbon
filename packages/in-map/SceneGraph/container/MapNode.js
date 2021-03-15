/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getViewStructure } from 'in-map/stores/physical/viewStructureStore';
import GroupNode from 'in-map/SceneGraph/physical/GroupNode';
import Map from 'in-map/sceneObjects/physical/Map';
import Node from 'in-map/SceneGraph/Node';

export default class MapNode extends Node {
  constructor(params) {
    super({ InstanceType: Map, params });

    this.addSubscription(
      getViewStructure().subscribe(structure => {
        const includedIds = structure.includedIds;
        const groups = structure.viewStructure.children;

        this.updateEntities(
          groups
            .filter(entity => includedIds.groupIds[entity.id])
            .map(entity => {
              return {
                NodeType: GroupNode,
                params: {
                  id: entity.id,
                  entity,
                  includedIds
                }
              };
            })
        );
      })
    );
  }
}
