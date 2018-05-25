import React from 'react';

import { EndpointLink } from 'in-components/FlowMap/components/Node/EntityLinks';
import ExpandButton from 'in-components/FlowMap/components/Node/ExpandButton';
import MetricList from 'in-components/FlowMap/components/Node/MetricList';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

import locals from './Children.mless';

export default function Children({ childList, expandChildLeft, expandChildRight }) {
  if (!childList || childList.size === 0) {
    return null;
  }

  const childrenAsArray = [];
  const items = childList.values();
  for (const child of items) {
    childrenAsArray.push(child);
  }

  return (
    <ul className={locals.children}>
      {childrenAsArray.map(child => (
        <Child key={child.id} child={child} expandChildLeft={expandChildLeft} expandChildRight={expandChildRight} />
      ))}
    </ul>
  );
}

const Child = connectTo(
  props => ({
    data: props.child.events$.on('data'),
    metrics: props.child.events$.on('metricValues'),
    heatMapColor: props.child.events$.on('heatMapColor')
  }),
  function Child({ child, data, metrics, heatMapColor, expandChildLeft, expandChildRight }) {
    if (!data) {
      return null;
    }

    heatMapColor =
      heatMapColor &&
      `rgba(${(heatMapColor.r * 255) | 0}, ${(heatMapColor.g * 255) | 0}, ${(heatMapColor.b * 255) | 0}, 0.8)`;

    return (
      <Tooltip content={data.label}>
        <li
          style={{
            border: heatMapColor && `1px solid ${heatMapColor}`,
            boxShadow: heatMapColor && `0px 0px 0.5rem 0px ${heatMapColor}`,
            background: heatMapColor
          }}
          className={locals.child}
        >
          <EndpointLink
            className={locals.entityLink}
            serviceId={child.parentNode.__originalId}
            endpointId={data.id}
            applicationId={child.parentNode.applicationId}
          >
            {data.label || '--'}
          </EndpointLink>
          <MetricList className={locals.metrics} metrics={metrics} />

          <ExpandButton
            direction="incoming"
            events$={child.events$}
            onClick={() => expandChildLeft(child.parentNode.id, child.id)}
          />
          <ExpandButton
            direction="outgoing"
            events$={child.events$}
            onClick={() => expandChildRight(child.parentNode.id, child.id)}
          />
        </li>
      </Tooltip>
    );
  }
);
