import React from 'react';

import { DISTANCE_BETWEEN_NODES_X } from 'in-components/FlowMap/misc/flowLayouting/flowLayouter';
import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import Node from 'in-components/FlowMap/components/Node/Node';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    nodes: getServiceLocators(props.serviceLocatorUid).nodesServiceLocator.getNodes().stream,
    nodesSize: getServiceLocators(props.serviceLocatorUid)
      .eventBusServiceLocator.on('worldUnits')
      .map(({ pixelsPer3DUnit }) => {
        const columnGapSizeInPx = pixelsPer3DUnit * DISTANCE_BETWEEN_NODES_X;
        if (columnGapSizeInPx < 200) {
          return 'sm';
        } else if (columnGapSizeInPx < 300) {
          return 'mid';
        }
        return 'lg';
      })
      .distinct()
  }),
  function Nodes({ nodes, nodesSize }) {
    if (!nodes || !nodes.size === 0) {
      return null;
    }

    const nodeSceneObjects = nodes.values();
    const nodesArray = [];
    for (const node of nodeSceneObjects) {
      nodesArray.push(node);
    }

    return nodesArray.map(node => <Node key={node.id} node={node} size={nodesSize} />);
  }
);
