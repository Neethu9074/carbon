import React from 'react';

import ScreenPositionWrapper from 'in-components/FlowMap/components/Node/ScreenPositionWrapper';
import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import Button from 'in-new-components/Button';

import locals from './RemainingNodesPlaceholderNode.mless';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    paginationInformation: props.node.events$.on('paginationInformation')
  }),
  function RemainingNodesPlaceholderNode(props) {
    const onClickCallback = props.onClickCallback || defaultOnClick;
    const numRemainingNodes = props.paginationInformation.numRemainingNodes;

    return (
      <ScreenPositionWrapper {...props}>
        <div className={locals.wrapper}>
          <Button
            kind="action"
            size="compact"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onClickCallback(props);
            }}
          >
            Load {numRemainingNodes} more
          </Button>
        </div>
      </ScreenPositionWrapper>
    );
  }
);

function defaultOnClick({ serviceLocatorUid, paginationInformation, loadMore }) {
  const connectedNode = getServiceLocators(serviceLocatorUid).nodesServiceLocator.getNode(
    paginationInformation.connectedNode.id
  );
  if (!connectedNode) {
    return;
  }

  loadMore({
    nodeId: connectedNode.id,
    direction: paginationInformation.direction,
    cursor: paginationInformation.cursor
  });
}
