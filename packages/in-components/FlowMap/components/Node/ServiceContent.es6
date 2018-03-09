import React from 'react';

import MediumContent from 'in-components/FlowMap/components/Node/MediumContent';
import ExpandButton from 'in-components/FlowMap/components/Node/ExpandButton';
import SmallContent from 'in-components/FlowMap/components/Node/SmallContent';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

import locals from './ServiceContent.mless';
import nodeLocals from './Node.mless';

export default connectTo(
  props => ({
    data: props.node.events$.on('data'),
    metrics: props.node.events$.on('metricValues'),
    heatMapColor: props.node.events$.on('heatMapColor')
  }),
  function ServiceContent({ node, isRootNode, metrics, data, size, serviceLocatorUid, heatMapColor }) {
    const label = data ? data.label : '';

    heatMapColor =
      heatMapColor &&
      `rgba(${(heatMapColor.r * 255) | 0}, ${(heatMapColor.g * 255) | 0}, ${(heatMapColor.b * 255) | 0}, 0.8)`;

    return (
      <Tooltip content={size !== 'mid' ? label : null}>
        <div
          style={{
            border: heatMapColor && `1px solid ${heatMapColor}`,
            boxShadow: heatMapColor && `0px 0px 0.875rem 0px ${heatMapColor}`,
            background: heatMapColor
          }}
          className={locals[size]}
        >
          {isRootNode && <div className={nodeLocals.rootLabel}>In Focus</div>}
          {getContent(metrics, data, size, serviceLocatorUid)}

          <ExpandButton direction="incoming" events$={node.events$} onClick={() => node.expandLeft()} />
          <ExpandButton direction="outgoing" events$={node.events$} onClick={() => node.expandRight()} />
        </div>
      </Tooltip>
    );
  }
);

function getContent(metrics, data, size, serviceLocatorUid) {
  if (size === 'mid') {
    return <MediumContent metrics={metrics} data={data} serviceLocatorUid={serviceLocatorUid} />;
  }
  return <SmallContent data={data} />;
}
