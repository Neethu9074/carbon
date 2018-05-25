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
  function ServiceContent(props) {
    const { node, isRootNode, data, size, expandNodeLeft, expandNodeRight } = props;

    let heatMapColor = props.heatMapColor;
    heatMapColor =
      heatMapColor &&
      `rgba(${(heatMapColor.r * 255) | 0}, ${(heatMapColor.g * 255) | 0}, ${(heatMapColor.b * 255) | 0}, 0.8)`;

    const label = data ? data.label : '';
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
          {getContent(props)}

          <ExpandButton direction="incoming" events$={node.events$} onClick={() => expandNodeLeft(node.id)} />
          <ExpandButton direction="outgoing" events$={node.events$} onClick={() => expandNodeRight(node.id)} />
        </div>
      </Tooltip>
    );
  }
);

function getContent(props) {
  if (props.size === 'mid') {
    return <MediumContent {...props} />;
  }
  return <SmallContent {...props} />;
}
