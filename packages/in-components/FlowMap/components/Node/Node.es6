import React from 'react';

import ScreenPositionWrapper from 'in-components/FlowMap/components/Node/ScreenPositionWrapper';
import EndpointContent from 'in-components/FlowMap/components/Node/EndpointContent';
import ServiceContent from 'in-components/FlowMap/components/Node/ServiceContent';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    childList: props.node.events$.on('children')
  }),
  function Node(props) {
    const { childList } = props;
    return (
      <ScreenPositionWrapper {...props}>
        {childList ? <EndpointContent childList={childList} {...props} /> : <ServiceContent {...props} />}
      </ScreenPositionWrapper>
    );
  }
);
