import React from 'react';

import RemainingNodesPlaceholderNode from 'in-applications/FlowMap/components/Node/RemainingNodesPlaceholderNode';
import { getServiceLocators } from 'in-applications/FlowMap/serviceLocator/serviceLocator';

export default function RemainingEndpointsNodePlaceholderNode(props) {
  return (
    <RemainingNodesPlaceholderNode
      {...props}
      onClickCallback={({ serviceLocatorUid, node, paginationInformation, loadMore }) => {
        const connectedNode = getServiceLocators(serviceLocatorUid).nodesServiceLocator.getNode(
          paginationInformation.connectedNode.id
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
          direction: paginationInformation.direction,
          cursor: paginationInformation.cursor
        });
      }}
    />
  );
}
