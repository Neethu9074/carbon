import React from 'react';

import RemainingNodesPlaceholderNode from 'in-components/FlowMap/components/Node/RemainingNodesPlaceholderNode';
import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';

export default function RemainingEndpointsNodePlaceholderNode(props) {
  return (
    <RemainingNodesPlaceholderNode
      {...props}
      onClickCallback={({ serviceLocatorUid, node, loadMore }) => {
        const connectedNode = getServiceLocators(serviceLocatorUid).nodesServiceLocator.getNode(
          node.paginationInformation.connectedNode.id
        );
        if (!connectedNode) {
          return;
        }

        const dummyChild = node.children.values().next().value;
        const connectedChild = connectedNode.findConnectedChild(dummyChild.id);
        if (!connectedChild) {
          return;
        }

        loadMore({
          nodeId: connectedNode.id,
          childId: connectedChild.child.id,
          direction: node.paginationInformation.direction,
          cursor: node.paginationInformation.cursor
        });
      }}
    />
  );
}
