import React from 'react';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import Node from 'in-applications/ApplicationMap/components/Node/Node';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ serviceLocatorUid }) => ({
    nodes: getServiceLocators(serviceLocatorUid)
      .nodesServiceLocator.getNodes()
      .stream.debounce(100)
      .map(nodes => {
        if (!nodes || !nodes.size === 0) {
          return null;
        }

        const nodeSceneObjects = nodes.values();
        const nodesArray = [];
        let arrayIndex = 0;
        for (const node of nodeSceneObjects) {
          nodesArray[arrayIndex++] = node;
        }
        return nodesArray;
      }),
    nodesSize: getServiceLocators(serviceLocatorUid)
      .eventBusServiceLocator.on(SIGNALS.WORLD_UNITS)
      .map(({ targetNodeSizeInRelationToInitSize }) => {
        if (targetNodeSizeInRelationToInitSize < 1) {
          return 'sm';
        }
        return 'mid';
      })
      .distinct()
  }),
  props => <Nodes {...props} />
);

class Nodes extends React.Component {
  static displayName = 'Nodes';

  preventRendering = false;

  UNSAFE_componentWillUpdate(nextProps) {
    this.preventRendering = this.props.applicationId !== nextProps.applicationId;
  }

  render() {
    const { nodes, nodesSize } = this.props;
    if (!nodes || this.preventRendering) {
      return null;
    }

    return nodes.map(node => <Node key={node.id} node={node} size={nodesSize} {...this.props} />);
  }
}
