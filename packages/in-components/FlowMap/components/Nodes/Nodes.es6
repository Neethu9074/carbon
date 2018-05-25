import React from 'react';

import RemainingNodesPlaceholderNode from 'in-components/FlowMap/components/Node/RemainingNodesPlaceholderNode';
import RemainingNodesPlaceholderClass from 'in-components/FlowMap/sceneObjects/RemainingNodesPlaceholder';
import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import { DISTANCE_BETWEEN_NODES_X } from 'in-components/FlowMap/misc/layouting/config';
import Node from 'in-components/FlowMap/components/Node/Node';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    nodes: getServiceLocators(props.serviceLocatorUid)
      .nodesServiceLocator.getNodes()
      .stream.throttle(100),
    rootNodeId: getServiceLocators(props.serviceLocatorUid).eventBusServiceLocator.on('rootNodeId'),
    applicationContext: getServiceLocators(props.serviceLocatorUid).eventBusServiceLocator.on('applicationContext'),
    nodesSize: getServiceLocators(props.serviceLocatorUid)
      .eventBusServiceLocator.on('worldUnits')
      .map(({ pixelsPer3DUnit }) => {
        const columnGapSizeInPx = pixelsPer3DUnit * DISTANCE_BETWEEN_NODES_X;
        if (columnGapSizeInPx < 170) {
          return 'sm';
        }
        return 'mid';
      })
      .distinct()
  }),
  function Nodes(props) {
    const { nodes, nodesSize, rootNodeId, applicationContext } = props;
    if (!nodes || !nodes.size === 0) {
      return null;
    }

    const nodeSceneObjects = nodes.values();
    const nodesArray = [];
    for (const node of nodeSceneObjects) {
      nodesArray.push(node);
    }

    return nodesArray.map(node => {
      const isRemainingNodePlaceholder = node instanceof RemainingNodesPlaceholderClass;
      if (isRemainingNodePlaceholder) {
        return <RemainingNodesPlaceholderNode key={node.id} node={node} size={nodesSize} {...props} />;
      }
      return (
        <Node
          key={node.id}
          node={node}
          size={nodesSize}
          isRootNode={node.id === rootNodeId}
          isOutofAppContext={applicationContext && node.applicationId != applicationContext}
          {...props}
        />
      );
    });
  }
);
