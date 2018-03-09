import React from 'react';

import EndpointsServiceWrapper from 'in-components/FlowMap/components/Node/EndpointsServiceWrapper';
import MediumContent from 'in-components/FlowMap/components/Node/MediumContent';
import Children from 'in-components/FlowMap/components/Node/Children';
import Tooltip from 'in-components/Tooltip';
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
        <Tooltip content={<ServiceInformationTooltip node={node} serviceLocatorUid={serviceLocatorUid} />}>
          <EndpointsServiceWrapper data={data} serviceLocatorUid={serviceLocatorUid} />
        </Tooltip>

        <Children childList={childList} />
      </div>
    );
  }
);

const ServiceInformationTooltip = connectTo(
  props => ({
    data: props.node.events$.on('data'),
    metrics: props.node.events$.on('metricValues')
  }),
  function ServiceInformationTooltip({ data, metrics, serviceLocatorUid }) {
    return (
      <div className={locals.tooltipContent}>
        <MediumContent metrics={metrics} data={data} serviceLocatorUid={serviceLocatorUid} />
      </div>
    );
  }
);
