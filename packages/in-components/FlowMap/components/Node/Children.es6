import React from 'react';

import VerticalTypesIndicator from 'in-components/FlowMap/components/Node/VerticalTypesIndicator';
import { EndpointLink } from 'in-components/FlowMap/components/Node/EntityLinks';
import connectTo from 'in-hoc/connectTo';

import locals from './Children.mless';

export default function Children({ childList }) {
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
        <li key={child.id}>
          <Child child={child} />
        </li>
      ))}
    </ul>
  );
}

const Child = connectTo(
  props => ({
    data: props.child.events$.on('data')
  }),
  function Child({ child, data }) {
    if (!data) {
      return null;
    }
    return (
      <div className={locals.child}>
        <VerticalTypesIndicator type={data.type} />
        <EndpointLink className={locals.entityLink} serviceId={child.nodeOriginalId} endpointId={data.id}>
          {data.label}
        </EndpointLink>
      </div>
    );
  }
);
