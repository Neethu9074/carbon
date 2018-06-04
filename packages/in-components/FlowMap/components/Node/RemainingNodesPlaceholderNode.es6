import React from 'react';

import ScreenPositionWrapper from 'in-components/FlowMap/components/Node/ScreenPositionWrapper';
import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import Button from 'in-new-components/Button';

import locals from './RemainingNodesPlaceholderNode.mless';

export default function RemainingNodesPlaceholderNode(props) {
  const onClickCallback = props.onClickCallback || defaultOnClick;
  const numRemainingNodes = props.node.paginationInformation.numRemainingNodes;

  return (
    <ScreenPositionWrapper {...props}>
      <div className={locals.wrapper}>
        <Button
          kind="action"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onClickCallback(props);
          }}
        >
          Load {numRemainingNodes} more node{numRemainingNodes > 1 ? 's' : ''}
        </Button>
      </div>
    </ScreenPositionWrapper>
  );
}

function defaultOnClick({ serviceLocatorUid, node, loadMore }) {
  const connectedNode = getServiceLocators(serviceLocatorUid).nodesServiceLocator.getNode(
    node.paginationInformation.connectedNode.id
  );
  if (!connectedNode) {
    return;
  }

  loadMore({
    nodeId: connectedNode.id,
    direction: node.paginationInformation.direction,
    cursor: node.paginationInformation.cursor
  });
}
