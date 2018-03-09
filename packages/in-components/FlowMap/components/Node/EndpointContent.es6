import React from 'react';

import EndpointsServiceWrapper from 'in-components/FlowMap/components/Node/EndpointsServiceWrapper';
import Children from 'in-components/FlowMap/components/Node/Children';
import connectTo from 'in-hoc/connectTo';

import locals from './EndpointContent.mless';
import nodeLocals from './Node.mless';

export default connectTo(
  props => ({
    data: props.node.events$.on('data')
  }),
  function EndpointContent({ node, isRootNode, data, serviceLocatorUid, childList }) {
    return (
      <div className={locals.children}>
        {isRootNode && <div className={nodeLocals.rootLabel}>In Focus</div>}
        <EndpointsServiceWrapper node={node} data={data} serviceLocatorUid={serviceLocatorUid} />
        <Children childList={childList} />
      </div>
    );
  }
);
