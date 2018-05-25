import React from 'react';

import ScreenPositionWrapper from 'in-components/FlowMap/components/Node/ScreenPositionWrapper';
import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

import locals from './RemainingNodesPlaceholderNode.mless';

export default connectTo(
  props => ({
    data: props.node.events$.on('data')
  }),
  function RemainingNodesPlaceholderNode(props) {
    const { data } = props;

    return (
      <ScreenPositionWrapper {...props}>
        <div className={locals.wrapper}>
          {data.paginationInformation.numRemainingNodes} more nodes
          <Button
            kind="action"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              const connected = getServiceLocators(props.serviceLocatorUid).nodesServiceLocator.findConnected(
                props.node.id
              );
              if (connected) {
                props.loadMore(connected.node.id, connected.direction, props.data.paginationInformation.cursor);
              }
            }}
          >
            Load More
          </Button>
        </div>
      </ScreenPositionWrapper>
    );
  }
);
